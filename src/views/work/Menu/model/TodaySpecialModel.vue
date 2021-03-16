<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleSubmit"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="选择商品"
          hasFeedback
        >
          <a-input @click="handleSpu" placeholder="请选择商品" maxlength="30" readonly
                   v-decorator="['spuName', {rules: [{ required: true, message: '请选择商品', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品规格"
          hasFeedback
          v-if="shopType==1"
        >
          <a-input @click="handleSku" placeholder="请选择商品规格" maxlength="30" readonly
                   v-decorator="['skuName', {rules: [{ required: true, message: '请选择商品规格', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品特卖价格"
          hasFeedback
        >
          <a-input placeholder="请输入商品特卖价格" maxlength="30"
                   v-decorator="['featuresPrice', validatorRules.spuPrice]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品特卖库存"
          hasFeedback
          v-if="shopType==1"
        >
          <a-input placeholder="请输入商品特卖库存" maxlength="10"
                   v-decorator="['featuresStock', validatorRules.Stock]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="顺序"
          hasFeedback
        >
          <a-input placeholder="请输入商品顺序" maxlength="10"
                   v-decorator="['featuresWeight', validatorRules.checkNum]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="特卖日期"
          hasFeedback
        >
          <a-date-picker
            v-decorator="['specialstartTime', validatorRules.specialstartTime]"
            show-time
            format="YYYY-MM-DD"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="备注"
          hasFeedback
        >
          <a-textarea
            v-model="value"
            placeholder="请输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            v-decorator="['remarks', {rules: [{}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <today-spu-list ref="TodaySpuList" @func="modalFormOkSpu"></today-spu-list>
    <today-sku-list ref="TodaySkuList" @func="modalFormOkSku"></today-sku-list>
  </a-modal>
</template>
<script>

  import ARow from "ant-design-vue/es/grid/Row";
  import {httpAction, getAction, postAction} from '@/api/manage';
  import {filterObj} from '@/utils/util';
  import TodaySpuList from "./TodaySpuList";
  import TodaySkuList from "./TodaySkuList";

  export default {
    name:"TodaySpecialModel",
    components: {
      ARow,
      TodaySpuList,
      TodaySkuList
    },
    data(){
      return{
        description: '今日特卖编辑页',
        title: "操作",
        visible: false,
        formData: {},
        model: {},
        shopId:"",
        skuId:"",
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        uploadLoading: false,
        headers: {},
        spuId:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          specialstartTime: {
            rules: [{required: true,validator: this.specialstartTime}]
          },
          Stock:{
            rules: [{required: true,validator: this.checkStock}]
          },
          spuPrice: {
            rules: [{required: true,validator: this.checkSpuPrice}]
          },
          checkNum: {
            rules: [{required: true,validator: this.checkNum}]
          }
        },
        url: {
          add:"/kunze/features/saveSpuFeatures",
          identical:"/kunze/features/identical",
        },
        shopType:""
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
      this.shopId=localStorage.getItem('shopId');

    },
    mounted () {
      this.shopType = localStorage.getItem('shopType')
    },
    methods:{
      loadShopList(wheelId){
        queryByShopId({id:wheelId}).then((res)=>{
          if(res.success){
            this.selectedRole = res.result;
          }
        });
      },
      add() {
        this.edit({});
      },
      edit(record) {
        let that = this;
        that.initialShopList();
        that.visible = true;
        that.form.resetFields();
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'spuId', 'skuId','featuresPrice','featuresStock','featuresWeight','specialstartTime','specialendTime','remarks'))
         //时间格式化
          this.form.setFieldsValue({specialstartTime: this.model.specialstartTime ? moment(this.model.specialstartTime, 'YYYY-MM-DD HH:mm:ss') : null});
          this.form.setFieldsValue({specialendTime: this.model.specialendTime ? moment(this.model.specialendTime, 'YYYY-MM-DD HH:mm:ss') : null});
        });

      },
      handleTime(){

      },
      handleSpu(){
        this.$refs.TodaySpuList.spuList();
        this.$refs.TodaySpuList.title="选择商品";
      },
      handleSku(){
        if(this.spuId==null||this.spuId==""||this.spuId==undefined){
          this.$message.warning("请先选择商品！");
          return;
        }
        this.$refs.TodaySkuList.skuList(this.spuId);
        this.$refs.TodaySpuList.title="选择商品规格";
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList=[];
      },
      initialShopList(){
        getAction(this.url.shopList).then((res)=>{
          if(res.success){
            this.shopList = res.result;
          }
        });
      },
      modalFormOkSpu(data) {
        this.spuId = data.id;
        this.model.spuId = data.id;
        if(this.shopType==2){
          this.model.skuId = data.id;
        }
        this.form.setFieldsValue({spuName:data.title});
      },
      modalFormOkSku(data) {
        this.skuId = data.id;
        this.model.skuId = data.id;
        this.form.setFieldsValue({skuName:data.ownSpec});
      },
      handleSubmit() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {

            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.featuresId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);
            formData.shopId = localStorage.getItem('shopId');
            formData.featuresFlag = "1";
            //时间格式化


            formData.specialstartTime = formData.specialstartTime ? formData.specialstartTime.format('YYYY-MM-DD') : null;
            formData.specialendTime = formData.specialstartTime;
            var specialstartTime = formData.specialstartTime + " 00:00:00";
            var specialendTime = formData.specialstartTime + " 23:59:59";
            formData.specialstartTime = specialstartTime
            formData.specialendTime = specialendTime
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      handleCancel() {
        this.close()
      },
      specialstartTime(rule, value, callback){
        let that=this
        if(!value){
          callback("特卖日期不能为空！")
        }else{
          // debugger
          let  param = {};
          if(that.shopType==2){
            param = {
              skuId:that.spuId,
              featuresTime: value.format('YYYY-MM-DD'),
            };
          }else {
            param = {
              skuId:that.skuId,
              featuresTime: value.format('YYYY-MM-DD'),
            };
          }
          console.log(param,this.spuId)
          postAction(this.url.identical,param).then((res)=>{
            if(res.success){
              callback();
            }else {
              callback(res.message);
            }
          })
 /*         var myDate = new Date();
          var mytime = myDate.toLocaleDateString();
          var valtime = value ? value.format('YYYY/MM/DD') : null;
          valtime = new Date(Date.parse(valtime));
          mytime = new Date(Date.parse(mytime));
          if(mytime >= valtime){
            callback("特卖日期只能大于当天日期！")
          }else {
          }*/
        }
      },
      checkStock(rule, value, callback){
        if(!value){
          callback("库存数量不能为空！");
        }else {
          var reg =/^([1-9][\d]{0,7}|0)?$/;
          if(!value.match(reg)){
            callback("库存数量只能输入数字！")
          }else {
            callback();
          }
        }
      },
      checkSpuPrice(rule, value, callback){
        if(!value){
          callback("特卖价格不能为空！");
        }else {
          var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
          if(!value.match(priceReg)){
            callback("请输入正确的特卖商品价格:整数或者保留两位小数");
          }else {
            callback();
          }
        }
      },
      checkNum(rule, value, callback){
        if(!value){
          callback("请输入顺序！");
        }else {
          var reg =/^([1-9][\d]{0,7}|0)?$/;
          if(!value.match(reg)){
            callback("顺序只能输入数字！")
          }else {
            callback();
          }
        }
      },
    },
  }
</script>