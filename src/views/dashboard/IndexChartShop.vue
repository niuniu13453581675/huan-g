<template>
  <div>
    <a-row>
      <a-col  :xl="23" :lg="23" :md="23" :sm="24" :xs="24">
        <span style="font-weight: bold; font-size: 16px;display: inline-block;margin: 0 0 0 10px">平台信息数据统计<span style="font-size: 10px;color: #00A0E9">（注：平台会扣除每单 <span style="color:red;font-size: 16px">{{charge}}%</span> 的手续费）</span></span>
        <a-card style="width: 100%;" :loading="loading">
          <div style="width:100% ;height: 100%">
            <a-row>
              <a-col  style="border-right:2px solid  rgba(246, 246, 246, 1) " :xl="6" :lg="12" :md="12" :sm="24" :xs="24">
                <div class="card-item" style="float: none">
                  <a-col>
                    <div class="img" @click="handleTurn('0')">
                      <img src="@/assets/money.png" alt="" @click="mmm">
                    </div>
                    <div class="font">
                      <div class="font-item" style="line-height: 68px;">月利润</div>
                      <div class="font-item" style="line-height: 40px; font-size: 26px;">{{totalMoney | NumberFormat}} &nbsp;<span style="color: #D5D6D9;font-size: 12px">元</span> </div>
                      <div class="font-item" style="line-height: 26px;font-size: 12px; width: 150%; margin: 20px 0 0 -65%;border-top: 1px solid #E8E8E8">
                        订单交易额：<span style="font-weight:bold; color: #2eabff">{{moneyMoney | NumberFormat}}</span> 元
                        （含配送费：交易完成：<span style="font-weight: bold">{{okTotal}}</span>单<span style="color: #00DB00;font-weight: bold">{{okPayment|NumberFormat}}</span>元，退款<span style="font-weight: bold">{{refundTotal}}</span>单<span style="color: #00DB00;font-weight: bold">{{refundPayment|NumberFormat}}</span>元）；
                        <!--配送费：<span style="font-weight:bold; color: #2eabff">{{postFree | NumberFormat}}</span> 元；-->
                        手续费：<span style="font-weight:bold; color: #2eabff">{{chargeTotal | NumberFormat}}</span> 元
                      </div>
                    </div>
                  </a-col>
                </div>
              </a-col>




              <a-col  style="border-right:2px solid  rgba(246, 246, 246, 1) " :xl="6" :lg="12" :md="12" :sm="24" :xs="24">
                <div class="card-item" style="float: none">
                  <a-col>
                    <div class="img" @click="handleTurn('1')">
                      <img src="@/assets/toDay.png" alt="" @click="mmm">
                    </div>
                    <div class="font">
                      <div class="font-item" style="line-height: 68px;">日利润</div>
                      <div class="font-item" style="line-height: 40px; font-size: 26px">{{toDayTotalPrice | NumberFormat}} &nbsp;<span style="color: #D5D6D9;font-size: 12px">元</span> </div>
                      <div class="font-item" style="line-height: 26px;font-size: 12px; width: 150%; margin: 20px 0 0 -58%;border-top: 1px solid #E8E8E8">
                        订单交易额：
                        <span style="font-weight:bold; color: #2eabff">{{toDayMoney | NumberFormat}}</span>
                        元 （含配送费：交易完成：
                        <span style="font-weight: bold">{{toDayokTotal}}</span>
                        单
                        <span style="color: #00DB00;font-weight: bold">{{toDayOkPayment|NumberFormat}}</span>
                        元，退款
                        <span style="font-weight: bold">{{toDayRefundTotal}}</span>
                        单
                        <span style="color: #00DB00;font-weight: bold">{{toDayRefundPayment|NumberFormat}}</span>元）；
                        <!--配送费：<span style="font-weight:bold; color: #2eabff">{{postFree | NumberFormat}}</span> 元；-->
                        手续费：<span style="font-weight:bold; color: #2eabff">{{toDayChargeTotal | NumberFormat}}</span> 元
                      </div>
                    </div>
                  </a-col>
                </div>
              </a-col>




              <a-col :xl="6" :lg="12" :md="12" :sm="24" :xs="24" style="border-right:2px solid  rgba(246, 246, 246, 1) ">
                <div class="card-item" style="float: none">
                  <div class="img">
                    <img src="@/assets/commodity.png" alt="">
                  </div>
                  <div class="font">
                    <div class="font-item" style="line-height: 86px;">商品数量</div>
                    <div class="font-item" style="line-height: 40px;font-size: 26px">{{spuNum | NumberFormat}} &nbsp;<span style="color: #D5D6D9;font-size: 12px">件</span></div>
                  </div>
                </div>
              </a-col>
              <a-col :xl="6" :lg="12" :md="12" :sm="24" :xs="24">
                <div class="card-item" style="float: none">
                  <div class="img">
                    <img src="@/assets/dd.png" alt="">
                  </div>
                  <div class="font">
                    <div class="font-item" style="line-height: 86px;">订单数量</div>
                    <div class="font-item" style="line-height: 40px;font-size: 26px">{{orderNum | NumberFormat}} &nbsp;<span style="color: #D5D6D9;font-size: 12px">单</span></div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col  :xl="18" :lg="18" :md="18" :sm="24" :xs="24">
        <span style="font-weight: bold; font-size: 16px;display: inline-block;margin: 20px 0 0 10px">订单统计与仓库统计</span>
        <a-row>
          <a-col  :xl="11" :lg="11" :md="11" :sm="24" :xs="24">
        <a-card :loading="loading" >
          <div class="dd-box">
            <div style="width:100%;font-size:16px;font-weight:400;color:rgba(28,46,50,1);">订单统计</div>
            <div class="dd-box-item">
              <div class="dd-box-item2" style="cursor: pointer" @click="handList">
                <div class="dd-box-item2-font">
                  <span>{{pending}}</span>
                </div>
                <div class="dd-box-item2-font">
                  <span class="dian"></span><span class="font">待处理订单</span>
                </div>
              </div>
            </div>
            <div class="dd-box-item">
              <div class="dd-box-item2" style="border-right: 0;cursor: pointer" @click="handListEnd">
                <div class="dd-box-item2-font">
                  <span >{{completed}}</span>
                </div>
                <div class="dd-box-item2-font">
                  <span class="dianOk"></span><span class="font">已完成的订单</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
          </a-col>
          <a-col :span="2"></a-col>
          <a-col :xl="11" :lg="11" :md="11" :sm="24" :xs="24">
        <a-card :loading="loading" >
          <div class="dd-box">
            <div style="width:100%;font-size:16px;font-weight:400;color:rgba(28,46,50,1);">仓库统计</div>
            <div class="dd-box-item">
              <div class="dd-box-item2" style="cursor: pointer" @click="handleStock">
                <div class="dd-box-item2-font">
                  <span style="color: red;font-weight: bold">{{stock}}</span>
                </div>
                <div class="dd-box-item2-font">
                  <span class="dian"></span><span class="font">库存不足的商品</span>
                </div>
              </div>
            </div>
            <div class="dd-box-item">
              <div class="dd-box-item2" style="cursor: pointer;border-right: 0" @click="handleSpuNotShelf">
                <div class="dd-box-item2-font">
                  <span>{{notsheif}}</span>
                </div>
                <div class="dd-box-item2-font">
                  <span class="dianOk"></span><span class="font">未上架商品</span>
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
        </a-row>
        <a-row>
          <a-col :xl="17" :lg="17" :md="24" :sm="24" :xs="24">
            <span style="font-weight: bold; font-size: 16px;display: inline-block;margin: 20px 0 0 10px">最近7日</span>
            <a-card :loading="loading">
              <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
            </a-card>
          </a-col>
          <a-col :span="1"></a-col>
          <a-col :xl="6" :lg="12" :md="12" :sm="24" :xs="24">
            <span style="font-weight: bold; font-size: 16px;display: inline-block;margin: 20px 0 0 10px">快捷功能入口</span>
            <a-card :loading="loading" >
              <div style="height:78px;width:100%;margin: 19px 0 19px 40px;cursor: pointer" @click="handleSaveSpu">
                <img src="../../assets/sp.png" alt="" style="width:78px;height: 78px">
                &nbsp;
                <span>添加商品</span>
              </div>
              <div style="height:78px;width:100%;margin: 19px 0 19px 40px">
                <img src="../../assets/receiving.png" alt="" style="width:78px;height: 78px">
                &nbsp;
                <span>快速接单</span>
              </div>
              <div style="height:78px;width:100%;margin: 19px 0 19px 40px;cursor: pointer" @click="handleOrder">
                <img src="../../assets/order.png" alt="" style="width:78px;height: 78px">
                &nbsp;
                <span>订单列表</span>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="1">
      </a-col>
      <a-col  :xl="4" :lg="12" :md="12" :sm="24" :xs="24" style="height: 100%;margin-top: 20px">

        <span style="font-weight: bold; font-size: 16px;display: inline-block;margin: 0 0 0 10px">设置配送费</span>
        <a-card style="width: 100%;" :loading="loading">
<!--          <a-radio-group buttonStyle="solid" :default-value='isps' @change="isswitch">-->
            <a-button  v-if="isps==1" style="display: block">商家配送</a-button>
            <a-button  v-if="isps==2" style="display: block">骑手配送</a-button>
<!--          </a-radio-group>-->
          <div style="margin-top: 10px;font-size: 16px;font-weight: bold;display: inline-block" v-if="isps==1">当前配送费:￥{{deliveryFee}}</div>
<!--          <a-switch checked-children="自己送" un-checked-children="平台" default-checked style="display: inline-block;margin-left:5px" @change="isswitch" :checked="true" />-->
          <div style="margin: 10px 0;font-size: 16px;font-weight: bold">当前最低起送价格:￥{{starting}}</div>
          <a-input-search
            placeholder="请输入配送费"
            enter-button="确认"
            size="large"
            @search="onSearch"
            style="margin-bottom: 10px"
            v-if="isps==1"
          />
          <a-input-search
            placeholder="请输入最低起送价格"
            enter-button="确认"
            size="large"
            @search="onstarting"
          />
        </a-card>
        <div style="font-weight: bold; font-size: 16px;display: inline-block;margin: 32px 0 10px 10px">最新消息</div>
        <a-card style="width: 100%;" :loading="loading" class="mesg">
          <div style="font-size: 13px;margin-bottom: 4px" v-for="v in mesdata">
            <span style="color:#7fb5ff">【{{v.status }}】</span>
            <span style="font-size: 8px">{{v.sendEvent}}</span>
            <span style="color: #9e9e9e;font-size: 8px"> &nbsp;{{v.menutime}}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <order-status-list ref="OrderStatusList" @ok="modalFormOkOrder"></order-status-list>
    <spu-stock-model ref="SpuStockModel" @ok="modalFormOkStock"></spu-stock-model>
    <spu-not-shelf-list ref="SpuNotShelfList" @ok="modalFormOkStock"></spu-not-shelf-list>
    <turn-over-list ref="TurnOverList"></turn-over-list>
  </div>
</template>
<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import {getAction,postAction,deleteAction} from '@/api/manage'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import OrderStatusList from "../order/model/OrderStatusList"
  import SpuStockModel from "../work/commodity1/model/SpuStockModel"
  import SpuNotShelfList from "../work/commodityNR1/model/SpuNotShelfList"
  import Utils from "../../assets/js/util"
  import TurnOverList from "../work/Menu/model/TurnOverList"
  import qs from 'qs'
  import 'url-search-params-polyfill'
  export default {
    name:"IndexChartShop",
    components:{
      ChartCard,
      ACol,
      ATooltip,
      LineChartMultid,
      OrderStatusList,
      SpuStockModel,
      SpuNotShelfList,
      TurnOverList,
      Utils
    },
    data(){
      return{
        span:8,
        loading: true,
        charge:"0", //手续费率
        chargeTotal:"0", //手续费
        moneyMoney:"0",//月订单交易额
        totalMoney:"0", //月交易总额
        okPayment:"0",//月交易成功交易额
        okTotal:"0", //月交易成功订单数
        refundPayment:"0", //月订单退款额度
        refundTotal:"0", //月退款订单数
        toDayMoney:"0", //当日交易额
        toDayOkPayment:"0", /**当日成功交易*/
        toDayRefundPayment:"0", /**当日退款金额*/
        toDayokTotal:"0", /**当日交易成功订单数*/
        toDayRefundTotal:"0",  /**当日退款订单数*/
        toDayChargeTotal:"0",/**当日手续费*/
        toDayTotalPrice:"0", /**当日盈利*/
        orderNum:"0",
        spuNum:"0",
        pending:"0",
        completed:"0",
        stock:"0",
        notsheif:"0",
        shopId:"",
        deliveryFee:"",
        starting:'',
        visitFields:['成交量'],
        visitInfo:[
          {成交量: 2,
            type: "02-11",
            },
          {成交量: 4,
            type: "03-11",
            },
          {成交量: 6,
            type: "04-11",
            },
          {成交量: 8,
            type: "05-11",
            },
        ],
        mesdata:[],
        isps:'',
        url:{
          selectInfo:"/kunze/menu/selectInfo",
          selectOrder:"/kunze/menu/selectOrderstatistics",
          selectStock:"/kunze/menu/selectWarehouseStatistics",
          selectSeven:"/kunze/menu/selectSevenDeal",
          selectNews:"/kunze/menu/queryOrderRecordTotal",
        },
        indicator: <a-icon type="loading" style="font-size: 24px" spin />


      }
    },
    created(){
      this.timer();
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000);
      let shopId=localStorage.getItem('shopId');
      this.shopId = shopId;
      setTimeout(() => {
        this.loaders(shopId);
        this.loaderOrder(shopId);
      }, 500);
      setTimeout(() => {
        this.loaderStock(shopId);
        this.loaderSevenDeal(shopId);
        this.loadDateNews(shopId);
      }, 500);

    },
    mounted(){
      let that = this;
      Utils.$on('indexShop', function (msg) {
          this.loaderOrder(that.shopId);
          this.loadDateNews(that.shopId);
      });
    },
    methods:{
      isswitch(e){

        this.isps=e.target.value
        let jsonObject={}
        if(this.isps==1){
          jsonObject ={
            shopId:localStorage.getItem('shopId'),
            postFee:0,
            distModel:this.isps
          }
          postAction('/kunze/shop/editShopDist',jsonObject).then((res)=>{
            console.log(res)
            if(res.success){
              this.queryonSearch()
              this.$message.success('配送方式修改成功');
              localStorage.setItem('distributionModel','1')
            }else {
              this.$message.error('配送方式修改失败');
            }

          })
        }else if (localStorage.getItem('area') == '140428') {

          jsonObject = {
            shopId: localStorage.getItem('shopId'),
            postFee: '',
            distModel: this.isps
          }
          postAction('/kunze/shop/editShopDist', jsonObject).then((res) => {
            console.log(res)
            if (res.success) {
              this.queryonSearch()
              localStorage.setItem('distributionModel', '2')
              this.$message.success('配送方式修改成功')
            } else {
              this.$message.error('配送方式修改失败')
            }

          })
        } else {
          this.$message.error('暂未开通骑手服务')
        }

      },
      //查询配送费
      queryonSearch(){
        let param = new URLSearchParams()
        param.append('shopId',this.shopId)
        deleteAction('/kunze/shop/selectShopInfoById',param).then((res)=>{
          console.log(res)
          // debugger
          if(res.success){
            this.isps=res.result[0].distributionModel
            this.deliveryFee=((res.result[0].postFree)/100).toFixed(2)
            if(res.result[0].minPrice && res.result[0].minPrice!=null){
              this.starting=((res.result[0].minPrice)/100).toFixed(2)
            }else {
              this.starting=0
            }

          }
        })


      },
      //查询最新消息
      loadDateNews(shopId){
        getAction(this.url.selectNews,{shopId:shopId,pageNo:"1",pageSize:"10"}).then((res)=>{
          if(res.success){
            this.mesdata = res.result.list;
          }
        })
      },
      //点击设置配送费
      onSearch(e){
        console.log(e)
        let jsonObject ={
          shopId:localStorage.getItem('shopId'),
          postFee:e,
          distModel:this.isps
        }
        console.log(jsonObject)
        postAction('/kunze/shop/editShopDist',jsonObject).then((res)=>{
          console.log(res)
          if(res.success){
            this.queryonSearch()
            this.$message.success('配送费修改成功');
          }else {
            this.$message.error('配送费修改失败');
          }

        })
      },
      //点击设置最低起送价格
      onstarting(e){
        let updateShop={
          minPrice:e,
          id:this.shopId
        }
        postAction('/kunze/shop/updateShop',updateShop).then((res)=>{
          if(res.success){
            this.queryonSearch()
            this.$message.success('最低起送价格修改成功');
          }else {
            this.$message.error('最低起送价格修改失败');
          }

        })
      },
      mmm(){
       let winWidth = window.innerWidth;
      },
      handleTurn(dateFlag){
        let title = "月历史交易清单";
        if(dateFlag == 1){
          title = "日历史交易清单";
        }
        this.$refs.TurnOverList.turnList(dateFlag,this.shopId);
        this.$refs.TurnOverList.title = title;
      },
      modalFormOkOrder(){
        this.loaders(this.shopId);
      },
      modalFormOkStock(){
        this.loaderStock(this.shopId);
      },
      //定时任务，10秒刷新一次数据
      timer(){
        return setInterval(()=>{
          setTimeout(() => {
            this.loaders(this.shopId);
            this.loaderOrder(this.shopId);
          }, 500);
          setTimeout(() => {
            this.loaderStock(this.shopId);
            this.loaderSevenDeal(this.shopId);
          }, 500);
        },10000)
      },
      loaders(shopId){
        let params = {
          shopId:shopId,
        }
        getAction(this.url.selectInfo,params).then((res) => {
            if(res.success){
              this.moneyMoney = res.result.moneyMoney; //月交易额(包含退款)
              //this.postFree = res.result.moneyPostfree; //月配送费
              this.totalMoney = res.result.totalMoney; //月总交易额
              this.okPayment = res.result.okPayment; //月交易成功交易额
              this.okTotal = res.result.okTotal; //月交易成功订单数
              this.refundPayment = res.result.refundPayment; //月订单退款额度
              this.refundTotal = res.result.refundTotal;//月退款订单数
              this.charge = res.result.charge;//手续费率
              this.chargeTotal = res.result.chargeTotal; //月手续费
              this.toDayMoney = res.result.toDayMoney; //当日交易额
              this.toDayOkPayment = res.result.toDayOkPayment; /**当日成功交易*/
              this.toDayRefundPayment = res.result.toDayRefundPayment; /**当日退款金额*/
              this.toDayokTotal = res.result.toDayokTotal; /**当日交易成功订单数*/
              this.toDayRefundTotal = res.result.toDayRefundTotal;  /**当日退款订单数*/
              this.toDayChargeTotal = res.result.toDayChargeTotal;/**当日手续费*/
              this.toDayTotalPrice = res.result.toDayTotalPrice; /**当日盈利*/
              this.orderNum = res.result.orderNum;
              this.spuNum = res.result.spuNum;
            }
        })
      },
      handList(){
        this.$refs.OrderStatusList.handList("2",this.shopId);
        this.$refs.OrderStatusList.title = "待处理订单";
      },
      handListEnd(){
        this.$refs.OrderStatusList.handList("5",this.shopId);
        this.$refs.OrderStatusList.title = "已完成订单";
      },
      handleStock(){
        this.$refs.SpuStockModel.hearderList(this.shopId);
        this.$refs.SpuStockModel.title = "库存不足商品";
      },
      handleSpuNotShelf(){
        this.$refs.SpuNotShelfList.hearderList(this.shopId);
        this.$refs.SpuNotShelfList.title = "未上架商品";
      },
      handleSaveSpu(){
        this.$router.push({name:'work-commodityNR1-addcommodity',params:{}})
      },
      handleOrder(){
        this.$router.push({name:'order-orderlist',params:{}})
      },
      loaderOrder(shopId){
        let params = {
          shopId:shopId,
        }
        getAction(this.url.selectOrder,params).then((res) => {
          if(res.success){
              this.pending = res.result.pending;
              this.completed = res.result.completed;
          }
        })
      },
      loaderStock(shopId){
        let params = {
          shopId:shopId,
        }
        getAction(this.url.selectStock,params).then((res) => {
          if(res.success){
            this.notsheif = res.result.notsheif;
            this.stock = res.result.stock;
          }
        })
      },
      loaderSevenDeal(shopId){
        let params = {
          shopId:shopId
        }
        getAction(this.url.selectSeven,params).then((res) => {
          this.visitInfo = [];
          if(res.success){
              for(let i = 0;i<res.result.length;i++){
                 let result = {
                   "成交量":res.result[res.result.length-(i+1)].count,
                   "type":res.result[res.result.length-(i+1)].clickDate
                 }
                  this.visitInfo.push(result);
              }
          }
        })
      }
    },
    mounted () {
        this.queryonSearch()
    }
    // mounted () {
    //   let that = this
    //   window.onresize = () => {
    //     return (() => {
    //       window.screenWidth = window.innerWidth
    //       this.screenWidth = window.screenWidth
    //     })()
    //   }
    // },
    // watch: {
    //   // 监听浏览器窗口宽度,当浏览器窗口小于1325时,隐藏系统时间
    //   screenWidth(val) {
    //     // console.log(val)
    //     if (val < 500) {
    //       this.span=24
    //     } else {
    //       this.span=8
    //     }
    //   }
    // }
  }
</script>

<style lang="less" scoped>
  .card-item{
    /*width: calc((100% - 4px)/3);*/
    height: 136px;
    float: left;
    .img{
      width: 84px;
      height: 84px;
      border-radius: 42px;
      margin:26px 30px 26px 40px;
      float: left;
      cursor: pointer;
    }
    .font{
      height: 100%;
      float: left;
      width: calc(100% - 154px);
      .font-item{
        width: 100%;
        height: 50%;
        text-align: left;
        font-weight: bold;
      }
    }
  }
  .dd-box{
    width:538px;
    height:255px;
    .dd-box-item{
      height: 220px;
      width: calc((100% - 1px)/2);
      float: left;
    }
    .dd-box-item2{
      width:100%;
      height:76px;
      border-right: 1px solid rgba(219,219,219,1);
      margin-top: 74px;
      .dd-box-item2-font{
        height: 50%;
        width: 100%;
        font-size:30px;
        font-weight:400;
        color:rgba(28,46,50,1);
        text-align: center;
        line-height: 37px;
        .dian{
          width:8px;
          height:8px;
          background:rgba(91,176,33,1);
          border-radius:4px;
          display: inline-block;
          margin-right: 5px;
        }
        .dianOk{
          width:8px;
          height:8px;
          background:rgba(250,103,0);
          border-radius:4px;
          display: inline-block;
          margin-right: 5px;
        }
        .font{
          font-size:16px;
          font-weight:400;
          color:rgba(28,46,50,1);
        }
      }
    }
  }
  .mesg{
    height: calc(100% - 224px)

  }

</style>