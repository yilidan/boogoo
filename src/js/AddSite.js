
import $ from "jquery"
import axios from "axios"
import global from "../lib/global.js"
import qs from "qs"
import "iosselect/merge/iosSelect.css"
import IosSelect from "iosselect/merge/iosSelect.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/AddSite.scss"

var userid = global.getUserid(),
    token = global.getToken();

    // test
    userid= "42328";
    token="33FF4AC4DEA79BBB8AA426A350BD8CF3";

var iosProvinceS, iosCityS;
var vm = new Vue({
    el: "#app",
    data: {
        site: "",//收货地区
        consignee: "",//收货人
        DetailedSite: "",//详细地址
        Phone: "",
        defaultSite: 0,
        areaid: "",//城市id
        addressid: ""//省份id
    },
    created: function () {
        this.getcity();
    },
    computed: {
        fullSite: function () {
            return this.site + "" + this.DetailedSite
        }
    },
    methods: {

        selectSite: function () {
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
                        vm.site = selectOneObj.value + "" + selectTwoObj.value
                        vm.addressid = selectOneObj.id
                        vm.areaid = selectTwoObj.id
                    }
                });

               $(".layer").animate({
                    bottom: "0px"
                }, 200)
        },
        setDefault: function () {
            if (this.defaultSite) {
                this.defaultSite = 0;

            } else {
                this.defaultSite = 1;

            }

        },
        AddSite: function () {
            if (this.site == "" || this.DetailedSite == "" || this.consignee == "" || this.Phone == "") {
                global.toast(this,"请填写完整")
                return false
            }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.Phone))){
                global.toast(this,"号码格式不正确")
                return false
            }
             else {
                axios.post(global.Apipath+"/api/Product/EditAddress",
                    qs.stringify({
                        token: token,
                        userid: userid,
                        addressid: this.addressid,
                        name: this.consignee,
                        phone: this.Phone,
                        address: this.DetailedSite,
                        areaid: this.areaid,
                        State: this.defaultSite,
                        type: 0
                    })
                ).then(function (req) {
                    var data = req.data;
                    if (data.code == 1000) {
                        /**
                         * 添加成功后在缓存字段方便管理页面和选择页面刷新，并退回上一页
                         */
                        localStorage.setItem("changesiteforM",true)
                        localStorage.setItem("changesiteforS",true)
                        localStorage.setItem("changesiteforC",true)
                        location.href = "boogoo.app://?pushcode=100006"
                    }
                }, function (err) {

                })

            }
        },
        getcity: function () {
            axios.get(global.Apipath+"/api/Product/AreaInfo", {
                params: {
                    token: token,
                    userid: userid,
                }
            }).then(function (req) {
                var data = req.data;
                iosProvinceS = data.pList;
                iosCityS = data.cList

            }, function (err) {
                alert("AreaInfo err")
            })
        },


    }
})
