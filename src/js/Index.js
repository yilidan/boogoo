import $ from "jquery"
import axios from "axios"
import Swiper from "../lib/swiper/swiper.min.js"
import "../lib/swiper/swiper.min.css"
import BScroll from 'better-scroll'

import Youlike from "../components/Youlike.vue"
import searchBar from "../components/searchBar.vue"
import search from "../components/search.vue"
import loadmores from "../components/loadTopMore.vue"

import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/Index.scss"
import global from "../lib/global.js"



var userid = global.getUserid(),
    token = global.getToken();
var headshow = global.getQueryString("headshow") ? global.getQueryString("headshow") : "";

// $(window).scroll(function(){
//     alert(1);
//     // $(".search").css({
//     //     top:$(this).scrollTop()+'px',
//     // })
//     if ($(window).scrollTop()>100){
//         vm.opactiyShow = true;
//         // $(".search").addClass('searchBGC');
//     }else{
//         vm.opactiyShow = false;
//         // $(".search").removeClass('searchBGC');
//     }
// });

var vm = new Vue({
    el: "#app",
    components: {
        Youlike, searchBar, loadmores,search
    },
    data: {
        swiperSlides: "",
        navs: "",//分类
        themes: "",//品牌馆
        product: [],//首页商品
        pageindex: 1,
        bottomStatus: "",//上拉的状态
        topStatus:"",//下拉刷新的状态
        bottomtext: false,//选择上拉显示的文本
        toptext:"",
        adlist: "",
        opactiyShow:false,
        headshow:headshow,
        isIos:false,
        isAndroid:false,

    },
    created: function () {
        // alert("1");
        this.getdata();
        this.testScoll();
    },
    mounted: function () {
        this.$nextTick(()=>{
            if(this.headshow == 1){
                var searchH = $(".headerBar").outerHeight();
                $(".main").css({
                    "margin-top":searchH
                })
            }else{
                if(global.bIsIphoneOs()){
                    console.log(this.$refs);
                    this.isIos = true;
                    this.$refs.searchTop.style.paddingTop = "3%";
                }else if(global.bIsAndroid()){
                    this.isAndroid = true;
                }
            }
        })
    },
    computed: {
        fistProduct: function () {
            return this.product.filter(function (element) {
                return element.type == 1
            })
        },
        secondProduct: function () {
            return this.product.filter(function (element) {
                return element.type == 2
            })
        },
        thirdProduct: function () {
            return this.product.filter(function (element) {
                return element.type == 3
            })
        }
    },
    methods: {
        // 滚动test
        _initScroll:function(){
            var a1 = $(window).height();
            // a1 = a1-parseInt("100");
            $(".main").height(a1)
            console.log(a1);
            this.mainWrapper = new BScroll(this.$refs.mainWrapper, {
                click: true,
                scrollY: true,
            })
        },
        handlebottomChange: function (status) {
            this.bottomStatus = status;
        },
        loadup: function () {//上拉加载
            this.pageindex += 1 //改变分页数传递给子组件
        },
        handleTopChange: function (status) {
            this.topStatus = status;
        },
        loadTop:function(){ //下拉刷新
            this.pageindex = 1;
            this.getdata();
        },
        getdata: function () {
            axios.get(global.Apipath + "/api/Product/HomePage").then((req) => {
                var data = req.data
                this.navs = data.classlist.slice(0,10);//分类列表
                this.themes = data.brandlist;//品牌列表
                this.product = data.prolist;
                this.swiperSlides = data.bannerlist
                this.adlist = data.adlist
                this.$nextTick(function () {
                    var mySwiper = new Swiper('.swiper-container', {
                        autoplay: 3500,//可选选项，自动滑动
                        pagination: '.swiper-pagination',
                        autoplayDisableOnInteraction: false,
                    })
                    // scroll
                    // this._initScroll();

                    // scroll
                    // this.scroll = new BScroll(this.$refs.wrapper,{})
                    // this.scroll.on('scroll', (pos) => {
                    //     console.log(pos.y);
                    //     // 下拉动作
                    //     if (pos.y > 50) {
                    //         alert('1');
                    //     }
                    //   })
                })
            })

        },
        GoClassifyList: function (id) {
            if(id === '1'){ //品牌
                var data = JSON.stringify({
                    url: global.path + "/page/brandClass.html?classifyid=" + id
                })
                location.href = "boogoo.app://?pushcode=100011&data=" + data
                // location.href = "./brandClass.html?classifyid=" + id;

            }else if(id === '2'){   //分类
                var data = JSON.stringify({
                    url: global.path + "/page/goodsClass.html?classifyid=" + id
                })
                location.href = "boogoo.app://?pushcode=100011&data=" + data
                // location.href = "./goodsClass.html?classifyid=" + id;

                // var data = JSON.stringify({
                //     url: global.path + "/page/test1.html?classifyid=" + id
                // })
                // location.href = "boogoo.app://?pushcode=100002&data=" + data
                // location.href = "./test1.html?classifyid=" + id;

            }else{
                // var data = JSON.stringify({
                //     url: global.path + "/page/ClassifyList.html?classifyid=" + id
                // })
                // location.href = "boogoo.app://?pushcode=100011&data=" + data
                location.href = "./ClassifyList.html?classifyid=" + id;


            }

        },
        GoClassifyTheme: function (brandid) {
            var data = JSON.stringify({
                url: global.path + "/page/ClassifyList.html?brandid=" + brandid
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data
            // location.href = "./ClassifyList.html?brandid=" + brandid
        },
        GoProductDetails: function (id) {
            var data = JSON.stringify({
                url: global.path + "/page/ProductDetails.html?productid=" + id
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data
            // location.href = "./ProductDetails.html?productid=" + id;

        },
        // Gosearch: function () {
        //     var data = JSON.stringify({
        //         type: 0
        //     })
        //     location.href = "boogoo.app://?pushcode=100005"
        // },
        bannerhandle: function (link) {
            var data = JSON.stringify({
                url: link
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data
        },
        testScoll:function(){
            var _this = this;
            // window.onscroll = function(){
            //     // alert("0k");
            //     var t = document.documentElement.scrollTop || document.body.scrollTop;
            //     var top_div = document.querySelector(".search");
            //     // console.log(t);
            //     if( t >= 100 ) {
            //         _this.opactiyShow = true;
            //     } else {
            //         _this.opactiyShow = false;
            //     }
            // }

            $(window).scroll(function(){
                if ($(window).scrollTop()>100){
                    _this.opactiyShow = true;
                }else{
                    _this.opactiyShow = false;
                }
            });

        },

    }
})
