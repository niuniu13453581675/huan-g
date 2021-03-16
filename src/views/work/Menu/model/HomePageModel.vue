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
          <a-input placeholder="请输入专区名称" maxlength="30"
                   v-decorator="['homgName', {rules: [{ required: true, message: '请输入专区名称', }]}]"/>
        </a-form-item>
        <a-form-item label="选择分类" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="请选择分类" maxlength="256" @click="handleCateList"  readonly
                   v-decorator="['cid1', {rules: [{ required: true, message: '请选择分类', }]}]"/>
        </a-form-item>
        <a-form-item label="分类图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader"  text="上传" v-model="fileList" ></j-image-upload>
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
            v-decorator="['remank', {rules: [{}]}]"
          />
        </a-form-item>
      </a-form>

    </a-spin>
    <category-one-list ref="CategoryOneList" @func="modalFormOk"></category-one-list>
  </a-modal>
</template>
<script>
  import pick from 'lodash.pick';
  import ARow from "ant-design-vue/es/grid/Row";
  import {ACCESS_TOKEN} from "@/store/mutation-types";
  import JImageUpload from '../../../../components/jeecg/JImageUpload';
  import {getAction, httpAction,disabledAuthFilter} from '@/api/manage';
  import CategoryOneList from "./CategoryOneList";

  export default {
    name:"HomePageModel",
    components:{
      ARow,
      JImageUpload,
      CategoryOneList
    },
    data(){
      return{
        description: '编辑分区页面',
        visible: false,
        isShowFile: false,
        title: "操作",
        isUpload: false,
        defaultShopName:"1",
        formData: {},
        shopList:[],
        selectedRole:[],
        fileList: [],
        cid1:"",
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
          add:"/kunze/page/insertPage",
          edit:"/kunze/page/updatePage",
          fileUpload: "/sys/common/upload",
        },
      }
    },
    created() {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token": token};

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
        if(record.id != "" && record.id != undefined && record.id != null){
          setTimeout(() => {
            this.fileList = record.image;
          }, 5)
        }else {
          setTimeout(() => {
            this.fileList = [];
          }, 5)
        }
        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'homgName', 'cid1','remank'))
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
      handleCateList(){
        this.$refs.CategoryOneList.title = "选择分类";
        this.$refs.CategoryOneList.handleCateList();
      },
      modalFormOk(data){
        this.cid1 = data.id;
        this.model.cid1 = data.id;
        this.form.setFieldsValue({cid1:data.name});
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
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);
            formData.cid1 = this.cid1;
            formData.image = that.fileList;
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
    }
  }
</script>