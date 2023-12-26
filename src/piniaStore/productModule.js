
// 菜品管理

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'

import useStore from './publicsModule'

export default defineStore({
  id: 'product',
  state:()=>({
    // 套餐属性的 传递数据
    packageTransmit:[]
  }),
  actions: {

    // 菜品管理
    // 添加
    async fetchProductDishesAdd(params) {
      const { productDishesAdd } = useStore().getHttps

      const result = await productDishesAdd(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 删除
    async fetchProductDishesDelete(params) {
      const { productDishesDelete } = useStore().getHttps

      const result = await productDishesDelete(params)

      return storeResponse(result)
    },
    // 修改
    async fetchProductDishesEdit(params) {
      const { productDishesEdit } = useStore().getHttps

      const result = await productDishesEdit(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 分页查询
    async fetchGetProductDishesPageList(params) {
      const { getProductDishesPageList } = useStore().getHttps

      const result = await getProductDishesPageList(params)

      return storeResponse(result)
    },
    // 获取菜品详情信息
    async fetchGetProductDishesDetailsInfo(id) {
      const { getProductDishesDetailsInfo } = useStore().getHttps

      const result = await getProductDishesDetailsInfo(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 设置上下架状态
    async fetchSettingBatchDishesShelvesStatus(params) {
      const { settingBatchDishesShelvesStatus } = useStore().getHttps

      const result = await settingBatchDishesShelvesStatus(params)

      return storeResponse(result)
    }, 
    // 设置上下架状态
    async fethGetGoodsPageList(params) {
      const { getGoodsPageList } = useStore().getHttps

      const result = await getGoodsPageList(params)

      return storeResponse(result)
    }, 
    // 获取商品数量
    async fetchGetDishesCount(params) {
      const { getDishesCount } = useStore().getHttps

      const result = await getDishesCount(params)

      return storeResponse(result)
    }, 
    // 导入菜品
    async fetchImportDishes(params) {
      const { importDishes } = useStore().getHttps

      const result = await importDishes(params)

      return storeResponse(result)
    }, 


    // 分类管理
    // 添加
    async fetchProductClassifyAdd(params) {
      const { productClassifyAdd } = useStore().getHttps

      const result = await productClassifyAdd(params)

      return storeResponse(result)
    },
    // 编辑
    async fetchProductClassifyEdit(params) {
      const { productClassifyEdit } = useStore().getHttps

      const result = await productClassifyEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchProductClassifyGetPageList(params) {
      const { productClassifyGetPageList } = useStore().getHttps

      const result = await productClassifyGetPageList(params)

      return storeResponse(result)
    },
    // 选择器分页列表
    async fetchGetAllClassifyPageList(params) {
      const { getAllClassifyPageList } = useStore().getHttps

      const result = await getAllClassifyPageList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeleteProductClassify(params) {
      const { deleteProductClassify } = useStore().getHttps

      const result = await deleteProductClassify(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

    // 组合管理
    // 添加
    async fetchClassifyCombineAdd(params) {
      const { classifyCombineAdd } = useStore().getHttps

      const result = await classifyCombineAdd(params)

      return storeResponse(result)
    },
    // 编辑
    async fetchClassifyCombineEdit(params) {
      const { classifyCombineEdit } = useStore().getHttps

      const result = await classifyCombineEdit(params)

      return storeResponse(result)
    },
    // 分页列表
    async fetchClassifyCombineGetPageList(params) {
      const { classifyCombineGetPageList } = useStore().getHttps

      const result = await classifyCombineGetPageList(params)

      return storeResponse(result)
    },
    // [选择器] 获取所有分类组合分页列表
    async fetchGetAllProductClassifyPageList(params) {
      const { getAllProductClassifyPageList } = useStore().getHttps

      const result = await getAllProductClassifyPageList(params)

      return storeResponse(result)
    },
    // 删除
    async fetchDeleteClassifyCombine(params) {
      const { deleteClassifyCombine } = useStore().getHttps

      const result = await deleteClassifyCombine(params, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },



    // 库存管理
    // 批量入库
    async fetchBatchDishesInStockPost(params) {
      const { batchDishesInStockPost } = useStore().getHttps

      const result = await batchDishesInStockPost(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 批量出库
    async fetchBatchDishesOutStockPost(params) {
      const { batchDishesOutStockPost } = useStore().getHttps

      const result = await batchDishesOutStockPost(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 修改菜品库存下线数量
    async fetchEditDishesStockLowerLimitCountPut(params) {
      const { editDishesStockLowerLimitCountPut } = useStore().getHttps

      const result = await editDishesStockLowerLimitCountPut(params)

      return storeResponse(result)
    },
    // 获取菜品库存下线列表
    async fetchGetDishesStockLowerLimitList(params) {
      const { getDishesStockLowerLimitList } = useStore().getHttps

      const result = await getDishesStockLowerLimitList(params)

      return storeResponse(result)
    },
    // 获取菜品库存记录分页列表
    async fetchGetDishesStockRecordPageList(params) {
      const { getDishesStockRecordPageList } = useStore().getHttps

      const result = await getDishesStockRecordPageList(params)

      return storeResponse(result)
    },
    // 获取菜品库存记录分页列表
    async fetchGetStockLowerLimitCountDishesList(params) {
      const { getStockLowerLimitCountDishesList } = useStore().getHttps

      const result = await getStockLowerLimitCountDishesList(params)

      return storeResponse(result)
    },


    // 套餐管理
    // 添加
    async fetchSetMealAddSetMeal(params) {
      const { setMealAddSetMeal } = useStore().getHttps

      const result = await setMealAddSetMeal(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 修改
    async fetchSetMealEditSetMeal(params) {
      const { setMealEditSetMeal } = useStore().getHttps

      const result = await setMealEditSetMeal(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 分页列表
    async fetchGetSetMealPageList(params) {
      const { getSetMealPageList } = useStore().getHttps

      const result = await getSetMealPageList(params)

      return storeResponse(result)
    },
    // 获取套餐 详情
    async fetchGetSetMealDetails(id) {
      const { getSetMealDetails } = useStore().getHttps

      const result = await getSetMealDetails(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 删除套餐
    async fetchRemoveSetMeal(params) {
      const { removeSetMeal } = useStore().getHttps

      const result = await removeSetMeal(params)

      return storeResponse(result)
    },
  }
})
