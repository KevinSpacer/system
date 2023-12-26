<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('模板名称')">
				<second-input-model
					:placeholder="$LANG_TEXT('模板名称')"
					v-model:firstValue="formParams.name"
					v-model:secondValue="formParams.nameLanguage"
				></second-input-model>
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
import { reactive, ref, getCurrentInstance, watch } from "vue";

const {proxy} = getCurrentInstance()

const emits = defineEmits(["submit", "reset"]);

// 默认数据
const defaultParams = () => ({
	name:"",
	nameLanguage:"",
  addStartTime:"",
  addEndTime:""
});
const formParams = reactive(defaultParams());

// 时间
const dateTime = ref([]);
watch(()=>dateTime.value,nVal=>{
  const [startTime='',endTime=''] = (nVal || []).map((item,index)=>{
    const stNum = new Date(item).getTime()
    return proxy.$timeSpToDate(stNum,index)
  }) 

  formParams.addStartTime = startTime
  formParams.addEndTime = endTime
  // console.log(formParams)
});

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