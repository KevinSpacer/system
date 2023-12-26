<template>
  <div class="login-box" data-bg="oddbird" @keydown="changeDown">
    <img
      class="logo"
      :src="roomDetail.logo ? $previewFileUrl + roomDetail.logo : logo"
      alt=""
    />

    <div class="login-form">
      <!-- 标题 -->
      <div class="login-title" @click="onHandTen">
        <h1 v-if="roomDetail.name">
          {{
            $LANG_TEXT(roomDetail.name, {
              mode: "second",
              secondValue: roomDetail.nameLanguage,
            })
          }}
        </h1>
        <h1 v-else>
          {{ $LANG_TEXT("餐饮WEB管理系统") }}
        </h1>
      </div>

      <ml-form
        ref="formRef"
        :showBtn="false"
        :model="formParams"
        :rules="formRules"
        labelWidth="0"
        formSize="large"
      >
        <template #form>
          <el-form-item prop="account">
            <el-input
              :prefix-icon="User"
              v-model.trim="formParams.account"
              :placeholder="$LANG_TEXT('请输入账号')"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model.trim="formParams.password"
              type="password"
              :placeholder="$LANG_TEXT('请输入密码')"
            />
          </el-form-item>
        </template>
      </ml-form>

      <!-- 按钮 -->
      <div class="btn-box">
        <el-button
          :loading="showLoading"
          type="primary"
          size="large"
          @click="loginSubmit"
          >{{ $LANG_TEXT("登录") }}</el-button
        >
      </div>
    </div>
  </div>

  <!-- 服务器地址弹窗 -->
  <ml-dialog
    width="450px"
    ref="serviceDialogRef"
	:closeOnClickModal="false"
    :title="$LANG_TEXT('服务器地址')"
    @confirm="serviceDialogConfirm"
  >
    <template #content>
      <ml-form
        ref="serviceFormRef"
        :model="serviceForm"
        :rules="serviceRules"
        :showBtn="false"
      >
        <template #form>
          <el-form-item
            :label="`${$LANG_TEXT('服务器地址')}：`"
            prop="serviceUrl"
          >
            <el-input
              v-model="serviceForm.serviceUrl"
              :placeholder="$LANG_TEXT('请输入服务器地址')"
            />
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted,nextTick } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import {
  authName,
  languageName,
  storeage_service_name,
} from "@/utils/apiConfig";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();

const { mainStore, publicsStore, restaurantStore } = proxy.$usePiniaModule();

// 图标
const logo = require("@/assets/logo.png");
// ref
const formRef = ref();
// 加载
const showLoading = ref(false);

// 表单参数
const formParams = reactive({
  account: "",
  password: "",
});
// 表单验证
const formRules = {
  account: [
    {
      message: proxy.$LANG_TEXT("请输入账号"),
      trigger: "blur",
      required: true,
    },
  ],
  password: [
    {
      message: proxy.$LANG_TEXT("请输入密码"),
      trigger: "blur",
      required: true,
    },
  ],
};

// 校验表单
const testForm = (call) => {
  return new Promise((resolve) => {
    formRef.value.validate((valid, fields) => {
      if (!valid) {
        showLoading.value = false;
      }
      resolve(valid);
    });
  });
};
// fetchLoginPost

// 点击登录
const loginSubmit = async () => {
  if (showLoading.value) {
    return;
  }
  showLoading.value = true;

  const testRes = await testForm();
  if (!testRes) {
    return;
  }

  mainStore
    .fetchLoginPost(formParams)
    .then((res) => {
      const token = res.result || "";

      proxy.$setItem(authName, token);

      publicsStore.languageData = {};

      ElMessage({
        message: res.message,
        type: "success",
      });

      router.replace("/");
    })
    .catch((res) => {
      showLoading.value = false;
    });
};

// 餐厅信息
const roomDetail = ref({});
// 查询当前餐厅信息
const getCurrDiningRoomDetail = async () => {
  try {
    const res = await restaurantStore.fetchGetDiningRoomSelectInfo();
    const result = res.result;

    roomDetail.value = result;
  } catch (error) {
    console.log(error);
  }
};

// 监听10次
// 值
const timeNum = ref(0);
const onHandTen = () => {
  timeNum.value += 1;

  if (timeNum.value >= 10) {
    timeNum.value = 0;
    openServiceDialog();
  }
};

// 服务器设置
// ref
const serviceDialogRef = ref();
const serviceFormRef = ref();

// 数据
const serviceForm = reactive({
  serviceUrl: "",
}); // 数据
const serviceRules = {};

// 打开弹窗
const openServiceDialog = () => {
  serviceDialogRef.value.openDialog();

  nextTick(() => {
    // 赋值
    const url = proxy.$getItem(storeage_service_name);
    serviceForm.serviceUrl = url || proxy.$serveIP;
  });
};

// 确认
const serviceDialogConfirm = async (call) => {
  const testResult = await proxy.$testForm(call, serviceFormRef.value);

  if (!testResult) {
    return;
  }

  proxy.$setItem(storeage_service_name, serviceForm.serviceUrl);
  serviceDialogRef.value.closeDialog();
  call();
  router.go(0);
};

onMounted(async () => {
  const language = proxy.$getItem(languageName);
  publicsStore.chooseLanguage = language || "en_US";
  proxy.$getCurrLanguageResult();
  getCurrDiningRoomDetail();
});

// 监听回车
const changeDown = (e) => {
  // 回车
  if (e.keyCode == 13) {
    loginSubmit();
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/login.scss";

.login-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/images/login-bg.png");
  background-repeat: no-repeat;
  background-position: top left;
  background-size: cover;
  background-attachment: fixed;

  .logo {
    height: 80px;
    margin-bottom: 30px;
  }

  .login-title {
	cursor: pointer;
	user-select: none;
  }

  .login-form {
    width: 380px;
    // height: 250px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
    justify-content: space-around;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 5px 8px 10px 0px #00000038;
    background-color: white;
    border-top: 10px solid #05d69dff;

    .custom-form {
      width: 65%;
      margin-top: 20px;
    }
  }

  .btn-box {
    width: 65%;
    button {
      width: 100%;
    }
  }
}
</style>
