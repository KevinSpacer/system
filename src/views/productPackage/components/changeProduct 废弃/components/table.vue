<template>
	<div class="manage-box">
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 表格 -->
			<ml-table
				@selectHand="changeSelection"
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #status="{ row }">
					<div>
						{{ siwtchParams[row.status] }}
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

import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()
const productStore = proxy.$usePiniaModule('productStore')

// 套餐属性的携带数据
const packageTransmits = productStore.packageTransmit

const route = useRoute()

// 回显选中数据
const chooseIds = ref(route.query.ids)
// 当前套餐属性的索引位置
const itemIndex = route.query.itemIndex

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
const fetchFilterData = async (params) => {
	for (let i in params) {
		filterParams[i] = params[i]
	}
	pageParams.pageNum = 1
	await getTableList()

	nextTick(() => {
		setTimeout(() => {
			// 当前页数||全局数据||空
			const ids = chooseDataId.value[1] || chooseResult.value.ids || []

			callTableData(ids)
		}, 300)
	})
}

// 监听分页 页数变化 回显数据
watch(
	() => pageParams.pageNum,
	async (nVal) => {
		await getTableList()
		nextTick(() => {
			setTimeout(() => {
				// 当前页数||全局数据||空
				const ids = chooseDataId.value[nVal] || chooseResult.value.ids || []
				// console.log(ids)

				callTableData(ids)
			}, 300)
		})
	}
)

// 回显表格数据
const callTableData = (ids) => {
	const originData = tableData.value.result
	for (let i = 0; i < originData.length; i++) {
		const item = originData[i]

		if (ids.includes(item.id)) {
			// console.log(item)
			tableRef.value.toggleRowSelection(item, true)
		}
	}
}

// 监听分页 数量变化 清除数据
watch(
	() => pageParams.pageSize,
	async (nVal) => {
		await getTableList()

		nextTick(() => {
			setTimeout(() => {
				const ids = chooseResult.value.ids

				callTableData(ids)
			}, 300)
		})
	}
)

// 模板数据
const templateData = [
	{
		type: 'selection',
		width: '60'
	},
	{
		prop: 'name',
		propSecond: 'nameLanguage',
		label: ('菜品名称'),
		minWidth: '150'
	},
	{
		prop: 'classifyName',
		propSecond: 'classifyNameLanguage',
		label: ('菜品分类'),
		minWidth: '120'
	},
	{
		prop: 'classifyCombineName',
		propSecond: 'classifyCombineNameLanguage',
		label: ('菜品组合'),
		minWidth: '120'
	},
	{
		prop: 'price',
		label: ('价格'),
		minWidth: '100'
	},
	{
		prop: 'status',
		label: ('库存'),
		minWidth: '100'
	},
	{
		prop: 'creationTime',
		label: ('总销量'),
		minWidth: '170'
	}
]

// 列表分页数据
const tablePageData = ref({})
// 列表分页总数据
const tableAllData = computed(() => {
	const arr = []
	for (let i in tablePageData.value) {
		const data = tablePageData.value[i] || []
		arr.push(...data)
	}

	return arr
})
// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams
	}

	return productStore.fetchGetProductDishesPageList(params).then((res) => {
		tableData.value = res

		// 赋值数据
		tablePageData.value[pageParams.pageNum] = res.result
	})
}

// ref
const tableRef = ref()
// 打开表格加载
const openTableLoading = () => {
	tableRef.value.showLoading = true
}

// 根据分页 选中数据
let chooseDataId = ref({})
// 监听选中数据
const changeSelection = (res, row) => {
	// 判断是否存在勾选的数据，存在则清除
	const ids = chooseIds.value.split(',').map((item) => Number(item))
	if (chooseIds.value) {
		// 单选 操作
		if (row && res.length) {
			const currId = row.id || ''
			const currIndex = ids.findIndex((item) => item == currId)

			// console.log(currIndex)
			// console.log(ids)
			// 删除
			if (currIndex != -1) {
				ids.splice(currIndex, 1)

				// 处理回显数据
				chooseIds.value = ids.join(',')
				packageTransmits[itemIndex].productList.splice(currIndex, 1)
			}
		}

		// 空值
		if (!res.length) {
			// 清除
			const currIds = (tablePageData.value[pageParams.pageNum] || []).map(
				(item) => item.id
			)
			const len = ids.length

			for (var i = 0; i < len; i++) {
				const id = ids[i]
				// 比较
				if (currIds.includes(id)) {
					ids.splice(i, 1, '')
				}
			}
			// 赋值
			chooseIds.value = ids.filter((item) => item).join(',')
		}
	}

	// 赋值
	chooseDataId.value[pageParams.pageNum] = res.map((item) => item.id)
}

// 解析选中数据
const chooseResult = computed(() => {
	let ids = []

	// 符合条件的数据
	let result = []
	// 编辑
	if (chooseIds.value) {
		ids = chooseIds.value.split(',').map((item) => Number(item))
		// 本地数据
		result = packageTransmits[itemIndex].productList
	}

	// 获取 各页的id
	for (let i in chooseDataId.value) {
		const dataIds = chooseDataId.value[i]
		ids.push(...dataIds)
	}

	// 去重
	ids = ids.reduce((add, curr) => {
		if (!add.includes(curr)) {
			add.push(curr)
		}
		return add
	}, [])

	// 选中数据
	result.push(
		...tableAllData.value.filter((item) => ids.includes(Number(item.id)))
	)

	// 去重
	result = result.reduce((add, curr) => {
		if (!add.filter((item) => item.id == curr.id).length) {
			add.push(curr)
		}
		return add
	}, [])

	// console.log(ids)
	// console.log(result)
	return {
		ids,
		result,
		itemIndex
	}
})

onMounted(async () => {
	await getTableList()

	// 编辑初始回显
	if (chooseIds.value) {
		nextTick(() => {
			setTimeout(() => {
				const ids = chooseIds.value.split(',').map((item) => Number(item))
				callTableData(ids)
			}, 300)
		})
	}
})

defineExpose({
	resetParams,
	fetchFilterData,
	getTableList,
	openTableLoading,
	chooseResult
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
	}
}
</style>