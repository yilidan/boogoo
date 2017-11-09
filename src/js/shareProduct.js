import $ from "jquery"
import axios from 'axios';
import Swiper from "../lib/swiper/swiper.min.js"
import "../lib/swiper/swiper.min.css"
import global from "../lib/global.js"

import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/shareProduct.scss"

var userid = global.getUserid(),
    token = global.getToken();

// test
// userid= "42328";
// token="33FF4AC4DEA79BBB8AA426A350BD8CF3";

var productid = global.getQueryString("productid") ? global.getQueryString("productid") : "",
    anchorid = global.getQueryString("anchorid") ? global.getQueryString("anchorid") : "",

    /**
     * 当从首页进去详情时，enterid="",从直播或者录播进入时，获取enterid,它表示直播或录播的id
     * 当从首页进去详情时，entertype=1,从直播或者录播进入时，获取sourcetype，它表示该商品的购物渠道
     */
    enterid = global.getQueryString("enterid") ? global.getQueryString("enterid") : '',
    entertype = global.getQueryString("entertype") ? global.getQueryString("entertype") : 1;

var higheruserid = global.getQueryString("higheruserid");
var ua = navigator.userAgent.toLowerCase();
var bIsIphoneOs = ua.match(/iphone os/i) == "iphone os";
var bIsAndroid = ua.match(/android/i) == "android";

function is_weixin(){
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
function is_weibo(){
    if(ua.match(/Weibo/i) == "weibo"){
        return true;
    }else{
        return false;
    }
}

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
        // 显示提示
        showReminder:false,

    },
    created: function () {
        /**
         * 获取商品数据
         * 拨打电话号码兼容
         * 如果anchorid存在显示主播小店
         *
         */
        this.getdata()

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
    methods: {
        downloadApp:function(){
            if(is_weixin() || is_weibo()){ //微信浏览器 and 微博
                this.showReminder = true;
            }else{  //不在微信浏览器 and 微博
                this.godown();
            }
        },
        godown:function(){
            if (bIsIphoneOs) {
                var last = Date.now();
                var ifrSrc = 'https://share.boogoo.tv/apple-app-site-association';
                var ifr = document.createElement('iframe');
                ifr.src = ifrSrc;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                // window.location = 'apple-app-site-association';
                setTimeout(function () {
                    document.body.removeChild(ifr);
                    //setTimeout回小于2000一般为唤起失败
                    if (Date.now() - last < 1000) {
                        location.href = "https://itunes.apple.com/cn/app/%E6%92%AD%E8%B4%AD%E7%9B%B4%E6%92%AD/id1193113646?mt=8"
                    }
                }, 500);
            }else if(bIsAndroid){
                // var data = JSON.stringify({
                //     url: global.path + "/page/ProductDetails.html?productid=" + productid
                // });
                var last = Date.now();
                var ifrSrc = 'boogoo://open.notitlewebview?'+global.path + "/page/ProductDetails.html?productid=" + productid;
                var ifr = document.createElement('iframe');
                ifr.src = ifrSrc;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                setTimeout(function () {
                    document.body.removeChild(ifr);
                    //setTimeout回小于2000一般为唤起失败
                    if (Date.now() - last < 2000) {
                        location.href = "https://file.okxueche.net/boogoo_android.apk"
                    }
                }, 1000);
            }
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
        dalogtext: function () { //未选择分类时的提示
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
                alert(err)
            }

        },
        setModalClick: function () {
            var _this = this
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

    }
})
