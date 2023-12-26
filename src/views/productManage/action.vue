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
          <el-form-item :label="`${$LANG_TEXT('菜品名称')}：`" prop="name">
            <second-input
              :placeholder="$LANG_TEXT('菜品名称')"
              v-model:firstValue="formData.name"
              v-model:secondValue="formData.nameLanguage"
            ></second-input>
          </el-form-item>

          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('菜品图片')}：`"
          >
            <upload-image
              folder="DISHES"
              v-model:fileList="imageList"
            ></upload-image>
            <p class="line-tips">{{ $LANG_TEXT("建议尺寸：750×680像素") }}</p>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('菜品分类')}：`"
            prop="classifyId"
          >
            <layz-select
              ref="classifyRef"
              class="inline-block"
              popperClass="form-select-popper1"
              :listFun="productStore.fetchGetAllClassifyPageList"
              :placeholder="$LANG_TEXT('菜品分类')"
              :selectProps="{ labelKey: 'name', valueKey: 'id' }"
              :selectPropsSecond="{ labelKey: 'nameLanguage', valueKey: 'id' }"
              v-model="formData.classifyId"
            ></layz-select>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('菜品组合')}：`"
            prop="classifyCombineId"
          >
            <layz-select
              ref="classifyGroupRef"
              class="inline-block"
              popperClass="form-select-popper2"
              :listFun="productStore.fetchGetAllProductClassifyPageList"
              :placeholder="$LANG_TEXT('菜品组合')"
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
            :label="`${$LANG_TEXT('堂食价格')}：`"
            prop="price"
          >
            <el-input
              :placeholder="$LANG_TEXT('堂食价格')"
              type="number"
              v-model="formData.price"
            ></el-input>
            <p class="line-tips">{{ $LANG_TEXT("价格不能是负数") }}</p>
          </el-form-item>

          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('外卖价格')}：`"
            prop="deliveryPrice"
          >
            <el-input
              :placeholder="$LANG_TEXT('外卖价格')"
              type="number"
              v-model="formData.deliveryPrice"
            ></el-input>
            <p class="line-tips">{{ $LANG_TEXT("价格不能是负数") }}</p>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('库存')}：`" prop="stockCount">
            <el-input
              :placeholder="$LANG_TEXT('库存')"
              type="number"
              v-model="formData.stockCount"
            ></el-input>
          </el-form-item>

          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('库存下限')}：`"
            prop="stockLowerLimitCount"
          >
            <el-input
              :placeholder="$LANG_TEXT('库存下限')"
              type="number"
              v-model="formData.stockLowerLimitCount"
            ></el-input>
            <p class="line-tips">{{ $LANG_TEXT("默认库存下限为5") }}</p>
          </el-form-item>

          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('菜品规格')}：`"
          >
            <el-radio-group v-model="formData.specificationType">
              <el-radio label="SINGLE" size="large">{{
                $LANG_TEXT("单规格")
              }}</el-radio>
              <el-radio label="MULTI" size="large">{{
                $LANG_TEXT("多规格")
              }}</el-radio>
            </el-radio-group>
            <p class="line-tips">
              {{ $LANG_TEXT("规格名称如分量大杯、中杯、小杯") }}
            </p>
          </el-form-item>

          <el-form-item
            prop="dishesSpecificationList"
            v-if="formData.specificationType == 'MULTI'"
          >
            <product-tree
              :emptyTtext="$LANG_TEXT('无规格')"
              :treePropsConfig="specProps"
              v-model="productTreeData"
            ></product-tree>
          </el-form-item>

          <el-form-item
            class="inline-block"
            :label="`${$LANG_TEXT('调味品')}：`"
            prop="dishesSpicesList"
          >
            <p class="line-tips">
              {{ $LANG_TEXT("属性名称如加糖、无糖、微辣、中辣") }}
            </p>

            <product-tree
              :emptyTtext="$LANG_TEXT('无调味品')"
              firstBtnText="添加调味品"
              parentPlaceholder="调味品"
              childrenPlaceholder="调味品值"
              :treePropsConfig="condimentProps"
              v-model="condimentTreeData"
            ></product-tree>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('菜品状态')}：`">
            <ml-switch
              v-model:switch="formData.status"
              activeValue="ON_SHELVES"
              inactiveValue="OFF_SHELVES"
              activeText="上架"
              inactiveText="下架"
            ></ml-switch>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('菜品单位')}：`">
            <second-input
              :placeholder="$LANG_TEXT('菜品单位')"
              v-model:firstValue="formData.unit"
              v-model:secondValue="formData.unitLanguage"
            ></second-input>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('是否打折')}：`">
            <ml-switch
              v-model:switch="formData.isDiscount"
              activeValue="YES"
              inactiveValue="NO"
              activeText="是"
              inactiveText="否"
            ></ml-switch>
          </el-form-item>

          <!-- <el-form-item :label="`${$LANG_TEXT('是否免税')}：`">
						<ml-switch
							v-model:switch="formData.isTaxRate"
							activeValue="YES"
							inactiveValue="NO"
							activeText="是"
							inactiveText="否"
						></ml-switch>
					</el-form-item> -->

          <!-- <el-form-item :label="`${$LANG_TEXT('是否打印后厨')}：`">
						<ml-switch
							v-model:switch="formData.isTaxRate"
							activeValue="YES"
							inactiveValue="NO"
							activeText="是"
							inactiveText="否"
						></ml-switch>
					</el-form-item> -->

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

          <el-form-item :label="`${$LANG_TEXT('菜品说明')}：`" prop="describe">
            <second-input
              type="textarea"
              :placeholder="$LANG_TEXT('菜品说明')"
              v-model:firstValue="formData.describe"
              v-model:secondValue="formData.describeLanguage"
            ></second-input>
          </el-form-item>
        </template>
      </ml-form>
    </div>
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
import productTree from "@/components/product-tree/index.vue";
import { testPositiveInteger, testPositiveNumberFlot } from "@/utils/regExp";
import { CirclePlusFilled, DeleteFilled } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const { productStore, deviceStore } = proxy.$usePiniaModule();
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
  } else {
    call();
  }
};

// 校验正整数
const testProductPositiveInteger = (rules, value, call) => {
  if (value) {
    if (testPositiveInteger(value)) {
      call();
    } else {
      call(new Error(proxy.$LANG_TEXT("请输入正整数")));
    }
  } else {
    call();
  }
};

// 校验规格数据
const testSpecData = (rules, value, call) => {
  try {
    const msgObj = {
      dishesSpecificationList: "菜品规格",
      dishesSpicesList: "调味品",
    };

    // 规格、调味品子级
    const dishesChildParams = {
      dishesSpecificationList: "dishesSpecificationAttributeList",
      dishesSpicesList: "dishesSpicesAttributeList",
    };

    if ((formData[rules.field] || []).length) {
      if (value.length) {
        // 判空
        const isNames = value.filter(
          (item) => item.name === "" || item.name === null
        );
        const isNameLanguages = value.filter(
          (item) => item.nameLanguage === "" || item.nameLanguage === null
        );

        if (isNames.length || isNameLanguages.length) {
          call(new Error(proxy.$LANG_TEXT("请完善" + msgObj[rules.field])));
          return;
        } else {
          const childName = dishesChildParams[rules.field];
          for (let i = 0; i < value.length; i++) {
            const item = value[i];
            const childs = item[childName] || [];

            // 判空
            const isNamesChild = childs.filter(
              (d) => d.name === "" || d.name === null
            );
            const isNameLanguageChilds = childs.filter(
              (d) => d.nameLanguage === "" || d.nameLanguage === null
            );
            const isPriceChilds = childs.filter(
              (d) => d.price === "" || d.price === null
            );

            if (
              isNamesChild.length ||
              isNameLanguageChilds.length ||
              isPriceChilds.length
            ) {
              call(
                new Error(
                  proxy.$LANG_TEXT("请完善" + msgObj[rules.field] + "值")
                )
              );
              return;
            } else {
              call();
            }
          }
        }
      } else {
        call(new Error(proxy.$LANG_TEXT("请填写" + msgObj[rules.field])));
      }
    } else {
      call();
    }
  } catch (error) {
    console.log(error);
  }
};

const formData = reactive({
  id: viewId,
  name: "",
  nameLanguage: "",
  logo: "",
  classifyId: "",
  classifyCombineId: "",
  dishesSpecificationList: [],
  dishesSpicesList: [],
  price: "",
  deliveryPrice: "",
  stockCount: 0,
  stockLowerLimitCount: "5",
  specificationType: "SINGLE",
  unit: "",
  status: "ON_SHELVES",
  unitLanguage: "",
  isDiscount: "YES",
  describe: "",
  describeLanguage: "",
  printerId: "",
  standbyPrinterId: "",
});

// 表单规则
const rules = {
  name: [
    {
      message: proxy.$LANG_TEXT("请输入菜品名称"),
      required: true,
      trigger: "change",
    },
    testSecondLanguage("nameLanguage"),
  ],
  // logo: [
  // 	{
  // 		message: proxy.$LANG_TEXT('请上传菜品图片'),
  // 		required: true,
  // 		trigger: 'change'
  // 	}
  // ],
  classifyId: [
    {
      message: proxy.$LANG_TEXT("请选择菜品分类"),
      required: true,
      trigger: "change",
    },
  ],
  classifyCombineId: [
    {
      message: proxy.$LANG_TEXT("请选择菜品组合"),
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
  deliveryPrice: [
    {
      message: proxy.$LANG_TEXT("请输入外卖价格"),
      required: true,
      trigger: "change",
    },
    {
      validator: testProductPrice,
    },
  ],
  stockCount: [
    // {
    // 	message: proxy.$LANG_TEXT('请输入库存'),
    // 	required: true,
    // 	trigger: 'change'
    // },
    {
      validator: testProductPositiveInteger,
    },
  ],
  stockLowerLimitCount: [
    {
      message: proxy.$LANG_TEXT("请输入库存下线"),
      required: true,
      trigger: "change",
    },
    {
      validator: testProductPositiveInteger,
    },
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
  // unit: [
  // 	{
  // 		message: proxy.$LANG_TEXT('请输入菜品单位'),
  // 		required: true,
  // 		trigger: 'change'
  // 	},
  // 	testSecondLanguage('unitLanguage')
  // ],
  // describe: [
  // 	{
  // 		message: proxy.$LANG_TEXT('请输入菜品说明'),
  // 		required: true,
  // 		trigger: 'change'
  // 	},
  // 	testSecondLanguage('describeLanguage')
  // ]
};

const formRules = computed(() => {
  const specType = formData.specificationType;

  // 单规格
  if (specType == "SINGLE") {
    return {
      ...rules,
      dishesSpicesList: [
        {
          validator: testSpecData,
        },
      ],
    };
  } else {
    //多规格

    return {
      ...rules,
      dishesSpecificationList: [
        {
          validator: testSpecData,
        },
      ],
      dishesSpicesList: [
        {
          validator: testSpecData,
        },
      ],
    };
  }
});

// 查询菜品分类下 组合数据
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
const printerLayzSelectRef = ref();
const standbyPrinterLayzSelectRef = ref();
const formRef = ref();

// 规格数据
const productTreeData = ref([
  {
    name: "",
    nameLanguage: "",
    placeholder: "规格",
    dishesSpecificationAttributeList: [
      {
        name: "",
        nameLanguage: "",
        price: "",
        placeholder: "规格值",
      },
    ],
  },
]);
// 规格参数
const specProps = {
  value: "name",
  valueSecond: "nameLanguage",
  placeholder: "placeholder",
  children: "dishesSpecificationAttributeList",
  price: "price",
};

// 调味品数据
const condimentTreeData = ref([
  {
    name: "",
    nameLanguage: "",
    placeholder: "调味品",
    dishesSpicesAttributeList: [
      {
        name: "",
        nameLanguage: "",
        price: "",
        placeholder: "调味品值",
      },
    ],
  },
]);
// 调味品参数
const condimentProps = {
  value: "name",
  valueSecond: "nameLanguage",
  placeholder: "placeholder",
  children: "dishesSpicesAttributeList",
  price: "price",
};

// 提交
const submit = async (call) => {
  // console.log(productTreeData.value)
  // console.log(condimentTreeData.value)

  // console.log(formData)
  try {
    // 编辑模式
    if (viewId) {
      // 是否修改规格、调味品
      const json_spec = JSON.stringify(productTreeData.value);
      const json_condiment = JSON.stringify(condimentTreeData.value);

      formData.isEditDishesSpecificationList =
        currProductInfo.old_json_spec != json_spec;
      formData.isEditDishesSpicesList =
        currProductInfo.old_json_condiment != json_condiment;
    }

    // 多规格
    if (formData.specificationType == "MULTI") {
      formData.dishesSpecificationList = productTreeData.value;
    }
    formData.dishesSpicesList = condimentTreeData.value;

    // 清除无数据子级
    // .filter((item) => {
    // 	const children = item.dishesSpicesAttributeList
    // 	const childLen = children.length

    // 	const isData = children.filter((d) => d.name && d.nameLanguage && d.price)

    // 	return childLen && isData.length
    // })
    // 校验表单
    const textRes = await proxy.$testForm(call, formRef.value);
    // console.log(formData)
    if (!textRes) {
      return;
    }

    const api = viewId ? "fetchProductDishesEdit" : "fetchProductDishesAdd";
    const tips = viewId ? "修改" : "添加";
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

// 当前菜品信息
let currProductInfo = {
  // json 规格、调味品
  old_json_spec: "",
  old_json_condiment: "",
};
// 查询当前菜品信息
const getCurrProductInfo = async () => {
  try {
    const res = await productStore.fetchGetProductDishesDetailsInfo(viewId);
    const result = res.result;

    // 静态赋值
    currProductInfo.old_json_spec = JSON.stringify(
      result.dishesSpecificationList
    );
    currProductInfo.old_json_condiment = JSON.stringify(
      result.dishesSpicesList
    );

    for (let i in formData) {
      formData[i] = result[i];
    }

    const logo = formData.logo;
    imageList.value = logo
      ? [
          {
            relUrl: logo,
            url: proxy.$previewFileUrl + logo,
          },
        ]
      : [];
    // console.log(imageList.value)

    nextTick(() => {
      classifyRef.value.getSelectList("info");
    });

    productTreeData.value = result.dishesSpecificationList;
    condimentTreeData.value = result.dishesSpicesList;
    // console.log(result)
  } catch (err) {}
};

onMounted(() => {
  // 组合
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
.product-container {
  .el-tree {
    .el-tree-node__content {
      height: auto;
      background-color: white !important;
    }
  }
}
</style>