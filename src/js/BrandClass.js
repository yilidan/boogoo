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
        limitMore:'更多',
        limitBy:null,
        currentIndex:-1,
        isListShow:false,

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
    computed:{
        // filterBrand:function(){
        //     var _this = this;
        //     _this.brandList.forEach((item,index)=>{
        //         console.log(item.brandlist);
        //          return item.brandlist.slice(0,9);
        //     })
        // }
    },
    methods:{
        brandJQ:function(list1){
            // if(this.currentIndex == index1){
            //     return list1.slice(0,this.limitBy);
            // }else{
            //     return list1.slice(0,9);
            // }
            if(list1.checked){
                return list1.brandlist.slice(0,this.limitBy);
            }else{
                return list1.brandlist.slice(0,9);
            }

        },
        moreBtn:function(item){
            // this.currentIndex = index2;
            this.limitBy = item.brandlist.length;
            console.log(item);
            if(typeof(item.checked) == "undefined"){
                this.$set(item,"checked",true);
            }else{
                item.checked = !item.checked;
            }

        },
        packUpBtn:function(){
            this.currentIndex = -1;
        },
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
                // this.brandList.forEach((item,index)=>{
                //     console.log(item.brandlist.length);
                //     if(item.brandlist.length >= 9){
                //         return item.brandlist.splice(9,item.brandlist.length);
                //         console.log(item.brandlist);
                //
                //     }
                //     console.log(item.brandlist);
                // })
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
