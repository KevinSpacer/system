<template>
	<!-- 处理静态大数据下拉列表 -->
	<div class="select-box">
		<el-select-v2
			:popper-class="popperClass"
			v-model="value"
			:options="selectOption"
			:placeholder="$LANG_TEXT(placeholder)"
			:filterable="filterable"
			:clearable="clearable"
			:disabled="disabled"
		/>
	</div>
</template>

<script setup>
import {
	ref,
	computed,
	watch,
	getCurrentInstance
} from 'vue'
const { proxy } = getCurrentInstance()
const emits = defineEmits(['scrolltolower', 'update:modelValue'])
const publicsStore = proxy.$usePiniaModule('publicsStore')

const props = defineProps({
	modelValue: {
		type: [String, Number],
		default: ''
	},
	disabled:{
		type: Boolean,
		default: false
	},
	options: {
		type: Array,
		default: () => []
	},
	placeholder: {
		type: String,
		default: '请选择'
	},
	selectProps: {
		type: Object,
		default: () => ({
			label: 'label',
			value: 'value'
		})
	},
	// 第二语言显示配置
	selectPropsSecond: {
		type: Object,
		default: () => ({
			label: 'label',
			value: 'value'
		})
	},
	filterable: {
		type: Boolean,
		default: true
	},
	// 唯一class
	popperClass: {
		type: String,
		default: 'select-popper'
	},
	clearable: {
		type: Boolean,
		default: true
	}
})

// 选择器值
let value = ref(String(props.modelValue))

// options
const selectOption = computed(() => {
	let selectProps = {}
	// 第二语言
	if(publicsStore.isSecondLanguage){
		selectProps = props.selectPropsSecond
	}else{
		selectProps = props.selectProps
	}

	return props.options.map((item) => {
		return {
			label: item[selectProps.label],
			value: String(item[selectProps.value])
		}
	})
})

// 赋值
watch(
	() => props.modelValue,
	(nVal) => {
		value.value = nVal
	}
)

// 回显
watch(
	() => value.value,
	(nVal) => {
		emits('update:modelValue', nVal)
	}
)
</script>

<style lang="scss" scoped>
.select-box {
}
</style>