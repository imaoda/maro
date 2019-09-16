'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _mmreq = require('mmreq');

var _mmreq2 = _interopRequireDefault(_mmreq);

var _chooseImage = require('./chooseImage');

var _chooseImage2 = _interopRequireDefault(_chooseImage);

var _storage = require('./storage');

var _eventCenter = require('./eventCenter');

var _eventCenter2 = _interopRequireDefault(_eventCenter);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _geo = require('./geo');

var geo = _interopRequireWildcard(_geo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = {};

exports.default = _extends({
  request: _mmreq2.default,
  chooseImage: _chooseImage2.default,
  setStorageSync: _storage.setStorageSync,
  getStorageSync: _storage.getStorageSync,
  removeStorageSync: _storage.removeStorageSync,
  store: store,
  eventCenter: _eventCenter2.default
}, _utils2.default, geo);