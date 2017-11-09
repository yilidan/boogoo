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

	var _stringify = __webpack_require__(45);

	var _stringify2 = _interopRequireDefault(_stringify);

	__webpack_require__(40);

	__webpack_require__(41);

	__webpack_require__(206);

	var _axios = __webpack_require__(2);

	var _axios2 = _interopRequireDefault(_axios);

	var _global = __webpack_require__(29);

	var _global2 = _interopRequireDefault(_global);

	var _Youlike = __webpack_require__(118);

	var _Youlike2 = _interopRequireDefault(_Youlike);

	var _loadMore = __webpack_require__(63);

	var _loadMore2 = _interopRequireDefault(_loadMore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var userid = _global2.default.getUserid(),
	    token = _global2.default.getToken();
	var orderid = _global2.default.getQueryString("orderid") ? _global2.default.getQueryString("orderid") : '';

	// test
	// userid= "43019";
	// token="BADC1D69EA8349189854E58E4FCFAFDE";
	// orderid="171030151209624258851";

	var vm = new Vue({
	    el: "#app",
	    components: { Youlike: _Youlike2.default, loadmores: _loadMore2.default },
	    data: {
	        bottomStatus: "", //上拉加载是更新的状态
	        datas: "",
	        pageindex: 1,
	        bottomtext: false,
	        paymentTime: false, //支付时间
	        deliverTime: false, //发货时间
	        paybtn: false, //是否显示付款按钮
	        Confirmbtn: false, //是否显示确定收货按钮,
	        showparcelState: false //是否显示运送状态
	    },
	    created: function created() {
	        this.getdata();
	    },
	    methods: {
	        handleTopChange: function handleTopChange(status) {
	            this.bottomStatus = status;
	        },
	        loadup: function loadup() {
	            this.pageindex += 1;
	        },
	        getdata: function getdata() {
	            var _this = this;

	            _axios2.default.get(_global2.default.Apipath + "/api/Product/ProductOrderInfo", {
	                params: {
	                    userid: userid,
	                    token: token,
	                    orderid: orderid
	                }
	            }).then(function (req) {
	                var data = req.data;
	                if (data.code == 1000) {
	                    _this.datas = data.data;
	                    _this.timeinfo();
	                    _this.showbtn();
	                }
	            }, function (err) {
	                alert("ProductOrderInf err");
	            });
	        },
	        showbtn: function showbtn() {
	            if (this.datas.orderstate == 0) {
	                this.paybtn = true;
	            } else if (this.datas.orderstate == 2) {
	                this.Confirmbtn = true;
	                this.showparcelState = true;
	            }
	        },
	        timeinfo: function timeinfo() {
	            /**
	             * 当状态不等于0时候,显示付款时间
	             * 当状态不等于0和1时候,显示发货时间
	             */
	            if (this.datas.orderstate != 0) {
	                this.paymentTime = true;
	            }
	            if (this.datas.orderstate != 0 && this.datas.orderstate != 1) {
	                this.deliverTime = true;
	            }
	        },
	        GoLogistics: function GoLogistics() {
	            var data = (0, _stringify2.default)({
	                url: this.datas.courierlink + "&orderid=" + orderid
	            });
	            location.href = "boogoo.app://?pushcode=100002&data=" + data;
	            // location.href = "./Logistics.html?couriernum=0&orderid="+orderid
	        },
	        pay: function pay() {
	            //支付
	            var data = (0, _stringify2.default)({
	                orderlist: this.datas.orderid,
	                amount: this.datas.totalprice,
	                num: this.datas.prolist[0].num + "件",
	                productname: this.datas.prolist[0].name,
	                entertype: '1',
	                link: _global2.default.path + "/page/ProductDetails.html?productid=" + this.datas.prolist[0].productid
	            });
	            location.href = "boogoo.app://?pushcode=100004&data=" + data;
	        },
	        confirm: function confirm() {
	            var _this2 = this;

	            //确认收货
	            _axios2.default.get(_global2.default.Apipath + "/api/Product/ConfirmReceipt", {
	                params: {
	                    userid: userid,
	                    token: token,
	                    orderid: this.datas.orderid
	                }
	            }).then(function (req) {
	                var data = req.data;
	                if (data.code == 1000) {
	                    _this2.getdata();
	                } else {
	                    alert("ConfirmReceipt" + data.code);
	                }
	            }, function (err) {
	                alert("ConfirmReceipt err");
	            });
	        }
	    }
	});

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
	var bind = __webpack_require__(5);
	var Axios = __webpack_require__(7);
	var defaults = __webpack_require__(8);

	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);

	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);

	  // Copy context to instance
	  utils.extend(instance, context);

	  return instance;
	}

	// Create the default instance to be exported
	var axios = createInstance(defaults);

	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;

	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};

	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(26);
	axios.CancelToken = __webpack_require__(27);
	axios.isCancel = __webpack_require__(23);

	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(28);

	module.exports = axios;

	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var bind = __webpack_require__(5);
	var isBuffer = __webpack_require__(6);

	/*global toString:true*/

	// utils is a library of generic helper functions non-specific to axios

	var toString = Object.prototype.toString;

	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}

	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}

	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}

	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}

	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}

	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}

	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}

	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}

	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}

	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}

	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}

	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}

	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}

	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}

	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  navigator.product -> 'ReactNative'
	 */
	function isStandardBrowserEnv() {
	  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
	    return false;
	  }
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined'
	  );
	}

	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }

	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }

	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}

	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }

	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}

	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}

	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isBuffer: isBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ }),

/***/ 5:
/***/ (function(module, exports) {

	'use strict';

	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ }),

/***/ 6:
/***/ (function(module, exports) {

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */

	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	module.exports = function (obj) {
	  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
	}

	function isBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
	}


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var defaults = __webpack_require__(8);
	var utils = __webpack_require__(4);
	var InterceptorManager = __webpack_require__(20);
	var dispatchRequest = __webpack_require__(21);
	var isAbsoluteURL = __webpack_require__(24);
	var combineURLs = __webpack_require__(25);

	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}

	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }

	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	  config.method = config.method.toLowerCase();

	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }

	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);

	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });

	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });

	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }

	  return promise;
	};

	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});

	module.exports = Axios;


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(4);
	var normalizeHeaderName = __webpack_require__(10);

	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};

	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}

	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(11);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(11);
	  }
	  return adapter;
	}

	var defaults = {
	  adapter: getDefaultAdapter(),

	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],

	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],

	  timeout: 0,

	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',

	  maxContentLength: -1,

	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};

	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};

	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  defaults.headers[method] = {};
	});

	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});

	module.exports = defaults;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	var utils = __webpack_require__(4);
	var settle = __webpack_require__(12);
	var buildURL = __webpack_require__(15);
	var parseHeaders = __webpack_require__(16);
	var isURLSameOrigin = __webpack_require__(17);
	var createError = __webpack_require__(13);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(18);

	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;

	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }

	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;

	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }

	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }

	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

	    // Set the request timeout in MS
	    request.timeout = config.timeout;

	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }

	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }

	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };

	      settle(resolve, reject, response);

	      // Clean up request
	      request = null;
	    };

	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config, null, request));

	      // Clean up request
	      request = null;
	    };

	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
	        request));

	      // Clean up request
	      request = null;
	    };

	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(19);

	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;

	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }

	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }

	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }

	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
	        if (config.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }

	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }

	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }

	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }

	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }

	    if (requestData === undefined) {
	      requestData = null;
	    }

	    // Send the request
	    request.send(requestData);
	  });
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var createError = __webpack_require__(13);

	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response.request,
	      response
	    ));
	  }
	};


/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var enhanceError = __webpack_require__(14);

	/**
	 * Create an Error with the specified message, config, error code, request and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, request, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, request, response);
	};


/***/ }),

/***/ 14:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 * @param {Object} [request] The request.
	 * @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, request, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.request = request;
	  error.response = response;
	  return error;
	};


/***/ }),

/***/ 15:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}

	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }

	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];

	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }

	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }

	      if (!utils.isArray(val)) {
	        val = [val];
	      }

	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });

	    serializedParams = parts.join('&');
	  }

	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }

	  return url;
	};


/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;

	  if (!headers) { return parsed; }

	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));

	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });

	  return parsed;
	};


/***/ }),

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;

	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;

	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }

	      urlParsingNode.setAttribute('href', href);

	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }

	    originURL = resolveURL(window.location.href);

	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :

	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ }),

/***/ 18:
/***/ (function(module, exports) {

	'use strict';

	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';

	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}

	module.exports = btoa;


/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	module.exports = (
	  utils.isStandardBrowserEnv() ?

	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));

	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }

	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }

	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }

	        if (secure === true) {
	          cookie.push('secure');
	        }

	        document.cookie = cookie.join('; ');
	      },

	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },

	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :

	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	function InterceptorManager() {
	  this.handlers = [];
	}

	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};

	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};

	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};

	module.exports = InterceptorManager;


/***/ }),

/***/ 21:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);
	var transformData = __webpack_require__(22);
	var isCancel = __webpack_require__(23);
	var defaults = __webpack_require__(8);

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}

	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);

	  // Ensure headers exist
	  config.headers = config.headers || {};

	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );

	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );

	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );

	  var adapter = config.adapter || defaults.adapter;

	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);

	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );

	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);

	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }

	    return Promise.reject(reason);
	  });
	};


/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(4);

	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });

	  return data;
	};


/***/ }),

/***/ 23:
/***/ (function(module, exports) {

	'use strict';

	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ }),

/***/ 25:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return relativeURL
	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
	    : baseURL;
	};


/***/ }),

/***/ 26:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}

	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};

	Cancel.prototype.__CANCEL__ = true;

	module.exports = Cancel;


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var Cancel = __webpack_require__(26);

	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }

	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });

	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }

	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}

	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};

	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};

	module.exports = CancelToken;


/***/ }),

/***/ 28:
/***/ (function(module, exports) {

	'use strict';

	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


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

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(46), __esModule: true };

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(47);
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return (core.JSON && core.JSON.stringify || JSON.stringify).apply(JSON, arguments);
	};

/***/ }),

/***/ 47:
/***/ (function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(64)
	__vue_script__ = __webpack_require__(66)
	__vue_template__ = __webpack_require__(67)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\Share_Online\\boogouH5\\src\\components\\loadMore.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(65);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-bb4137d6&file=loadMore.vue!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./loadMore.vue", function() {
				var newContent = require("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-bb4137d6&file=loadMore.vue!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./loadMore.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports


	// module
	exports.push([module.id, ".mint-loadmore-bottom {\n  font-size: 0.32rem !important;\n  margin-bottom: 0.26667rem !important;\n  color: #7d7d7e !important; }\n  .mint-loadmore-bottom img {\n    width: 0.4rem;\n    height: 0.4rem;\n    vertical-align: text-bottom;\n    margin-right: 0.13333rem; }\n\n.mint-loadmore-bottom {\n  height: 0.66rem;\n  line-height: 0.66rem; }\n", ""]);

	// exports


/***/ }),

/***/ 66:
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// <style lang="sass">
	// $baseFontSize: 75px !default;
	// @function pxToRem($px){
	//     @return $px/$baseFontSize*1rem
	// }
	// .mint-loadmore-bottom{
	//     font-size: pxToRem(24px) !important;
	//     margin-bottom: pxToRem(20px) !important;
	//     color: #7d7d7e !important;
	//     img{
	//         width: pxToRem(30px);
	//         height: pxToRem(30px);
	//         vertical-align: text-bottom;
	//         margin-right: pxToRem(10px)
	//     }
	// }
	//  .mint-loadmore-bottom{
	//     height: 0.66rem;
	//     line-height: 0.66rem;
	// }
	//
	// </style>
	// <template>
	//       <mt-loadmore v-on:bottom-status-change="handleTopChange" :bottom-distance="100" :bottom-method="loadBottom" ref="loadmore">
	//           <slot>
	//           </slot>
	//           <div slot="bottom" class="mint-loadmore-bottom">
	//                <span v-show="bottomStatus === 'loading'">加载中...</span>
	//                 <span v-show="bottomStatus !== 'loading'">
	//                     <div v-if="bottom">- 已经到底了哦 -</div>
	//                     <div v-else><img src="../img/index/up.png" alt=""><span>上滑加载更多</span></div>
	//                 </span>
	//           </div>
	//      </mt-loadmore>
	// </template>
	// <script>

	exports.default = {
	    data: function data() {
	        return {
	            bottomStatus: "",
	            bottom: ""
	        };
	    },

	    props: ["bottomtext"],
	    watch: {
	        bottomtext: function bottomtext(e) {
	            this.bottom = e;
	        }
	    },
	    methods: {
	        handleTopChange: function handleTopChange(status) {
	            //上拉加载的状态
	            this.bottomStatus = status;
	        },
	        loadBottom: function loadBottom() {
	            var _this = this;

	            this.$emit("increment");
	            setTimeout(function () {
	                _this.$refs.loadmore.onBottomLoaded();
	            }, 1000);
	        }
	    }
	    // </script>
	    //

	};

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = "\r\n      <mt-loadmore v-on:bottom-status-change=\"handleTopChange\" :bottom-distance=\"100\" :bottom-method=\"loadBottom\" ref=\"loadmore\">\r\n          <slot>\r\n          </slot>\r\n          <div slot=\"bottom\" class=\"mint-loadmore-bottom\">\r\n               <span v-show=\"bottomStatus === 'loading'\">加载中...</span>\r\n                <span v-show=\"bottomStatus !== 'loading'\">\r\n                    <div v-if=\"bottom\">- 已经到底了哦 -</div>\r\n                    <div v-else><img src=\"" + __webpack_require__(68) + "\" alt=\"\"><span>上滑加载更多</span></div>\r\n                </span>\r\n          </div>\r\n     </mt-loadmore>\r\n";

/***/ }),

/***/ 68:
/***/ (function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MEE4QUU2OTFBQzMxMUU3OEMzRUM5NDRFMDg0ODg4MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MEE4QUU2QTFBQzMxMUU3OEMzRUM5NDRFMDg0ODg4MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjgwNThERjk3MUFDMzExRTc4QzNFQzk0NEUwODQ4ODgyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwNThERjk4MUFDMzExRTc4QzNFQzk0NEUwODQ4ODgyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+yp1E2wAAAfZJREFUeNqslU0opVEYx9/7zs3HaMQKm5kmYcVyNhYvylYayt1g52NhR6nr3oV7UbNVWFIKpYksLBRzb9lYzqwQSgkbNPJN5vfooet1Tu7EqV/PPc85//857/m6AcdQIpFogFALTVAJxRCEW9iCVZiBpVis/96vDxgMPcIwlMMlLMMGHEM+lEINZMEf6MI4YTXFsI/QDwcaJxBcGAbOJrRCFAol0i/+wpSOMYKYzomATn+dVwqaXBkY6iGOJvJkSmMdYR5mIUTjnZNmQfuBMA2NUId2IUAyg8omiFE5yTODsIUwAt20jxnac3R9ZYASV2YGnyFsMezUTxThKPUefx/VhdUn5Oq0Zf1+Ggx7dYZ7mtqGH+TDhpUQ/an4iek3SDDalc9Qdn8IFqBN051aj9M+6Jut6H+Jn5gWwI5h5NaUDTjX3DU0wCS0GzTiUxC07Sojf0mZdWr+htBMzqqVmR7CV+c/C+a3hrT4HIrpGniMnOm8oai+SvxcPfByM747byui/yR+rm7GLgzoITaVI7jS6FgO/4D6TLusjexol67HuF47//r9JnzUaLqm46qXF+v6wSCZTKx7nie72QEV/F4k9+zcUr+3PChT+unxxytse/r2ZYJpPH3yKhVZnz7LIy2GK7AOJ5AHZVAN2Wk90u/1d/JPgAEAT+zKzwWUT1UAAAAASUVORK5CYII="

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(119)
	__vue_script__ = __webpack_require__(121)
	__vue_template__ = __webpack_require__(122)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "E:\\Share_Online\\boogouH5\\src\\components\\Youlike.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(120);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-5f7bac68&file=Youlike.vue!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./Youlike.vue", function() {
				var newContent = require("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-5f7bac68&file=Youlike.vue!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./Youlike.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports


	// module
	exports.push([module.id, "html {\n  font-family: \"Microsoft Yahei\";\n  background: #f0f1f0; }\n\n.youlike {\n  overflow: hidden; }\n  .youlike h2 {\n    font-size: 0.32rem;\n    color: #000;\n    height: 1.06667rem;\n    line-height: 1.06667rem;\n    background-color: #fff;\n    position: relative;\n    border-bottom: 1px solid #EDECEC; }\n    .youlike h2 a {\n      background: #fff;\n      position: absolute;\n      left: 50%;\n      text-align: center;\n      z-index: 10;\n      margin-left: -0.8rem;\n      font-size: 0.42667rem; }\n      .youlike h2 a img {\n        width: 0.26667rem;\n        height: 0.26667rem;\n        padding-right: 5px; }\n  .youlike .box:nth-child(odd) {\n    margin-right: 1%;\n    padding-right: 1%; }\n  .youlike .box {\n    width: 49%;\n    background: #ffffff;\n    margin-bottom: 1%;\n    float: left;\n    height: 6.66667rem;\n    position: relative; }\n    .youlike .box img {\n      width: 100%;\n      height: 4.4rem; }\n    .youlike .box .restriction {\n      position: absolute;\n      top: 57%;\n      right: 3%;\n      z-index: 99;\n      color: #EB020E;\n      font-size: 0.34667rem; }\n    .youlike .box .name {\n      display: -webkit-box;\n      font-size: 0.37333rem;\n      color: #333;\n      margin: 0.13333rem;\n      -webkit-box-orient: vertical;\n      -webkit-line-clamp: 2;\n      overflow: hidden; }\n    .youlike .box .info {\n      position: absolute;\n      width: 95%;\n      bottom: 0;\n      padding: 0.13333rem 0.13333rem; }\n      .youlike .box .info .pirces {\n        font-size: 0.32rem;\n        color: #d12b4a;\n        margin-top: 0.32rem;\n        display: inline-block;\n        white-space: nowrap; }\n        .youlike .box .info .pirces span {\n          font-size: 0.37333rem; }\n        .youlike .box .info .pirces span:last-child {\n          margin-left: 0.06667rem; }\n      .youlike .box .info .discount {\n        background-color: #EB020E;\n        color: #fff;\n        font-size: 0.34667rem !important;\n        padding: 0 0.06667rem; }\n      .youlike .box .info div {\n        float: right;\n        font-size: 0.32rem;\n        padding-bottom: 0.13333rem; }\n        .youlike .box .info div p:nth-child(1) {\n          margin-top: 0.32rem;\n          color: #bebebe; }\n", ""]);

	// exports


/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stringify = __webpack_require__(45);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _axios = __webpack_require__(2);

	var _axios2 = _interopRequireDefault(_axios);

	var _global = __webpack_require__(29);

	var _global2 = _interopRequireDefault(_global);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// <style lang="sass"  >
	// $baseFontSize: 75px !default;
	// @function pxToRem($px){
	//     @return $px/$baseFontSize*1rem
	// }
	// html{
	//     font-family: "Microsoft Yahei";
	//     background: #f0f1f0;
	// }
	// .youlike{
	//     overflow:hidden;
	//     // background-color:#fff;
	//      h2{
	//         font-size: pxToRem(24px);
	//         color: #000;
	//         height: pxToRem(80px);
	//         line-height: pxToRem(80px);
	//         background-color:#fff;
	//         position: relative;
	//         border-bottom:1px solid #EDECEC;
	//         a{
	//             background: #fff;
	//             position: absolute;
	//             left: 50%;
	//             text-align: center;
	//             z-index: 10;
	//             margin-left: pxToRem(-60px);
	//             font-size:pxToRem(32px);
	//             img{
	//                 width: pxToRem(20px);
	//                 height: pxToRem(20px);
	//                 padding-right: 5px;
	//             }
	//         }
	//
	//     }
	//     .box:nth-child(odd){
	//         // margin-right: 2%;
	//         margin-right:1%;
	//         padding-right:1%;
	//     }
	//     .box{
	//          width: 49%;
	//         background: #ffffff;
	//         margin-bottom: 1%;
	//         // margin-bottom: 2%;
	//         float: left;
	//         height: pxToRem(500px);
	//         position: relative;
	//         img{
	//             width: 100%;
	//             height:pxToRem(330px);
	//         }
	//         .restriction{
	//             position: absolute;
	//             top:57%;
	//             right:3%;
	//             z-index: 99;
	//             color: #EB020E;
	//             font-size: pxToRem(26px);
	//         }
	//         .name{
	//             display: -webkit-box;
	//             font-size: pxToRem(28px);
	//             color:#333;
	//             margin: pxToRem(10px);
	//             -webkit-box-orient: vertical;
	//             -webkit-line-clamp: 2;
	//             overflow: hidden;
	//
	//         }
	//         .info{
	//             position: absolute;
	//             width: 95%;
	//             bottom: 0;
	//             padding:pxToRem(10px) pxToRem(10px) ;
	//             .pirces{
	//                 font-size: pxToRem(24px);
	//                 color:#d12b4a;
	//                 margin-top:pxToRem(24px);
	//                 // float:left;
	//                 display:inline-block;
	//                 white-space:nowrap;
	//                 span{
	//                     font-size: pxToRem(28px);
	//                 }
	//                 span:last-child{
	//                     margin-left:pxToRem(5px);
	//                 }
	//             }
	//             .discount{
	//                 background-color: #EB020E;
	//                 color: #fff;
	//                 font-size: pxToRem(26px) !important;
	//                 padding:0 pxToRem(5px);
	//                 // margin-left: pxToRem(10px);
	//             }
	//             div{
	//                 float:right;
	//                 font-size:pxToRem(24px);
	//                 padding-bottom: pxToRem(10px);
	//                 p:nth-child(1){
	//                     margin-top:pxToRem(24px);
	//                     color:#bebebe;
	//                 }
	//
	//             }
	//         }
	//     }
	// }
	//
	// </style>
	// <template>
	//     <div class="youlike">
	//         <h2><a>猜你喜欢</a></h2>
	//         <div class="listbox" >
	//             <div class="box"  v-on:click="Goproduct(item.productid)" v-for='item in datalist'>
	//                 <img :src="item.coverurl+'?imageView2/2/w/400'" alt="">
	//                 <b class="restriction">限购{{item.stock}}件</b>
	//                 <p class="name">{{item.name}}</p>
	//                 <div class="info">
	//                     <p class="pirces">
	//                         <span class="discount">{{item.discount}}折</span>
	//                         <span>¥ {{item.price}}</span>
	//                     </p>
	//
	//                         <div>
	//                             <p>销量：{{item.salesnum}}</p>
	//                         </div>
	//                 </div>
	//             </div>
	//         </div>
	//     </div>
	// </template>
	// <script>
	exports.default = {
	    data: function data() {
	        return {
	            datalist: []
	        };
	    },

	    created: function created() {
	        this.getdata();
	    },
	    props: ["page"],
	    watch: {
	        page: function page(val) {
	            // alert(val);
	            if (val == '1') {
	                // alert("ok123");
	                this.datalist = [];
	                this.getdata();
	            } else {
	                this.getdata();
	            }
	        }
	    },
	    methods: {
	        getdata: function getdata() {
	            var _this = this;

	            _axios2.default.get(_global2.default.Apipath + "/api/Product/GuessYouLike", {
	                params: {
	                    pagesize: 6,
	                    pageindex: this.page
	                }
	            }).then(function (req) {
	                var data = req.data;
	                data.data.forEach(function (element) {
	                    this.datalist.push(element);
	                }, _this);
	            });
	        },
	        Goproduct: function Goproduct(productid) {
	            var data = (0, _stringify2.default)({
	                url: _global2.default.path + "/page/ProductDetails.html?productid=" + productid
	            });
	            location.href = "boogoo.app://?pushcode=100011&data=" + data;
	            // location.href = "./ProductDetails.html?productid=" + productid;
	        }
	    }
	    // </script>
	    //

	};

/***/ }),

/***/ 122:
/***/ (function(module, exports) {

	module.exports = "\r\n    <div class=\"youlike\">\r\n        <h2><a>猜你喜欢</a></h2>\r\n        <div class=\"listbox\" >\r\n            <div class=\"box\"  v-on:click=\"Goproduct(item.productid)\" v-for='item in datalist'>\r\n                <img :src=\"item.coverurl+'?imageView2/2/w/400'\" alt=\"\">\r\n                <b class=\"restriction\">限购{{item.stock}}件</b>\r\n                <p class=\"name\">{{item.name}}</p>\r\n                <div class=\"info\">\r\n                    <p class=\"pirces\">\r\n                        <span class=\"discount\">{{item.discount}}折</span>\r\n                        <span>¥ {{item.price}}</span>\r\n                    </p>\r\n\r\n                        <div>\r\n                            <p>销量：{{item.salesnum}}</p>\r\n                        </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n";

/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(207);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(38)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./Orderdetail.scss", function() {
				var newContent = require("!!../../node_modules/_css-loader@0.23.1@css-loader/index.js!../../node_modules/_sass-loader@6.0.6@sass-loader/lib/loader.js!./Orderdetail.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 207:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(37)();
	// imports


	// module
	exports.push([module.id, "html {\n  font-family: \"Microsoft Yahei\";\n  background: #f0f1f0; }\n\n.mint-loadmore-text {\n  font-size: 0.4rem; }\n\n.mint-spinner-fading-circle-circle::before {\n  background-color: #F10707 !important; }\n\n.mint-loadmore-bottom {\n  margin-bottom: 0.26667rem !important;\n  color: #7d7d7e; }\n\n.orderState {\n  height: 2.66667rem;\n  background: linear-gradient(to right, #d22a4b, #b02455);\n  line-height: 2.66667rem;\n  font-size: 0.48rem;\n  color: #ffffff;\n  padding-left: 0.73333rem; }\n\n.parcelState {\n  overflow: hidden;\n  padding: 0.26667rem 0.26667rem;\n  border-bottom: 1px solid #bebebe;\n  background: #ffffff; }\n  .parcelState .carbg {\n    float: left;\n    width: 0.48rem;\n    height: 0.34667rem;\n    margin-top: 0.21333rem;\n    margin-right: 0.26667rem; }\n  .parcelState div {\n    float: left; }\n    .parcelState div p:nth-child(1) {\n      font-size: 0.37333rem;\n      color: #27b292;\n      margin-bottom: 0.13333rem; }\n    .parcelState div p:nth-child(2) {\n      font-size: 0.29333rem;\n      color: #7d7d7e; }\n  .parcelState img {\n    float: right;\n    margin-top: 0.21333rem;\n    width: 0.17333rem;\n    height: 0.29333rem; }\n\n.sitebar {\n  overflow: hidden;\n  background: #ffffff;\n  padding: 0.26667rem 0.26667rem;\n  margin-bottom: 0.13333rem;\n  position: relative;\n  color: #616162; }\n  .sitebar img {\n    width: 0.34667rem;\n    height: 0.42667rem;\n    position: absolute;\n    top: 70%;\n    margin-top: -0.21333rem; }\n  .sitebar div {\n    font-size: 0.37333rem;\n    margin-left: 0.66667rem; }\n    .sitebar div p:nth-child(1) {\n      color: #1f1f1f;\n      margin-bottom: 0.13333rem; }\n      .sitebar div p:nth-child(1) span:nth-child(2) {\n        padding-left: 0.53333rem; }\n    .sitebar div p:nth-child(2) {\n      line-height: 0.4rem; }\n\n.store {\n  background: #ffffff;\n  padding: 0.26667rem 0.26667rem;\n  overflow: hidden;\n  border-bottom: 1px solid #ECECEC; }\n  .store .head {\n    width: 0.86667rem;\n    height: 0.86667rem;\n    border-radius: 50%;\n    float: left;\n    margin-right: 0.26667rem; }\n  .store p {\n    line-height: 0.86667rem; }\n  .store .storename {\n    color: #7d7d7e;\n    float: left; }\n    .store .storename img {\n      margin-left: 0.26667rem;\n      width: 0.10667rem;\n      height: 0.18667rem; }\n  .store .starts {\n    float: right;\n    color: #272728;\n    font-size: 0.4rem; }\n\n.detail {\n  background-color: #fff;\n  padding: 0.26667rem 0.26667rem;\n  overflow: hidden; }\n  .detail img {\n    width: 2.8rem;\n    height: 2.8rem;\n    float: left;\n    margin-right: 0.26667rem; }\n  .detail .detailname {\n    float: left;\n    width: 50%; }\n    .detail .detailname h1 {\n      font-size: 0.37333rem;\n      line-height: 0.4rem;\n      margin-bottom: 0.26667rem; }\n    .detail .detailname p {\n      color: #7d7d7e; }\n  .detail .price {\n    float: right; }\n    .detail .price p:nth-child(1) {\n      font-size: 0.37333rem;\n      color: #d12b4a;\n      margin-bottom: 0.13333rem; }\n    .detail .price p:nth-child(2) {\n      font-size: 0.34667rem;\n      color: #7d7d7e;\n      text-align: right; }\n\n.privilege {\n  padding: 0.26667rem 0.26667rem;\n  font-size: 0.34667rem;\n  color: #7d7d7e;\n  background: #ffffff;\n  margin-top: 0.13333rem; }\n  .privilege p {\n    margin-bottom: 0.26667rem;\n    overflow: hidden; }\n  .privilege span:nth-child(2) {\n    float: right; }\n  .privilege .practical span:nth-child(1) {\n    font-size: 0.42667rem; }\n  .privilege .practical span:nth-child(2) {\n    color: #d12b4a; }\n  .privilege .practical a {\n    font-size: 0.42667rem;\n    margin-left: 0.06667rem; }\n\n.ordertime {\n  padding: 0.26667rem 0.26667rem;\n  background: #ffffff;\n  font-size: 0.37333rem;\n  color: #1f1f1f;\n  border-bottom: 0.13333rem solid #EDEDED; }\n  .ordertime p {\n    margin-bottom: 0.13333rem; }\n\n.btn-group {\n  border-top: 1px solid #bebebe;\n  height: 1.06667rem;\n  text-align: right;\n  margin-bottom: 0.26667rem;\n  padding: 0 0.26667rem;\n  background: #ffffff; }\n  .btn-group .btn {\n    color: #fff;\n    display: inline-block;\n    width: 2rem;\n    height: 0.66667rem;\n    line-height: 0.66667rem;\n    font-size: 0.37333rem;\n    text-align: center;\n    border: 0.02667rem solid #FF5800;\n    background-color: #FF5800;\n    border-radius: 0.13333rem;\n    margin-top: 0.16rem;\n    margin-left: 0.13333rem; }\n", ""]);

	// exports


/***/ })

/******/ });