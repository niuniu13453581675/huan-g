<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" v-if="dateFlag==1" >
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-item label="时间区间">
              <!--<a-input placeholder="请输入超市名称" v-model="queryParam.shopName"></a-input>-->
              <a-range-picker @change="onChange" />
<!--              <a-range-picker
                v-if="dateFlag==0"
                :placeholder="['起始月份', '结束月份']"
                format="YYYY-MM"
                :value="value"
                :mode="mode2"
                @panelChange="handlePanelChange2"
                @change="onChange"
              />-->
            </a-form-item>
          </a-col>

          <a-col :md="16" :sm="24" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <!-- table区域-begin -->
    <div>
<!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 总营业额 <a style="font-weight: 600">{{ totalTurnover|NumberFormat }}</a>元
      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">
      </a-table>
    </div>
  </a-modal>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import {postAction, getAction, getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';


  export default {
    name:"TurnOverList",
    components:{
      ARow,
    },
    data(){
      return{
        description:"门店销售排行榜",
        visible: false,
        confirmLoading: false,
        queryParam:{},
        title:"查看",
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '时间',
            align: "center",
            dataIndex: 'occurrenceTime',
          },
          {
            title: '手续费率',
            align: "center",
            dataIndex: 'serviceChange',
          },
          {
            title: '交易额',
            align: "center",
            dataIndex: 'payment'
          },
          {
            title:"交易完成",
            align: "center",
            dataIndex: "okPaymentTotal"
          },
          {
            title: "退款",
            align: "center",
            dataIndex: "refundPaymentTotal"
          },
          {
            title: '手续费',
            align: "center",
            dataIndex: 'serviceFee',
          },
          {
            title: '利润',
            align: "center",
            dataIndex: 'totalPayment',
          },
        ],
        //数据集
        dataSource: [],
        // 分页参数
        ipagination: {
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5','10'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc',
        },
        dateFlag:"0",
        shopId:"",
        mode1: 'time',
        mode2: ['month', 'month'],
        value: [],
        selectedRowKeys: [],
        selectedRows: [],
        startTime:"",
        endTime:"",
        url: {
          loaderboard:"/kunze/deal/queryDeal",
        },
      }
    },
    created() {
    },
    methods:{
      onChange(date, dateString) {
        this.startTime = dateString[0];
        this.endTime = dateString[1];
      },
/*      handleChange(value,dateString) {
        debugger;
        this.value = value;
        this.startTime = dateString[0];
        this.endTime = dateString[1];
      },
      handlePanelChange2(value, mode) {
        debugger;
        this.value = value;
        this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
      },*/
      loadData(arg){
      //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        getAction(this.url.loaderboard,params).then((res) => {
          if (res.success) {
            debugger;
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
          }
        })
      },
      turnList(dateFlag,shopId){
        this.visible = true;
        this.dateFlag = dateFlag;
        this.shopId = shopId;
        this.startTime = "";
        this.endTime = "";
        this.loadData()
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.shopId = this.shopId;
        param.dateFlag = this.dateFlag;
        param.startTime = this.startTime;
        param.endTime = this.endTime;
        return filterObj(param);
      },
      searchReset() {
        var that = this;
        that.queryParam = {}
        that.loadData(1);
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('ok');
        this.visible = false;
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
      },
      searchQuery(){
        this.loadData(1);
      },
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
    }
  }
</script>