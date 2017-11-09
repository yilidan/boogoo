import $ from "jquery"
import axios from "axios"
import search from "../components/search.vue"

import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/GoodsClass.scss"
import global from "../lib/global.js"

var userid = global.getUserid(),
    token = global.getToken();

var vm = new Vue({
    el:"#app",
    components: {
        search
    },
    data:{
        bannerList:[],
        goodsList:[],
        currentIndex:0,
        goodsDetails:[],
        // 进入页面显示
        currentClassid:'',

    },
    created: function () {
        this.blist();
        this.queryGoodsClass();
    },
    mounted:function(){
        this.$nextTick(()=>{
            var searchH = $(".headerBar").outerHeight();
            var bannerH = $(".banner").height();
            bannerH = searchH+parseInt(bannerH);
            $(".banner").css({
                "margin-top":searchH
            })
            $(".goods").css({
                "top":bannerH
            })
        })
    },
    methods:{
        blist:function(){
            axios.get(global.Apipath + "/api/Product/HeadBanner").then((req) => {
                var data = req.data;
                this.bannerList = data.bannerlist;
                console.log(this.bannerList);
            })
        },
        queryGoodsClass:function(){
            axios.get(global.Apipath + "/api/Product/HomePage").then((req) => {
                var data = req.data;
                this.goodsList = data.classlist;
                console.log(this.goodsList);
                this.goodsList.forEach((item,index)=>{
                    if(item.classid == '1'){
                        return this.goodsList.splice(index,1);
                    }else if(item.classid == '2'){
                        return this.goodsList.splice(index,1);
                    }
                })
                this.currentClassid = this.goodsList[0].classid;
                this.queryGoodsDetails(this.currentClassid);
                console.log(this.goodsList);
            })
        },
        selectMenu:function(index,classid){
            this.currentIndex = index;
            this.queryGoodsDetails(classid);
            console.log(classid);
        },
        queryGoodsDetails:function(classid){
            axios.get(global.Apipath + "/api/Product/ProductCategoryGroupList",{
                params: {
                    classid: classid
                }
            }).then((res) => {
                this.goodsDetails = res.data.data;
                console.log(this.goodsDetails);
            })
        },
        gotoClassifyList:function(item){
            if(item.parentid == "-1"){
                var data = JSON.stringify({
                    url: global.path + "/page/ClassifyList.html?classifyid="+item.classid+"&brandid="+item.searchid
                })
                location.href = "boogoo.app://?pushcode=100011&data=" + data
                // location.href = "./ClassifyList.html?classifyid="+item.classid+"&brandid="+item.searchid;
            }else{
                var data = JSON.stringify({
                    url: global.path + "/page/ClassifyList.html?classifyid="+item.classid+"&categoryid="+item.searchid
                })
                location.href = "boogoo.app://?pushcode=100011&data=" + data
                // location.href = "./ClassifyList.html?classifyid="+item.classid+"&categoryid="+item.searchid;
            }

        },
        bannerhandle: function (link) {
            var data = JSON.stringify({
                url: link
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data;
        },

    },

})
