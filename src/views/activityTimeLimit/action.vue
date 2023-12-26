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
          <el-form-item :label="`${$LANG_TEXT('活动名称')}：`" prop="title">
            <el-input
              :placeholder="$LANG_TEXT('活动名称')"
              v-model="formData.title"
            ></el-input>
          </el-form-item>

          <el-form-item prop="dishes" :label="`${$LANG_TEXT('商品')}：`">
            <div class="attr-container">
              <div
                class="attr-box"
                v-for="(item, index) in productData"
                :key="'spec' + index"
              >
                <div class="spec-top">
                  <el-button
                    size="small"
                    type="primary"
                    @click="openProductDialog(item.dishesIds || [], index)"
                  >
                    {{ $LANG_TEXT("添加商品") }}
                  </el-button>
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

          <el-form-item :label="`${$LANG_TEXT('活动时间')}：`" prop="startTime">
            <el-date-picker
              v-model="activeDate"
              type="daterange"
              :start-placeholder="$LANG_TEXT('开始时间')"
              :end-placeholder="$LANG_TEXT('结束时间')"
            />
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('可售时间')}：`" prop="timeWeek">
            <div class="week-check">
              <el-checkbox
                v-model="checkAllValue"
                @change="handleAllCheck"
                :indeterminate="isIndeterminate"
                :disabled="!(activeDate || []).length"
                >{{ $LANG_TEXT("全选") }}</el-checkbox
              >
              <el-checkbox-group v-model="formData.timeWeek">
                <el-checkbox
                  v-for="week in weekViewData"
                  :key="week.label"
                  :label="week.value"
                  :disabled="week.disabled"
                  >{{ $LANG_TEXT(week.label) }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </el-form-item>

          <el-form-item prop="timeBucket">
            <div class="date-grop">
              <div
                class="date-line"
                v-for="(item, index) in activeLineDate"
                :key="'date' + index"
              >
                <el-time-picker
                  v-model="activeLineDate[index]"
                  is-range
                  format="HH:mm"
                  range-separator="-"
                  :start-placeholder="$LANG_TEXT('开始时间')"
                  :end-placeholder="$LANG_TEXT('结束时间')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <div class="date-add">
              <el-button @click="pushTimeLine">{{
                $LANG_TEXT("添加时间段")
              }}</el-button>
            </div>
          </el-form-item>
        </template>
      </ml-form>
    </div>

    <!-- 弹窗 -->
    <ml-dialog
      ref="productDialogRef"
      class="formDialog"
      :title="$LANG_TEXT('选择商品')"
      width="1100px"
      :showBtn="false"
    >
      <template #content>
        <change-product
          :packageTransmit="productData"
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
import { testPositiveNumberFlot } from "@/utils/regExp";
import changeProduct from "@/components/change-product/index.vue";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();

const activeStore = proxy.$usePiniaModule("activeStore");
const viewId = route.query.viewId || "";

// 周期
const weekCheckboxData = [
  {
    label: "周一",
    value: "MONDAY",
    disabled: true,
  },
  {
    label: "周二",
    value: "TUESDAY",
    disabled: true,
  },
  {
    label: "周三",
    value: "WEDNESDAY",
    disabled: true,
  },
  {
    label: "周四",
    value: "THURSDAY",
    disabled: true,
  },
  {
    label: "周五",
    value: "FRIDAY",
    disabled: true,
  },
  {
    label: "周六",
    value: "SATURDAY",
    disabled: true,
  },
  {
    label: "周日",
    value: "SUNDAY",
    disabled: true,
  },
];
// 是否为indeterminate 半选
const isIndeterminate = computed(() => {
  const chooseDataLength = formData.timeWeek.length;

  if (chooseDataLength) {
    if (
      chooseDataLength >=
      weekViewData.value.filter((item) => !item.disabled).length
    ) {
      checkAllValue.value = true;
      return false;
    } else {
      checkAllValue.value = false;
      return true;
    }
  } else {
    checkAllValue.value = false;
    return false;
  }
});

// 全选状态
const checkAllValue = ref(false);

// 勾选全部
const handleAllCheck = (res) => {
  formData.timeWeek = res
    ? weekViewData.value
        .filter((item) => !item.disabled)
        .map((item) => item.value)
    : [];
};

// 活动时间
const activeDate = ref([]);
watch(
  () => activeDate.value,
  (nVal) => {
    const [startTime = "", endTime = ""] = (nVal || []).map((item, index) => {
      const stNum = new Date(item).getTime();
      return proxy.$timeSpToDate(stNum, index);
    });

    formData.startTime = startTime;
    formData.endTime = endTime;
    formData.timeWeek = [];
  }
);

// 周期展示数据
const weekViewData = computed(() => {
  const date = activeDate.value;
  const [start, end] = date || [];

  const weekResult = proxy.$getWeekDay(start, end);
  // console.log(weekResult)

  return weekCheckboxData.map((item) => {
    const value = item.value;
    const isRes = weekResult[value];
    const falseArr = [null, undefined, ""];
    item.disabled = falseArr.includes(isRes) ? true : false;
    return item;
  });
});

// 活动时间段数据
const activeLineDate = ref([[]]);
watch(activeLineDate.value, (nVal) => {
  setActiveTimeLine(nVal);
  // console.log(formData.timeBucket)
});

// 处理活动时间段
const setActiveTimeLine = (times) => {
  console.log(times);
  formData.timeBucket = times
    .map((item) => {
      return (item || []).map((d) => {
        const st = new Date(d).getTime();
        const timeText = proxy.$timeStampToTime(st, { format: "HH:mm" });
        return {
          value: d,
          label: timeText,
        };
      });
    })
    .filter((item) => item && item.length)
    .map((items) => {
      const [start, end] = items;
      return {
        startTime: start.label + ":00",
        endTime: end.label + ":00",
      };
    });
};

// 添加时间段
const pushTimeLine = () => {
  activeLineDate.value.push([]);
  proxy.$forceUpdate();
};

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

// 校验时间段
const testDateLine = (rules, value, call) => {
  if (value.length) {
    call();
  } else {
    call(new Error(proxy.$LANG_TEXT("请完善时间段")));
  }
};

const formData = reactive({
  id: viewId,
  title: "",
  titleLanguage: "",
  timeBucket: [],
  dishes: [],
  endTime: "",
  startTime: "",
  timeWeek: [],
  isEditDishes: false,
  isEditTime: false,
});

// 表单规则
const formRules = {
  title: [
    {
      message: proxy.$LANG_TEXT("请输入活动名称"),
      required: true,
      trigger: "change",
    },
  ],
  dishes: [
    {
      required: true,
      validator: (rules, value, call) => {
        if (value.length) {
          call();
        } else {
          call(new Error(proxy.$LANG_TEXT("请选择商品")));
        }
      },
    },
  ],
  startTime: [
    {
      message: proxy.$LANG_TEXT("请选择活动时间"),
      required: true,
      trigger: "change",
    },
  ],
  timeWeek: [
    {
      required: true,
      validator: (rules, value, call) => {
        if (value.length) {
          call();
        } else {
          call(new Error(proxy.$LANG_TEXT("请选择周期")));
        }
      },
    },
  ],
  timeBucket: [
    {
      required: true,
      validator: testDateLine,
    },
  ],
};

// ref
const formRef = ref();
const productDialogRef = ref();

// 规格数据模板
const defaultSpec = () => ({
  dishesIds: [],
  productList: [],
});
// 规格数据
const productData = ref([
  {
    ...defaultSpec(),
    default: true,
  },
]);

// 选中套餐数据
const chooseItem = ref({});
// 打开选择商品弹窗
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
    productData.value[itemIndex].dishesIds = ids;
    productData.value[itemIndex].productList = result;
    // console.log(productData)
  });
};
const dialogCancel = () => {
  productDialogRef.value.closeDialog();
};

// 提交
const submit = async (call) => {
  // 赋值
  formData.dishes = productData.value[0].dishesIds.map((item) => {
    return {
      goodsId: item,
      type: "DISHES",
    };
  });

  if (viewId) {
    const oldData = activeDetails.value;
    const oldIds = oldData.dishesList.map((item) => item.goodsId);
    const newIds = formData.dishes.map((item) => item.goodsId);

    formData.isEditDishes = JSON.stringify(oldIds) != JSON.stringify(newIds);
    setActiveTimeLine(activeLineDate.value);
    const oldTimeLine = JSON.stringify(activeDetails.value.timeBucket);
    const newTimeLine = JSON.stringify(formData.timeBucket);
    formData.isEditTime =
      !(formData.startTime == oldData.startTime) ||
      !(formData.endTime == oldData.endTime) ||
      !(oldTimeLine == newTimeLine);
  }

  // 校验表单
  const textRes = await proxy.$testForm(call, formRef.value);

  if (!textRes) {
    return;
  }

  console.log(formData);
  const api = viewId ? "fetchEditLimitActivities" : "fetchAddLimitActivities";
  const tips = viewId ? "修改" : "添加";

  // console.log(formData)
    try {
      await activeStore[api](JSON.stringify(formData));
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

// 活动详情信息数据
const activeDetails = ref();
// 查询当前套餐信息
const getCurrProductInfo = async () => {
  try {
    const res = await activeStore.fetchGetLimitActivitiesDetails(viewId);
    const result = res.result;
    activeDetails.value = res.result;

    // 赋值
    activeDate.value = [result.startTime, result.endTime];
    activeLineDate.value = result.timeBucket.map((item) => {
      const start = item.startTime;
      const end = item.endTime;
      const currDay = new Date().toLocaleDateString().split("/").join("-");
      return [new Date(`${currDay} ${start}`), new Date(`${currDay} ${end}`)];
    });
    productData.value[0].dishesIds = result.dishesList.map(
      (item) => item.goodsId
    );
    productData.value[0].productList = result.dishesList.map((item) => {
      item.oldId = item.id;
      item.id = item.goodsId;
      return item;
    });
    setTimeout(() => {
      for (let i in formData) {
        formData[i] = result[i];
      }
    });
  } catch (err) {}
};

onMounted(() => {
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