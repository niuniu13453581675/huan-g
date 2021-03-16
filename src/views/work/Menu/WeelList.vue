<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item label="图片名称">
              <a-input placeholder="请输入图片名称" v-model="queryParam.wheelName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="图片类型">
              <a-select placeholder="请选择图片类型"  v-model="queryParam.wheelIsflag">
                <a-select-option value="0">广告</a-select-option>
                <a-select-option value="1">新商品</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="使用端">
              <a-select placeholder="请选择使用端"  v-model="queryParam.wheelPort">
                <a-select-option value="1">小程序端</a-select-option>
                <a-select-option value="2">Android端</a-select-option>
                <a-select-option value="3">IOS端</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="超市">
              <a-input placeholder="请输入超市"  :value ="shopName"  @click="handleShopList" />
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
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
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

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.wheelImages)" icon="user"/>
          </div>
        </template>

        <!-- 状态渲染模板 -->
        <template slot="customRenderStatus" slot-scope="isFlag">
          <a-tag v-if="isFlag==0" color="green">是</a-tag>
          <a-tag v-if="isFlag==1" color="orange">否</a-tag>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item  v-if="record.isFlag==0">
                  <a @click="handleDelete(record)">删除</a>
              </a-menu-item>
              <a-menu-item v-if="record.isFlag==1">
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                   <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.isFlag==1">
                  <a @click="handleIsFlagEnable(record)">启用</a>
              </a-menu-item>
              <a-menu-item v-if="record.isFlag==0">
                  <a @click="handleIsFlagClose(record)">关闭</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <weel-model ref="WeelModel" @ok="modalFormOk"></weel-model>
    <shop-list-model ref="ShopListModel" @func="modalFormOkShop"></shop-list-model>
  </a-card>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction,getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import WeelModel from './model/WeelModel';
  import ShopListModel from '../Supermarket/modules/ShopListModel';


  export default {
    name: "WeelList",
    mixins: [JeecgListMixin],
    components: {
      ARow,
      WeelModel,
      ShopListModel
    },
    data() {
      return {
        description: '轮播图管理页面',
        loading: false,
        // 查询条件
        queryParam: {},
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
            title: '图片名称',
            align: "center",
            dataIndex: 'wheelName'
          },
          {
            title: '图片',
            align: "center",
            dataIndex: 'wheelImages',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '使用端',
            align: "center",
            dataIndex: 'wheelPort',
            customRender: (text) => {
              if(text==1){
                return "小程序端";
              }else if(text==2){
                return "Android端";
              }else if(text==3){
                return "IOS端";
              }else{
                return text;
              }
            }
          },
          {
            title: '图片跳转地址',
            align: "center",
            dataIndex: 'wheelUrl',
          },
          {
            title: '图片类型',
            align: "center",
            dataIndex: 'wheelIsflag',
            customRender: (text) => {
              if(text==0){
                return "广告";
              }else if(text==1){
                return "新商品";
              }else{
                return text;
              }
            }
          },
          {
            title: '超市',
            align: "center",
            dataIndex: 'shopName'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '操作人',
            align: "center",
            dataIndex: 'updateName'
          },
          {
            title: '轮播顺序',
            align: "center",
            dataIndex: 'wheelNo'
          },
          {
            title: '是否启用',
            align: "center",
            dataIndex: 'isFlag',
            scopedSlots: { customRender: 'customRenderStatus' },
            filterMultiple: false,
            filters: [
              { text: '是', value: '0' },
              { text: '否', value: '1' },
            ]
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
        shopName:"",
        selectedRowKeys: [],
        selectedRows: [],
        url: {
          list: "/kunze/wheel/pageWheelList",
          delete: "/kunze/wheel/delWheel",
          deletes: "/kunze/wheel/delWheels",
          imgerver: window._CONFIG['staticDomainURL'],
          enable:"/kunze/wheel/updateIsFlag",
        },
      }
    },
    created() {
      this.loadData();
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
      handleShopList(){
        this.$refs.ShopListModel.title = "选择超市";
        this.$refs.ShopListModel.shopList();
      },
      modalFormOkShop(data){
        debugger;
        this.shopId = data.id;
        //this.model.shopName = data.id;
        this.shopName = data.shopName;
      },
      handleIsFlagEnable:function(record){
        let params={
            ids:record.wheelId,
            isFlag:"0",
        }
        postAction(this.url.enable,params).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.loadData(1);
          }else {
            this.$message.warning(res.message);
          }
        })
      },
      handleIsFlagClose:function(record){
        let params={
          ids:record.wheelId,
          isFlag:"1",
        }
        postAction(this.url.enable,params).then((res)=>{
          if(res.success){
            this.$message.success(res.message);
            this.loadData(1);
          }else {
            this.$message.warning(res.message);
          }
        })
      },
      handleAdd:function(){
        this.$refs.WeelModel.add();
        this.$refs.WeelModel.title = "新增轮播图";
      },
      handleEdit:function(record){
        this.$refs.WeelModel.edit(record);
        debugger
        this.$refs.WeelModel.title = "修改轮播图信息";
      },
      handleDelete:function(record){
        let that = this;
        if(record.isFlag==0){
          this.$confirm({
            title:"确认删除",
            content:"当前轮播图正在使用，是否确认删除当前轮播图！",
            onOk:function () {
              deleteAction(that.url.delete,{id:record.wheelId}).then((res)=>{
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
        }else {
          deleteAction(that.url.delete,{id:record.wheelId}).then((res)=>{
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
      //批量删除
      batchDel:function(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        }else {
          var ids = "";
          var content = "是否确认删除选中数据！";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectionRows[a].wheelId + ",";
            if( this.selectionRows[a].isFlag == 0){
              content = "包含正在使用的轮播图，是否删除！"
            }
          }
          let that = this;
          this.$confirm({
            title:"确认删除",
            content:content,
            onOk:function () {
              deleteAction(that.url.deletes,{ids:ids}).then((res) =>{
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
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
      },
      searchReset() {
        var that = this;
        that.queryParam = {};
        that.shopName = "";
        that.loadData(1);
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.shopName = this.shopName;
        param.isFlag = this.filters.isFlag;
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
        console.log(filters);
        console.log(pagination);

        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        // this.filters.isFlag = filters.isFlag[0];
        this.ipagination = pagination;
        this.loadData();
      },
    }
  }
</script>