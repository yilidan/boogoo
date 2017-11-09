/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _global = __webpack_require__(29);

	var _global2 = _interopRequireDefault(_global);

	__webpack_require__(40);

	__webpack_require__(41);

	__webpack_require__(228);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 29:
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var global = {
		path: "https://share.boogoo.tv",
		Apipath: 'https://app.boogoo.tv:444',
		getUserid: function getUserid() {
			var userid = global.getQueryString("userId");
			return userid ? userid : "";
			// return 10043;
		},
		getToken: function getToken() {
			var token = global.getQueryString("token");
			return token ? token : "";
			// return "31F1D0573D6B0AADCE03E4F18FF0703B"
		},
		getQueryString: function getQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		sUserAgent: function sUserAgent() {
			return navigator.userAgent.toLowerCase();
		},
		bIsIphoneOs: function bIsIphoneOs() {
			var sUserAgent = global.sUserAgent();
			return sUserAgent.match(/iphone/i) == "iphone";
		},
		bIsAndroid: function bIsAndroid() {
			var sUserAgent = global.sUserAgent();
			return sUserAgent.match(/android/i) == "android";
		},
		regist: function regist() {
			location.href = "boogoo.app://?pushcode=100001";
		},
		setCookie: function setCookie(c_name, value) {
			var oDate = new Date();
			var Days = 30;
			oDate.setDate(oDate.getTime() + Days * 24 * 60 * 60 * 1000);
			document.cookie = c_name + "=" + escape(value) + (oDate == null ? "" : ";expires=" + oDate.toGMTString());
		},
		getCookie: function getCookie(c_name) {
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) {
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";", c_start);
					if (c_end == -1) c_end = document.cookie.length;
					return unescape(document.cookie.substring(c_start, c_end));
				}
			}
			return null;
		},

		//乘法精确计算
		accMul: function accMul(arg1, arg2) {
			var m = 0,
			    s1 = arg1.toString(),
			    s2 = arg2.toString();
			try {
				m += s1.split(".")[1].length;
			} catch (e) {}
			try {
				m += s2.split(".")[1].length;
			} catch (e) {}
			return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
		},

		forbidScoll: function forbidScoll() {
			//禁止滚动
			var screenHeight = window.innerHeight;
			var el = document.querySelector("#app");
			el.style.height = screenHeight + "px";
			el.style.overflow = "hidden";
		},
		openScoll: function openScoll() {
			//取消禁止滚动
			var el = document.querySelector("#app");
			el.style.height = "";
			el.style.overflow = "";
		},
		toast: function toast(that, text) {
			//that vue实例对象
			that.$toast({
				message: text,
				position: 'center',
				duration: 1500
			});
		}

	};
	exports.default = global;

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),

/***/ 40:
/***/ (function(module, exports) {

	'use strict';

	;(function (win, lib) {
	    var doc = win.document;
	    var docEl = doc.documentElement;
	    var metaEl = doc.querySelector('meta[name="viewport"]');
	    var flexibleEl = doc.querySelector('meta[name="flexible"]');
	    var dpr = 0;
	    var scale = 0;
	    var tid;
	    var flexible = lib.flexible || (lib.flexible = {});

	    if (metaEl) {
	        console.warn('将根据已有的meta标签来设置缩放比例');
	        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
	        if (match) {
	            scale = parseFloat(match[1]);
	            dpr = parseInt(1 / scale);
	        }
	    } else if (flexibleEl) {
	        var content = flexibleEl.getAttribute('content');
	        if (content) {
	            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
	            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
	            if (initialDpr) {
	                dpr = parseFloat(initialDpr[1]);
	                scale = parseFloat((1 / dpr).toFixed(2));
	            }
	            if (maximumDpr) {
	                dpr = parseFloat(maximumDpr[1]);
	                scale = parseFloat((1 / dpr).toFixed(2));
	            }
	        }
	    }

	    if (!dpr && !scale) {
	        var isAndroid = win.navigator.appVersion.match(/android/gi);
	        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
	        var devicePixelRatio = win.devicePixelRatio;
	        if (isIPhone) {
	            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
	            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
	                dpr = 3;
	            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
	                dpr = 2;
	            } else {
	                dpr = 1;
	            }
	        } else {
	            // 其他设备下，仍旧使用1倍的方案
	            dpr = 1;
	        }
	        scale = 1 / dpr;
	    }

	    docEl.setAttribute('data-dpr', dpr);
	    if (!metaEl) {
	        metaEl = doc.createElement('meta');
	        metaEl.setAttribute('name', 'viewport');
	        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
	        if (docEl.firstElementChild) {
	            docEl.firstElementChild.appendChild(metaEl);
	        } else {
	            var wrap = doc.createElement('div');
	            wrap.appendChild(metaEl);
	            doc.write(wrap.innerHTML);
	        }
	    }

	    function refreshRem() {
	        var width = docEl.getBoundingClientRect().width;
	        if (width / dpr > 540) {
	            width = 540 * dpr;
	        }
	        var rem = width / 10;
	        docEl.style.fontSize = rem + 'px';
	        flexible.rem = win.rem = rem;
	    }

	    win.addEventListener('resize', function () {
	        clearTimeout(tid);
	        tid = setTimeout(refreshRem, 300);
	    }, false);
	    win.addEventListener('pageshow', function (e) {
	        if (e.persisted) {
	            clearTimeout(tid);
	            tid = setTimeout(refreshRem, 300);
	        }
	    }, false);

	    if (doc.readyState === 'complete') {
	        doc.body.style.fontSize = 12 * dpr + 'px';
	    } else {
	        doc.addEventListener('DOMContentLoaded', function (e) {
	            doc.body.style.fontSize = 12 * dpr + 'px';
	        }, false);
	    }

	    refreshRem();

	    flexible.dpr = win.dpr = dpr;
	    flexible.refreshRem = refreshRem;
	    flexible.rem2px = function (d) {
	        var val = parseFloat(d) * this.rem;
	        if (typeof d === 'string' && d.match(/rem$/)) {
	            val += 'px';
	        }
	        return val;
	    };
	    flexible.px2rem = function (d) {
	        var val = parseFloat(d) / this.rem;
	        if (typeof d === 'string' && d.match(/px$/)) {
	            val += 'rem';
	        }
	        return val;
	    };
	})(window, window['lib'] || (window['lib'] = {}));

/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(42);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!!./style.css", function() {
				var newContent = require("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports


	// module
	exports.push([module.id, "/* http://meyerweb.com/eric/tools/css/reset/\n   v2.0 | 20110126\n   License: none (public domain)\n*/\n\nhtml, body, div, span, applet, object, iframe,\nh1, h2, h3, h4, h5, h6, p, blockquote, pre,\na, abbr, acronym, address, big, cite, code,\ndel, dfn, em, img, ins, kbd, q, s, samp,\nsmall, strike, strong, sub, sup, tt, var,\nb, u, i, center,\ndl, dt, dd, ol, ul, li,\nfieldset, form, label, legend,\ntable, caption, tbody, tfoot, thead, tr, th, td,\narticle, aside, canvas, details, embed,\nfigure, figcaption, footer, header, hgroup,\nmenu, nav, output, ruby, section, summary,\ntime, mark, audio, video,input {\n    margin: 0;\n    padding: 0;\n    border: 0;\n    font-size: 100%;\n    font-family:Arial,'Microsoft YaHei'; \n    font-weight: normal;\n}\n/* HTML5 display-role reset for older browsers */\narticle, aside, details, figcaption, figure,\nfooter, header, hgroup, menu, nav, section {\n    display: block;\n}\nol, ul {\n    list-style: none;\n}\nblockquote, q {\n    quotes: none;\n}\nblockquote:before, blockquote:after,\nq:before, q:after {\n    content: '';\n    content: none;\n}\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\n.clear{\n    clear: both;\n}\na,button,input,optgroup,select,textarea,span,div {\n\n    -webkit-tap-highlight-color:rgba(0,0,0,0); \n    \n}\ninput, textarea{-webkit-appearance: none;}\na { \n    text-decoration:none ;\n    outline: none \n} \n\n\n.mint-toast-text{\n    font-size: 0.4rem !important;\n}\n.mint-toast{\n    padding: 0.26rem !important;\n    z-index: 3000 !important;\n}\n.mint-spinner-snake{\n    margin: 0 auto !important;\n    margin-top: 0.11rem !important;\n    width: 0.4rem !important;\n    height: 0.4rem !important;\n}\n\n", ""]);

	// exports


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(229);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./serviceHelp.scss", function() {
				var newContent = require("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./serviceHelp.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports


	// module
	exports.push([module.id, "html {\n  font-family: \"Microsoft Yahei\";\n  background: #fff; }\n\n.green {\n  color: #70AD47; }\n\n.imgHelp {\n  width: 70% !important; }\n\n.hearder {\n  width: 100%;\n  height: 5.73333rem;\n  line-height: 5.73333rem;\n  text-align: center;\n  border-bottom: 0.13333rem solid #ececec; }\n  .hearder img {\n    width: 4.2rem;\n    height: 4.30667rem;\n    vertical-align: middle; }\n\n.content {\n  border-bottom: 0.01333rem solid #ececec;\n  padding-left: 0.26667rem; }\n  .content span {\n    display: inline-block;\n    font-size: 0.37333rem;\n    padding: 0.26667rem 0;\n    font-weight: bold; }\n  .content img {\n    width: 0.28rem;\n    height: 0.28rem;\n    vertical-align: text-top; }\n\n.content3 {\n  margin-top: 0.13333rem;\n  padding-left: 0.13333rem; }\n  .content3 h3 {\n    padding-left: 0; }\n  .content3 .blackCir {\n    display: inline-block;\n    width: 0.2rem;\n    height: 0.2rem;\n    background-color: #000;\n    border-radius: 50%;\n    margin-right: 0.13333rem; }\n  .content3 .greenCir {\n    display: inline-block;\n    width: 0.2rem;\n    height: 0.2rem;\n    background-color: #70AD47;\n    border-radius: 50%;\n    margin-right: 0.13333rem; }\n  .content3 p:first-child {\n    padding-left: 0.2rem; }\n  .content3 p {\n    padding-left: 0.53333rem;\n    line-height: 1.5; }\n\n.content1 li {\n  padding-left: 0.64rem;\n  padding-right: 0.33333rem;\n  font-size: 0.37333rem;\n  color: #000; }\n  .content1 li p {\n    line-height: 1.5; }\n  .content1 li img {\n    margin: 0.2rem 0;\n    width: 100%;\n    vertical-align: middle; }\n\n.tableClass {\n  width: 95%;\n  height: auto;\n  border-right: 1px solid #000;\n  border-bottom: 1px solid #000;\n  margin: 0.13333rem 0;\n  margin-left: 0.26667rem; }\n  .tableClass td {\n    border-left: 1px solid #000;\n    border-top: 1px solid #000; }\n", ""]);

	// exports


/***/ })

/******/ });