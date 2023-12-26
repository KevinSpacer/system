
// 活动管理

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'

import useStore from './publicsModule'

export default defineStore({
  id: 'active',
  actions: {

    // 限时活动管理
    // 添加
    async fetchAddLimitActivities(params) {
      const { addLimitActivities } = useStore().getHttps

      const result = await addLimitActivities(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 删除
    async fetchRemoveLimitActivities(id) {
      const { removeLimitActivities } = useStore().getHttps

      const result = await removeLimitActivities(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 修改
    async fetchEditLimitActivities(params) {
      const { editLimitActivities } = useStore().getHttps

      const result = await editLimitActivities(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 分页查询
    async fetfchGetLimitActivitiesPageList(params) {
      const { getLimitActivitiesPageList } = useStore().getHttps

      const result = await getLimitActivitiesPageList(params)

      return storeResponse(result)
    },
    // 获取活动详情信息
    async fetchGetLimitActivitiesDetails(id) {
      const { getLimitActivitiesDetails } = useStore().getHttps

      const result = await getLimitActivitiesDetails(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

    // 优惠活动管理
    // 添加
    async fetchAddSpecialOffer(params) {
      const { addSpecialOffer } = useStore().getHttps

      const result = await addSpecialOffer(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 删除
    async fetchRemoveSpecialOffer(id) {
      const { removeSpecialOffer } = useStore().getHttps

      const result = await removeSpecialOffer(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 修改
    async fetchEditSpecialOffer(params) {
      const { editSpecialOffer } = useStore().getHttps

      const result = await editSpecialOffer(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 分页查询
    async fetchGetSpecialOfferPageList(params) {
      const { getSpecialOfferPageList } = useStore().getHttps

      const result = await getSpecialOfferPageList(params)

      return storeResponse(result)
    },
    // 获取活动详情信息
    async fetchGetSpecialOfferDetails(id) {
      const { getSpecialOfferDetails } = useStore().getHttps

      const result = await getSpecialOfferDetails(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    }
  }
})
