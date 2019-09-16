'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function shouleBeObject(target) {
  if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object') return { res: true };
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  };
}

function getParameterError(_ref) {
  var _ref$name = _ref.name,
      name = _ref$name === undefined ? '' : _ref$name,
      para = _ref.para,
      correct = _ref.correct,
      wrong = _ref.wrong;

  var parameter = para ? 'parameter.' + para : 'parameter';
  var errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong === 'undefined' ? 'undefined' : _typeof(wrong));
  return name + ':fail parameter error: ' + parameter + ' should be ' + correct + ' instead of ' + errorType;
}

function setStorageSync(key) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'setStorage',
      correct: 'String',
      wrong: key
    }));
    return;
  }

  var type = typeof data === 'undefined' ? 'undefined' : _typeof(data);
  var obj = {};

  if (type === 'symbol') {
    obj = { data: '' };
  } else {
    obj = { data: data };
  }
  localStorage.setItem(key, JSON.stringify(obj));
}

function getStorageSync(key) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'getStorage',
      correct: 'String',
      wrong: key
    }));
    return;
  }

  var res = getItem(key);
  if (res.result) return res.data;

  return '';
}

function getItem(key) {
  var item = void 0;
  try {
    item = JSON.parse(localStorage.getItem(key));
  } catch (e) {}

  // 只返回使用 Taro.setStorage API 存储的数据
  if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && item.hasOwnProperty('data')) {
    return { result: true, data: item.data };
  } else {
    return { result: false };
  }
}

function removeStorageSync(key) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'removeStorage',
      correct: 'String',
      wrong: key
    }));
    return;
  }

  localStorage.removeItem(key);
}

exports.setStorageSync = setStorageSync;
exports.getStorageSync = getStorageSync;
exports.removeStorageSync = removeStorageSync;