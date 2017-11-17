import axios from 'axios'
import global from "../lib/global.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/personHome.scss"
import loadmores from "../components/loadMore.vue"

var anchorid = global.getQueryString("anchorid") ? global.getQueryString("anchorid") : "";
var userid = global.getQueryString("higheruserid") ? global.getQueryString("higheruserid") : "";
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
// anchorid = 30892;

var vm = new Vue({
    el:"#app",
    components:{
        loadmores
    },
    data:{
        anchorInfo:{},
        productlist:[],
        showReminder:false, // 显示提示
        bottomStatus: "", //下拉加载状态、
        pageindex: 1,//分页
        bottomtext: false,
        currentIndex:1, //当前选中
        photoList:[], //相册数据
        limitBy:3, //相册显示张数
        photoShow:true,
        imgMoreText:"更多",
        videosList:[], //精彩回顾数据
        videoMoreText:"更多",
        limitByVi:1,

    },
    mounted(){
        this.$nextTick(()=>{
            this.queryAnchorInfo();
            this.queryAnchorProduct();
            this.queryAnchorVideosList();
        })

    },
    computed:{
        imgsList:function(){
            return this.photoList.slice(0,this.limitBy);
        },
        videoData:function(){
            return this.videosList.slice(0,this.limitByVi);
        },

    },
    methods:{
        // 精彩回顾点击更多
        videoMoreBtn:function(){
            let length1 = this.videosList.length;
            console.log(length1);
            if(this.videoMoreText == "更多"){
                this.videoMoreText = "收起";
                this.limitByVi = length1;
            }else{
                this.videoMoreText = "更多";
                this.limitByVi = 1;
            }

        },
        // 相册点击更多
        imgMoreBtn:function(){
            let length1 = this.photoList.length;
            console.log(length1);
            if(this.imgMoreText == "更多"){
                this.imgMoreText = "收起";
                this.limitBy = length1;
            }else{
                this.imgMoreText = "更多";
                this.limitBy = 3;
            }

        },
        // 商品浏览器打开
        // gotoProductRoom:function(productid){
        //     if(is_weixin() || is_weibo()){ //微信浏览器 and 微博
        //         this.showReminder = true;
        //     }else{  //不在微信浏览器 and 微博
        //         this.GoShareProduct(productid);
        //     }
        // },
        // 跳转到直播间
        gotoLiveRoom:function(videoid){
            window.location.href = "https://share.boogoo.tv/bogou/dist/pages/liveRoom.html?userid="+anchorid+"&higheruserid="+userid+"&Videoid="+videoid;
        },
        //跳转到商品分享页
        GoShareProduct:function(id){
            window.location.href =   "https://share.boogoo.tv/share/ProductDetails.html?productid="+id+"&higheruserid="+userid;
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
                    console.log(this.photoList.length);
                    if(this.photoList.length <= 3){
                        this.photoShow = false;
                    }else{
                        this.photoShow = true;
                    }
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
        queryAnchorVideosList:function(){
            axios.get(global.Apipath+"/api/Anchor/AnchorVideosList",{
                params:{
                    anchorid:anchorid,
                    pagesize:10,
                    pageindex:1,
                }
            }).then((req)=>{
                var data = req.data;
                if(data.code == 1000){
                    if(data.data != ''){
                        this.videosList = data.data[0].videolist;
                    }
                    console.log(this.videosList);
                }

            },(err)=>{
                alert("对不起，请稍后再试！");
            })
        },

    },

})
