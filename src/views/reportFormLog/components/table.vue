<template>
	<div>
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 表格 -->
			<ml-table
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #payAmount="{ row }">
					<div>
						{{ `$${row.payAmount}` }}
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
	computed,
	getCurrentInstance,
	nextTick
} from 'vue'

const { proxy } = getCurrentInstance()
const systemStore = proxy.$usePiniaModule('systemStore')

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
		prop: 'orderId',
		label: ('订单编号'),
		width: '250'
	},
	{
		prop: 'payTime',
		label: ('支付时间'),
		minWidth: '170'
	},
	{
		prop: 'payAmount',
		label: ('支付金额'),
		showTemplate: true,
		minWidth: '150'
	},
	{
		prop: 'paymentMethodName',
		propSecond: 'paymentMethodNameLanguage',
		label: ('支付方式'),
		minWidth: '120'
	}
]

// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams
	}

	systemStore.fetchGetOrderPayDetailReporting(params).then((res) => {
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