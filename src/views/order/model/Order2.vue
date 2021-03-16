<template>
  <div>
  <a-tabs :activeKey="defaultActiveKey" @change="callback" type="card" >
    <a-tab-pane tab="商品信息" key="1" style="padding-bottom: 14px">
      <a-spin :spinning="confirmLoading">
        <a-card :bordered="false">
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
            <template slot="avatarslot" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-spin>
    </a-tab-pane>
  </a-tabs>
  <a-row>
    <a-col :span="8">
    </a-col>
    <a-col :span="8">
    </a-col>
    <a-col :span="8">
      <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>

      <a-button type="primary" v-show="status==3" @click="nextStep" style="margin-left: 20px">配货完成，开始配送</a-button>
      &nbsp;
      <a-button  v-show="status!=2"  @click="nextStops" >订单流程</a-button>
    </a-col>
  </a-row>
  </div>
</template>
<script>

  import {getFileAccessHttpUrl,getAction,postAction} from '@/api/manage';


  export default {
    name:"Order2",
    props:["orderId","status"],
    data(){
      return{
        orderId:this.orderId,
        status:this.status,
        confirmLoading: false,
        defaultActiveKey:"1",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 34 },
          sm: { span: 16 },
        },
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
            dataIndex: 'spuName'
          },
          {
            title: '规格',
            align: "center",
            dataIndex: 'owenSpan',
          },
          {
            title: '单价',
            align: "center",
            dataIndex: 'unitPrice'
          },
          {
            title: '数量',
            align: "center",
            dataIndex: 'spuNum'
          },
          {
            title: '总价',
            align: "center",
            dataIndex: 'unitPriceTotle'
          }
        ],
        //数据集
        dataSource: this.data,
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
          total: "0"
        },
        isorter: {
          column: 'createTime',
          order: 'desc',
        },
        selectedRowKeys: [],
        selectedRows: [],
        url:{
          imgerver:window._CONFIG['staticDomainURL'],
          detail:"kunze/order/selectOrderDetail",
          edit:"kunze/order/updateStatus",
        }
      }
    },
    created() {
      this.loads(1);
      this.ipagination.total = this.salesNum;
    },
    methods:{
      handleTableChange(){},
      async loads(arg){
        let {result} = await getAction(this.url.detail,{orderId:this.orderId});
        this.dataSource = result.orderSpuVos;
        this.ipagination.total = this.dataSource.length;
      },
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      prevStep() {
        this.$emit('prevStep', this.userList);
      },
      nextStops (){
        if(this.status==4){
          this.$emit('nextStep',"4");
        }else {
          this.$emit('nextStep');
        }
      },
      nextStep () {
        let params = {
           status:"4",
          orderId:this.orderId,
          distModel:localStorage.getItem('distributionModel')
        }
        postAction(this.url.edit,params).then((res) =>{
          if(res.success==true){
            this.$message.success("开始配送！");
            this.$emit('nextStep',"4")
          }else {
            this.$message.error(res.message);
          }
        })

      },
      callback: function(key){
        this.defaultActiveKey = key;
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
      },
    },
  }
</script>