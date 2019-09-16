'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocByPoi = exports.getPoiByLoc = exports.searchKeyword = exports.searchAround = exports.getLocation = exports.getAMap = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.setAMapKeys = setAMapKeys;

var _mmreq = require('mmreq');

var _mmreq2 = _interopRequireDefault(_mmreq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var amapArgs = {
  key: '1f53305612a2aaa31e840469820eb8e8',
  platform: 'JS',
  logversion: '2.0',
  sdkversion: '1.4.4'
};

var amapKeyWeb = '93b74e19d0f0142216489a894d3ae7d7';

var keySettled = false;
function checkKeys() {
  if (!keySettled) {
    console.warn('您未配置高德地图的key和webapi的key，使用默认key可能会导致限流，请调用 setAMapKeys(webkey,apikey) 进行初始化');
  }
}

function setAMapKeys(web, api) {
  amapArgs.key = api;
  amapKeyWeb = web;
  keySettled = true;
}

/**
 * 首次调用地图服务，才加载高德地图 script
 * 使用 let AMap = await AMap() 来获得
 */

var AMap = window['AMap'];
var loading = false; // 如果首次加载网络时延较高，避免连续的请求插入多个 script

var getAMap = exports.getAMap = function getAMap() {
  return new Promise(function (resolve, reject) {
    checkKeys();
    if (AMap) {
      resolve(AMap);
      return;
    }
    var check = function check() {
      loading = false;
      AMap = window['AMap'];
      if (AMap) {
        resolve(AMap);
      } else {
        reject(new Error('加载地图失败'));
      }
    };
    if (loading) {
      // 如果之前的请求已发出加载 script 的动作，则周期等待
      var intv = setInterval(function () {
        if (AMap) {
          resolve(AMap);
          clearInterval(intv);
        }
      }, 200);
    } else {
      // 否则则加载 script
      var script = document.createElement('script');
      script.src = 'https://webapi.amap.com/maps?v=1.4.10&key=' + amapKeyWeb;
      script.onload = check;
      script.onerror = check;
      document.documentElement.appendChild(script);
      loading = true;
    }
  });
};

/**
 * 使用高德的获取 gps 的服务，首次调动服务时候注册
 */
var isRegistered = false;
var getLocationAMap = function getLocationAMap(AMap) {
  return new Promise(function (resolve, reject) {
    function locate() {
      var conf = { enableHighAccuracy: true, timeout: 5000 };
      var geolocation = new AMap.Geolocation(conf);
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', function (ret) {
        return resolve(ret);
      });
      AMap.event.addListener(geolocation, 'error', function (err) {
        return reject(err);
      });
    }
    if (isRegistered) locate();else {
      var map = new AMap.Map(document.createElement('div'));
      map.plugin('AMap.Geolocation', function () {
        // 注册插件其实是由加载了一个 script
        isRegistered = true;
        map.destroy();
        locate();
      });
    }
  });
};

/**
 * 与微信一致的获取 GPS 接口
 */
var getLocation = exports.getLocation = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var map, ret;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            checkKeys();
            _context.next = 3;
            return getAMap();

          case 3:
            map = _context.sent;
            _context.next = 6;
            return getLocationAMap(map);

          case 6:
            ret = _context.sent;
            return _context.abrupt('return', { latitude: ret.position.lat, longitude: ret.position.lng });

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getLocation() {
    return _ref.apply(this, arguments);
  };
}();

/**
|--------------------------------------------------
| 以下的高德 api 也会在微信小程序中使用
|--------------------------------------------------
*/

/**
 *  搜索经纬度周边，提供经纬度和搜索半径，关键词可选
 *  offset 指的每页个数，page 为第几页，很像 msyql 的 limit
 */
var searchAround = exports.searchAround = function searchAround(_ref2) {
  var latitude = _ref2.latitude,
      longitude = _ref2.longitude,
      radius = _ref2.radius,
      _ref2$keywords = _ref2.keywords,
      keywords = _ref2$keywords === undefined ? '' : _ref2$keywords;
  return (0, _mmreq2.default)({
    url: 'https://restapi.amap.com/v3/place/around',
    data: _extends({ location: amapJoin({ latitude: latitude, longitude: longitude }), radius: radius, offset: 50, page: 1, keywords: keywords }, amapArgs)
  }).then(handleAmapResponse);
};

/**
 *  关键词 sugguestion
 */
var searchKeyword = exports.searchKeyword = function searchKeyword(_ref3) {
  var city = _ref3.city,
      county = _ref3.county,
      keywords = _ref3.keywords;
  return (0, _mmreq2.default)({
    url: 'https://restapi.amap.com/v3/place/text',
    data: _extends({ city: county || city || '全国', offset: 20, page: 1, keywords: keywords }, amapArgs)
  }).then(handleAmapResponse);
};

// 从gps解析地址
var getPoiByLoc = exports.getPoiByLoc = function getPoiByLoc(parmas) {
  return (0, _mmreq2.default)({
    url: 'https://restapi.amap.com/v3/geocode/regeo',
    data: _extends({ location: amapJoin(parmas) }, amapArgs)
  }).then(handleAmapResponse);
};

// 地址解析gps
var getLocByPoi = exports.getLocByPoi = function getLocByPoi(keywords) {
  return searchKeyword({ keywords: keywords }).then(function (data) {
    var pois = data && data['pois'] || [];
    if (pois && pois.length > 0) return amapSplit(pois[0].location);
    throw new Error('无法解析区县经纬度');
  });
};

var handleAmapResponse = function handleAmapResponse(data) {
  checkKeys();
  if (data.status != 1) {
    throw new Error('地图服务异常');
  }
  return data;
};
var roundCoord = function roundCoord(coord) {
  return coord.toFixed(6).replace(/\0+$/, '');
};
var amapJoin = function amapJoin(_ref4) {
  var latitude = _ref4.latitude,
      longitude = _ref4.longitude;
  return roundCoord(longitude) + ',' + roundCoord(latitude);
};
var amapSplit = function amapSplit(location) {
  var _location$split = location.split(','),
      _location$split2 = _slicedToArray(_location$split, 2),
      longitude = _location$split2[0],
      latitude = _location$split2[1];

  return {
    latitude: parseFloat(latitude) || 0,
    longitude: parseFloat(longitude) || 0
  };
};