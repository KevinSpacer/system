<template>
	<div>
		<!-- 选项卡 -->
		<div class="header-tab">
			<div
				class="tab-item"
				:class="{ active: headerTabVal == item.value }"
				@click="headerTabVal = item.value"
				v-for="item in headerTab"
				:key="item.label"
			>
				{{ $LANG_TEXT(item.label) }}
			</div>
		</div>

		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 按钮 -->
			<div class="tool-btn">
				<el-button type="primary" @click="openFormPopup()">{{
					$LANG_TEXT('添加')
				}}</el-button>
			</div>

			<!-- 表格 -->
			<ml-table
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #status="{ row }">
					<div>{{ getUserState(row) }}</div>
				</template>
				<template #btnActive="{ row }">
					<el-button type="primary" size="small" @click="openFormPopup(row)">{{
						$LANG_TEXT('编辑')
					}}</el-button>

					<el-popconfirm
						@confirm="confirmDelete(row)"
						:title="`${$LANG_TEXT('确认要删除该用户吗')}?`"
					>
						<template #reference>
							<el-button type="danger" size="small">{{
								$LANG_TEXT('删除')
							}}</el-button>
						</template>
					</el-popconfirm>

					<el-popconfirm
						@confirm="confirmResetPwd(row)"
						:title="`${$LANG_TEXT('确认要重置该用户的密吗')}?`"
					>
						<template #reference>
							<el-button type="warning" size="small">{{
								$LANG_TEXT('重置密码')
							}}</el-button>
						</template>
					</el-popconfirm>
				</template>
			</ml-table>
		</div>
	</div>

	<!-- 弹窗 -->
	<ml-dialog
		ref="formDialogRef"
		class="formDialog"
		:title="$LANG_TEXT('用户信息')"
		@confirm="dialogConfirm"
	>
		<template #content>
			<ml-form
				ref="formRef"
				:model="formData"
				:rules="ruleResult"
				:showBtn="false"
			>
				<template #form>
					<el-form-item :label="`${$LANG_TEXT('成员姓名')}：`" prop="name">
						<el-input
							v-model="formData.name"
							:placeholder="`${$LANG_TEXT('请输入成员姓名')}`"
						/>
					</el-form-item>

					<el-form-item
						:label="`${$LANG_TEXT('联系方式')}：`"
						prop="contactWay"
					>
						<el-input
							v-model="formData.contactWay"
							:placeholder="`${$LANG_TEXT('请输入联系方式')}`"
						/>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('登录账号')}：`" prop="account">
						<el-input
							v-model="formData.account"
							:placeholder="`${$LANG_TEXT('请输入登录账号')}`"
						/>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('登录密码')}：`" prop="password">
						<el-input
							v-if="choseItem"
							type="password"
							v-model="formData.password"
							placeholder="**********"
						/>
						<el-input
							v-else
							type="password"
							v-model="formData.password"
							:placeholder="`${$LANG_TEXT('请输入登录密码')}`"
						/>
					</el-form-item>

					<el-form-item
						:label="`${$LANG_TEXT('确认密码')}：`"
						prop="againPassword"
					>
						<el-input
							v-if="choseItem"
							type="password"
							v-model="formData.againPassword"
							placeholder="**********"
						/>
						<el-input
							v-else
							type="password"
							v-model="formData.againPassword"
							:placeholder="`${$LANG_TEXT('请输入确认密码')}`"
						/>
					</el-form-item>

					<el-form-item
						:label="`${$LANG_TEXT('端口')}：`"
						prop="oldPassWord"
						v-if="!choseItem"
					>
						<el-select class="inline-block" v-model="chosePort">
							<el-option
								v-for="item in portData"
								:key="item.label"
								:value="item.value"
								:label="$LANG_TEXT(item.label)"
								>{{ $LANG_TEXT(item.label) }}</el-option
							>
						</el-select>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('是否启用')}：`">
						<ml-switch
							v-model:switch="formData.status"
							activeValue="ENABLE"
							inactiveValue="DISABLE"
						></ml-switch>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('备注信息')}：`">
						<el-input
							type="textarea"
							:autosize="{ minRows: 4, maxRows: 6 }"
							:placeholder="$LANG_TEXT('备注信息')"
							v-model="formData.remark"
						>
						</el-input>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('功能权限')}：`" prop="powerAuth">
						<el-tree
							@check-change="changePower"
							:data="powerData"
							show-checkbox
							default-expand-all
							node-key="id"
							ref="treeRef"
							highlight-current
							:props="{
								children: 'children',
								label: 'label'
							}"
						>
						</el-tree>
					</el-form-item>
				</template>
			</ml-form>
		</template>
	</ml-dialog>
</template>

<script setup>
import {
	ref,
	reactive,
	watch,
	onMounted,
	computed,
	getCurrentInstance,
	nextTick
} from 'vue'

import { userStatusOpts } from '@/utils/options'
import { ElMessage } from 'element-plus'

import { testPositiveInteger, testPwd } from '@/utils/regExp'

const { proxy } = getCurrentInstance()
// fetchGetSystemMenuList
const systemStore = proxy.$usePiniaModule('systemStore')

// 校验 限制了长度的正整数
const testManagePwd = (rule, value, callback) => {
	if (value) {
		const len = String(value).length
		if (!testPositiveInteger(value) || len < 6 || len > 20) {
			callback(new Error(proxy.$LANG_TEXT('密码请输入6-20位的数字')))
		} else {
			callback()
		}
	} else {
		callback()
	}
}
// 校验常规密码
const testNormalPwd = (rule, value, callback) => {
	if (value && !testPwd(value)) {
		callback(new Error(proxy.$LANG_TEXT('密码请输入6-20位的字母或数字或组合')))
	} else {
		callback()
	}
}
// 验证密码是否一致
const testPwdIdentical = (rule, value, callback) => {
	if (formData.password && formData.againPassword) {
		if (formData.password != formData.againPassword) {
			callback(new Error(proxy.$LANG_TEXT('两次密码不一致')))
		} else {
			callback()
		}
	} else {
		callback()
	}
}

// 验证正整数
const testAllNumber = (rules, value, call) => {
	if (testPositiveInteger(value)) {
		call()
	} else {
		call(new Error(proxy.$LANG_TEXT('请输入数字')))
	}
}

// 顶部选项卡
const headerTab = [
	{
		label: ('后台端'),
		value: '0'
	},
	{
		label: ('经理端'),
		value: '1'
	},
	{
		label: ('员工端'),
		value: '2'
	}
]
// 顶部选项卡值
const headerTabVal = ref(0)
// 监听变化
watch(
	() => headerTabVal.value,
	(nVal) => {
		pageParams.userType = nVal
		pageParams.pageNum = 1
		
		// 赋值端口
		const types = ['web', 'manage', 'app']
		chosePort.value = types[nVal]
		getTableList()
	}
)

// 表格数据
const tableData = ref({})

const pageParams = reactive({
	userType: 0,
	pageNum: 1,
	pageSize: 10
})
// 筛选表单数据
const filterParams = reactive({})

// 重置
const resetParams = (params) => {
	fetchFilterData(params)
}
// 接收筛选栏的数据
const fetchFilterData = (params) => {
	for (let i in params) {
		filterParams[i] = params[i]
	}
	pageParams.pageNum = 1
	getTableList()
}

watch([() => pageParams.pageNum, () => pageParams.pageSize], (nVal) => {
	getTableList()
})

// 模板数据
const templateData = [
	{
		prop: 'name',
		label: ('姓名'),
		minWidth: '170'
	},
	{
		prop: 'account',
		label: ('账号'),
		minWidth: '170'
	},
	{
		prop: 'status',
		label: ('是否启用'),
		showTemplate: true
	},
	{
		prop: 'creationTime',
		label: ('添加时间'),
		minWidth: '170'
	},
	{
		prop: 'btnActive',
		label: ('操作'),
		fixed:'right',
		showTemplate: true,
		minWidth: '220'
	}
]

// 查询系统用户表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams
	}

	systemStore[userApiConfig.value.listApiName](params).then((res) => {
		tableData.value = res
	})
}

// 不同用户的接口
const userApiConfig = computed(() => {
	const userType = headerTabVal.value
	// 选择的端口
	const userTypeVal = chosePort.value

	// 选项卡操作 -----
	// 列表类型
	const listType = [
		'fetchGetSelectPageUserList',
		'fetchGetManageUserSelectPageList',
		'fetchGetStaffUserSelectPageList'
	]
	const listApiName = listType[userType]

	// 删除类型
	const deleteType = [
		'fetchSystemDeleteUser',
		'fetchManageUserDelete',
		'fetchStaffUserDelete'
	]
	const deleteApiName = deleteType[userType]

	// 重置密码类型
	const resetPwdType = [
		'fetchSystemResetPassword',
		'fetchManageUserResetPassword',
		'fetchStaffUserResetPassword'
	]
	const resetPwdTApiName = resetPwdType[userType]
	// 选项卡操作 -----

	// 端口选择 ------
	// 添加类型
	const addType = {
		web: 'fetchSystemAddUser',
		manage: 'fetchManageUserAdd',
		app: 'fetchStaffUserAdd'
	}

	const addApiName = addType[userTypeVal]

	// 修改类型
	const updateType = {
		web: 'fetchSystemUserUpdateUpdate',
		manage: 'fetchManageUserUpdate',
		app: 'fetchStaffUserUpdate'
	}
	const updateApiName = updateType[userTypeVal]

	// 查询权限列表类型
	const powerType = {
		web: 'fetchGetSystemMenuList',
		manage: 'fetchGetManageMenuList',
		app: 'fetchGetStaffMenuList'
	}
	const powerApiName = powerType[userTypeVal]

	// 设置权限 类型
	const setPowerType = {
		web: 'fetchSetWebUserPower',
		manage: 'fetchSetManageUserPower',
		app: 'fetchSetStaffUserPower'
	}
	const setPowerApiName = setPowerType[userTypeVal]

	// 用户的使用权限
	const userAuthType = {
		web: 'fetchGetSystemUserAuth',
		manage: 'fetchGetManageUserAuth',
		app: 'fetchGetStaffUserAuth'
	}
	const userAuthApiName = userAuthType[userTypeVal]

	// 端口选择 ------

	// console.log(userTypeVal);
	return {
		listApiName,
		deleteApiName,
		resetPwdTApiName,
		addApiName,
		updateApiName,
		powerApiName,
		setPowerApiName,
		userAuthApiName
	}
})

// 筛选状态
const getUserState = (item) => {
	const states = userStatusOpts()
	const d = states.find((s) => s.value == item.status)
	return proxy.$LANG_TEXT(d.label)
}

// 确认删除
const confirmDelete = (item) => {
	systemStore[userApiConfig.value.deleteApiName](item.id).then((res) => {
		ElMessage({
			type: 'success',
			message: proxy.$LANG_TEXT('删除成功')
		})
		getTableList()
	})
}

// 确认重置用户密码
const confirmResetPwd = (item) => {
	systemStore[userApiConfig.value.resetPwdTApiName](item.id).then((res) => {
		ElMessage({
			type: 'success',
			message: proxy.$LANG_TEXT('重置成功')
		})
		getTableList()
	})
}

// ref
const formDialogRef = ref()
const formRef = ref()

// 默认数据
const formDefaultData = () => ({
	id: '',
	account: '',
	contactWay: '',
	name: '',
	password: '',
	againPassword: '',
	remark: '',
	status: 'ENABLE'
})
// 表单数据
const formData = reactive(formDefaultData())
// 表单数据 校验
const formRules = computed(()=>({
	account: [
		{
			message: proxy.$LANG_TEXT('请输入账号'),
			required: true,
			trigger: 'change'
		}
	],
	contactWay: [
		{
			message: proxy.$LANG_TEXT('请输入联系方式'),
			required: true,
			trigger: 'change'
		}
	],
	name: [
		{
			message: proxy.$LANG_TEXT('请输入成员姓名'),
			required: true,
			trigger: 'change'
		}
	],
	// 功能权限
	powerAuth: [
		{
			message: proxy.$LANG_TEXT('请选择功能权限'),
			required: true,
			trigger: 'change'
		}
	]
}))
// 最终确认表单规则
const ruleResult = computed(() => {
	const port = chosePort.value
	const pwdVoid = {
		message: proxy.$LANG_TEXT('请输入密码'),
		required: true,
		trigger: 'change'
	}
	const againPwdVoid = {
		message: proxy.$LANG_TEXT('请再输入确认密码'),
		required: true,
		trigger: 'change'
	}

	// 编辑
	if (choseItem.value) {
		// 经理端
		if (port == 'manage' || port == 'app') {
			return {
				...formRules.value,
				password: [
					{ validator: testManagePwd },
					{ validator: testPwdIdentical }
				],
				againPassword: [
					{ validator: testManagePwd },
					{ validator: testPwdIdentical }
				],
				account: [...formRules.value.account, { validator: testAllNumber }]
			}
		} else {
			//其他端口
			return {
				...formRules.value,
				password: [
					{ validator: testNormalPwd },
					{ validator: testPwdIdentical }
				],
				againPassword: [
					{ validator: testNormalPwd },
					{ validator: testPwdIdentical }
				]
			}
		}
	} else {
		//添加
		// 经理端
		if (port == 'manage' || port == 'app') {
			return {
				...formRules.value,
				password: [
					pwdVoid,
					{ validator: testManagePwd },
					{ validator: testPwdIdentical }
				],
				againPassword: [
					againPwdVoid,
					{ validator: testManagePwd },
					{ validator: testPwdIdentical }
				],
				account: [...formRules.value.account, { validator: testAllNumber }]
			}
		} else {
			//其他端口
			return {
				...formRules.value,
				password: [
					pwdVoid,
					{ validator: testNormalPwd },
					{ validator: testPwdIdentical }
				],
				againPassword: [
					againPwdVoid,
					{ validator: testNormalPwd },
					{ validator: testPwdIdentical }
				]
			}
		}
	}
})

// 端口数据
const portData = [
	{
		label: ('后台'),
		value: 'web'
	},
	{
		label: ('经理'),
		value: 'manage'
	},
	{
		label: ('员工'),
		value: 'app'
	}
]
// 选择的端口数据
const chosePort = ref('web')
watch(
	() => chosePort.value,
	(nVal) => {
		getUserPower()
	}
)

// 编辑当前用户 存放的数据
const choseItem = ref()

// 打开弹窗
const openFormPopup = (item = '') => {
	formDialogRef.value.openDialog()

	nextTick(async () => {
		// 重置
		formRef.value.resetFields()
		treeRef.value.setCheckedKeys([], false)
		choseItem.value = item

		if (item) {
			for (let i in formData) {
				formData[i] = item[i]
			}

			// 赋值端口
			const types = ['web', 'manage', 'app']
			chosePort.value = types[headerTabVal.value]

			// console.log(headerTabVal.value)
			try {
				// 权限数据
				const auths = await getCurrUserPowerAuth()
				// console.log(auths)
				const result = auths.result
				const ids = result.map((item) => item.id)

				// 回显tree
				treeRef.value.setCheckedKeys(ids, false)
				formData.powerAuth = ids.join(',')
			} catch (error) {}
		} else {
			for (let i in formData) {
				formData[i] = formDefaultData()[i]
			}
		}
	})
}

// 弹窗确认
const dialogConfirm = async (call) => {
	const userDetail = choseItem.value
	const testResult = await proxy.$testForm(call, formRef.value)
	// console.log(testResult);
	if (!testResult) {
		return
	}

	// API
	const api = choseItem.value
		? userApiConfig.value.updateApiName
		: userApiConfig.value.addApiName
	// 提示
	const tips = choseItem.value ? '修改' : '添加'

	// console.log(formData);
	systemStore[api](formData)
		.then((res) => {
			const result = res.result
			proxy.$message({
				type: 'success',
				message: proxy.$LANG_TEXT(tips + '成功')
			})
			setUserPowerMenu(call, userDetail ? userDetail.id : result.id)
		})
		.catch(() => {
			call()
		})
}

// ref
const treeRef = ref()
// 权限数据
const powerData = ref([])
// 查询总权限数据
const getUserPower = () => {
	// console.log(userApiConfig.value.powerApiName);
	systemStore[userApiConfig.value.powerApiName]().then((res) => {
		const result = res.result || []

		const moduleData = result.map((item) => {
			const id = item.id
			const label = proxy.$LANG_TEXT(item.title)
			return {
				id,
				label
			}
		})

		powerData.value = [
			{
				label: proxy.$LANG_TEXT('所有权限'),
				id: '',
				children: moduleData
			}
		]
	})
}
// 监听 选择权限数据
const changePower = () => {
	const ids = treeRef.value
		.getCheckedKeys()
		.filter((item) => item)
		.join(',')
	formData.powerAuth = ids
}

// 设置用户的菜单权限
const setUserPowerMenu = (call, userId) => {
	const ids = formData.powerAuth

	// 用户的使用权限
	const typeParams = {
		web: {
			systemMenuIds: ids,
			systemUserId: userId
		},
		manage: {
			manageMenuIds: ids,
			manageUserId: userId
		},
		app: {
			staffMenuIds: ids,
			staffUserId: userId
		}
	}

	const params = typeParams[chosePort.value]

	console.log(params)
	systemStore[userApiConfig.value.setPowerApiName](params)
		.then((res) => {
			call()
			choseItem.value = ''
			formRef.value.resetFields()
			getTableList()
			formDialogRef.value.closeDialog()
		})
		.catch(() => {
			call()
		})
}
// 查询当前 用户的使用权限
const getCurrUserPowerAuth = () => {
	const item = choseItem.value || {}

	return systemStore[userApiConfig.value.userAuthApiName](item.id)
}

const tableRef = ref()
// 打开表格加载
const openTableLoading = () => {
	tableRef.value.showLoading = true
}

onMounted(() => {
	getTableList()
	getUserPower()
})

defineExpose({
	resetParams,
	fetchFilterData,
	getTableList,
	openTableLoading
})
</script>


<style lang="scss" scoped>
.header-tab {
	display: grid;
	flex-direction: row;
	flex-wrap: nowrap;
	grid-template-columns: repeat(3, 100px);
	text-align: center;
	grid-template-rows: repeat(1, 40px);
	font-size: 14px;
	margin-bottom: 15px;
	line-height: 40px;

	.tab-item {
		width: 100%;
		height: 100%;
		cursor: pointer;
		transition: 200ms;
		border-radius: 5px;

		&.active {
			background-color: #05d69d;
			color: white;
		}
	}
}

.table-content {
	border: 1px solid #9e9e9e33;
	border-radius: 6px;
	overflow: hidden;
	.tool-btn {
		padding: 5px;
		border-bottom: 1px solid #ececec;
		background-color: #f5f7fa;
	}
}

.formDialog {
	.el-tree {
		width: 100%;
		.el-tree__empty-block {
			width: 100%;
		}
	}
}
</style>