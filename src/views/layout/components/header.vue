<template>
  <div class="container">
    <!-- 左侧区域 -->
    <div class="container-left">
      <!-- logo -->
      <img class="logo" :src="$previewFileUrl + roomInfo.logo" alt="" />

      <!-- 标题 -->
      <div class="title">
        <p>
          <second-language
            :firstText="roomInfo.name || ''"
            :secondText="roomInfo.nameLanguage || ''"
          ></second-language>
        </p>
      </div>
    </div>

    <!-- 右侧功能区域 -->
    <div class="container-right">
      <!-- 餐厅信息 -->
      <div class="restaurant-detail">
        <p>
          <span>{{ $LANG_TEXT("联系方式") }}：</span>
          <second-language
            :firstText="roomInfo.contactWay || ''"
            :secondText="roomInfo.contactWayLanguage || ''"
          ></second-language>
        </p>
        <p>
          <span>{{ $LANG_TEXT("地址") }}：</span>
          <second-language
            :firstText="roomInfo.address || ''"
            :secondText="roomInfo.addressLanguage || ''"
          ></second-language>
        </p>
      </div>

      <div class="righth-detail">
        <!-- 多语言 -->
        <div class="language-box">
          <el-dropdown
            type="primary"
            placement="bottom"
            max-height="300px"
            trigger="click"
            @visible-change="getCurrSetLanguage"
          >
            <el-button type="primary" text bg>{{
              $LANG_TEXT(currLanguage.label)
            }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in showLanguage"
                  :key="'lang' + index"
                  @click="changeLanguage(item.value)"
                >
                  {{ $LANG_TEXT(item.label) }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 右侧数据 -->
        <el-dropdown trigger="click">
          <!-- 用户信息 -->
          <div>
            <div class="user-detail">
              <!-- 头像 -->
              <!-- <div class="avatar">
								<el-avatar :icon="UserFilled" :size="40" />
							</div> -->

              <!-- 名称 -->
              <div class="nickname">
                <span>{{ userInfo.name || "user" }}</span>
              </div>
            </div>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openCase">
                {{ $LANG_TEXT("修改密码") }}
              </el-dropdown-item>
              <!-- <el-dropdown-item @click="openServiceDialog">
                {{ $LANG_TEXT("设置服务器地址") }}
              </el-dropdown-item> -->
              <el-dropdown-item divided @click="loginOut">
                {{ $LANG_TEXT("退出登录") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>

  <!-- 修改密码弹窗 -->
  <ml-dialog
    width="650px"
    ref="pwdRef"
    :title="$LANG_TEXT('修改密码')"
    @confirm="dialogConfirm"
  >
    <template #content>
      <ml-form
        ref="formRef"
        :model="pwdForm"
        :rules="pwdRules"
        :showBtn="false"
      >
        <template #form>
          <el-form-item :label="`${$LANG_TEXT('旧密码')}：`" prop="oldPassWord">
            <el-input
              v-model="pwdForm.oldPassWord"
              :placeholder="$LANG_TEXT('请输入旧密码')"
              show-password
            />
          </el-form-item>
          <el-form-item :label="`${$LANG_TEXT('新密码')}：`" prop="newPassWord">
            <el-input
              v-model="pwdForm.newPassWord"
              :placeholder="$LANG_TEXT('请输入新密码')"
              show-password
            />
          </el-form-item>
          <el-form-item
            :label="`${$LANG_TEXT('确认密码')}：`"
            prop="confirmPwd"
          >
            <el-input
              v-model="pwdForm.confirmPwd"
              :placeholder="$LANG_TEXT('请输入确认密码')"
              show-password
            />
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>

  <!-- 服务器地址弹窗 -->
  <ml-dialog
    width="450px"
    ref="serviceDialogRef"
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
import {
  reactive,
  watch,
  ref,
  getCurrentInstance,
  computed,
  onMounted,
  nextTick,
} from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { testPwd, testServiceUrl } from "@/utils/regExp.js";
import { UserFilled } from "@element-plus/icons-vue";
import { languageOpts } from "@/utils/options";
import { languageName, storeage_service_name } from "@/utils/apiConfig";

const emits = defineEmits(["changeLanguage"]);

const avatarIcon = require("@Assets/logo.png");
const router = useRouter();
const { proxy } = getCurrentInstance();

const { publicsStore, mainStore, restaurantStore } = proxy.$usePiniaModule();

const userInfo = computed(() => publicsStore.getUserInfo);
const baseConfigInfo = computed(() => publicsStore.baseConfigInfo);
const roomInfo = computed(() => publicsStore.roomDetail);

// 初始
const initIsSecondLanguage = async (nVal) => {
  // 语言
  await getCurrSetLanguage();
  await proxy.$getCurrLanguageResult();

  const defaultLanguage = baseConfigInfo.value.defaultLanguage;
  // console.log(defaultLanguage)
  // console.log(nVal)
  if (defaultLanguage) {
    // 不是默认语言
    publicsStore.isSecondLanguage = nVal != defaultLanguage;
  }
};

// 语言
const languageOptions = languageOpts();
// 需要展示的语言
const showLanguage = ref();

// 查询当前已设置的语言
const getCurrSetLanguage = async () => {
  const res = await mainStore.fetchGetInternationalLanguageTypeData();
  const result = res.result;
  const types = result.map((item) => item.type);

  showLanguage.value = languageOptions.filter((item) =>
    types.includes(item.value)
  );
};

// 选择的语言
const currLanguage = computed(() =>
  languageOptions.find((item) => item.value == publicsStore.chooseLanguage)
);
watch(
  () => publicsStore.chooseLanguage,
  (nVal) => {
    proxy.$setItem(languageName, nVal);
    // initIsSecondLanguage(nVal)
  }
);

// 选择语言显示
const changeLanguage = async (language) => {
  try {
    publicsStore.chooseLanguage = language;

    // await proxy.$getCurrLanguageResult()

    // 修改用户语言
    await mainStore.fetchEditSystemUserLanguage(language);

    await initIsSecondLanguage(language);

    emits("changeLanguage", language);
  } catch (error) {}
};

// 弃用
// // 获取最终选择的语言数据
// const getCurrLanguageResult = async () => {
// 	// 赋值
// 	const res = await getCurrChangeLanguage()
// 	const result = res.result
// 	publicsStore.languageData = result.reduce((add, curr, index) => {
// 		add[curr.key] = curr.value
// 		return add
// 	}, {})
// }

// // 查询当前选中语言数据
// const getCurrChangeLanguage = () => {
// 	const type = publicsStore.chooseLanguage
// 	return mainStore.fetchGetInternationalLanguageContentList({ type })
// }

// ref
const pwdRef = ref();
// 修改密码表单参数
const pwdForm = reactive({
  oldPassWord: "",
  newPassWord: "",
  confirmPwd: "",
});
const validPwd = () => ({
  validator: (rules, value, call) => {
    if (testPwd(value)) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("密码为6~20位的数字、字母或其组合")));
    }
  },
});
// 是否相同
const validPwdRight = () => ({
  validator: (rules, value, call) => {
    if (
      pwdForm.newPassWord &&
      pwdForm.confirmPwd &&
      pwdForm.newPassWord === pwdForm.confirmPwd
    ) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("两次密码不一致")));
    }
  },
});
// 修改密码表单校验
const pwdRules = computed(() => ({
  oldPassWord: [
    {
      message: proxy.$LANG_TEXT("请填写旧密码"),
      trigger: "change",
      required: true,
    },
    validPwd(),
  ],
  newPassWord: [
    {
      message: proxy.$LANG_TEXT("请填写新密码"),
      trigger: "change",
      required: true,
    },
    validPwd(),
    validPwdRight(),
  ],
  confirmPwd: [
    {
      message: proxy.$LANG_TEXT("请填写确认密码"),
      trigger: "change",
      required: true,
    },
    validPwd(),
    validPwdRight(),
  ],
}));

// 弹窗
// 打开窗口
const openCase = () => {
  pwdRef.value.openDialog();
};
// 表单ref
const formRef = ref();

// 弹窗确认
const dialogConfirm = async (call) => {
  const testResult = await proxy.$testForm(call, formRef.value);

  if (!testResult) {
    return;
  }

  mainStore
    .fetchUpdatePasswordPut(pwdForm)
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("修改成功"),
      });
      pwdRef.value.closeDialog();
      formRef.value.resetFields();

      loginOut();
    })
    .catch(() => {
      call();
    });

  // console.log(pwdForm);
};

// 退出登录
const loginOut = () => {
  publicsStore.clearUseStore();
  router.replace("/login");
};

// 服务器设置
// ref
const serviceDialogRef = ref();
const serviceFormRef = ref();

// 数据
const serviceForm = reactive({
  serviceUrl: "",
}); // 数据
const serviceRules = {
	// 废弃
//   serviceUrl: [
//     {
//       validator: (rules, value, call) => {
//         if (value) {
//           if (testServiceUrl(value)) {
//             call();
//           } else {
//             call(new Error(proxy.$LANG_TEXT("请输入正确的服务器地址")));
//           }
//         } else {
//           call();
//         }
//       },
//     },
//   ],
};

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

onMounted(async () => {});

defineExpose({
  initIsSecondLanguage,
});
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: grid;
  grid-template-columns: 205px 1fr;
  align-items: center;
  justify-items: stretch;
  padding: 0 15px;
  box-sizing: border-box;
  color: white;
  // background: linear-gradient(45deg, #1e88e5, #03a9f4, #1e88e5 80%, #2196f3b0);
  background: linear-gradient(
    45deg,
    var(--el-color-primary),
    var(--el-color-primary-light-5),
    var(--el-color-primary),
    var(--el-color-primary-light-5),
    var(--el-color-primary)
  );

  &-left {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;

    .logo {
      width: 45px;
      height: auto;
      margin-right: 10px;
    }
  }

  &-right {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    .restaurant-detail {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      font-size: 14px;

      > p {
        margin-right: 20px;
        display: flex;
        align-items: center;

        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }

    .righth-detail {
      display: flex;
      flex-direction: row;
      align-items: center;

      .language-box {
        margin-right: 15px;
      }

      // 用户信息
      .user-detail {
        cursor: pointer;

        .avatar {
        }

        .nickname {
          min-width: 60px;
          max-width: 150px;
          font-size: 13px;
          margin-left: 10px;
          color: white;
        }
      }
    }
  }
}
</style>