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

const filterCall = (params) => {
	tableBoxRef.value.fetchFilterData(params);
	tableBoxRef.value.openTableLoading();
};

const resetCall = (params) => {
	tableBoxRef.value.resetParams(params);
	tableBoxRef.value.openTableLoading();
};
</script>


<style lang="scss" scoped>
.manage-box {

}
</style>