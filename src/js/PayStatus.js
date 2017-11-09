import Vue from "../lib/vue/vue.min.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/PayStatus.scss"
import axios from "axios"
import Youlike from "../components/Youlike.vue"
import global from "../lib/global.js"
import loadmores from "../components/loadMore.vue"
import 'mint-ui/lib/style.css'

var userid = global.getUserid(),
    token = global.getToken();
var order = global.getQueryString("orderList") ? global.getQueryString("orderList") : ""


new Vue({
    el: "#app",
    components: {
        Youlike, loadmores
    },
    data: {
        text: "支付成功",
        bottomStatus: "",
        bottomtext: false,
        pageindex: 1
    },
    created: function () {
        this.setRightTop()
    },
    methods: {
        loadup: function () {//上拉加载
            this.pageindex += 1 //改变分页数传递给子组件
        },

        GoIndex: function () {
            var data = JSON.stringify({
                url: global.path + "/page/Index.html"
            })
            location.href = "boogoo.app://?pushcode=100002&data=" + data
        },
        GoOrder: function () {
            /**
             * 当order存在多个时，跳转到订单分类页
             * 当order为一个时，跳转到订单详情
             */
            if (order.split(",").length == 1) {
                var data = JSON.stringify({
                    url: global.path + "/page/Orderdetail.html?orderid=" + order
                })
                location.href = "boogoo.app://?pushcode=100002&data=" + data
            } else {
                location.href = "boogoo.app://?pushcode=100008"
            }

        },
        setRightTop: function () {
            /**
             * 通过缓存获取数据
             * uid ：主播id
             * videoid：录播id
             * higheruserid：用户id
             * 只有在entertype=3(录播) 需要传videoid
             */
            var option = JSON.parse(localStorage.getItem("share"))
            
            if (option.entertype == 3) {
                var data = JSON.stringify({
                    url: 'http://share.okxueche.net/share/live?uid=' + option.anchorid + '&videoid='+option.enterid+'&higheruserid=' + option.userid,
                    text: "分享",
                    type:2,
                    uid: option.anchorid,
                    productname:option.productname
                })
            }else{
                var data = JSON.stringify({
                    url: 'http://share.okxueche.net/share/live?uid=' + option.anchorid + '&higheruserid=' + option.userid,
                    text: "分享",
                    type:2,
                    uid: option.anchorid,
                    productname:option.productname
                })
            }

            location.href = "boogoo.app://?pushcode=100007&data=" + data
        }
    }

})