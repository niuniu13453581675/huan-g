<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"

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

          <a-col :md="6" :sm="24" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator" style="margin-bottom: 16px;">
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-button style="margin-left: 8px" @click="batchSalable"> 批量上架 </a-button>
      </a-dropdown>
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
          <a style="cursor: pointer" @click="handleReplen(record)">上架</a>
        </span>

      </a-table>
    </div>
  </a-modal>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {postAction, getAction, getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';

  export default {
    name:"SpuNotShelfList",
    mixins:[JeecgListMixin],
    components:{
      ARow,
    },
    data(){
      return{
        description:"未上架商品列表页",
        shopId:"",
        visible: false,
        confirmLoading: false,
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
            title: '图片',
            align: "center",
            dataIndex: 'image',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '商品名称',
            align: "center",
            dataIndex: 'title'
          },
          {
            title: '分类',
            align: "center",
            dataIndex: 'cname',
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
        shopId:"",
        selectedRowKeys: [],
        selectedRows: [],
        url: {
          list: "/kunze/spu/spuList",
          imgerver:window._CONFIG['staticDomainURL'],
          spuSaleable:"/kunze/spu/updateSpuSaleable",
        },
      }
    },
    created() {
      this.shopId=localStorage.getItem('shopId')
    },
    methods:{
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      hearderList(shopId){
        this.visible=true;
        this.shopId = shopId;
        this.loadData("1");
      },
      handleReplen(record){
        let spuList=[]
        spuList.push(record.id)
        let  data = {
          saleable:'1',
          shopId:this.shopId,
          spuList:spuList
        }
        postAction(this.url.spuSaleable,data).then((res)=>{
          if(res.success){
            this.$message.success('上架成功');
            this.loadData("1")
          }else {
            this.$message.warning('上架失败 ');
          }
        })
      },
      batchSalable(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        }else {
          let spuList=[]
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            spuList.push(this.selectionRows[a].id)
          }
          let  data = {
            saleable:'1',
            shopId:this.shopId,
            spuList:spuList
          }
          let that = this;
          this.$confirm({
            title:"确认上架",
            content:"是否确认上架选中的商品！",
            onOk:function () {
              postAction(that.url.spuSaleable,data).then((res) =>{
                if(res.success){
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                }else {
                  that.$message.warning(res.message);
                }
              })
            }
          })
        }
      },
      loadData(arg){
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
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.shopId = this.shopId;
        param.saleable = "0"
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
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
    },
  }
</script>