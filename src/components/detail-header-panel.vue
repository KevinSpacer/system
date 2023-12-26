<!-- 主持人管理 -->
<template>
	<div class="detail-panel-box">
		<div class="panel-box">
			<!-- 顶部栏 -->
			<div class="page-header-box">
				<el-page-header
					@back="
						() => {
							router.go(-1)
						}
					"
					:icon="ArrowLeft"
				/>
			</div>

			<!-- 右边栏 -->
			<div class="page-header-tool">
				<slot name="tool"></slot>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

// const props = defineProps({
//   title:{
//     type:String,
//     default:'详情页'
//   }
// })

// const {
//   title
// } = reactive(props)
</script>

<style lang="scss">
.detail-panel-box {
	padding: 10px 0;
	position: sticky;
	top: -15px;
	z-index: 9;
	background-color: white;
	margin-top: -15px;

	.panel-box {
		background-color: white;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}

	.el-page-header__left {
		&::after {
			width: 0;
			height: 0;
		}
	}
	.el-page-header__content {
		font-size: 16px;
	}
}
</style>