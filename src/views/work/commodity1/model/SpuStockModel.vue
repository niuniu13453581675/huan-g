<template>
  <a-modal
    :title="title"
    :width="1600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleCancel"
    cancelText="关闭"
  >
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="是否上架">
              <a-select placeholder="请输入订单状态"  v-model="queryParam.enable">
                <a-select-option value="1">上架</a-select-option>
                <a-select-option value="0">下架</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24" >
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
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleReplen(record)">补货</a>
        </span>

      </a-table>
      <replenish-ment-model ref="ReplenishMentModel" @ok = 'modalFormOk'></replenish-ment-model>
    </div>
  </a-modal>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import ReplenishMentModel from './ReplenishMentModel';


  export default {
    name:"SpuStockModel",
    mixins:[JeecgListMixin],
    components:{
      ARow,
      ReplenishMentModel,
    },
    data(){
      return{
        description: '库存不足商品',
        shopId:"",
        title:"查看",
        visible: false,
        confirmLoading: false,
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
            title: '图片',
            align: "center",
            dataIndex: 'images',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '商品名称',
            align: "center",
            dataIndex: 'title'
          },
          {
            title: '规格',
            align: "center",
            dataIndex: 'ownSpec',
          },
          {
            title: '优惠价格',
            align: "center",
            dataIndex: 'newPrice'
          },
          {
            title: '价格',
            align: "center",
            dataIndex: 'price'
          },
          {
            title: '是否上架',
            align: "center",
            dataIndex: 'saleable',
            customRender: (text) => {
              if(text==0){
                return <span style='color: red; font-weight:bold'>未上架</span>;
              }else if(text==1){
                return <span style='color: green; font-weight:bold'>已上架</span>;
              }else {
                return text;
              }
            }
          },
          {
            title: '库存',
            align: "center",
            dataIndex: 'stock'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        //数据集
        dataSource: [],
        // 分页参数
        ipagination: {
          current: 1,
          pageSize: 30,
          pageSizeOptions: ['20', '30', '40'],
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
        selectedRowKeys: [],
        selectedRows: [],
        url: {
          list: "/kunze/menu/selectStock",
          imgerver:window._CONFIG['staticDomainURL'],
        },
      }
    },
    created(){
      this.shopId=localStorage.getItem('shopId')
    },
    methods:{
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      loadData(arg) {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件

        getAction(this.url.list, params).then((res) => {
          if (res.success) {

            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
          }
        })
      },
      handleReplen(record){
        this.$refs.ReplenishMentModel.ReplenishMent(record);
        this.$refs.ReplenishMentModel.title="补货";
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
      },
      hearderList(shopId){
        this.visible=true;
        this.shopId = shopId;
        this.loadData("1");
      },
      searchReset() {
        var that = this;
        that.queryParam = {}
        that.loadData(1);
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.shopId = this.shopId;
        return filterObj(param);
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
        console.log(sorter);
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