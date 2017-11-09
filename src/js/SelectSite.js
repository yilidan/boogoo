import Vue from "../lib/vue/vue.min.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/SelectSite.scss"

import axios from 'axios';
import global from "../lib/global.js"
var timer;
var userid = global.getUserid(),
    token = global.getToken();

    userid= "42328";
    token="33FF4AC4DEA79BBB8AA426A350BD8CF3";

var vm = new Vue({
    el: "#app",
    data: {
        list: ""
    },
    created: function () {
        this.getsite()
        this.changesite()
    },
    mounted:function(){
        this.setRight()
    },
    methods: {
        savesite: function (item) {
            /**
             * 选择地址后放入缓存，以便在确认订单页面使用
             */
            localStorage.setItem("site", JSON.stringify(item))
            location.href = "boogoo.app://?pushcode=100006"
        },
        getsite: function () {
            axios.get(global.Apipath + "/api/Product/AddressInfo", {
                params: {
                    token: token,
                    userid: userid
                }
            }).then((req) => {
                var data = req.data
                if (data.code == 1000) {
                    var data = req.data.data
                    this.list = data

                }
            }, (err) => {
                alert("AddressInfo err")
            })
        },
        changesite: function () {
            /**
             * 通过判断localstorage中的changesiteforS是否存在
             * 如果存在去重新加载数据，并且将changesiteforS修改为false避免多次去请求数据
             * 只有在添加和修改,删除地址时候才有设置changesiteforS
             */
            timer = setInterval(() => {
                var changesite = localStorage.getItem("changesiteforS")
                if (JSON.parse(changesite)) {
                    this.getsite()
                    localStorage.setItem("changesiteforS", false)
                }
            }, 700)
        },
        setRight: function () {
             //右上按钮
            var data = JSON.stringify({
                url: global.path + "/page/ManageSite.html",
                text: "管理",
                type: 1
            })
            location.href = "boogoo.app://?pushcode=100007&data=" + data
        }
    }
})
