<template>
  <!--    管理分类-->
  <div>
    <a-card title="分类管理">
      <a-button type="primary" class="modifyBtn1" @click="adddjfl()">添加顶级分类</a-button>
      <a-table :columns="columns" :data-source="data" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="false" >
        <span slot="category" slot-scope="text,record">

          <img @click="addCategoriesImg(record)" v-if=" record.image!=''&&  record.image!=null" :src=record.images style="width: 40px;height: 40px;margin-left: 20px" />
          <a @click="addCategoriesImg(record)" v-if=" record.image==''|| record.image==null" style="margin-left: 20px">添加图片</a>
        </span>
        <span slot="isShow" slot-scope="text,record">
          <a-button type="primary" class="modifyBtn"  @click="shangjia(record)" v-if="record.show==1">展示</a-button>
          <a-button type="danger" class="modifyBtn" @click="shangjia(record)" v-if="record.show==0 || record.show==null">不展示</a-button>
        </span>
        <span slot="bianji" slot-scope="text,record">
          <a-button type="primary" class="modifyBtn" @click="modifyCategories(record)">修改</a-button>
          <a-button type="primary" @click="deleteCategories(record)">删除</a-button>
        </span>
      </a-table>
    </a-card>


    <!--    添加顶级分类弹出框-->
    <a-modal
      title="添加顶级分类"
      :visible="adddjvisible"
      :confirm-loading="confirmLoading"
      @ok="adddjhandleOk"
      @cancel="adddjhandleCancel"
    >
      <a-form :form="formadddjforms" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入分类名', }]}]"  />
        </a-form-item>
      </a-form>
    </a-modal>

    <!--    添加子分类弹出框-->
    <a-modal
      title="添加子分类"
      :visible="addvisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="formTranslates" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入分类名', }]}]" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!--    修改分类弹出框-->
    <a-modal
      title="修改分类"
      :visible="modifyvisible"
      :confirm-loading="confirmLoading"
      @ok="modifyhandleOk"
      @cancel="modifyhandleCancel"
    >
      <a-form :form="formmodifyforms" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入分类名', }]}]" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!--    三级分类添加图片弹出窗-->
    <a-modal
      title="添加图片"
      :visible="addvisibleImg"
      :confirm-loading="confirmLoading"
      @ok="addImgOk"
      @cancel="addImgCancel"
    >

      <a-form :form="formfileList1s" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类图片" hasFeedback>
          <j-image-upload  class="avatar-uploader" text="上传" v-decorator="['fileList1', {rules: [{ required: true, message: '请选择所要上传的图片', }]}]" ></j-image-upload>
        </a-form-item>
      </a-form>

    </a-modal>

  </div>
</template>

<script>
  import {postAction,httpAction} from '../../../api/manage'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import pick from 'lodash.pick'
  import 'url-search-params-polyfill'


  export default {    components: {
      JImageUpload
    },
    data() {
      return {
        selectedRowKeys:[],
        columns:[
          { title: '分类名称', dataIndex: 'name', key: 'name' },
          // { title: '排序', dataIndex: 'sort', key: 'sort', scopedSlots: { customRender: 'sort' } },
          { title: '图片', dataIndex: 'id', key: 'id', scopedSlots: { customRender: 'category' } },
          { title: '是否在首页展示', dataIndex: 'show', key: 'show', scopedSlots: { customRender: 'isShow' } },
          { title: '编辑', dataIndex: 'isflag', key: 'isflag', scopedSlots: { customRender: 'bianji' } },
        ],
        data:[],
        addvisible: false, //控制添加弹出框
        addvisibleImg:false, //控制添加图片弹出框
        adddjvisible: false, //控制添加弹出框
        modifyvisible: false, //控制添加弹出框
        confirmLoading: false,
        isdataimg:false,
        fileList1:{
          fileList1:""
        },
        fileList1ss:"",
        formTranslates: this.$form.createForm(this),
        formadddjforms:this.$form.createForm(this),
        formfileList1s:this.$form.createForm(this),
        formmodifyforms:this.$form.createForm(this),
        citem3:{},
        form:{
          name:'',
          isParent:'',
          sort:''
        },
        adddjform:{
          name:'',
          sort:''
        },
        pid:'',  //点击添加子分类获取到的父级
        modifyform:{
          name:''
        },
        ids:[]
      };
    },
    methods: {
      // 首页是否展示
      shangjia(e){

        let categoryHotel={}
        if(e.show==0 || e.show==null){
          categoryHotel={
            "id":e.id,
            "show":1
          }
        }else {
          categoryHotel={
            "id":e.id,
            "show":0
          }
        }

        postAction('/kunze/category/updateCategoryHotel',categoryHotel).then(res=>{
          console.log(res)
          if(res.success==true){
            this.$message.success('修改成功');
            this.getAllCategoriess()
          }else {
            this.$message.error('修改失败');
          }
        })
      },

      edit(record) {
        this.$nextTick(() => {
          this.formTranslates.setFieldsValue(pick(this.form, 'name'))
          this.formadddjforms.setFieldsValue(pick(this.adddjform, 'name'))
          this.formfileList1s.setFieldsValue(pick(this.fileList1, 'fileList1',))
          this.formmodifyforms.setFieldsValue(pick(this.modifyform, 'name'))
        });

      },

      onSelectChange(selectedRowKeys, selectedRows) {
        // console.log(selectedRows)
        let that=this
        selectedRows.forEach(e=>{
          that.ids.push(e.id)
        })
        // console.log(1,selectedRows)
      },

      //点击删除按钮
      deleteCategories(e){
        let id=e.id
        let param = new URLSearchParams()
        param.append('id',e.id)
        let that=this
        if(e.pid==0){
          this.$confirm({
            title: '确定要删除该分类吗?',
            content: '该分类包含多个子分类',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
              postAction('/kunze/category/delCategoryHotelById',param).then((res)=>{
                console.log(res)
                if(res.success==true){
                  that.$message.success(
                    '删除成功'
                  );
                  that.getAllCategoriess()
                }
              })
            },
            onCancel() {

            },
          })
        }else {
          this.$confirm({
            title: '删除',
            content: '确定要删除该分类吗',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
              postAction('/kunze/category/delCategoryHotelById',param).then((res)=>{
                console.log(res)
                if(res.success==true){
                  that.$message.success(
                    '删除成功'
                  );
                  that.getAllCategoriess()
                }
              })
            },
            onCancel() {

            },
          })
        }

      },
      // 点击修改取消按钮
      modifyhandleCancel(){
        this.modifyvisible=false
        this.modifyform.name=''
      },
      //点击修改确认按钮
      modifyhandleOk(){


        let that = this
        // 触发表单验证
        this.formmodifyforms.validateFields((err, values) => {
          if(values.name) {

            this.modifyvisible=false
            let categoryHotel ={
              id: this.pid,
              name: values.name,
            }
            postAction('/kunze/category/updateCategoryHotel',categoryHotel ).then((res)=>{
              console.log(res)
              if(res.success){
                this.$message.success(
                  '修改成功'
                );
                this.getAllCategoriess()
              }else {
                this.$message.error('修改失败');
                this.modifyform.name=''
              }

            })

          }
        })


      },
      // 点击修改按钮
      modifyCategories(e){
        this.pid=e.id
        this.modifyform.name=e.name
        this.modifyform.sort=e.sort
        this.modifyvisible=true
        this.$nextTick(() => {
          this.formmodifyforms.setFieldsValue(pick(this.modifyform, 'name','sort'))
        });
      },
      adddjhandleOk(){
        let that = this
        // 触发表单验证
        this.formadddjforms.validateFields((err, values) => {
          if(values.name) {
            that.adddjform.name = values.name


            let categoryHotel ={
              isParent:'1',
              name:values.name,
              pid:'0',
              image: "",
              index: "",
              isflag: "",
              shopId:localStorage.getItem('shopId')
            }
            postAction('/kunze/category/addCategoryHotel',categoryHotel).then((res)=>{
              console.log(res)
              if(res.success){
                this.$message.success(
                  '添加成功'
                );
                this.getAllCategoriess()
                this.adddjvisible=false
              }else {
                this.$message.error('添加失败');
                this.adddjvisible=false
              }
              this.adddjform.name=''
            })

          }
        })

      },
      adddjhandleCancel(){
        this.adddjvisible=false
        this.adddjform.name=''
        this.adddjform.sort=''
      },
      //点击添加顶级分类按钮
      adddjfl(){
        this.adddjvisible=true
      },
      // 点击添加子分类弹窗确认按钮
      handleOk(){
        console.log(this.pid)
        let that = this
        // 触发表单验证
        this.formTranslates.validateFields((err, values) => {
          if(values.name ){
            that.form.name=values.name

            this.addvisible=false
            let categoryHotel={
              isParent: 0,
              name:values.name,
              pid:that.pid,
              image: "",
              index: "",
              isflag: "",
              shopId:localStorage.getItem('shopId')
            }
            postAction('/kunze/category/addCategoryHotel',categoryHotel).then((res)=>{
              console.log(res)
              if(res.success){
                this.$message.success(
                  '添加成功'
                );
                this.getAllCategoriess()
              }else {
                this.$message.error('添加失败');
              }
              this.form.name=''

            })
          }
        })



      },

      // 点击添加子分类弹窗取消按钮
      handleCancel(){
        this.addvisible=false
        this.form.name=''
        this.form.sort=''
        this.form.isParent=''
      },
      addImgOk(){
        let that=this
        this.formfileList1s.validateFields((err, values) => {
          if(values.fileList1){
            delete this.citem3.children
            delete this.citem3.image
            delete this.citem3.childrenList
            let category=this.citem3
            category.image=values.fileList1
            console.log(category)
            postAction('/kunze/category/updateCategoryHotel',category ).then((res)=>{
              console.log(res)
              if(res.success==true){
                that.$message.success('添加图片成功')
                that.addvisibleImg=false
                this.getAllCategoriess()
              }else {
                that.$message.error('添加图片失败')
                that.addvisibleImg=false
                this.getAllCategoriess()
              }
            })
          }
        })



      },
      addImgCancel(){

        this.addvisibleImg=false
      },
      //点击三级分类添加图片
      addCategoriesImg(e){
        console.log(e)

          if(e.image==null){
            this.fileList1.fileList1=''
            this.$nextTick(() => {
              this.formfileList1s.setFieldsValue(pick(this.fileList1, 'fileList1',))
            });
          }else {
            this.fileList1.fileList1= window._CONFIG['staticDomainURL'] +"/"+e.image
            this.$nextTick(() => {
              this.formfileList1s.setFieldsValue(pick(this.fileList1, 'fileList1',))
            });
          }
          this.citem3=e
          this.addvisibleImg=true

      },
      // 点击添加子集分类
      addCategories(e){
        // console.log(e)
        this.pid=e.id
        this.addvisible=true
      },
      // 获取全部分类
      getAllCategoriess(){
        console.log(localStorage.getItem('shopId'))
        let param = new FormData()
        param.append('shopId',localStorage.getItem('shopId'))
        param.append('isShow ',false)
        postAction('/kunze/category/getHotelMenu',param).then((res)=>{
          console.log(res.result)
          let key=0
          res.result.forEach(e=>{
            e.key=key++

            e.images= window._CONFIG['staticDomainURL']+'/'+ e.image



          })
          this.data=res.result
          console.log(this.data)
        })
      }
    },
    mounted(){
      this.getAllCategoriess()
    }
  };
</script>

<style scoped>
  .modifyBtn{
    margin-right: 10px;
  }
  .modifyBtn1{
    margin-bottom: 10px;
    margin-right: 10px;
  }
</style>
