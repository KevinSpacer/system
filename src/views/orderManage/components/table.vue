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
				<template #type="{ row }">
					<div>
						{{ $LANG_TEXT(orderTypes.find((item) => item.value == row.type).label) }}
					</div>
				</template>
				<template #status="{ row }">
					<div>
						{{
							$LANG_TEXT(orderStatusTypes.find((item) => item.value == row.status).label)
						}}
					</div>
				</template>
				<template #btnActive="{ row }">
					<el-button size="small" @click="examie(row)">{{
						$LANG_TEXT('查看')
					}}</el-button>
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
	nextTick
} from 'vue'
import { useRouter } from 'vue-router'
import { orderStatusOpts, orderTypeOpts } from '@/utils/options'

const router = useRouter()

const orderStatusTypes = orderStatusOpts()
const orderTypes = orderTypeOpts()

const { proxy } = getCurrentInstance()
const mainStore = proxy.$usePiniaModule('mainStore')

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
		prop: 'id',
		label: ('订单编号'),
		width: '250'
	},
	{
		prop: 'type',
		label: ('订单类型'),
		showTemplate: true,
		minWidth: '120'
	},
	{
		prop: 'status',
		label: ('订单状态'),
		showTemplate: true,
		minWidth: '120'
	},
	{
		prop: 'actuallyPaidMoney',
		label: ('订单金额'),
		width: '120'
	},
	{
		prop: 'location',
		label: ('位置'),
		width: '120'
	},
	{
		prop: 'peopleQuantity',
		label: ('人数'),
		width: '120'
	},
	{
		prop: 'userName',
		label: ('客户姓名'),
		width: '120'
	},
	{
		prop: 'contactWay',
		label: ('电话号码'),
		width: '150'
	},
	{
		prop: 'address',
		label: ('地址'),
		minWidth: '170'
	},
	{
		prop: 'waiterName',
		label: ('服务员'),
		minWidth: '120'
	},
	{
		prop: 'creationTime',
		label: ('下单时间'),
		width: '170'
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

	mainStore.fetchGetOrderPageList(params).then((res) => {
		tableData.value = res
	})
}


// ref
const tableRef = ref()
// 打开表格加载
const openTableLoading = () => {
	tableRef.value.showLoading = true
}

// 查看
const examie = (item) => {
	proxy.$navigateTo('/orderManageDetail',{
		orderId:item.id
	})
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