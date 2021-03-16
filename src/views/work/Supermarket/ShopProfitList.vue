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
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-item label="超市名称">
              <a-input placeholder="请输入超市名称" v-model="queryParam.shopName"></a-input>
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
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 总营业额 <a style="font-weight: 600">{{ totalTurnover|NumberFormat }}</a>元
        &nbsp;
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 总抽成 <a style="font-weight: 600">{{ totalDrawing|NumberFormat }}</a>元
      </div>

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
    name:"ShopProfitList",
    components:{
      ARow,
    },
    data() {
      return {
        description:"门店销售排行榜",
        visible: false,
        confirmLoading: false,
        queryParam:{},
        totalTurnover:"0",
        totalDrawing:"0",
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
            title: '超市名称',
            align: "center",
            dataIndex: 'shopName',
          },
          {
            title: '手续费率',
            align: "center",
            dataIndex: 'charge',
            customRender: (text) => {
              return text+"%";
            }
          },
          {
            title: '营业额',
            align: "center",
            dataIndex: 'payment'
          },
          {
            title:"交易完成",
            align: "center",
            dataIndex: "okPayment"
          },
          {
            title: "退款",
            align: "center",
            dataIndex: "refundPayment"
          },
          {
            title: '抽成',
            align: "center",
            dataIndex: 'serviceCharge',
          },
        ],
        //数据集
        dataSource: [],
        // 分页参数
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10','20', '30', '40'],
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
        choiceTime:"",
        selectedRowKeys: [],
        selectedRows: [],
        url: {
          loaderboard:"/kunze/menu/loaderboard",
          imgerver:window._CONFIG['staticDomainURL'],
        },
      }
    },
    created() {
    },
    methods:{
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      loadData(arg){
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        this.totalDrawing=0;
        this.totalTurnover=0;
        var params = this.getQueryParams();//查询条件
        getAction(this.url.loaderboard,params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
            for (let i =0;i<res.result.list.length;i++){
              this.totalTurnover = parseFloat(this.totalTurnover) + parseFloat(res.result.list[i].payment);
              this.totalDrawing = parseFloat(this.totalDrawing) + parseFloat(res.result.list[i].serviceCharge);
            }
          }
        })
      },
      shopMore(choiceTime){
        this.visible = true;
        this.choiceTime = choiceTime;
        this.loadData()
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.more = "1";
        param.choiceTime = this.choiceTime;
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