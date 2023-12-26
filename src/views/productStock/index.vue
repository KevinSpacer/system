<template>
	<div class="manage-box">
		<div class="warning-box" v-if="lowerLimitNames">
			<div class="label">{{ $LANG_TEXT('库存预警') }}：</div>
			<!-- 库存异常滚动栏 -->
			<div class="sotck-bar">
				<div
					class="box"
					:class="{ isRoll: rollConfig.show }"
					:style="{ transform: `translateX(${rollConfig.translateX}px)` }"
				>
					{{ lowerLimitNames }}
				</div>
			</div>
		</div>

		<filter-box @submit="filterCall" @reset="resetCall"></filter-box>

		<table-box ref="tableBoxRef"></table-box>
	</div>
</template>

<script setup>
import {
	ref,
	onMounted,
	nextTick,
	reactive,
	computed,
	getCurrentInstance
} from 'vue'
import filterBox from './components/filter.vue'
import tableBox from './components/table.vue'

const { proxy } = getCurrentInstance()
const productStore = proxy.$usePiniaModule('productStore')

const tableBoxRef = ref()

// 搜索
const filterCall = (params) => {
	tableBoxRef.value.fetchFilterData(params)
	// 加载
	tableBoxRef.value.openTableLoading()
}

// 重置
const resetCall = (params) => {
	tableBoxRef.value.resetParams(params)
	// 加载
	tableBoxRef.value.openTableLoading()
}

// 数据
const lowerLimitData = ref([])
// 名称
const lowerLimitNames = computed(() =>
	lowerLimitData.value
		.map((item) =>
			proxy.$LANG_TEXT(item.name, { mode:'second',secondValue: item.nameLanguage })
		)
		.join('、')
)
// 获取低于库存下线数量商品列表
const getStockLowerLimitCountDishesList = async () => {
	try {
		const res = await productStore.fetchGetStockLowerLimitCountDishesList()
		const result = res.result
		lowerLimitData.value = result
		// console.log(result)
	} catch (error) {}
}

// 判断预警栏是否滚动
const rollConfig = reactive({
	show: false,
	translateX: '0%'
})

onMounted(async () => {
	await getStockLowerLimitCountDishesList()
	nextTick(() => {
		const boxWidth = document.getElementsByClassName('box')[0].clientWidth
		const sotckBarWidth =
			document.getElementsByClassName('sotck-bar')[0].clientWidth
		rollConfig.show = boxWidth > sotckBarWidth
		if (rollConfig.show) {
			rollConfig.translateX = sotckBarWidth
		}
	})
})
</script>


<style lang="scss" scoped>
.manage-box {
	.warning-box {
		display: grid;
		flex-direction: row;
		flex-wrap: nowrap;
		grid-template-columns: auto 1fr;
		padding-bottom: 10px;
		align-items: center;
		.label {
			font-size: 14px;
		}
		.sotck-bar {
			overflow: hidden;
			border-radius: 8px;
			width: 100%;
			font-size: 14px;

			.box {
				white-space: nowrap;
				padding-right: 0;
				transform: translateX(0%);
				width: fit-content;
				color:red;

				&.isRoll {
					transform: translateX(100%);
					animation: gundong1 20s linear 0s infinite;
				}

				// .item {
				// 	width: fit-content;
				// 	display: inline-block;
				// 	margin-right: 10px;
				// }
			}

			@keyframes gundong1 {
				0% {
				}
				100% {
					transform: translateX(-100%);
				}
			}
		}
	}
}
</style>