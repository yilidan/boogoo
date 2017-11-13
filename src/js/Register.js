import axios from 'axios';
import global from "../lib/global.js"

import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/Register.scss"

var code = global.getQueryString("code") ? global.getQueryString("code") : "";
var higheruserid = global.getQueryString("higheruserid") ? global.getQueryString("higheruserid") : "";

var vm = new Vue({
    el:"#app",
    data:{
        
    },
    mounted(){
        this.$nextTick(()=>{
            if(code == ""){
                this.weixinAccredit();
            }else{
                this.weixinRegister();
            }
        })
    },
    methods:{
        // 微信授权页    https%3A%2F%2Fshare.boogoo.tv%2Fshare%2Fregister.html
        weixinAccredit:function(){
            let url1 = "https://share.boogoo.tv/share/register.html?higheruserid="+higheruserid;
            let callbackUrl = encodeURIComponent(url1);
            console.log(callbackUrl);
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxac311c8fc2478411&redirect_uri="+callbackUrl+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        },
        // 微信注册
        weixinRegister:function(){
            axios.get(global.Apipath+"/api/user/LoginWx", {
                params: {
                    code:code,
                    higheruserid:higheruserid,
                    deviceid:null,
                    sources:3
                }
            }).then((req) => {
                if(req.data.code == 1000){
                    if(req.data.isFirst){
                        alert("恭喜您，注册成功！");
                    }else{
                        // alert("您已注册！")
                    }
                }
            }, (err) => {
                alert("对不起，请稍后再试！");
            })
        },
        // 下载页
        gotoDownload:function(){
            window.location.href = "https://share.boogoo.tv/share/download.html?higheruserid="+higheruserid;
        },

    },

})
