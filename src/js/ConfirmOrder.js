import $ from "jquery"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/ConfirmOrder.scss"
import global from "../lib/global.js"

import axios from "axios"
import "../lib/md5/md5.js"
import qs from "qs"
import GUID from "../lib/guid/guid.js"
import "iosselect/merge/iosSelect.css"
import IosSelect from "iosselect/merge/iosSelect.js"
import {Indicator} from 'mint-ui';

var userid, token, enterid, entertype;
var site, timero,timers;
var productinfo = JSON.parse(localStorage.getItem("productinfo")); //获取商品，主播信息
// 主播id
var anchorid = global.getQueryString("anchorid") ? global.getQueryString("anchorid") : '';

// entertype区分从直播或录播渠道跳转到确认订单页
entertype = global.getQueryString("entertype");

// cartlist区分从购物车跳转到确认订单页
var cartlist = global.getQueryString("cartlist") ? global.getQueryString("cartlist") : "";

var iosProvinceS, iosCityS;
var vm = new Vue({
    el: "#app",
    data: {
        defultesite: true, //是否显示增加按钮 为(true)
        site: {
            // addressid:'',
            // name:'',
            // phone:'',
            // detailaddress:'',
            // areaid:'',
            // state:'',
            // areaname:'',
        },   //地址数据
        orderinfo: "",
        total: "",  //总价
        popupAddSite:false, //弹窗新建地址
        receSite: "",//收货地区
        consignee: "",//收货人
        DetailedSite: "",//详细地址
        Phone: "",  //手机
        defaultValue:false,
        defaultSite: 0, //默认
        areaid: "",//城市id
        addressid: "",//省份id
        popupSelect:false,  //弹窗选择新建or退出
        popupChangeSite:false,  //弹窗更改收货地址
        allAddressList:[],  //全部收货地址
        popupAddress:"新建地址", //弹窗title
        popupPayMode:false, //弹窗支付方式
        popupPayConfirm:true,  //弹窗支付选择

    },
    created: function () {
        this.init();
        this.getcity();
        console.log(productinfo)
    },
    mounted:function(){
        this.$nextTick(()=>{

        })
    },
    updated:function(){
        // this.init();
    },
    methods: {
        init: function () {
            Indicator.open({spinnerType: 'fading-circle'});
            // this.changesite()
            if (cartlist != "") {
                /**
                 * 从购物车进入确认订单时从order_info获取用户信息,
                 * 让enterid,entertype为空
                 */
                 userid = global.getQueryString("userid");
                 token = global.getQueryString("token");
                 enterid = '';
                 entertype = '';
                 this.CreateProductOrderTime(cartlist);

                // userid = order_info.userid;
                // token = order_info.token;
                // enterid = '';
                // entertype = '';
                // this.CreateProductOrderTime(order_info.cartlist);
            } else {
                if(entertype == '1'){
                    /**
                     * 从商品详情页进入确认订单时从url获取
                     */
                    enterid = global.getQueryString("enterid");
                    // entertype = global.getQueryString("entertype");
                    userid = global.getUserid();
                    token = global.getToken();

                    // test
                    // userid= "43019";
                    // token="BADC1D69EA8349189854E58E4FCFAFDE";

                    //数据模型
                    var messages = [
                        {
                            anchorid: anchorid,//主播id,从url上截取
                            headerimg: "",//主播头像
                            anchorname: "",//主播名称
                            subtotal: "",//小计
                            number: '',//该主播下购买总数
                            data: [
                                {
                                    productid: productinfo.productid,//商品id
                                    productname: productinfo.productname,//商品名称
                                    productimg: productinfo.productimg,//商品图片
                                    skutext: productinfo.skutext,//sku名称
                                    skuid: productinfo.skuid,//skuid
                                    num: productinfo.buynumber,//购买个数
                                    prices: productinfo.prices,//价格
                                    cartid: 0//默认设置0
                                },
                            ]
                        }
                    ];
                    this.orderinfo = messages //将数据赋值给data属性
                    this.getsubtotalAndMunber();
                    this.gettotal();
                    this.getAnchorid();
                    /**
                     * 存入缓存，给分享使用
                     */
                    this.setshareoption();
                }else{
                    // 从直播或录播进入确认订单页
                    enterid = global.getQueryString("enterid");
                    userid = global.getQueryString("userid");
                    token = global.getQueryString("token");
                    let productid = global.getQueryString("productid");
                    let skuid = global.getQueryString("skuid");
                    let buynumber = global.getQueryString("num");
                    // let prices = global.getQueryString("prices");
                    // test
                    // userid= "42328";
                    // token="33FF4AC4DEA79BBB8AA426A350BD8CF3";
                    //数据模型
                    var messages = [
                        {
                            anchorid: anchorid,//主播id,从url上截取
                            headerimg: "",//主播头像
                            anchorname: "",//主播名称
                            subtotal: "",//小计
                            number: '',//该主播下购买总数
                            data: [
                                {
                                    productid: productid,//商品id
                                    productname: '',//商品名称
                                    productimg: '',//商品图片
                                    skutext: '',//sku名称
                                    skuid: skuid,//skuid
                                    num: parseInt(buynumber),//购买个数
                                    prices: '',//价格
                                    cartid: 0//默认设置0
                                },
                            ]
                        }
                    ];
                    this.orderinfo = messages; //将数据赋值给data属性
                    this.getAnchorid(); //获取主播个人信息
                    this.queryProductPrice(productid,skuid); //获取商品详情
                    this.queryProductName(productid);   //获取商品Name
                }

            }
            //获取地址
            this.getsite();

            /**
             * 通过缓存获取site ，如果存在则更新数据，并清除缓存
             */
            timero = setInterval(() => {
                var site = JSON.parse(localStorage.getItem("site"));
                if (site) {
                    this.site = ''
                    this.site = site
                    localStorage.removeItem("site")
                }
            }, 1000);
        },
        queryProductPrice:function(productid,skuid){
            axios.get(global.Apipath + "/api/Product/ProductPrice", {
                params: {
                    userid: userid,
                    token: token,
                    anchorId: anchorid,
                    productid: productid,
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    var priceInfoData = data.data.priceInfo;
                    console.log(data.data.priceInfo);
                    priceInfoData.forEach((item,index)=>{
                        if(skuid == item.skuid){
                            console.log(this.orderinfo);
                            this.orderinfo[0].data[0].prices = item.price;
                            this.orderinfo[0].data[0].skutext = item.attrdesc;
                            this.orderinfo[0].data[0].productimg = item.imgurl;
                            this.getsubtotalAndMunber();
                            this.gettotal();
                            console.log(this.orderinfo[0].data[0].prices);
                        }
                    })

                }
            }, function (err) {
                alert("error ProductPrice")
            })
        },
        queryProductName:function(productid){
            axios.get(global.Apipath + "/api/Product/ProductInfo", {
                params: {
                    userid: userid,
                    token: token,
                    anchorId: anchorid,
                    productid: productid,
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    this.orderinfo[0].data[0].productname = data.data.name;
                    console.log(data.data.name);

                    /**
                     * 存入缓存，给分享使用
                     */
                    this.setshareoption();
                }
            }, function (err) {
                alert("error ProductInfo");
            })
        },
        getAnchorid: function () {//获取主播个人信息,在非购物车入口进入时使用
            axios.get(global.Apipath + "/api/user/UserInformation", {
                params: {
                    userid: userid,
                    token: token,
                    touserid: anchorid
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    //设置主播的头像，名称
                    this.orderinfo[0].headerimg = data.data[0].headurl;
                    this.orderinfo[0].anchorname = data.data[0].nickname;
                }
            }, function (err) {
                alert("error UserInformation")
            })
        },
        CreateProductOrderTime: function (cartlist) {//通过cartid获取购物车数据
            var _this = this;
            axios.get(global.Apipath + "/api/Product/CreateProductOrderTime", {
                params: {
                    userid: userid,
                    token: token,
                    cartlist: cartlist
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    this.createMode(data.data)
                }
            }, function (err) {
                alert("error CreateProductOrderTime")
            })
        },
        createMode: function (data) {
            /**
             * 在购物车进入时，生成data数据结构，并放入data中
             */
            var orderinfos = []
            data.forEach(function (element, index) {
                var obj = {
                    anchorid: element.anchorid,
                    headerimg: element.anchorheadurl,
                    anchorname: element.anchorname,
                    subtotal: "",
                    number: '',
                    data: []
                }
                element.prolist.forEach(function (val) {
                    var cobj = {
                        productid: val.productid,//商品id
                        productname: val.name,//商品名称
                        productimg: val.coverurl,
                        skutext: val.attrdesc,//sku名称
                        skuid: val.skuid,//skuid
                        num: val.num,//购买个数
                        prices: val.price,//价格
                        cartid: val.cartid//
                    }
                    obj.data.push(cobj)
                })
                orderinfos.push(obj)
            })
            this.orderinfo = orderinfos;
            this.getsubtotalAndMunber();
            this.gettotal();

        },
        getsubtotalAndMunber: function () {//计算商品个数和小计
            var _this = this;
            _this.orderinfo.forEach(function (element, index) {
                // console.log(element)
                var muber = 0, subtotal = 0;
                element.data.forEach(function (val, i) {//遍历商品
                    muber += Number(val.num);
                    subtotal += global.accMul(val.num ,val.prices)

                })
                _this.orderinfo[index].number = muber
                _this.orderinfo[index].subtotal = subtotal

            })
        },
        gettotal: function () {//遍历所有商品 计算总价
            var sum = 0;
            this.orderinfo.forEach(function (element, index) {
                element.data.forEach(function (val) {
                    console.log(val.num);
                    console.log(val.prices);
                    sum += global.accMul(val.num ,val.prices);

                })
            })
            this.total = sum;
        },
        // 有默认收获地址
        selectSite: function () {
            this.popupChangeSite = true;

            // var data = JSON.stringify({
            //     url: global.path + "/page/SelectSite.html",
            //
            // })
            // location.href = "boogoo.app://?pushcode=100002&data=" + data
        },
        // 无默认收获地址
        GoaddSite: function () {
            // alert("123");
            this.popupAddSite = true;

            // console.log(this.popupAddSite);
            // var data = JSON.stringify({
            //     url: global.path + "/page/AddSite.html"
            // })
            // location.href = "boogoo.app://?pushcode=100002&data=" + data
            // location.href = "./AddSite.html";
        },
        // 无收获地址，去新建
        goNewBtn(){
            this.popupAddSite = true;
            this.popupSelect = false;
        },
        // 更改地址跳转到新建
        gotoNewAddress(){
            // console.log(this.defaultSite);
            this.popupAddSite = true;
            this.popupChangeSite = false;
            this.popupAddress = "新建地址";
            this.addressid = '';
            this.consignee = '';
            this.Phone = '';
            this.DetailedSite = '';
            this.areaid = '';
            this.defaultSite = '';
            this.defaultValue = false;
            this.receSite = '';
        },
        // 取消
        cancelBtn(){
            this.popupSelect = false;
        },
        // 默认地址状态
        setDefault(event){
            if (event) {
                this.defaultSite = 0;
            }else{
                this.defaultSite = 1;
            }
            // console.log(this.defaultSite);
        },
        getsite: function () {
            axios.get(global.Apipath + "/api/Product/AddressInfo", {
                params: {
                    token: token,
                    userid: userid
                }
            }).then((req) => {
                Indicator.close();
                var data = req.data;
                if (req.data.code == 1000) {
                    this.allAddressList = data.data;
                    // console.log(this.allAddressList);
                    if (data.data.length == 0) {
                        this.defultesite = false;

                    }else{
                        var stateArray = [];
                        data.data.forEach((element) => {
                            stateArray.push(element.state)
                            if (element.state == 1) {
                                this.site = ""
                                this.site = element;
                            }
                        });
                        // console.log(this.site);
                        /**
                         * 如果地址中没有默认地址 state都是0的情况下
                         * 显示第一个地址
                         */
                        var index = stateArray.indexOf(1)
                        if (index == -1) {
                            this.defultesite = true
                            this.site = ""
                            this.site = data.data[0]
                        }
                    }
                } else {
                    alert("AddressInfo" + req.data.code)
                }
            }, (err) => {
                alert("AddressInfo err")
            })
        },
        signature: function () {//  签名
            var code = userid + "" + vm.total,

                x = Base64.encode(code).MD5(32),
                guid = new GUID(),
                iden = guid.newGUID().slice(0, -4),
                sign = (x + iden).MD5(32);
            return {
                iden: iden,
                sign: sign
            };
        },
        // 选择支付方式
        popupOptionPay:function(){
            if (this.defultesite == false) {
                this.popupSelect = true;
                // global.toast(this, "请选择地址")
                return false;
            }else{
                this.popupPayMode = true;
            }
        },
        // 支付弹窗的立即支付
        popupSubmit:function(){
            if(this.popupPayConfirm == false){
                global.toast(this, "请选择支付方式");
                return false;
            }else{
                this.submit();
            }
        },
        // 提交订单
        submit: function () {
            // if (this.defultesite == false) {
            //     this.popupSelect = true;
            //     // global.toast(this, "请选择地址")
            //     return false;
            // }
            var code = this.signature()
            //判断手机端来源
            var sources = ""
            if (global.bIsIphoneOs()) {
                sources = 1
            }
            if (global.bIsAndroid()) {
                sources = 2
            }

            /* skuinfo的数据结构[
                 {
                     anchorid:"",
                     data: [
                         {
                             productid: "",
                             skuid: "",
                             num: "",
                             cartid:""
                         }
                     ]
                 }
             ]*/
            //生成数据结构
            var skuinfo = []
            this.orderinfo.forEach((element, index) => {
                var obj = {
                    anchorid: element.anchorid,
                    data: []
                }
                element.data.forEach((val) => {
                    var cobj = {
                        productid: val.productid,
                        skuid: val.skuid,
                        num: val.num,
                        cartid: val.cartid
                    }
                    obj.data.push(cobj)
                })
                skuinfo.push(obj)
            })

            axios.post(global.Apipath + "/api/Product/ProductOrder",//生成订单号
                qs.stringify({
                    token: token,
                    userid: userid,
                    amount: vm.total,
                    iden: code.iden,
                    sign: code.sign,
                    addressid: vm.site.addressid,
                    sources: sources,
                    enterid: enterid,
                    entertype: entertype,
                    skuinfo: JSON.stringify(skuinfo)

                })
            )
                // axios.get("https://bogou.okxueche.net/api/Product/ProductOrder",//生成订单号
                //     {
                //         params: {
                //             token: token,
                //             userid: userid,
                //             amount: vm.total,
                //             iden: code.iden,
                //             sign: code.sign,
                //             addressid: vm.site.addressid,
                //             sources: sources,
                //             enterid: enterid,
                //             entertype: entertype,
                //             skuinfo: JSON.stringify(skuinfo)
                //         }
                //     }
                // )
                .then((req) => {
                    this.createorder(req)
                }, (err) => {
                    alert("ProductOrder err")
                })
        },
        createorder: function (req) {
            //生成订单后的操作，跳转到支付
            var data = req.data;
            var urldata;
            if (data.code == 1000) {
                //获取orderid，放入数组（存在生成多个订单号）
                var orderArray = []
                data.data.forEach((value) => {
                    orderArray.push(value.orderid)
                })
                /**
                 * 将productname,entertype传给native。
                 * 功能：购买后用来提示主播的数据，取第一个商品数据
                 */
                if (global.bIsAndroid) {
                    urldata = JSON.stringify({
                        orderlist: orderArray.join(","),//安卓跟ios不同点
                        amount: this.total,
                        num: this.orderinfo[0].data[0].num + "件",
                        productname: this.orderinfo[0].data[0].productname,
                        entertype: entertype,
                        link: global.path + "/page/ProductDetails.html?productid=" + this.orderinfo[0].data[0].productid
                    })
                }
                else if (global.bIsIphoneOs) {
                    urldata = JSON.stringify({
                        orderlist: orderArray.join("*"),
                        amount: this.total,
                        num: this.orderinfo[0].data[0].num + "件",
                        productname: this.orderinfo[0].data[0].productname,
                        entertype: entertype,
                        link: global.path + "/page/ProductDetails.html?productid=" + this.orderinfo[0].data[0].productid
                    })
                }
                console.log(urldata)
                location.href = "boogoo.app://?pushcode=100004&data=" + urldata
            } else if (data.code == 7000) {
                global.toast(this, "库存不足")
            } else {
                alert("服务器开小差！")
            }
        },
        setshareoption: function () {
            /**
             * 功能：用来分享的数据
             */
            var option = JSON.stringify({
                entertype: entertype,
                enterid: enterid,
                userid: userid,
                anchorid: anchorid,
                productname: this.orderinfo[0].data[0].productname,
            })
            localStorage.setItem("share", option);
        },
        changesite: function () {
            /**
             * 通过判断localstorage中的changesiteforC是否存在
             * 如果存在去重新加载数据，并且将changesiteforS修改为false避免多次去请求数据
             * 只有在添加和修改,删除地址时候才有设置changesiteforC
             */

            timers = setInterval(() => {

                var changesite = localStorage.getItem("changesiteforC")

                if (JSON.parse(changesite)) {
                    this.getsite()
                    localStorage.setItem("changesiteforC", false)
                }
            }, 700)
        },
        selectCitySite: function () {
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
                        vm.receSite = selectOneObj.value + "" + selectTwoObj.value
                        vm.addressid = selectOneObj.id
                        vm.areaid = selectTwoObj.id
                    }
                });
               $(".layer").animate({
                    bottom: "0px"
                }, 200)
        },
        // 获取城市列表
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
        AddSiteBtn: function (editState) {
            // 默认状态
            // console.log(this.defaultSite);
            if (this.receSite == "" || this.DetailedSite == "" || this.consignee == "" || this.Phone == "") {
                global.toast(this,"请填写完整");
                return false
            }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.Phone))){
                global.toast(this,"号码格式不正确");
                return false
            }else {
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
                        type: editState
                    })
                ).then((req)=>{
                    var data = req.data;
                    if (data.code == 1000) {
                        this.popupAddSite = false;
                        // this.site = obj1;
                        this.site.addressid = this.addressid;
                        this.site.name = this.consignee;
                        this.site.phone = this.Phone;
                        this.site.detailaddress = this.DetailedSite;
                        this.site.areaid = this.areaid;
                        this.site.state = this.defaultSite;
                        this.site.areaname = this.receSite;
                        if(this.defultesite == false){
                            this.getsite();
                        }else{
                            this.queryAllSite();
                        }

                        /**
                         * 添加成功后在缓存字段方便管理页面和选择页面刷新，并退回上一页
                         */
                        // localStorage.setItem("changesiteforM",true)
                        // localStorage.setItem("changesiteforS",true)
                        // localStorage.setItem("changesiteforC",true)
                        // location.href = "boogoo.app://?pushcode=100006"
                    }
                },(err)=>{

                })

            }
        },
        changeAddress:function(item){
            this.popupChangeSite = false;
            this.site = item;
        },
        // 编辑地址
        editAddress:function(item){
            // console.log(item);
            this.popupAddSite = true;
            this.popupChangeSite = false;
            this.popupAddress = "编辑地址";
            this.addressid = item.addressid;
            this.consignee = item.name;
            this.Phone = item.phone;
            this.DetailedSite = item.detailaddress;
            this.areaid = item.areaid;
            if(item.state == '1'){
                this.defaultValue = true;
                this.defaultSite = 1;
            }else{
                this.defaultValue = false;
                this.defaultSite = 0;
            }
            // console.log(this.defaultSite);
            this.receSite = item.areaname;
        },
        // 弹窗后退按钮
        popupBackUp:function(){
            this.popupAddSite = false;
            this.popupChangeSite = true;
        },
        queryAllSite:function(){
            axios.get(global.Apipath + "/api/Product/AddressInfo", {
                params: {
                    token: token,
                    userid: userid
                }
            }).then((req) => {
                var data = req.data;
                if (req.data.code == 1000) {
                    this.allAddressList = data.data;
                    // console.log(this.allAddressList);
                } else {
                    alert("AddressInfo" + req.data.code)
                }
            }, (err) => {
                alert("AddressInfo err")
            })
        },

    }
})
