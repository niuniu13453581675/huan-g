<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="骑手名称"
          hasFeedback
        >
          <a-input placeholder="请输入骑手名称" maxlength="10"
                   v-decorator="['riderName', {rules: [{ required: true, message: '请输入骑手名称', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="负责地区"

        >
          <a-cascader
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            :options="options"
            v-decorator="['options', {rules: [{ required: true, message: '选择地址', }]}]"
            placeholder="选择地址"
            @change="onChange"

          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="身份证号码"
          hasFeedback
        >
          <a-input placeholder="请输入身份证号码" maxlength="18"
                   v-decorator="['idenitiy', validatorRules.idenitiy]"/>
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
          label="初始密码"
          hasFeedback
        >
          <a-input placeholder="请输入初始密码" minlegth="6" maxlength="10"
                   v-decorator="['password', {rules: [{ required: true, message: '请输入密码', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="骑手等级"
          hasFeedback
        >

          <a-select
            v-decorator="[
          'level',
          { rules: [{ required: true, message: '请选择骑手等级' }] },
        ]"
            placeholder="选择骑手等级"
          >
            <a-select-option value="1">
              普通骑手
            </a-select-option>
            <a-select-option value="0">
              管理员
            </a-select-option>
          </a-select>


        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="接单数"
          hasFeedback
        >
          <a-input placeholder="0" maxlength="11" disabled readonly
                   v-decorator="['orderNum', {}]"/>
        </a-form-item>
      </a-form>

    </a-spin>
  </a-modal>
</template>
<script>
  import pick from 'lodash.pick';
  import ARow from "ant-design-vue/es/grid/Row";
  import {getAction, httpAction} from '@/api/manage';
  import { disabledAuthFilter } from "@/utils/authFilter"

  export default {
    name:"RiderModel",
    components:{
      ARow,
    },
    data(){
      return{
        description: '编辑骑手信息页面',
        visible: false,
        city:[],
        isShowFile: false,
        title: "操作",
        isUpload: false,
        defaultShopName:"1",
        formData: {},
        shopList:[],
        options:[],
        selectedRole:[],
        fileList: [],
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
        isArris: false,
        shopId:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          telphone: {
            rules: [{required: true,validator: this.validatePhone}]
          },
          idenitiy: {
            rules: [{required: true,validator: this.validateidenitiy}]
          },
          password: {
            rules: [{required: true,validator: this.password}]
          },
        },
        url: {
          add:"/kunze/rider/saveRider",
          edit:"/kunze/rider/editRider",
        },
      }
    },
    created() {
    },
    mounted () {
      this.getRegionInfo()
    },
    methods:{
      //地址级联下拉选择事件
      onChange(value){
        this.city=value
      },
      //获取地址
      getRegionInfo(){
        getAction('kunze/user/getRegionInfo').then((res)=>{
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
      add() {
        this.edit({});
      },
      edit(record) {
        debugger
        let that = this;
        that.visible = true;
        that.form.resetFields();
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'id','riderName','options', 'idenitiy','telphone','orderNum','password','lever'))
        });
      },
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList=[];
      },
      handleOk() {
        const that = this;
        // 触发表单验证

        this.form.validateFields((err, values) => {

          if (!err) {

            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);

            formData.province = that.city[0];
            formData.city = that.city[1];
            formData.area = that.city[2];
            // debugger;
            //时间格式化
            /*            formData.startBusiness = formData.startBusiness ? formData.startBusiness.format('HH:mm') : null;
                        formData.endBusiness = formData.endBusiness ? formData.endBusiness.format('HH:mm') : null;*/


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
      handleCancel() {
        this.close()
      },
      validatePhone(rule, value, callback){
        if(!value){
          callback("联系方式不能为空！")
        }else{
          //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
          if(new RegExp(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/).test(value)){
            //update-end--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
            callback()
          }else{
            callback("请输入正确格式的手机号码!");
          }
        }
      },
      validateidenitiy(rule, value, callback){
        // debugger;
        if(!value){
          callback("身份证号码不能为空！")
        }else {
          //15位和18位身份证号码的正则表达式
          var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
          if (regIdCard.test(value)){
            if(value.length == 18){
              var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
              var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2);//这是除了11后，可能产生的11位余数、验证码，也保存成数组
              var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
              for(var i = 0;i < 17; i++){
                idCardWiSum += value.substring(i , i + 1) * idCardWi[i];
              }
              var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
              var idCardLast = value.substring(17); //得到最后一位身份证号码
              //如果等于2，则说明验证码是10，身份证号码最后一位应该是X
              if(idCardMod == 2){
                if(idCardLast == "X" || idCardLast == "x"){
                  callback();
                }else {
                  callback("身份证号码不正确");
                }
              }else {
                //用计算出的验证码与最后一位身份证号码进行匹配，如果一致，说明通过，否则身份证号码无效
                if(idCardLast == idCardY[idCardMod]){
                  callback();
                }else {
                  callback("身份证号码不正确");
                }
              }
            }
          }else {
            callback("身份证号码不正确！")
          }
        }
      }

    }
  }
</script>