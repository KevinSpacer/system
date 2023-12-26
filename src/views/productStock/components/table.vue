<template>
	<div>
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 按钮 -->
			<div class="tool-btn">
				<el-button
					type="primary"
					:disabled="!chooseData.length"
					@click="openFormPopup('in')"
					>{{ $LANG_TEXT('入库') }}</el-button
				>
				<el-button
					type="primary"
					:disabled="!chooseData.length"
					@click="openFormPopup('out')"
					>{{ $LANG_TEXT('出库') }}</el-button
				>
			</div>

			<!-- 表格 -->
			<ml-table
				@selectHand="onSelectChange"
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #stockLowerLimitCount="{ row }">
					<div>
						<el-input
							v-model="row.showLowerLimitCount"
							type="number"
							@blur="updateStockLowerLimit(row)"
							size="small"
						></el-input>
					</div>
				</template>
				<template #stockCount="{ row }">
					<span :style="{color:(row.stockCount<=row.showLowerLimitCount)?'red':''}">{{row.stockCount}}</span>
				</template>
				<template #btnActive="{ row }">
					<el-button
						size="small"
						@click="$navigateTo('/productStockLog', { viewId: row.id })"
						>{{ $LANG_TEXT('查看出入库记录') }}</el-button
					>
				</template>
			</ml-table>
		</div>
	</div>

	<!-- 弹窗 -->
	<ml-dialog
		ref="formDialogRef"
		class="formDialog"
		:title="$LANG_TEXT('添加' + showDialogInfo.title)"
		@confirm="dialogConfirm"
	>
		<template #content>
			<ml-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				:showBtn="false"
			>
				<template #form>
					<el-form-item
						:label="`${$LANG_TEXT(showDialogInfo.title + '数量')}：`"
						prop="amount"
					>
						<el-input
							v-model="formData.amount"
							type="number"
							size="small"
						></el-input>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('备注')}：`">
						<el-input
							v-model.trim="formData.describe"
							type="textarea"
							size="small"
						></el-input>
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
	getCurrentInstance,
	nextTick,
	computed
} from 'vue'

import { testPositiveInteger } from '@/utils/regExp'
import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const productStore = proxy.$usePiniaModule('productStore')

// 表格数据
const tableData = ref({})

const pageParams = reactive({
	pageNum: 1,
	pageSize: 10
})
// 筛选表单数据
const filterParams = reactive({})

// 重置
const resetParams = (params) => {
	fetchFilterData(params)
	// pageParams.pageNum = 1;
	// getTableList();
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
		type: 'selection',
		width: '50'
	},
	{
		prop: 'name',
		propSecond: 'nameLanguage',
		label: ('菜品名称'),
		width: '150'
	},
	{
		prop: 'classifyName',
		propSecond: 'classifyNameLanguage',
		label: ('分类'),
		minWidth: '150'
	},
	{
		prop: 'classifyCombineName',
		propSecond: 'classifyCombineNameLanguage',
		label: ('组合'),
		minWidth: '150'
	},
	{
		prop: 'unit',
		propSecond: 'unitLanguage',
		label: ('单位'),
		minWidth: '100'
	},
	{
		prop: 'stockCount',
		label: ('库存'),
		showTemplate: true,
		minWidth: '100'
	},
	{
		prop: 'stockLowerLimitCount',
		label: ('库存下限'),
		showTemplate: true,
		minWidth: '150'
	},
	{
		prop: 'btnActive',
		label: ('操作'),
		fixed:'right',
		showTemplate: true,
		minWidth: '150'
	}
]

// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams
	}

	productStore.fetchGetProductDishesPageList(params).then((res) => {
		res.result.map(item=>{
			item.showLowerLimitCount = item.stockLowerLimitCount
			return item
		})
		tableData.value = res
	})
}

// 选中数据
const chooseData = ref([])
// 监听表格数据选择
const onSelectChange = (list) => {
	chooseData.value = list.map((item) => item.id)
}

// 失去焦点更新数据
const updateStockLowerLimit = (item) => {
	const id = item.id
	const stockLowerLimitCount = item.stockLowerLimitCount
	const showLowerLimitCount  = item.showLowerLimitCount
	if(stockLowerLimitCount == showLowerLimitCount){
		return 
	}

	productStore
		.fetchEditDishesStockLowerLimitCountPut({
			id,
			stockLowerLimitCount:showLowerLimitCount
		})
		.then((res) => {
			proxy.$message({
				type: 'success',
				message: proxy.$LANG_TEXT('修改成功')
			})
			getTableList()
		})
}

// ref
const formDialogRef = ref()
const formRef = ref()

// 默认数据
const formDefaultData = () => ({
	amount: '',
	describe: ''
})
// 表单数据
const formData = reactive(formDefaultData())
// 表单数据 校验
const formRules = reactive({
	amount: [
		{
			message: proxy.$LANG_TEXT('请输入数量'),
			required: true,
			trigger: 'change'
		},
		{
			validator: (rules, value, call) => {
				if (value) {
					if (testPositiveInteger(value)) {
						call()
					} else {
						call(new Error(proxy.$LANG_TEXT('数量必须为正整数')))
					}
				}
			}
		}
	]
})

// 弹窗 当前选中的库状态
const dialogStockType = ref('')
// 打开弹窗
const openFormPopup = (type) => {
	// 拦截
	if (!chooseData.value.length) {
		return
	}

	formDialogRef.value.openDialog()
	dialogStockType.value = type

	nextTick(async () => {
		// 重置
		formRef.value.resetFields()

		for (let i in formData) {
			formData[i] = formDefaultData()[i]
		}
	})
}

// 库展示信息
const showDialogInfo = computed(() => {
	const type = dialogStockType.value
	const title = type == 'in' ? '入库' : '出库'
	const api =
		type == 'in'
			? 'fetchBatchDishesInStockPost'
			: 'fetchBatchDishesOutStockPost'
	return {
		title,
		api
	}
})

// 弹窗确认
const dialogConfirm = async (call) => {
	const testResult = await proxy.$testForm(call, formRef.value)
	// console.log(testResult);
	if (!testResult) {
		return
	}

	const paramsData = chooseData.value.map((dishesId) => {
		return {
			...formData,
			dishesId
		}
	})

	// console.log(formData);
	productStore[showDialogInfo.value.api](paramsData)
		.then((res) => {
			proxy.$message({
				type: 'success',
				message: proxy.$LANG_TEXT(showDialogInfo.value.title + '成功')
			})
			getTableList()
			formDialogRef.value.closeDialog()
			dialogStockType.value = ''
			chooseData.value = []
			call()
		})
		.catch(() => {
			call()
		})
}

// ref
const tableRef = ref()
// 打开表格加载
const openTableLoading = () => {
	tableRef.value.showLoading = true
}


onMounted(() => {
	getTableList()
})

defineExpose({
	resetParams,
	fetchFilterData,
	getTableList,
	openTableLoading
})
</script>


<style lang="scss" scoped>
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


</style>