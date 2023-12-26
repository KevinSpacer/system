
// 菜品管理

export default [

  // 菜品管理
  // 添加
  {name:'productDishesAdd',url:'/dishes/add',method:'post'},
  // 删除
  {name:'productDishesDelete',url:'/dishes/removeBatchDishes',method:'delete'},
  // 修改
  {name:'productDishesEdit',url:'/dishes/edit',method:'put'},
  // 分页查询
  {name:'getProductDishesPageList',url:'/dishes/getDishesPageList',method:'get'},
  // 获取菜品详情信息
  {name:'getProductDishesDetailsInfo',url:'/dishes/getDishesDetails',method:'get'},
  // 设置菜谱上下架状态
  {name:'settingBatchDishesShelvesStatus',url:'/dishes/settingBatchDishesShelvesStatus',method:'put'},
  // 获取商品分页列表
  {name:'getGoodsPageList',url:'/dishes/getGoodsPageList',method:'get'},
  // 获取商品数量
  {name:'getDishesCount',url:'/dishes/getDishesCount',method:'get'},
  // 导入菜品
  {name:'importDishes',url:'/open/excel/importDishes',method:'post'},
  
  // 分类管理
  // 添加
  {name:'productClassifyAdd',url:'/classify/add',method:'post'},
  // 编辑
  {name:'productClassifyEdit',url:'/classify/edit',method:'post'},
  // 分页列表
  {name:'productClassifyGetPageList',url:'/classify/getPageList',method:'get'},
  // [选择器] 获取所有分类名称分页列表
  {name:'getAllClassifyPageList',url:'/classify/chooser/getAllClassifyPageList',method:'get'},
  // 删除
  {name:'deleteProductClassify',url:'/classify/remove',method:'delete'},

  // 组合管理
  // 添加
  {name:'classifyCombineAdd',url:'/classifyCombine/add',method:'post'},
  // 编辑
  {name:'classifyCombineEdit',url:'/classifyCombine/edit',method:'post'},
  // 分页列表
  {name:'classifyCombineGetPageList',url:'/classifyCombine/getPageList',method:'get'},
  // [选择器] 获取所有分类组合分页列表
  {name:'getAllProductClassifyPageList',url:'/classifyCombine/chooser/getAllClassifyCombinePageList',method:'get'},
  // 删除
  {name:'deleteClassifyCombine',url:'/classifyCombine/remove',method:'delete'},

  // 库存管理
  // 批量入库
  {name:'batchDishesInStockPost',url:'/dishesStock/batchDishesInStock',method:'post'},
  // 批量出库
  {name:'batchDishesOutStockPost',url:'/dishesStock/batchDishesOutStock',method:'post'},
  // 修改菜品库存下线数量
  {name:'editDishesStockLowerLimitCountPut',url:'/dishesStock/editDishesStockLowerLimitCount',method:'put'},
  // 获取菜品库存下线列表
  {name:'getDishesStockLowerLimitList',url:'/dishesStock/getDishesStockLowerLimitList',method:'get'},
  // 获取菜品库存记录分页列表
  {name:'getDishesStockRecordPageList',url:'/dishesStock/getDishesStockRecordPageList',method:'get'},
  // 获取低于库存下线数量商品列表
  {name:'getStockLowerLimitCountDishesList',url:'/dishes/getStockLowerLimitCountDishesList',method:'get'},

  // 套餐管理
  // 添加套餐
  {name:'setMealAddSetMeal',url:'/setMeal/addSetMeal',method:'post'},
  // 修改套餐
  {name:'setMealEditSetMeal',url:'/setMeal/editSetMeal',method:'put'},
  // 获取套餐分页列表
  {name:'getSetMealPageList',url:'/setMeal/getSetMealPageList',method:'get'},
  // 获取套餐 详情
  {name:'getSetMealDetails',url:'/setMeal/getSetMealDetails',method:'get'},
  // 删除
  {name:'removeSetMeal',url:'/setMeal/removeSetMeal',method:'delete'},
]