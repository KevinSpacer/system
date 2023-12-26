<template>
  <div>
    <!-- 表格区域 -->
    <div class="table-content">
      <!-- 按钮 -->
      <div class="tool-btn">
        <el-button type="primary" @click="openFormPopup()">{{
          $LANG_TEXT("添加打印机")
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
          <el-button size="small" @click="openFormPopup(row)">{{
            $LANG_TEXT("编辑")
          }}</el-button>
          <el-popconfirm
            @confirm="confirmDelete(row)"
            :title="`${$LANG_TEXT('确认要删除该打印机吗')}?`"
          >
            <template #reference>
              <el-button type="danger" size="small">{{
                $LANG_TEXT("删除")
              }}</el-button>
            </template>
          </el-popconfirm>
        </template>
        <template #type="{ row }">
          {{
            $LANG_TEXT(
              (printerOpts.find((d) => d.value == row.type) || {}).label
            ) || "-"
          }}
        </template>
      </ml-table>
    </div>
  </div>

  <!-- 弹窗 -->
  <ml-dialog
    ref="formDialogRef"
    class="formDialog"
    :title="$LANG_TEXT(choseItem ? '修改打印机' : '添加打印机')"
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
          <el-form-item :label="$LANG_TEXT('打印机类型')" prop="type">
            <el-select v-model="formData.type">
              <el-option
                v-for="item in printerOpts"
                :key="item.value"
                :label="$LANG_TEXT(item.label)"
                :value="item.value"
                >{{ $LANG_TEXT(item.label) }}</el-option
              >
            </el-select>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('打印机编号')}：`" prop="id">
            <el-input
              :placeholder="$LANG_TEXT('打印机编号')"
              v-model="formData.id"
            ></el-input>
          </el-form-item>

          <el-form-item :label="`${$LANG_TEXT('名称')}：`" prop="name">
            <second-input
              :placeholder="$LANG_TEXT('名称')"
              v-model:firstValue="formData.name"
              v-model:secondValue="formData.nameLanguage"
            ></second-input>
          </el-form-item>

          <!-- <el-form-item
						:label="`${$LANG_TEXT('打印模板')}：`"
						prop="printerReceiptTemplateId"
					>
						<layz-select
							:disabled="viewId != ''"
							ref="formLayzSelectRef"
							popperClass="form-select-popper"
							class="inline-block"
							:listFun="deviceStore.fetchGetPrinterReceiptTemplatePageList"
							:placeholder="$LANG_TEXT('模板')"
							:selectProps="{ labelKey: 'name', valueKey: 'id' }"
							:selectPropsSecond="{
								labelKey: 'nameLanguage',
								valueKey: 'id'
							}"
							v-model="formData.printerReceiptTemplateId"
						></layz-select>
					</el-form-item> -->
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
  getCurrentInstance,
  nextTick,
} from "vue";
import { printerTypes } from "@/utils/options";

const printerOpts = printerTypes();
import { ElMessage } from "element-plus";

const props = defineProps({
  viewId: {
    type: String,
    default: "",
  },
});

const { proxy } = getCurrentInstance();
const deviceStore = proxy.$usePiniaModule("deviceStore");

// 表格数据
const tableData = ref({});

const pageParams = reactive({
  spicesCombineId: props.viewId,
  pageNum: 1,
  pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({});

// 重置
const resetParams = (params) => {
  fetchFilterData(params);
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
    width: "80",
  },
  {
    prop: "id",
    label: "打印机编号",
    minWidth: "150",
  },
  {
    prop: "name",
    propSecond: "nameLanguage",
    label: "打印机名称",
    minWidth: "150",
  },
  {
    prop: "type",
    label: "打印机类型",
    showTemplate: true,
    minWidth: "150",
  },
  // {
  // 	prop: 'printerReceiptTemplateName',
  // 	propSecond: 'printerReceiptTemplateNameLanguage',
  // 	label: ('模板名称'),
  // 	minWidth: '170'
  // },
  {
    prop: "creationTime",
    label: "创建时间",
    minWidth: "170",
  },
  {
    prop: "btnActive",
    label: "操作",
    fixed: "right",
    showTemplate: true,
    minWidth: "170",
  },
];

// 查询表格列表数据
const getTableList = () => {
  const params = {
    ...pageParams,
    ...filterParams,
  };

  deviceStore.fetchGetPrinterPageList(params).then((res) => {
    tableData.value = res;
  });
};

// 确认删除
const confirmDelete = (item) => {
  deviceStore.fetchRemovePrinter({ id: item.id }).then((res) => {
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
const formLayzSelectRef = ref();

// 默认数据
const formDefaultData = () => ({
  id: "",
  type:"",
  name: "",
  nameLanguage: "",
  printerReceiptTemplateId: "",
});
// 表单数据
const formData = reactive(formDefaultData());
// 表单数据 校验
const formRules = reactive({
  type:[{
      message: proxy.$LANG_TEXT("请输入打印机类型"),
      required: true,
      trigger: "change",
  }],
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
  printerReceiptTemplateId: [
    {
      message: proxy.$LANG_TEXT("请选择打印模板"),
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
    // formLayzSelectRef.value.getSelectList("info");
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

      // 打印机打印机
      formData.spicesCombineId = props.viewId;
      proxy.$forceUpdate();
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

  const api = detail ? "fetchEditPrinter" : "fetchAddPrinter";
  const tips = detail ? "修改" : "添加";

  // console.log(formData);
  deviceStore[api](formData)
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