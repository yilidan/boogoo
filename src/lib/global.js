
var global = {
	path: "https://share.boogoo.tv",
	Apipath: 'https://app.boogoo.tv:444',
	getUserid: function () {
		var userid = global.getQueryString("userId")
		return userid ? userid : ""
		// return 10043;
	},
	getToken: function () {
		var token = global.getQueryString("token")
		return token ? token : ""
		// return "31F1D0573D6B0AADCE03E4F18FF0703B"
	},
	getQueryString: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return unescape(r[2]);
		return null;
	},
	sUserAgent: function () {
		return navigator.userAgent.toLowerCase()
	},
	bIsIphoneOs: function () {
		var sUserAgent = global.sUserAgent()
		return sUserAgent.match(/iphone/i) == "iphone"
	},
	bIsAndroid: function () {
		var sUserAgent = global.sUserAgent()
		return sUserAgent.match(/android/i) == "android"
	},
	regist: function () {
		location.href = "boogoo.app://?pushcode=100001";
	},
	setCookie(c_name, value) {
		var oDate = new Date();
		var Days = 30;
		oDate.setDate(oDate.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = c_name + "=" + escape(value) +
			((oDate == null) ? "" : ";expires=" + oDate.toGMTString())
	},
	getCookie(c_name) {
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=")
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1
				c_end = document.cookie.indexOf(";", c_start)
				if (c_end == -1) c_end = document.cookie.length
				return unescape(document.cookie.substring(c_start, c_end))
			}
		}
		return null
	},
	//乘法精确计算
	accMul(arg1, arg2) {
		var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
		try { m += s1.split(".")[1].length } catch (e) { }
		try { m += s2.split(".")[1].length } catch (e) { }
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},
	forbidScoll: function () {  //禁止滚动
		var screenHeight = window.innerHeight
		var el = document.querySelector("#app")
		el.style.height = screenHeight + "px"
		el.style.overflow = "hidden"

	},
	openScoll: function () {//取消禁止滚动
		var el = document.querySelector("#app")
		el.style.height = ""
		el.style.overflow = ""

	},
	toast: function (that, text) {
		//that vue实例对象
		that.$toast({
			message: text,
			position: 'center',
			duration: 1500
		})
	}

}
export default global;
