import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/Share.scss"
import global from "../lib/global.js"

var higheruserid = global.getQueryString("userid") ? global.getQueryString("userid") : "";

var vm = new Vue({
    el:"#app",
    data:{

    },
    mounted:function(){
        this.$nextTick(()=>{
            if(global.bIsIphoneOs()){
                var navTop = document.getElementById("navTop");
                navTop.style.paddingTop = "5%";
                var mainTop = document.body;
                mainTop.style.paddingTop = "5%";
            }
        })
    },
    methods:{
        backUpBtn:function(){
            location.href = "boogoo.app://?pushcode=100006";
        },
        shareBtn:function(){
            // 分享参数 -- 分享标题 分享语 分享配图 分享链接
            var data = JSON.stringify({
                shareTitle:"分享标题注册",
                weixinContent:"微信朋友内容注册",
                weixinFriContent:"微信朋友圈内容注册",
                sinaContent:"微博内容注册",
                url: global.path + "/share/register.html?higheruserid="+higheruserid,
                imgUrl:"https://file.boogoo.tv/homepage/index/4.png",
            })
            location.href = "boogoo.app://?pushcode=100009&data=" + data;
        },
        headShareBtn:function(){
            // 分享参数 -- 分享标题 分享语 分享配图 分享链接
            var data = JSON.stringify({
                shareTitle:"分享标题注册",
                weixinContent:"微信朋友内容注册",
                weixinFriContent:"微信朋友圈内容注册",
                sinaContent:"微博内容注册",
                url: global.path + "/share/register.html?higheruserid="+higheruserid,
                imgUrl:"https://file.boogoo.tv/homepage/index/4.png",
            })
            location.href = "boogoo.app://?pushcode=100009&data=" + data;
        },

    },

})
