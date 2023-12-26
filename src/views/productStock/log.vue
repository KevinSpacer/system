<template>
	<div>
		<detail-header-panel></detail-header-panel>
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 表格 -->
			<ml-table
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #recordType="{ row }">
					{{ $LANG_TEXT(recordTypes[row.recordType]) }}
				</template>
				<template #operationType="{ row }">
					{{ $LANG_TEXT(operationTypes[row.operationType]) }}
				</template>
				<template #stockLowerLimitCount="{ row }">
					<div>
						<el-input
							v-model="row.stockLowerLimitCount"
							type="number"
							@blur="updateStockLowerLimit(row)"
							size="small"
						></el-input>
					</div>
				</template>
			</ml-table>
		</div>
	</div>
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
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()

const productStore = proxy.$usePiniaModule('productStore')

const route = useRoute()
const viewId = route.query.viewId

// 表格数据
const tableData = ref({})

const pageParams = reactive({
	dishesId: viewId,
	pageNum: 1,
	pageSize: 10
})
// 筛选表单数据
const filterParams = reactive({})

watch([() => pageParams.pageNum, () => pageParams.pageSize], (nVal) => {
	getTableList()
})

// 状态
const operationTypes = {
	OUT_STOCK: '出库',
	IN_STOCK: '入库'
}
const recordTypes = {
	SYSTEM: '系统',
	ORDER: '订单'
}


// 模板数据
const templateData = [
	{
		type: 'index',
		label: ('序号'),
		width: '100'
	},
	{
		prop: 'dishesName',
		propSecond: 'dishesNameLanguage',
		label: ('菜品名称'),
		minWidth: '150'
	},
	{
		prop: 'amount',
		label: ('数量'),
		minWidth: '100'
	},
	{
		prop: 'orderId',
		label: ('订单编号'),
		minWidth: '170'
	},
	{
		prop: 'recordType',
		label: ('记录类型'),
		showTemplate:true,
		minWidth: '100'
	},
	{
		prop: 'operationType',
		label: ('操作类型'),
		showTemplate:true,
		minWidth: '100'
	},
	{
		prop: 'describe',
		label: ('备注'),
		minWidth: '150'
	},
	{
		prop: 'creationTime',
		label: ('时间'),
		minWidth: '170'
	}
]

// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams
	}

	productStore.fetchGetDishesStockRecordPageList(params).then((res) => {
		tableData.value = res
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