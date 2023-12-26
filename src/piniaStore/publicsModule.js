

import { defineStore } from 'pinia'
import { setItem } from '@/utils/module'
import { authName } from '@/utils/apiConfig'

export default defineStore({
  id: 'publics',
  state: () => ({

    // 请求接口配置项
    https: {},

    // 用户信息
    userInfo: {},

    // 多语言数据
    languageData: {},

    // 选择的语言
    chooseLanguage: 'en_US',

    // 是否为第二语言
    isSecondLanguage: false,

    // 基本信息
    baseConfigInfo: {},

    // 餐厅信息
    roomDetail: {}
  }),
  actions: {
    // 设置请求函数
    setHttps(res) {
      this.https = res
    },

    // 清除使用信息
    clearUseStore(res) {
      this.userInfo = {}
      setItem(authName, '')
    },

    // 展示多语言
    /** 
     * @params {String} zn
     * @params {
     *  mode 语言模式 mult(多语言)|second(第二语言)
     * } config
     * 
    */
    LANG_TEXT(zn, config) {
      const { mode = 'mult' } = config || {}
      if (mode == 'mult') {

        // console.log(this.languageData)
        // console.log(this.languageData[zn] || zn)
        return this.languageData[zn] || zn
      } else {
        if (this.isSecondLanguage) {
          return config.secondValue || zn
        } else {
          return zn
        }
      }
    }
  },
  getters: {
    getHttps: state => state.https,
    getUserInfo: state => state.userInfo,
  },
})