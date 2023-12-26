
// 系统管理

import { defineStore } from "pinia";
import {
  storeResponse
} from '@Utils/module'

import useStore from './publicsModule'

export default defineStore({
  id: 'system',
  state:()=>({
    // 当前用户权限
    authList:[]
  }),
  actions: {
    // 系统用户
    // 设置WEB端用户菜单权限
    async fetchSetWebUserPower(params) {
      const { setWebUserPower } = useStore().getHttps

      const result = await setWebUserPower(params)

      return storeResponse(result)
    },
    // 添加用户
    async fetchSystemAddUser(params) {
      const { systemAddUser } = useStore().getHttps

      const result = await systemAddUser(params)

      return storeResponse(result)
    },
    // 删除用户
    async fetchSystemDeleteUser(id) {
      const { systemDeleteUser } = useStore().getHttps

      const result = await systemDeleteUser(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 重置系统用户密码
    async fetchSystemResetPassword(id) {
      const { systemResetPassword } = useStore().getHttps

      const result = await systemResetPassword(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 修改系统用户
    async fetchSystemUserUpdateUpdate(params) {
      const { systemUserUpdate } = useStore().getHttps

      const result = await systemUserUpdate(params)

      return storeResponse(result)
    },
    // 分页查询系统用户
    async fetchGetSelectPageUserList(params) {
      const { getSelectPageUserList } = useStore().getHttps

      const result = await getSelectPageUserList(params)

      return storeResponse(result)
    },
    // 查询系统菜单数据
    async fetchGetSystemMenuList(params) {

      const { getSystemMenuList } = useStore().getHttps

      const result = await getSystemMenuList(params)

      return storeResponse(result)
    },
    // 查询用户的系统权限
    async fetchGetSystemUserAuth(id) {

      // console.log(id)
      const { getSystemUserAuth } = useStore().getHttps

      const result = await getSystemUserAuth(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },



    // 经理端
    // 设置经理端用户菜单权限
    async fetchSetManageUserPower(params) {
      const { setManageUserPower } = useStore().getHttps

      const result = await setManageUserPower(params)

      return storeResponse(result)
    },
    // 添加经理端用户
    async fetchManageUserAdd(params) {
      const { manageUserAdd } = useStore().getHttps

      const result = await manageUserAdd(params)

      return storeResponse(result)
    },
    // 删除经理端用户
    async fetchManageUserDelete(id) {
      const { manageUserDelete } = useStore().getHttps

      const result = await manageUserDelete(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 重置经理端用户密码
    async fetchManageUserResetPassword(id) {
      const { manageUserResetPassword } = useStore().getHttps

      const result = await manageUserResetPassword(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 修改经理端用户
    async fetchManageUserUpdate(params) {
      const { manageUserUpdate } = useStore().getHttps

      const result = await manageUserUpdate(params)

      return storeResponse(result)
    },
    // 分页查询经理端用户
    async fetchGetManageUserSelectPageList(params) {
      const { getManageUserSelectPageList } = useStore().getHttps

      const result = await getManageUserSelectPageList(params)

      return storeResponse(result)
    },
    // 查询经理端菜单
    async fetchGetManageMenuList(params) {
      const { getManageMenuList } = useStore().getHttps

      const result = await getManageMenuList(params)

      return storeResponse(result)
    },
    // 查询经理的权限
    async fetchGetManageUserAuth(id) {

      const { getManageUserAuth } = useStore().getHttps

      const result = await getManageUserAuth(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },



    // 员工端
    // 设置员工端用户菜单权限
    async fetchSetStaffUserPower(params) {
      const { setStaffUserPower } = useStore().getHttps

      const result = await setStaffUserPower(params)

      return storeResponse(result)
    },
    // 添加员工端用户
    async fetchStaffUserAdd(params) {
      const { staffUserAdd } = useStore().getHttps

      const result = await staffUserAdd(params)

      return storeResponse(result)
    },
    // 删除员工端用户
    async fetchStaffUserDelete(id) {
      const { staffUserDelete } = useStore().getHttps

      const result = await staffUserDelete(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 重置员工端用户密码
    async fetchStaffUserResetPassword(id) {
      const { staffUserResetPassword } = useStore().getHttps

      const result = await staffUserResetPassword(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 修改员工端用户
    async fetchStaffUserUpdate(params) {
      const { staffUserUpdate } = useStore().getHttps

      const result = await staffUserUpdate(params)

      return storeResponse(result)
    },
    // 分页查询员工端用户
    async fetchGetStaffUserSelectPageList(params) {
      const { getStaffUserSelectPageList } = useStore().getHttps

      const result = await getStaffUserSelectPageList(params)

      return storeResponse(result)
    },
    // 查询员工端菜单
    async fetchGetStaffMenuList(params) {
      const { getStaffMenuList } = useStore().getHttps

      const result = await getStaffMenuList(params)

      return storeResponse(result)
    },
    // 查询员工的权限
    async fetchGetStaffUserAuth(id) {

      const { getStaffUserAuth } = useStore().getHttps

      const result = await getStaffUserAuth(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },


    // 客户资料
    // 添加
    async fetchClientAdd(params) {
      const { clientAdd } = useStore().getHttps

      const result = await clientAdd(params)

      return storeResponse(result)
    },
    // 修改
    async fetchEditClient(params) {
      const { editClient } = useStore().getHttps

      const result = await editClient(params)

      return storeResponse(result)
    },
    // 获取分页列表
    async fetchGetPageListClient(params) {
      const { getPageListClient } = useStore().getHttps

      const result = await getPageListClient(params)

      return storeResponse(result)
    },
    // 删除
    async fetchClientDelete(id) {
      const { clientDelete } = useStore().getHttps

      const result = await clientDelete(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },

    //  数据库
    // 获取MySQL数据库备份分页列表
    async fetchGetMysqlDatabaseBackupsPageList(params) {
      const { getMysqlDatabaseBackupsPageList } = useStore().getHttps

      const result = await getMysqlDatabaseBackupsPageList(params)

      return storeResponse(result)
    },
    // 备份MySQL数据库
    async fetchBackupsMysqlDatabase(params) {
      const { backupsMysqlDatabase } = useStore().getHttps

      const result = await backupsMysqlDatabase(params)

      return storeResponse(result)
    },
    // 导入MySQL数据库
    async fetchImportMysqlDatabase(params) {
      const { importMysqlDatabase } = useStore().getHttps

      const result = await importMysqlDatabase(params)

      return storeResponse(result)
    },
    // 删除MySQL数据库备份
    async fetchRremoveMysqlDatabaseBackups(id) {
      const { removeMysqlDatabaseBackups } = useStore().getHttps

      const result = await removeMysqlDatabaseBackups(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },
    // 恢复MySQL数据库备份
    async fetchRestoreMysqlDatabaseBackups(id) {
      const { restoreMysqlDatabaseBackups } = useStore().getHttps

      const result = await restoreMysqlDatabaseBackups(id, {
        custom: {
          isPathVariable: true
        }
      })

      return storeResponse(result)
    },


    // 操作日志
    // 获取分页列表
    async fetchGetSelectPageSystemLogList(params) {
      const { getSelectPageSystemLogList } = useStore().getHttps

      const result = await getSelectPageSystemLogList(params)

      return storeResponse(result)
    },

    // 语言管理
    // 设置国际化语言包
    async fetchSettingInternationalLanguage(params) {
      const { settingInternationalLanguage } = useStore().getHttps

      const result = await settingInternationalLanguage(params, {
        custom: {
          isFormData: false
        }
      })

      return storeResponse(result)
    },
    // 删除国际化语言包
    async fetchRemoveInternationalLanguage(params) {
      const { removeInternationalLanguage } = useStore().getHttps

      const result = await removeInternationalLanguage(params)

      return storeResponse(result)
    },
    // 获取国际化语言分页列表
    async fetchGetInternationalLanguagePathList(params) {
      const { getInternationalLanguagePathList } = useStore().getHttps

      const result = await getInternationalLanguagePathList(params)

      return storeResponse(result)
    },
    // 获取导入语言数据
    async fetchGetImportLanguageData(params) {
      const { getImportLanguageData } = useStore().getHttps

      const result = await getImportLanguageData(params)

      return storeResponse(result)
    },


    // 打卡记录
    // 获取打卡记录分页列表
    async fetchGetPunchCardRecordSelectPageList(params) {
      const { getPunchCardRecordSelectPageList } = useStore().getHttps

      const result = await getPunchCardRecordSelectPageList(params)

      return storeResponse(result)
    },


    // 报表管理
    // 获取支付明细
    async fetchGetOrderPayDetailReporting(params) {
      const { getOrderPayDetailReporting } = useStore().getHttps

      const result = await getOrderPayDetailReporting(params)

      return storeResponse(result)
    },

  },
  getters:{
    getCurrUserAuth(){
      const list = this.authList
      return list.map(item=>item.title)
    }
  }
})
