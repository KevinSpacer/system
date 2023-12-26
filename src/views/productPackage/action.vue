<template>
  <div class="manage-box product-container">
    <detail-header-panel>
      <template #tool>
        <div>
          <!-- <ml-btn type="primary" size="small" @submit="submit">{{$LANG_TEXT('提交')}}</ml-btn> -->
        </div>
      </template>
    </detail-header-panel>

    <!-- 表单 -->
    <div class="form-panel">
      <ml-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :showCancel="false"
        :confirmText="$LANG_TEXT('提交')"
        @confirm="submit"
      >
        <template #form>
          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('套餐图片')}：`"
          >
            <upload-image folder="SET_MEAL" v-model:fileList="imageList"></upload-image>
            <p class="line-tips">{{ $LANG_TEXT("建议尺寸：750×680像素") }}</p>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('套餐名称')}：`" prop="name">
            <second-input
              :placeholder="$LANG_TEXT('套餐名称')"
              v-model:firstValue="formData.name"
              v-model:secondValue="formData.nameLanguage"
            ></second-input>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('套餐分类')}：`"
            prop="classifyId"
          >
            <layz-select
              ref="classifyRef"
              class="inline-block"
              popperClass="form-select-popper1"
              :listFun="productStore.fetchGetAllClassifyPageList"
              :placeholder="$LANG_TEXT('套餐分类')"
              :selectProps="{ labelKey: 'name', valueKey: 'id' }"
              :selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
              v-model="formData.classifyId"
            ></layz-select>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('套餐组合')}：`"
            prop="classifyCombineId"
          >
            <layz-select
              ref="classifyGroupRef"
              class="inline-block"
              popperClass="form-select-popper2"
              :listFun="productStore.fetchGetAllProductClassifyPageList"
              :placeholder="$LANG_TEXT('套餐组合')"
              :selectProps="{ labelKey: 'name', valueKey: 'id' }"
              :selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
              :lastingParams="
                () => ({
                  classifyId: formData.classifyId,
                })
              "
              v-model="formData.classifyCombineId"
            ></layz-select>
          </el-form-item>

          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('套餐价格')}：`"
            prop="price"
          >
            <el-input
              :placeholder="$LANG_TEXT('套餐价格')"
              type="number"
              v-model="formData.price"
            ></el-input>
            <p class="line-tips">{{ $LANG_TEXT("价格不能是负数") }}</p>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('规格')}：`">
            <el-radio-group v-model="formData.specificationType">
              <el-radio label="SINGLE" size="large">{{
                $LANG_TEXT("单规格")
              }}</el-radio>
              <el-radio label="MULTI" size="large">{{
                $LANG_TEXT("多规格")
              }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-button size="small" type="primary" @click="addPackageAttr">
              {{ $LANG_TEXT("添加套餐属性") }}
            </el-button>
          </el-form-item>

          <el-form-item
            prop="setMealSpecificationList"
            :label="`${$LANG_TEXT('属性')}：`"
          >
            <div class="attr-container">
              <div
                class="attr-box"
                v-for="(item, index) in specData"
                :key="'spec' + index"
              >
                <div class="spec-top">
                  <div class="inputs">
                    <second-input
                      :placeholder="$LANG_TEXT('套餐名称')"
                      v-model:firstValue="item.name"
                      v-model:secondValue="item.nameLanguage"
                    ></second-input>

                    <el-input
                      v-if="formData.specificationType == 'MULTI'"
                      :placeholder="$LANG_TEXT('用户可选份数')"
                      type="number"
                      v-model.number="item.optionalCount"
                    ></el-input>
                  </div>

                  <div class="attr-btn">
                    <el-button
                      size="small"
                      type="primary"
                      @click="openProductDialog(item.dishesIds, index)"
                    >
                      {{ $LANG_TEXT("添加菜品") }}
                    </el-button>

                    <el-icon
                      v-if="!item.default"
                      @click="deletePackageAttr(index)"
                    >
                      <Delete />
                    </el-icon>
                  </div>
                </div>
                <!-- 产品列表 -->
                <div class="spec-products">
                  <div
                    class="product-item"
                    v-for="item in item.productList"
                    :key="'item' + item.id"
                  >
                    <el-image
                      fit="cover"
                      class="image"
                      :src="proxy.$previewFileUrl + item.logo"
                    ></el-image>
                    <p class="product-title">
                      <second-language
                        :firstText="item.name"
                        :secondText="item.nameLanguage"
                      ></second-language>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item :label="$LANG_TEXT('后厨打印机')" prop="printerId">
            <layz-select
              ref="printerLayzSelectRef"
              class="inline-block"
              popperClass="form-select-printerId-popper"
              :listFun="deviceStore.fetchGetPrinterPageList"
              :placeholder="$LANG_TEXT('后厨打印机')"
              :selectProps="{ labelKey: 'name', valueKey: 'id' }"
              :lastingParams="() => ({ type: 'MASTER' })"
              v-model="formData.printerId"
            ></layz-select>
          </el-form-item>

          <el-form-item
            :label="$LANG_TEXT('备用后厨打印机')"
            prop="standbyPrinterId"
          >
            <layz-select
              ref="standbyPrinterLayzSelectRef"
              class="inline-block"
              popperClass="form-select-standbyPrinter-popper"
              :listFun="deviceStore.fetchGetPrinterPageList"
              :placeholder="$LANG_TEXT('备用后厨打印机')"
              :selectProps="{ labelKey: 'name', valueKey: 'id' }"
              :lastingParams="() => ({ type: 'STANDBY' })"
              v-model="formData.standbyPrinterId"
            ></layz-select>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('套餐说明')}：`" prop="describe">
            <second-input
              type="textarea"
              :placeholder="$LANG_TEXT('套餐说明')"
              v-model:firstValue="formData.describe"
              v-model:secondValue="formData.describeLanguage"
            ></second-input>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('套餐状态')}：`">
            <ml-switch
              v-model:switch="formData.status"
              activeValue="ON_SHELVES"
              inactiveValue="OFF_SHELVES"
              activeText="上架"
              inactiveText="下架"
            ></ml-switch>
          </el-form-item>
        </template>
      </ml-form>
    </div>

    <!-- 弹窗 -->
    <ml-dialog
      ref="productDialogRef"
      class="formDialog"
      title="选择菜品"
      width="1100px"
      :showBtn="false"
    >
      <template #content>
        <change-product
          :packageTransmit="specData"
          :ids="chooseItem.ids"
          :itemIndex="chooseItem.itemIndex"
          tableListFetchName="fethGetGoodsPageList"
          @confirm="dialogConfirm"
          @cancel="dialogCancel"
        >
        </change-product>
      </template>
    </ml-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  watch,
  computed,
  getCurrentInstance,
  onMounted,
  nextTick,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import uploadImage from "@/components/upload-image.vue";
import { testPositiveNumberFlot } from "@/utils/regExp";
import { Delete } from "@element-plus/icons-vue";
import changeProduct from "@/components/change-product/index.vue";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const {productStore,deviceStore} = proxy.$usePiniaModule();
const viewId = route.query.viewId || "";

// 第二语言校验
const testSecondLanguage = (paramName) => ({
  validator: (rules, value, call) => {
    if (formData[paramName]) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("请输入第二语言")));
    }
  },
  trigger: "change",
});

// 校验正数
const testProductPrice = (rules, value, call) => {
  if (value) {
    if (testPositiveNumberFlot(value)) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("价格请输入正数")));
    }
  }
};

// 校验规格数据
const testSpecData = (rules, value = [], call) => {
  if (value.length) {
    for (let i = 0; i < value.length; i++) {
      const specItem = value[i];
      const name = specItem.name;
      const nameLanguage = specItem.nameLanguage;
      const optionalCount = specItem.optionalCount;
      const dishesIds = specItem.dishesIds;
      if (!name || !nameLanguage) {
        call(new Error(proxy.$LANG_TEXT("请完善属性的名称")));
        return;
      } else if (
        !String(optionalCount) &&
        formData.specificationType == "MULTI"
      ) {
        call(new Error(proxy.$LANG_TEXT("请完善属性的可选份数")));
        return;
      } else if (!dishesIds || !dishesIds.length) {
        call(new Error(proxy.$LANG_TEXT("请添加属性的菜品")));
        return;
      } else {
        call();
      }
    }
  } else {
    call(new Error(proxy.$LANG_TEXT("请完善套餐属性")));
  }
};

const formData = reactive({
  id: viewId,
  name: "",
  nameLanguage: "",
  logo: "",
  classifyId: "",
  classifyCombineId: "",
  setMealSpecificationList: [],
  price: "",
  specificationType: "SINGLE",
  status: "ON_SHELVES",
  describe: "",
  describeLanguage: "",
  isEditSetMealSpecificationList: false,
  printerId: "",
  standbyPrinterId: "",
});

// 表单规则
const formRules = {
  name: [
    {
      message: proxy.$LANG_TEXT("请输入套餐名称"),
      required: true,
      trigger: "change",
    },
    testSecondLanguage("nameLanguage"),
  ],
  classifyId: [
    {
      message: proxy.$LANG_TEXT("请选择套餐分类"),
      required: true,
      trigger: "change",
    },
  ],
  classifyCombineId: [
    {
      message: proxy.$LANG_TEXT("请选择套餐组合"),
      required: true,
      trigger: "change",
    },
  ],
  price: [
    {
      message: proxy.$LANG_TEXT("请输入堂食价格"),
      required: true,
      trigger: "change",
    },
    {
      validator: testProductPrice,
    },
  ],
  setMealSpecificationList: [
    {
      required: true,
      validator: testSpecData,
    },
  ],
  describe: [
    {
      message: proxy.$LANG_TEXT("请输入套餐说明"),
      required: true,
      trigger: "change",
    },
    testSecondLanguage("describeLanguage"),
  ],
  printerId: [
    {
      message: proxy.$LANG_TEXT("请选择后厨打印机"),
      required: true,
      trigger: "change",
    },
  ],
  standbyPrinterId: [
    {
      message: proxy.$LANG_TEXT("请选择备用后厨打印机"),
      required: true,
      trigger: "change",
    },
  ],
};

// 查询套餐分类下 组合数据
watch(
  () => formData.classifyId,
  (nVal) => {
    classifyGroupRef.value.getSelectList("info");
  }
);

// 图片文件
const imageList = ref([]);
watch(
  () => imageList.value.length,
  (nVal) => {
    formData.logo = imageList.value.map((item) => item.relUrl).join(",");
  }
);

// ref
const classifyRef = ref();
const classifyGroupRef = ref();
const formRef = ref();
const productDialogRef = ref();
const printerLayzSelectRef = ref();
const standbyPrinterLayzSelectRef = ref();

// 规格数据模板
const defaultSpec = () => ({
  name: "",
  nameLanguage: "",
  optionalCount: "",
  dishesIds: [],
  productList: [],
});
// 规格数据
const specData = ref([
  {
    ...defaultSpec(),
    default: true,
  },
]);

// 添加套餐属性
const addPackageAttr = () => {
  const spec = defaultSpec();
  specData.value.push(spec);
};

// 删除套餐属性
const deletePackageAttr = (index) => {
  specData.value.splice(index, 1);
};

// 选中套餐数据
const chooseItem = ref({});

// 打开选择菜品弹窗
const openProductDialog = (ids, index) => {
  // 赋值跳转
  chooseItem.value = { ids, itemIndex: index };
  productDialogRef.value.openDialog();
};
// 弹窗确认
const dialogConfirm = (res) => {
  const { ids = [], result = [], itemIndex } = res;
  // console.log(res)
  productDialogRef.value.closeDialog();
  nextTick(() => {
    // 赋值
    specData.value[itemIndex].dishesIds = ids;
    specData.value[itemIndex].productList = result;
    // console.log(specData)
  });
};
const dialogCancel = () => {
  productDialogRef.value.closeDialog();
};

// 提交
const submit = async (call) => {
  // 赋值套餐属性
  formData.setMealSpecificationList = specData.value;

  // 修改模式
  if (viewId) {
    const oldJson = infoJson.specificationListJson;
    formData.isEditSetMealSpecificationList =
      JSON.stringify(specData.value) != oldJson;
  }

  // 校验表单
  const textRes = await proxy.$testForm(call, formRef.value);

  if (!textRes) {
    return;
  }

  const api = viewId ? "fetchSetMealEditSetMeal" : "fetchSetMealAddSetMeal";
  const tips = viewId ? "修改" : "添加";

  console.log(formData);
  try {
    await productStore[api](JSON.stringify(formData));
    proxy.$message({
      type: "success",
      message: proxy.$LANG_TEXT(tips + "成功"),
    });
    setTimeout(() => {
      router.go(-1);
    }, 500);
  } catch (err) {
    console.log(err);
    call();
  }
};

// 对比josn存放对象
const infoJson = reactive({
  specificationListJson: "",
});
// 查询当前套餐信息
const getCurrProductInfo = async () => {
  try {
    const res = await productStore.fetchGetSetMealDetails(viewId);
    const result = res.result;

    // 套餐规格
    const specificationList = result.specificationList.map((item) => {
      item.dishesIds = item.dishesList.map((d) => d.dishesId);
      item.productList = item.dishesList.map((d) => {
        d.id = d.dishesId;
        return d;
      });
      return item;
    });
    infoJson.specificationListJson = JSON.stringify(specificationList);

    for (let i in formData) {
      formData[i] = result[i];
    }

    const logo = formData.logo;
    imageList.value = [
      {
        relUrl: logo,
        url: proxy.$previewFileUrl + logo,
      },
    ];
    // console.log(imageList.value)
    formData.setMealSpecificationList = specificationList;
    specData.value = specificationList;

    nextTick(() => {
      classifyRef.value.getSelectList("info");
    });

    // console.log(result)
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  classifyRef.value.getSelectList("info");
  //   打印机
  printerLayzSelectRef.value.getSelectList("info");
  standbyPrinterLayzSelectRef.value.getSelectList("info");

  if (viewId) {
    getCurrProductInfo();
  }
});
</script>


<style lang="scss" scoped>
.manage-box {
  .attr-box {
    padding: 5px 0;
    .spec-top {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
    }

    .spec-products {
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      .product-item {
        background-color: #f1f3f6;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: center;
        border-radius: 10px;
        overflow: hidden;
        margin-top: 10px;
        margin-right: 10px;
        width: 100px;
        .image {
          width: 100px;
          height: 100px;
        }
        .product-title {
          font-size: 12px;
          line-height: 25px;
          width: 100%;
          text-align: center;
        }
      }
    }

    .inputs {
      display: flex;

      .el-input,
      .second-input {
        margin-right: 10px;
      }
    }

    .attr-btn {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      width: 100px;
      margin-left: 10px;

      .el-icon {
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
.product-container {
  .el-tree {
    .el-tree-node__content {
      height: auto;
      background-color: white !important;
    }
  }
}
</style>