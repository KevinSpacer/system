<template>
  <div>
    <!-- 表格区域 -->
    <div class="table-content">
      <!-- 按钮 -->
      <div class="tool-btn">
        <el-button @click="openTemplateDialog">{{
          $LANG_TEXT("批量导入")
        }}</el-button>
        <el-button type="primary" @click="openFormPopup()">{{
          $LANG_TEXT("添加组合")
        }}</el-button>
      </div>

      <!-- 表格 -->
      <ml-table
        ref="tableRef"
        :tableData="tableData"
        :templateData="templateData"
        :pageParams="pageParams"
      >
        <template #status="{ row }">
          <div>
            {{ $LANG_TEXT(siwtchParams[row.status]) }}
          </div>
        </template>
        <template #btnActive="{ row }">
          <el-button size="small" @click="openFormPopup(row)">{{
            $LANG_TEXT("编辑")
          }}</el-button>
          <el-button
            size="small"
            @click="$navigateTo('condimentItem', { viewId: row.id })"
            >{{ $LANG_TEXT("查看调味品") }}</el-button
          >
          <el-popconfirm
            @confirm="confirmDelete(row)"
            :title="`${$LANG_TEXT('确认要删除该组合吗')}?`"
          >
            <template #reference>
              <el-button type="danger" size="small">{{
                $LANG_TEXT("删除")
              }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </ml-table>
    </div>
  </div>

  <!-- 弹窗 -->
  <ml-dialog
    ref="formDialogRef"
    class="formDialog"
    width="600px"
    :title="$LANG_TEXT(choseItem ? '修改组合' : '添加组合')"
    @confirm="dialogConfirm"
  >
    <template #content>
      <ml-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :showBtn="false"
      >
        <template #form>
          <el-form-item :label="`${$LANG_TEXT('组合名称')}：`" prop="name">
            <second-input
              :placeholder="$LANG_TEXT('组合名称')"
              v-model:firstValue="formData.name"
              v-model:secondValue="formData.nameLanguage"
            ></second-input>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('描述')}：`"
            prop="describeLanguage"
          >
            <second-input
              type="textarea"
              :placeholder="$LANG_TEXT('描述')"
              v-model:firstValue="formData.describe"
              v-model:secondValue="formData.describeLanguage"
            ></second-input>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('是否显示')}：`">
            <ml-switch
              v-model:switch="formData.status"
              activeValue="SHOW"
              inactiveValue="HIDE"
              activeText="显示"
              inactiveText="隐藏"
            ></ml-switch>
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>

  <!-- 上传调味品模板 -->
  <ml-dialog
    width="500px"
    ref="uploadFormDialogRef"
    class="formDialog"
    :title="$LANG_TEXT('上传调味品模板')"
    @confirm="uploadDialogConfirm"
  >
    <template #content>
      <ml-form
        ref="uploadFormRef"
        :showBtn="false"
        :model="uploadFormData"
        :rules="uploadFormRules"
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
  getCurrentInstance,
  nextTick,
} from "vue";

import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
// fetchGetSystemMenuList
const condimentStore = proxy.$usePiniaModule("condimentStore");

// 表格数据
const tableData = ref({});

const pageParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({});

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
    prop: "name",
    propSecond: "nameLanguage",
    label: "组合名称",
    width: "150",
  },
  {
    prop: "describe",
    propSecond: "describeLanguage",
    label: "描述",
    minWidth: "170",
  },
  {
    prop: "status",
    label: "是否显示",
    showTemplate: true,
    minWidth: "100",
  },
  {
    prop: "spicesName",
    propSecond: "spicesNameLanguage",
    label: "调味品",
    minWidth: "170",
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
    minWidth: "300",
  },
];

// 查询表格列表数据
const getTableList = () => {
  const params = {
    ...pageParams,
    ...filterParams,
  };

  condimentStore.fetchGetSpicesCombinePageList(params).then((res) => {
    tableData.value = res;
  });
};

// 确认删除
const confirmDelete = (item) => {
  condimentStore.fetchDeleteSpicesCombine(item.id).then((res) => {
    ElMessage({
      type: "success",
      message: proxy.$LANG_TEXT("删除成功"),
    });
    getTableList();
  });
};

// 显示/隐藏
const siwtchParams = {
  SHOW: "显示",
  HIDE: "隐藏",
};

// ref
const formDialogRef = ref();
const formRef = ref();

// 默认数据
const formDefaultData = () => ({
  id: "",
  name: "",
  nameLanguage: "",
  describe: "",
  describeLanguage: "",
  status: "SHOW",
});
// 表单数据
const formData = reactive(formDefaultData());
// 表单数据 校验
const formRules = reactive({
  name: [
    {
      message: proxy.$LANG_TEXT("请输入组合名称"),
      required: true,
      trigger: "change",
    },
    {
      validator: (rules, value, call) => {
        if (formData.nameLanguage) {
          call();
        } else {
          call(new Error(proxy.$LANG_TEXT("请输入第二语言")));
        }
      },
      trigger: "change",
    },
  ],
  describeLanguage: [
    {
      validator: (rules, value, call) => {
        if (formData.describe && !value) {
          call(new Error(proxy.$LANG_TEXT("请输入第二语言")));
        } else {
          call();
        }
      },
      trigger: "change",
    },
  ],
});

const choseItem = ref();

// 打开弹窗
const openFormPopup = (item = "") => {
  formDialogRef.value.openDialog();

  nextTick(async () => {
    // 重置
    formRef.value.resetFields();
    choseItem.value = item;

    if (item) {
      for (let i in formData) {
        formData[i] = item[i];
      }
    } else {
      for (let i in formData) {
        formData[i] = formDefaultData()[i];
      }
    }
  });
};

// 弹窗确认
const dialogConfirm = async (call) => {
  const detail = choseItem.value;
  const testResult = await proxy.$testForm(call, formRef.value);
  // console.log(testResult);
  if (!testResult) {
    return;
  }

  const api = detail ? "fetchSpicesCombineEdit" : "fetchSpicesCombineAdd";
  const tips = detail ? "修改" : "添加";

  // console.log(formData);
  condimentStore[api](formData)
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT(tips + "成功"),
      });
      getTableList();
      formDialogRef.value.closeDialog();
      call();
    })
    .catch(() => {
      call();
    });
};

// ref
const tableRef = ref();
// 打开表格加载
const openTableLoading = () => {
  tableRef.value.showLoading = true;
};

// 上传调味品模板
// ref
const uploadFormDialogRef = ref();
const uploadFormRef = ref();
const uploadRef = ref();

// 上传的文件
const fileList = ref([]);
watch(
  () => fileList.value,
  (nVal) => {
    const files = nVal[0] || {};
    uploadFormData.excelFileName = files.relUrl;
  }
);

// 表单
const defaultFormData = () => ({
  excelFileName: "",
});
const uploadFormData = reactive(defaultFormData());
const uploadFormRules = reactive({
  excelFileName: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请上传文件"),
    },
  ],
});

// 打开上传调味品模板窗口
const openTemplateDialog = () => {
  // 重置
  const defaultData = defaultFormData();
  for (let i in uploadFormData) {
    uploadFormData[i] = defaultData[i];
  }
  fileList.value = [];
  uploadFormDialogRef.value.openDialog();
  nextTick(() => {
    uploadFormRef.value.resetFields();
  });
};

// 确认
const uploadDialogConfirm = async (call) => {
  const files = fileList.value[0] || {};
  uploadFormData.excelFileName = files.relUrl;

  const testResult = await proxy.$testForm(call, uploadFormRef.value);
  if (!testResult) {
    return;
  }

  try {
    await condimentStore.fetchImportSpices(uploadFormData).then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("导入成功"),
      });
      getTableList();
      uploadFormDialogRef.value.closeDialog();
    });
  } catch (error) {
    console.log(error);
  }
};

// 下载
const downLoad = () => {
  const { $serveIP, $prefixName } = proxy;
  proxy.$downLoadFile({
    href: $serveIP + $prefixName + `/open/excel/spicesTemplate.xlsx`,
    download: "template.xlsx",
  });
};

onMounted(() => {
  getTableList();
});

defineExpose({
  resetParams,
  fetchFilterData,
  getTableList,
  openTableLoading,
});
</script>


<style lang="scss" scoped>
.header-tab {
  display: grid;
  flex-direction: row;
  flex-wrap: nowrap;
  grid-template-columns: repeat(3, 100px);
  text-align: center;
  grid-template-rows: repeat(1, 40px);
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 40px;

  .tab-item {
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: 200ms;
    border-radius: 5px;

    &.active {
      background-color: #05d69d;
      color: white;
    }
  }
}

.table-content {
  border: 1px solid #9e9e9e33;
  border-radius: 6px;
  overflow: hidden;
  .tool-btn {
    padding: 5px;
    border-bottom: 1px solid #ececec;
    background-color: #f5f7fa;
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
</style>