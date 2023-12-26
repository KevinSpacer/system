<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('订单编号')">
				<el-input :placeholder="$LANG_TEXT('订单编号')"></el-input>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('支付时间')">
				<el-date-picker
					v-model="dateTime"
					type="daterange"
					:start-placeholder="$LANG_TEXT('开始时间')"
					:end-placeholder="$LANG_TEXT('结束时间')"
				/>
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('支付方式')">
				<layz-select
					v-if="refreshSelect"
					ref="payTypeRef"
					:filterable="false"
					:listFun="restaurantStore.fetchGetPaymentMethodPageList"
					:placeholder="$LANG_TEXT('支付方式')"
					:selectProps="{ labelKey: 'name', valueKey: 'id' }"
					:selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
					v-model="formParams.classifyId"
					v-model:updateLabel="formParams.name"
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
import {
	reactive,
	ref,
	getCurrentInstance,
	computed,
	onMounted,
	watch,
	nextTick
} from 'vue'

const { proxy } = getCurrentInstance()

const { restaurantStore, publicsStore } = proxy.$usePiniaModule()
const emits = defineEmits(['submit', 'reset'])

// 默认数据
const defaultParams = () => ({
	orderId: '',
	classifyId:'',
	name: '',
	paymentMethodName: '',
	paymentMethodNameLanguage: '',
	payStartTime: '',
	payEndTime: ''
})
const formParams = reactive(defaultParams())
watch(
	() => formParams.name,
	(nVal) => {
		if (publicsStore.isSecondLanguage) {
			formParams.paymentMethodNameLanguage = nVal
		} else {
			formParams.paymentMethodName = nVal
		}
	}
)

// 时间
const dateTime = ref([])
watch(
	() => dateTime.value,
	(nVal) => {
		const [startTime = '', endTime = ''] = (nVal || []).map((item, index) => {
			const stNum = new Date(item).getTime()
			return proxy.$timeSpToDate(stNum, index)
		})

		formParams.payStartTime = startTime
		formParams.payEndTime = endTime
		// console.log(formParams)
	}
)

const submit = () => {
	emits('submit', formParams)
}

const refreshSelect = ref(true)

const reset = () => {
	const defaultData = defaultParams()
	for (let i in defaultData) {
		formParams[i] = defaultData[i]
	}
	dateTime.value = []

	refreshSelect.value = false
	nextTick(() => {
		refreshSelect.value = true
		nextTick(()=>{
			payTypeRef.value.getSelectList('info')
		})
	})

	emits('reset', defaultParams())
}

// ref
const payTypeRef = ref()

onMounted(() => {
	setTimeout(() => {
		payTypeRef.value.getSelectList('info')
	})
})
</script>