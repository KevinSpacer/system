<template>
  <div>
    <!-- 表格区域 -->
    <div class="table-content">
      <!-- 按钮 -->
      <div class="tool-btn">
        <el-button type="primary" @click="openFormPopup()">{{
          $LANG_TEXT("上传")
        }}</el-button>
      </div>

      <!-- 表格 -->
      <ml-table
        ref="tableRef"
        :tableData="tableData"
        :templateData="templateData"
        :pageParams="pageParams"
      >
        <template #name="{ row }">
          {{ $LANG_TEXT(row.name) }}
        </template>
        <template #btnActive="{ row }">
          <el-popconfirm
            @confirm="confirmDelete(row)"
            :title="`${$LANG_TEXT('确认要删除该语言包吗')}?`"
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

  <!-- 上传语言包弹窗 -->
  <ml-dialog
    width="500px"
    ref="formDialogRef"
    class="formDialog"
    :title="$LANG_TEXT('上传语言包')"
    @confirm="dialogConfirm"
  >
    <template #content>
      <ml-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :showBtn="false"
        label-width="auto"
      >
        <template #form>
          <el-form-item :label="`${$LANG_TEXT('语言名称')}：`" prop="type">
            <el-select class="inline-block" v-model="formData.type">
              <el-option
                :value="item.value"
                :label="$LANG_TEXT(item.label)"
                v-for="item in languageOptions"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="`${$LANG_TEXT('文件包')}：`"
            class="inline-block"
            prop="file"
          >
            <upload-file
              accept=".xlsx"
              folder="EXCEL_IMPORT"
              @previewFile="getFileData"
              :isRequest="true"
              ref="uploadRef"
              :uploadTips="$LANG_TEXT('请导入与翻译信息表格匹配的文件')"
              v-model:fileList="files"
            ></upload-file>
            <p class="line-tips">
              {{ $LANG_TEXT("还无模板") }}？<span
                class="download"
                @click="donwload"
                >{{ $LANG_TEXT("点击下载模板") }}</span
              >
            </p>
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>

  <!-- 处理语言包数据弹窗 -->
  <ml-dialog
    :showCancel="false"
    :showConfirm="true"
    :showClose="true"
    width="800px"
    ref="langDialogRef"
    :title="$LANG_TEXT('语言数据')"
    @confirm="closeLanguageDialog"
  >
    <template #content>
      <div class="language-box ml-scrollbar">
        <div class="loading-box" v-if="loadingState">
          <el-icon :size="25" class="is-loading"><Loading /></el-icon>
        </div>
        <div v-else>
          <div
            class="lang-item item"
            v-for="(item, index) in languageData"
            :key="'lang' + index"
          >
            <div class="key">
              <el-input v-model="item.key"></el-input>
            </div>
            <p class="bar">=</p>
            <div class="value">
              <el-input v-model="item.value"></el-input>
            </div>
          </div>
          <div class="btn-item item">
            <el-button :icon="Plus" @click="addLanguage">{{
              $LANG_TEXT("添加新词组")
            }}</el-button>
          </div>
        </div>
      </div>
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
import { Plus } from "@element-plus/icons-vue";
import uploadFile from "@/components/upload-file.vue";
import { languageOpts } from "@/utils/options";

const { proxy } = getCurrentInstance();
// fetchGetSystemMenuList
const systemStore = proxy.$usePiniaModule("systemStore");

// 国际化option
const languageOptions = languageOpts();

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
    prop: "name",
    label: "语言名字",
    showTemplate: true,
    minWidth: "150",
  },
  {
    prop: "creationTime",
    label: "上传时间",
    minWidth: "170",
  },
  {
    prop: "creatorName",
    label: "上传人员",
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

  systemStore.fetchGetInternationalLanguagePathList(params).then((res) => {
    tableData.value = res;
  });
};

// 确认删除
const confirmDelete = (item) => {
  systemStore
    .fetchRemoveInternationalLanguage({ type: item.type })
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("删除成功"),
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

// ref
const formDialogRef = ref();
const formRef = ref();
const uploadRef = ref();
const langDialogRef = ref();

// 解析出的文件数据
const languageData = ref([]);
// 文件数据
const files = ref([]);
watch(
  () => files.value.length,
  (nVal) => {
    formData.file = files.value;
    getFileData(files.value);
  }
);

// 加载状态
const loadingState = ref(false);
// 根据文件查看 文件数据
const getFileData = async (file) => {
  // console.log(file);
  if (!file.length) {
    loadingState.value = false;
    languageData.value = [];
    // proxy.$message.warning(proxy.$LANG_TEXT('暂无数据'))
    return;
  }

  loadingState.value = true;

  const [xls = {}] = file;
  // 查询导入数据
  const importLanguage = await getImportLanguageData(xls.relUrl);
  languageData.value = importLanguage;
  loadingState.value = false;

  // 废弃
  // if (!languageData.value.length) {
  // 	var reader = new FileReader()
  // 	// reader.readAsText(file, 'GB2312')
  // 	reader.readAsText(file, 'UTF-8')

  // 	reader.onerror = function () {
  // 		proxy.$message({
  // 			message: proxy.$LANG_TEXT('读取文件失败')
  // 		})
  // 		loadingState.value = false
  // 	}
  // 	reader.onload = function (e) {
  // 		const val = e.target.result
  // 		if (val) {
  // 			console.log(val)
  // 			const result = val.split('').join('')
  // 			// .replaceAll('\r\n', ',')
  // 			// console.log(result)
  // 			languageData.value = result
  // 				.split('\r\n')
  // 				.filter((item) => {
  // 					// 处理#号
  // 					if (item) {
  // 						const tipsText = item.indexOf('#')
  // 						return tipsText == -1
  // 					} else {
  // 						return false
  // 					}
  // 				})
  // 				.map((item) => {
  // 					const [key, value] = item.split('=')
  // 					return {
  // 						key,
  // 						value
  // 					}
  // 				})

  // 				loadingState.value = false
  // 		} else {
  // 			proxy.$message({
  // 				message: proxy.$LANG_TEXT('请按照模板中的格式上传')
  // 			})
  // 			loadingState.value = false
  // 		}
  // 	}
  // }else{
  // 	loadingState.value = false
  // }

  langDialogRef.value.openDialog();
};

// 查询导入语言数据
const getImportLanguageData = async (excelFileName) => {
  try {
    const res = await systemStore.fetchGetImportLanguageData({ excelFileName });
    const result = res.result;
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 关闭语言数据窗口
const closeLanguageDialog = (call) => {
  langDialogRef.value.closeDialog();
  call();
};

// 添加新词组
const addLanguage = () => {
  languageData.value.push({
    key: "",
    value: "",
  });
};

// 默认数据
const formDefaultData = () => ({
  file: "",
  type: "",
});
// 表单数据
const formData = reactive(formDefaultData());
// 表单数据 校验
const formRules = reactive({
  type: [
    {
      message: proxy.$LANG_TEXT("请选择语言名称"),
      required: true,
      trigger: "change",
    },
  ],
  file: [
    {
      message: proxy.$LANG_TEXT("请上传文件包"),
      required: true,
      trigger: "change",
    },
  ],
});

// 打开弹窗
const openFormPopup = () => {
  formDialogRef.value.openDialog();
  files.value = [];
  languageData.value = [];
  nextTick(() => {
    // 重置
    formRef.value.resetFields();

    for (let i in formData) {
      formData[i] = formDefaultData()[i];
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
  // console.log(testResult);
  const params = {
    ...formData,
    languageList: languageData.value.filter((item) => item.key && item.value),
  };

  // console.log(params);
  systemStore
    .fetchSettingInternationalLanguage(params)
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("添加成功"),
      });
      formDialogRef.value.closeDialog();
      getTableList();
      proxy.$getCurrLanguageResult();
    })
    .catch(() => {
      call();
    });
};

// 下载模板
const donwload = () => {
  const { $serveUrl, $prefix } = proxy;
  proxy.$downLoadFile({
    href: `${$serveUrl}${$prefix}/open/excel/languageTemplate.xlsx`,
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
  .el-tree {
    width: 100%;
    .el-tree__empty-block {
      width: 100%;
    }
  }
  .download {
    cursor: pointer;
    color: rgb(0, 162, 255);
  }
}

.language-box {
  max-height: 80vh;
  overflow-y: auto;
  .item {
    margin-bottom: 15px;

    button {
      width: 100%;
    }
  }
  .lang-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;

    .key,
    .value {
      width: 335px;
    }
  }

  .loading-box {
    padding: 15px;
    text-align: center;
  }
}
</style>

<style lang="scss">
.manage-box {
  .el-overlay {
    .el-overlay-dialog {
      margin: 4vh auto !important;
      display: flex;
      .el-dialog {
        margin: auto;
      }
    }
  }
}
</style>