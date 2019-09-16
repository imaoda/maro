import mmreq from 'mmreq'
const amapArgs = {
  key: '1f53305612a2aaa31e840469820eb8e8',
  platform: 'JS',
  logversion: '2.0',
  sdkversion: '1.4.4'
}

let amapKeyWeb = '93b74e19d0f0142216489a894d3ae7d7'

let keySettled = false
function checkKeys(){
  if (!keySettled) {
    console.warn('您未配置高德地图的key和webapi的key，使用默认key可能会导致限流，请调用 setAMapKeys(webkey,apikey) 进行初始化')
  }
}

export function setAMapKeys(web, api) {
  amapArgs.key = api
  amapKeyWeb = web
  keySettled = true
}

/**
 * 首次调用地图服务，才加载高德地图 script
 * 使用 let AMap = await AMap() 来获得
 */

let AMap = window['AMap']
let loading = false // 如果首次加载网络时延较高，避免连续的请求插入多个 script

export const getAMap = () =>
  new Promise((resolve, reject) => {
    checkKeys()
    if (AMap) {
      resolve(AMap)
      return
    }
    const check = () => {
      loading = false
      AMap = window['AMap']
      if (AMap) {
        resolve(AMap)
      } else {
        reject(new Error('加载地图失败'))
      }
    }
    if (loading) {
      // 如果之前的请求已发出加载 script 的动作，则周期等待
      let intv = setInterval(() => {
        if (AMap) {
          resolve(AMap)
          clearInterval(intv)
        }
      }, 200)
    } else {
      // 否则则加载 script
      const script = document.createElement('script')
      script.src = `https://webapi.amap.com/maps?v=1.4.10&key=${amapKeyWeb}`
      script.onload = check
      script.onerror = check
      document.documentElement.appendChild(script)
      loading = true
    }
  })

/**
 * 使用高德的获取 gps 的服务，首次调动服务时候注册
 */
let isRegistered = false
const getLocationAMap = AMap =>
  new Promise((resolve, reject) => {
    function locate() {
      let conf = {enableHighAccuracy: true, timeout: 5000}
      const geolocation = new AMap.Geolocation(conf)
      geolocation.getCurrentPosition()
      AMap.event.addListener(geolocation, 'complete', ret => resolve(ret))
      AMap.event.addListener(geolocation, 'error', err => reject(err))
    }
    if (isRegistered) locate()
    else {
      const map = new AMap.Map(document.createElement('div'))
      map.plugin('AMap.Geolocation', function() {
        // 注册插件其实是由加载了一个 script
        isRegistered = true
        map.destroy()
        locate()
      })
    }
  })

/**
 * 与微信一致的获取 GPS 接口
 */
export const getLocation = async () => {
  checkKeys()
  const map = await getAMap()
  const ret = await getLocationAMap(map)
  return {latitude: ret.position.lat, longitude: ret.position.lng}
}

/**
|--------------------------------------------------
| 以下的高德 api 也会在微信小程序中使用
|--------------------------------------------------
*/

/**
 *  搜索经纬度周边，提供经纬度和搜索半径，关键词可选
 *  offset 指的每页个数，page 为第几页，很像 msyql 的 limit
 */
export const searchAround = ({latitude, longitude, radius, keywords = ''}) =>
  mmreq (
    {
      url: `https://restapi.amap.com/v3/place/around`,
      data: {location: amapJoin({latitude, longitude}), radius, offset: 50, page: 1, keywords, ...amapArgs}
    }
  ).then(handleAmapResponse)

/**
 *  关键词 sugguestion
 */
export const searchKeyword = ({city, county, keywords}) =>
  mmreq(
    {
      url: `https://restapi.amap.com/v3/place/text`,
      data: {city: county || city || '全国', offset: 20, page: 1, keywords, ...amapArgs}
    }
  ).then(handleAmapResponse)

// 从gps解析地址
export const getPoiByLoc = parmas =>
  mmreq(
    {
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {location: amapJoin(parmas), ...amapArgs}
    }
  ).then(handleAmapResponse)

// 地址解析gps
export const getLocByPoi = keywords =>
  searchKeyword({keywords}).then(data => {
    const pois = (data && data['pois']) || []
    if (pois && pois.length > 0) return amapSplit(pois[0].location)
    throw new Error('无法解析区县经纬度')
  })

const handleAmapResponse = data => {
  checkKeys()
  if (data.status != 1) {
    throw new Error('地图服务异常')
  }
  return data
}
const roundCoord = coord => coord.toFixed(6).replace(/\0+$/, '')
const amapJoin = ({latitude, longitude}) => `${roundCoord(longitude)},${roundCoord(latitude)}`
const amapSplit = location => {
  const [longitude, latitude] = location.split(',')
  return {
    latitude: parseFloat(latitude) || 0,
    longitude: parseFloat(longitude) || 0
  }
}
