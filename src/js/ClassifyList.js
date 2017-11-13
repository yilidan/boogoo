import $ from "jquery"
import axios from "axios"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/ClassifyList.scss"
import global from "../lib/global.js"
import search from "../components/Search.vue"
import loadmores from "../components/loadMore.vue"
import {Indicator} from 'mint-ui';

var userid = global.getUserid(),
    token = global.getToken();
var classid = global.getQueryString("classifyId"),
    categoryid = global.getQueryString("categoryid");
var brandid = global.getQueryString("brandid") ? global.getQueryString("brandid") : "";

var vm = new Vue({
    el: "#app",
    components: {
        search,
        loadmores
    },
    data: {
        bannerList:[],
        activeBtn:0,
        sortXS:0,
        sortJG:0,
        sortXS2:null,
        type:0,
        sorttype:null,
        fixedTop:false,
        popupScreen:false,
        brandScreenList:[],  //品牌筛选
        currentScreenBtn:-1,  //当前筛选选择

        Actives: 0,//当前品牌索引
        moreShow: false,//品牌层显示
        bottomStatus: "", //下拉加载状态、
        pageindex: 1,//分页
        ClassifyTheme: true, //显示整个分类，当是主题时隐藏
        classlist: "", //分类列表
        productlist: [],//商品列表
        pros: true, //商品列表的class
        brandids: false,//商品列表的class
        bottomtext: false,
        brandid: "",//当前显示的品牌,
        ifBranid:true,//有品牌id时不显示筛选

    },
    created: function () {
        // this.init();
        this.blist();
        this.getlistdata();
        this.queryScreenCon();
    },
    mounted:function(){
        this.$nextTick(()=>{
            var tit = document.getElementById("hotWord");
            var searchH = $(".headerBar").outerHeight();
            var titleTop = tit.offsetTop - searchH;
            console.log(titleTop);
            $(".banner").css({
                "margin-top":searchH
            })
            $(window).scroll(function(){
                if ($(window).scrollTop()>titleTop){
                    $("#hotWord").css({
                        'position': "fixed",
                        'top': searchH-1,
                        'left': 0,
                        'z-index': 200
                    })
                    // vm.fixedTop = true;
                }else{
                    // vm.fixedTop = false;
                    $("#hotWord").css({
                        'position': "inherit",
                        // 'top': searchH,
                        // 'left': 0,
                        // 'z-index': 200
                    })
                }
            });
            console.log(brandid);
            if(brandid == "" || brandid == 'undefined'){
                this.ifBranid = true;
            }else{
                this.ifBranid = false;
            }
        })
    },
    methods: {
        blist:function(){
            axios.get(global.Apipath + "/api/Product/HeadBanner").then((req) => {
                var data = req.data
                this.bannerList = data.bannerlist;
                console.log(this.bannerList);
            })
        },
        Gosearch: function () {
            var data
            if (classid) {
                data = JSON.stringify({
                    type: 1,
                    classid: classid
                })
            }
            if (brandid) {
                data = JSON.stringify({
                    type: 2,
                    brandid: brandid
                })
            }
            location.href = "boogoo.app://?pushcode=100005&data=" + data
        },
        handleTopChange: function (status) {//上拉加载的状态
            this.bottomStatus = status;
        },
        loadup: function () { //上拉加载，改变分页数传递给子组件
            this.pageindex += 1;
            this.getlistdata(1);
        },
        // 不同状态排列
        activeAlign(status){
            this.pageindex = 1;
            // this.allLoaded = false;
            if(status == '0'){
                this.activeBtn = 0;
                this.type = 0;
                this.sorttype = null;
                this.sortXS2 = null;
                this.sortXS=0;
                this.sortJG=0;
                // this.productlist = [];
                this.getlistdata(2);
            }else if(status == '1'){
                this.activeBtn = 1;
                this.type = 1;
                this.sortJG=0;
                if(this.sortXS == 0){
                    this.sortXS=1;
                    this.sortXS2 = 0;
                    this.sorttype = 0;
                    // this.productlist = [];
                    this.getlistdata(2);
                }else{
                    this.sortXS=0;
                    this.sortXS2 = 1;
                    this.sorttype = 1;
                    // this.productlist = [];
                    this.getlistdata(2);
                }
            }else{
                this.activeBtn = 2;
                this.type = 2;
                this.sortXS=0;
                if(this.sortJG == 0){
                    this.sortJG=1;
                    this.sortXS2 = 3;
                    this.sorttype = 0;
                    // this.productlist = [];
                    this.getlistdata(2);
                }else{
                    this.sortJG=0;
                    this.sortXS2 = 4;
                    this.sorttype = 1;
                    // this.productlist = [];
                    this.getlistdata(2);
                }
            }
        },
        active: function (index, brandid) {//分类点击事件

            if (this.Actives == index) {
                //当再次点击当前分类时，将当前分类下的list数据清空,
                //再后面执行请求
                this.productlist[index].list = []
            }

            document.querySelector(".dropDownbg img").classList.remove("rotate")
            this.pageindex = 1
            this.brandid = brandid
            this.Actives = index;
            this.cacheData(index, brandid)
            // global.openScoll()

        },
        cacheData: function (index, brandid) {
            /**
             * 通过index知道分类的索引号，获取数据
             * 如果list的长度为0，代表无数据，则去请求数据
             */
            var indexdata = this.productlist[index]
            if (indexdata.list.length == 0) {
                this.getlistdata(brandid)
            } else {
                return false
            }

        },
        getlistdata: function (isloadUp) {//获取商品列表
            axios.get(global.Apipath + "/api/Product/ProductSortList", {
                params: {
                    token: token,
                    userid: userid,
                    classid: classid,
                    brandid: brandid,
                    categoryid:categoryid,
                    pagesize: 10,
                    pageindex: this.pageindex,
                    type: this.type,
                    sorttype: this.sorttype,
                }
            }).then((req) => {
                var data = req.data
                if (data.code == 1000) {
                    // this.pushModel(brandid, data.data);
                    // this.productlist = data.data;
                    // data.data.forEach(function(element) {
                    //     this.productlist.push(element)
                    // }, this);
                    if(isloadUp === 1){
                        this.productlist = this.productlist.concat(data.data);
                    }else{
                        this.productlist = data.data;
                    }
                    this.setBottomtext(data.data);
                } else {
                    alert("ProductList" + data.code);
                }
            }, (err) => {
                alert("ProductList err");
            })
        },
        queryScreenCon:function(){
            axios.get(global.Apipath + "/api/Product/BrandByClassId",{
                params: {
                    classid: classid,
                    categoryid:categoryid,
                }
            }).then((req)=>{
                var data = req.data;
                this.brandScreenList = data.data;
                console.log(this.brandScreenList);
            },(err)=>{

            })
        },
        screenSelectBtn:function(sBrandid,index){
            if(sBrandid == "all"){
                this.currentScreenBtn = -1;
                brandid = "";
            }else{
                this.currentScreenBtn = index;
                brandid = sBrandid;
            }
            this.popupScreen = false;
            this.getlistdata();
            console.log(brandid);
        },
        setBottomtext: function (datas) {
            //判断数据的个数，用来显示底部文本
            if (datas.length == 0) {
                this.bottomtext = true //显示已经到底了
            } else {
                this.bottomtext = false
            }
        },
        GoProductDetails: function (productId) {
            var data = JSON.stringify({
                url: global.path + "/page/ProductDetails.html?productid=" + productId
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data
            // location.href = "./ProductDetails.html?productid=" + productId

        },
        // banner
        bannerhandle: function (link) {
            var data = JSON.stringify({
                url: link
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data;
        },
        // 滚动吸顶效果
        scrollCeil:function(){

        },

    }

})
