<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="总销售额" :total="totalSales | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="isDownUp" style="margin-right: 16px;">
              <span slot="term">周同比</span>
              {{onWeek}}
            </trend>
            <trend :flag="isDownUps">
              <span slot="term">日同比</span>
              {{onDays}}
            </trend>
          </div>
          <template slot="footer">今日销售额<span>￥ {{toDay | NumberFormat}}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="订单量" :total="totalOrder | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :dataSource="sourceData"/>
          </div>
          <template slot="footer">日订单量<span> {{ todaysOrder | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px'}" >
        <chart-card title="设置手续费"  :loading="loading">
          <a-tooltip title="手续费说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div style="margin-bottom: px; font-size: 16px;font-weight: bold">
            当前手续费：
            <span style="color: #2eabff;margin-right: 2%">{{serviceCharge}} %</span></br>
            选&nbsp;择&nbsp;超&nbsp;市：
            <a-input style="width: 50%;"  :value="value" placeholder="请选择超市" @click="handleShopList"  />
          </div>
          <div style="line-height:30px; font-size: 16px;font-weight: bold">
            修改手续费：
            <a-input-search style="width: 50%;"
                            placeholder="请输入手续费"
                            enter-button="确认"
                            @search="onSearch"
            />
          </div>
        </chart-card>
      </a-col>
<!--    <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="支付笔数" :total="6560 | NumberFormat">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">转化率 <span>60%</span></template>
        </chart-card>
      </a-col>-->
      <!--    <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
          <chart-card :loading="loading" title="运营活动效果" total="78%">
            <a-tooltip title="指标说明" slot="action">
              <a-icon type="info-circle-o" />
            </a-tooltip>
            <div>
              <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
            </div>
            <template slot="footer">
              <trend flag="down" style="margin-right: 16px;">
                <span slot="term">同周比</span>
                12%
              </trend>
              <trend flag="up">
                <span slot="term">日环比</span>
                80%
              </trend>
            </template>
          </chart-card>
        </a-col>-->
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">

      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px' }" >
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="loaderboard(0,0)">总排行</a>
              <a @click="loaderboard(0,1)">今天</a>
              <a @click="loaderboard(0,5)">昨天</a>
              <a @click="loaderboard(0,2)">本周</a>
              <a @click="loaderboard(0,3)">本月</a>
              <a @click="loaderboard(0,4)">本年</a>

            </div>
            <!--<a-range-picker :style="{width: '256px'}" />-->
          </div>
          <a-tab-pane loading="true" tab="销售额" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额排行" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" @func="loads" @more="more" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>

         <!-- <a-tab-pane tab="销售趋势" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="销售额趋势" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane>-->
        </a-tabs>
      </div>
    </a-card>

    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一周访问量统计" :style="{ marginTop: '24px' }">
          <a-row>
            <a-col :span="7">
              <head-info title="今日IP" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="1">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 15px"  />
              </a-spin>
            </a-col>
            <a-col :span="7">
              <head-info title="今日访问" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="1">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 15px"  />
              </a-spin>
            </a-col>
            <a-col :span="7">
              <head-info title="总访问量" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="1">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 15px"  />
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>
    <shop-profit-list ref="ShopProfitList"></shop-profit-list>
    <shop-list-model ref="ShopListModel" @func="modalFormOkShop"></shop-list-model>
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'
  import {getAction,postAction} from '@/api/manage'
  import ShopProfitList from '../work/Supermarket/ShopProfitList'
  import Trend from '@/components/Trend'
  import { getLoginfo,getVisitInfo } from '@/api/api'
  import ShopListModel from '../work/Supermarket/modules/ShopListModel'

  const rankList = [];
/*  for (let i = 0; i < 7; i++) {
    rankList.push({
      name: '白鹭岛 ' + (i+1) + ' 号店',
      total: 1234.56 - i * 100
    })
  }*/
  const sourceData = []

  const barData = []
/*  for (let i = 0; i < 12; i += 1) {
    barData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200
    })
  }*/

  const orderData = []
  export default {
    name: "IndexChart",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      HeadInfo,
      ShopProfitList,
      ShopListModel
    },
    data() {
      return {
        loading: true,
        center: null,
        rankList,
        sourceData,
        barData,
        value:"",
        isDownUp: "down",
        isDownUps: "down",
        totalSales:"0",
        onWeek:"",
        onDays:"",
        toDay:"0",
        totalOrder:"0",
        todaysOrder:"0",
        loginfo:{},
        chargeId:"",
        serviceCharge:"0",
        shopId:"",
        chargeShopId:"",
        visitFields:['ip','visit'],
        visitInfo:[],
        url:{
          loaderboard:"/kunze/menu/loaderboard",
          loaderShop:"/kunze/menu/loaderShop",
          loaderOrder:"/kunze/menu/orderLeader",
          loaderOrders:"/kunze/menu/orderLeaders",
          loaderSales:"/kunze/menu/sales",
          chargInsert:"/kunze/charge/saveCharge",
          chargeUpdate:"/kunze/charge/updateCharge",
          queryCharge:"/kunze/charge/queryCharge",

        },
        choiceTime:"0",
        indicator: <a-icon type="loading" style="font-size: 24px" spin />
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
      this.initLogInfo();
      this.loaderboard(0,0);
      this.loads();
      this.loaderOrder();
      this.loaderSales();
      this.loaderCharge();
    },
    methods: {
      loaderSales(shopId){
        let params = {
          shopId:shopId,
        };
        getAction(this.url.loaderSales,params).then((res) => {
          if(res.success){
            this.totalSales = "￥"+res.result.total;
            this.onWeek = res.result.onWeek;
            var reg = RegExp(/-/);
            if(this.onWeek.match("-")){
              this.isDownUp = "down";
            }else {
              this.isDownUp = "up";
            }
            this.onDays = res.result.onDay;
            if(this.onDays.match("-")){
              this.isDownUps = "down";
            }else {
              this.isDownUps = "up";
            }
            this.toDay = res.result.toDays;
          }
        });
      },
      handleShopList(){
        this.$refs.ShopListModel.title = "选择超市";
        this.$refs.ShopListModel.shopList();
      },
      modalFormOkShop(data){
        this.chargeShopId = data.id;
        //this.model.shopName = data.id;
        this.value = data.shopName;
        this.loaderCharge();
      },
      loaderCharge(){
        getAction(this.url.queryCharge,{shopId:this.chargeShopId}).then((res) =>{
          if(res.success){
            debugger;
            if(res.result == null){
              this.chargeId = "";
              this.serviceCharge = "0";
            }else {
              this.chargeId = res.result.id;
              this.serviceCharge = res.result.service_charge;
            }
          }
        })
      },
      onSearch(e){
        let saveCharge={
           id:this.chargeId,
           serviceCharge:e,
          shopId:this.chargeShopId,
        }
        let url = "";
        let save = "";
        if(this.chargeId==null||this.chargeId==""||this.chargeId==undefined){
          url = this.url.chargInsert;
          save = "添加"
        }else {
          url = this.url.chargeUpdate;
          save = "修改"
        }
        postAction(url,saveCharge).then((res)=>{
          if(res.success){
            this.loaderCharge();
            this.loaderboard(0,0);
            this.$message.success("手续费"+save+"成功");
          }else {
            this.$message.error("手续费"+save+"失败");
          }

        })
      },
      loaderOrder(shopId){
        let params = {
          shopId:shopId,
        };
        getAction(this.url.loaderOrder,params).then((res) => {
          if(res.success){
            this.totalOrder = res.result.totalOrder;
            this.todaysOrder = res.result.todaysOrder;
          }
        });
        let old = this.sourceData.length;
        getAction(this.url.loaderOrders,params).then((res) => {
          if(res.success){
            for (let i = 0; i < res.result.length; i+=1) {
             this.sourceData.push({
               x: res.result[i].clickDate,
               y: res.result[i].counts
              })
            }
            this.sourceData.splice(0,old);
          }
        })
      },
      loads(data){
        this.barData = [];
        let params = {
          shopId:data,
          year:"2020",
        };
        getAction(this.url.loaderShop,params).then((res) => {
          if (res.success) {
            for (let i = 0; i < res.result.length; i += 1) {
              this.barData.push({
                x: `${i + 1}月`,
                y: res.result[i]
              })
            }
          }
        })
        this.loaderOrder(data);
        this.loaderSales(data);
        //this.more();
      },
      more(){
        var choice = "超市销售总排行";
        if(this.choiceTime == 1){
          choice = "今日超市销售排行";
        }else if(this.choiceTime == 2){
          choice = "本周超市销售排行";
        }else if(this.choiceTime == 3){
          choice = "本年超市销售排行";
        }
        this.$refs.ShopProfitList.shopMore(this.choiceTime);
        this.$refs.ShopProfitList.title = choice;
      },
      loaderboard (more,choiceTime) {
        debugger
        if(more==0&&choiceTime==0){
          this.loads();
          this.loaderOrder();
          this.loaderSales();
        }
        this.rankList = [];
        this.choiceTime = choiceTime;
        let params = {
          more:more,
          choiceTime:choiceTime,
        };
        getAction(this.url.loaderboard,params).then((res) => {
          console.log(res)
          if (res.success) {
            debugger;
            for (let i = 0; i < res.result.list.length; i++) {
              this.rankList.push({
                id:res.result.list[i].shopId,
                name: res.result.list[i].shopName,
                total: res.result.list[i].payment,
                shopCharge: res.result.list[i].charge+"%",
                charge:res.result.list[i].serviceCharge
              })
            }
          }
        })
      },
      initLogInfo () {
        getLoginfo(null).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            this.loginfo = res.result;
          }
        })
        getVisitInfo().then(res=>{
          if(res.success){
             // console.log("aaaaaa",res.result)
            console.log(res.result)
            this.visitInfo = res.result;
           }
         })
      },
    }
  }
</script>

<style lang="less" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -40%;
  }
  .extra-wrapper {
    line-height: 50px;
    /*padding-right: 5px;*/

    .extra-item {
      display: inline-block;
      /*margin-right: 20px;*/

      a {
        margin-left: 24px;
      }
    }
  }
  a:hover{
    text-decoration: underline;
  }
  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>