<template>
  <div>
    <div class="report-container">
      <div class="top-header">
        <p class="daterange">
          {{ currDateTime.startTime }} - {{ currDateTime.endTime }}
        </p>
      </div>

      <div class="btn">
        <ml-btn type="primary" size="large" @submit="print">{{
          $LANG_TEXT("打印")
        }}</ml-btn>
      </div>

      <div class="body" id="print-content">
        <div class="table-box">
          <div class="header">
            <div class="th">{{ $LANG_TEXT("方式") }}</div>
            <div class="th">{{ $LANG_TEXT("金额") }}</div>
            <div class="th">{{ $LANG_TEXT("订单") }}</div>
          </div>
          <div
            class="container"
            v-if="orderPayStatistics.length || orderPayStatistics.length"
          >
            <!-- 订单支付类型统计 -->

            <div v-if="orderPayStatistics.length">
              <div class="tr-box">
                <div class="tr" v-for="d in orderPayStatistics" :key="d.name">
                  <div class="td">
                    <second-language
                      :firstText="d.name"
                      :secondText="d.nameLanguage"
                    ></second-language>
                  </div>
                  <div class="td">${{ d.money }}</div>
                  <div class="td">{{ d.allCount }}</div>
                </div>
              </div>
            </div>

            <div v-if="orderPayStatistics.length">
              <div class="tr-box">
                <div class="tr" v-for="d in orderMoneyStatistics" :key="d.name">
                  <div class="td">{{ $LANG_TEXT(d.name) }}</div>
                  <div class="td">${{ d.money }}</div>
                  <div class="td">{{ d.allCount }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="empty" v-else>
            {{ $LANG_TEXT("暂无数据") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import html2canvas from "html2canvas";
import {
  ref,
  reactive,
  watch,
  onMounted,
  computed,
  getCurrentInstance,
  nextTick,
} from "vue";

const { proxy } = getCurrentInstance();
const mainStore = proxy.$usePiniaModule("mainStore");

// 表格数据
const tableData = ref({});
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
  getInit();
};

// 查询表格列表数据
const getInit = async () => {
  await getSelectOrderPayStatistics();
  await getSelectOrderMoneyStatistics();
};

// 当前时间
const currDateTime = computed(() => {
  const params = filterParams;
  const curr = Date.now();
  const startTime = params.startTime || proxy.$timeSpToDate(curr, 0);
  const endTime = params.endTime || proxy.$timeSpToDate(curr, 1);

  return {
    startTime,
    endTime,
  };
});

// 订单支付方式统计
const orderPayStatistics = ref([]);
// 查询 获取订单支付方式统计
const getSelectOrderPayStatistics = async () => {
  try {
    const res = await mainStore.fetchSelectOrderPayStatistics(
      currDateTime.value
    );
    const result = res.result;

    orderPayStatistics.value = result;
    // console.log(result);
  } catch (error) {
    // console.log(error);
  }
};

// 获取订单金额统计
const orderMoneyStatistics = ref([]);
// 查询 获取订单金额统计
const getSelectOrderMoneyStatistics = async () => {
  try {
    const res = await mainStore.fetchSelectOrderMoneyStatistics(
      currDateTime.value
    );
    const result = res.result;

    orderMoneyStatistics.value = result;
    // console.log(result);
  } catch (error) {
    // console.log(error);
  }
};

// 打印
const print = (call) => {
  const dom = document.querySelector("#print-content");
  html2canvas(dom).then((canvas) => {
    const downUrl = canvas.toDataURL("image/png", 1.0);

    const a = document.createElement("a");
    a.download = `${proxy.$timeSpToDate(Date.now())}`;
    a.href = downUrl;
    a.click();
    a.remove();
    call();
  });
};

onMounted(() => {
  getInit();
});

defineExpose({
  resetParams,
  fetchFilterData,
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

.btn{
	text-align: right;
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

.report-container {
  display: grid;
  grid-template-rows: 122px 1fr;
  .top-header {
    text-align: center;
    position: relative;
    .title {
      font-size: 55px;
      font-weight: bold;
    }
    .daterange {
      font-size: 20px;
      line-height: 50px;
    }
    .btn {
      width: auto;
      position: absolute;
      right: 30px;
      top: 20px;
      .el-button {
        width: 120px;
        height: 50px;
      }
    }
  }

  .body {
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;

    .table-box {
      width: 80%;
      flex-direction: column;
      flex-wrap: nowrap;
      display: flex;
      align-items: center;
      .header,
      .tr-box {
        border-bottom: 1px solid #c4c4c4;
        padding: 10px 0;
      }
      .header,
      .tr {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        .th {
          font-size: 25px;
        }
        .td {
          font-size: 20px;
          line-height: 50px;
        }
        > .th,
        > .td {
          &:nth-child(2) {
            text-align: center;
          }
          &:nth-child(3) {
            text-align: right;
          }
        }
      }

      .container {
        width: 100%;
        .tr-box {
          width: 100%;
        }
      }

      .empty {
        line-height: 280px;
      }
    }
  }
}
</style>