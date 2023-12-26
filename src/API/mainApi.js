
// 入口
export default [
  // 账号密码登录
  { name: 'loginPost', url: '/open/systemUser/login', method: 'post' },
  // 修改密码
  { name: 'updatePasswordPut', url: '/systemUser/updatePassword', method: 'put' },
  // 查询当前用户信息
  { name: 'selectCurrentUserInfo', url: '/systemUser/selectCurrentUserInfo', method: 'get' },

  // 语言管理
  // 获取国际化语言类型列表
  { name: 'getInternationalLanguageTypeData', url: '/internationalLanguage/getInternationalLanguageTypeList', method: 'get' },
  // 获取国际化语言内容列表 
  { name: 'getInternationalLanguageContentList', url: '/open/internationalLanguage/getInternationalLanguageContentList', method: 'get' },

  // 修改系统用户语言
  { name: 'editSystemUserLanguage', url: '/systemUser/editSystemUserLanguage', method: 'put' },

  // 文件上传
  { name: 'uploadImage', url: '', method: 'post' },

  // 订单
  // 获取订单列表
  { name: 'getOrderPageList', url: '/order/getOrderPageList', method: 'get' },
  // 获取订单详情
  { name: 'getOrderDetails', url: '/order/getOrderDetails', method: 'get' },
  // 获取订单支付明细列表
  { name: 'getOrderPayDetailList', url: '/order/getOrderPayDetailList', method: 'get' },
  // 获取订单购物单列表
  { name: 'getOrderShoppingList', url: '/order/getOrderShoppingList', method: 'get' },
  // 计算订单金额
  { name: 'calculateOrderMoney', url: '/order/calculateOrderMoney', method: 'post' },
  // 获取订单支付方式统计
  { name: 'selectOrderPayStatistics', url: '/order/selectOrderPayStatistics', method: 'get' },
  // 获取订单金额统计
  { name: 'selectOrderMoneyStatistics', url: '/order/selectOrderMoneyStatistics', method: 'get' },
  // 获取订单退款列表
  { name: 'getOrderRefundList', url: '/order/getOrderRefundList', method: 'get' },
  // 获取订单小费列表
  { name: 'getOrderTippingList', url: '/order/getOrderTippingList', method: 'get' },
  

]