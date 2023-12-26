<template>
	<div class="manage-box">
		<filter-box @submit="filterCall" @reset="resetCall"></filter-box>

		<table-box :tableListFetchName="tableListFetchName" :packageTransmit="packageTransmit" :ids="ids" :itemIndex="itemIndex" ref="tableBoxRef"></table-box>

		<div class="action-btn">
			<el-button @click="cancel">{{$LANG_TEXT('取消')}}</el-button>
			<el-button @click="confirm" type="primary">{{$LANG_TEXT('确认')}}</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import filterBox from './components/filter.vue'
import tableBox from './components/table.vue'
const props = defineProps({
	itemIndex:{
		type:[String,Number],
		default:''
	},
	ids:{
		type:Array,
		default:()=>[]
	},
	packageTransmit:{
		type:Array,
		default:()=>[]
	},
	// 查询列表接口名称
	tableListFetchName:{
		type:String,
		default:""
	}
})

const tableBoxRef = ref()

const emits = defineEmits(['confirm', 'cancel'])

// 搜索
const filterCall = (params) => {
	tableBoxRef.value.fetchFilterData(params)
	// 加载
	tableBoxRef.value.openTableLoading()
}

// 重置
const resetCall = (params) => {
	tableBoxRef.value.resetParams(params)
	// 加载
	tableBoxRef.value.openTableLoading()
}

const confirm = () => {
	emits('confirm', tableBoxRef.value.chooseResult)
}
const cancel = () => {
	emits('cancel')
}
</script>


<style lang="scss" scoped>
.manage-box {
	.action-btn {
		margin-top: 30px;
		text-align: center;
	}
}
</style>