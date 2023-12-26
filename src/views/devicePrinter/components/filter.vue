<template>
  <div class="filter-box">
    <el-form :inline="true">
      <el-form-item :label="$LANG_TEXT('打印机名称')">
        <second-input-model
          :placeholder="$LANG_TEXT('打印机名称')"
          v-model:firstValue="formParams.name"
          v-model:secondValue="formParams.nameLanguage"
        ></second-input-model>
      </el-form-item>

      <el-form-item :label="$LANG_TEXT('打印机类型')">
        <el-select v-model="formParams.type" :placeholder="$LANG_TEXT('打印机类型')">
          <el-option
            v-for="item in printerOpts"
            :key="item.value"
            :label="$LANG_TEXT(item.label)"
            :value="item.value"
            >{{ $LANG_TEXT(item.label) }}</el-option
          >
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">
          {{ $LANG_TEXT("搜索") }}
        </el-button>
        <el-button @click="reset">
          {{ $LANG_TEXT("重置") }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, watch } from "vue";
import { printerTypes } from "@/utils/options";

const { proxy } = getCurrentInstance();

const emits = defineEmits(["submit", "reset"]);

const printerOpts = printerTypes();

// 默认数据
const defaultParams = () => ({
  name: "",
  nameLanguage: "",
  type:"",
});
const formParams = reactive(defaultParams());

const submit = () => {
  emits("submit", formParams);
};

const reset = () => {
  const defaultData = defaultParams();
  for (let i in defaultData) {
    formParams[i] = defaultData[i];
  }
  dateTime.value = [];
  emits("reset", defaultParams());
};
</script>