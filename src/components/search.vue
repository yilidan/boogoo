<template lang="html">
    <div class="headerBar" ref="searchTop">
        <i @click="backUpBtn()" class="iconfont icon-back"></i>
        <div class="searchBox" @click="Gosearch()">
            <i class="iconfont icon-icon19"></i>
            <i class="iconfont icon-scan1" @click.stop="richScan()"></i>
        </div>
    </div>
</template>

<script>
import global from "../lib/global.js"
export default {
    data(){
        return{

        }
    },
    mounted: function () {
        this.$nextTick(()=>{
            if(global.bIsIphoneOs()){
                console.log(this.$refs);
                this.$refs.searchTop.style.paddingTop = "5%";
            }
        })
    },
    methods:{
        // 后退
        backUpBtn:function(){
            var data = JSON.stringify({
                type: 0
            })
            location.href = "boogoo.app://?pushcode=100006";
        },
        // 搜索
        Gosearch: function () {
            var data = JSON.stringify({
                type: 0
            })
            location.href = "boogoo.app://?pushcode=100005";
        },
        // 扫一扫
        richScan:function(){
            var data = JSON.stringify({
                type: 0
            })
            location.href = "boogoo.app://?pushcode=100010";
        },

    },

}
</script>

<style lang="sass">
    $baseFontSize: 75px !default;
    @function pxToRem($px){
        @return $px/$baseFontSize*1rem
    }
    .searchBox{
        display: inline-block;
        width: 80%;
        height: pxToRem(60px);
        line-height: pxToRem(60px);
        margin:0 auto;
        background-color: rgba(213, 213, 213,.42);
        border-radius: .1rem;
        vertical-align:middle;
        .icon-icon19{
            font-size:pxToRem(32px);
            float:left;
            margin-left:pxToRem(10px);
            color:#666;
        }
        .icon-scan1{
            font-size:pxToRem(32px);
            float:right;
            margin-right:pxToRem(10px);
            color:#666;
        }
    }
    .headerBar{
        width: 100%;
        height: pxToRem(88px);
        line-height: pxToRem(87px);
        background-color: #fff;
        position: fixed;
        top:0;
        left:0;
        z-index: 210;
        // -webkit-transform: translateZ(0);
    }
    .icon-back{
        color:#333;
        font-size:pxToRem(48px);
        vertical-align:middle;
        padding-left: pxToRem(20px);
        padding-right: pxToRem(20px);
    }

    // 适配iphoneX
    @media only screen and (device-width: 375px) and (device-height: 812px) and
    (-webkit-device-pixel-ratio: 3){
        .headerBar{
            height:pxToRem(132px);
            line-height:pxToRem(175px);
        }
    }
</style>
