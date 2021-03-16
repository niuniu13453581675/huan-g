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
          label="专区名称"
          hasFeedback
        >
          <a-input placeholder="请选择专区名称" maxlength="30" @click="handleHomePage" readonly
                   v-decorator="['homgName', validatorRules.checkHomePage]"/>
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
    <home-page-list ref="HomePageList" @func="modalFormOk"></home-page-list>
  </a-modal>
</template>
<script>
  import pick from 'lodash.pick';
  import ARow from "ant-design-vue/es/grid/Row";
  import {ACCESS_TOKEN} from "@/store/mutation-types";
  import {getAction, httpAction,disabledAuthFilter} from '@/api/manage';
  import HomePageList from "./HomePageList";

  export default {
    name:"HomePageModel",
    components:{
      ARow,
      HomePageList
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
        homePageId:"",
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
        validatorRules:{
          checkHomePage: {
            rules: [{required: true,validator: this.checkHomePage}]
          }
        },
        url: {
          add:"/kunze/homeShop/saveHomeShop",
          edit:"/kunze/homeShop/editHomeShop",
          queryHome:"/kunze/homeShop/queryNotHomeShop"
        },
      }
    },
    created() {
      this.shopId=localStorage.getItem('shopId');

    },
    methods:{
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
          that.form.setFieldsValue(pick(this.model, 'homgName','remarks'))
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
      handleHomePage(){
        this.$refs.HomePageList.title = "选择分类专区";
        this.$refs.HomePageList.handlePageList();
      },
      modalFormOk(data){
        this.homePageId = data.id;
        this.model.homePageId = data.id;
        this.form.setFieldsValue({homgName:data.homgName});
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
            formData.shopId = this.shopId;

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
      checkHomePage(rule, value, callback){
        if(!value){
          callback("分类专区不能为空");
        }else {
          let param = {
            homePageId:this.homePageId,
            shopId:this.shopId,
          };
          getAction(this.url.queryHome,param).then((res)=>{
            if(res.success){
              callback(res.message);
            }else {
              callback();
            }
          })
        }
      },
    }
  }
</script>