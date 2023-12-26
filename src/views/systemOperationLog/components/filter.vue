<template>
	<div class="filter-box">
		<el-form :inline="true">
			<el-form-item :label="$LANG_TEXT('操作人员')">
				<layz-select
					ref="layzSelectRef"
					:listFun="systemStore.fetchGetSelectPageUserList"
					:placeholder="$LANG_TEXT('操作人员')"
					:selectProps="{ labelKey: 'account', valueKey: 'account' }"
					v-model="formParams.userName"
				></layz-select>
				<!-- <el-select>
					<el-option value="">{{$LANG_TEXT('全部')}}</el-option>
				</el-select> -->
			</el-form-item>

			<el-form-item :label="$LANG_TEXT('操作日期')">
				<el-date-picker
					v-model="dateTime"
					type="daterange"
					:start-placeholder="$LANG_TEXT('开始时间')"
					:end-placeholder="$LANG_TEXT('结束时间')"
				/>
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
import { reactive, ref, watch, getCurrentInstance ,onMounted} from 'vue'
const { proxy } = getCurrentInstance()

const emits = defineEmits(['submit', 'reset'])

const systemStore = proxy.$usePiniaModule('systemStore')

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

// 默认数据
const defaultParams = () => ({
	userName: '',
	creationStartTime: '',
	creationEndTime: ''
})
const formParams = reactive(defaultParams())

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

// ref
const layzSelectRef = ref()
onMounted(() => {
	layzSelectRef.value.getSelectList('info')
})
</script>