<template>
	<div class="manage-box">
		<ml-form
			ref="formRef"
			confirmText="保存"
			:showCancel="false"
			@confirm="submit"
			label-width="auto"
		>
			<template #form>
				<el-form-item :label="`${$LANG_TEXT('餐厅名称')}：`">
					<second-input
						:placeholder="$LANG_TEXT('餐厅名称')"
						v-model:firstValue="formData.name"
						v-model:secondValue="formData.nameLanguage"
					></second-input>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('logo图')}：`" class="inline-block">
					<upload-image folder="CATERING" v-model:fileList="logoFile"></upload-image>
					<p class="line-tips">{{ $LANG_TEXT('建议尺寸：750×680像素') }}</p>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('餐厅地址')}：`">
					<second-input
						:placeholder="$LANG_TEXT('餐厅地址')"
						v-model:firstValue="formData.address"
						v-model:secondValue="formData.addressLanguage"
					></second-input>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('联系方式')}：`">
					<second-input
						:placeholder="$LANG_TEXT('联系方式')"
						v-model:firstValue="formData.contactWay"
						v-model:secondValue="formData.contactWayLanguage"
					></second-input>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('传真')}：`">
					<second-input
						:placeholder="$LANG_TEXT('传真')"
						v-model:firstValue="formData.faxAddress"
						v-model:secondValue="formData.faxAddressLanguage"
					></second-input>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('营业时间')}：`">
					<div class="business-hours-box">
						<div
							class="date-line"
							v-for="(item, index) in 5"
							:key="'date' + index"
						>
							<el-time-picker
								v-model="businessHoursDate[index]"
								is-range
								format="HH:mm"
								range-separator="-"
								:start-placeholder="$LANG_TEXT('开始时间')"
								:end-placeholder="$LANG_TEXT('结束时间')"
							/>
						</div>
					</div>
				</el-form-item>
			</template>
		</ml-form>
	</div>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import uploadImage from '@/components/upload-image.vue'

const { proxy } = getCurrentInstance()

const { restaurantStore, publicsStore } = proxy.$usePiniaModule()

// logo
const logoFile = ref([])
watch(
	() => logoFile.value,
	(nVal) => {
		formData.logo = nVal.map((item) => item.relUrl).join(',')
	}
)

// ref
const formRef = ref()
// 表单
const formData = reactive({
	name: '',
	nameLanguage: '',
	logo: '',
	address: '',
	addressLanguage: '',
	contactWay: '',
	contactWayLanguage: '',
	faxAddress: '',
	faxAddressLanguage: '',
	businessHours: ''
})

// 营业时间数据
const businessHoursDate = reactive({
	...new Array(5).fill([])
})
watch(businessHoursDate, (nVal) => {
	formData.businessHours = JSON.stringify(
		Object.keys(nVal).map((item) => {
			const res = nVal[item] || []
			return res.map((d) => {
				const st = new Date(d).getTime()
				const timeText = proxy.$timeStampToTime(st, { format: 'HH:mm' })
				return {
					value: d,
					label: timeText
				}
			})
		})
	)
})

// 查询当前餐厅信息
const getCurrDiningRoomDetail = async () => {
	try {
		const res = await restaurantStore.fetchGetDiningRoomSelectInfo()
		const result = res.result

		publicsStore.roomDetail = result

		for (let i in result) {
			const obj = result[i]
			formData[i] = obj
		}

		logoFile.value = [
			{
				relUrl: result.logo,
				url: proxy.$previewFileUrl + result.logo
			}
		]

		// 营业时间
		const businessHours = result.businessHours
		const date = businessHours || '{}'
		const dateRes = JSON.parse(date)
		for (let i in dateRes) {
			businessHoursDate[i] = dateRes[i].map((item) => item.value)
		}
		// console.log(businessHoursDate);
		// console.log(formData)
	} catch (error) {
		console.log(error)
	}
}

// 提交
const submit = async (call) => {
	restaurantStore
		.fetchGetDiningRoomSetting(formData)
		.then((res) => {
			proxy.$message({
				type: 'success',
				message: proxy.$LANG_TEXT('保存成功')
			})
			call()
			getCurrDiningRoomDetail()
		})
		.catch(() => {
			call()
		})
	console.log(formData)
}

onMounted(() => {
	getCurrDiningRoomDetail()
})
</script>


<style lang="scss" scoped>
.manage-box {
	.custom-form {
		.date-line {
			margin-bottom: 10px;
		}

		.business-hours-box {
			width: 405px !important;
			.el-range-editor.el-input__wrapper {
				box-sizing: border-box;
			}
		}
	}
}
</style>