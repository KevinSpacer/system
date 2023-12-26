
// 菜品管理

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'

import useStore from './publicsModule'

export default defineStore({
  id: 'device',
  actions: {

    // 自定义小票
    // 添加打印机模板
    async fetchAddPrinterReceiptTemplate(params) {
      const { addPrinterReceiptTemplate } = useStore().getHttps

      const result = await addPrinterReceiptTemplate(params)

      return storeResponse(result)
    },
    // 修改打印机模板
    async fetchEditPrinterReceiptTemplate(params) {
      const { editPrinterReceiptTemplate } = useStore().getHttps

      const result = await editPrinterReceiptTemplate(params)

      return storeResponse(result)
    },
    // 获取打印机模板分页列表
    async fetchGetPrinterReceiptTemplatePageList(params) {
      const { getPrinterReceiptTemplatePageList } = useStore().getHttps

      const result = await getPrinterReceiptTemplatePageList(params)

      return storeResponse(result)
    },
    // 删除打印机模板
    async fetchRemovePrinterReceiptTemplate(params) {
      const { removePrinterReceiptTemplate } = useStore().getHttps

      const result = await removePrinterReceiptTemplate(params)

      return storeResponse(result)
    },

    // 打印机设置

    // 添加打印机
    async fetchAddPrinter(params) {
      const { addPrinter } = useStore().getHttps

      const result = await addPrinter(params)

      return storeResponse(result)
    },
    // 修改打印机
    async fetchEditPrinter(params) {
      const { editPrinter } = useStore().getHttps

      const result = await editPrinter(params)

      return storeResponse(result)
    },
    // 获取打印机分页列表
    async fetchGetPrinterPageList(params) {
      const { getPrinterPageList } = useStore().getHttps

      const result = await getPrinterPageList(params)

      return storeResponse(result)
    },
    // 删除打印机
    async fetchRemovePrinter(params) {
      const { removePrinter } = useStore().getHttps

      const result = await removePrinter(params)

      return storeResponse(result)
    },

  }
})
