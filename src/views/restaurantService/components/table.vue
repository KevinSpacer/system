<template>
	<div>
		<!-- 表格区域 -->
		<div class="table-content">
			<!-- 按钮 -->
			<div class="tool-btn">
				<el-button type="primary" @click="openFormPopup()">{{
					$LANG_TEXT("添加服务费")
				}}</el-button>
			</div>

			<!-- 表格 -->
			<ml-table
				ref="tableRef"
				:tableData="tableData"
				:templateData="templateData"
				:pageParams="pageParams"
			>
				<template #value="{ row }">
					{{row.type == 'QUOTA'?`$${row.value}`:`${row.value}%`}}
				</template>
				<template #type="{ row }">
					{{ $LANG_TEXT(getDiscountText[row.type]) }}
				</template>
				<template #btnActive="{ row }">
					<el-button size="small" @click="openFormPopup(row)">{{
						$LANG_TEXT("编辑")
					}}</el-button>
					<el-popconfirm
						@confirm="confirmDelete(row)"
						:title="`${$LANG_TEXT('确认要删除该服务费吗')}?`"
					>
						<template #reference>
							<el-button type="danger" size="small">{{
								$LANG_TEXT("删除")
							}}</el-button>
						</template>
					</el-popconfirm>
				</template>
			</ml-table>
		</div>
	</div>

	<!-- 弹窗 -->
	<ml-dialog
		ref="formDialogRef"
		class="formDialog"
		:title="$LANG_TEXT(choseItem ? '修改服务费' : '添加服务费')"
		@confirm="dialogConfirm"
	>
		<template #content>
			<ml-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				:showBtn="false"
			>
				<template #form>
					<el-form-item :label="`${$LANG_TEXT('名称')}：`" prop="name">
						<second-input
							:placeholder="$LANG_TEXT('名称')"
							v-model:firstValue="formData.name"
							v-model:secondValue="formData.nameLanguage"
						></second-input>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('服务费类型')}：`">
						<el-radio-group v-model="formData.type">
							<el-radio :label="item.value" v-for="item in discountType" :key="item.label">{{$LANG_TEXT(item.label)}}</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('值')}：`" prop="value">
						<el-input
							v-model.number="formData.value"
							type="number"
							:placeholder="`${$LANG_TEXT('请输入值')}`"
						>
							<template #suffix>
								<div v-if="formData.type == 'PERCENT'">%</div>
							</template>
						</el-input>
					</el-form-item>

					<el-form-item :label="`${$LANG_TEXT('是否显示')}：`">
						<ml-switch
							v-model:switch="formData.status"
							activeValue="SHOW"
							inactiveValue="HIDE"
							activeText="显示"
							inactiveText="隐藏"
						></ml-switch>
					</el-form-item>
				</template>
			</ml-form>
		</template>
	</ml-dialog>
</template>

<script setup>
import {
	ref,
	reactive,
	watch,
	onMounted,
	computed,
	getCurrentInstance,
	nextTick,
} from "vue";

import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
// fetchGetSystemMenuList
const restaurantStore = proxy.$usePiniaModule("restaurantStore");

// 表格数据
const tableData = ref({});

const pageParams = reactive({
	pageNum: 1,
	pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({});

// 重置
const resetParams = (params) => {
	fetchFilterData(params);
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
		type: 'index',
		label: ("编号"),
		width: "100",
	},
	{
		prop: "name",
		propSecond: "nameLanguage",
		label: ("名称"),
		minWidth: "150",
	},
	{
		prop: "type",
		label: ("类型"),
		showTemplate: true,
		minWidth: "100",
	},
	{
		prop: "value",
		label: ("值"),
		showTemplate: true,
		minWidth: "100",
	},
	{
		prop: "creationTime",
		label: ("添加时间"),
		minWidth: "170",
	},
	{
		prop: "btnActive",
		label: ("操作"),
		showTemplate: true,
		minWidth: "250",
	},
];

// 查询表格列表数据
const getTableList = () => {
	const params = {
		...pageParams,
		...filterParams,
	};

	restaurantStore.fetchGetServiceChargePageList(params).then((res) => {
		tableData.value = res;
	});
};

// 确认删除
const confirmDelete = (item) => {
	restaurantStore.fetchDeleteServiceCharge(item.id).then((res) => {
		ElMessage({
			type: "success",
			message: proxy.$LANG_TEXT("删除成功"),
		});
		getTableList();
	});
};

// 获取服务费类型
const getDiscountText = {
	QUOTA:"定额",
	PERCENT:"百分比"
}

// ref
const formDialogRef = ref();
const formRef = ref();

// 默认数据
const formDefaultData = () => ({
	id: "",
	name: "",
	type:"QUOTA",
	nameLanguage: "",
	status: "SHOW",
	value: "",
});
// 表单数据
const formData = reactive(formDefaultData());
// 表单数据 校验
const formRules = reactive({
	name: [
		{
			message: proxy.$LANG_TEXT("请输入服务费名称"),
			required: true,
			trigger: "change",
		},
		{
			validator: (rules, value, call) => {
				if (formData.nameLanguage) {
					call();
				} else {
					call(new Error(proxy.$LANG_TEXT("请输入第二语言")));
				}
			},
			trigger: "change",
		},
	],
	value: [
		{
			message: proxy.$LANG_TEXT("请输入服务费值"),
			required: true,
			trigger: "change",
		},
	],
});

// 服务费值类型
const discountType = [
	{
		label: "定额",
		value: "QUOTA",
	},
	{
		label: "百分比",
		value: "PERCENT",
	},
];

const choseItem = ref();

// 打开弹窗
const openFormPopup = (item = "") => {
	formDialogRef.value.openDialog();

	nextTick(async () => {
		// 重置
		formRef.value.resetFields();
		choseItem.value = item;

		if (item) {
			for (let i in formData) {
				formData[i] = item[i];
			}
		} else {
			for (let i in formData) {
				formData[i] = formDefaultData()[i];
			}
		}
	});
};

// 弹窗确认
const dialogConfirm = async (call) => {
	const detail = choseItem.value;
	const testResult = await proxy.$testForm(call, formRef.value);
	// console.log(testResult);
	if (!testResult) {
		return;
	}

	const api = detail ? "fetchServiceChargeEdit" : "fetchServiceChargeAdd";
	const tips = detail ? "修改" : "添加";

	// console.log(formData);
	restaurantStore[api](formData)
		.then((res) => {
			proxy.$message({
				type: "success",
				message: proxy.$LANG_TEXT(tips + "成功"),
			});
			getTableList();
			formDialogRef.value.closeDialog();
			call();
		})
		.catch(() => {
			call();
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

.formDialog {
	.el-tree {
		width: 100%;
		.el-tree__empty-block {
			width: 100%;
		}
	}
}
</style>