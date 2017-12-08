import $ from "jquery"
import axios from 'axios'
import Swiper from "../lib/swiper/swiper.min.js"
import "../lib/swiper/swiper.min.css"
import global from "../lib/global.js"
// import BScroll from 'better-scroll'

import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/ProductDetails.scss"

var userid = global.getUserid(),
    token = global.getToken();

var productid = global.getQueryString("productid") ? global.getQueryString("productid") : "",
    anchorid = global.getQueryString("anchorid") ? global.getQueryString("anchorid") : "",

    /**
     * 当从首页进去详情时，enterid="",从直播或者录播进入时，获取enterid,它表示直播或录播的id
     * 当从首页进去详情时，entertype=1,从直播或者录播进入时，获取sourcetype，它表示该商品的购物渠道
     */
    enterid = global.getQueryString("enterid") ? global.getQueryString("enterid") : '',
    entertype = global.getQueryString("entertype") ? global.getQueryString("entertype") : 1;

    // test
    // userid= "43040";
    // token="FA46159681BDA3AF9EC600C968D0C565";
    // anchorid="4360";

var vm = new Vue({
    el: '#app',
    data: {
        selected:'1',   //宝贝    详情
        buynumber: 1,
        iscur: {},//当前的商品子属性attrid
        isattrtext: {},//当前的商品子属性
        prices: "",//当前确定的价格
        confirmClass: "",//当前确定的分类名称
        stock: 100,//属性层中的库存
        imgurl: "",//当前图片
        houseshow: false,//主播是否显示
        attrshow: false,//属性层
        abbrshow: false,//参数层
        serviceshow: false,//客服层
        pI: "",//商品信息
        arrts: "",//商品属性
        priceInfo: "", //sku价格表
        btnMunber: "",//显示按钮个数
        handle: "",//用来判断确定按钮是加入购物车或者立即购买
        skuid: "",//组合的sku
        iscollect: "",//收藏按钮
        infoimgdata:"",
        // 上拉跳页
        bottomStatus:"",
        bottom:"",
        // 下拉上一页
        topStatus:"",
        top:"",

        // 商品详情
        currentIndex:0, // 当前选中的tab
        foodScroll: null,  //食品列表scroll
        menuIndex: 0, //已选菜单索引值，默认为0
        menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
        shopListTop: [], //商品列表的高度集合
        productShare:{}, //商品分享数据

    },
    created: function () {
        /**
         * 获取商品数据
         * 拨打电话号码兼容
         * 如果userid存在去请求是否收藏此商品
         * 如果anchorid存在显示主播小店
         *
         */
        this.getdata();
        if (userid) {
            this.getCollect()
        }
        if (anchorid != "") {
            this.houseshow = true
        }
    },
    watch: {
        iscur: {
            /*监控 iscur 对象 */
            handler: function (val) {
                this.watchinfo(val)
            },
            // 深度观察
            deep: true
        },
        isattrtext: {
            /*监控 isattrtext 对象*/
            handler: function (val) {
                var text = "";
                for (var key in val) {
                    text += val[key] + "  "
                }
                if (this.confirmClass == "") {
                    this.confirmClass = "请选择 分类"
                } else {
                    this.confirmClass = '已选择  "' + text + '"'
                }
            },
            // 深度观察
            deep: true
        }
    },
    computed: {

    },
    mounted: function () {
        this.$nextTick(()=>{
            if(global.bIsIphoneOs()){
                var navTop = document.getElementById("navTop");
                navTop.style.paddingTop = "5%";
                var mainTop = document.getElementById("main");
                mainTop.style.paddingTop = "5%";
                // console.log(this.$refs);
                // this.$refs.searchTop.style.paddingTop = "3%";
            }
            this.initScroll();
            this.queryShareData();
            // this.getFoodListHeight();
        })
        // var navHeight = $("#navTop").outerHeight();
        // $("#main").css({
        //     "margin-top":navHeight
        // })
        // console.log(navHeight);
    },
    updated:function(){
        // this.initScroll();
    },
    methods: {
        initScroll:function(){
            var _this = this;
            // var proTop = $(".product_top").outerHeight();
            // var proBottom = $(".product_bottom").height();
            // console.log($(".product_top"));
            // var a1 = this.$refs.product_top.clientHeight;
            // console.dir(a1);
            // var bcd = $("#navTop").outerHeight();
            //
            // console.log(proTop);
            // var abc = $(".product_bottom").offset().top;
            // console.log($(".product_bottom"));
            // console.log(abc);
            // var c =  $(window).height();
            // console.log(c);

            var c = $("#navTop").outerHeight();
            var t = $(".product_bottom").offset().top;
            t = t-c;
            $(window).scroll(function(){
                if($(window).scrollTop()>=t){
                    _this.currentIndex = 1;
                }else{
                    _this.currentIndex = 0;
                }
            });

        },
        //点击左侧食品列表标题，相应列表移动到最顶层
        chooseMenu(index){
            // var _this = this;
            this.currentIndex = index;
            if(index == 0){
                $('body,html').animate({
                    "scrollTop": 0
                }, 300);
            }else{
                let c = $("#navTop").outerHeight();
                let t = $(".product_bottom").offset().top;
                t = t-c;
                $('body,html').animate({
                    "scrollTop": t
                }, 300);
            }

            // var t = aDiv.eq($(this).index()).offset().top;
            // $(this).addClass('active').siblings().removeClass('active');

            // //menuIndexChange解决运动时listenScroll依然监听的bug
            // this.menuIndexChange = false;
            // this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
            // this.foodScroll.on('scrollEnd', () => {
            //     this.menuIndexChange = true;
            // })
        },
        //获取食品列表的高度，存入shopListTop
        // getFoodListHeight(){
        //     const listContainer = this.$refs.menuFoodList;
        //     console.log(listContainer);
        //     const listArr = Array.from(listContainer.children[0].children);
        //     console.log(listArr);
        //     listArr.forEach((item, index) => {
        //         this.shopListTop[index] = item.clientHeight;
        //     });
        //     console.log(this.shopListTop);
        //     this.listenScroll(listContainer)
        // },
        // //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
        // listenScroll(element){
        //     this.foodScroll = new BScroll(element, {
        //         probeType: 3,
        //         deceleration: 0.001,
        //         bounce: false,
        //         swipeTime: 2000,
        //         click: true,
        //     });
        //
        //     // const wrapperMenu = new BScroll('#wrapper_menu', {
        //     //     click: true,
        //     // });
        //
        //     // const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
        //     this.foodScroll.on('scroll', (pos) => {
        //         // if (!this.$refs.wrapperMenu) {
        //         //     return
        //         // }
        //         console.log(pos.y);
        //         this.shopListTop.forEach((item, index) => {
        //             if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
        //                 this.menuIndex = index;
        //                 // const menuList=this.$refs.wrapperMenu.querySelectorAll('.activity_menu');
        //                 // const el = menuList[0];
        //                 // wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
        //             }
        //         })
        //     })
        // },
        handleBottomChange: function(status){
           //上拉加载的状态
           this.bottomStatus = status;
        },
        loadBottom:function(){
            setTimeout(()=> {
                this.selected = '2';
                this.$refs.loadmore.onBottomLoaded();
            }, 500)
        },
        loadTop:function(){
            setTimeout(()=> {
                this.selected = '1';
                this.$refs.loadTopMore.onTopLoaded();
            }, 500)
        },
        handleTopChange: function(status){
           //上拉加载的状态
           this.topStatus = status;
        },
        watchinfo: function (val) {
            /**
             * 监控iscurd对象时调用
             * 当iscur中属性发生变化时，我们获取iscur中每个属性的value值，并放入数组中，通过join生成字符串再与价格表中的数据进行对比，提取出相同项的数据
             */
            var SKUArry = [], SKUString;
            var SKUprice;
            /**
             * 功能:切换图片
             * 遍历val值，截取key值，从第5个开始，当它等于1301时，也就是等于颜色属性时候
             * 对比sku价格表
             */
            for (var keys in val) {
                if (keys.substring(4) == "1301") {
                    this.priceInfo.forEach((element) => {
                        var colorid = element.skuid.split(":") //将sku用：分割成数组
                        if (colorid.indexOf(val[keys]) >= 0) {
                            /**
                             * 判断当前的val[key] 也就是当前选择的子分类id是否在
                             * 存在的话获取该sku的图片，并且设置为当前显示图片
                             */

                            this.imgurl = element.imgurl;
                            return false;
                        }
                    })
                }
                SKUArry.push(val[keys])
            }
            var Newsku = SKUArry.sort(function (a, b) { //排序 将sku小的放到前面
                return a - b
            })

            SKUString = Newsku.join(":")

            vm.priceInfo.forEach((val) => { //对比sku价格表 提取相应的数据
                if (SKUString == val.skuid) {
                    this.prices = val.price
                    this.skuid = val.skuid
                    this.stock = val.stock

                }
            })
        },
        getdata: function () {//请求商品数据
            axios.get(global.Apipath+"/api/Product/ProductInfo", {
                params: {
                    productid: productid,
                    userid: userid,
                    token: token,
                    anchorId: anchorid,
                }
            }).then((req) => {
                this.getAttr()
                this.setData(req)
            }, (err) => {
                alert("ProductInfo err")
            })
        },
        getAttr: function () {//请求商品属性
            axios.get(global.Apipath+"/api/Product/ProductPrice", {
                params: {
                    productid: productid,
                    userid: userid,
                    token: token,
                    anchorId: anchorid,
                }
            }).then((req) => {
                this.setAttr(req)
            }, (err) => {
                alert("ProductPrice err")
            })

        },
        setAttr: function(req){//将商品属性放入data
            var data = req.data.data;
            if (req.data.code == 1000) {
                this.arrts = data.attrInfo//属性表
                this.priceInfo = data.priceInfo//价格表
                /*
                根据属性大分类遍历后动态生成标识｛type[attrid]：value｝,
                attrid 表示属性大分类的id，value 表示各个大分类下子属性的attrid，属性名称.
                同时这个iscur对象会动态切换class:active.
                */
                this.arrts.forEach((val, index) => {
                    var attrsId = {
                        //设置子分类attrid
                        ['type' + val.attrid]: ""
                    }
                    var attrsText = {
                        //设置属性名
                        ['type' + val.attrid]: ""
                    }
                    this.iscur = Object.assign({}, this.iscur, attrsId) //实现data响应
                    this.isattrtext = Object.assign({}, this.isattrtext, attrsText) //实现data响应
                    if(val.attrValueList.length == 1){
                        this.actives(val.attrValueList[0].attrname,val.attrid,val.attrValueList[0].attrid)
                        this.confirmClass = val.attrValueList[0];
                    }

                });
                console.log(this.iscur);
                console.log(this.isattrtext);
            }else{
                alert("ProductPrice" + req.data.code)
            }
        },
        setData: function (req) {//将商品信息数据放如data
            var data = req.data.data;
            if (req.data.code == 1000) {
                this.pI = data;//将商品数据存入pI
                this.imgurl = this.pI.turnimg[0]//默认当前图片
                this.infoimgdata=data.infoimg
            }else{
                alert(data.code)
            }
            //在dom更新完数据后调用swiper
            this.$nextTick(function () {
                var mySwiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: 4000,//可选选项，自动滑动
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false,
                })
            })
        },
        plus: function () { //购买数量加1
            if(this.buynumber >= this.stock){
                global.toast(this,"库存不足");
            }else{
                this.buynumber += 1;
            }
        },
        minus: function () {//购买数量减1
            this.buynumber -= 1
            if (this.buynumber == 0) {
                this.buynumber = 1
            }
        },
        handlers: function (boole, m) {//判断显示确定按钮的个数
            this.selectAttr()
            this.handle = m;
            if (boole) {
                this.btnMunber = true;
            } else {
                this.btnMunber = false;
            }
        },
        shoping: function (type) {
            if (!userid) { //判断是否登录
                global.regist()
                return false;
            } else {
                if (this.prices != "") { //当分类已选好时，点击确定根据handle判断当前是加入购物车还是去购买
                    if (type == 1) { //加入购物车
                        this.anchor(1)
                    }
                    if (type == 2) {//立即购买
                        this.anchor(2)
                    }
                } else {
                    this.dalogtext()
                }
            }
        },
        confirm: function () {//确定按钮
            if (userid == "") { //判断是否登录
                global.regist()
                return false;
            } else {
                if(this.stock == 0){
                    global.toast(this,"库存不足，无法购买");
                    return false;
                }else{
                    if (this.prices != "") { //当分类已选好时，根据handle判断当前是加入购物车还是去购买
                        if (this.handle == 1) {//加入购物车
                            this.anchor(1)
                        }
                        if (this.handle == 2) {//立即购买
                            this.anchor(2)
                        }
                    } else {
                        this.dalogtext()
                    }
                }
            }
        },
        dalogtext: function () {//未选择分类时的提示
            var iscur = this.iscur
            for (var key in iscur) {
                if (iscur[key] == "") {
                    //通过this.iscur获取未选择的子分类属于哪个大分类
                    var attrid = key.substring(4)
                    //遍历大分类 通过对比找出attrname
                    this.arrts.forEach((val, index) => {
                        if (attrid == val.attrid) {
                            global.toast(this,"请选择" + val.attrname)
                            return false
                        }
                    });
                    return false
                }
            }
        },
        actives: function (attrname, fattrid, attrid) {
            /*
             每次点击将子分类的arrtid，属性名以对象的方式储存在iscur，isattrtext中
             实现active切换以及获取sku
            */
            console.log(fattrid);
            console.log(attrid);
            this.iscur['type' + fattrid] = attrid;
            this.isattrtext['type' + fattrid] = attrname;

        },
        anchor: function (type) {//判断是否有主播id  ,type：1 加入购物车 2 立即购买
            var skutext;
            this.priceInfo.forEach((element) => {
                if (element.skuid == this.skuid) {
                    skutext = element.attrdesc
                }
            })
            console.log(skutext);
            console.log(this.priceInfo);
            if (anchorid == "") { //没有主播id时跳转到选择主播
                let obj = JSON.stringify({
                    productid: productid,
                    productname: this.pI.name,
                    skuid: this.skuid,
                    skutext: skutext,
                    buynumber: this.buynumber,
                    prices: this.prices,
                    productimg: this.imgurl
                })
                localStorage.setItem("productinfo", obj)//将产品信息和主播信息放入缓存,方便确认订单页面获取

                // location.href = './ConfirmOrder.html?anchorid='+anchorid+'&enterid='+enterid+'&entertype='+entertype;

                var data = JSON.stringify({
                    type: type,
                    url: 'https://share.boogoo.tv/page/ConfirmOrder.html?enterid=' + enterid + '&entertype=' + entertype,
                    productid: productid,
                    skuid: this.skuid,
                    num: this.buynumber,
                })
                location.href = "boogoo.app://?pushcode=100003&data=" + data

            }else{ //存在主播id时
                if (type == 1) {//加入购物车请求
                    this.Addshopingcar();
                }
                if (type == 2) {//跳转到确认订单
                    let obj1 = JSON.stringify({
                        productid: productid,
                        productname: this.pI.name,
                        productimg: this.imgurl,
                        skuid: this.skuid,
                        skutext: skutext,
                        buynumber: this.buynumber,
                        prices: this.prices,
                    });
                    // localStorage.removeItem("productinfo");
                    localStorage.setItem("productinfo", obj1); //将产品信息和主播信息放入缓存
                    let data = JSON.stringify({
                        url: 'https://share.boogoo.tv/page/ConfirmOrder.html?anchorid=' + anchorid + '&enterid=' + enterid + '&entertype=' + entertype,
                    })
                    setTimeout(function(){
                        location.href = "boogoo.app://?pushcode=100002&data=" + data
                    },1000);
                    // location.href = "boogoo.app://?pushcode=100002&data=" + data

                    // let data = JSON.stringify({
                    //     url: 'https://share.okxueche.net/order/ConfirmOrder?anchorid=' + anchorid + '&enterid=' + enterid + '&entertype=' + entertype,
                    // })
                   // location.href = './ConfirmOrder.html?anchorid='+anchorid+'&enterid='+enterid+'&entertype='+entertype
                }

            }
        },
        Addshopingcar: function () {//加入购物车
            axios.get(global.Apipath+"/api/Product/AddShoppingCart", {
                params: {
                    token: token,
                    userid: userid,
                    anchorid: anchorid,
                    productid: productid,
                    num: vm.buynumber,
                    skuid: vm.skuid,
                    enterid: enterid,
                    entertype: entertype
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    global.toast(this,"加入成功")
                    this.hideAttr()
                } else if (data.code == 7000) {
                    global.toast(this,"库存不足")
                } else {
                    alert("AddShoppingCart" + data.code)
                }
            }, (err) => {
                alert("AddShoppingCart err")
            })
        },
        setcollect: function () {//收藏
            if (userid) {
                if (this.iscollect == 0) { //当是收藏状态时
                    this.collect(0)
                } else {
                    this.collect(1)
                }
            } else {
                global.regist()
            }

        },
        collect: function (type) {
            axios.get(global.Apipath+"/api/user/GoodsCollection", {
                params: {
                    token: token,
                    userid: userid,
                    productid: productid,
                    anchorid: anchorid,
                    type: type
                }
            }).then((req) => {
                var data = req.data;
                if (data.code == 1000) {
                    if (type == 0) {
                        global.toast(this,"收藏成功")
                    } else {
                        global.toast(this,"已取消收藏")
                    }
                    this.getCollect()
                } else {
                    alert("GoodsCollection" + data.code)
                }

            }, (err) => {
                alert("GoodsCollection err")
            })
        },
        getCollect: function () {//是否收藏
            axios.get(global.Apipath+"/api/user/GoodIsCollect", {
                params: {
                    token: token,
                    userid: userid,
                    productid: productid,
                    anchorid: anchorid
                }
            }).then((req) => {
                var data = req.data
                if (data.code == 1000) {
                    this.iscollect = data.data.iscollect
                } else {
                    alert("GoodIsCollect" + data.code)
                }
            }, (err) => {
                alert("GoodIsCollect err")
            })
        },
        showlightbox: function (e, type) { //图片点击放大 ，手势缩放
            var imgurl = e.srcElement.currentSrc.split("?")[0]
            try {
                var pswpElement = document.querySelectorAll('.pswp')[0];

                if (type == 1) {//点击图片非常小的情况下
                    var items = [
                        {
                            src: e.srcElement.currentSrc ,
                            w: document.body.clientWidth,
                            h: document.body.clientWidth
                        }
                    ]
                }
                if(type==2) {
                    var items = [
                        {
                            src: imgurl + '?imageView2/2/w/650',
                            w: document.body.clientWidth,
                            h: e.srcElement.clientHeight
                        }
                    ]
                }
                var options = {
                    history: false,
                    focus: false,
                    tapToClose: true,
                    showAnimationDuration: 0,
                    hideAnimationDuration: 0
                }
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
                gallery.init()
            } catch (err) {
                // alert(err)
            }

        },
        setModalClick: function () {
            var _this = this;
            var timer = setInterval(function () {
                var el = document.querySelector(".v-modal")
                if (el) {
                    clearInterval(timer)
                    el.onclick = function () {
                        global.openScoll()
                    }
                }

            }, 10)

        },
        // 获取分享数据
        queryShareData:function(){
            axios.get(global.Apipath+"/api/user/GetAppConfig").then((res) => {
                this.productShare = res.data.data.ProductShare;
                console.log(this.productShare);

            }, (err) => {
                alert("GetAppConfig err")
            })
        },
        // 头部分享按钮
        shareBtn:function(){
            // let a = this.productShare.Content.replace(/XX/g,"123");
            // console.log(a);
            // 参数 分享标题 分享语 分享配图 分享链接
            var data = JSON.stringify({
                shareTitle:this.productShare.Title,
                weixinContent:this.replaceString(this.productShare.Content),
                weixinFriContent:this.replaceString(this.productShare.ContentWxFriend),
                sinaContent:this.replaceString(this.productShare.ContentWb),
                url: global.path + "/share/ProductDetails.html?productid=" + productid,
                imgUrl:this.imgurl+"?imageView2/2/w/108",
            })
            console.log(data);
            location.href = "boogoo.app://?pushcode=100009&data=" + data
        },
        replaceString:function(str){
            let proName = this.pI.otherparameters[0].Value;
            return str.replace(/XX/g,proName);
        },
        // 后退按钮
        backUpBtn:function(){
            var data = JSON.stringify({
                type: 0
            })
            location.href = "boogoo.app://?pushcode=100006";
        },
        selectAttr: function () {//显示属性层
            this.attrshow = true
            global.forbidScoll()
            this.setModalClick()
        },
        selectAbbr: function () {//显示参数层
            this.abbrshow = true
            global.forbidScoll()
            this.setModalClick()
        },
        hideAttr: function () {//隐藏属性层
            this.attrshow = false
            global.openScoll()
        },
        hideAbbr: function () {//隐藏参数层
            this.abbrshow = false
            global.openScoll()
        },
        showservice: function () {//显示客服层
            this.serviceshow = true;
            global.forbidScoll()
        },
        hideservice: function () {//隐藏客服层
            this.serviceshow = false;
            global.openScoll()
        },

    }
})
