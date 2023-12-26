<!-- 第二语言与主语言展示 -->
<template>
	<div class="second-show oneLineOver">
		<span v-if="showSecond">{{ secondText }}</span>
		<span v-else>{{ firstText }}</span>
	</div>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
const publicsStore = proxy.$usePiniaModule('publicsStore')

const showSecond = computed(()=>publicsStore.isSecondLanguage)

const props = defineProps({
	// 主体
	firstText: {
		type: String,
		default: ''
	},
	// 第二语言动态值
	secondText: {
		type: String,
		default: ''
	}
})
</script>
