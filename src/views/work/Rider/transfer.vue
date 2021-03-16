<template>
  <a-card title="订单转派" >
    <a-table
      :columns="columnsrider"
      :dataSource="dataSourcerider"
      :pagination="ipaginationTurn"
      @change="handleTableChangeTurn">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">确认</a>
        </span>
    </a-table>




    <a-modal
      title="选择骑手"
      :width="1600"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @ok="handleOk"
      cancelText="关闭"
    >


    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item label="骑手名称">
              <a-input placeholder="请输入骑手名称" v-model="riderName"></a-input>
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

      <!-- 字符串超长截取省略号显示-->
      <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
      <span slot="action" slot-scope="text, record">
          <a @click="send(record)">转派</a>
        </span>
    </a-table>

    </a-modal>



  </a-card>
</template>

<script>
import {deleteAction, getAction, postAction,getFileAccessHttpUrl} from '@/api/manage';
import { filterObj } from '@/utils/util'
import JEllipsis from "@/components/jeecg/JEllipsis";
import ARow from 'ant-design-vue/lib/grid/Row'
import RiderModel from '@views/work/Rider/modules/RiderModel'
export default {
name: "transfer",
  components:{

    JEllipsis,

  },
  data(){
  return{
    sendDate:"",
    confirmLoading:false,
    visible:false,
    riderName:"",
    ipagination: {
      current: 1,
      pageSize: 20,
      pageSizeOptions: ['20', '30', '40'],
      showTotal: (total, range) => {
        return range[0] + "-" + range[1] + " 共" + total + "条"
      },
      showQuickJumper: true,
      showSizeChanger: true,
      total: 0
    },
    ipaginationTurn: {
      current: 1,
      pageSize: 20,
      pageSizeOptions: ['20', '30', '40'],
      showTotal: (total, range) => {
        return range[0] + "-" + range[1] + " 共" + total + "条"
      },
      showQuickJumper: true,
      showSizeChanger: true,
      total: 0
    },
    loading: false,
    selectedRowKeys: [],
    dataSourcerider:[],
    dataSource:[],
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
        title: '订单号',
        align:"center",
        dataIndex: 'orderId',
      },
      {
        title: '创建时间',
        align:"center",
        dataIndex: 'createTime'
      },
      {
        title: '距离',
        align:"center",
        dataIndex: 'distance'
      },
      {
        title: '配送费',
        align:"center",
        dataIndex: 'sendPrice'
      },
      {
        title: '操作',
        dataIndex: 'action',
        align:"center",
        scopedSlots: { customRender: 'action' },
      }
    ],

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
        dataIndex: 'riderName',
      },
      {
        title: '联系方式',
        align:"center",
        dataIndex: 'telphone',
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
        title: '操作',
        dataIndex: 'action',
        align:"center",
        scopedSlots: { customRender: 'action' },
      }
    ],
  }
  },
  created() {
    this.loadData();
    this.riderDate();
  },
  methods:{
    send(e){
      console.log(e)
      console.log(this.sendDate)
      let riderSend={
        id:this.sendDate.id,
        oderId:this.sendDate.oderId,
        riderId:e.id,
        riderName:e.riderName,
        riderPhone:e.telphone,
        sendPrice:this.sendDate.sendPrice,
        distance:this.sendDate.distance,
        pickNo:this.sendDate.pickNo
      }

      postAction('/kunze/riders/send/updateRiderSend',riderSend ).then(res=>{
        console.log(res)
        if(res.success==true){
          this.$message.success('转派成功');
          this.visible=false
          this.loadData()
        }
      })
    },
    handleEdit(e){
      this.sendDate=e
      this.visible=true
    },
    handleCancel(){
      this.visible=false
    },
    handleOk(){
      this.visible=false
    },
    searchQuery(){
      this.riderDate(this.riderName)
    },
    searchReset(){
      this.riderDate();
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    loadData(){
      let area = ""
      if(localStorage.getItem('shopType')==3){
        area = localStorage.getItem('area')
      }
      getAction('/kunze/riders/send/querySendOrderList',{isTurn:1,pageSize:this.ipaginationTurn.pageSize,pageNo:this.ipaginationTurn.current,area:area}).then(res=>{
        console.log(res)

        this.dataSourcerider=res.result.list
        this.ipaginationTurn.total = res.result.total;
      })

    },


    riderDate(arg) {

      getAction('/kunze/rider/queryRider', {pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize,riderName:arg  }).then((res) => {
        debugger
        if (res.success) {
          this.dataSource = res.result.list;
          this.ipagination.total = res.result.total;
        }
      })
    },
    handleTableChange(pagination, filters, sorter){
      this.ipagination = pagination;
      this.riderDate()
    },
    handleTableChangeTurn(pagination, filters, sorter){
      this.ipaginationTurn = pagination;
      this.loadData()
    }

  }
}
</script>

<style scoped>

</style>