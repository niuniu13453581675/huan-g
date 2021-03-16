<template>
  <a-modal
    :title="title"
    :width="1600"
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
            <a-form-item label="订单编号">
              <a-input placeholder="请输入订单编号" v-model="queryParam.orderId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="订单状态">
              <a-select placeholder="请输入订单状态"  v-model="queryParam.status">
                <a-select-option value="1">未付款</a-select-option>
                <a-select-option value="2">已付款</a-select-option>
                <a-select-option value="3">未发货</a-select-option>
                <a-select-option value="4">已发货</a-select-option>
                <a-select-option value="5">交易成功</a-select-option>
                <a-select-option value="6">交易关闭</a-select-option>
                <a-select-option value="7">已退款</a-select-option>
                <a-select-option value="8">拒绝接单</a-select-option>
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
          <span v-if="record.status==2">
            <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">是否接单 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                     <a @click="preview(record.orderId)">接单</a>
              </a-menu-item>
              <a-menu-item>
                  <a-popconfirm title="确定拒绝接单吗?" @confirm="() => handleDelete(record.orderId)">
                    <a>拒绝</a>
                  </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          </span>
        </span>
      </a-table>
    </div>
    <order-detail ref="OrderDetail" @ok="modalFormOk"></order-detail>
  </a-modal>
</template>
<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import OrderDetail from './OrderDetail';
  import $ from 'jquery';

  export default {
    name: "OrderStatusList",
    mixins:[JeecgListMixin],
    components:{
      ARow,
      OrderDetail,
    },
    data() {
      return {
        description: '订单',
        status:"",
        shopId:"",
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
            title: '订单编号',
            align: "center",
            dataIndex: 'orderId'
          },
          {
            title: '实付金额',
            align: "center",
            dataIndex: 'payment'
          },
          {
            title: '收货人',
            align: "center",
            dataIndex: 'consigneeSex',
          },
          {
            title: '联系方式',
            align: "center",
            dataIndex: 'telphone'
          },
          {
            title: '下单时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '订单状态',
            align: "center",
            dataIndex: 'status',
            customRender: (text) => {
              if(text==1){
                return " 未付款";
              }else if(text==2){
                return <span style='color: green; font-weight:bold'>已付款</span>;
              }else if(text==3){
                return <span style='color: red;font-weight:bold'>未发货</span>;
              }else if(text==4){
                return "已发货";
              }else if(text==5){
                return "交易成功";
              }else if(text==6){
                return "交易关闭";
              }else if(text==7){
                return "已退款";
              }else if(text==8){
                return "拒绝接单";
              }else {
                return text;
              }
            }
          },
          {
            title: '交易完成时间',
            align: "center",
            dataIndex: 'endTime'
          },
          {
            title: '提货方式',
            align: "center",
            dataIndex: 'pickUp',
            customRender: (text) => {
              if(text==1){
                return "自提";
              }else if(text==2){
                return "商家配送";
              }else{
                return text;
              }
            }
          },
          {
            title: '备注',
            align: "center",
            dataIndex: 'buyerMessage'
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
          list: "/kunze/order/selectOrder",
          dayin:"/kunze/imidate/dayin",
          jiedan:"/kunze/order/selectStatus",
        },
      }
    },
    created(){
      this.shopId=localStorage.getItem('shopId')
    },
    methods:{
      loadData(arg) {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件

        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.list;
            this.ipagination.total = res.result.total;AppFileList
          }
        })
      },
      //拒接接单
      handleDelete(e){
        let param = new URLSearchParams();
        param.append('shopID',this.shopId);
        param.append('orderId' , e);
        param.append('userID' , "");
        postAction('/kunze/order/selectOrderById',param).then((res)=>{
          let amount=res.result.amountPayment - (- res.result.postFree)
          let params = new URLSearchParams();
          params.append('orderNo',res.result.orderId);
          params.append('amount' , amount);
          params.append('orderStatus',"8");
          postAction('/kunze/wechatpay/doRefund',params).then((res)=>{
            console.log(res);
            if(res.success==true){
              this.$message.success('订单成功拒绝');
              this.loadData();
            }else {
              this.$message.warning('订单拒绝失败');
              this.loadData();
            }
          }).cache((ree)=>{
            console.log(res)
          })
        })
      },
      handList(status,shopId){
        this.visible = true;
        this.status = status;
        this.shopId = shopId;
        this.loadData(1);
      },
      handleDetail(record) {
        this.$refs.OrderDetail.detail(record);
        this.$refs.OrderDetail.title = "订单详情";
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
        param.status = this.status;
        return filterObj(param);
      },
      preview(orderId){
        let params = {
          orderId:orderId,
          status:"2",
        }
        postAction(this.url.dayin,params).then((res)=>{
          if(res.success){
            this.$message.success("接单成功！");
            this.loadData();
            this.onClearSelected();
            let Data = [];
            for(let i = 0;i<res.result.commodityList.length;i++){
              let spuList = {
                spuName: res.result.commodityList[i].spuName,
                shuliang: res.result.commodityList[i].spuNum,
                je: res.result.commodityList[i].unitPrice,
                unitPriceTotle:" "+res.result.commodityList[i].unitPriceTotle,
              }
              Data.push(spuList);
            }
            let ss ={
              "ReportType": "gridreport",     /*报表类型 gridreport fastreport 为空 将默认为gridreport  */
              "ReportName": "PosTicket.grf",     /*报表文件名 POS小票 */
              "ReportVersion": 1,              /*可选。报表版本, 为空则默认1  如果本地报表的版本过低 将从 ReportUrl 地址进行下载更新*/
              //"ReportUrl": "http://111.67.202.157:9099/report/PosTicket.grf",                  /*可选。为空 将不更新本地报表 , 如果本地报表不存在可以从该地址自动下载*/
              "ReportUrl": "",                  /*可选。为空 将不更新本地报表 , 如果本地报表不存在可以从该地址自动下载*/
              "Copies": 1,                  /*可选。打印份数，支持指定打印份数。默认1份,如果为零,不打印,只返回报表生成的pdf,jpg等文件*/
              "PrinterName": "",      /*可选。指定打印机，为空的话 使用默认打印机, 请在 控制面板 -> 设备和打印机 中查看您的打印机的名称 */
              "PrintOffsetX": 0,                 /*可选。打印右偏移，单位厘米。报表的水平方向上的偏移量，向右为正，向左为负。*/
              "PrintOffsetY": 0,                /*可选。打印下偏移，单位厘米。 报表的垂直方向上的偏移量，向下为正，向上为负。*/
              "token": "aa",      /*可选。只要token值在列表中 方可打印*/
              "taskId": "1234567",     /*可选。多个打印任务同时打印时，根据该id确定返回的是哪个打印任务。 */
              "exportfilename": "",      /*可选。自定义 导出 文件名称 为空 或者 自定义名称 如 test */
              "exportfiletype": "",      /*可选。自定义 导出 文件格式 为空 或者 自定义名称 如 pdf  */

              "Parameter": '['  ///*参数，type 默认为空即可,已经在报表端设置了 备用字段
                +'{"type": "", "name": "title","value": "#哄哄到家","required": false},'
                +'{"type": "", "name": "shopName","value": "'+res.result.shopName+'","required": false},'
                +'{"type": "", "name": "shopAddress","value": "'+res.result.shopAddress+'","required": false},'
                +'{"type": "", "name": "orders","value": "'+res.result.orders+'","required": false},'
                +'{"type": "", "name": "saleNum","value": "'+res.result.saleNum+'","required": false},'
                +'{"type": "", "name": "saleSum","value": "'+res.result.saleSum+'","required": false},'
                +'{"type": "", "name": "postFree","value": "'+res.result.postFree+'","required": false},'
                +'{"type": "", "name": "practical","value": "'+res.result.practical+'","required": false},'
                +'{"type": "", "name": "pickUp","value": "'+res.result.pickUp+'","required": false},'
                +'{"type": "", "name": "shippingAddress","value": "'+res.result.distributionVo.shippingAddress+'","required": false},'
                +'{"type": "", "name": "contact","value": "'+res.result.distributionVo.contact+'","required": false},'
                +'{"type": "", "name": "call","value": "'+res.result.distributionVo.call+'","required": false},'
                +'{"type": "", "name": "buyerMessage","value": "'+res.result.buyerMessage+'","required": false},'
                +'{"type": "", "name": "priceTotle","value": "' + res.result.priceTotle + '","required": false},'
                +']',

              "Field": '['  ///*字段， type ftBlob (base64格式) ,ftString ftInteger ftBoolean, ftFloat, ftCurrency,ftDateTime,  size (ftString 设置为实际长度,其他的设置为0,例如 ftInteger ftBlob 等设置为0 )
                +'{"type": "ftString", "name": "spuName","size": 255,"required": true},'
                +'{"type": "ftString", "name": "shuliang","size": 255,"required": false},'
                +'{"type": "ftString", "name": "je","size": 255,"required": false},'
                +'{"type": "ftString", "name": "unitPriceTotle","size": 255,"required": false},'
                +']',
              "Data":JSON.stringify(Data),
            }
            var ip = "127.0.0.1";
            var port = "12345";
            $.post("http://" + ip + ":" + port + "/printreport", ss,
              function (data) {
                data = decodeURIComponent(data);
                if (data == "") {
                  alert("连接HttpPrinter失败");
                } else {
                  var obj = JSON.parse(data);
                  $.post("http://" + ip + ":" + port + "/printreport", ss,
                    function (data) {
                      data = decodeURIComponent(data);
                      if (data == "") {
                        alert("连接HttpPrinter失败");
                      } else {
                        var obj = JSON.parse(data);
                      }
                    });
                }
              });
          }
        });

      },

      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      handleCancel() {
        this.close();
      },
      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
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
    },
  }


</script>