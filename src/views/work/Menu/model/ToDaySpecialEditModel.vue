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
  </a-modal>
</template>
<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import {httpAction, getAction, postAction} from '@/api/manage';
  import pick from 'lodash.pick'

  export default {
    name:"TodaySpecialEditModel",
    components: {
      ARow,
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
          Stock:{
            rules: [{required: true,validator: this.checkStock}]
          },
          spuPrice: {
            rules: [{required: true,validator: this.checkSpuPrice}]
          },
        },
        url: {
          edit:"/kunze/features/updateFeat",
        },
        shopType:""
      }
    },
    created() {
      this.shopType = localStorage.getItem('shopType')
    },
    methods:{
      add() {
        this.edit({});
      },
      edit(record) {
        let that = this;
        that.visible = true;
        that.form.resetFields();
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(that.model,'featuresPrice','featuresStock','remarks'))
       });

      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList=[];
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
    }
  }

</script>