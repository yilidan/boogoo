import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/ManageSite.scss"
import axios from 'axios'
import global from "../lib/global.js"

var timer;
var userid = global.getUserid(),
    token = global.getToken();
var vm = new Vue({
    el: "#app",
    data: {
        active: "active",
        activeindex: "",
        sitelist: ""
    },
    created: function () {
        this.getdata()
        this.changesite()

    },

    methods: {
        changesite: function () {
            /**
             * 通过判断localstorage中的changesiteforM是否存在
             * 如果存在去重新加载数据，并且将changesiteforM修改为false避免多次去请求数据
             * 只有在添加和修改,删除地址时候才有设置changesiteforM
             */
            timer = setInterval(() => {
                var changesite = localStorage.getItem("changesiteforM")
                if (JSON.parse(changesite)) {
                    this.getdata()
                    localStorage.setItem("changesiteforM", false)
                }
            }, 700)
        },
        edit: function (item) {
            localStorage.setItem("editSite", JSON.stringify(item))
            var data = JSON.stringify({
                url: global.path + "/page/EditSite.html"
            })
            location.href = "boogoo.app://?pushcode=100002&data=" + data
        },
        deletes: function (addressid) {

            axios.get(global.Apipath+"/api/Product/EditAddress", {
                params: {
                    token: token,
                    userid: userid,
                    type: 2,
                    addressid: addressid
                }
            }).then((req) => {
                var data = req.data;

                if (data.code == 1000) {
                        /**
                         * 添加成功后在缓存字段  方便管理页面和选择页面刷新，并退回上一页
                         */
                    
                    localStorage.setItem("changesiteforC", true)
                    localStorage.setItem("changesiteforS", true)
                    
                    global.toast(this, "删除成功")

                    this.getdata()
                } else {
                    global.toast(this, "删除失败")
                }
            }, (err) => {
                alert("EditAddress err")
            })
        },
        addsite: function () {
            var data = JSON.stringify({
                url: global.path + "/page/AddSite.html"
            })
            location.href = "boogoo.app://?pushcode=100002&data=" + data
        },
        getdata: function () {
            axios.get(global.Apipath+"/api/Product/AddressInfo", {
                params: {
                    token: token,
                    userid: userid
                }
            }).then((req) => {
                var data = req.data.data
                this.sitelist = data
                data.forEach((element, index) => {

                    if (element.state == 1) {

                        this.activeindex = index //设置默认地址
                    }
                });

            }, (err) => {
                alert("AddressInfo err")
            })
        },
        setDefault: function (indexOfItem, addressid) {

            axios.get(global.Apipath+"/api/Product/EditAddress", {
                params: {
                    token: token,
                    userid: userid,
                    State: 1,
                    type: 1,
                    addressid: addressid
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    global.toast(this, "设置成功")
                    this.activeindex = indexOfItem
                } else {
                    global.toast(this, "设置失败")
                }
            }, (err) => {
                alert("EditAddress err")
            })
        },

    }

}) 