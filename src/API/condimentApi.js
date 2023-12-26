
// 调味品

export default [

  // 调味品组合
  // 添加
  {name:'spicesCombineAdd',url:'/spicesCombine/add',method:'post'},
  // 修改
  {name:'spicesCombineEdit',url:'/spicesCombine/edit',method:'post'},
  // [选择器] 获取所有调味品组合名称分页列表
  {name:'getAllNamePagespicesCombine',url:'/spicesCombine/chooser/getAllNamePageList',method:'get'},
  // 获取分页列表
  {name:'getSpicesCombinePageList',url:'/spicesCombine/getPageList',method:'get'},
  // 删除
  {name:'deleteSpicesCombine',url:'/spicesCombine/remove',method:'delete'},

  // 调味品
  // 添加
  {name:'spicesAdd',url:'/spices/add',method:'post'},
  // 修改
  {name:'spicesEdit',url:'/spices/edit',method:'post'},
  // 获取分页列表
  {name:'getSpicesPageList',url:'/spices/getPageList',method:'get'},
  // 删除
  {name:'deleteSpices',url:'/spices/remove',method:'delete'},
  // 导入调味品
  {name:'importSpices',url:'/open/excel/importSpices',method:'post'},

  
  // 自定义调味品
  // 添加
  {name:'customSpicesAdd',url:'/customSpices/add',method:'post'},
  // 获取自定义调味品列表
  {name:'getCustomSpicesList',url:'/customSpices/getList',method:'get'},
  // 删除
  {name:'deleteCustomSpices',url:'/customSpices/remove',method:'delete'},
  // 设置自定义价格排序
  {name:'settingCustomPriceSort',url:'/customPrice/settingCustomPriceSort',method:'post'},

  // 自定义价格
  // 添加
  {name:'customPriceAdd',url:'/customPrice/add',method:'post'},
  // 获取自定义调味品列表
  {name:'getCustomPriceList',url:'/customPrice/getList',method:'get'},
  // 删除
  {name:'deleteCustomPrice',url:'/customPrice/remove',method:'delete'},
  // 设置自定义调味品排序
  {name:'settingCustomSpicesSort',url:'/customSpices/settingCustomSpicesSort',method:'post'},
]