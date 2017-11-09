<style lang="sass"  >
$baseFontSize: 75px !default;
@function pxToRem($px){
    @return $px/$baseFontSize*1rem
}
html{
    font-family: "Microsoft Yahei";
    background: #f0f1f0;
}
.youlike{
    overflow:hidden;
    // background-color:#fff;
     h2{
        font-size: pxToRem(24px);
        color: #000;
        height: pxToRem(80px);
        line-height: pxToRem(80px);
        background-color:#fff;
        position: relative;
        border-bottom:1px solid #EDECEC;
        a{
            background: #fff;
            position: absolute;
            left: 50%;
            text-align: center;
            z-index: 10;
            margin-left: pxToRem(-60px);
            font-size:pxToRem(32px);
            img{
                width: pxToRem(20px);
                height: pxToRem(20px);
                padding-right: 5px;
            }
        }

    }
    .box:nth-child(odd){
        // margin-right: 2%;
        margin-right:1%;
        padding-right:1%;
    }
    .box{
         width: 49%;
        background: #ffffff;
        margin-bottom: 1%;
        // margin-bottom: 2%;
        float: left;
        height: pxToRem(500px);
        position: relative;
        img{
            width: 100%;
            height:pxToRem(330px);
        }
        .restriction{
            position: absolute;
            top:57%;
            right:3%;
            z-index: 99;
            color: #EB020E;
            font-size: pxToRem(26px);
        }
        .name{
            display: -webkit-box;
            font-size: pxToRem(28px);
            color:#333;
            margin: pxToRem(10px);
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;

        }
        .info{
            position: absolute;
            width: 95%;
            bottom: 0;
            padding:pxToRem(10px) pxToRem(10px) ;
            .pirces{
                font-size: pxToRem(24px);
                color:#d12b4a;
                margin-top:pxToRem(24px);
                // float:left;
                display:inline-block;
                white-space:nowrap;
                span{
                    font-size: pxToRem(28px);
                }
                span:last-child{
                    margin-left:pxToRem(5px);
                }
            }
            .discount{
                background-color: #EB020E;
                color: #fff;
                font-size: pxToRem(26px) !important;
                padding:0 pxToRem(5px);
                // margin-left: pxToRem(10px);
            }
            div{
                float:right;
                font-size:pxToRem(24px);
                padding-bottom: pxToRem(10px);
                p:nth-child(1){
                    margin-top:pxToRem(24px);
                    color:#bebebe;
                }

            }
        }
    }
}

</style>
<template>
    <div class="youlike">
        <h2><a>猜你喜欢</a></h2>
        <div class="listbox" >
            <div class="box"  v-on:click="Goproduct(item.productid)" v-for='item in datalist'>
                <img :src="item.coverurl+'?imageView2/2/w/400'" alt="">
                <b class="restriction">限购{{item.stock}}件</b>
                <p class="name">{{item.name}}</p>
                <div class="info">
                    <p class="pirces">
                        <span class="discount">{{item.discount}}折</span>
                        <span>¥ {{item.price}}</span>
                    </p>

                        <div>
                            <p>销量：{{item.salesnum}}</p>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios"
import global from "../lib/global.js"
export default {
    data() {
        return {
            datalist: [],
        }
    },
    created: function () {
        this.getdata()

    },
    props:["page"],
    watch:{
        page:function(val){
            // alert(val);
            if(val == '1'){
                // alert("ok123");
                this.datalist = [];
                this.getdata();
            }else{
                this.getdata();
            }
        }
    },
    methods: {
        getdata: function () {
            axios.get(global.Apipath+"/api/Product/GuessYouLike", {
                params: {
                    pagesize: 6,
                    pageindex: this.page
                }
            }).then((req) => {
                var data = req.data
                data.data.forEach(function(element) {
                    this.datalist.push(element)
                }, this);
            })
        },
        Goproduct: function (productid) {
            var data = JSON.stringify({
                url: global.path + "/page/ProductDetails.html?productid=" + productid
            })
            location.href = "boogoo.app://?pushcode=100011&data=" + data
            // location.href = "./ProductDetails.html?productid=" + productid;

        }
    }
}
</script>
