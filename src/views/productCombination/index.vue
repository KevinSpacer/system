<template>
	<div class="manage-box">
		<filter-box
			:getClassifyFun="getClassifyList"
			@submit="filterCall"
			@reset="resetCall"
		></filter-box>

		<table-box :getClassifyFun="getClassifyList" ref="tableBoxRef"></table-box>
	</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import filterBox from './components/filter.vue'
import tableBox from './components/table.vue'

const { proxy } = getCurrentInstance()

const productStore = proxy.$usePiniaModule('productStore')

const tableBoxRef = ref()

// 搜索
const filterCall = (params) => {
	tableBoxRef.value.fetchFilterData(params)
	// 加载
	tableBoxRef.value.openTableLoading()
}

// 重置
const resetCall = (params) => {
	tableBoxRef.value.resetParams(params)
	// 加载
	tableBoxRef.value.openTableLoading()
}

// 查询所属分类
const getClassifyList = (params) => {
	return productStore.fetchGetAllClassifyPageList(params)
}

onMounted(() => {
	getClassifyList()
})
</script>


<style lang="scss" scoped>
.manage-box {
}
</style>