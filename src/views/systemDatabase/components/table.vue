<template>
  <div>
    <!-- 表格区域 -->
    <div class="table-content">
      <!-- 按钮 -->
      <div class="tool-btn">
        <el-button type="primary" @click="openDataDialog">{{
          $LANG_TEXT("导入")
        }}</el-button>
        <el-button type="primary" @click="openBackupsDialog">{{
          $LANG_TEXT("备份")
        }}</el-button>
      </div>

      <!-- 表格 -->
      <ml-table
        ref="tableRef"
        :tableData="tableData"
        :templateData="templateData"
        :pageParams="pageParams"
      >
        <template #btnActive="{ row }">
          <el-button type="danger" @click="downLoad(row)" size="small">{{
            $LANG_TEXT("下载")
          }}</el-button>

          <el-popconfirm
            @confirm="confirmResetData(row)"
            :title="`${$LANG_TEXT('确认要还原该数据库吗')}?`"
          >
            <template #reference>
              <el-button type="danger" size="small">{{
                $LANG_TEXT("还原")
              }}</el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            @confirm="confirmDelete(row)"
            :title="`${$LANG_TEXT('确认要删除该客户资料吗')}?`"
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

  <!-- 上传数据库包 -->
  <ml-dialog
    width="500px"
    ref="formDialogRef"
    class="formDialog"
    :title="$LANG_TEXT('上传数据库包')"
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
            :label="`${$LANG_TEXT('备份名称')}：`"
            prop="backupName"
          >
            <el-input
              v-model="formData.backupName"
              :placeholder="$LANG_TEXT('备份名称')"
            ></el-input>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('更新类型')}：`" prop="type">
            <el-select class="inline-block" v-model="formData.type">
              <el-option
                :value="item.value"
                :label="$LANG_TEXT(item.label)"
                v-for="item in dataUpdateOptions"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('文件包')}：`"
            class="inline-block"
            prop="name"
          >
            <upload-file
              folder="SYSTEM_SQL"
              ref="uploadRef"
              v-model:fileList="fileList"
            ></upload-file>
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>

  <!-- 备份 -->
  <ml-dialog
    width="500px"
    ref="backupsDialogRef"
    :title="$LANG_TEXT('备份')"
    @confirm="backupsDialogConfirm"
  >
    <template #content>
      <ml-form
        ref="backupsFormRef"
        :showBtn="false"
        :model="backupsFormData"
        :rules="backupsFormRules"
      >
        <template #form>
          <el-form-item
            :label="`${$LANG_TEXT('备份名称')}：`"
            prop="backupName"
          >
            <el-input
              v-model="backupsFormData.backupName"
              :placeholder="$LANG_TEXT('备份名称')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="`${$LANG_TEXT('更新类型')}：`" prop="type">
            <el-select class="inline-block" v-model="backupsFormData.type">
              <el-option
                :value="item.value"
                :label="$LANG_TEXT(item.label)"
                v-for="item in dataUpdateOptions"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  computed,
  getCurrentInstance,
  nextTick,
} from "vue";
import uploadFile from "@/components/upload-file.vue";
import { dataUpdateOpts } from "@/utils/options";

const dataUpdateOptions = dataUpdateOpts();

const { proxy } = getCurrentInstance();
// fetchGetSystemMenuList
const systemStore = proxy.$usePiniaModule("systemStore");

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
    type: "index",
    label: "序号",
    width: "100",
  },
  {
    prop: "backupName",
    label: "备份名称",
    minWidth: "170",
  },
  {
    prop: "databaseName",
    label: "数据库名称",
    minWidth: "170",
  },
  {
    prop: "version",
    label: "备份版本",
    minWidth: "120",
  },
  {
    prop: "creationTime",
    label: "备份时间",
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

// 查询系统用户表格列表数据
const getTableList = () => {
  const params = {
    ...pageParams,
    ...filterParams,
  };

  systemStore.fetchGetMysqlDatabaseBackupsPageList(params).then((res) => {
    tableData.value = res;
  });
};

// 确认删除
const confirmDelete = (item) => {
  systemStore.fetchRremoveMysqlDatabaseBackups(item.id).then((res) => {
    proxy.$message({
      type: "success",
      message: proxy.$LANG_TEXT("删除成功"),
    });
    getTableList();
  });
};

// 确认还原
const confirmResetData = (item) => {
  systemStore.fetchRestoreMysqlDatabaseBackups(item.id).then((res) => {
    proxy.$message({
      type: "success",
      message: proxy.$LANG_TEXT("还原成功"),
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

// 上传数据库包
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
    formData.name = files.relUrl;
  }
);

// 表单
const defaultFormData = () => ({
  backupName: "",
  name: "",
  type: "",
});
const formData = reactive(defaultFormData());
const formRules = reactive({
  backupName: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请填写备份名称"),
    },
  ],
  name: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请上传文件包"),
    },
  ],
  type: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请选择更新类型"),
    },
  ],
});

// 打开上传数据包窗口
const openDataDialog = () => {
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
  formData.name = files.relUrl;

  const testResult = await proxy.$testForm(call, formRef.value);
  if (!testResult) {
    return;
  }

  try {
    await systemStore.fetchImportMysqlDatabase(formData).then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("上传成功"),
      });
      getTableList();
      formDialogRef.value.closeDialog();
    });
  } catch (error) {}
};

// 下载
const downLoad = (item) => {
  proxy.$downLoadFile({
    href: proxy.$donwLoadFileUrl + item.name,
    download: item.originalName,
  });
};

// 备份
// ref
const backupsDialogRef = ref();
const backupsFormRef = ref();

// 数据
const backupsDefaultData = () => ({
  backupName: "",
  type: "",
});
const backupsFormData = reactive(backupsDefaultData());
const backupsFormRules = reactive({
  backupName: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请填写备份名称"),
    },
  ],
  type: [
    {
      trigger: "change",
      required: true,
      message: proxy.$LANG_TEXT("请选择更新类型"),
    },
  ],
});

// 打开上传数据包窗口
const openBackupsDialog = () => {
  // 重置
  formData.type = "";
  backupsDialogRef.value.openDialog();
  nextTick(() => {
    backupsFormRef.value.resetFields();
    proxy.$updateParams(backupsFormData, backupsDefaultData());
  });
};

// 确认
const backupsDialogConfirm = async (call) => {
  const testResult = await proxy.$testForm(call, backupsFormRef.value);
  if (!testResult) {
    return;
  }

  try {
    await systemStore.fetchBackupsMysqlDatabase(backupsFormData).then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("备份成功"),
      });
      getTableList();
      backupsDialogRef.value.closeDialog();
    });
  } catch (error) {
    call();
  }
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
  .el-tree {
    width: 100%;
    .el-tree__empty-block {
      width: 100%;
    }
  }
}
</style>
