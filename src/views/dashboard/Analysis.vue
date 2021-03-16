<template>
  <div>
    <index-chart v-if="indexStyle==1"></index-chart>
    <index-bdc v-if="indexStyle==2"></index-bdc>
    <index-task v-if="indexStyle==3"></index-task>
    <index-chart-shop v-if="indexStyle==4"></index-chart-shop>
<!--    <div style="width: 100%;text-align: right;margin-top: 20px">
      请选择首页样式：
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">统计图表</a-radio>
        <a-radio :value="2">统计图表2</a-radio>
        <a-radio :value="3">任务表格</a-radio>
      </a-radio-group>
    </div>-->
  </div>
</template>

<script>
  import IndexChart from './IndexChart'
  import IndexTask from "./IndexTask"
  import IndexBdc from './IndexBdc'
  import IndexChartShop from "./IndexChartShop"

  export default {
    name: "Analysis",
    components: {
      IndexChart,
      IndexTask,
      IndexBdc,
      IndexChartShop
    },
    data() {
      return {
        indexStyle:1,
      }
    },
    created() {
      let shopId=localStorage.getItem('shopId');
      debugger
      if(shopId!="null" && shopId!=null && shopId!="" && shopId != undefined){
        this.indexStyle = 4;
      }else {
        this.indexStyle = 1;
      }
    },
    methods: {

    }
  }
</script>