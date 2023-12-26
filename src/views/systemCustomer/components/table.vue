<template>
  <div>
    <!-- 表格区域 -->
    <div class="table-content">
      <!-- 按钮 -->
      <div class="tool-btn">
        <el-button type="primary" @click="openFormPopup()">{{
          $LANG_TEXT("添加")
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
          <el-button type="primary" size="small" @click="openFormPopup(row)">{{
            $LANG_TEXT("编辑")
          }}</el-button>

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

  <!-- 弹窗 -->
  <ml-dialog
    ref="formDialogRef"
    class="formDialog"
    :title="$LANG_TEXT('添加客户')"
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
          <el-form-item :label="`${$LANG_TEXT('姓名')}：`" prop="name">
            <el-input
              v-model="formData.name"
              :placeholder="`${$LANG_TEXT('请输入姓名')}`"
            />
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('联系方式')}：`"
            prop="contactWay"
          >
            <el-input
              mexlength="10"
              v-model="formData.contactWay"
              :placeholder="`${$LANG_TEXT('请输入联系方式')}`"
            />
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('详细地址')}：`" prop="address">
            <el-input
              v-model="formData.address"
              :placeholder="`${$LANG_TEXT('请输入详细地址')}`"
            />
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

import { ElMessage } from "element-plus";

const { proxy } = getCurrentInstance();
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
  pageParams.pageNum = 1;
  getTableList();
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
    prop: "name",
    label: "客户姓名",
    minWidth: "150",
  },
  {
    prop: "contactWay",
    label: "联系方式",
    minWidth: "200",
  },
  {
    prop: "address",
    label: "地址",
    minWidth: "200",
  },
  {
    prop: "creationTime",
    label: "添加时间",
    minWidth: "170",
  },
  {
    prop: "btnActive",
    label: "操作",
    showTemplate: true,
    minWidth: "150",
  },
];

// 查询系统用户表格列表数据
const getTableList = () => {
  const params = {
    ...pageParams,
    ...filterParams,
  };

  systemStore.fetchGetPageListClient(params).then((res) => {
    tableData.value = res;
  });
};

// 确认删除
const confirmDelete = (item) => {
  systemStore.fetchClientDelete(item.id).then((res) => {
    ElMessage({
      type: "success",
      message: proxy.$LANG_TEXT("删除成功"),
    });
    getTableList();
  });
};

// ref
const formDialogRef = ref();
const formRef = ref();

// 默认数据
const formDefaultData = () => ({
  id: "",
  name: "",
  contactWay: "",
  address: "",
});
// 表单数据
const formData = reactive(formDefaultData());
// 表单数据 校验
const formRules = reactive({
  address: [
    {
      message: proxy.$LANG_TEXT("请输入账号"),
      required: true,
      trigger: "change",
    },
  ],
  contactWay: [
    {
      message: proxy.$LANG_TEXT("请输入联系方式"),
      required: true,
      trigger: "change",
    },
    {
      validator: (rules, value, call) => {
        const val = Number(value);
        if (isNaN(val)) {
          call(new Error(proxy.$LANG_TEXT("请填写10位的数字")));
        } else {
          if (value.length > 10) {
            call();
          } else {
            call(new Error(proxy.$LANG_TEXT("请填写10位的数字")));
          }
        }
      },
    },
  ],
  name: [
    {
      message: proxy.$LANG_TEXT("请输入成员姓名"),
      required: true,
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
      proxy.$updateParams(formData, item);
    } else {
      proxy.$updateParams(formData, formDefaultData());
    }
  });
};

// 弹窗确认
const dialogConfirm = async (call) => {
  const testResult = await proxy.$testForm(call, formRef.value);
  // console.log(testResult);
  if (!testResult) {
    return;
  }

  const api = formData.id ? "fetchEditClient" : "fetchClientAdd";
  const tips = formData.id ? "修改" : "添加";
  // console.log(formData);
  systemStore[api](formData)
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT(tips + "成功"),
      });
      formDialogRef.value.closeDialog();
      choseItem.value = "";
      getTableList();
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