<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('菜品名称')">
				<second-input-model
					:placeholder="$LANG_TEXT('菜品名称')"
					v-model:firstValue="formParams.name"
					v-model:secondValue="formParams.nameLanguage"
				></second-input-model>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('分类')">
				<layz-select
					ref="classifyRef"
					:listFun="productStore.fetchGetAllClassifyPageList"
					:placeholder="$LANG_TEXT('分类')"
					:selectProps="{ labelKey: 'name', valueKey: 'id' }"
					:selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
					v-model="formParams.classifyId"
				></layz-select>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('组合')">
				<layz-select
					ref="classifyCombineRef"
					class="inline-block"
					popperClass="form-select-popper2"
					:listFun="productStore.fetchGetAllProductClassifyPageList"
					:placeholder="$LANG_TEXT('组合')"
					:selectProps="{ labelKey: 'name', valueKey: 'id' }"
					:selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
					:lastingParams="
						() => ({
							
						})
					"
					v-model="formParams.classifyCombineId"
				></layz-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submit">
					{{ $LANG_TEXT('搜索') }}
				</el-button>
				<el-button @click="reset">
					{{ $LANG_TEXT('重置') }}
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, watch,onMounted } from 'vue'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['submit', 'reset'])

const productStore = proxy.$usePiniaModule('productStore')

// 默认数据
const defaultParams = () => ({
	name: '',
	nameLanguage: '',
	classifyId: '',
	classifyCombineId: ''
})
const formParams = reactive(defaultParams())

watch(()=>formParams.classifyId,nVal=>{
	classifyCombineRef.value.params.classifyId = nVal
	classifyCombineRef.value.getSelectList('info')
})

const submit = () => {
	emits('submit', formParams)
}

const reset = () => {
	const defaultData = defaultParams()
	for (let i in defaultData) {
		formParams[i] = defaultData[i]
	}
	layzySelectInit()
	emits('reset', defaultParams())
}

// ref
const classifyRef = ref()
const classifyCombineRef = ref()

// lazy 下拉初始
const layzySelectInit = ()=>{

	classifyCombineRef.value.getSelectList('info')
	classifyRef.value.getSelectList('info')
}

onMounted(() => {
	layzySelectInit()
})


</script>