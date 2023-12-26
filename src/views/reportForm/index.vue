<template>
	<div class="manage-box">
		<filter-box @submit="filterCall" @reset="resetCall"></filter-box>

		<table-box ref="tableBoxRef"></table-box>
	</div>
</template>

<script setup>
import { ref } from "vue";
import filterBox from "./components/filter.vue";
import tableBox from "./components/table.vue";

const tableBoxRef = ref();

// 搜索
const filterCall = (params) => {
	tableBoxRef.value.fetchFilterData(params);
};

// 重置
const resetCall = (params) => {
	tableBoxRef.value.resetParams(params);
};
</script>


<style lang="scss" scoped>
.manage-box {

}
</style>