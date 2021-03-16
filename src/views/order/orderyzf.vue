<template>
<!--    订单（已支付）-->
  <div>
    <el-button @click="fkuan">点一下</el-button>
  </div>
</template>

<script>
  import { postAction} from "@/api/manage"



    export default {
      data() {
        return {
        };
      },
      methods: {
       fkuan(){
         // let params = {
         //   status: "1",
         //   userID:"1",
         //   shopID:"1"
         // }
         postAction('/kunze/order/queryOrder',{status: "1",userID:"1",shopID:"1"}).then((res)=>{
           console.log(res);
         })
         // chaorder({
         //   shopID:'1',
         //   status:'1',
         //   userID:'1'
         // }).then((res)=>{
         //   console.log(res);
         // })

       }
      },
      mounted(){
      }

    }
</script>

<style scoped>

</style>