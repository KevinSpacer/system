<template>
	<div class="manage-box">
		<ml-form
			ref="formRef"
			confirmText="保存"
			:showCancel="false"
			@confirm="submit"
			:rules="formRules"
			:model="formData"
		>
			<template #form>
				<!-- <el-form-item :label="`${$LANG_TEXT('金额显示')}：`">
					<el-radio-group v-model="formData.showMoney">
						<el-radio-button label="ORIGINAL_VALUE">{{
							$LANG_TEXT('原值')
						}}</el-radio-button>
						<el-radio-button label="ROUND_VALUE">{{
							$LANG_TEXT('四舍五入')
						}}</el-radio-button>
					</el-radio-group>
				</el-form-item> -->

				<el-form-item
					class="inline-block"
					:label="`${$LANG_TEXT('每天开始单号')}：`"
					prop="dayInitialOrder"
				>
					<el-input v-model.number="formData.dayInitialOrder">
						<template #prefix> # </template>
					</el-input>
					<p class="line-tips">
						{{ $LANG_TEXT('次日生效') }}
					</p>
				</el-form-item>

				<el-form-item
					class="inline-block"
					:label="`${$LANG_TEXT('外卖费用')}：`"
					prop="deliveryFee"
				>
					<el-input type="number" v-model.number="formData.deliveryFee">
						<template #suffix> $ </template>
					</el-input>
					<p class="line-tips">
						{{
							$LANG_TEXT(
								'在系统设置里的外卖费用是用餐费。在菜品里的是外卖时价格'
							)
						}}
					</p>
				</el-form-item>

				<el-form-item
					class="inline-block"
					:label="`${$LANG_TEXT('税率')}：`"
					prop="taxRate"
				>
					<el-input v-model.number="formData.taxRate" type="number">
						<template #suffix>%</template>
					</el-input>
				</el-form-item>

				<el-form-item
					:label="`${$LANG_TEXT('无操作自动退出时间')}：`"
					prop="autoExit"
				>
					<el-input v-model.number="formData.autoExit">
						<template #suffix> min </template>
					</el-input>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('开机直接进入页面')}：`">
					<el-radio-group v-model="formData.enterPage">
						<el-radio-button label="NORMAL">{{
							$LANG_TEXT('正常')
						}}</el-radio-button>
						<el-radio-button label="EAT_IN">{{
							$LANG_TEXT('堂食')
						}}</el-radio-button>
						<el-radio-button label="TAKE_OUT">{{
							$LANG_TEXT('外卖')
						}}</el-radio-button>
						<el-radio-button label="TAKE_FOOD">{{
							$LANG_TEXT('自取')
						}}</el-radio-button>
					</el-radio-group>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('堂食是否需要选择人数')}：`">
					<el-radio-group v-model="formData.isSelectPeopleNumber">
						<el-radio-button label="YES">{{
							$LANG_TEXT('是')
						}}</el-radio-button>
						<el-radio-button label="NO">{{ $LANG_TEXT('否') }}</el-radio-button>
					</el-radio-group>
				</el-form-item>

				<el-form-item :label="`${$LANG_TEXT('堂食是否需要选择座位')}：`">
					<el-radio-group v-model="formData.isSelectSeat">
						<el-radio-button label="YES">{{
							$LANG_TEXT('是')
						}}</el-radio-button>
						<el-radio-button label="NO">{{ $LANG_TEXT('否') }}</el-radio-button>
					</el-radio-group>
				</el-form-item>

				<!-- <el-form-item :label="`${$LANG_TEXT('是否显示菜品价格')}：`">
					<el-radio-group>
						<el-radio-button label="YES">{{
							$LANG_TEXT('是')
						}}</el-radio-button>
						<el-radio-button label="NO">{{ $LANG_TEXT('否') }}</el-radio-button>
					</el-radio-group>
				</el-form-item> -->

				<el-form-item
					class="inline-block"
					:label="`${$LANG_TEXT('设置钱箱密码')}：`"
					prop="cashBoxPassword"
				>
					<el-input
						type="password"
						v-model.trim="formData.cashBoxPassword"
						:placeholder="formData.id ? '******' : $LANG_TEXT('钱箱密码')"
					></el-input>
					<p class="line-tips">{{ $LANG_TEXT('有密码输入密码即可') }}</p>
				</el-form-item>

				<el-form-item :label="$LANG_TEXT('默认语言')">
					<el-select class="inline-block" v-model="formData.defaultLanguage">
						<el-option
							v-for="(item, index) in showLanguage"
							:key="'lang' + index"
							:value="item.value"
							:label="$LANG_TEXT(item.label)"
						>
							{{ $LANG_TEXT(item.label) }}
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item
					class="inline-block"
					:label="`${$LANG_TEXT('上菜方式')}：`"
					prop="servingMethod"
				>
					<div class="serving-box">
						<div
							class="serving-item"
							v-for="(item, index) in servingMethodData"
							:key="'serving' + index"
						>
							<second-input
								:placeholder="$LANG_TEXT('上菜方式')"
								v-model:firstValue="item.firstValue"
								v-model:secondValue="item.secondValue"
							></second-input>

							<!-- 添加 -->
							<div class="do-btn add-icon" @click="addServing" v-if="!index">
								<el-icon><Plus /></el-icon>
							</div>
							<!-- 删除 -->
							<div
								class="do-btn close-icon"
								@click="removeServing(index)"
								v-else
							>
								<el-icon><CloseBold /></el-icon>
							</div>
						</div>
					</div>
				</el-form-item>
			</template>
		</ml-form>
	</div>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import { testPositiveInteger } from '@/utils/regExp'
import { languageOpts } from '@/utils/options'

const { proxy } = getCurrentInstance()

const { restaurantStore, mainStore } = proxy.$usePiniaModule()

// 校验正整数
const testInteger = (rules, value, call) => {
	if (value) {
		if (testPositiveInteger(value)) {
			return call()
		} else {
			return call(new Error(`${proxy.$LANG_TEXT('请输入正整数')}`))
		}
	} else {
		return call()
	}
}

// ref
const formRef = ref()
// 表单
const formData = reactive({
	id: '',
	autoExit: '',
	cashBoxPassword: '',
	dayInitialOrder: '',
	defaultLanguage: '',
	deliveryFee: '',
	taxRate: 0,
	enterPage: 'NORMAL',
	isSelectPeopleNumber: 'YES',
	isSelectSeat: 'YES',
	servingMethod: '',
	servingMethodLanguage: ''
	// showMoney: 'ORIGINAL_VALUE'
})
// rules
const formRules = reactive({
	cashBoxPassword: [
		{
			trigger: 'change',
			required: true,
			message: proxy.$LANG_TEXT('请输入钱箱密码')
		},
		{
			validator: testInteger
		}
	],
	autoExit: [
		{
			validator: testInteger
		}
	],
	dayInitialOrder: [
		{
			validator: testInteger
		}
	],
	taxRate: [
		{
			validator: testInteger
		}
	],
	servingMethod: [
		{
			validator: (rule, value, call) => {
				if (!value || !formData.servingMethodLanguage) {
					call(new Error('请完善上菜方式'))
				} else {
					call()
				}
			}
		}
	]
})

watch(
	() => formData.priceShow,
	(nVal) => {
		console.log(nVal)
	}
)

// 查询当前餐厅信息
const getCurrDiningRoomDetail = async () => {
	try {
		const res = await restaurantStore.fetchGetBaseSetting()
		const result = res.result

		for (let i in result) {
			const obj = result[i]
			formData[i] = obj
		}
		// 规则
		formRules.cashBoxPassword.splice(0, 1)

		formData.cashBoxPassword = ''

		const servingMethod = result.servingMethod.split(',')
		const servingMethodLanguage = result.servingMethodLanguage.split(',')

		servingMethodData.value = servingMethod.map((item, index) => ({
			firstValue: item,
			secondValue: servingMethodLanguage[index]
		}))
		// console.log(result)
	} catch (error) {
		console.log(error)
	}
}

// 语言
const languageOptions = languageOpts()
// 需要展示的语言
const showLanguage = ref()

// 查询当前已设置的语言
const getCurrSetLanguage = async () => {
	const res = await mainStore.fetchGetInternationalLanguageTypeData()
	const result = res.result
	const types = result.map((item) => item.type)

	showLanguage.value = languageOptions.filter((item) =>
		types.includes(item.value)
	)
}

// 上菜方式
const servingMethodData = ref([
	{
		firstValue: '',
		secondValue: ''
	}
])

watch(servingMethodData.value, (nVal) => {
	console.log(formData)
	formData.servingMethod = servingMethodData.value
		.map((item) => item.firstValue)
		.filter((item) => item)
		.join(',')
	formData.servingMethodLanguage = servingMethodData.value
		.map((item) => item.secondValue)
		.filter((item) => item)
		.join(',')
})

// 添加上菜方式
const addServing = () => {
	servingMethodData.value.push({
		firstValue: '',
		secondValue: ''
	})
}
// 删除上菜方式
const removeServing = (index) => {
	servingMethodData.value.splice(index, 1)
}

// 提交
const submit = async (call) => {
	const testRes = await proxy.$testForm(call, formRef.value)
	if (!testRes) {
		return
	}

	// console.log(testRes)
	restaurantStore
		.fetchSettingBaseParam(formData)
		.then((res) => {
			proxy.$message({
				type: 'success',
				message: proxy.$LANG_TEXT('保存成功')
			})
			call()
		})
		.catch(() => {
			call()
		})
	console.log(formData)
}

onMounted(async () => {
	await getCurrSetLanguage()
	getCurrDiningRoomDetail()
})
</script>


<style lang="scss" scoped>
.manage-box {
	.custom-form {
		min-width: 600px;
		.date-line {
			margin-bottom: 10px;
		}

		.business-hours-box {
			width: 405px !important;
			.el-range-editor.el-input__wrapper {
				box-sizing: border-box;
			}
		}

		.serving-box {
			.serving-item {
				display: grid;
				grid-template-columns: 1fr auto;
				margin-bottom: 15px;
				.do-btn {
					margin-left: 10px;
					width: 32px;
					height: 32px;
					border-radius: 50px;
					color: white;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					font-size: 18px;

					&.add-icon {
						background-color: #05d69d;
					}

					&.close-icon {
						background-color: #ff5722;
					}
				}
			}
		}
	}
}
</style>