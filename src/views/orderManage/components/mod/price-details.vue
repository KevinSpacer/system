<template>
	<!-- 订单明细 -->
	<div class="price-info">
		<p
			v-for="(item, index) in priceDetails"
			:class="item.className"
			:key="'index' + index"
		>
			<span>{{ $LANG_TEXT(item.label) }}：</span>
			<span class="value">{{ $LANG_TEXT(item.value) }}</span>
		</p>
	</div>
</template>

<script setup>
import {
	ref,
	getCurrentInstance,
	watch,
	computed,
	onMounted,
	reactive
} from 'vue'
import {
	discountMannerTypes,
	discountTypes,
	isFreeOrderTypes,
	maLingTypes,
	serviceChargeTypes
} from '@/utils/options'
const { proxy } = getCurrentInstance()

const mainStore = proxy.$usePiniaModule('mainStore')

const props = defineProps({
	orderId: {
		type: String,
		default: ''
	}
})

const order_id = ref(props.orderId)
watch(
	() => props.orderId,
	(nVal) => {
		order_id.value = nVal
		getCurrOrderPirce()
	}
)

// 数据
const priceInfo = ref({})
// 展示表
const priceDetails = ref([])
// 查询计算价格
const getCurrOrderPirce = async () => {
	const id = order_id.value
	if (!id) {
		return
	}
	try {
		const res = await mainStore.fetchCalculateOrderMoney({ id })
		const {
			actuallyPaidMoney,
			cashDiscountMoney,
			discountManner,
			discountType,
			isFreeOrder,
			maLingMoney,
			maLingType,
			orderDiscount,
			orderMoney,
			serviceCharge,
			serviceChargeType,
			taxRate
		} = res.result

		// 订单折扣
		if (discountType) {
			priceDetails.value.push({
				label: `折扣类型`,
				value: `${discountTypes[discountType]}`
			})

			// 折扣方式
			if (discountManner) {
				priceDetails.value.push({
					label: `折扣方式`,
					value: `${discountMannerTypes[discountManner]}`
				})
			}
		}

		// 现金折扣
		if (cashDiscountMoney) {
			priceDetails.value.push({
				label: `现金折扣（定额）`,
				value: `$${cashDiscountMoney}`
			})
		}

		// 订单折扣
		if (orderDiscount) {
			priceDetails.value.push({
				label: `订单折扣（百分比）`,
				value: `$${orderDiscount}%`
			})
		}

		// 服务费
		if (serviceCharge) {
			const typeText = `（${serviceChargeTypes[serviceChargeType]}）`
			// 定额
			if (serviceChargeType == 'QUOTA') {
				priceDetails.value.push({
					label: `服务费`,
					value: `$${serviceCharge} ${typeText}`
				})
			} else {
				priceDetails.value.push({
					label: `服务费`,
					value: `${serviceCharge}% ${typeText}`
				})
			}
		}

		// 税率
		if (taxRate) {
			priceDetails.value.push({
				label: `税率`,
				value: `${taxRate}%`
			})
		}

		// 抹零
		if (maLingMoney) {
			priceDetails.value.push({
				label: `抹零`,
				value: `${maLingTypes[maLingType]}`
			})
			priceDetails.value.push({
				label: `抹零金额`,
				value: `${maLingMoney}`
			})
		}

		// 免单
		if (isFreeOrder) {
			priceDetails.value.push({
				label: `是否免单`,
				value: `${isFreeOrderTypes[isFreeOrder]}`
			})
		}

		// 订单金额
		priceDetails.value.push({
			label: `订单金额（原价）`,
			value: `$${(orderMoney || 0).toFixed(2)}`,
			className: 'total-price'
		})

		// 订单金额
		priceDetails.value.push({
			label: `实付金额`,
			value: `$${(actuallyPaidMoney || 0).toFixed(2)}`,
			className: 'total-price'
		})

		priceInfo.value = res.result
		// console.log(priceDetails.value);
	} catch (error) {
		console.log(error)
	}
}

onMounted(() => {
	getCurrOrderPirce()
})
</script>

<style lang="scss" scoped>
.price-info {
	> p {
		margin: 10px 0;
	}
	line-height: 30px;
	font-size: 14px;
	padding-left: 15px;

	.total-price {
		font-weight: bold;
		.value {
			color: red;
		}
	}
}
</style>