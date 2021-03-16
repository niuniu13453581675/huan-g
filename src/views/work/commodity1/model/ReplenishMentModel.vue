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
            label="添加库存"
            hasFeedback
          >
            <a-input placeholder="请输入添加的商品数量" maxlength="6"
                     v-decorator="['stock', validatorRules.Stocks]"/>
          </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'


  export default {
    name:"ReplenishMentModel",
    components:{
      ARow
    },
    data(){
      return{
        description: '添加库存页',
        title: "操作",
        visible: false,
        formData: {},
        model: {},
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
        skuId:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          Stocks: {
            rules: [{required: true ,validator: this.checkStock,}]
          }
        },
        url: {
          edit:"/kunze/sku/updateStock"
        },
      }
    },
    created() {
    },
    methods:{
      ReplenishMent(record){
        debugger;
        let that = this;
        that.visible=true;
        that.skuId = record.id;
        that.form.resetFields();
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'stock'))
        });
      },
      handleSubmit() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            debugger;
            that.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            formData.skuId = this.skuId;
            httpAction(this.url.edit, formData, 'post').then((res) => {
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
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close');
        this.visible = false;
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
    }
  }
</script>