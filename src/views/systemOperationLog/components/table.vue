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
	nextTick,
} from "vue";

const { proxy } = getCurrentInstance();
// fetchGetSystemMenuList
const systemStore = proxy.$usePiniaModule("systemStore");

// 表格数据
const tableData = ref({});

const pageParams = reactive({
	pageNum: 1,
	pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({
	userName:"",
	creationStartTime: "",
	creationEndTime: "",
});

// 重置
const resetParams = (params) => {
	fetchFilterData(params);
	// pageParams.pageNum = 1;
	// getTableList();
};
// 接收筛选栏的数据
const fetchFilterData = (params) => {
	for (let i in params) {
		filterParams[i] = params[i];
	}
	pageParams.pageNum = 1;
	getTableList();
};

watch([() => pageParams.pageNum, () => pageParams.pageSize], (nVal) => {
	getTableList();
});

// 模板数据
const templateData = [
	{
		type: "index",
		label: ("序号"),
		width: "100",
	},
	{
		prop: "module",
		label: ("使用模块"),
		minWidth: "120",
	},
	{
		prop: "name",
		label: ("操作记录"),
		minWidth: "300",
	},{
		prop: "webBrowser",
		label: ("浏览器"),
		minWidth: "100",
	},{
		prop: "system",
		label: ("系统版本"),
		minWidth: "100",
	},{
		prop: "userName",
		label: ("操作者"),
		minWidth: "100",
	},
	{
		prop: "creationTime",
		label: ("操作日期"),
		minWidth: "170",
	},
	// {
	// 	prop: "ip",
	// 	label: ("IP地址"),
	// 	minWidth: "150",
	// },
];

// 查询系统用户表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams,
	};

	systemStore.fetchGetSelectPageSystemLogList(params).then((res) => {
		tableData.value = res;
	});
};

// ref
const tableRef = ref();
// 打开表格加载
const openTableLoading = () => {
	tableRef.value.showLoading = true;
};

onMounted(() => {
	getTableList();
});

defineExpose({
	resetParams,
	fetchFilterData,
	getTableList,
	openTableLoading,
});
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

</style>