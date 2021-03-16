<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="超市名称"
        hasFeedback
      >
        <a-input placeholder="请输入超市名称" maxlength="30"
                 v-decorator="['shopName', {rules: [{ required: true, message: '请输入超市名称', }]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="超市地址"
        hasFeedback
      >
        <a-cascader
          :field-names="{ label: 'name', value: 'id', children: 'children' }"
          :options="options"
          :default-value=options
          placeholder="选择地址"
          v-decorator="['options', {initialValue:optionss,rules: [{ required: true, message: '请选择地址', }]}]"
          @change="onChange"
        />
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="超市详细地址"
        hasFeedback
      >
        <a-input placeholder="请输入详细地址" maxlength="10"
                 v-decorator="['shopAddress', {rules: [{ required: true, message: '请输入详细地址', }]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="负责人名称"
        hasFeedback
      >
        <a-input placeholder="请输入负责人名称" maxlength="10" readonly disabled
                 v-decorator="['personCharge', {rules: [{ required: true, message: '请输入负责人名称', }]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="联系方式"
        hasFeedback
      >
        <a-input placeholder="请输入联系方式" maxlength="11" :disabled="isDisabledAuth('user:form:telphone')"
                 v-decorator="['telphone', validatorRules.telphone]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="售后电话"
        hasFeedback
      >
        <a-input placeholder="请输入售后电话" maxlength="11" :disabled="isDisabledAuth('user:form:afterSale')"
                 v-decorator="['afterSale', {rules: [{ required: true, message: '请输入售后电话', }]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="身份证号码"
        hasFeedback
      >
        <a-input placeholder="请输入身份证号码" maxlength="18" readonly disabled
                 v-decorator="['idenitiy', validatorRules.idenitiy]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="开始营业时间"
        hasFeedback
      >
        <a-time-picker :default-value="moment('00:00', 'HH:mm')" format="HH:mm" v-decorator="['startBusiness', {rules: [{ required: true, message: '请输入开始营业时间', }]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="打烊时间"
        hasFeedback
      >
        <a-time-picker :default-value="moment('00:00', 'HH:mm')" format="HH:mm" v-decorator="['endBusiness', {rules: [{ required: true, message: '请输入打烊时间', }]}]"/>
      </a-form-item>
      <a-form-item label="超市图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <j-image-upload class="avatar-uploader" text="上传" v-model="fileList" ></j-image-upload>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >

        <a-button style="margin-left: 8px" @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  import {httpAction,deleteAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment';
  import Vue from 'vue';
  import { disabledAuthFilter } from "@/utils/authFilter"
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import JImageUpload from '@/components/jeecg/JImageUpload'

  export default {
    name: 'MyShopModel',
    components: {
      JImageUpload
    },
    data () {
      return {
        description: '',
        options:[],   //地址级联下啦数据
        optionss:[],   //地址级联下啦数据
        formData: {},
        fileList: [],
        model: {},
        city:[],
        uploadLoading:false,
        headers: {},
        picUrl:"",
        confirmLoading: false,
        shopId:"",
        labelCol: {
          lg: {span: 7},
          sm: {span: 7},
        },
        wrapperCol: {
          lg: {span: 10},
          sm: {span: 17},
        },
        // form
        form: this.$form.createForm(this),
        validatorRules:{
          telphone: {
            rules: [{required: true,validator: this.validatePhone}]
          },
          idenitiy: {
            rules: [{required: true,validator: this.validateidenitiy}]
          },
          image:{
            rules:[{required:true, message: '请上传超市图片'}]
          }
        },
        url: {
          edit:"kunze/shop/updateShop",
          query:"kunze/shop/selectShopInfoById"
        },
      }
    },
    created(){
      this.shopId=localStorage.getItem('shopId');
      this.loadData();
    },
    mounted () {
      this.getRegionInfo()
    },
    methods: {
      moment,
      //地址级联下拉选择事件
      onChange(value){
        // console.log(value)
        this.city=value
      },
      loadData(){
        deleteAction(this.url.query,{shopId:this.shopId}).then((res) =>{
          if(res.success){
            // debugger;
              let record ={
                id:res.result[0].id,
                province:res.result[0].province,
                city:res.result[0].city,
                area:res.result[0].area,
                shopName:res.result[0].shopName,
                shopAddress:res.result[0].shopAddress,
                personCharge:res.result[0].personCharge,
                telphone:res.result[0].telphone,
                afterSale:res.result[0].afterSale,
                idenitiy:res.result[0].idenitiy,
                startBusiness:res.result[0].startBusiness,
                endBusiness:res.result[0].endBusiness,
                image:res.result[0].image,
              };
            this.optionss[0] = record.province;
            this.optionss[1] = record.city;
            this.optionss[2] = record.area;
            console.log(this.optionss)
            this.model.optionss = this.optionss;
              this.edit(record);
          }
        })

      },
      edit(record){
        this.form.resetFields();
        this.model = Object.assign({}, record);
        if(record.id!=null && record.id != "" && record.id !=undefined){
          setTimeout(() => {
            this.fileList = record.image;
          }, 5)
        }
        // this.options[0] = record.province;
        // this.options[1] = record.city;
        // this.options[2] = record.area;
        // this.model.options = this.options;
        console.log(this.options)
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'shopName','options', 'shopAddress','personCharge','telphone','afterSale','idenitiy', 'startBusiness', 'endBusiness','isFlag'))
          //时间格式化
          this.form.setFieldsValue({startBusiness: this.model.startBusiness ? moment(this.model.startBusiness, 'HH:mm') : null});
          this.form.setFieldsValue({endBusiness: this.model.endBusiness ? moment(this.model.endBusiness, 'HH:mm') : null});
        });
      },
      //获取地址
      getRegionInfo(){
        getAction('kunze/user/getRegionInfo').then((res)=>{
          // if(res.result[0].children)
          // console.log(res)
          this.options=res.result[0].children
          this.options.forEach(e=>{
            e.label=e.id
            e.children.forEach((e=>{
              e.label=e.id
              e.children.forEach((e=>{
                e.label=e.id

              }))
            }))
          })
        })
      },
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      onSelected(data) {
        this.address.province = data.province.value
        this.address.city = data.city.value
        this.address.county = data.area.value
      },
      beforeUpload: function(file){
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning('请上传图片');
          return false;
        }
        //TODO 验证文件大小
      },
      handleChange (info) {
        this.picUrl = "";
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          this.uploadLoading = false;
          console.log(response);
          if(response.success){
            this.model.avatar = response.message;
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
      },
      // handler
      handleSubmit() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {

          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';

            let formData = Object.assign(this.model, values);
            console.log(formData)
            formData.image = that.fileList;
            formData.province = that.city[0];
            formData.city = that.city[1];
            formData.area = that.city[2];
            // debugger;
            //时间格式化
            formData.startBusiness = formData.startBusiness ? formData.startBusiness.format('HH:mm') : null;
            formData.endBusiness = formData.endBusiness ? formData.endBusiness.format('HH:mm') : null;
            httpAction(this.url.edit, formData, 'post').then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData()
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;

            })


          }
        })
      },
    }
  }
</script>