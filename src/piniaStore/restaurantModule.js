
// 餐厅管理

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'

import useStore from './publicsModule'

export default defineStore({
  id: 'restaurant',
  actions: {
    // 获取餐厅信息
    async fetchGetDiningRoomSelectInfo(params) {
      const { getDiningRoomSelectInfo } = useStore().getHttps

      const result = await getDiningRoomSelectInfo(params)

      return storeResponse(result)
    },
    // 餐厅设置
    async fetchGetDiningRoomSetting(params) {
      const { getDiningRoomSetting } = useStore().getHttps

      const result = await getDiningRoomSetting(params)

      return storeResponse(result)
    },

    // 基本设置
    // 获取基础设置参数
    async fetchGetBaseSetting(params) {
      const { getBaseSetting } = useStore().getHttps

      const result = await getBaseSetting(params)

      return storeResponse(result)
    },
    // 设置基础参数
    async fetchSettingBaseParam(params) {
      const { settingBaseParam } = useStore().getHttps

      const result = await settingBaseParam(params)

      return storeResponse(result)
    },

    // 税率
    // 添加税率
    async fetchTaxRateAdd(params) {
      const { taxRateAdd } = useStore().getHttps

      const result = await taxRateAdd(params)

      return storeResponse(result)
    },
    // 编辑税率
    async fetchTaxRateEdit(params) {
      const { taxRateEdit } = useStore().getHttps

      const result = await taxRateEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetTaxRatePageList(params) {
      const { getTaxRatePageList } = useStore().getHttps

      const result = await getTaxRatePageList(params)

      return storeResponse(result)
    },
    // 删除税率
    async fetchDeleteTaxRate(params) {
      const { deleteTaxRate } = useStore().getHttps

      const result = await deleteTaxRate(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },



    // 折扣
    // 添加折扣
    async fetchDiscountAdd(params) {
      const { discountAdd } = useStore().getHttps

      const result = await discountAdd(params)

      return storeResponse(result)
    },
    // 编辑折扣
    async fetchDiscountEdit(params) {
      const { discountEdit } = useStore().getHttps

      const result = await discountEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetDiscountPageList(params) {
      const { getDiscountPageList } = useStore().getHttps

      const result = await getDiscountPageList(params)

      return storeResponse(result)
    },
    // 删除折扣
    async fetchDeleteDiscount(params) {
      const { deleteDiscount } = useStore().getHttps

      const result = await deleteDiscount(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },


    // 服务费
    // 添加服务费
    async fetchServiceChargeAdd(params) {
      const { serviceChargeAdd } = useStore().getHttps

      const result = await serviceChargeAdd(params)

      return storeResponse(result)
    },
    // 编辑服务费
    async fetchServiceChargeEdit(params) {
      const { serviceChargeEdit } = useStore().getHttps

      const result = await serviceChargeEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetServiceChargePageList(params) {
      const { getServiceChargePageList } = useStore().getHttps

      const result = await getServiceChargePageList(params)

      return storeResponse(result)
    },
    // 删除服务费
    async fetchDeleteServiceCharge(params) {
      const { deleteServiceCharge } = useStore().getHttps

      const result = await deleteServiceCharge(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },


    // 付款方式
    // 添加
    async fetchPaymentMethodAdd(params) {
      const { paymentMethodAdd } = useStore().getHttps

      const result = await paymentMethodAdd(params)

      return storeResponse(result)
    },
    // 编辑
    async fetchPaymentMethodEdit(params) {
      const { paymentMethodEdit } = useStore().getHttps

      const result = await paymentMethodEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetPaymentMethodPageList(params) {
      const { getPaymentMethodPageList } = useStore().getHttps

      const result = await getPaymentMethodPageList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeletePaymentMethod(params) {
      const { deletePaymentMethod } = useStore().getHttps

      const result = await deletePaymentMethod(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

  }
})
