<template>
	<div class="manage-box">
		<filter-box @submit="filterCall" @reset="resetCall"></filter-box>

		<table-box ref="tableBoxRef"></table-box>

		<div class="action-btn">
			<el-button @click="cancel">取消</el-button>
			<el-button @click="confirm" type="primary">确认</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import filterBox from './components/filter.vue'
import tableBox from './components/table.vue'

const tableBoxRef = ref()

const emits = defineEmits(['confirm', 'cancel'])

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

const confirm = () => {
	emits('confirm', tableBoxRef.value.chooseResult)
}
const cancel = () => {
	emits('cancel')
}
</script>


<style lang="scss" scoped>
.manage-box {
	.action-btn {
		margin-top: 30px;
		text-align: center;
	}
}
</style>