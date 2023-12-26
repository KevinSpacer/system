<template>
	<!-- 图片 -->
	<el-image class="ml-image" :src="src" :fit="fit" alt="" :preview-teleported="true" :preview-src-list="[src]">
		<template #error>
			<div class="upload-error-empty">
				<el-icon color="#dedfe0" :size="emptySize"><PictureFilled /></el-icon>
			</div>
		</template>
	</el-image>

</template>

<script setup>

const props = defineProps({
	src: {
		type: String,
		default: "",
	},
	fit: {
		type: String,
		default: "cover",
	},
	emptySize: {
		type: [String, Number],
		default: 40,
	},
});

</script>

<style lang="scss" scoped>
.ml-image {
	width: 100%;
	height: 100%;

	.upload-error-empty {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}
}
</style>