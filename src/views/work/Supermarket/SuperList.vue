<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item label="超市名称">
              <a-input placeholder="请输入超市名称" v-model="queryParam.shopName"></a-input>
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

        <template slot="avatarslot" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
          </div>
        </template>
        <!-- 字符串超长截取省略号显示-->
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
        <!-- 状态渲染模板 -->
        <template slot="customRenderStatus" slot-scope="isFlag">
          <a-tag v-if="isFlag==0" color="green">已下架</a-tag>
          <a-tag v-if="isFlag==1" color="orange">已上架</a-tag>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定上架吗?" v-if="record.isFlag==0" @confirm="() => handleUpdate(record.id,'1')">
                  <a>上架</a>
                </a-popconfirm>
                <a-popconfirm title="确定下架吗?" v-if="record.isFlag==1" @confirm="() => handleUpdate(record.id,'0')">
                  <a>下架</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->
    <super-modules ref="SuperModules" @ok = "modalFormOk"></super-modules>
  </a-card>
</template>
<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction,getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import SuperModules from  "./modules/SuperModules";
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name:"SuperList",
    mixins:[JeecgListMixin],
    components:{
      ARow,
      SuperModules,
      JEllipsis
    },
    data(){
      return{
        description: '超市管理页面',
        loading: false,
        // 查询条件
        queryParam: {},
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '超市名称',
            align:"center",
            width: 100,
            dataIndex: 'shopName',
            scopedSlots: {customRender: 'description'},
          },
          {
            title: '超市地址',
            width: 300,
            align:"center",
            dataIndex: 'addressTotal',
            scopedSlots: {customRender: 'description'},
          },
          {
            title: '图片',
            align:"center",
            dataIndex: 'image',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '营业时间',
            align:"center",
            dataIndex: 'businessHours'
          },
          {
            title: '负责人',
            align:"center",
            dataIndex: 'personCharge'
          },
          {
            title:'联系方式',
            align:"center",
            dataIndex:'telphone'
          },
          {
            title:'售后电话',
            align:"center",
            dataIndex:'afterSale'
          },
          {
            title:'身份证号码',
            align:"center",
            dataIndex:'idenitiy'
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '修改时间',
            align:"center",
            dataIndex: 'updateTime'
          },
          {
            title: '是否上架',
            align:"center",
            dataIndex: 'isFlag',
            scopedSlots: { customRender: 'customRenderStatus' },
            filterMultiple: false,
            filters: [
              { text: '已下架', value: '0' },
              { text: '已上架', value: '1' },
            ]
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
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
        url:{
          list:"/kunze/shop/list",
          delete:"/kunze/shop/delShops",
          shelves:"/kunze/shop/updateShop",
          imgerver:window._CONFIG['staticDomainURL'],
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
        debugger
        getAction(this.url.list, params).then((res) => {
          console.log(res)
          if (res.success) {
            this.dataSource = res.result.list;
            this.dataSource.forEach(e=>{
              e.arr=1
              if(e.businessType == '1'){
                e.businessType = '配送'
              }else if(e.businessType = '2'){
                e.businessType = '到店'
              }else {
                e.businessType = '都有'
              }

            })
            this.ipagination.total = res.result.total;
          }
        })
      },
      handleAdd:function(e){

        this.$refs.SuperModules.add();
        this.$refs.SuperModules.title = "新增超市信息";
      },
      handleEdit:function(record){
        console.log(record)
debugger

        let opens=[]
        console.log(record)
        if(record.shopType==2){
          record.shopType='饭店'
        }else {
          record.shopType='超市'
        }
        opens.push(record.province)
        opens.push(record.city)
        opens.push(record.area)
        this.$refs.SuperModules.edit(record);
        this.$refs.SuperModules.title = "修改超市信息";
        this.$refs.SuperModules.optionss = opens;
        console.log(opens)
      },
      handleUpdate:function(ids,isFlag){
        let that = this;
        let param = {
          id:ids,
          isFlag:isFlag
        }
        postAction(this.url.shelves,param).then((res) =>{
          if(res.success){
            if(isFlag=="1"){
              that.$message.success("上架成功");
            }else {
              that.$message.success("下架成功");
            }
            that.loadData();
            that.onClearSelected();
          }else {
            if(isFlag=="1"){
              that.$message.success("上架失败");
            }else {
              that.$message.success("下架失败");
            }
          }
        })
      },
      handleDelete:function(ids){
        let that = this;
         deleteAction(this.url.delete,{ids:ids}).then((res) =>{
           if(res.success){
             that.$message.success(res.message);
             that.loadData();
             that.onClearSelected();
           }else {
             that.$message.warning(res.message);
           }
         })
      },
      //批量删除
      batchDel:function(){
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('请选择一条记录！');
          return;
        }else {
          var ids = "";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectionRows[a].id + ",";
          }
          let that = this;
          // debugger;
          this.$confirm({
            title:"确认删除",
            content:"是否确认删除选中数据！",
            onOk:function () {
              deleteAction(that.url.delete,{ids:ids}).then((res) =>{
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
        that.queryParam = {}
        that.loadData(1);
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.isFlag = this.filters.isFlag;
        if(localStorage.getItem('shopType')==3){
          param.area = localStorage.getItem('area')
          // param.shopType = 2
        }
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
        debugger
        console.log(sorter);
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        if( filters.isFlag){
          this.filters.isFlag = filters.isFlag[0];
        }

        this.ipagination = pagination;
        this.loadData();
      },
    }

  }
</script>