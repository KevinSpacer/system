// 系统管理
export default [

  // 系统用户
  // 设置WEB端用户菜单权限
  { name: 'setWebUserPower', url: '/systemUserMenu/setting', method: 'post' },
  // 添加系统用户
  { name: 'systemAddUser', url: '/systemUser/insert', method: 'post' },
  // 删除系统用户
  { name: 'systemDeleteUser', url: '/systemUser/delete', method: 'delete' },
  // 重置系统用户密码
  { name: 'systemResetPassword', url: '/systemUser/resetPassword', method: 'post' },
  // 修改系统用户
  { name: 'systemUserUpdate', url: '/systemUser/update', method: 'put' },
  // 分页查询系统用户
  { name: 'getSelectPageUserList', url: '/systemUser/selectPageList', method: 'get' },
  // 获取系统菜单
  { name: 'getSystemMenuList', url: '/systemMenu/selectList', method: 'get' },
  // 获取用户的系统权限
  { name: 'getSystemUserAuth', url: '/systemUserMenu/selectList', method: 'get' },

  // 经理端
  // 设置经理端用户菜单权限
  { name: 'setManageUserPower', url: '/manageUserMenu/setting', method: 'post' },
  // 添加经理用户
  { name: 'manageUserAdd', url: '/manageUser/insert', method: 'post' },
  // 修改经理用户
  { name: 'manageUserUpdate', url: '/manageUser/update', method: 'put' },
  // 获取经理用户分页列表
  { name: 'getManageUserSelectPageList', url: '/manageUser/selectPageList', method: 'get' },
  // 删除经理用户
  { name: 'manageUserDelete', url: '/manageUser/delete', method: 'delete' },
  // 重置密码
  { name: 'manageUserResetPassword', url: '/manageUser/resetPassword', method: 'post' },
  // 获取经理菜单列表
  { name: 'getManageMenuList', url: '/manageMenu/selectList', method: 'get' },
  // 获取经理的权限
  { name: 'getManageUserAuth', url: '/manageUserMenu/selectList', method: 'get' },


  // 员工端
  // 设置员工端用户菜单权限
  { name: 'setStaffUserPower', url: '/staffUserMenu/setting', method: 'post' },
  // 添加员工用户
  { name: 'staffUserAdd', url: '/staffUser/insert', method: 'post' },
  // 修改员工用户
  { name: 'staffUserUpdate', url: '/staffUser/update', method: 'put' },
  // 获取员工户分页列表
  { name: 'getStaffUserSelectPageList', url: '/staffUser/selectPageList', method: 'get' },
  // 删除员工用户
  { name: 'staffUserDelete', url: '/staffUser/delete', method: 'delete' },
  // 重置密码
  { name: 'staffUserResetPassword', url: '/staffUser/resetPassword', method: 'post' },
  // 获取员工菜单列表
  { name: 'getStaffMenuList', url: '/staffMenu/selectList', method: 'get' },
  // 获取员工的权限
  { name: 'getStaffUserAuth', url: '/staffUserMenu/selectList', method: 'get' },


  // 客户资料
  // 添加
  { name: 'clientAdd', url: '/client/add', method: 'post' },
  // 添加
  { name: 'editClient', url: '/client/editClient', method: 'put' },
  // 获取分页列表
  { name: 'getPageListClient', url: '/client/getPageList', method: 'get' },
  // 删除
  { name: 'clientDelete', url: '/client/remove', method: 'delete' },

  // 数据库
  // 获取MySQL数据库备份分页列表
  { name: 'getMysqlDatabaseBackupsPageList', url: '/mysqlDatabaseBackups/getMysqlDatabaseBackupsPageList', method: 'get' },
  // 备份MySQL数据库
  { name: 'backupsMysqlDatabase', url: '/mysqlDatabaseBackups/backupsMysqlDatabase', method: 'post' },
  // 导入MySQL数据库
  { name: 'importMysqlDatabase', url: '/mysqlDatabaseBackups/importMysqlDatabase', method: 'post' },
  // 删除MySQL数据库备份
  { name: 'removeMysqlDatabaseBackups', url: '/mysqlDatabaseBackups/removeMysqlDatabaseBackups', method: 'delete' },
  // 恢复MySQL数据库备份
  { name: 'restoreMysqlDatabaseBackups', url: '/mysqlDatabaseBackups/restoreMysqlDatabaseBackups', method: 'post' },

  // 系统资料
  // 获取分页列表
  { name: 'getSelectPageSystemLogList', url: '/systemLog/selectPageList', method: 'get' },

  // 语言管理
  // 设置国际化语言包
  { name: 'settingInternationalLanguage', url: '/internationalLanguage/settingInternationalLanguage', method: 'post' },
  // 删除国际化语言
  { name: 'removeInternationalLanguage', url: '/internationalLanguage/removeInternationalLanguage', method: 'delete' },
  // 获取国际化语言分页列表
  { name: 'getInternationalLanguagePathList', url: '/internationalLanguage/getInternationalLanguagePathList', method: 'get' },
  // 获取导入语言数据
  { name: 'getImportLanguageData', url: '/internationalLanguage/getImportLanguageData', method: 'get' },

  // 打卡记录
  // 获取打卡记录分页列表
  { name: 'getPunchCardRecordSelectPageList', url: '/punchCardRecord/selectPageList', method: 'get' },

  // 报表管理
  // 获取支付明细
  { name: 'getOrderPayDetailReporting', url: '/order/getOrderPayDetailReporting', method: 'get' },

]