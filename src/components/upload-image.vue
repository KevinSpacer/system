<template>
	<el-upload
		:class="{ hide: realImageList.length >= limit }"
		class="ml-upload-image"
		:on-change="changeFile"
		:limit="limit"
		:file-list="realImageList"
		list-type="picture-card"
		:auto-upload="false"
		name="files"
	>
		<el-icon><Plus /></el-icon>
		<template #file="{ file }">
			<div>
				<!-- 图片 -->
				<el-image
					class="el-upload-list__item-thumbnail"
					:src="file.url"
					fit="cover"
					alt=""
				>
					<template #error>
						<div class="upload-error-empty">
							<el-icon color="#dedfe0" :size="40"><PictureFilled /></el-icon>
						</div>
					</template>
				</el-image>
				<span class="el-upload-list__item-actions">
					<!-- 查看 -->
					<span
						class="el-upload-list__item-preview"
						@click="handlePictureCardPreview(file)"
					>
						<el-icon><zoom-in /></el-icon>
					</span>
					<!-- <span
						v-if="!disabled"
						class="el-upload-list__item-delete"
						@click="handleDownload(file)"
					>
						<el-icon><Download /></el-icon>
					</span> -->
					<!-- 删除 -->
					<span
						v-if="!disabled"
						class="el-upload-list__item-delete"
						@click="handleRemove(file)"
					>
						<el-icon><Delete /></el-icon>
					</span>
				</span>
			</div>
		</template>
	</el-upload>

	<el-image-viewer
		v-if="showImageViewer"
		:initial-index="previewIndex"
		@close="closeViewer"
		:url-list="previewImageList"
	></el-image-viewer>
</template>
<script setup>
import { ref, onMounted, computed, watch, getCurrentInstance } from "vue";
import {
	Delete,
	Download,
	Plus,
	ZoomIn,
	PictureFilled,
} from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance();


const { publicsStore, mainStore } = proxy.$usePiniaModule();

const userInfo = computed(() => publicsStore.getUserInfo);

// file参数
// name: string;
// percentage?: number;
// status: UploadStatus;
// size?: number;
// response?: unknown;
// uid: number;
// url?: string; 只供展示查看
// raw?: UploadRawFile;

// 预览窗口显示
const showImageViewer = ref(false);

// 回调
const emits = defineEmits(["update:fileList"]);

// 属性
const props = defineProps({
	// [{relUrl,url}]
	fileList: {
		type: Array,
		default: () => [],
	},
	limit: {
		type: [String, Number],
		default: 1,
	},
	folder:{
		type: String,
		default: ''
	}
});

// 真实数据
const realImageList = ref([]);

watch(
	() => props.fileList,
	(nVal) => {
		// console.log(nVal)
		realImageList.value = [...nVal];
	}
);

// 预览数据
const previewImageList = computed(() =>
	realImageList.value.map((item) => item.url)
);
const previewIndex = ref(0);

const disabled = ref(false);

// 操作文件
const changeFile = (file) => {
	const files = file.raw;
	// console.log(files);
	const formdata = new FormData();
	formdata.append("folder", props.folder);
	formdata.append("files", files);
	formdata.append("sourceId", userInfo.value.id);
	formdata.append("sourceType", "web");

	mainStore
		.fetchUpload(formdata)
		.then((res) => {
			const result = (res.result.files || []).map((item) => {
				return {
					...item,
					url: proxy.$previewFileUrl + item.name,
					relUrl: item.name,
				};
			});
			const first = result[0] || {};
			// 确定本地图片
			const locaIndex = realImageList.value.findIndex(
				(item) => item.name == first.originalName
			);

			realImageList.value.splice(locaIndex, 1, first);
			// console.log(realImageList.value);
			emits("update:fileList", realImageList.value);
		})
		.catch((res) => {
			console.log(res);
		});
};

// 删除图片
const handleRemove = (file) => {
	const relUrl = file.relUrl;
	const index = realImageList.value.findIndex((item) => item.relUrl == relUrl);
	realImageList.value.splice(index, 1);
	emits("update:fileList", realImageList.value);
	// console.log(file);
	// console.log(realImageList.value);
};

// 预览图片
const handlePictureCardPreview = (file) => {
	previewIndex.value = realImageList.value.findIndex(
		(item) => item.relUrl == file.relUrl
	);
	showImageViewer.value = true;
	// console.log(previewIndex.value);
	// console.log(realImageList.value);
	// console.log(file);
};
// 关闭预览
const closeViewer = () => {
	showImageViewer.value = false;
};

onMounted(() => {});
</script>

<style lang="scss">
.hide.ml-upload-image .el-upload--picture-card {
	display: none;
}
</style>