import axios from 'axios'
import global from "../lib/global.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/personHome.scss"
import loadmores from "../components/loadMore.vue"

var anchorid = global.getQueryString("anchorid") ? global.getQueryString("anchorid") : "";
var userid = global.getQueryString("userid") ? global.getQueryString("userid") : "";

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
    },
    mounted(){
        this.$nextTick(()=>{
            this.queryAnchorInfo();
            this.queryAnchorProduct();
        })

    },
    methods:{
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
