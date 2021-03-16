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
          label="客户端："
          hasFeedback
        >
          <a-input placeholder="安卓" maxlength="10" readonly disabled
                   v-decorator="['client', {rules: [{ required: false, message: '请输入骑手名称', }]}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="版本号："
          hasFeedback
        >
          <a-input placeholder="请输入版本号" maxlength="10"
                   v-decorator="['version', {rules: [{ required: true, message: '请输入版本号', }]}]"/>
        </a-form-item>
        <a-form-item label="附件" :wrapperCol="wrapperCol" :labelCol="labelCol">
          <a-upload
            name="file"
            :multiple="true"
            :headers="headers"
            :file-list="fileList"
            :customRequest="uploadFileRequest"
            @change="handleChange"
          >
            <a-button>
              <a-icon type="upload"/>
              上传
            </a-button>
          </a-upload>
          <div>
            <div v-for="(item,index) in model.filelist" :key="index">{{item.fileName}}</div>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>

  </a-modal>
</template>
<script>

  import pick from 'lodash.pick';
  import ARow from "ant-design-vue/es/grid/Row";
  import {getAction, httpAction} from '@/api/manage';
  import { disabledAuthFilter } from "@/utils/authFilter";
  import Vue from 'vue'
  import {ACCESS_TOKEN} from "@/store/mutation-types"


  export default {
    name:"AppFileModel",
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
        filelabelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        filewrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
        uploadLoading: false,
        headers: {},
        isArris: false,
        shopId:"",
        avatar:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add:"/kunze/client/add",
          edit:"/kunze/client/update",
          fileUpload:"/sys/common/upload",
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
        that.visible = true;
        if (record.address == undefined){
          record.filelist = [];
        } else {

          let fileName = record.address.substring(4);
          let file = {
            fileName: fileName
          };
          this.avatar=record.address
          record.filelist = [file];
        }
        that.form.resetFields();
        if (record.client == "2"){
          record.client = "安卓"
        }

        that.model = Object.assign({}, record);
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model, 'id','client', 'version'))
        });
      },
      uploadFileRequest(data){

/*        const timeStamp = new Date() - 0
        const nowDate = this.getDate();*/
        const copyFile = new File([data.file], `${data.file.name}`)
        this.formData=new FormData();
        this.formData.append("file",copyFile);
        this.formData.append("headers",this.headers);
        debugger
        httpAction(this.url.fileUpload,this.formData,"post").then((res)=>{
          debugger;
          if (res.success) {
            data.onSuccess(res);
          }
        }).catch(({err}) => {
          /*f.onError()*/
        })
      },
      handleChange(info) {

        if(info.file.status == undefined){
          info.fileList.some((item,i) => {
            if(item.uid == info.file.uid){
              info.fileList.splice(i,1);
            }
          })
        }else{
          if (info.file.status === 'uploading') {
            this.uploadLoading = true
            this.fileList = [...info.fileList];
            return
          }
          if (info.file.status === 'done') {
            var response = info.file.response;
            this.uploadLoading = false;
            if (response.success) {
              this.avatar = response.message;
              this.fileList = [...info.fileList];
              let fileItem = info.fileList.slice(-1);
              fileItem[0].id = response.message;
              Vue.set(info.fileList,info.fileList.length-1,fileItem[0])
            } else {
              this.$message.warning(response.message);
            }
            return
          }

          if(info.file.status === 'removed'){
            this.avatar = this.avatar.replace(info.file.id+',','')
          }
        }
      },
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            debugger;
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);
            formData.client = "2";
            formData.address = this.avatar;
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success("上传成功");
                that.$emit('ok');
              } else {
                that.$message.warning("上传失败");
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
        this.fileList=[];
      },
    }
  }
</script>