<!-- 第二语言输入框 单输入框+区别多参数 -->
<template>
	<div class="second-input">
		<el-input
			:placeholder="$LANG_TEXT(placeholder)"
			v-model="second"
			v-if="showSecond"
		></el-input>
		<el-input v-else :placeholder="$LANG_TEXT(placeholder)" v-model="first"></el-input>
	</div>
</template>

<script setup>
import { watch, ref, computed, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const publicsStore = proxy.$usePiniaModule('publicsStore')

// 显示第二语言
const showSecond = computed(() => publicsStore.isSecondLanguage)

const emits = defineEmits(['update:firstValue', 'update:secondValue'])

const props = defineProps({
	placeholder: {
		type: String,
		default: ''
	},
	// 主体
	firstValue: {
		type: String,
		default: ''
	},
	// 第二语言动态值
	secondValue: {
		type: String,
		default: ''
	}
})

const first = ref(props.firstValue)
watch(
	() => props.firstValue,
	(nVal) => {
		first.value = nVal
	}
)
watch(
	() => first.value,
	(nVal) => {
		emits('update:firstValue', nVal)
	}
)

const second = ref(props.secondValue)
watch(
	() => props.secondValue,
	(nVal) => {
		second.value = nVal
	}
)
watch(
	() => second.value,
	(nVal) => {
		emits('update:secondValue', nVal)
	}
)
</script>

<style lang="scss" scoped>
</style>