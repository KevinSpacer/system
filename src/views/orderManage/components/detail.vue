<template>
	<div class="detail-box">
		<detail-header-panel> </detail-header-panel>
		<div class="eat-food-box">
			<!-- 右侧购物车菜单 -->
			<div class="cart-container">
				<!-- 购物车 -->
				<div class="car-menu-box">
					<!-- 人数、座位、服务员 -->
					<!-- 堂食 -->
					<div class="top-show-info" v-if="routeParams.type == 'EAT_IN'">
						<div class="peopel btn oneLineOver">
							<span>{{ $LANG_TEXT('人数') }}：</span>
							<span>{{ routeParams.peopleQuantity }}</span>
						</div>
						<div class="intercept btn oneLineOver">
							<span>{{ $LANG_TEXT('座位') }}：</span>
							<span>{{ routeParams.location }}</span>
						</div>
						<div class="waiter btn oneLineOver">
							<span>{{ $LANG_TEXT('服务员') }}：</span>
							<span>{{ routeParams.waiterName }}</span>
						</div>
					</div>
					<!-- 客户、终端号、服务员 -->
					<!-- 其他 -->
					<div class="top-show-info" v-else>
						<div class="peopel btn oneLineOver">
							<span>{{ $LANG_TEXT('客户') }}：</span>
							<span>{{ routeParams.userName }}</span>
						</div>
						<div class="intercept btn oneLineOver">
							<span>{{ $LANG_TEXT('终端号') }}：</span>
							<span>{{ routeParams.contactWay }}</span>
						</div>
						<div class="waiter btn oneLineOver">
							<span>{{ $LANG_TEXT('服务员') }}：</span>
							<span>{{ routeParams.waiterName }}</span>
						</div>
					</div>

					<!-- 购物车内容 -->
					<div class="car-container">
						<!-- 标题头 -->
						<div class="table-theader">
							<p>{{ $LANG_TEXT('商品') }}</p>
							<p>{{ $LANG_TEXT('数量') }}</p>
							<p class="oneLineOver">{{ $LANG_TEXT('金额') }}</p>
						</div>

						<!-- 内容 -->
						<div class="content">
							<div class="table-list ml-scrollbar">
								<!-- 菜品 -->
								<div
									class="list-item"
									v-for="(item, index) in addedToCart"
									:key="'car-item' + index"
								>
									<!-- 菜品、套餐 -->
									<div class="first-item">
										<div class="product-name">
											<second-language
												class="oneLineOver"
												:firstText="item.name"
												:secondText="item.nameLanguage || item.name"
											></second-language>
										</div>
										<div class="product-num">
											<span>{{ item.goodsQuantity }}</span>
										</div>
										<div class="product-price">
											${{ item.price * item.goodsQuantity }}
										</div>
									</div>

									<!-- 规格 -->
									<list-item :goodsDetail="item"></list-item>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 订单详情 -->
			<div class="order-detail">
				<h3 class="order-status">
					<span>{{ $LANG_TEXT('订单状态') }}：</span>
					<span>{{ $LANG_TEXT(orderStatusText) }}</span>
				</h3>

				<!-- 基本新 -->
				<div class="base-address">
					<p>
						<span>{{ $LANG_TEXT('订单号') }}：</span>
						<span>{{ routeParams.orderId }}</span>
					</p>
					<p>
						<span>{{ $LANG_TEXT('地址') }}：</span>
						<span>{{ routeParams.address || $LANG_TEXT('暂无') }}</span>
					</p>
					<p>
						<span>{{ $LANG_TEXT('备注') }}：</span>
						<span>{{ routeParams.remark || $LANG_TEXT('暂无') }}</span>
					</p>
					<p>
						<span>{{ $LANG_TEXT('是否免单') }}：</span>
						<span>{{ $LANG_TEXT(isStatus[orderDetail.isFreeOrder]) }}</span>
					</p>
					<p v-if="orderDetail.freeOrderReason">
						<span>{{ $LANG_TEXT('免单理由') }}：</span>
						<span>{{ orderDetail.freeOrderReason || $LANG_TEXT('暂无') }}</span>
					</p>
					<p v-if="orderDetail.canceledReason">
						<span>{{ $LANG_TEXT('取消理由') }}：</span>
						<span>{{ orderDetail.canceledReason || $LANG_TEXT('暂无') }}</span>
					</p>
				</div>

				<!-- 订单明细 -->
				<price-details :orderId="routeParams.orderId"></price-details>

				<!-- 基本信息 -->
				<div class="base-address">
					<p v-if="orderDetail.initiatePayType">
						<span>{{ $LANG_TEXT('支付类型') }}：</span>
						<span>{{
							$LANG_TEXT(orderPayStatus[orderDetail.initiatePayType])
						}}</span>
					</p>
					<p>
						<span>{{ $LANG_TEXT('点餐类型') }}：</span>
						<span>{{
							$LANG_TEXT(
								(
									orderTypes.find((item) => item.value == orderDetail.type) ||
									{}
								).label
							)
						}}</span>
					</p>
				</div>

				<div class="order-list ml-scrollbar">
					<div
						class="order-item"
						v-for="(item, index) in payOrderList"
						:key="index"
					>
						<div class="title">
							<span class="name" v-if="item.paymentMethodName">
								<second-language
									:firstText="item.paymentMethodName"
									:secondText="item.paymentMethodNameLanguage"
								></second-language>
							</span>
							<span class="name" v-else>
								{{ $LANG_TEXT('金额') }}{{ index + 1 }}
							</span>
							<span class="price"> ${{ item.payAmount }} </span>
						</div>
						<div class="status">
							{{ orderStatus[item.status] }}
						</div>
					</div>
				</div>

				<!-- 退款列表 -->
				<div class="order-list payOut ml-scrollbar">
					<div class="pay-out-title">
						{{ $LANG_TEXT('退款明细') }}
					</div>
					<div
						class="order-item"
						v-for="(item, index) in payOutList"
						:key="index"
					>
						<div class="title">
							<span class="name">
								<second-language
									:firstText="item.paymentMethodName"
									:secondText="item.paymentMethodNameLanguage"
								></second-language>
							</span>
							<span class="price"> ${{ item.refundAmount }} </span>
						</div>
						<div class="status">
							{{ $LANG_TEXT('已退款') }}
						</div>
					</div>
				</div>

				<!-- 小费列表 -->
				<div class="order-list ml-scrollbar">
					<div class="pay-out-title">
						{{ $LANG_TEXT('小费明细') }}
					</div>
					<div class="order-item" v-for="(item, index) in tipData" :key="index">
						<div class="title">
							<span class="name">
								<second-language
									:firstText="item.paymentMethodName"
									:secondText="item.paymentMethodNameLanguage"
								></second-language>
							</span>
							<span class="price"> ${{ item.payAmount }} </span>
						</div>
						<div class="status">
							{{ $LANG_TEXT('已支付') }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import priceDetails from './mod/price-details.vue'
import {
	ref,
	reactive,
	onMounted,
	watch,
	getCurrentInstance,
	computed,
	nextTick
} from 'vue'
import { orderTypeOpts } from '@/utils/options'
import { useRoute, useRouter } from 'vue-router'
import listItem from './mod/list-item.vue'
const { proxy } = getCurrentInstance()

const route = useRoute()
const routeQuery = reactive(route.query || {})
const router = useRouter()

const orderTypes = orderTypeOpts()

// 携带参数
const routeParams = reactive({
	orderId: '',
	id: '',
	serveDishesWay: proxy.$LANG_TEXT('无'),
	remark: proxy.$LANG_TEXT('无'),
	type: '',
	peopleQuantity: '',
	location: '',
	userName: '',
	contactWay: '',
	address: '',
	waiterName: ''
})

// 是否
const isStatus = {
	YES: '是',
	NO: '否'
}

// 基本信息
const baseInfos = ref([])

// 全局模块
const mainStore = proxy.$usePiniaModule('mainStore')
// 已加入购物车
const addedToCart = ref([])

// 判空
const isEmpty = ['', undefined, null]

// 多功能表单
const toolForm = reactive({
	remark: '',
	// 折扣
	discount: {
		cashDiscountMoney: '',
		order: {
			orderDiscount: '',
			orderDiscountType: ''
		},
		product: {
			dishesDiscount: '',
			dishesDiscountType: ''
		}
	},
	// 抹零
	notCount: {
		maLingMoney: '',
		maLingType: 'NO',
		maLingText: '不抹'
	},
	// 服务费
	service: {
		serviceChargeType: '',
		serviceCharge: ''
	},
	// 小费
	tip: {
		payAmount: '',
		paymentMethodName: '',
		paymentMethodNameLanguage: ''
	},
	// 税率
	taxRate: 0,
	// 合单
	consolidated: {
		mainOrder: '',
		order: ''
	},
	// 分额
	partialPay: {
		amount: [],
		dividedNumber: 0
	},
	// 取消订单原因
	cancelingOrder: '',
	// 免单原因
	freeChargeReason: '',
	// 免单金额
	freeChargePrice: ''
})

// 订单数据查询
// 数据
const orderCarData = ref([])
// 获取订单购物单列表
const getOrderShoppingList = async (id) => {
	try {
		const res = await mainStore.fetchGetOrderShoppingList(id)
		const result = res.result
		orderCarData.value = result

		setAddCarData(result, 'playOrder')
	} catch (error) {}
}

// 赋值添加购物车数据
const setAddCarData = (result, type) => {
	// 赋值添加购物车数据
	setTimeout(() => {
		const addedCarDataResult = result.reduce((add, curr) => {
			return add.concat(toAddedCarData(curr.goodsList, type))
		}, [])
		addedToCart.value = JSON.parse(JSON.stringify(addedCarDataResult))
		// console.log(addedCarDataResult);
		// console.log(addedToCart)
	})
}

//接口数据 转 加入购物车本地数据
const toAddedCarData = (list) => {
	return list.map((item) => {
		const {
			// 自定义菜品
			customDishes,
			// 调味品
			dishesSpicesList = [],
			// 自定义调味品
			customDishesSpicesList,
			// 菜品信息
			dishes = {},
			stockCount,
			goodsId,
			id,
			dishesDiscount,
			dishesDiscountType,
			goodsQuantity,
			goodsPrice,
			goodsType,
			// 套餐
			setMeal,
			status
		} = item

		const result = {
			goodsId,
			shopId: id,
			goodsQuantity,
			goodsPrice,
			dishesDiscount,
			dishesDiscountType,
			isDiscount: (dishes || {}).isDiscount,
			isTaxRate: (dishes || {}).isTaxRate,
			price: goodsPrice,
			stockCount,
			goodsType,
			status
		}

		// 调味品
		result.dishesSpicesList = dishesSpicesList
		// 自定义调味品
		result.customDishesSpicesList = customDishesSpicesList

		// DISHES:菜品、CUSTOM_DISHES:自定义菜品、SET_MEAL:套餐
		if (goodsType == 'DISHES') {
			// 赋值
			dishes.price = goodsPrice
			Object.assign(result, dishes)
		} else if (goodsType == 'CUSTOM_DISHES') {
			const obj = customDishes || {}
			result.name = obj.name
			result.orderShoppingGoodsId = obj.orderShoppingGoodsId
			result.orderShoppingId = obj.orderShoppingId
			result.price = obj.price
		} else if (goodsType == 'SET_MEAL') {
			Object.assign(result, setMeal)
			result.specificationList = setMeal.setMealSpecificationList.map((d) => {
				const child = d.setMealSpecificationDishesList
				d.setMealSpecificationDishesList = child.map((e) => {
					e.id = e.dishesId
					return e
				})
				return d
			})
			// console.log(result)
			// .map((d) => {
			// d.dishesList = d.setMealSpecificationDishesList;
			// 	return d;
			// });
		}

		// 菜品、套餐
		if (goodsType == 'DISHES' || goodsType == 'SET_MEAL') {
			// 当前规格列表 子级参数名
			const currSpecChildName =
				goodsType == 'DISHES'
					? 'dishesSpecificationAttributeList'
					: 'setMealSpecificationDishesList'
			// 规格数据
			const sureCarData =
				goodsType == 'DISHES'
					? result.dishesSpecificationList || []
					: result.specificationList || []
			// 规格ID
			const dataIds = sureCarData.reduce((add, curr, index) => {
				const childs = curr[currSpecChildName]
				add.push(curr.id)
				const ids = childs.map((item) => item.id)
				return add.concat(ids)
			}, [])
			// 规格ID
			const condmentDataIds = result.dishesSpicesList.reduce(
				(add, curr, index) => {
					const childs = curr.dishesSpicesAttributeList
					add.push(curr.id)
					const ids = childs.map((item) => item.id)
					return add.concat(ids)
				},
				[]
			)
			//本地使用 唯一标识
			result.skuId = `${result.goodsId}-${
				dataIds.join('-') + '-' + condmentDataIds.join('-')
			}`
		}

		// console.log(result);
		return result
	})
}

// 订单详情
const orderDetail = ref({})
// 根据ID查询订单详情
const getOrderIdDetail = async (id) => {
	try {
		const res = await mainStore.fetchGetOrderDetails(id)
		const result = res.result
		orderDetail.value = result

		const params = {
			type: '',
			peopleQuantity: '',
			location: '',
			userName: '',
			contactWay: '',
			address: '',
			remark: '',
			serveDishesWay: '',
			waiterName: '',
			isInitiatePay: ''
		}
		for (let i in params) {
			routeParams[i] = result[i]
		}
		routeParams.id = id
		routeParams.orderId = id

		// 多功能表单
		toolForm.remark = result.remark
		// 折扣
		toolForm.discount = {
			cashDiscountMoney: result.cashDiscountMoney,
			order: {
				orderDiscount: result.orderDiscount,
				orderDiscountType: result.orderDiscountType
			},
			product: {
				dishesDiscount: '',
				dishesDiscountType: ''
			}
		}

		// 抹零
		// 抹零options
		const notCountOpts = {
			NO: proxy.$LANG_TEXT('不抹'),
			YUAN: proxy.$LANG_TEXT('抹元'),
			ANGLE: proxy.$LANG_TEXT('抹角'),
			POINTS: proxy.$LANG_TEXT('抹分')
		}
		toolForm.notCount = {
			maLingMoney: result.maLingMoney,
			maLingType: result.maLingType,
			maLingText: notCountOpts[result.maLingType]
		}

		// 服务费
		toolForm.service = {
			serviceCharge: result.serviceCharge,
			serviceChargeType: result.serviceChargeType
		}

		// 税率
		toolForm.taxRate = result.taxRate

		// console.log(toolForm);
	} catch (error) {
		console.log(mainStore)
		console.log(error)
	}
}

// AA分单查询
// 订单状态
const orderStatus = {
	NO_PAY: proxy.$LANG_TEXT('未支付'),
	YES_PAY: proxy.$LANG_TEXT('已支付')
}
// 发起支付类
const orderPayStatus = {
	DIRECT_PAY: proxy.$LANG_TEXT('直接支付'),
	AA_PAY: proxy.$LANG_TEXT('AA支付'),
	SHARE_PAY: proxy.$LANG_TEXT('分额支付')
}
// 明细列表
const payOrderList = ref([])
// 查询订单明细
const getOrderAAPayDetail = async (id) => {
	try {
		const res = await mainStore.fetchGetOrderPayDetailList(id)
		const result = res.result
		payOrderList.value = result
	} catch (error) {}
}

const payOutList = ref([])
// 查询退款列表
const getOrderRefundList = async (orderId) => {
	const res = await mainStore.fetchGetOrderRefundList({
		orderId
	})
	const result = res.result
	payOutList.value = result
}

// 查询小费列表
const tipData = ref([])
const getOrderTippingList = async (orderId) => {
	const res = await mainStore.fetchGetOrderTippingList({
		orderId
	})
	const result = res.result
	tipData.value = result.slice(result.length-1);
}

// 订单状态text
const orderStatusText = computed(() => {
	const { status } = orderDetail.value
	const obj = {
		AWAIT: '暂存订单',
		UNDER_WAY: '未支付',
		FINISH: '已支付',
		CANCELED: '已取消'
	}
	return obj[status]
})

onMounted(async () => {
	const id = routeQuery.orderId
	await getOrderIdDetail(id)
	// await getTemporaryOrderShoppingList(id);
	await getOrderShoppingList(id)
	await getOrderAAPayDetail(id)
	await getOrderRefundList(id)
	await getOrderTippingList(id)
})
</script>

<style lang="scss" scoped>
$grayColor: #fdfdfd;

.detail-box {
	height: 100%;
	display: grid;
	grid-template-rows: auto 1fr;

	.eat-food-box {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		height: 100%;
		user-select: none;

		// 右侧购物车菜单
		> .cart-container {
			padding: 10px 30px;
			height: 100%;
			box-sizing: border-box;
			overflow: hidden;

			// 购物车
			.car-menu-box {
				height: 100%;
				display: grid;
				grid-template-rows: 40px 1fr;
				.top-show-info {
					display: grid;
					flex-direction: row;
					grid-template-columns: repeat(3, 1fr);
					justify-items: center;

					> div {
						width: auto;
						height: 40px;
						color: white;
						border-radius: 10px;
						line-height: 40px;
						text-align: center;
						box-shadow: 0px 0px 6px #0000001a;
						padding: 0 5px;
						min-width: 120px;
						max-width: 220px;

						&.peopel {
							background-color: #2b68fe;
						}
						&.intercept {
							background-color: #ffa001;
						}
						&.waiter {
							background-color: #f20808;
						}
					}
				}

				.car-container {
					height: calc(100% - 15px);
					display: grid;
					grid-template-rows: 43px 1fr;
					overflow: hidden;
					padding: 10px;
					box-sizing: border-box;

					.table-theader {
						display: grid;
						grid-template-columns: 1fr 120px 120px;
						border: 1px solid #f5f7fa;
						justify-items: center;
						border-radius: 10px;
						padding: 10px 0;

						p {
							width: 100%;
							text-align: center;

							&:nth-last-child(1) {
								text-align: left;
							}
						}
					}

					.content {
						box-shadow: 0px 2px 10px 0px #0000001a;
						border-radius: 10px;
						overflow: hidden;

						.table-list {
							height: 100%;
							font-size: 15px;
							overflow-y: auto;
							padding-bottom: 15px;
							box-sizing: border-box;
							.list-item {
								// padding: 10px 0;
								transition: 300ms;

								.first-item {
									display: grid;
									flex-direction: row;
									flex-wrap: nowrap;
									grid-template-columns: 1fr 120px 120px;
									justify-items: center;
									align-items: center;
								}

								.product-name {
									width: 100%;
									overflow: hidden;
									padding-left: 10px;
									box-sizing: border-box;
									font-size: 16px;
									font-weight: 600;
									height: 40px;
									line-height: 40px;
								}

								.product-status {
									font-size: 13px;
								}
								.product-price {
									width: 100%;
								}

								&.active {
									background-color: #8080800f;
								}
							}
						}

						.goods-detailed {
							line-height: 30px;
							font-size: 14px;
							padding-left: 15px;

							.total-price {
								font-weight: bold;
								span {
									color: red;
								}
							}
						}

						.down-log {
							display: grid;
							grid-template-columns: repeat(3, 1fr);
							justify-items: center;
							padding: 10px 0;
							border-top: 1px solid #f5f7fa;

							&.log2 {
								grid-template-columns: 1fr 1fr 280px;
							}

							&.log3 {
								display: flex;
								padding: 10px;
							}
						}
					}
				}
			}
		}

		// 订单详情
		.order-detail {
			.order-status {
				padding-left: 15px;
			}
			.base-address {
				padding-left: 15px;
				font-size: 13px;

				p {
					margin: 10px 0;
				}
			}

			.goods-detailed {
				line-height: 30px;
				font-size: 14px;
				padding-left: 15px;

				.total-price {
					font-weight: bold;
					span {
						color: red;
					}
				}
			}

			.order-list {
				width: 80%;
				overflow-y: auto;

				&.payOut {
					.order-item {
						.status {
							color: red;
						}
					}
				}
				.order-item {
					box-shadow: 0px 0px 10px 0px #9e9e9e59;
					margin: 15px 5px;
					border-radius: 10px;
					box-sizing: border-box;
					padding: 10px;
					display: grid;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					height: 50px;
					border: 1px solid white;
					transition: 200ms;
					grid-template-columns: 1fr auto;
					.title {
						display: flex;
						flex-direction: row;
						flex-wrap: nowrap;
						align-items: center;

						.name {
							padding-right: 15px;
						}
					}
					.status {
						color: #05d69d;
						font-size: 15px;
					}
				}
			}
		}
	}
}
</style>
