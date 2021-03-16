<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
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

        >
          <a-cascader
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            :options="options"
            :default-value=options
            placeholder="选择地址"
            @change="onChange"

          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="超市详细地址"
          hasFeedback
        >
          <a-input placeholder="请输入详细地址" maxlength="50"
                   v-decorator="['shopAddress', {rules: [{ required: true, message: '请输入详细地址', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="负责人名称"
          hasFeedback
        >
          <a-input placeholder="请输入负责人名称" maxlength="10"
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
          <a-input placeholder="请输入身份证号码" maxlength="18"
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
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否上架">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'isFlag', {'initialValue':'0'}]">
            <a-radio-button :value="'0'">下架</a-radio-button>
            <a-radio-button :value="'1'">上架</a-radio-button>
          </a-radio-group>
        </a-form-item>


        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="配送方式">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'distributionModel', {'initialValue':'1'}]">
            <a-radio-button :value="'1'" @click="qie(1)">商家配送</a-radio-button>
            <a-radio-button :value="'2'" @click="qie(2)">骑手配送</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否付钱"
        >
          <a-radio-group buttonStyle="solid" v-decorator="[ 'isBuy', {'initialValue':'0'}]">
            <a-radio-button :value="'0'">付款</a-radio-button>
            <a-radio-button :value="'1'">不付款</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="配送费"
          hasFeedback
          v-if="ispostFree==true"
        >
          <a-input placeholder="请输入配送费" maxlength="50"
                   v-decorator="['postFree', {rules: [{ required: true, message: '请输入配送费', }]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="夜间配送费"
          hasFeedback
          v-if="ispostFree==true"
        >
          <a-input placeholder="请输入夜间配送费" maxlength="50"
                   v-decorator="['nightPostFree', {rules: [{ required: true, message: '请输入夜间配送费', }]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商铺类型"
          hasFeedback>
              <a-select  style="width: 120px" v-decorator="['shopType',{ rules: [{ required: true, message: '请选择商铺类型' }] },]" @change="handleSelectChange">
                <a-select-option value="1">
                  超市
                </a-select-option>
                <a-select-option value="2">
                  饭店
                </a-select-option>
                <a-select-option value="3">
                  代理
                </a-select-option>
              </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="销售模式"
          hasFeedback>
          <a-select  style="width: 120px" v-decorator="['businessType',{ rules: [{ required: true, message: '请选择销售模式' }] },]" @change="handleSelectChange">
            <a-select-option value="1">
              配送
            </a-select-option>
            <a-select-option value="2">
              到店
            </a-select-option>
            <a-select-option value="3">
              都有
            </a-select-option>
          </a-select>
        </a-form-item>

<!--        <a-form-item-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--          label="销售模式"-->
<!--          hasFeedback>-->
<!--          <a-select  style="width: 120px" v-decorator="['businessType',{ rules: [{ required: true, message: '请选择销售模式' }] },]" @change="handleSelectChange">-->
<!--            <a-select-option value="1">-->
<!--              配送-->
<!--            </a-select-option>-->
<!--            <a-select-option value="2">-->
<!--              到店-->
<!--            </a-select-option>-->
<!--            <a-select-option value="3">-->
<!--              都有-->
<!--            </a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
      </a-form>
    </a-spin>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>

  import {httpAction,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from 'moment';
  import Vue from 'vue';
  import { disabledAuthFilter } from "@/utils/authFilter"
  import {ACCESS_TOKEN} from "@/store/mutation-types"
  import JImageUpload from '../../../../components/jeecg/JImageUpload'

  export default {
    name:"SuperModules",
    components: {
      JImageUpload
    },
    data(){
      return{
        ispostFree:false,
        shopType:'请选择商铺类型',
        businessType:'',
        title: "操作",
        options:[],   //地址级联下啦数据
        optionss:[],   //地址级联下啦数据
        city:[],  //省市区id集合
        visible: false,
        formData: {},
        fileList: [],
        modalWidth:800,
        drawerWidth:700,
        model: {},
        uploadLoading:false,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        headers: {},
        picUrl:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          telphone: {
            rules: [{required: true,validator: this.validatePhone}]
          },
          idenitiy: {
            rules: [{required: true,validator: this.validateidenitiy}]
          },
        },
        url: {
          add:"kunze/shop/insertShop",
          edit:"kunze/shop/updateShop"
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};
    },
    mounted () {
      this.getRegionInfo()

    },
    methods:{
      qie(e){
        if(e==2){
          this.ispostFree=true
        }
        if(e==1){
          this.ispostFree=false
        }
      },
      //地址级联下拉选择事件
      onChange(value){
        // console.log(value)
        this.city=value
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
      moment,
      add() {
        this.edit({});
      },
      edit(record) {
        debugger

        record.arr+=1
        if(record.arr==2){
          record.postFree=record.postFree/100
          record.nightPostFree=record.nightPostFree/100
        }

        if(record.distributionModel==2){
          this.ispostFree=true
        }
        if(record.distributionModel==1){
          this.ispostFree=false
        }
        // console.log(record)
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        this.visible = true;
        this.form.resetFields();
        if(record.id!=null && record.id != "" && record.id !=undefined){
          setTimeout(() => {
            this.fileList = record.image;
          }, 5)
        }
        this.model = Object.assign({}, record);
        if (record.businessHours!=null && record.businessHours !="" && record.businessHours != undefined) {
          var time = record.businessHours.split("-");
          this.model.startBusiness = time[0];
          this.model.endBusiness = time[1];
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'shopName', 'nightPostFree','postFree','shopAddress','shopType','businessType','personCharge','telphone','afterSale','idenitiy', 'startBusiness', 'endBusiness','isFlag','distributionModel'))
          //时间格式化
          this.form.setFieldsValue({startBusiness: this.model.startBusiness ? moment(this.model.startBusiness, 'HH:mm') : null});
          this.form.setFieldsValue({endBusiness: this.model.endBusiness ? moment(this.model.endBusiness, 'HH:mm') : null});
        });

      },

      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList=[];
      },
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      handleSelectChange(e){
        // console.log(e)
      },
      handleSubmit() {
        const that = this;
        if(that.fileList.length == 0){
          that.$message.warning("请上传超市图片");
          return;
        }
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
            console.log(formData)
            formData.image = that.fileList;
            formData.province = that.city[0];
            formData.city = that.city[1];
            formData.area = that.city[2];
            // debugger;
            //时间格式化
            formData.startBusiness = formData.startBusiness ? formData.startBusiness.format('HH:mm') : null;
            formData.endBusiness = formData.endBusiness ? formData.endBusiness.format('HH:mm') : null;
            console.log(formData.shopType)
            if(formData.shopType=='超市' || formData.shopType==1){
              formData.shopType = 1
            }else if(formData.shopType=='饭店' || formData.shopType==2){
              formData.shopType = 2
            }else {
              formData.shopType = 3
            }


            if(formData.businessType == '配送' || formData.businessType==1){
              formData.businessType=1
            }else if(formData.businessType=='到店' || formData.businessType==2){
              formData.businessType=2
            }else {
              formData.businessType=3
            }

            // if(formData.distributionModel==2){
            //   that.ispostFree=true
            // }
            // if(formData.distributionModel==1){
            //   that.ispostFree=false
            // }
            debugger
            console.log(formData)
            // console.log(that.ispostFree)
            // console.log(this.model)
            debugger
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
      onSelected(data) {
        debugger;
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
<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }

  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>