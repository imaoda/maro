function shouleBeObject (target) {
  if (target && typeof target === 'object') return { res: true }
  return {
    res: false,
    msg: getParameterError({
      correct: 'Object',
      wrong: target
    })
  }
}

function getParameterError ({ name = '', para, correct, wrong }) {
  const parameter = para ? `parameter.${para}` : 'parameter'
  const errorType = upperCaseFirstLetter(wrong === null ? 'Null' : typeof wrong)
  return `${name}:fail parameter error: ${parameter} should be ${correct} instead of ${errorType}`
}

function setStorageSync (key, data = '') {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'setStorage',
      correct: 'String',
      wrong: key
    }))
    return
  }

  const type = typeof data
  let obj = {}

  if (type === 'symbol') {
    obj = { data: '' }
  } else {
    obj = { data }
  }
  localStorage.setItem(key, JSON.stringify(obj))
}

function getStorageSync (key) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'getStorage',
      correct: 'String',
      wrong: key
    }))
    return
  }

  let res = getItem(key)
  if (res.result) return res.data

  return ''
}

function getItem (key) {
  let item
  try {
    item = JSON.parse(localStorage.getItem(key))
  } catch (e) {}

  // 只返回使用 Taro.setStorage API 存储的数据
  if (item && typeof item === 'object' && item.hasOwnProperty('data')) {
    return { result: true, data: item.data }
  } else {
    return { result: false }
  }
}

function removeStorageSync (key) {
  if (typeof key !== 'string') {
    console.error(getParameterError({
      name: 'removeStorage',
      correct: 'String',
      wrong: key
    }))
    return
  }

  localStorage.removeItem(key)
}

export {
  setStorageSync,
  getStorageSync,
  removeStorageSync,
}
