import { createStore } from 'vuex'
import { setItem } from '@/utils/module'
import { authName } from '@/utils/apiConfig'

import mainModules from './mainModules'

export default createStore({
  state: {
    // 请求接口配置项
    https: {},

    // 用户信息
    userInfo:{},

    // 餐厅的配置信息
    
  },
  mutations: {
    // 设置请求函数
    setHttps(state, res) {
      state.https = res
    },

    // 设置当前登录用户信息
    setUserInfo(state, res){
      state.userInfo = {
        ...state.userInfo,
        ...res
      }
    },

    // 清除使用信息
    clearUseStore(state, res){
      state.userInfo = {}
      setItem(authName,'')
    }
  },
  actions: {
  },
  getters: {
    getHttps: state => state.https,
    getUserInfo: state => state.userInfo,
  },
  modules: {
    mainModules
  }
})
