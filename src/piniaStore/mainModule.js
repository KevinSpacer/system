
// 入口

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'
import { updateFileUrl } from '@/utils/apiConfig'

import useStore from './publicsModule'

export default defineStore({
  id: 'main',
  actions: {
    // 账号密码登录
    async fetchLoginPost(params) {
      const { loginPost } = useStore().getHttps

      const result = await loginPost(params)

      return storeResponse(result)
    },
    // 修改密码
    async fetchUpdatePasswordPut(params) {

      const { updatePasswordPut } = useStore().getHttps

      const result = await updatePasswordPut(params)

      return storeResponse(result)
    },
    // 查询当前登录用户信息
    async fetchSelectCurrentUserInfo(params) {

      const { selectCurrentUserInfo } = useStore().getHttps

      const result = await selectCurrentUserInfo(params)

      return storeResponse(result)
    },

    // 获取国际化语言类型列表
    async fetchGetInternationalLanguageTypeData(params) {

      const { getInternationalLanguageTypeData } = useStore().getHttps

      const result = await getInternationalLanguageTypeData(params)

      return storeResponse(result)
    },
    // 获取国际化语言数据
    async fetchGetInternationalLanguageContentList(params) {

      const { getInternationalLanguageContentList } = useStore().getHttps

      const result = await getInternationalLanguageContentList(params,{
        custom:{
          isAuth:false
        }
      })

      return storeResponse(result)
    },

    // 修改系统用户语言
    async fetchEditSystemUserLanguage(params) {

      const { editSystemUserLanguage } = useStore().getHttps

      const result = await editSystemUserLanguage(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

    // 上传图片
    async fetchUpload(params) {

      const { uploadImage } = useStore().getHttps
      // console.log(uploadImage)
      const result = await uploadImage(params, {
        custom: {
          customApiUrl: updateFileUrl,
          isFile: true
        }
      })

      return storeResponse(result)
    },


    // 订单
    // 获取订单列表
    async fetchGetOrderPageList(params) {

      const { getOrderPageList } = useStore().getHttps

      const result = await getOrderPageList(params)

      return storeResponse(result)
    },
    // 获取订单详情
    async fetchGetOrderDetails(params) {

      const { getOrderDetails } = useStore().getHttps

      const result = await getOrderDetails(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 获取订单支付明细列表
    async fetchGetOrderPayDetailList(params) {

      const { getOrderPayDetailList } = useStore().getHttps

      const result = await getOrderPayDetailList(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 获取订单购物单列表
    async fetchGetOrderShoppingList(params) {

      const { getOrderShoppingList } = useStore().getHttps

      const result = await getOrderShoppingList(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 计算订单金额
    async fetchCalculateOrderMoney(params) {

      const { calculateOrderMoney } = useStore().getHttps

      const result = await calculateOrderMoney(params)

      return storeResponse(result)
    },
    // 获取订单支付方式统计
    async fetchSelectOrderPayStatistics( params) {
      const { selectOrderPayStatistics } = useStore().getHttps

      const result = await selectOrderPayStatistics(params)

      return storeResponse(result)
    },
    // 获取订单金额统计
    async fetchSelectOrderMoneyStatistics( params) {
      const { selectOrderMoneyStatistics } = useStore().getHttps

      const result = await selectOrderMoneyStatistics(params)

      return storeResponse(result)
    },
    // 获取订单退款列表
    async fetchGetOrderRefundList( params) {
      const { getOrderRefundList } = useStore().getHttps

      const result = await getOrderRefundList(params)

      return storeResponse(result)
    },
    // 获取订单小费列表
    async fetchGetOrderTippingList( params) {
      const { getOrderTippingList } = useStore().getHttps

      const result = await getOrderTippingList(params)

      return storeResponse(result)
    },

  }
})
