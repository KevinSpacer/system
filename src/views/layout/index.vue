<template>
	<el-config-provider :locale="language">
		<div id="main">
			<!-- 顶部栏 -->
			<div class="header">
				<Header-Box
					@changeLanguage="languageRefresh"
					ref="headerRef"
				></Header-Box>
			</div>

			<!-- 内容 -->
			<div class="container">
				<!-- 左侧菜单 -->
				<div class="menu-box ml-scrollbar">
					<Menu-Box
						:menuList="menu"
						v-model:currModName="bigModName"
					></Menu-Box>
				</div>

				<!-- 右侧展示 -->
				<div class="component-box">
					<div class="route-link">
						<!-- 面包屑 -->
						<el-breadcrumb :separator-icon="ArrowRight" @click="goBack">
							<el-breadcrumb-item>
								{{ $LANG_TEXT(bigModName) }}
							</el-breadcrumb-item>
							<el-breadcrumb-item
								v-for="(item, index) in metcheds"
								:key="'metched' + index"
								>{{ $LANG_TEXT(item.meta.title) }}</el-breadcrumb-item
							>
						</el-breadcrumb>

						<!-- 右侧功能 -->
						<div class="right-tool" @click.stop="refreshLayout">
							<el-button :icon="Refresh" text>{{
								$LANG_TEXT('刷新')
							}}</el-button>
						</div>
					</div>

					<!-- -->
					<div class="iframe ml-scrollbar" v-if="isRefresh">
						<router-view></router-view>
					</div>
				</div>
			</div>
		</div>
	</el-config-provider>
</template>

<script setup>
import {
	getCurrentInstance,
	nextTick,
	ref,
	watch,
	computed,
	onMounted
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { menu } from '@/utils/menuData.js'
import { authName, languageName } from '@/utils/apiConfig.js'
import * as locale from 'element-plus/lib/locale'
import { languageOpts } from '@/utils/options'

import HeaderBox from './components/header.vue'
import MenuBox from './components/menu.vue'
import { Refresh } from '@element-plus/icons-vue'

const headerRef = ref()

// console.log(locale)
// 路由
const router = useRouter()

const { currentRoute } = router
const metcheds = computed(() => {
	const matche = currentRoute.value.matched || []
	return matche.slice(1, matche.length).filter((item) => item.meta.title)
})
const { proxy } = getCurrentInstance()

const { mainStore, publicsStore, systemStore, restaurantStore } =
	proxy.$usePiniaModule()

// 当前用户权限
const currUserAuth = computed(() => systemStore.getCurrUserAuth)

// 用户信息
const usertInfo = computed(() => publicsStore.userInfo)
// 基本信息
const baseConfigInfo = computed(() => publicsStore.baseConfigInfo)

// 监听路由
router.beforeEach(async (to, from, next) => {
	// console.log('需要权限校验', to.meta.isAuth)
	// console.log('所属模块', to.meta.parentName)
	// console.log('to', to)
	// console.log('from', from)

	// 需要校验
	if (from.path == '/login') {
		next()
	} else {
		if (to.meta.isAuth) {
			let titles = []
			if (!currUserAuth.value.length) {
				await getCurrUserInfo()
				titles = await getCurrUserAuth()
			}
			const auths = currUserAuth.value.length
				? currUserAuth.value
				: titles.map((item) => item.title)
			// console.log('拥有权限', auths.includes(to.meta.parentName))
			// console.log('拥有权限模块', auths)

			if (auths.length) {
				if (auths.includes(to.meta.parentName)) {
					console.log('跳转')
					next()
				} else {
					console.log('拦截')
					next('/404')
				}
			} else {
				next('/login')
			}
		} else {
			next()
		}
	}
})

// 语言
const language = computed(() => {
	const langParams = languageOpts()
	const ch_lang = publicsStore.chooseLanguage

	const lang = langParams.find(
		(item) => item.value == ch_lang
	)

	return locale[lang.elementLocale]
})
watch(
	() => publicsStore.chooseLanguage,
	(nVal) => {}
)

// 判断是否登录
const isLogin = async () => {
	const token = proxy.$getItem(authName)
	if (!token) {
		router.replace('/login')
	} else {
		// 全局查询集合
		await getBaseSetting()
		await getRoomDetail()
		await getCurrUserInfo()
		await getCurrUserAuth()
	}
}

// 大模块名称
const bigModName = ref('')

// 处理面包屑
watch(
	() => currentRoute.value.matched,
	(nVal) => {
		isLogin()
	}
)

// 顶部header组件回调
const headerCall = (name) => {}
// 修改密码
const updatePwd = () => {}
// 退出登录
const loginOut = () => {}

// 返回
const goBack = () => {
	router.go(-1)
}

// 是否刷新
const isRefresh = ref(true)

// 刷新框架
const refreshLayout = () => {
	isRefresh.value = false

	nextTick(() => {
		isRefresh.value = true
	})
}

// 查询当前登录用户信息
const getCurrUserInfo = async () => {
	try {
		const res = await mainStore.fetchSelectCurrentUserInfo()
		const result = res.result

		publicsStore.userInfo = result

		publicsStore.chooseLanguage =
			result.language ||
			baseConfigInfo.value.defaultLanguage ||
			proxy.$getItem(languageName) ||
			'en_US'
	} catch (error) {}
}

// 查询当前用户权限
const getCurrUserAuth = async () => {
	const id = publicsStore.userInfo.id
	const res = await systemStore.fetchGetSystemUserAuth(id)
	const result = res.result
	// 赋值
	systemStore.authList = result
	return result
	// console.log(result)
}

// 查询基本信息
const getBaseSetting = async () => {
	try {
		const res = await restaurantStore.fetchGetBaseSetting()
		const result = res.result

		publicsStore.baseConfigInfo = result
	} catch (error) {
		console.log(error)
	}
}
// 查询基本信息
const getRoomDetail = async () => {
	try {
		const res = await restaurantStore.fetchGetDiningRoomSelectInfo()
		const result = res.result

		publicsStore.roomDetail = result
	} catch (error) {
		console.log(error)
	}
}

const lang_refresh = ref(true)
// 切换语言刷新全局
const languageRefresh = () => {
	// lang_refresh.value = false
	// proxy.$nextTick(() => {
	// 	lang_refresh.value = true
	// })
	// nextTick(() => {
	// 	refreshLayout()
	// })
}

onMounted(async () => {
	// 判断是否登录
	await isLogin()
	setTimeout(() => {
		if (headerRef.value) {
			// 初始语言
			headerRef.value.initIsSecondLanguage(publicsStore.chooseLanguage)
		}
	})
})
</script>

<style lang="scss" scoped>
$headerHeight: 60px;
$mainHeight: 100vh;
$menuWidth: 220px;

#main {
	display: grid;
	grid-template-rows: $headerHeight 1fr;
	height: $mainHeight;
	position: relative;
	// background-color: #f5f5fa;
	overflow: hidden;

	> .header {
		height: $headerHeight;
	}

	// 内容区域
	> .container {
		width: 100%;
		display: grid;
		grid-template-columns: $menuWidth 1fr;
		// background-color: #f5f5fa;
		// background-color:#ffffffd1;
		background-color: #f0f2f5e8;
		overflow: hidden;

		// 菜单
		> .menu-box {
			width: $menuWidth;
			height: 100%;
			background-color: white;
			overflow-y: auto;

			.el-menu {
			}
		}

		> .component-box {
			display: grid;
			grid-template-rows: 40px 1fr;
			overflow: hidden;

			// 面包屑
			> .route-link {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: 0px 10px;
				justify-content: space-between;
				// cursor: pointer !important;
			}

			> .iframe {
				background-color: white;
				margin: 0 10px;
				border-radius: 5px;
				padding: 15px;
				padding-right: 10px;
				overflow-y: auto;
			}
		}
	}
}
</style>