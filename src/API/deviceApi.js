// 设备管理
export default [

  // 自定义小票
  // 添加打印机模板
  { name: 'addPrinterReceiptTemplate', url: '/printer/receipt/template/addPrinterReceiptTemplate', method: 'post' },
  // 修改打印机模板
  { name: 'editPrinterReceiptTemplate', url: '/printer/receipt/template/editPrinterReceiptTemplate', method: 'put' },
  // 获取打印机模板分页列表
  { name: 'getPrinterReceiptTemplatePageList', url: '/printer/receipt/template/getPrinterReceiptTemplatePageList', method: 'get' },
  // 删除打印机模板
  { name: 'removePrinterReceiptTemplate', url: '/printer/receipt/template/removePrinterReceiptTemplate', method: 'delete' },

 // 打印机设置
  // 添加打印机
  { name: 'addPrinter', url: '/printer/addPrinter', method: 'post' },
  // 修改打印机
  { name: 'editPrinter', url: '/printer/editPrinter', method: 'put' },
  // 获取打印机分页列表
  { name: 'getPrinterPageList', url: '/printer/getPrinterPageList', method: 'get' },
  // 删除打印机
  { name: 'removePrinter', url: '/printer/removePrinter', method: 'delete' },


]