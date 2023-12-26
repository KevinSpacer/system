<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('数据库名称')">
				<el-input
					:placeholder="$LANG_TEXT('数据库名称')"
					v-model="formParams.databaseName"
				></el-input>
			</el-form-item>
			<el-form-item :label="$LANG_TEXT('备份名称')">
				<el-input
					:placeholder="$LANG_TEXT('备份名称')"
					v-model="formParams.backupName"
				></el-input>
			</el-form-item>
			<el-form-item :label="$LANG_TEXT('创建时间')">
				<el-date-picker
					v-model="dateTime"
					type="daterange"
					:start-placeholder="$LANG_TEXT('开始时间')"
					:end-placeholder="$LANG_TEXT('结束时间')"
				/>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submit">
					{{ $LANG_TEXT("搜索") }}
				</el-button>
				<el-button @click="reset">
					{{ $LANG_TEXT("重置") }}
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { reactive, ref, watch, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["submit", "reset"]);

// 默认数据
const defaultParams = () => ({
	databaseName: "",
	backupName:"",
	creationStartTime: "",
	creationEndTime: "",
});
const formParams = reactive(defaultParams());

// 时间
const dateTime = ref([]);
watch(
	() => dateTime.value,
	(nVal) => {
		const [startTime = "", endTime = ""] = (nVal || []).map((item, index) => {
			const stNum = new Date(item).getTime();
			return proxy.$timeSpToDate(stNum, index);
		});

		formParams.creationStartTime = startTime;
		formParams.creationEndTime = endTime;
	}
);

const submit = () => {
	emits("submit", formParams);
};

const reset = () => {
	const defaultData = defaultParams();
	for (let i in defaultData) {
		formParams[i] = defaultData[i];
	}
	dateTime.value = []
	emits("reset", defaultParams());
};
</script>