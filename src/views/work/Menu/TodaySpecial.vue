<template>
  <a-card :bordered="false">
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
            <a-form-item label="状态">
              <a-select placeholder="请选择使用端"  v-model="queryParam.status">
                <a-select-option value="0">未开始</a-select-option>
                <a-select-option value="1">售卖中</a-select-option>
                <a-select-option value="2">已结束</a-select-option>
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
    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="handleBulkDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
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

        <!-- 字符串超长截取省略号显示-->
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
        <span slot="parameterRender" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>


        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
          </div>
        </template>



        <span slot="action" slot-scope="text, record">
         <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record)">
                   <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <today-special-model ref="TodaySpecialModel" @ok="modalFormOk"></today-special-model>
    <today-special-edit-model ref="TodaySpecialEditModel" @ok="modalFormOk"></today-special-edit-model>
  </a-card>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction,getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import TodaySpecialModel from './model/TodaySpecialModel';
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import TodaySpecialEditModel from './model/ToDaySpecialEditModel';

  export default {
    name:"TodaySpecial",
    mixins: [JeecgListMixin],
    components: {
      ARow,
      TodaySpecialModel,
      JEllipsis,
      TodaySpecialEditModel
    },
    data(){
      return{
        description: '特卖管理页面',
        loading: false,
        // 查询条件
        queryParam: {},
        shopId:"",
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
            dataIndex: 'title',
          },
          {
            title: '规格',
            align: "center",
            dataIndex: 'ownSpec'
          },
          {
            title: '价格',
            align: "center",
            dataIndex: 'featuresPrice'
          },
          {
            title: '库存',
            align: "center",
            dataIndex: 'featuresStock'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'featuresStatus',
            customRender: (text) => {
              if(text==0){
                return "未开始";
              }else if(text==1){
                return "售卖中";
              }else if(text==2){
                return "已结束";
              }else{
                return text;
              }
            }
          },
          {
            title: '特卖时间',
            align: "center",
            dataIndex: 'specialTime'
          },
          {
            title: '权重',
            align: "center",
            dataIndex: 'featuresWeight'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '备注',
            align: "center",
            width: 250,
            dataIndex: 'remarks',
            scopedSlots: {customRender: 'description'},
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
          list:"/kunze/features/selectFeatList",
          imgerver: window._CONFIG['staticDomainURL'],
          delete:"/kunze/features/delFeatures",
        },
      }
    },
    created() {
      this.shopId=localStorage.getItem('shopId')
      this.loadData();
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar, this.url.imgerver, "http")
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
      handleEdit(record){
        this.$refs.TodaySpecialEditModel.edit(record);
        this.$refs.TodaySpecialEditModel.title="修改特卖商品";
      },
      handleAdd(){
        this.$refs.TodaySpecialModel.add();
        this.$refs.TodaySpecialModel.title="添加特卖商品";
      },
      handleDelete:function(record){
        let that = this;
        let status = record.featuresStatus;
        if(status == 1){
          this.$message.warning("只能删除未开始或者已结束的特卖商品");
          return;
        }else {
          deleteAction(that.url.delete,{ids:record.featuresId}).then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.loadData();
              that.onClearSelected();
            }else {
              that.$message.warning(res.message);
            }
          })
        }
      },
      handleBulkDel:function(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        }else {
          var ids = "";
          var content = "是否确认删除选中数据！";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectionRows[a].featuresId + ",";
            if (this.selectionRows[a].featuresStatus == 1) {
              this.$message.warning('包含正在售卖的商品，只能删除已经结束的特卖商品！');
              return;
            }
          }
          let that = this;
          this.$confirm({
            title: "确认删除",
            content: content,
            onOk: function () {
              deleteAction(that.url.delete, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              })
            }
          })
        }
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
      },
      searchReset() {
        var that = this;
        that.queryParam = {}
        that.loadData(1);
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.shopId = this.shopId;
        param.shopType = localStorage.getItem('shopType');
        return filterObj(param);
      },
      getQueryField() {
        //TODO 字段权限控制
        var str = "id,";
        this.columns.forEach(function (value, index) {
          str += "," + value.dataIndex;
        });
        return str;
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
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