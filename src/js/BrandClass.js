import $ from "jquery"
import axios from "axios"
import search from "../components/search.vue"

import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/BrandClass.scss"
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
        brandList:[],

    },
    mounted:function(){
        this.$nextTick(()=>{
            var searchH = $(".headerBar").outerHeight();
            $(".banner").css({
                "margin-top":searchH
            })
        })
    },
    created: function () {
        this.blist();
        this.queryBrand();
    },
    methods:{
        blist:function(){
            axios.get(global.Apipath + "/api/Product/HeadBanner").then((req) => {
                var data = req.data
                this.bannerList = data.bannerlist;
                console.log(this.bannerList);
            })
        },
        queryBrand:function(){
            axios.get(global.Apipath + "/api/Product/ProductBrandGroupList").then((req) => {
                var data1 = req.data
                this.brandList = data1.data;
                console.log(this.brandList);
            })
        },
        // 点击品牌跳转
        goToClassifyList:function(brandid){
            var data = JSON.stringify({
                url: global.path + "/page/ClassifyList.html?brandid=" + brandid
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data

            console.log(brandid);
            // location.href = "./ClassifyList.html?brandid=" + brandid;
        },
        bannerhandle: function (link) {
            var data = JSON.stringify({
                url: link
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data;
        },

    }

})
