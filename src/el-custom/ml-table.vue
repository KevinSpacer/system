<!-- 标准表格 -->
<template>
	<div class="table-container">
		<el-table
			ref="tableRef"
			@select-All="selectHand"
			@select="selectHand"
			tooltip-effect="light"
			v-loading="showLoading"
			:data="listData"
			:height="tableConfig.height"
			:empty-text="$LANG_TEXT(tableConfig.emptyText)"
			:default-sort="tableConfig.defaultSort"
			style="width: 100%"
		>
			<el-table-column
				v-for="(item, index) in templateDataList"
				:key="'template' + index"
				:prop="item.prop"
				:label="$LANG_TEXT(item.label)"
				:width="item.width"
				:min-width="item.minWidth"
				:type="item.type"
				:index="item.index"
				:fixed="item.fixed"
				:sortable="item.sortable"
				:resizable="item.resizable"
				:formatter="item.formatter"
				:show-overflow-tooltip="true"
				:align="item.align || 'center'"
			>
				<!--( 是否显示模板|是否开启表格判空)&&特定模板 -->
				<template
					v-if="
						(item.showTemplate || tableConfig.openEmptyColumn) && !item.type
					"
					#default="{ row }"
				>
					<div>
						<!-- 自定义模板 -->
						<slot v-if="item.showTemplate" :name="item.prop" :row="row"></slot>

						<!-- 是否统一判空显示 -->
						<p class="cell-p oneLineOver" v-else>
							<span v-if="tableConfig.emptyColumn.includes(row[item.prop])">
								{{ tableConfig.emptyResult }}
							</span>
							<span v-else>
								{{
									publicsStore.isSecondLanguage
										? row[item.propSecond] || row[item.prop]
										: row[item.prop]
								}}
							</span>
						</p>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<ml-page
			v-if="showPage"
			:pageConfig="pageConfig"
			:pageParams="pageParams"
		></ml-page>
	</div>
</template>

<script setup>
import {
	toRefs,
	watch,
	onMounted,
	ref,
	reactive,
	getCurrentInstance,
	nextTick
} from 'vue'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['update:pageParams', 'selectHand'])
const publicsStore = proxy.$usePiniaModule('publicsStore')

// ref
const tableRef = ref()

const props = defineProps({
	showPage: {
		type: Boolean,
		default: true
	},
	// 列表请求响应值
	tableData: {
		type: Object,
		default: () => ({})
	},
	filterParams: {
		type: Object,
		default: () => ({})
	},
	tableConfig: {
		type: Object,
		default: () => ({
			emptyText: '暂无数据',
			height: '462px',
			defaultSort: {},
			// 打开表格判空
			openEmptyColumn: true,
			// 看空条件
			emptyColumn: [null, '', undefined],
			// 判空显示结果
			emptyResult: '-'
		})
	},
	pageParams: {
		type: Object,
		default: () => ({})
	},
	// 模板数据
	templateData: {
		type: Array,
		default: () => []
	}
})

const { tableConfig, tableData, pageParams } = toRefs(props)

// 模板数据
const templateDataList = ref([])

// watch(
// 	() => publicsStore.languageData,
// 	(nVal) => {
// 		nextTick(() => {
// 			templateDataList.value.map((item) => {
// 				item.label = proxy.$LANG_TEXT(item.label)
// 				return item
// 			})
// 			// console.log('watch')
// 			// console.log(nVal)
// 			// console.log(templateDataList.value)
// 		})
// 	}
// )

// 刷新表格
const refreshTable = () => {
	if (tableRef.value) {
		tableRef.value.showHeader = false
		nextTick(() => {
			tableRef.value.showHeader = true
		})
	}
}

const showLoading = ref(true)
watch(
	() => showLoading.value,
	(nVal) => {
		if (nVal) {
			clear15sTime()
			tableConfig.value.emptyText == '加载中...'
		} else {
			tableConfig.value.emptyText == '暂无数据'
		}
	}
)

const listData = ref([])

const pageConfig = reactive({
	total: 0
})

// 延迟动画，赋值数据
watch(
	() => props.tableData,
	(opt) => {
		// console.log(opt)
		let timeId = setTimeout(() => {
			showLoading.value = false
			listData.value = (opt.result || []).filter((item) => item)
			pageConfig.total = opt.total

			clearTimeout(timeId)
			timeId = null
		}, 200)
	}
)

watch(pageParams.value, (nVal) => {
	showLoading.value = true
	emits('update:pageParams', nVal)
})

// 固定15s后加载动画停止
const timeId = ref()

const clear15sTime = () => {
	timeId.value = setTimeout(() => {
		showLoading.value = false
		clearTimeout(timeId.value)
		timeId.value = null
	}, 15000)
}

// 监听表格选择
const selectHand = (res, row = {}) => {
	emits('selectHand', res, row)
}

// 用于多选表格，清空用户的选择
const clearSelection = () => {
	tableRef.value.clearSelection()
}

// 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否
/**
 * @params row
 * @params selected
 */
const toggleRowSelection = (row, selected) => {
	// console.log(row, selected)
	tableRef.value.toggleRowSelection(row, selected)
}

const getSelectionRows = () => {
	tableRef.value.getSelectionRows()
}

onMounted(() => {
	clear15sTime()

	templateDataList.value = props.templateData
})

defineExpose({
	showLoading,
	clearSelection,
	toggleRowSelection,
	getSelectionRows
})
</script>

<style lang="scss" scoped>
.table-container {
	.tool-box {
		margin-bottom: 20px;
	}
}
</style>

<style lang="scss">
.table-container {
	.el-scrollbar__view {
		display: block !important;
	}
	.cell-p {
		width: 100%;
	}
}
</style>