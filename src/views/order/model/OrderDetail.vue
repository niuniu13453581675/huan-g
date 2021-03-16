<template>
  <a-modal
    :title="title"
    :width="1500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <div style="margin-top: 0; height: 20px;">
      <ul>
        <li style="font-weight: bold">
          订单编号：
          <span>{{orderId}}</span>
        </li>
        <li style="font-weight: bold">
          下单时间：
          <span>{{payTime}}</span>
        </li>
      </ul>
    </div>
    <a-card :bordered="false">
      <a-steps class="steps" :current="currentTab">
        <a-step title="订单" />
        <a-step title="配货" />
        <a-step title="交易完成" />
      </a-steps>
      <div class="content">
        <order1
          :consigneeSex="consigneeSex"
          :telphone = "telphone"
          :salesNum="salesNum"
          :address="address"
          :salesSum="salesSum"
          :payAmout="payAmout"
          :buyerMessage="buyerMessage"
          :orderId="orderId"
          :status="status"
          :postFee="postFee"
          :priceTotle = "priceTotle"
          v-if="currentTab === 0"
          @nextStep="nextStep"/>
          <order2
          :orderId="orderId"
          :status="status"
          v-if="currentTab === 1"
          @nextStep="nextStep"
          @prevStep="prevStep"/>
<!--        <step2 v-if="currentTab === 1" @nextStep="nextStep" @prevStep="prevStep"/>-->
        <order3
          :orderId = "orderId"
          :status="status"
          v-if="currentTab === 2"
          @prevStep="prevStep" @finish="finish"/>
<!--        <step3 v-if="currentTab === 2" @prevStep="prevStep" @finish="finish"/>-->
      </div>
    </a-card>
  </a-modal>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import {deleteAction, getAction, postAction} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import Order1 from  "./Order1";
  import Order2 from  "./Order2";
  import Order3 from  "./Order3";
  import Vue from 'vue'

  export default {
    name:"OrderDetail",
    components:{
      ARow,
      Order1,
      Order2,
      Order3
    },
    data(){
      return{
        title: "操作",
        visible: false,
        formData: {},
        model: {},
        consigneeSex:'',
        orderId:"",
        payTime:"",
        salesNum:"0",
        salesSum:"0",
        postFee:"0",
        payAmout:"0",
        telphone: "",
        address: "",
        status:"",
        priceTotle:"0",
        buyerMessage: "",
        uploadLoading:false,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        headers: {},
        currentTab: 0,
        confirmLoading: false,
        url: {
         detail:"kunze/order/selectOrderDetail",
        },
      }
    },
    created() {
      // const token = Vue.ls.get(ACCESS_TOKEN);
      // this.headers = {"X-Access-Token": token};
    },
    methods:{
      async detail(record){
        this.visible = true;
        this.orderId = record.orderId;
        this.payTime = record.createTime;
        this.telphone = record.telphone;
        this.consigneeSex = record.consigneeSex;
        debugger;
        this.status = record.status;
        let {result} = await getAction(this.url.detail,{orderId:this.orderId});
        console.log(result)
        this.address = result.distributionVo.shippingAddress;
        this.buyerMessage = result.buyerMessage;
        this.salesNum = result.saleNum;
        this.salesSum = result.saleSum;
        this.postFee = result.postFree;
        this.payAmout = result.practical;
        //this.priceTotle = result.priceTotle;
      },

      close() {
        this.$emit('ok');
        this.visible = false;
        this.fileList=[];
      },
      handleOk (){
        this.close()
        this.currentTab=0
      },
      handleCancel () {
        this.close()
        this.currentTab=0
      },
      nextStep (data) {
        if (data!=null&&data!=""&&data!=undefined) {
          this.status = data;
        }
        if (this.currentTab < 2) {
          this.currentTab += 1
        }
      },
      prevStep () {
        if (this.currentTab > 0) {
          this.currentTab -= 1
        }
      },
      finish () {
        this.currentTab = 0
      }
    }
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
  ul li{
    float: left;
    list-style-type: none;
    margin-right: 5%;
  }
</style>