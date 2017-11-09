import Vue from "../lib/vue/vue.min.js"
import "../lib/flexibel/flexible.debug.js"
import "../css/style.css"
import "../css/Logistics.scss"
import global from "../lib/global.js"
import axios from "axios"
var userid = global.getUserid(),
    token = global.getToken(),
    couriernum = global.getQueryString("couriernum"),
    orderid = global.getQueryString("orderid")

new Vue({
    el: "#app",
    data: {
        list:"",
        firstbox:"firstbox",
        imgurl:"",
        couriernum:couriernum
    },
    created: function () {
        this.getdata()
    },
    methods: {
        getdata: function () {
            axios.get(global.Apipath+"/api/Product/CourierInfo", {
                params: {
                    userid: userid,
                    token: token,
                    couriernum: couriernum,
                    orderid:orderid
                }
            }).then((req)=>{
                if(req.status==200){
                    if(req.data.code==1000){
                        var data=req.data.data;
                        this.imgurl=data.imgurl
                        this.list=JSON.parse(data.courierinfo).Traces.reverse()
                    }
                }
            },(err)=>{

            })
        }
    }
})
