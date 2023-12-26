<template>
	<div class="manage-box tree-container">
		<div class="tree-box">
			<el-button type="primary" size="small" @click="addTreeNode">
				{{ $LANG_TEXT(firstBtnText) }}
			</el-button>

			<el-tree
				:props="{
					children: treePropsConfig.children
				}"
				:data="productTreeData"
				:height="400"
				:default-expand-all="true"
				:expand-on-click-node="false"
				:empty-text="emptyTtext"
			>
				<template #default="{ node, data }">
					<div class="template-box">
						<div class="spec-form">
							<second-input
								style="width: 200px"
								size="small"
								:placeholder="node.data.placeholder"
								v-model:firstValue="node.data[treeProps.value]"
								v-model:secondValue="node.data[treeProps.valueSecond]"
							>
							</second-input>

							<!-- 规格值 -->
							<el-input
								v-if="node.level != 1"
								style="width: 90px; margin-left: 10px"
								size="small"
								:placeholder="$LANG_TEXT('价格')"
								type="number"
								v-model.trim="node.data.price"
							></el-input>
						</div>
						<div class="spec-btn">
							<el-button
								v-if="node.level == 1"
								:icon="CirclePlusFilled"
								link
								@click="addChildTreeNode(node, data)"
							>
							</el-button>
							<el-button
								@click="deleteTreeNode(node, data)"
								:icon="DeleteFilled"
								link
								v-if="!node.data.default"
							>
							</el-button>
						</div>
					</div>
				</template>
			</el-tree>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, watch, computed, getCurrentInstance } from 'vue'
import { CirclePlusFilled, DeleteFilled } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

const emits = defineEmits(['update:modelValue'])

// props
const props = defineProps({
	// 绑定值
	modelValue: {
		type: Array,
		default: () => []
	},
	// 添加大规格按钮文字
	firstBtnText: {
		type: String,
		default: '添加规格'
	},
	// 父级节点 占位符文字
	parentPlaceholder: {
		type: String,
		default: '规格'
	},
	// 自子级节点 占位符
	childrenPlaceholder: {
		type: String,
		default: '规格值'
	},
	treePropsConfig: {
		type: Object,
		default: () => ({
			value: 'value',
			valueSecond: 'valueSecond',
			placeholder: 'placeholder',
			children: 'children',
			price: 'price'
		})
	},
	emptyTtext:{
		type: String,
		default: ''
	}
})

// 树形属性规则
const treeProps = reactive(props.treePropsConfig)

// 菜品规格属性数据
// 规格模板
const specTemp = () => ({
	[treeProps.value]: '',
	[treeProps.valueSecond]: '',
	[treeProps.placeholder]: '',
	[treeProps.children]: []
})
const productTreeData = ref(props.modelValue)
watch(
	() => props.modelValue,
	(nVal) => {
		productTreeData.value = nVal
	}
)

// 子级数据
const getNodeChildren = () => {
	const specChild = specTemp()
	specChild[treeProps.placeholder] = props.childrenPlaceholder
	specChild[treeProps.price] = ''
	return specChild
}

// 添加规格node
const addTreeNode = () => {
	const spec = specTemp()
	if (spec[treeProps.children]) {
		spec[treeProps.placeholder] = props.parentPlaceholder
		spec[treeProps.children].push(getNodeChildren())
		productTreeData.value.push(spec)

		emits('update:modelValue', productTreeData.value)
	}
}

// 添加规格值node
const addChildTreeNode = (node, data) => {
	// console.log(node, data)
	if (data[treeProps.children]) {
		data[treeProps.children].push(getNodeChildren())
		// 激活数据
		productTreeData.value = [...productTreeData.value]
		emits('update:modelValue', productTreeData.value)
	}
}

// 删除操作
const deleteTreeNode = (node, data) => {
	// console.log(node, data)
	const level = node.level

	// 规格
	if (level == 1) {
		const index = productTreeData.value.findIndex(
			(item) => item.$treeNodeId == data.$treeNodeId
		)
		productTreeData.value.splice(index, 1)
		// console.log(index)
	} else {
		//规格值
		const parentData = node.parent.data
		if (parentData[treeProps.children]) {
			const index = parentData[treeProps.children].findIndex(
				(item) => item.$treeNodeId == data.$treeNodeId
			)
			parentData[treeProps.children].splice(index, 1)
			// 激活数据
			productTreeData.value = [...productTreeData.value]
		}
		// console.log(index)
	}
	emits('update:modelValue', productTreeData.value)
}
</script>


<style lang="scss" scoped>
.tree-container {
	.tree-box {
		.el-tree {
			.template-box {
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;
				align-items: center;
				justify-content: space-between;

				.spec-form {
					margin-right: 15px;
					display: flex;
					flex-direction: row;
					flex-wrap: nowrap;
					align-items: center;
				}
			}
		}
	}
}
</style>

<style lang="scss">
.tree-container {
	.el-tree {
		.el-tree-node__content {
			height: auto;
			background-color: white !important;
		}

		.el-tree__empty-block {
			width: 120px !important;
		}
	}
}
</style>