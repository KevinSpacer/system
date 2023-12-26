
// 活动管理

export default [

  // 限时活动
  // 添加
  {name:'addLimitActivities',url:'/limitActivities/addLimitActivities',method:'post'},
  // 删除
  {name:'removeLimitActivities',url:'/limitActivities/removeLimitActivities',method:'delete'},
  // 修改
  {name:'editLimitActivities',url:'/limitActivities/editLimitActivities',method:'put'},
  // 分页查询
  {name:'getLimitActivitiesPageList',url:'/limitActivities/getLimitActivitiesPageList',method:'get'},
  // 获取菜品详情信息
  {name:'getLimitActivitiesDetails',url:'/limitActivities/getLimitActivitiesDetails',method:'get'},

  // 优惠活动
  // 添加
  {name:'addSpecialOffer',url:'/specialOffer/addSpecialOffer',method:'post'},
  // 删除
  {name:'removeSpecialOffer',url:'/specialOffer/removeSpecialOffer',method:'delete'},
  // 修改
  {name:'editSpecialOffer',url:'/specialOffer/editSpecialOffer',method:'put'},
  // 分页查询
  {name:'getSpecialOfferPageList',url:'/specialOffer/getSpecialOfferPageList',method:'get'},
  // 获取菜品详情信息
  {name:'getSpecialOfferDetails',url:'/specialOffer/getSpecialOfferDetails',method:'get'},


]