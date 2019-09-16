import mmreq from 'mmreq';
declare const Maro: {
  // 【核心 API】
  request: typeof mmreq; // 网络请求，高级用法可查看 https://www.npmjs.com/package/mmreq
  chooseImage: () => Promise<File>; // 选择图片
  getStorageSync: (key: string) => string; // 读 localStorage
  setStorageSync: (key: string, value: string) => void; // 写 localStorage
  removeStorageSync: (key: string) => void; // 删 localStorage
  store: any; // 数据共享
  eventCenter: {
    // 观察者
    on: (key: string, fn: Function) => void;
    off: (key: string) => void;
    trigger: (key: string) => void;
    emit: (key: string) => void;
  };

  // 【工具类】
  navigateTo: (params: { url: string; query?: any; redirect?: boolean }) => void; // hash 路由跳转
  getHashPath: () => string; // hash 模式路由时，获取诸如 /welcome/home 的路径
  getHashQuery: () => any; // hash 模式路由时，获取 {k: v}
  getSearchQuery: () => any; // search 模式路由时，获取 {k: v}
  getQuery: () => any; // 从 search 和 hash 上获取 {k: v}，hash 覆盖 search
  isIOS: () => boolean;
  isAndroid: () => boolean;
  isPc: () => boolean;
  isIphoneNotch: () => boolean; // 是否是刘海iphone
  isWechat: () => boolean; // 是否在微信环境，如微信 webview，或者微信小程序的 webview
  isObjEqual: (obj1: any, obj2: any) => boolean; // 两个 plain object 是否一致，支持递归
  getDateStr: (param: string | Date | number) => string; // (时间戳|Date对象|2018/1/1|2018-1-1) => 2018-01-01

  // 【地图相关】
  setAMapKeys: (webkey: string, apikey: string) => void; // 设置高德地图的 key，请在调用后续方法之前，先调用该方法初始化 key
  getAMap: () => Promise<any>; // 获取 AMap 的引用（首次会在 html 中插入<script>加载AMap）
  getLocation: () => Promise<{ longitude: number; latitude: number }>; // 获取用户当前 gps
  getPoiByLoc: (params: { longitude: number; latitude: number }) => Promise<any>; // 地址解析
  getLocByPoi: (keywords: string) => Promise<any>; // 逆地址解析
  searchAround: (params: {
    latitude: number;
    longitude: number;
    radius: number;
    keywords?: string;
  }) => Promise<any>; // 搜索周边 POI
  searchKeyword: (params: {
    city?: string | number;
    county?: string | number;
    keywords: string;
  }) => Promise<any>; // 搜索关键词(可指定某个区域)
};
export default Maro;

