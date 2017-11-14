import axios from 'axios'
import global from "../lib/global.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/personHome.scss"
import loadmores from "../components/loadMore.vue"

var anchorid = global.getQueryString("anchorid") ? global.getQueryString("anchorid") : "";
var userid = global.getQueryString("userid") ? global.getQueryString("userid") : "";
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

// test
anchorid = 30892;

var vm = new Vue({
    el:"#app",
    components:{
        loadmores
    },
    data:{
        anchorInfo:{},
        productlist:[],
        bottomStatus: "", //下拉加载状态、
        pageindex: 1,//分页
        bottomtext: false,
        currentIndex:1, //当前选中
        photoList:[], //相册数据
        // 显示提示
        showReminder:false,
    },
    mounted(){
        this.$nextTick(()=>{
            this.queryAnchorInfo();
            this.queryAnchorProduct();
        })

    },
    computed:{
        imgsList:function(){
            return this.photoList.slice(0,3);

        },
    },
    methods:{
        // 浏览器打开
        gotoLiveRoomApp:function(){
            if(is_weixin() || is_weibo()){ //微信浏览器 and 微博
                this.showReminder = true;
            }else{  //不在微信浏览器 and 微博
                this.gotoLiveRoom();
            }
        },
        // 商品浏览器打开
        gotoProductRoom:function(productid){
            if(is_weixin() || is_weibo()){ //微信浏览器 and 微博
                this.showReminder = true;
            }else{  //不在微信浏览器 and 微博
                this.GoShareProduct(productid);
            }
        },
        // 点击进入直播间
        gotoLiveRoom:function(){
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
                        location.href = "https://share.boogoo.tv/bogou/dist/pages/liveRoom.html?userid="+anchorid+"&higheruserid="+userid;
                    }
                }, 500);
            }
            if (bIsAndroid) {
                var last = Date.now();
                var ifrSrc = 'boogoo://open.app';
                var ifr = document.createElement('iframe');
                ifr.src = ifrSrc;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                setTimeout(function () {
                    document.body.removeChild(ifr);
                    //setTimeout回小于2000一般为唤起失败
                    if (Date.now() - last < 2000) {
                        location.href = "https://share.boogoo.tv/bogou/dist/pages/liveRoom.html?userid="+anchorid+"&higheruserid="+userid;
                    }
                }, 1000);
            }
        },
        //跳转到商品分享页
        GoShareProduct:function(id){
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
                var last = Date.now();
                var ifrSrc = 'boogoo://open.notitlewebview?'+global.path + "/page/ProductDetails.html?productid=" + id;
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
        // 当前选中按钮
        selectBtn:function(index){
            this.pageindex = 1;
            if(index == 1){
                this.currentIndex = index;
                this.queryAnchorProduct(2);
            }else{
                this.currentIndex = index;
                this.queryAnchorBrand(2);
            }
        },
        loadup: function () { //上拉加载，改变分页数传递给子组件
            this.pageindex += 1;
            if(this.currentIndex == 1){
                this.queryAnchorProduct(1);
            }else{
                this.queryAnchorBrand(1);
            }

        },
        setBottomtext: function (datas) {
            //判断数据的个数，用来显示底部文本
            if (datas.length == 0) {
                this.bottomtext = true; //显示已经到底了
            } else {
                this.bottomtext = false;
            }
        },
        queryAnchorInfo:function(){
            axios.get(global.Apipath+"/api/Anchor/AnchorMessage",{
                params:{
                    userid:userid,
                    anchorid:anchorid,
                }
            }).then((req)=>{
                var data = req.data;
                if(data.code == 1000){
                    this.anchorInfo = data.data;
                    this.photoList = data.data.imglist;
                    console.log(this.anchorInfo);
                }

            },(err)=>{
                alert("对不起，请稍后再试！");
            })
        },
        queryAnchorProduct:function(isloadUp){
            axios.get(global.Apipath+"/api/Anchor/AnchorProductRecommend",{
                params:{
                    id:anchorid,
                    type:0,
                    pagesize:10,
                    pageindex:this.pageindex,
                }
            }).then((req)=>{
                var data = req.data;
                if(data.code == 1000){
                    if(isloadUp === 1){
                        this.productlist = this.productlist.concat(data.data);
                    }else{
                        this.productlist = data.data;
                    }
                    this.setBottomtext(data.data);
                }

            },(err)=>{
                alert("对不起，请稍后再试！");
            })
        },
        queryAnchorBrand:function(isloadUp){
            axios.get(global.Apipath+"/api/Anchor/AnchorBrandSales",{
                params:{
                    anchorid:anchorid,
                    pagesize:10,
                    pageindex:this.pageindex,
                }
            }).then((req)=>{
                var data = req.data;
                if(data.code == 1000){
                    if(isloadUp === 1){
                        this.productlist = this.productlist.concat(data.data);
                    }else{
                        this.productlist = data.data;
                    }
                    this.setBottomtext(data.data);
                }

            },(err)=>{
                alert("对不起，请稍后再试！");
            })
        },

    },

})
