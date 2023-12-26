<template>
      <el-empty description="找不到该页面" >
      <el-button  type="primary" @click="$router.go(-1)">返回</el-button>
  </el-empty>
</template>

<script>

</script>

<style lang="scss">
.el-empty{
    width: 100%;
    height: 100%;
}
</style>