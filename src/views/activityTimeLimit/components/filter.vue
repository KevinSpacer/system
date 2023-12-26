<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('活动名称')">
				<el-input
					:placeholder="$LANG_TEXT('活动名称')"
					v-model="formParams.title"
				></el-input>
			</el-form-item>

			<!-- <el-form-item :label="$LANG_TEXT('菜品分类')">
				<layz-select
					ref="classifyRef"
					:listFun="productStore.fetchGetAllClassifyPageList"
					:placeholder="$LANG_TEXT('菜品分类')"
					:selectProps="{ labelKey: 'name', valueKey: 'id' }"
					:selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
					v-model="formParams.classifyId"
				></layz-select>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('菜品组合')">
				<layz-select
					ref="classifyCombineRef"
					class="inline-block"
					popperClass="form-select-popper2"
					:listFun="productStore.fetchGetAllProductClassifyPageList"
					:placeholder="$LANG_TEXT('菜品组合')"
					:selectProps="{ labelKey: 'name', valueKey: 'id' }"
					:selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
					:lastingParams="
						() => ({
							classifyId: formParams.classifyId
						})
					"
					v-model="formParams.classifyCombineId"
				></layz-select>
			</el-form-item> -->

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
import { reactive, ref, getCurrentInstance, watch, onMounted } from 'vue'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['submit', 'reset'])

const productStore = proxy.$usePiniaModule('productStore')

// 默认数据
const defaultParams = () => ({
	title: '',
	classifyId: '',
	classifyCombineId: ''
})
const formParams = reactive(defaultParams())

watch(
	() => formParams.classifyId,
	(nVal) => {
		classifyCombineRef.value.getSelectList('info')
	}
)

const submit = () => {
	emits('submit', formParams)
}

const reset = () => {
	const defaultData = defaultParams()
	for (let i in defaultData) {
		formParams[i] = defaultData[i]
	}
	emits('reset', defaultParams())
}

// ref
const classifyRef = ref()
const classifyCombineRef = ref()

onMounted(() => {
	// classifyRef.value.getSelectList('info')
})
</script>