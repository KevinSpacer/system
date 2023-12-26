<template>
	<div class="menu-container">
		<el-menu
			active-text-color="#05d69dff"
			background-color="#ffffff"
			text-color="#607d8b"
			:default-active="currMenuIndex"
			:default-openeds="openeds"
			class="el-menu-vertical"
			:collapse="isCollapse"
			@open="menuOpen"
			@close="menuClose"
		>
			<div v-for="(item, index) in currAuthMenuList" :key="'menu' + index">
				<!-- 嵌套 -->
				<el-sub-menu
					:index="`${index}`"
					v-if="item.children && item.children.length"
				>
					<template #title>
						<component class="menu-icon" :is="item.icon"></component>
						<p class="oneLineOver">{{ $LANG_TEXT(item.title) }}</p>
					</template>

					<div v-if="item.children && item.children.length">
						<el-menu-item
							:index="index + '-' + i"
							v-for="(child, i) in item.children"
							:key="'menu' + index + i"
							@click="routePush(child)"
						>
							<component class="menu-icon" :is="child.icon"></component>
							<p class="oneLineOver">{{ $LANG_TEXT(child.title) }}</p>
						</el-menu-item>
					</div>
				</el-sub-menu>

				<!-- 单级 -->
				<div v-else>
					<el-menu-item :index="`${index}`" @click="routePush(item)">
						<component class="menu-icon" :is="item.icon"></component>
						<p class="oneLineOver">{{ $LANG_TEXT(item.title) }}</p>
					</el-menu-item>
				</div>
			</div>
		</el-menu>
	</div>
</template>

<script setup>
import {
	getCurrentInstance,
	ref,
	toRefs,
	onMounted,
	computed,
	watch,
	nextTick
} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { menu } from '@/utils/menuData.js'

const { proxy } = getCurrentInstance()
const systemStore = proxy.$usePiniaModule('systemStore')

// 当前用户权限
const currUserAuth = computed(() => systemStore.getCurrUserAuth)

watch(
	() => currUserAuth.value,
	(nVal) => {
		// console.log(nVal)
		init()
	}
)

const router = useRouter()
const route = useRoute()

const emits = defineEmits(['update:currModName'])

const props = defineProps({
	menuList: {
		type: Array,
		default: () => []
	},
	// 当前模块名称
	currModName: {
		type: String,
		default: ''
	}
})

const { menuList } = toRefs(props)

// 当前用户权限数据
const currAuthMenuList = computed(() => {
	const titles = currUserAuth.value

	return menuList.value.filter((item) => titles.includes(item.title))
})

// 是否缩放
const isCollapse = ref(false)

// 操作菜单
// 展开菜单
const menuOpen = (key, keyPath) => {}

// 关闭菜单
const menuClose = (key, keyPath) => {}

// 菜单跳转
const routePush = (item) => {
	router.push(item)
}

// 选中菜单项
const currMenuIndex = ref('')
const openeds = ref([])

// 获取父级菜单INDEX
let menuIndex = () => {
	const currPath = route.path
	return currAuthMenuList.value.findIndex((item) => {
		if (item.children && item.children.length) {
			const children = item.children
			return children.find((d) => d.path == currPath)
		} else {
			return item.path == currPath
		}
	})
}

// 处理菜单选中
const renderMenuSelect = () => {
	const currPath = route.path
	const mIndex = menuIndex()
	const currItem = currAuthMenuList.value[mIndex]
	// const title = proxy.$LANG_TEXT(currItem.title)
	const title = currItem.title
	// console.log(title)
	// 设置父子级INDEX
	const currMenuItem = currAuthMenuList.value[mIndex]

	// 嵌套
	if (currMenuItem.children && currMenuItem.children.length) {
		const childIndex = currMenuItem.children.findIndex(
			(item) => item.path == currPath
		)
		currMenuIndex.value = `${mIndex}-${childIndex}`

		emits('update:currModName', title)
	} else {
		//单级
		currMenuIndex.value = `${mIndex}`
		emits('update:currModName', title)
	}

	openeds.value = [mIndex]
}

// 监听选中
watch(
	() => route.path,
	(nVal) => {
		const mIndex = menuIndex()
		if (mIndex !== -1) {
			renderMenuSelect()
		}
	}
)

// 初始
const init = () => {
	const currPath = route.path
	const mIndex = menuIndex()
	// console.log(mIndex)
	// console.log(currAuthMenuList.value)

	if (mIndex != -1) {
		// 设置父子级INDEX
		const currMenuItem = currAuthMenuList.value[mIndex]
		// 未找到菜单页面
		if (!currMenuItem) {
			router.replace('/')
			return
		}
		renderMenuSelect()
	} else {
	}
}

onMounted(() => {
	// nextTick(() => {
	// 	init()
	// })
})
</script>

<style lang="scss" scoped>
.menu-container {
	width: 100%;
	height: 100%;
	background-color: #fff;

	--ml-menu-hover-bg-color: #cccccc57;

	.el-menu-vertical {
		border: none;

		.menu-icon {
			width: 20px;
			height: 20px;
			margin-right: 5px;
		}
	}

	.el-menu-item:hover {
		background-color: var(--ml-menu-hover-bg-color);
	}

	.el-menu-item {
		display: grid;
		grid-template-columns: auto 1fr;
		font-size: 14px;
	}

	p.oneLineOver {
		padding-right: 5px;
	}
}
</style>

<style lang="scss">
.menu-container {
	.el-sub-menu__title {
		display: grid;
		grid-template-columns: auto 1fr auto;
	}
}
</style>