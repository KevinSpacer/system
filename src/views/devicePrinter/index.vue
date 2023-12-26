<template>
	<div class="manage-box">
		<div class="header-nav" v-if="viewId">
			<detail-header-panel></detail-header-panel>
		</div>

		<filter-box @submit="filterCall" @reset="resetCall"></filter-box>

		<table-box :viewId="viewId" ref="tableBoxRef"></table-box>
	</div>
</template>

<script setup>
import { ref } from "vue";
import {useRoute} from 'vue-router'
import filterBox from "./components/filter.vue";
import tableBox from "./components/table.vue";

const route = useRoute()

// 调味品组合 跳转 详情
const routeQuery = route.query
const viewId = routeQuery.viewId || ''

const tableBoxRef = ref();

// 搜索
const filterCall = (params) => {
	tableBoxRef.value.fetchFilterData(params);
	// 加载
	tableBoxRef.value.openTableLoading();
};

// 重置
const resetCall = (params) => {
	tableBoxRef.value.resetParams(params);
	// 加载
	tableBoxRef.value.openTableLoading();
};
</script>


<style lang="scss" scoped>
.manage-box {

}
</style>