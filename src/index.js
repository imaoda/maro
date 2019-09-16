import mmreq from 'mmreq'
import chooseImage from './chooseImage'
import { setStorageSync, getStorageSync, removeStorageSync } from './storage'
import eventCenter from './eventCenter'
import utils from './utils'
import * as geo from './geo'
const store = {}


export default {
  request: mmreq,
  chooseImage,
  setStorageSync,
  getStorageSync,
  removeStorageSync,
  store,
  eventCenter,
  ...utils,
  ...geo,
}