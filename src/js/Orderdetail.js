
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/Orderdetail.scss"
import axios from "axios"
import global from "../lib/global.js"
import Youlike from "../components/Youlike.vue"
import loadmores from "../components/loadMore.vue"

var userid = global.getUserid(),
    token = global.getToken();
var orderid = global.getQueryString("orderid") ? global.getQueryString("orderid") : ''

// test
// userid= "43019";
// token="BADC1D69EA8349189854E58E4FCFAFDE";
// orderid="171030151209624258851";

var vm = new Vue({
    el: "#app",
    components: { Youlike, loadmores },
    data: {
        bottomStatus: "",//上拉加载是更新的状态
        datas: "",
        pageindex: 1,
        bottomtext: false,
        paymentTime: false,//支付时间
        deliverTime: false,//发货时间
        paybtn: false,//是否显示付款按钮
        Confirmbtn: false,//是否显示确定收货按钮,
        showparcelState: false//是否显示运送状态
    },
    created: function () {
        this.getdata()
    },
    methods: {
        handleTopChange: function (status) {
            this.bottomStatus = status;
        },
        loadup: function () {
            this.pageindex += 1
        },
        getdata: function () {
            axios.get(global.Apipath+"/api/Product/ProductOrderInfo", {
                params: {
                    userid: userid,
                    token: token,
                    orderid: orderid,
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    this.datas = data.data
                    this.timeinfo()
                    this.showbtn()
                }
            }, (err) => {
                alert("ProductOrderInf err")
            })
        },
        showbtn: function () {
            if (this.datas.orderstate == 0) {
                this.paybtn = true
            }
            else if (this.datas.orderstate == 2) {
                this.Confirmbtn = true
                this.showparcelState = true
            }

        },
        timeinfo: function () {
            /**
             * 当状态不等于0时候,显示付款时间
             * 当状态不等于0和1时候,显示发货时间
             */
            if (this.datas.orderstate != 0) {
                this.paymentTime = true
            }
            if (this.datas.orderstate != 0 && this.datas.orderstate != 1) {
                this.deliverTime = true
            }
        },
        GoLogistics: function () {
            var data = JSON.stringify({
                url: this.datas.courierlink + "&orderid=" + orderid
            })
            location.href = "boogoo.app://?pushcode=100002&data=" + data
            // location.href = "./Logistics.html?couriernum=0&orderid="+orderid
        },
        pay: function () {//支付
            var data = JSON.stringify({
                orderlist: this.datas.orderid,
                amount: this.datas.totalprice,
                num:this.datas.prolist[0].num + "件",
                productname: this.datas.prolist[0].name,
                entertype: '1',
                link: global.path + "/page/ProductDetails.html?productid=" +  this.datas.prolist[0].productid
            })
            location.href = "boogoo.app://?pushcode=100004&data=" + data
        },
        confirm: function () {//确认收货
            axios.get(global.Apipath+"/api/Product/ConfirmReceipt", {
                params: {
                    userid: userid,
                    token: token,
                    orderid: this.datas.orderid,
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    this.getdata()
                } else {
                    alert("ConfirmReceipt" + data.code)
                }
            }, (err) => {
                alert("ConfirmReceipt err")
            })
        }
    }
})
