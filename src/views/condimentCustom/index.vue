<template>
	<div class="manage-box">
		<div class="condiment-box container">
			<div class="title">
				<span>{{$LANG_TEXT('自定义调味品')}}</span>

				<el-button @click="openDialog('condiment')">{{$LANG_TEXT('添加')}}</el-button>
			</div>
			<sortable-box domId="condimentBox" @changeList="condimentSortResult">
				<view id="condimentBox" class="condiment sort-box ml-scrollbar">
					<!-- data-id数据将会在排序改变后在事件changeList返回 -->
					<view
						class="sort-item"
						v-for="(item, i) of condimentData"
						:key="'condiment' + i"
						:data-id="item.id"
					>
						<span>{{
							publicsStore.isSecondLanguage ? item.nameLanguage : item.name
						}}</span>
						<el-icon
							@click="deleteCondiment(item)"
							size="15px"
							class="item-close"
							><Close
						/></el-icon>
					</view>
				</view>
			</sortable-box>
		</div>

		<div class="price-box container">
			<div class="title">
				<span>{{$LANG_TEXT('自定义价格')}}</span>

				<el-button @click="openDialog('price')">{{$LANG_TEXT('添加')}}</el-button>
			</div>
			<sortable-box domId="priceBox" @changeList="priceSortResult">
				<view id="priceBox" class="priceBox sort-box ml-scrollbar">
					<!-- data-id数据将会在排序改变后在事件changeList返回 -->
					<view
						class="sort-item"
						v-for="(item, i) of priceData"
						:key="'price' + i"
						:data-id="item.id"
					>
						<span>${{ item.price }}</span>
						<el-icon @click="deletePrice(item)" size="15px" class="item-close"
							><Close
						/></el-icon>
					</view>
				</view>
			</sortable-box>
		</div>
	</div>

	<!-- 弹窗 -->
	<ml-dialog
		ref="formDialogRef"
		class="formDialog"
		width="500px"
		:title="
			$LANG_TEXT(addType == 'condiment' ? '添加自定义调味品' : '添加价格')
		"
		@confirm="dialogConfirm"
	>
		<template #content>
			<ml-form
				ref="formRef"
				:model="formData"
				:rules="formRules"
				:showBtn="false"
			>
				<template #form>
					<el-form-item
						:label="`${$LANG_TEXT('自定义调味品')}：`"
						prop="name"
						v-if="addType == 'condiment'"
					>
						<second-input
							:placeholder="$LANG_TEXT('自定义调味品')"
							v-model:firstValue="formData.name"
							v-model:secondValue="formData.nameLanguage"
						></second-input>
					</el-form-item>
					<el-form-item
						:label="`${$LANG_TEXT('自定义价格')}：`"
						prop="price"
						v-else
					>
						<el-input
							:placeholder="$LANG_TEXT('自定义价格')"
							v-model="formData.price"
							type="number"
						></el-input>
					</el-form-item>
				</template>
			</ml-form>
		</template>
	</ml-dialog>
</template>

<script setup>
import {
	ref,
	nextTick,
	computed,
	getCurrentInstance,
	reactive,
	onMounted
} from 'vue'
import sortableBox from '@/components/sortable-renderjs/index.vue'

const { proxy } = getCurrentInstance()

const { publicsStore, condimentStore } = proxy.$usePiniaModule()

// ref
const formDialogRef = ref()
const formRef = ref()

// 调味品 表单
const condimentForm = reactive({
	name: '',
	nameLanguage: ''
})
// 价格 表单
const priceForm = reactive({
	price: ''
})

// 表单数据
const formData = computed(() => {
	const type = addType.value

	// 自定义调味品
	if (type == 'condiment') {
		return condimentForm
	} else {
		//价格
		return priceForm
	}
})

// 表单规则
const formRules = computed(() => {
	const type = addType.value

	// 自定义调味品
	if (type == 'condiment') {
		return {
			name: [
				{
					required: true,
					message: proxy.$LANG_TEXT('请输入自定义调味品'),
					trigger: 'change'
				},
				{
					validator: (rules, value, call) => {
						if (condimentForm.nameLanguage) {
							call()
						} else {
							call(new Error(proxy.$LANG_TEXT('请输入第二语言')))
						}
					},
					trigger: 'change'
				}
			]
		}
	} else {
		//价格
		return {
			price: [
				{
					required: true,
					message: proxy.$LANG_TEXT('请输入自定义价格'),
					trigger: 'change'
				}
			]
		}
	}
})

// 调用接口
const useApi = computed(() => {
	const type = addType.value
	const condiment = {
		addName: 'fetchCustomSpicesAdd'
	}

	const price = {
		addName: 'fetchCustomPriceAdd'
	}

	const res = {
		condiment,
		price
	}

	return res[type]
})

// 添加选中的值
const addType = ref('condiment')

// 打开弹窗
const openDialog = (type) => {
	formDialogRef.value.openDialog()
	addType.value = type

	nextTick(() => {
		formRef.value.resetFields()

		for (let i in formData.value) {
			formData.value[i] = ''
		}
	})
}

// 确认添加
const dialogConfirm = async (call) => {
	const type = addType.value
	const testRes = await proxy.$testForm(call, formRef.value)

	if (!testRes) {
		return
	}

	try {
		const res = await condimentStore[useApi.value.addName](formData.value)
		proxy.$message({
			type: 'success',
			message: proxy.$LANG_TEXT('添加成功')
		})
		formDialogRef.value.closeDialog()

		if (type == 'condiment') {
			getCondimentList()
		} else {
			getPriceList()
		}
	} catch (error) {
		call()
	}
}

// 调味品自定义数据
const condimentData = ref([])
// 排序后的结构
const condimentSortResult = (res) => {
	console.log(res)
	spicesSortApi(res.map(item=>Number(item)))
}
// 删除自定义调味品
const deleteCondiment = async (res) => {
	try {
		await condimentStore.fetchDeleteCustomSpices(res.id)
		proxy.$message({
			type: 'success',
			message: proxy.$LANG_TEXT('删除成功')
		})
		getCondimentList()
	} catch (error) {}
}

// 调味品自定义数据
const priceData = ref([])
// 排序后的结构
const priceSortResult = (res) => {
	console.log(res)
	spicesPriceSortApi(res.map(item=>Number(item)))
}
// 删除自定义价格
const deletePrice = async (res) => {
	try {
		await condimentStore.fetchDeleteCustomPrice(res.id)
		proxy.$message({
			type: 'success',
			message: proxy.$LANG_TEXT('删除成功')
		})
		getPriceList()
	} catch (error) {}
}

// 查询自定义调味品列表
const getCondimentList = async () => {
	const res = await condimentStore.fetchGetCustomSpicesList()
	const result = res.result
	condimentData.value = result
}
// 查询自定义价格列表
const getPriceList = async () => {
	const res = await condimentStore.fetchGetCustomPriceList()
	const result = res.result
	priceData.value = result
}

// 调用设置自定义价格排序Api
const spicesPriceSortApi = (ids) => {
	condimentStore.fetchSettingCustomPriceSort(ids)
}
// 调用设置自定义调味品排序Api
const spicesSortApi = (ids) => {
	condimentStore.fetchSettingCustomSpicesSort(ids)
}

onMounted(() => {
	getCondimentList()
	getPriceList()
})
</script>


<style lang="scss" scoped>
.manage-box {
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	border: 1px solid #9e9e9e38;
	border-radius: 10px;
	box-sizing: border-box;

	.container {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		overflow: hidden;

		&:nth-child(1) {
			border-right: 1px solid #eaeaea;
		}

		.title {
			padding: 10px;
			border-bottom: 1px solid #eaeaea;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-between;
			align-items: center;
		}

		.sort-box {
			padding: 10px;
			max-height: calc(100% - 52px);
			overflow-y: auto;
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;

			.sort-item {
				padding: 5px 10px;
				font-size: 13px;
				text-align: center;
				border-radius: 5px;
				background-color: #f1f3f6;
				cursor: pointer;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				height: 20px;
				margin-right: 10px;
				margin-bottom: 10px;

				.item-close {
					margin-left: 4px;
				}
			}
		}
	}
}
</style>