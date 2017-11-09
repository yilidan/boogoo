
import $ from "jquery"
import "iosselect/merge/iosSelect.css"
import IosSelect from "iosselect/merge/iosSelect.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/EditSite.scss"
import axios from "axios"
import global from "../lib/global.js"


// 省份列表

var userid = global.getUserid(),
    token = global.getToken();
var iosProvinceS, iosCityS;
var vm = new Vue({
    el: "#app",
    data: {
        site: "",//收货区域
        consignee: "",//收货人
        DetailedSite: "",//详细地址
        Phone: "",
        defaultSite: "",
        areaid: "",//区域id
        addressid: ""//地址id
    },
    created: function () {
        var obj = JSON.parse(localStorage.getItem("editSite"))
        this.site = obj.areaname;
        this.consignee = obj.name;
        this.DetailedSite = obj.detailaddress;
        this.Phone = obj.phone;
        this.addressid = obj.addressid;
        this.areaid = obj.areaid;
        this.defaultSite = obj.state;
        this.getcity()
        // console.log(obj)
    },
    computed: {
        fullSite: function () {
            return this.site + "" + this.DetailedSite
        }
    },
    methods: {
        selectSite: function () { //选择城市
            var _this = this;
            var showContactDom = $('#show_contact');
            var oneLevelId = showContactDom.attr('data-province-code');
            var twoLevelId = showContactDom.attr('data-city-code');
            var sanguoSelect = new IosSelect(2,
                [iosProvinceS, iosCityS],
                {
                    relation: [1, 0, 0, 0],
                    itemShowCount: 5,
                    itemHeight: 1.2,
                    headerHeight: 0.8,
                    oneLevelId: oneLevelId,
                    twoLevelId: twoLevelId,
                    cssUnit: 'rem',
                    callback: function (selectOneObj, selectTwoObj) {
                        // console.log(selectOneObj, selectTwoObj)
                        vm.site = selectOneObj.value + " " + selectTwoObj.value

                        vm.areaid = selectTwoObj.id

                    }
                });
            $(".layer").animate({
                bottom: "0px"
            }, 200)
        },
        setDefault: function () { //设置默认
            if (this.defaultSite) {
                this.defaultSite = 0;

            } else {
                this.defaultSite = 1;

            }

        },
        deleteSite: function () {
            axios.get(global.Apipath+"/api/Product/EditAddress", {
                params: {
                    token: token,
                    userid: userid,
                    addressid: vm.addressid,
                    type: 2
                }
            }).then((req) => {

                var data = req.data;
                if (data.code == 1000) {
                    global.toast(this,"删除成功")

                } else {
                    global.toast(this,"删除失败")
                }
            }, (err) => {
                alert("EditAddress err")
            })
        },
        SaveSite: function () { //保存
            if (this.site == "" || this.DetailedSite == "" || this.consignee == "" || this.Phone == "") {
                return false;
            } else {
                axios.get(global.Apipath+"/api/Product/EditAddress", {
                    params: {
                        token: token,
                        userid: userid,
                        addressid: vm.addressid,
                        name: vm.consignee,
                        phone: vm.Phone,
                        address: vm.DetailedSite,
                        areaid: vm.areaid,
                        State: vm.defaultSite,
                        type: 1
                    }
                }).then((req) => {

                    var data = req.data;
                    if (data.code == 1000) {
                        /**
                         * 修改成功后在缓存字段方便管理页面和选择页面刷新，并退回上一页
                         */
                        localStorage.removeItem("editSite")
                        localStorage.setItem("changesiteforM",true)
                        localStorage.setItem("changesiteforS",true)
                        localStorage.setItem("changesiteforC",true)
                        location.href = "boogoo.app://?pushcode=100006"
                    } else {
                        global.toast(this,"保存失败")
                    }
                }, (err) => {
                    alert("EditAddress err")
                })
            }
        },
        getcity: function () {
            axios.get(global.Apipath+"/api/Product/AreaInfo", {
                params: {
                    token: token,
                    userid: userid,
                }
            }).then((req) => {
                var data = req.data
                if (data.code == 1000) {
                    var data = req.data;
                    iosProvinceS = data.pList;
                    iosCityS = data.cList
                } else {
                    alert("AreaInfo" + data.code)
                }

            }, (err) => {
                alert("AreaInfo err")
            })
        },
        
    },
})