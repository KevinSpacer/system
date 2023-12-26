<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('订单编号')">
				<el-input
					:placeholder="$LANG_TEXT('订单编号')"
					v-model="formParams.id"
				></el-input>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('下单时间')">
				<el-date-picker
					v-model="dateTime"
					type="daterange"
					:start-placeholder="$LANG_TEXT('开始时间')"
					:end-placeholder="$LANG_TEXT('结束时间')"
				/>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('订单状态')">
				<el-select v-model="formParams.status" :placeholder="$LANG_TEXT('请选择订单状态')">
					<el-option value="">
						{{ $LANG_TEXT('全部') }}
					</el-option>
					<el-option
						v-for="(item, index) in orderStatuss"
						:key="'item' + index"
						:value="item.value"
						:label="$LANG_TEXT(item.label)"
					>
						{{ $LANG_TEXT(item.label) }}
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('订单类型')">
				<el-select v-model="formParams.type" :placeholder="$LANG_TEXT('请选择订单类型')">
					<el-option value="">
						{{ $LANG_TEXT('全部') }}
					</el-option>
					<el-option
						v-for="(item, index) in orderTypes"
						:key="'item' + index"
						:value="item.value"
						:label="$LANG_TEXT(item.label)"
					>
						{{ $LANG_TEXT(item.label) }}
					</el-option>
				</el-select>
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
import { reactive, ref, getCurrentInstance, watch } from 'vue'
import { orderStatusOpts, orderTypeOpts } from '@/utils/options'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['submit', 'reset'])

// 订单类型
const orderTypes = orderTypeOpts()
// 订单状态
const orderStatuss = orderStatusOpts()

// 默认数据
const defaultParams = () => ({
	id:'',
	status:'',
	type:'',
	name: '',
	creationStartTime: '',
	creationEndTime: ''
})
const formParams = reactive(defaultParams())

// 时间
const dateTime = ref([])
watch(
	() => dateTime.value,
	(nVal) => {
		const [startTime = '', endTime = ''] = (nVal || []).map((item, index) => {
			const stNum = new Date(item).getTime()
			return proxy.$timeSpToDate(stNum, index)
		})

		formParams.creationStartTime = startTime
		formParams.creationEndTime = endTime
		// console.log(formParams)
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
	dateTime.value = []
	emits('reset', defaultParams())
}
</script>