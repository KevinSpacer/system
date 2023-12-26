<template>
	<div class="manage-box">
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 按钮 -->
			<div class="tool-btn">
				<el-button
					type="primary"
					@click="$navigateTo('/productPackageAction')"
					>{{ $LANG_TEXT('添加套餐') }}</el-button
				>
			</div>

			<!-- 表格 -->
			<ml-table
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #logo="{ row }">
					<div class="product-img">
						<ml-image
							:src="proxy.$previewFileUrl + row.logo"
							fit="cover"
						></ml-image>
					</div>
				</template>
				<template #status="{ row }">
					<div>
						{{ $LANG_TEXT(siwtchParams[row.status]) }}
					</div>
				</template>
				<template #btnActive="{ row }">
					<el-popconfirm
						@confirm="confirmDelete(row)"
						:title="`${$LANG_TEXT('确认要删除该套餐吗')}?`"
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
						@click="$navigateTo('/productPackageAction', { viewId: row.id })"
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
// fetchGetSystemMenuList
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
		type: 'index',
		label: ('编号'),
		width: '100'
	},
	{
		prop: 'logo',
		label: ('菜品图片'),
		showTemplate: true,
		minWidth: '150'
	},
	{
		prop: 'name',
		propSecond: 'nameLanguage',
		label: ('套餐名称'),
		minWidth: '150'
	},
	{
		prop: 'classifyName',
		propSecond: 'classifyNameLanguage',
		label: ('套餐分类'),
		minWidth: '120'
	},
	{
		prop: 'classifyCombineName',
		propSecond: 'classifyCombineNameLanguage',
		label: ('套餐组合'),
		minWidth: '120'
	},
	{
		prop: 'price',
		label: ('套餐价格'),
		minWidth: '100'
	},
	{
		prop: 'status',
		label: ('套餐状态'),
		showTemplate: true,
		minWidth: '100'
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

	productStore.fetchGetSetMealPageList(params).then((res) => {
		tableData.value = res
	})
}

// 确认删除
const confirmDelete = (item) => {
	deleteApi(item.id)
}

// 删除接口
const deleteApi = (ids) => {
	productStore.fetchRemoveSetMeal({ id:ids }).then((res) => {
		ElMessage({
			type: 'success',
			message: proxy.$LANG_TEXT('删除成功')
		})
		getTableList()
	})
}

// 显示/隐藏
const siwtchParams = {
	ON_SHELVES: '上架',
	OFF_SHELVES: '下架'
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
	.product-img {
		width: 50px;
		height: 50px;
		cursor: pointer;
		margin: auto;
		border-radius: 5px;
		overflow: hidden;
	}

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