/**
|--------------------------------------------------
| url 相关
|--------------------------------------------------
*/

const location = window.location

function parse(search) {
  let obj = {};
  (search || '').replace(/([^?&=/]+)=([^?&=/]*)/g, (res, $1, $2) => (obj[decodeURIComponent($1)] = decodeURIComponent($2)))
  return obj
}

function stringify(obj) {
  return Object.keys(obj || {})
    .filter(k => ['string', 'number', 'boolean'].indexOf(typeof obj[k]) !== -1)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&')
}

function append(url, query) {
  if (!query) {
    return url
  }
  const joiner = url.indexOf('?') === -1 ? '?' : '&'
  return `${url}${joiner}${stringify(query)}`
}

/**
 * 
 * @param {*} url 跳转地址如 /welcome
 * @param query query 信息
 * @redirect {boolean} true 的时候调用 replace
 */
export function navigateTo({ url, query, redirect = false }) {
  if (!url) return
  if (url[0] === '#') url = url.slice(1)
  if (url[0] === '/') url = url.slice(1)
  url = '#/' + url
  url = append(url, query)
  if (redirect) {
    location.replace(url)
  } else {
    location.href = url
  }
}

/**
 * hash 模式路由时，获取诸如 /welcome/home 的路径
 */
export function getHashPath() {
  let hash = location.hash
  const matchs = hash.match(/#(\/[a-z_]+\/[a-z_]+\/[a-z_]+)/)
  return matchs ? matchs[1] : ''
}

/**
 * hash 模式路由时，获取 {k: v}
 */
export function getHashQuery() {
  return parse(location.hash.split('?')[1])
}

/**
 * search 模式路由时，获取 {k: v}
 */
export function getSearchQuery() {
  return parse(location.search)
}

/**
 * 从 search 和 hash 上获取 {k: v}，hash 覆盖 search
 */
export function getQuery() {
  return {...getSearchQuery(), ...getHashQuery()}
}

/**
|--------------------------------------------------
| 设备信息相关
|--------------------------------------------------
*/

const ua = navigator.userAgent

/**
 * 是否 ios
 */
export function isIOS() {
  return ua.indexOf('iPhone') !== -1
}

/**
 * 是否 android
 */
export function isAndroid() {
  return ua.indexOf('Android') !== -1 || ua.indexOf('Adr') !== -1 // 后者为 uc 浏览器
}

/**
 * 是否 pc 环境
 */
export function isPc() {
  return /(Window|Mac OS X|UBrowser)/.test(ua) && !isAndroid() && !isIOS()
}

/**
 * 是否刘海 iphone
 */
export function isIphoneNotch() {
  return /iphone/gi.test(ua) && ((screen.height == 896 && screen.width == 414) || (screen.height == 812 && screen.width == 375))
}

/**
 * 是否为web版微信或小程序的 webview
 */
export function isWechat() {
  return /micromessenger/i.test(ua.toLowerCase())
}

/**
|--------------------------------------------------
| 其他工具
|--------------------------------------------------
*/

/**
 * 判断两个对象是否一致，支持递归判断
 */
export function isObjEqual(data1, data2) {
  if (typeof data1 !== typeof data2) return true
  if (!data1 && !data2) return false
  if (typeof data1 !== 'object' && typeof data2 !== 'object') return !(data1 === data2)
  if (Object.keys(data1).length !== Object.keys(data2).length) return true
  for (let key in data1) {
    if (isObjEqual(data1[key], data2[key])) return true
  }
  return false
}

/**
 * (时间戳|Date对象|2018/1/1|2018-1-1) => 2018-01-01
 */
export function getDateStr(timestamp) {
  if (timestamp === undefined || timestamp === '') timestamp = new Date()
  if (typeof timestamp === 'number') timestamp = new Date(timestamp)
  if (typeof timestamp === 'string') {
    if (timestamp.indexOf('/') !== -1) {
      timestamp = timestamp.split('/').join('-')
    }
    timestamp = new Date(timestamp)
  }
  let year = timestamp.getFullYear()
  let month = String(timestamp.getMonth() + 101).slice(1)
  let day = String(timestamp.getDate() + 100).slice(1)
  return [year, month, day].join('-')
}


export default {
  navigateTo,
  getHashPath,
  getHashQuery,
  getSearchQuery,
  getQuery,
  isIOS,
  isAndroid,
  isPc,
  isIphoneNotch,
  isWechat,
  isObjEqual,
  getDateStr,
}