
// 调味品管理

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'

import useStore from './publicsModule'

export default defineStore({
  id: 'condiment',
  actions: {
    
    // 调味品组合
    // 添加
    async fetchSpicesCombineAdd(params) {
      const { spicesCombineAdd } = useStore().getHttps

      const result = await spicesCombineAdd(params)

      return storeResponse(result)
    },
    // 编辑
    async fetchSpicesCombineEdit(params) {
      const { spicesCombineEdit } = useStore().getHttps

      const result = await spicesCombineEdit(params)

      return storeResponse(result)
    },
    // [选择器] 获取所有调味品组合名称分页列表
    async fetchGetAllNamePagespicesCombine(params) {
      const { getAllNamePagespicesCombine } = useStore().getHttps

      const result = await getAllNamePagespicesCombine(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetSpicesCombinePageList(params) {
      const { getSpicesCombinePageList } = useStore().getHttps

      const result = await getSpicesCombinePageList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeleteSpicesCombine(params) {
      const { deleteSpicesCombine} = useStore().getHttps

      const result = await deleteSpicesCombine(params,{
        custom:{
          isPathVariable:true
        }
      })

      return storeResponse(result)
    },
    
    
    // 调味品
    // 添加
    async fetchSpicesAdd(params) {
      const { spicesAdd } = useStore().getHttps

      const result = await spicesAdd(params)

      return storeResponse(result)
    },
    // 编辑
    async fetchSpicesEdit(params) {
      const { spicesEdit } = useStore().getHttps

      const result = await spicesEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetSpicesPageList(params) {
      const { getSpicesPageList } = useStore().getHttps

      const result = await getSpicesPageList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeleteSpices(params) {
      const { deleteSpices} = useStore().getHttps

      const result = await deleteSpices(params,{
        custom:{
          isPathVariable:true
        }
      })

      return storeResponse(result)
    },
    // 导入调味品
    async fetchImportSpices(params) {
      const { importSpices } = useStore().getHttps

      const result = await importSpices(params)

      return storeResponse(result)
    },

    // 自定义调味品
    // 添加
    async fetchCustomSpicesAdd(params) {
      const { customSpicesAdd } = useStore().getHttps

      const result = await customSpicesAdd(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetCustomSpicesList(params) {
      const { getCustomSpicesList } = useStore().getHttps

      const result = await getCustomSpicesList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeleteCustomSpices(params) {
      const { deleteCustomSpices} = useStore().getHttps

      const result = await deleteCustomSpices(params,{
        custom:{
          isPathVariable:true
        }
      })

      return storeResponse(result)
    },
    // 设置自定义调味品排序
    async fetchSettingCustomSpicesSort(params) {
      const { settingCustomSpicesSort } = useStore().getHttps

      const result = await settingCustomSpicesSort(params,{
        custom:{
          isFormData:false
        }
      })

      return storeResponse(result)
    },


    // 自定义价格
    // 添加
    async fetchCustomPriceAdd(params) {
      const { customPriceAdd } = useStore().getHttps

      const result = await customPriceAdd(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetCustomPriceList(params) {
      const { getCustomPriceList } = useStore().getHttps

      const result = await getCustomPriceList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeleteCustomPrice(params) {
      const { deleteCustomPrice} = useStore().getHttps

      const result = await deleteCustomPrice(params,{
        custom:{
          isPathVariable:true
        }
      })

      return storeResponse(result)
    },
    // 设置自定义调味品价格排序
    async fetchSettingCustomPriceSort(params) {
      const { settingCustomPriceSort } = useStore().getHttps

      const result = await settingCustomPriceSort(params,{
        custom:{
          isFormData:false
        }
      })

      return storeResponse(result)
    },

  }
})
