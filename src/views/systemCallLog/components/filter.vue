<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('员工名称')">
				<el-input
					:placeholder="$LANG_TEXT('员工名称')"
					v-model="formParams.name"
				></el-input>
			</el-form-item>
			<el-form-item :label="$LANG_TEXT('联系方式')">
				<el-input
					:placeholder="$LANG_TEXT('联系方式')"
					v-model="formParams.contactWay"
				></el-input>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('打卡时间')">
				<el-date-picker
					v-model="dateTime"
					type="daterange"
					:start-placeholder="$LANG_TEXT('开始时间')"
					:end-placeholder="$LANG_TEXT('结束时间')"
				/>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('打卡类型')">
				<el-select :placeholder="$LANG_TEXT('打卡类型')" v-model="formParams.type">
					<el-option
						v-for="item in callOptions"
						:key="item.label"
						:value="item.value"
						:label="$LANG_TEXT(item.label)"
					>
						{{$LANG_TEXT(item.label) }}
					</el-option>
				</el-select>
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
import { reactive , ref ,watch ,getCurrentInstance} from "vue";
import { callTypeOpts } from "@/utils/options.js";

const {proxy} = getCurrentInstance()

const emits = defineEmits(["submit", "reset"]);

// 打卡类型
const callOptions = [{
  label: '全部',
  value: ''
},...callTypeOpts()]

// 时间
const dateTime = ref([]);
watch(
	() => dateTime.value,
	(nVal) => {
		const [startTime = "", endTime = ""] = (nVal || []).map((item, index) => {
			const stNum = new Date(item).getTime();
			return proxy.$timeSpToDate(stNum, index);
		});

		formParams.clockStartTime = startTime;
		formParams.clockEndTime = endTime;
		// console.log(formParams)
	}
);

// 默认数据
const defaultParams = () => ({
	name: "",
	contactWay: "",
	clockStartTime: "",
	clockEndTime: "",
	type:"",
	userType:""
});
const formParams = reactive(defaultParams());

const submit = () => {
	emits("submit", formParams);
};

const reset = () => {
	const defaultData = defaultParams();
	for (let i in defaultData) {
		formParams[i] = defaultData[i];
	}
	dateTime.value = [];
	emits("reset", defaultParams());
};
</script>