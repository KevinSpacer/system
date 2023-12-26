<template>
  <div class="manage-box">
    <!-- 顶部单选选项卡 -->
    <div class="tab-box">
      <el-radio-group v-model="tabValue" size="large">
        <el-radio-button
          :label="item.value"
          v-for="item in tabOptions"
          :key="'tab' + item.label"
          name="value"
          >{{
            `${$LANG_TEXT(item.label)}（${$LANG_TEXT(
              goodsQuantityParams[item.quantityName]
            )}）`
          }}</el-radio-button
        >
      </el-radio-group>
    </div>

    <!-- 表格区域 -->
    <div class="table-content">
      <!-- 按钮 -->
      <div class="tool-btn">
        <el-button
          type="primary"
          @click="$navigateTo('/productManageAction')"
          >{{ $LANG_TEXT("添加菜品") }}</el-button
        >
        <el-button @click="openTemplateDialog">{{
          $LANG_TEXT("导入菜品")
        }}</el-button>

        <el-popconfirm
          v-if="chooseData.length"
          @confirm="confirmDeleteIds"
          :title="`${$LANG_TEXT('确认要删除所选菜品吗')}?`"
        >
          <template #reference>
            <el-button type="danger">
              {{ $LANG_TEXT("批量删除") }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-button type="danger" disabled v-else>
          {{ $LANG_TEXT("批量删除") }}
        </el-button>

        <div class="batch-shelves" v-if="chooseData.length">
          <el-popconfirm
            @confirm="batchPutStatus('ON_SHELVES')"
            :title="`${$LANG_TEXT('确认要上架所选菜品吗')}?`"
          >
            <template #reference>
              <el-button>
                {{ $LANG_TEXT("批量上架") }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            @confirm="batchPutStatus('OFF_SHELVES')"
            :title="`${$LANG_TEXT('确认要下架所选菜品吗')}?`"
          >
            <template #reference>
              <el-button>
                {{ $LANG_TEXT("批量下架") }}
              </el-button>
            </template>
          </el-popconfirm>
        </div>
        <div class="batch-shelves" v-else>
          <el-button disabled>{{ $LANG_TEXT("批量上架") }}</el-button>
          <el-button disabled>{{ $LANG_TEXT("批量下架") }}</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <ml-table
        @selectHand="onSelectData"
        ref="tableRef"
        :tableData="tableData"
        :templateData="templateData"
        :pageParams="pageParams"
      >
        <template #logo="{ row }">
          <div class="product-img">
            <ml-image
              :src="proxy.$previewFileUrl + row.logo"
              fit="cover"
            ></ml-image>
          </div>
        </template>
        <template #status="{ row }">
          <div>
            {{ siwtchParams[row.status] }}
          </div>
        </template>
        <template #btnActive="{ row }">
          <div class="btn-box">
            <div class="top">
              <!-- 上架 -->
              <div v-if="row.status == 'OFF_SHELVES'">
                <el-popconfirm
                  @confirm="batchPutStatus('ON_SHELVES', row.id)"
                  :title="`${$LANG_TEXT('确认要上架该菜品吗')}?`"
                >
                  <template #reference>
                    <el-button type="primary" size="small">
                      {{ $LANG_TEXT("上架") }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>

              <!-- 下架 -->
              <div v-else>
                <el-popconfirm
                  @confirm="batchPutStatus('OFF_SHELVES', row.id)"
                  :title="`${$LANG_TEXT('确认要下架该菜品吗')}?`"
                >
                  <template #reference>
                    <el-button type="danger" size="small">
                      {{ $LANG_TEXT("下架") }}
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
            <div class="bottom">
              <el-popconfirm
                @confirm="confirmDelete(row)"
                :title="`${$LANG_TEXT('确认要删除该菜品吗')}?`"
              >
                <template #reference>
                  <el-button size="small" type="danger" link>
                    {{ $LANG_TEXT("删除") }}
                  </el-button>
                </template>
              </el-popconfirm>

              <hr class="hr" />
              <el-button
                size="small"
                type="primary"
                @click="$navigateTo('/productManageAction', { viewId: row.id })"
                link
              >
                {{ $LANG_TEXT("编辑") }}
              </el-button>
            </div>
          </div>
        </template>
      </ml-table>
    </div>
  </div>

  <!-- 上传菜品模板 -->
  <ml-dialog
    width="500px"
    ref="formDialogRef"
    class="formDialog"
    :title="$LANG_TEXT('上传菜品模板')"
    @confirm="dialogConfirm"
  >
    <template #content>
      <ml-form
        ref="formRef"
        :showBtn="false"
        :model="formData"
        :rules="formRules"
      >
        <template #form>
          <el-form-item
            :label="`${$LANG_TEXT('文件')}：`"
            class="inline-block"
            prop="excelFileName"
          >
            <upload-file
              folder="EXCEL_IMPORT"
              accept=".xlsx"
              ref="uploadRef"
              v-model:fileList="fileList"
            >
              <p @click="downLoad" class="upload-tips">
                {{ $LANG_TEXT("下载模板") }}
              </p>
            </upload-file>
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>
</template>

<script setup>
import uploadFile from "@/components/upload-file.vue";
import {
  ref,
  reactive,
  watch,
  onMounted,
  computed,
  getCurrentInstance,
  nextTick,
} from "vue";

import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
const { productStore } = proxy.$usePiniaModule();

const tabOptions = [
  {
    label: "全部商品",
    value: "0",
    state: "",
    quantityName: "allCount",
  },
  {
    label: "在售商品",
    value: "1",
    state: "ON_SHELVES",
    quantityName: "onShelvesCount",
  },
  {
    label: "下架商品",
    value: "2",
    state: "OFF_SHELVES",
    quantityName: "offShelvesCount",
  },
  {
    label: "售罄商品",
    value: "3",
    state: "",
    quantityName: "sellOutCount",
  },
];

// label值
const tabValue = ref("0");
watch(
  () => tabValue.value,
  (nVal) => {
    const item = tabOptions.find((d) => d.value == nVal);
    filterParams.status = item.state;
    // 售罄
    filterParams.stockCount = nVal == "3" ? 0 : "";

    getTableList();
  }
);

// 商品数量参数
const goodsQuantityParams = reactive({
  allCount: 0,
  offShelvesCount: 0,
  onShelvesCount: 0,
  sellOutCount: 0,
});
// 商品数量
const getGoodsQuantity = async () => {
  const res = await productStore.fetchGetDishesCount();
  const result = res.result;

  for (let i in goodsQuantityParams) {
    goodsQuantityParams[i] = result[i];
  }
};

// 表格数据
const tableData = ref({});

const pageParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({
  status: "",
  stockCount: "",
});

// 重置
const resetParams = (params) => {
  fetchFilterData(params);
  // pageParams.pageNum = 1;
  // getTableList();
};
// 接收筛选栏的数据
const fetchFilterData = (params) => {
  for (let i in params) {
    filterParams[i] = params[i];
  }
  pageParams.pageNum = 1;
  getTableList();
};

watch([() => pageParams.pageNum, () => pageParams.pageSize], (nVal) => {
  getTableList();
});

// 模板数据
const templateData = [
  {
    type: "selection",
    label: "全选",
    width: "50",
  },
  {
    prop: "logo",
    label: "菜品图片",
    showTemplate: true,
    minWidth: "150",
  },
  {
    prop: "name",
    propSecond: "nameLanguage",
    label: "菜品名称",
    minWidth: "150",
  },
  {
    prop: "classifyName",
    propSecond: "classifyNameLanguage",
    label: "菜品分类",
    minWidth: "170",
  },
  {
    prop: "classifyCombineName",
    propSecond: "classifyCombineNameLanguage",
    label: "菜品组合",
    minWidth: "100",
  },
  {
    prop: "price",
    label: "价格",
    minWidth: "100",
  },
  {
    prop: "stockCount",
    label: "库存",
    minWidth: "100",
  },
  {
    prop: "",
    label: "总销量",
    minWidth: "100",
  },
  {
    prop: "status",
    label: "商品状态",
    showTemplate: true,
    minWidth: "100",
  },
  {
    prop: "creationTime",
    label: "添加时间",
    minWidth: "170",
  },
  {
    prop: "btnActive",
    label: "操作",
    fixed: "right",
    showTemplate: true,
    minWidth: "200",
  },
];

// 查询表格列表数据
const getTableList = () => {
  const params = {
    ...pageParams,
    ...filterParams,
  };

  productStore.fetchGetProductDishesPageList(params).then((res) => {
    tableData.value = res;
    // 重置
    chooseData.value = [];
  });
};

// 确认删除
const confirmDelete = (item) => {
  deleteApi(item.id);
};

// 批量删除
const confirmDeleteIds = () => {
  const ids = chooseData.value.map((item) => item.id).join(",");
  deleteApi(ids);
};

// 删除接口
const deleteApi = (ids) => {
  productStore.fetchProductDishesDelete({ ids }).then((res) => {
    ElMessage({
      type: "success",
      message: proxy.$LANG_TEXT("删除成功"),
    });
    getTableList();
  });
};

// 显示/隐藏
const siwtchParams = {
  ON_SHELVES: "上架",
  OFF_SHELVES: "下架",
};

// 批量 调用上下架接口
const batchPutStatus = (status, id) => {
  // 选中id
  const ids = id || chooseData.value.map((item) => item.id).join(",");
  const tips = siwtchParams[status];

  // console.log(status)
  productStore
    .fetchSettingBatchDishesShelvesStatus({
      status,
      ids,
    })
    .then(() => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT(tips + "成功"),
      });
      getTableList();
    });
};

// ref
const tableRef = ref();
// 打开表格加载
const openTableLoading = () => {
  tableRef.value.showLoading = true;
};

// 选择的表格数据
const chooseData = ref([]);
// 监听表格选择
const onSelectData = (res) => {
  // console.log(res)
  chooseData.value = res;
};

// 上传菜品模板
// ref
const formDialogRef = ref();
const formRef = ref();
const uploadRef = ref();

// 上传的文件
const fileList = ref([]);
watch(
  () => fileList.value,
  (nVal) => {
    const files = nVal[0] || {};
    formData.excelFileName = files.relUrl;
  }
);

// 表单
const defaultFormData = () => ({
  excelFileName: "",
});
const formData = reactive(defaultFormData());
const formRules = reactive({
  excelFileName: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请上传文件"),
    },
  ],
});

// 打开上传菜品模板窗口
const openTemplateDialog = () => {
  // 重置
  const defaultData = defaultFormData();
  for (let i in formData) {
    formData[i] = defaultData[i];
  }
  fileList.value = [];
  formDialogRef.value.openDialog();
  nextTick(() => {
    formRef.value.resetFields();
  });
};

// 确认
const dialogConfirm = async (call) => {
  const files = fileList.value[0] || {};
  formData.excelFileName = files.relUrl;

  const testResult = await proxy.$testForm(call, formRef.value);
  if (!testResult) {
    return;
  }

  try {
    await productStore.fetchImportDishes(formData).then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("导入成功"),
      });
      getTableList();
      formDialogRef.value.closeDialog();
    });
  } catch (error) {
    console.log(error);
  }
};

// 下载
const downLoad = () => {
  const { $serveIP, $prefixName } = proxy;

  proxy.$downLoadFile({
    href: $serveIP + $prefixName + `/open/excel/dishesTemplate.xlsx`,
    download: "template.xlsx",
  });
};

onMounted(() => {
  getTableList();
  getGoodsQuantity();
});

defineExpose({
  resetParams,
  fetchFilterData,
  getTableList,
  openTableLoading,
});
</script>


<style lang="scss" scoped>
.manage-box {
  .tab-box {
    padding-bottom: 20px;
  }

  .table-content {
    border: 1px solid #9e9e9e33;
    border-radius: 6px;
    overflow: hidden;

    .product-img {
      width: 50px;
      height: 50px;
      cursor: pointer;
      margin: auto;
      border-radius: 5px;
      overflow: hidden;
    }
    .tool-btn {
      padding: 5px;
      border-bottom: 1px solid #ececec;
      background-color: #f5f7fa;
      display: flex;

      .batch-shelves {
        margin-left: 12px;
      }
    }

    .btn-box {
      .bottom {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        margin-top: 10px;

        .hr {
          height: 10px;
          margin: 0 5px;
          border: 0.1px solid #0000002b;
        }
      }
    }
  }

  .formDialog {
    .upload-tips {
      font-size: 12px;
      cursor: pointer;
      color: #03a9f4;
      line-height: 20px;
    }
    .el-tree {
      width: 100%;
      .el-tree__empty-block {
        width: 100%;
      }
    }
  }
}
</style>