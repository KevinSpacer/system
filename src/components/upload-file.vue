<template>
	<el-upload
		ref="uploadRef"
		class="upload-file"
		v-model:file-list="fileData"
		:on-change="changeFile"
		:on-preview="previewFile"
		:before-remove="deleteFile"
		:auto-upload="false"
		:limit="limit"
		:accept="accept"
	>
		<el-button
			type="primary"
			:disabled="fileData.length == limit"
			iconSize="18px"
			:icon="UploadFilled"
			>{{$LANG_TEXT('文件上传')}}</el-button
		>
		<template #tip>
			<div class="el-upload__tip">
				<slot>
					{{ uploadTips }}
				</slot>
			</div>
		</template>
	</el-upload>
</template>
<script setup>
import { ref, onMounted, computed, watch, getCurrentInstance } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'

const emits = defineEmits(['update:files', 'update:fileList', 'previewFile'])

const props = defineProps({
	uploadTips: {
		type: String,
		default: ''
	},
	fileList: {
		type: Array,
		default: () => []
	},
	limit: {
		type: Number,
		default: 1
	},
	isRequest: {
		type: Boolean,
		default: true
	},
	accept:{
		type: String,
		default: ''
	},
	folder:{
		type: String,
		default: ''
	}
})

const { proxy } = getCurrentInstance()

const { publicsStore, mainStore } = proxy.$usePiniaModule()

const userInfo = computed(() => publicsStore.getUserInfo)

// ref
const uploadRef = ref()

// fileData
//  {name,url}
const fileData = ref(props.fileList)
watch(
	() => props.fileList,
	(nVal) => {
		fileData.value = nVal
	}
)

// 操作文件
const changeFile = (file) => {
	const files = file.raw
	// console.log(files)
	const formdata = new FormData()
	formdata.append('folder', props.folder)
	formdata.append('files', files)
	formdata.append('sourceId', userInfo.value.id)
	formdata.append('sourceType', 'web')

	// proxy.$nextTick(()=>{
	//   fileData.value.map(item=>{
	//     item.status = 'error'
	//     return item
	//   })
	//   console.log(fileData.value);
	// })

	if (props.isRequest) {
		mainStore
			.fetchUpload(formdata)
			.then((res) => {
				const result = (res.result.files || []).map((item) => {
					return {
						...item,
						name: files.name,
						url: proxy.$previewFileUrl + item.name,
						relUrl: item.name
					}
				})
				const first = result[0] || {}
				// 确定本地文件
				const locaIndex = fileData.value.findIndex(
					(item) => item.name == first.originalName
				)
				fileData.value.splice(locaIndex, 1, first)

				// console.log(fileData.value)
				emits('update:fileList', fileData.value)
			})
			.catch((res) => {
				// console.log(res);
				// 确定本地文件
				const locaIndex = fileData.value.findIndex(
					(item) => item.name == files.name
				)
				fileData.value.splice(locaIndex, 1)
			})
	} else {
		emits('update:files', files)
	}
}

// 查看文件
const previewFile = (file) => {
	emits('previewFile', file.raw)
}

// 监听删除文件
const deleteFile = (file, files) => {
	// console.log(props.isRequest);
	// console.log(file, files);
	const name = file.name
	const index = fileData.value.findIndex((item) => item.name == name)
	fileData.value.splice(index, 1)

	if (props.isRequest) {
		emits('update:fileList', files)
	} else {
		emits('update:files', null)
	}
}

// 清除文件
const clearFiles = () => {
	uploadRef.value.clearFiles()
}

onMounted(() => {})

defineExpose({
	clearFiles
})
</script>

<style lang="scss">
.upload-file {
	width: 100%;
	.el-upload__tip {
		color: #9e9e9e;
	}

	.el-upload-list__item-status-label {
		line-height: 36px;
	}
	.el-upload-list__item-name {
		padding-right: 25px;
	}
}
</style>