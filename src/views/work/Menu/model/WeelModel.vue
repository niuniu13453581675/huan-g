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
          label="图片名称"
          hasFeedback
        >
          <a-input placeholder="请输入图片名称" maxlength="30"
                   v-decorator="['wheelName', {rules: [{ required: true, message: '请输入超市名称', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="使用端"
          hasFeedback
        >
          <a-select placeholder="请选择使用端"  v-decorator="['wheelPort', {rules: [{ required: true, message: '请选择使用端', }]}]" >
            <a-select-option value="1">小程序端</a-select-option>
            <a-select-option value="2">Android端</a-select-option>
            <a-select-option value="3">IOS端</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片类型"
          hasFeedback
        >
          <a-select placeholder="请选择图片类型"  v-decorator="['wheelIsflag', {rules: [{ required: true, message: '请选择图片类型', }]}]" >
            <a-select-option value="0">广告</a-select-option>
            <a-select-option value="1">新商品</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片跳转地址"
          hasFeedback
        >
          <a-input placeholder="请输入图片跳转地址" maxlength="256"
                   v-decorator="['wheelUrl', {rules: [{ required: true, message: '请输入图片跳转地址', }]}]"/>
        </a-form-item>
        <a-form-item label="超市" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="请选择超市" maxlength="256" @click="handleShopList"  readonly
                   v-decorator="['shopName', {rules: [{ required: true, message: '请选择超市', }]}]"/>
        </a-form-item>
        <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader"  text="上传" v-model="fileList" ></j-image-upload>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="图片播放顺序"
          hasFeedback
        >
          <a-input placeholder="请输入图片播放顺序" maxlength="256"
                   v-decorator="['wheelNo', {rules: [{ required: true, message: '请输入图片播放顺序', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否启用">
          <a-radio-group buttonStyle="solid" v-decorator="[ 'isFlag', {'initialValue':'1'}]">
            <a-radio-button :value="'0'">启用</a-radio-button>
            <a-radio-button :value="'1'">未启用</a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>

    </a-spin>
    <shop-list-model ref="ShopListModel" @func="modalFormOkShop"></shop-list-model>
  </a-modal>
</template>
<script>

  import pick from 'lodash.pick';
  import ARow from "ant-design-vue/es/grid/Row";
  import {ACCESS_TOKEN} from "@/store/mutation-types";
  import JImageUpload from '../../../../components/jeecg/JImageUpload';
  import {getAction, httpAction} from '@/api/manage';
  import {queryByShopId} from '@/api/api';
  import ShopListModel from '../../Supermarket/modules/ShopListModel';
  export default {
    name:"WeelModel",
    components:{
      ARow,
      JImageUpload,
      ShopListModel
    },
    data(){
      return{
        description: '编辑轮播图页面',
        visible: false,
        isShowFile: false,
        title: "操作",
        isUpload: false,
        defaultShopName:"1",
        formData: {},
        shopList:[],
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
        avatar: "",
        isArris: false,
        shopId:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          shopList:"/kunze/shop/lists",
          add:"/kunze/wheel/saveWheel",
          edit:"/kunze/wheel/updateWheel",
          fileUpload: "/sys/common/upload",
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};

    },
    methods:{
      loadShopList(wheelId){
        queryByShopId({id:wheelId}).then((res)=>{
          if(res.success){
            this.selectedRole = res.result;
          }else{
            console.log(res.message);
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
        debugger;
        if(record.hasOwnProperty("wheelId")){
          that.loadShopList(record.wheelId);
          setTimeout(() => {
            this.fileList = record.wheelImages;
          }, 5)
        }
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'wheelName', 'wheelPort','wheelIsflag','wheelUrl','shopName','wheelNo','isFlag'))
/*          //时间格式化
          this.form.setFieldsValue({startBusiness: this.model.startBusiness ? moment(this.model.startBusiness, 'HH:mm') : null});
          this.form.setFieldsValue({endBusiness: this.model.endBusiness ? moment(this.model.endBusiness, 'HH:mm') : null});*/
        });

      },

      close() {
        this.$emit('close');
        this.visible = false;
        this.fileList=[];
      },
      handleShopList(){
        this.$refs.ShopListModel.title = "选择超市";
        this.$refs.ShopListModel.shopList();
      },
      modalFormOkShop(data){
        this.shopId = data.id;
        this.model.shopId = data.id;
        this.form.setFieldsValue({shopName:data.shopName});
      },
      initialShopList(){
        getAction(this.url.shopList).then((res)=>{
          if(res.success){
            this.shopList = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      handleSubmit() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            debugger;
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.wheelId) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);
            formData.wheelImages = that.fileList;
            debugger;
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
    },
  }
</script>