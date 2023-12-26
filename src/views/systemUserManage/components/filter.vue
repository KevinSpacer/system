<template>
  <div class="filter-box">
    <el-form :inline="true">
      <el-form-item :label="$LANG_TEXT('用户名称')">
        <el-input :placeholder="$LANG_TEXT('用户名称')" v-model="formParams.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">
          {{$LANG_TEXT('搜索')}}
        </el-button>
        <el-button @click="reset">
          {{$LANG_TEXT('重置')}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import {reactive} from 'vue'

  const emits = defineEmits(['submit','reset'])

  // 默认数据
  const defaultParams = ()=>({
    name:'',
  })
  const formParams = reactive(defaultParams())

  const submit = ()=>{
    emits('submit',formParams)
  }

  const reset = ()=>{
    const defaultData = defaultParams()
    for(let i in defaultData){
      formParams[i] = defaultData[i]
    }
    emits('reset',defaultParams())
  }

</script>