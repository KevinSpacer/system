<template>
	<div class="manage-box">
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 按钮 -->
			<div class="tool-btn">
				<el-button
					type="primary"
					@click="$navigateTo('/activityDiscountAction')"
					>{{ $LANG_TEXT('添加') }}</el-button
				>
			</div>

			<!-- 表格 -->
			<ml-table
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #startTime="{ row }">
					{{row.startTime}} ~ {{row.endTime}}
				</template>
				<template #btnActive="{ row }">
					<el-popconfirm
						@confirm="confirmDelete(row)"
						:title="`${$LANG_TEXT('确认要删除该活动吗')}?`"
					>
						<template #reference>
							<el-button size="small" type="danger">
								{{ $LANG_TEXT('删除') }}
							</el-button>
						</template>
					</el-popconfirm>

					<el-button
						size="small"
						type="primary"
						@click="$navigateTo('/activityDiscountAction', { viewId: row.id })"
					>
						{{ $LANG_TEXT('编辑') }}
					</el-button>
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

import { ElMessage } from 'element-plus'

const { proxy } = getCurrentInstance()
const activeStore = proxy.$usePiniaModule('activeStore')

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
		type: 'index',
		label: ('编号'),
		width: '100'
	},
	{
		prop: 'title',
		label: ('活动名称'),
		minWidth: '150'
	},
	{
		prop: 'startTime',
		showTemplate:true,
		label: ('有效时间'),
		minWidth: '320'
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
		minWidth: '200'
	}
]

// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams
	}

	activeStore.fetchGetSpecialOfferPageList(params).then((res) => {
		tableData.value = res
	})
}

// 确认删除
const confirmDelete = (item) => {
	deleteApi(item.id)
}

// 删除接口
const deleteApi = (ids) => {
	activeStore.fetchRemoveSpecialOffer(ids).then((res) => {
		ElMessage({
			type: 'success',
			message: proxy.$LANG_TEXT('删除成功')
		})
		getTableList()
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
.manage-box {
	.tab-box {
		padding-bottom: 20px;
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
}
</style>