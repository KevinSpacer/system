<template>
  <div class="manage-box">
    <div class="form-content">
      <ml-form
        label-width="120px"
        :model="formData"
        :rules="formRules"
        ref="formRef"
        confirmText="保存"
        :showBtn="true"
        :showCancel="false"
        @confirm="submitForm"
      >
        <template #form>
          <div class="content-itme">
            <p class="title">{{ $LANG_TEXT("前台打印机") }}</p>
            <el-form-item
              :label="`${$LANG_TEXT('打印机编号')}：`"
              prop="printerId"
            >
              <el-input
                :placeholder="$LANG_TEXT('打印机编号')"
                v-model="formData.printerId"
              ></el-input>
            </el-form-item>

            <el-form-item :label="`${$LANG_TEXT('名称')}：`" prop="printerName">
              <second-input
                :placeholder="$LANG_TEXT('名称')"
                v-model:firstValue="formData.printerName"
                v-model:secondValue="formData.printerNameLanguage"
              ></second-input>
            </el-form-item>
          </div>

          <div class="content-itme">
            <p class="title">{{ $LANG_TEXT("备用前台打印机") }}</p>
            <el-form-item
              :label="`${$LANG_TEXT('打印机编号')}：`"
              prop="standbyPrinterId"
            >
              <el-input
                :placeholder="$LANG_TEXT('打印机编号')"
                v-model="formData.standbyPrinterId"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="`${$LANG_TEXT('名称')}：`"
              prop="standbyPrinterName"
            >
              <second-input
                :placeholder="$LANG_TEXT('名称')"
                v-model:firstValue="formData.standbyPrinterName"
                v-model:secondValue="formData.standbyPrinterNameLanguage"
              ></second-input>
            </el-form-item>
          </div>
        </template>
      </ml-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, onMounted } from "vue";

const { proxy } = getCurrentInstance();

const restaurantStore = proxy.$usePiniaModule("restaurantStore");

// ref
const formRef = ref();
// 表单数据
const formData = reactive({
  id: "",
  printerId: "",
  printerName: "",
  printerNameLanguage: "",

  standbyPrinterId: "",
  standbyPrinterName: "",
  standbyPrinterNameLanguage: "",
});

// 规则

const formRules = computed(() => {
  const secondName = (name) => {
    return (rules, value, call) => {
      if (formData[name]) {
        call();
      } else {
        call(new Error(proxy.$LANG_TEXT("请输入第二语言")));
      }
    };
  };
  const { id, name } = {
    id: [
      {
        message: proxy.$LANG_TEXT("请输入打印机编号"),
        required: true,
        trigger: "change",
      },
    ],
    name: [
      {
        message: proxy.$LANG_TEXT("请输入名称"),
        required: true,
        trigger: "change",
      },
    ],
  };

  return {
    printerId: id,
    printerName: [
      ...name,
      {
        validator: secondName("printerNameLanguage"),
        trigger: "change",
      },
    ],

    standbyPrinterId: id,
    standbyPrinterName: [
      ...name,
      {
        validator: secondName("standbyPrinterNameLanguage"),
        trigger: "change",
      },
    ],
  };
});

// 提交
const submitForm = async (call) => {
  const testRes = await proxy.$testForm(call, formRef.value);
  if (!testRes) {
    call();
    return;
  }

  restaurantStore
    .fetchSettingBaseParam(formData)
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("保存成功"),
      });
      getCurrDiningRoomDetail();
      call();
    })
    .catch(() => {
      call();
    });
};

// 查询当前餐厅信息
const getCurrDiningRoomDetail = async () => {
  try {
    const res = await restaurantStore.fetchGetBaseSetting();
    const result = res.result;

    for (let i in formData) {
      const obj = result[i];
      formData[i] = obj;
    }

    // console.log(result)
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getCurrDiningRoomDetail();
});
</script>


<style lang="scss" scoped>
.manage-box {
  .form-content {
    width: 600px;

    .content-itme {
      margin-top: 50px;

      &:nth-child(1) {
        margin-top: 0px;
      }

      .title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }
}
</style>