<template>
  <a-card :bordered="false">
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
          <a-col :md="6" :sm="24">
            <a-form-item label="联系方式">
              <a-input placeholder="请输入联系方式" maxlength="11" v-model="queryParam.telphone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" v-if="isFlag==2">
            <a-form-item label="超市">
              <a-input placeholder="请选择超市"  :value ="shopName"  @click="handleShopList" />
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

        <!-- 状态渲染模板 -->
        <template slot="pickUp" slot-scope="pickUp">

          <template v-if="pickUp==1 && shopType==1" color="blue">自提</template>
          <template v-if="pickUp==1 && shopType==2" color="blue">到店就餐</template>
          <template v-if="pickUp==2" color="blue">商家配送</template>
          <template v-if="pickUp==3" color="blue">骑手配送</template>
        </template>
        <template slot="customRenderStatus" slot-scope="payType">
          <a-tag v-if="payType==0" color="green">微信</a-tag>
          <a-tag v-if="payType==1" color="blue">支付宝</a-tag>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetail(record)">查看</a>
<!--          handleDetail-->
          <span v-if="record.status==2">
            <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">是否接单 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                     <a @click="preview(record.orderId)">接单</a>
              </a-menu-item>
              <a-menu-item>
                  <a-popconfirm title="确定拒绝吗?" @confirm="() => handleDelete(record.orderId)">
                    <a>拒绝</a>
                  </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          </span>
          <span v-if="record.status==5">
            <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">是否退款<a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定退款吗?" @confirm="() => refund(record.orderId)">
                     <a>退款</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                    <a>拒绝</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          </span>
        </span>

      </a-table>
    </div>
    <order-detail ref="OrderDetail" @ok = "modalFormOk"></order-detail>
    <shop-list-model ref="ShopListModel" @func="modalFormOkShop"></shop-list-model>
  </a-card>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction,httpAction} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import $ from 'jquery';
  import OrderDetail from "./model/OrderDetail"
  import Utils from "../../assets/js/util"
  import 'url-search-params-polyfill'
  import ShopListModel from '../work/Supermarket/modules/ShopListModel'

  export default {
      name: "orderlist",
      mixins:[JeecgListMixin],
      components:{
        ARow,
        OrderDetail,
        ShopListModel,
        Utils
      },
      data() {
        return {
          description: '全部订单',
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
              title: '店铺',
              align: "center",
              dataIndex: 'shopName'
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
              width:100,
              dataIndex: 'consigneeSex',
            },
            {
              title: '联系方式',
              align: "center",
              dataIndex: 'telphone'
            },
            {
              title: '取货码',
              align: "center",
              dataIndex: 'pickNo',
             customRender: (text) => {
               return <span style='color: green; font-weight:bold'>{text}</span>;
              }
            },
            {
              title: '座位号',
              align: "center",
              dataIndex: 'seat',
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
              scopedSlots: {customRender: 'pickUp'},
              // customRender: (text) => {
              //   if(text==1){
              //     return "自提";
              //   }else if(text==2){
              //     return "商家配送";
              //   }else if(text==3){
              //     return "骑手配送"
              //   }else {
              //     return text;
              //   }
              // }
            },
            {
              title: '付款方式',
              align: "center",
              dataIndex: 'payType',
              scopedSlots: { customRender: 'customRenderStatus' },
              filterMultiple: false,
              filters: [
                { text: '微信', value: '0' },
                { text: '支付宝', value: '1'},
              ]
            },
            {
              title: '备注',
              width:100,
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
          dataSource:[],
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
          isFlag:"1",
          shopId:"",
          shopType:"",
          shopName:"",
          selectedRowKeys: [],
          selectedRows: [],
          url: {
            list: "/kunze/order/selectOrder",
            dayin:"/kunze/imidate/dayin",
            jiedan:"/kunze/order/selectStatus",
          },
          userId:""
        }
      },
      created(){
        let shopId =localStorage.getItem('shopId');
         this.shopType =localStorage.getItem('shopType');

        if (shopId == undefined || shopId == "" || shopId == null || shopId == "null"){
          this.isFlag = 2;
        }
        this.shopId = shopId;
        this.loadDatas();
      },
      mounted(){
        var that = this;

        Utils.$on('orderList', function (msg) {
          that.loadDatas(1,'niu');
          console.log(that.dataSource)

          // console.log('niu牛牛')
        })
      },
      methods:{
        //确定退款
        refund(e){
          console.log(e)


          let param = new URLSearchParams()
          param.append('shopID',this.shopId)
          param.append('orderId' , e)
          param.append('userID' , "")
          postAction('/kunze/order/selectOrderById',param).then((res)=>{
            let amount=res.result.amountPayment - (- res.result.postFree)
            let params = new URLSearchParams()
            params.append('orderNo',res.result.orderId);
            params.append('amount' , amount);
            params.append('orderStatus',"7");
            postAction('/kunze/wechatpay/doRefund',params).then((res)=>{
              console.log(res)
              if(res.success==true){
                this.$message.success('退款成功');
                this.loadDatas();
              }else {
                this.$message.warning('退款失败');
                this.loadDatas();
              }
            })
          })

        },
        //拒绝退款
        norefund(e){
          console.log(e)
          let orderStatus={
            status:5,
            orderId:e,
            distModel:localStorage.getItem('distributionModel')
          }
          postAction("kunze/order/updateStatus", orderStatus).then((res)=>{
            console.log(res)
          })
        },
        preview(orderId){

            let params = {
              orderId:orderId,
              status:"2",
            }
            postAction(this.url.dayin,params).then((res)=>{
              if(res.success){




                debugger
                  this.$message.success("接单成功！");
                  this.loadDatas();
                  this.onClearSelected();
                //}
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
                let ss={}
                if(res.result.pickUp=="商家配送") {
                  ss = {
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
                      + '{"type": "", "name": "title","value": "#哄哄到家","required": false},'
                      + '{"type": "", "name": "shopName","value": "' + res.result.shopName + '","required": false},'
                      + '{"type": "", "name": "shopAddress","value": "' + res.result.shopAddress + '","required": false},'
                      + '{"type": "", "name": "orders","value": "' + res.result.orders + '","required": false},'
                      + '{"type": "", "name": "saleNum","value": "' + res.result.saleNum + '","required": false},'
                      + '{"type": "", "name": "saleSum","value": "' + res.result.saleSum + '","required": false},'
                      + '{"type": "", "name": "postFree","value": "' + res.result.postFree + '","required": false},'
                      + '{"type": "", "name": "practical","value": "' + res.result.practical + '","required": false},'
                      + '{"type": "", "name": "pickUp","value": "' + res.result.pickUp + '","required": false},'
                      + '{"type": "", "name": "shippingAddress","value": "' + res.result.distributionVo.shippingAddress + '","required": false},'
                      + '{"type": "", "name": "contact","value": "' + res.result.distributionVo.contact + '","required": false},'
                      + '{"type": "", "name": "call","value": "' + res.result.distributionVo.call + '","required": false},'
                      + '{"type": "", "name": "buyerMessage","value": "' + res.result.buyerMessage + '","required": false},'
                      + '{"type": "", "name": "priceTotle","value": "' + res.result.priceTotle + '","required": false},'
                      + ']',

                    "Field": '['  ///*字段， type ftBlob (base64格式) ,ftString ftInteger ftBoolean, ftFloat, ftCurrency,ftDateTime,  size (ftString 设置为实际长度,其他的设置为0,例如 ftInteger ftBlob 等设置为0 )
                      + '{"type": "ftString", "name": "spuName","size": 255,"required": true},'
                      + '{"type": "ftString", "name": "shuliang","size": 255,"required": false},'
                      + '{"type": "ftString", "name": "je","size": 255,"required": false},'
                      + '{"type": "ftString", "name": "unitPriceTotle","size": 255,"required": false},'
                      + ']',
                    "Data": JSON.stringify(Data),
                  }
                } else if(res.result.pickUp=="骑手配送") {
                  ss = {
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
                      + '{"type": "", "name": "title","value": "#哄哄到家","required": false},'
                      + '{"type": "", "name": "shopName","value": "' + res.result.shopName + '","required": false},'
                      + '{"type": "", "name": "shopAddress","value": "' + res.result.shopAddress + '","required": false},'
                      + '{"type": "", "name": "orders","value": "' + res.result.orders + '","required": false},'
                      + '{"type": "", "name": "saleNum","value": "' + res.result.saleNum + '","required": false},'
                      + '{"type": "", "name": "saleSum","value": "' + res.result.saleSum + '","required": false},'
                      + '{"type": "", "name": "postFree","value": "' + res.result.postFree + '","required": false},'
                      + '{"type": "", "name": "practical","value": "' + res.result.practical + '","required": false},'
                      + '{"type": "", "name": "pickUp","value": "' + res.result.pickUp + '","required": false},'
                      + '{"type": "", "name": "shippingAddress","value": "' + res.result.distributionVo.shippingAddress + '","required": false},'
                      + '{"type": "", "name": "contact","value": "' + res.result.distributionVo.contact + '","required": false},'
                      + '{"type": "", "name": "call","value": "' + res.result.distributionVo.call + '","required": false},'
                      + '{"type": "", "name": "buyerMessage","value": "' + res.result.buyerMessage + '","required": false},'
                      + '{"type": "", "name": "priceTotle","value": "' + res.result.priceTotle + '","required": false},'
                      + ']',

                    "Field": '['  ///*字段， type ftBlob (base64格式) ,ftString ftInteger ftBoolean, ftFloat, ftCurrency,ftDateTime,  size (ftString 设置为实际长度,其他的设置为0,例如 ftInteger ftBlob 等设置为0 )
                      + '{"type": "ftString", "name": "spuName","size": 255,"required": true},'
                      + '{"type": "ftString", "name": "shuliang","size": 255,"required": false},'
                      + '{"type": "ftString", "name": "je","size": 255,"required": false},'
                      + '{"type": "ftString", "name": "unitPriceTotle","size": 255,"required": false},'
                      + ']',
                    "Data": JSON.stringify(Data),
                  }
                }else if(res.result.pickUp=="自提"){
                  if(res.result.shopType==2){
                  ss = {
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
                      + '{"type": "", "name": "title","value": "#哄哄到家","required": false},'
                      + '{"type": "", "name": "shopName","value": "' + res.result.shopName + '","required": false},'
                      + '{"type": "", "name": "shopAddress","value": "' + res.result.shopAddress + '","required": false},'
                      + '{"type": "", "name": "orders","value": "' + res.result.orders + '","required": false},'
                      + '{"type": "", "name": "saleNum","value": "' + res.result.saleNum + '","required": false},'
                      + '{"type": "", "name": "saleSum","value": "' + res.result.saleSum + '","required": false},'
                      + '{"type": "", "name": "postFree","value": "' + res.result.postFree + '","required": false},'
                      + '{"type": "", "name": "practical","value": "' + res.result.practical + '","required": false},'
                      + '{"type": "", "name": "pickUp","value": "' + "在店就餐" + '","required": false},'
                      + '{"type": "", "name": "Parameter1","value": "' + res.result.seat + '","required": false},'
                      + '{"type": "", "name": "shippingAddress","value": "' + "在店就餐" + '","required": false},'
                      + '{"type": "", "name": "contact","value": "' + res.result.distributionVo.contact + '","required": false},'
                      + '{"type": "", "name": "call","value": "' + res.result.distributionVo.call + '","required": false},'
                      + '{"type": "", "name": "buyerMessage","value": "' + res.result.buyerMessage + '","required": false},'
                      + '{"type": "", "name": "priceTotle","value": "' + res.result.priceTotle + '","required": false},'
                      + ']',

                    "Field": '['  ///*字段， type ftBlob (base64格式) ,ftString ftInteger ftBoolean, ftFloat, ftCurrency,ftDateTime,  size (ftString 设置为实际长度,其他的设置为0,例如 ftInteger ftBlob 等设置为0 )
                      + '{"type": "ftString", "name": "spuName","size": 255,"required": true},'
                      + '{"type": "ftString", "name": "shuliang","size": 255,"required": false},'
                      + '{"type": "ftString", "name": "je","size": 255,"required": false},'
                      + '{"type": "ftString", "name": "unitPriceTotle","size": 255,"required": false},'
                      + ']',
                    "Data": JSON.stringify(Data),
                  }
                  }else if(res.result.shopType==1){
                    ss = {
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
                        + '{"type": "", "name": "title","value": "#哄哄到家","required": false},'
                        + '{"type": "", "name": "shopName","value": "' + res.result.shopName + '","required": false},'
                        + '{"type": "", "name": "shopAddress","value": "' + res.result.shopAddress + '","required": false},'
                        + '{"type": "", "name": "orders","value": "' + res.result.orders + '","required": false},'
                        + '{"type": "", "name": "saleNum","value": "' + res.result.saleNum + '","required": false},'
                        + '{"type": "", "name": "saleSum","value": "' + res.result.saleSum + '","required": false},'
                        + '{"type": "", "name": "postFree","value": "' + res.result.postFree + '","required": false},'
                        + '{"type": "", "name": "practical","value": "' + res.result.practical + '","required": false},'
                        + '{"type": "", "name": "pickUp","value": "' + res.result.pickUp + '","required": false},'
                        // + '{"type": "", "name": "Parameter1","value": "' + res.result.seat + '","required": false},'
                        + '{"type": "", "name": "shippingAddress","value": "' + "到店自取" + '","required": false},'
                        + '{"type": "", "name": "contact","value": "' + res.result.distributionVo.contact + '","required": false},'
                        + '{"type": "", "name": "call","value": "' + res.result.distributionVo.call + '","required": false},'
                        + '{"type": "", "name": "buyerMessage","value": "' + res.result.buyerMessage + '","required": false},'
                        + '{"type": "", "name": "priceTotle","value": "' + res.result.priceTotle + '","required": false},'
                        + ']',

                      "Field": '['  ///*字段， type ftBlob (base64格式) ,ftString ftInteger ftBoolean, ftFloat, ftCurrency,ftDateTime,  size (ftString 设置为实际长度,其他的设置为0,例如 ftInteger ftBlob 等设置为0 )
                        + '{"type": "ftString", "name": "spuName","size": 255,"required": true},'
                        + '{"type": "ftString", "name": "shuliang","size": 255,"required": false},'
                        + '{"type": "ftString", "name": "je","size": 255,"required": false},'
                        + '{"type": "ftString", "name": "unitPriceTotle","size": 255,"required": false},'
                        + ']',
                      "Data": JSON.stringify(Data),
                    }
                  }
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
        handleDetail(record) {
          this.$refs.OrderDetail.detail(record);
          this.$refs.OrderDetail.title = "订单详情";
        },
        modalFormOk() {
          // 新增/修改 成功时，重载列表
          this.loadDatas();
        },
        handleCancel() {
          this.close()
        },
        close() {
          this.$emit('ok');
          this.visible = false;
        },
        handleShopList(){
          this.$refs.ShopListModel.title = "选择超市";
          this.$refs.ShopListModel.shopList();
        },
        modalFormOkShop(data){
          this.shopId = data.id;
          //this.model.shopName = data.id;
          this.shopName = data.shopName;
        },
        loadDatas(arg,n) {
          //加载数据 若传入参数1则加载第一页的内容
          if (arg === 1) {
            this.ipagination.current = 1;
          }
          var params = this.getQueryParams();//查询条件
          getAction(this.url.list, params).then((res) => {
            console.log(res.success)
            console.log(res.result.list)
            if (res.success) {
              this.dataSource = res.result.list;
              this.ipagination.total = res.result.total;
              if(n=='niu'){
                this.preview(res.result.list[0].orderId)
              }
            }
          })
        },
        //拒接接单
        handleDelete(e){
          let param = new URLSearchParams()
          param.append('shopID',this.shopId)
          param.append('orderId' , e);
          param.append('userID' , "");
          postAction('/kunze/order/selectOrderById',param).then((res)=>{
            let amount=res.result.amountPayment - (- res.result.postFree);
            let params = new URLSearchParams();
            params.append('orderNo',res.result.orderId);
            params.append('amount' , amount);
            params.append('orderStatus',"8");
            postAction('/kunze/wechatpay/doRefund',params).then((res)=>{
              if(res.success==true){
                this.$message.success('订单成功拒绝');
                this.loadDatas();
              }else {
                this.$message.warning('订单拒绝失败');
                this.loadDatas();
              }
            })
          })
        },
        searchReset() {
          var that = this;
          that.queryParam = {}
          that.loadDatas(1);
        },
        getQueryParams() {

          var param = Object.assign({}, this.queryParam, this.isorter);
          param.pageNo = this.ipagination.current;
          param.pageSize = this.ipagination.pageSize;
debugger
          if(localStorage.getItem('shopType')==3){
            param.county=localStorage.getItem('area')
            param.shopId = "";
          }else {

            param.shopId = localStorage.getItem('shopId');
          }

          console.log(param,"3232")
          return param;
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
          this.loadDatas(1);
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
          this.loadDatas();
        },
      }
    }
</script>

<style scoped>

</style>