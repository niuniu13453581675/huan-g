<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">


          <a-col :md="4" :sm="24">
            <a-form-item label="骑手名称">
              <a-input placeholder="请输入骑手名称"  v-model="riderName"   />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="24" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleShopList" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>


    <a-modal
      title="骑手"
      :visible="addvisiblerider"
      :confirm-loading="confirmLoadingrider"
      :width="1600"
      @ok="handleOkrider"
      @cancel="handleCancelrider"
    >

      <a-table :columns="columnsrider" :dataSource="dataSourcerider">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">确认</a>
        </span>
      </a-table>



    </a-modal>






    <!-- 操作按钮区域 -->
    <div class="table-operator">
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
        <!-- 状态渲染模板 -->
<!--        <template slot="customRenderStatus" slot-scope="settlement">-->
<!--          <a-tag v-if="settlement==0" color="green">未结算</a-tag>-->
<!--          <a-tag v-if="settlement==1" color="orange">已结算</a-tag>-->
<!--        </template>-->


<!--        &lt;!&ndash; 字符串超长截取省略号显示&ndash;&gt;-->
<!--        <span slot="description" slot-scope="text">-->
<!--          <j-ellipsis :value="text" :length="20" />-->
<!--        </span>-->

<!--        <span slot="action" slot-scope="text, record">-->
<!--          <a @click="handleEdit(record)">结算</a>-->

<!--          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>-->
<!--        </span>-->

      </a-table>
    </div>

  </a-card>
</template>
<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction,getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import JEllipsis from "@/components/jeecg/JEllipsis";


  export default {
    name:"DistrbutionList",
    components:{
      JeecgListMixin,
      ARow,
      JEllipsis,

    },
    data(){
      return{
        addvisiblerider:false,
        confirmLoadingrider:false,
        dataSourcerider:[],
        columnsrider: [
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
            title: '骑手名称',
            align:"center",
            dataIndex: 'riderName',
          },
          {
            title: '联系方式',
            align:"center",
            dataIndex: 'telphone',
          },
          {
            title: '初始密码',
            align:"center",
            dataIndex: 'password',
          },
          {
            title: '身份证号码',
            align:"center",
            dataIndex: 'idenitiy',
          },

          {
            title: '负责地区',
            align:"center",
            dataIndex: 'address',
            scopedSlots: {customRender: "description"}
          },
          {
            title: '创建时间',
            align:"center",
            dataIndex: 'createTime'
          },
          {
            title: '最后操作时间',
            align:"center",
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        riderName:"",
        description: '配送信息页面',
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
            title: '骑手名称',
            align:"center",
            dataIndex: 'riderName'
          },
          {
            title: '骑手手机号',
            align:"center",
            dataIndex: 'riderPhone'
          },
          {
            title: '结算金额',
            align:"center",
            dataIndex: 'sendPrice',
          },
          {
            title: '接单数',
            align:"center",
            dataIndex: 'orderCount',
          },

          {
            title: '结算时间',
            align:"center",
            dataIndex: 'accountTime'
          },
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
        url:{
          list:"/kunze/riders/send/queryRiderAccountHistory",
        },
      }
    },
    created() {
      this.loadData();
    },
    methods:{
      handleOkrider(){
        this.addvisiblerider=false
        this.riderName=""
      },
      handleCancelrider(){
        this.addvisiblerider=false
        this.riderName=""
      },


      handleShopList(){
        if(this.riderName!=""){
          getAction('/kunze/rider/queryRider',{pageNo:1,pageSize:1,riderName:this.riderName}).then((res)=>{

            debugger
            if(res.success==true){
              this.dataSourcerider=res.result.list
              this.riderName=""
              this.addvisiblerider=true

            }
          })
        }

      },
      // 选择骑手
      handleEdit(e){
        console.log(e)
        this.loadData(e.id)
        this.addvisiblerider=false

      },


      loadData(e) {
        //加载数据 若传入参数1则加载第一页的内容
        // if (arg === 1) {
        //   this.ipagination.current = 1;
        // }
        // var params = this.getQueryParams();//查询条件
        postAction(this.url.list, {riderAccountHistory:e,pageSize:this.ipagination.pageSize,pageNo:this.ipagination.current,area:localStorage.getItem('area') }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;
          }
        })
      },
      modalFormOkShop(data){
        debugger;
        this.shopId = data.id;
        //this.model.shopName = data.id;
        this.shopName = data.shopName;
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
      },
      searchReset() {
        var that = this;
        that.queryParam = {}
        that.loadData();
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        //param.settlement = this.filters.settlement
        param.shopId = this.shopId;
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

      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发


        this.ipagination = pagination;
        this.loadData();
      },
    }
  }
</script>