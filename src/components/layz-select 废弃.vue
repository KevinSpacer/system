<template>
	<el-select
		v-model="selectValue"
		filterable
		:filter-method="onFilter"
		placeholder="请选择"
		v-el-select-load-more:rangeNumber="loadMoreFun(rangeNumber)"
		@change="onChange"
	>
		<el-option
			v-for="item in pageList"
			:key="item[selectProps.value]"
			:label="item[selectProps.label]"
			:value="item[selectProps.value]"
		>
		</el-option>
	</el-select>
</template>

<script>
export default {
	props: {
		// 列表请求函数
		listFun: {
			type: Function,
			default: () => {}
		},
		selectProps: {
			// select的key和value对应的字段
			type: Object,
			default: () => {
				return { label: 'label', value: 'value' }
			}
		},
    popperClass:{
			type: String,
			default: 'ml-popper1'
    },
		value: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			selectValue: '',
			pageList: [],
			rangeNumber: 1, //下拉框滚动到底部后新增的条数
			defaultNumber: 1 //初始展示条数,每次加载条数
		}
	},
	async created() {
		const res = await this.listFun({ pageNum: this.rangeNumber, pageSize: 10 })
		const result = res.result
		//   默认展示的
		this.pageList = result

		console.log(result)

		this.selectValue = this.value
	},
	watch: {
		value() {
			this.selectValue = this.value
		},
		async rangeNumber(nVal) {
			const res = await this.listFun({
				pageNum: nVal,
				pageSize: 10
			})
			const result = res.result
      if(nVal == 1){
        this.pageList = result
      }else{
        this.pageList.push(result)
      }
		}
	},
	methods: {
		onFilter(val) {
			// 下拉框搜索
			this.rangeNumber = this.defaultNumber
			this.pageList = this.pageList.filter((item) => {
				const str = item[this.selectProps.label]
				const reg = RegExp(val)
				return reg.test(str)
			})
		},
		loadMoreFun(n) {
			//每次滚动到底部可以新增条数
			return () =>{}
		},
		onChange(value) {
			// 下拉框选中
			this.pageList.some((item) => {
				if (item[this.selectProps.value] === value) {
					this.$emit('input', value)
					return true
				}
			})
		}
	},
	//注册一个自定义指令 `v-el-select-load-more`
	directives: {
		'el-select-load-more': {
			bind(el, binding) {
				// 获取element-ui定义好的scroll盒子
				const SELECTWRAP_DOM = document.querySelector(
					`.${this.popperClass} .el-select-dropdown__wrap`
				);
        console.log(this)
        console.log(SELECTWRAP_DOM)
				SELECTWRAP_DOM.addEventListener('scroll', function () {
					/**
					 * scrollHeight 获取元素内容高度(只读)
					 * scrollTop 获取或者设置元素的偏移值,常用于计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
					 * clientHeight 读取元素的可见高度(只读)
					 * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
					 * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
					 */
					const condition =
						this.scrollHeight - this.scrollTop <= this.clientHeight
            console.log(condition)
					if (condition) {
            this.rangeNumber += this.defaultNumber

            console.log(this.rangeNumber)
            binding.value()
          }
				})
			}
		}
	}
}
</script>