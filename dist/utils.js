'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.navigateTo = navigateTo;
exports.getHashPath = getHashPath;
exports.getHashQuery = getHashQuery;
exports.getSearchQuery = getSearchQuery;
exports.getQuery = getQuery;
exports.isIOS = isIOS;
exports.isAndroid = isAndroid;
exports.isPc = isPc;
exports.isIphoneNotch = isIphoneNotch;
exports.isWechat = isWechat;
exports.isObjEqual = isObjEqual;
exports.getDateStr = getDateStr;
/**
|--------------------------------------------------
| url 相关
|--------------------------------------------------
*/

var location = window.location;

function parse(search) {
  var obj = {};
  (search || '').replace(/([^?&=/]+)=([^?&=/]*)/g, function (res, $1, $2) {
    return obj[decodeURIComponent($1)] = decodeURIComponent($2);
  });
  return obj;
}

function stringify(obj) {
  return Object.keys(obj || {}).filter(function (k) {
    return ['string', 'number', 'boolean'].indexOf(_typeof(obj[k])) !== -1;
  }).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
  }).join('&');
}

function append(url, query) {
  if (!query) {
    return url;
  }
  var joiner = url.indexOf('?') === -1 ? '?' : '&';
  return '' + url + joiner + stringify(query);
}

/**
 * 
 * @param {*} url 跳转地址如 /welcome
 * @param query query 信息
 * @redirect {boolean} true 的时候调用 replace
 */
function navigateTo(_ref) {
  var url = _ref.url,
      query = _ref.query,
      _ref$redirect = _ref.redirect,
      redirect = _ref$redirect === undefined ? false : _ref$redirect;

  if (!url) return;
  if (url[0] === '#') url = url.slice(1);
  if (url[0] === '/') url = url.slice(1);
  url = '#/' + url;
  url = append(url, query);
  if (redirect) {
    location.replace(url);
  } else {
    location.href = url;
  }
}

/**
 * hash 模式路由时，获取诸如 /welcome/home 的路径
 */
function getHashPath() {
  var hash = location.hash;
  var matchs = hash.match(/#(\/[a-z_]+\/[a-z_]+\/[a-z_]+)/);
  return matchs ? matchs[1] : '';
}

/**
 * hash 模式路由时，获取 {k: v}
 */
function getHashQuery() {
  return parse(location.hash.split('?')[1]);
}

/**
 * search 模式路由时，获取 {k: v}
 */
function getSearchQuery() {
  return parse(location.search);
}

/**
 * 从 search 和 hash 上获取 {k: v}，hash 覆盖 search
 */
function getQuery() {
  return _extends({}, getSearchQuery(), getHashQuery());
}

/**
|--------------------------------------------------
| 设备信息相关
|--------------------------------------------------
*/

var ua = navigator.userAgent;

/**
 * 是否 ios
 */
function isIOS() {
  return ua.indexOf('iPhone') !== -1;
}

/**
 * 是否 android
 */
function isAndroid() {
  return ua.indexOf('Android') !== -1 || ua.indexOf('Adr') !== -1; // 后者为 uc 浏览器
}

/**
 * 是否 pc 环境
 */
function isPc() {
  return (/(Window|Mac OS X|UBrowser)/.test(ua) && !isAndroid() && !isIOS()
  );
}

/**
 * 是否刘海 iphone
 */
function isIphoneNotch() {
  return (/iphone/gi.test(ua) && (screen.height == 896 && screen.width == 414 || screen.height == 812 && screen.width == 375)
  );
}

/**
 * 是否为web版微信或小程序的 webview
 */
function isWechat() {
  return (/micromessenger/i.test(ua.toLowerCase())
  );
}

/**
|--------------------------------------------------
| 其他工具
|--------------------------------------------------
*/

/**
 * 判断两个对象是否一致，支持递归判断
 */
function isObjEqual(data1, data2) {
  if ((typeof data1 === 'undefined' ? 'undefined' : _typeof(data1)) !== (typeof data2 === 'undefined' ? 'undefined' : _typeof(data2))) return true;
  if (!data1 && !data2) return false;
  if ((typeof data1 === 'undefined' ? 'undefined' : _typeof(data1)) !== 'object' && (typeof data2 === 'undefined' ? 'undefined' : _typeof(data2)) !== 'object') return !(data1 === data2);
  if (Object.keys(data1).length !== Object.keys(data2).length) return true;
  for (var key in data1) {
    if (isObjEqual(data1[key], data2[key])) return true;
  }
  return false;
}

/**
 * (时间戳|Date对象|2018/1/1|2018-1-1) => 2018-01-01
 */
function getDateStr(timestamp) {
  if (timestamp === undefined || timestamp === '') timestamp = new Date();
  if (typeof timestamp === 'number') timestamp = new Date(timestamp);
  if (typeof timestamp === 'string') {
    if (timestamp.indexOf('/') !== -1) {
      timestamp = timestamp.split('/').join('-');
    }
    timestamp = new Date(timestamp);
  }
  var year = timestamp.getFullYear();
  var month = String(timestamp.getMonth() + 101).slice(1);
  var day = String(timestamp.getDate() + 100).slice(1);
  return [year, month, day].join('-');
}

exports.default = {
  navigateTo: navigateTo,
  getHashPath: getHashPath,
  getHashQuery: getHashQuery,
  getSearchQuery: getSearchQuery,
  getQuery: getQuery,
  isIOS: isIOS,
  isAndroid: isAndroid,
  isPc: isPc,
  isIphoneNotch: isIphoneNotch,
  isWechat: isWechat,
  isObjEqual: isObjEqual,
  getDateStr: getDateStr
};