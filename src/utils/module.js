
import piniaStore from "@/piniaStore/index";

// 处理对象转 路径携带参数字符串
export const paramToStr = (data) => {
  if (!data) {
    return ''
  }

  return Object.keys(data).map(item => `${item}=${data[item]}`).join('&')
}

// 设置缓存
export const setItem = (name, data) => {
  window.localStorage.setItem(name, data);
}

// 获取缓存
export const getItem = (name) => {
  return window.localStorage.getItem(name);
}

// 处理请求响应数据
export const storeResponse = (res, call, isCustomUrl) => {

  if (res && res.code === 200) {
    if (call) {
      call()
    }
    return res
  } else {

    // 是否是自定义路径
    if (isCustomUrl) {
      return res
    } else {
      if (res && res.code) {
        return Promise.reject(res)
      } else {
        return Promise.reject(false)
      }
    }
  }
}

/* vuex */
// dispatch调用
export const storeDispatch = function (name, params) {
  return this.$store.dispatch(name, params)
}
// commit调用
export const storeCommit = function (name, params) {
  return this.$store.commit(name, params)
}
// getters调用
export const storeGetters = function (name, params) {
  return this.$store.getters[name]
}

// 调用pinia模块
export const usePiniaModule = function (useName) {
  return useName ? piniaStore[useName] : piniaStore
}

// 时间
// 转换 补位字符数字
export const numberToAll = (val) => {
  return val >= 10 ? val : '0' + val
}
// 根据时间戳获取时间
export const timeSpToDate = (time, afterType) => {
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  let result = `${year}-${numberToAll(month)}-${numberToAll(day)}`

  const nopass = [undefined, null, ""]
  if (!nopass.includes(afterType)) {
    const endAfters = ["00:00:00", "23:59:59"]
    const resAfter = endAfters[afterType]
    result += ' ' + resAfter
  }

  return result
}
// 根据时间戳获取 time时间
export const timeStampToTime = (time, config) => {
  const { format = 'HH:mm:ss' } = config || {}

  const formats = format.split(':')

  let date = new Date(time)
  const params = {
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  }

  const result = formats.map(d => numberToAll(params[d]))

  return result.join(':')
}

// 校验表单
export const testForm = (call, refEl) => {
  return new Promise((resolve) => {
    try {

      refEl.validate((valid, fields) => {
        if (!valid) {
          call ? call() : '';
        }
        resolve(valid);
      });
    } catch (error) {
      console.log(error)
    }
  });
};

// 跳转路由
export const navigateTo = function (path, query = {}) {
  this.$router.push({ path, query })
}

// 赋值参数
export const updateParams = (origin, data) => {

  for (let i in origin) {
    origin[i] = data[i]
  }

}

// 根据开始结束时间处理 星期天数
export const getWeekDay = (startDate = '', endDate = '') => {

  if (startDate && endDate) {
    const weekVals = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
    // 星期
    const weekText = {
      'MONDAY': '周一',
      'TUESDAY': '周二',
      'WEDNESDAY': '周三',
      'THURSDAY': '周四',
      'FRIDAY': '周五',
      'SATURDAY': '周六',
      'SUNDAY': '周日'
    }

    const startTime = new Date(startDate).getTime()
    const endTime = new Date(endDate).getTime()

    // 时间差
    const timeDifference = endTime - startTime

    // 一天的时间戳
    const oneDayTime = 24 * 3600 * 1000

    // 天数
    const dayDifference = Math.round(timeDifference / oneDayTime) + 1

    // 日期容器
    const weekResult = {}

    for (let i = 0; i < dayDifference; i++) {
      // 当前时间戳
      const currTimes = i * oneDayTime
      // 当天时间戳
      const todayTime = startTime + currTimes
      // 星期
      const week = new Date(todayTime).getDay()

      const weeVal = weekVals[week]
      weekResult[weeVal] = week
    }

    return weekResult
  } else {
    return {}
  }

}

// 获取最终选择的语言数据
export const getCurrLanguageResult = async () => {
  const publicsStore = usePiniaModule('publicsStore')
  // 赋值
  const res = await getCurrChangeLanguage()
  const result = res.result

  // 处理双向翻译数据
  publicsStore.languageData = result.reduce((add, curr, index) => {
    add[curr.key] = curr.value
    return add
  }, {})

}

// 查询当前选中语言数据
export const getCurrChangeLanguage = () => {
  const { publicsStore, mainStore } = usePiniaModule()
  const type = publicsStore.chooseLanguage
  // console.log(type)
  return mainStore.fetchGetInternationalLanguageContentList({ type })
}

// 下载文件
export const downLoadFile = ({
  href = '',
  download = ''
}) => {
  var a = document.createElement('a')
  a.href = href
  a.download = download
  a.click()
  a.remove()
}
