// 餐厅管理
export default [

  // 餐厅信息
  // 获取餐厅信息
  {name:'getDiningRoomSelectInfo',url:'/open/diningRoom/selectInfo',method:'get'},
  // 餐厅设置
  {name:'getDiningRoomSetting',url:'/diningRoom/setting',method:'post'},

  // 基本设置
  // 获取基础设置参数
  {name:'getBaseSetting',url:'/baseSetting/getBaseSetting',method:'get'},
  // 设置基础参数
  {name:'settingBaseParam',url:'/baseSetting/settingBaseParam',method:'post'},

  // 税率
  // 添加税率
  {name:'taxRateAdd',url:'/taxRate/add',method:'post'},
  // 编辑税率
  {name:'taxRateEdit',url:'/taxRate/edit',method:'post'},
  // 分页列表
  {name:'getTaxRatePageList',url:'/taxRate/getPageList',method:'get'},
  // 删除税率
  {name:'deleteTaxRate',url:'/taxRate/remove',method:'delete'},

  // 折扣
  // 添加折扣
  {name:'discountAdd',url:'/discount/add',method:'post'},
  // 编辑折扣
  {name:'discountEdit',url:'/discount/edit',method:'post'},
  // 分页列表
  {name:'getDiscountPageList',url:'/discount/getPageList',method:'get'},
  // 删除折扣
  {name:'deleteDiscount',url:'/discount/remove',method:'delete'},
  
  // 服务费
  // 添加服务费
  {name:'serviceChargeAdd',url:'/serviceCharge/add',method:'post'},
  // 编辑服务费
  {name:'serviceChargeEdit',url:'/serviceCharge/edit',method:'post'},
  // 分页列表
  {name:'getServiceChargePageList',url:'/serviceCharge/getPageList',method:'get'},
  // 删除服务费
  {name:'deleteServiceCharge',url:'/serviceCharge/remove',method:'delete'},

  
  // 付款方式
  // 添加
  {name:'paymentMethodAdd',url:'/paymentMethod/add',method:'post'},
  // 编辑
  {name:'paymentMethodEdit',url:'/paymentMethod/edit',method:'post'},
  // 分页列表
  {name:'getPaymentMethodPageList',url:'/paymentMethod/getPageList',method:'get'},
  // 删除
  {name:'deletePaymentMethod',url:'/paymentMethod/remove',method:'delete'},
]