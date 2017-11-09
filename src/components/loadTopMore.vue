<style lang="sass">
$baseFontSize: 75px !default;
@function pxToRem($px){
    @return $px/$baseFontSize*1rem
}
.mint-loadmore-bottom{
    font-size: pxToRem(24px) !important;
    margin-bottom: pxToRem(20px) !important;
    color: #7d7d7e !important;
    img{
        width: pxToRem(30px);
        height: pxToRem(30px);
        vertical-align: text-bottom;
        margin-right: pxToRem(10px)
    }
}
 .mint-loadmore-bottom{
    height: 0.66rem;
    line-height: 0.66rem;
}
.mint-loadmore-top{
    font-size: pxToRem(24px) !important;
    // margin-bottom: pxToRem(20px) !important;
    color: #7d7d7e !important;
    img{
        width: pxToRem(30px);
        height: pxToRem(30px);
        vertical-align: text-bottom;
        margin-right: pxToRem(10px)
    }
}
.mint-loadmore-top{
    // height: 0.6rem;
    // line-height: 0.6rem;
    // margin-top:-0.6rem;
}

</style>
<template>
      <mt-loadmore v-on:bottom-status-change="handleTopChange" :bottom-distance="100" :bottom-method="loadBottom" v-on:top-status-change="handleTopChange2" :top-distance="120" :top-method="loadTop" ref="loadmore">
          <slot>
          </slot>
          <div slot="bottom" class="mint-loadmore-bottom">
               <span v-show="bottomStatus === 'loading'">加载中...</span>
                <span v-show="bottomStatus !== 'loading'">
                    <div v-if="bottom">- 已经到底了哦 -</div>
                    <div v-else><img src="../img/index/up.png" alt=""><span>上滑加载更多</span></div>
                </span>
            </div>
            <div slot="top" class="mint-loadmore-top">
                 <span v-show="topStatus === 'loading'">
                     <mt-spinner type="snake"></mt-spinner>
                 </span>
                  <span v-show="topStatus !== 'loading'">
                      <!-- <div v-if="top">- 已经到底了哦 -</div> -->
                      <div>
                          <img src="../img/index/down.png" alt="">
                          <span>下拉刷新</span>
                      </div>
                  </span>
            </div>
     </mt-loadmore>
</template>
<script>

    export default{
        data(){
            return {
               bottomStatus:"",
               bottom:"",
               topStatus:"",
               top:""
            }
        },
        props:["bottomtext","toptext"],
        watch:{
            bottomtext:function(e){
               this.bottom = e;
            },
            toptext:function(e){
                this.top = e;
            }
        },
        methods:{
             handleTopChange: function handleTopChange(status) {
	            //上拉加载的状态
	            this.bottomStatus = status;
	        },
            loadBottom:function(){
                this.$emit("increment")
                setTimeout(()=> {
                    this.$refs.loadmore.onBottomLoaded();
                }, 1000)
            },
            handleTopChange2:function handleTopChange2(status){
                // 下拉刷新的状态
                this.topStatus = status;
            },
            loadTop:function(){
                this.$emit("refresh")
                setTimeout(()=> {
                    this.$refs.loadmore.onTopLoaded();
                }, 1000)
            }
        }

    }
</script>
