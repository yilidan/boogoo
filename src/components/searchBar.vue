<template lang="html">
    <div class="searchBoxhome" @click="Gosearch">
        <i class="iconfont icon-icon19"></i>
        <i class="iconfont icon-scan1" @click.stop="richScan"></i>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        // 搜索
        Gosearch: function () {
            // var data = JSON.stringify({
            //     type: 0
            // })
            location.href = "boogoo.app://?pushcode=100005"
        },
        // 扫一扫
        richScan:function(){
            var data = JSON.stringify({
                type: 0
            })
            location.href = "boogoo.app://?pushcode=100010"
        },

    },

}
</script>

<style lang="sass">
    $baseFontSize: 75px !default;
    @function pxToRem($px){
        @return $px/$baseFontSize*1rem
    }
    .searchBoxhome{
        display: inline-block;
        width: 90%;
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
            color:#999;
        }
        .icon-scan1{
            font-size:pxToRem(32px);
            float:right;
            margin-right:pxToRem(10px);
            color:#999;
        }
    }
</style>
