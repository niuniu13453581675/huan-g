<template>
  <div>

    <a-form style="max-width: 100%; margin: 0px auto 0;">
      <a-tabs :activeKey="defaultActiveKey" @change="callback" type="card" >
        <a-tab-pane tab="配送信息" key="1" style="padding-bottom: 14px">
          <a-spin :spinning="confirmLoading">
            <a-row>
              <a-col :span="12" style="padding-left: 20px;" >
                  <a-form-item
                    label="收货人姓名"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 19}"
                  >
                    <span style="font-weight: bold">{{consigneeSex}}</span>
                  <!-- <a-input disabled :value={calls} />-->
                </a-form-item>
                    </a-col>
                <a-col :span="12" style="padding-left: 20px;" >
                  <a-form-item
                    label="联系方式"
                    :labelCol="{span: 5}"
                    :wrapperCol="{span: 19}"
                  >
                    <span style="font-weight: bold">{{telphone}}</span>
                    <!--<a-input disabled prefix="￥" value="5000" />-->
                  </a-form-item>
                </a-col>
            </a-row>
            <a-row>
            <a-col :span="12" style="padding-left: 20px;" >
                <a-form-item
                label="配送地址："
                :labelCol="{span: 5}"
                :wrapperCol="{span: 19}"
                 >
                <span style="font-weight: bold">{{address}}</span>
              </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" style="padding-left: 20px;" >
                <a-form-item
                  label="留言："
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 19}"
                >
                  <span style="font-weight: bold">{{buyerMessage}}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
      <a-tabs :activeKey="defaultActiveKey" @change="callback" type="card" >
        <a-tab-pane tab="商品信息" key="1" style="padding-bottom: 14px">
          <a-spin :spinning="confirmLoading">
            <div style="margin-top: 0; height: 20px;">
              <ul>
                <li style="font-weight: bold">
                  商品总数：
                  <span>{{salesNum}}</span>
                </li>
                <li style="font-weight: bold">
                  商品总金额：
                  <span>￥{{salesSum | NumberFormat}}</span>
                </li>
                <li style="font-weight: bold">
                  配送费：
                  <span>￥{{postFee | NumberFormat}}</span>
                </li>
                <li style="font-weight: bold">
                  实付金额：
                  <span>￥{{payAmout | NumberFormat}}</span>
                </li>
<!--                <li style="font-weight: bold">
                  合计：
                  <span>￥{{priceTotle | NumberFormat}}</span>
                </li>-->
              </ul>
            </div>
            <a-card :bordered="false">
              <a-table
                ref="table"
                size="middle"
                bordered
                rowKey="id"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"

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
        <a-button type="dashed" v-show="status==2" @click="handleDelete">拒接接单</a-button>
        &nbsp;
        <a-button type="primary" v-show="status==2"  @click="nextStep(2)">确认接单</a-button>
          <a-button type="dashed" v-show="status!=2"  @click="nextStops">下一步</a-button>
          &nbsp;
          <a-button type="primary" v-show="status!=2"  @click="nextStep(1)">打印小票</a-button>
        </a-col>
      </a-row>
    </a-form>


  </div>
</template>
<script>

  import ATextarea from "ant-design-vue/es/input/TextArea";
  import ACol from "ant-design-vue/es/grid/Col";
  import {getFileAccessHttpUrl,getAction,postAction} from '@/api/manage';
  import $ from 'jquery';

  export default {
    name:"Order1",
    components: {ACol, ATextarea},
    props: {
      salesNum: {
        type:String,
        require:false
      },
      salesSum: {
        type:String,
        require:false
      },
      postFee: {
        type:String,
        require:false
      },
      payAmout: {
        type:String,
        require:false
      },
      consigneeSex: {
        type:String,
        require:false
      },
      telphone: {
        type:String,
        require:false
      },
      address: {
        type:String,
        require:false
      },
      buyerMessage: {
        type:String,
        require:false,
      },
      orderId: {
        type:String,
        require:false,
      },
       status: {
         type:String,
         require:false,
       },
      data:{
        type:Array,
        require:false,
      },
/*      priceTotle:{
        type:String,
        require:false,
      },*/
    },
    data(){
      return{
        salesNum:this.salesNum,
        salesSum:this.salesSum,
        postFee:this.postFee,
        payAmout:this.payAmout,
        consigneeSex: this.consigneeSex,
        telphone: this.telphone,
        address: this.address,
        orderId:"",
        shopId:"",
        status:this.status,
        buyerMessage: this.buyerMessage,
        disabled:"false",
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
          dayin:"/kunze/imidate/dayin",
        }
      }
    },
    created(){
     this.loads(1);
      this.shopId=localStorage.getItem('shopId')
     this.ipagination.total = this.salesNum;
    },
    watch:{
      orderId: {
        handler() {
            this.loads(1);
        },
      }
    },
    methods: {
      handleTableChange(){},
     async loads(arg){
        let {result} = await getAction(this.url.detail,{orderId:this.orderId});
        this.dataSource = result.orderSpuVos;
       this.ipagination.total = this.dataSource.length;
      },
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      nextStops (){
        if(this.status==2){
          this.$emit('nextStep',3);
        }else {
          this.$emit('nextStep');
        }
      },
      nextStep (isFlag) {
        let params = {
          orderId:this.orderId,
           status:this.status,
        }
          postAction(this.url.dayin, params).then((res) => {

            if (res.success) {
              if(isFlag==2) {
                this.$message.success("接单成功！");
                this.$emit('nextStep',"3");
              }
              let Data = [];
              for (let i = 0; i < res.result.commodityList.length; i++) {
                let spuList = {
                  spuName: res.result.commodityList[i].spuName,
                  shuliang: res.result.commodityList[i].spuNum,
                  je: res.result.commodityList[i].unitPrice,
                  unitPriceTotle: " " + res.result.commodityList[i].unitPriceTotle,
                }
                Data.push(spuList);
              }
              let ss={}
              debugger
              if(res.result.pickUp!="自提") {
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
                    + '{"type": "", "name": "Parameter1","value": "' + res.result.seat + '","required": false},'
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
              }else {
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
                    + '{"type": "", "name": "pickUp","value": "' + "在店就餐"+ '","required": false},'
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
                    if(isFlag == 2){
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
                  }
                });
            }
          });

      },
      //拒接接单
      handleDelete(){
        debugger;
        let param = new URLSearchParams();
        param.append('shopID',this.shopId);
        param.append('orderId',this.orderId);
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
              this.status = 3;
            }else {
              this.$message.warning('订单拒绝失败');
              this.loadData();
            }
          })
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
    }
  }
</script>
<style  lang="less" scoped>
  ul li{
    float: left;
    list-style-type: none;
    margin-right: 5%;
  }
</style>