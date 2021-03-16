<template>
<!--    管理分类-->
  <div>
    <div>
    <a-card title="分类管理" >
      <a-button type="primary" class="modifyBtn1" @click="deleteAllCategories()">批量删除</a-button>
      <a-button type="primary" class="modifyBtn1" @click="adddjfl()">添加顶级分类</a-button>
      <a-table :columns="columns" :data-source="data" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="false" >
<!--        <span slot="sort" slot-scope="text,record" >-->
<!--            <a @click="addCategories(record)">排序</a>-->
<!--        </span>-->
        <span slot="category" slot-scope="text,record">

          <a @click="addCategories(record)" v-if="record.isParent==1">添加子分类</a>
          <img @click="addCategoriesImg(record)" v-if="record.parentId!=0 && record.children && record.image!=null" :src=record.image style="width: 40px;height: 40px;margin-left: 20px" />
          <a @click="addCategoriesImg(record)" v-if="record.parentId!=0 && record.children && record.image==null" style="margin-left: 20px">添加图片</a>
<!--          <a @click="addCategoriesImg('no')" v-if="!record.children" style="margin-left: 20px" >添加子分类</a>-->
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
      <a-form :form="formadddjform" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入分类名', }]}]"  />
        </a-form-item>
        <a-form-item label="排序" hasFeedback>
          <a-input  v-decorator="['sort', {rules: [{ required: true, message: '请输入排序', }]}]"  />
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
      <a-form :form="formTranslate" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入分类名', }]}]" />
        </a-form-item>
<!--        <a-form-item label="是否是父级分类" hasFeedback>-->
<!--          <a-input v-model="form.isParent"  placeholder="1代表是，0表示否" />-->
<!--        </a-form-item>-->
        <a-form-item label="排序" hasFeedback>
          <a-input  v-decorator="['sort', {rules: [{ required: true, message: '请输入排序', }]}]" />
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
      <a-form :form="formmodifyform" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入分类名', }]}]" />
        </a-form-item>
        <a-form-item label="排序" hasFeedback>
          <a-input  v-decorator="['sort', {rules: [{ required: true, message: '请输入排序', }]}]" />
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

      <a-form :form="formfileList1" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="分类图片" hasFeedback>
          <j-image-upload  class="avatar-uploader" text="上传" v-decorator="['fileList1', {rules: [{ required: true, message: '请选择所要上传的图片', }]}]" ></j-image-upload>
        </a-form-item>
      </a-form>

    </a-modal>

  </div>
  </div>
</template>

<script>
  import {getAction,postAction,deleteAction} from '../../../api/manage'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import pick from 'lodash.pick'
  import 'url-search-params-polyfill'
  import classification from "./classification"

  export default {
    components: {
      JImageUpload
    },
        data() {
            return {
              shopType:"",
              selectedRowKeys:[],
              columns:[
                { title: '分类名称', dataIndex: 'name', key: 'name' },
                // { title: '排序', dataIndex: 'sort', key: 'sort', scopedSlots: { customRender: 'sort' } },
                { title: '添加子分类', dataIndex: 'id', key: 'id', scopedSlots: { customRender: 'category' } },
                { title: '编辑', dataIndex: 'isflag', key: 'isflag', scopedSlots: { customRender: 'bianji' } },
              ],
              data:[],
              parentId:"",
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
              formTranslate: this.$form.createForm(this),
              formadddjform:this.$form.createForm(this),
              formfileList1:this.$form.createForm(this),
              formmodifyform:this.$form.createForm(this),
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


          edit(record) {
            this.$nextTick(() => {
              this.formTranslate.setFieldsValue(pick(this.form, 'name', 'sort'))
              this.formadddjform.setFieldsValue(pick(this.adddjform, 'name', 'sort'))
              this.formfileList1.setFieldsValue(pick(this.fileList1, 'fileList1',))
              this.formmodifyform.setFieldsValue(pick(this.modifyform, 'name','sort'))
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
          // 点击批量删除按钮
          deleteAllCategories(){
            let that=this
            this.$confirm({
              title: '确定要删除该分类吗?',
              content: '该分类包含多个子分类',
              okText: '确定',
              okType: 'primary',
              cancelText: '取消',
              onOk() {
                let param = new URLSearchParams()
                param.append('ids',that.ids)
                deleteAction('/kunze/category/categoryDels',param).then((res)=>{

                  if(res.success==true){
                    that.$message.success(
                      '删除成功'
                    );
                    that.getAllCategories()
                    that.selectedRowKeys=[]
                  }else {
                    that.$message.error(
                      '删除失败'
                    );
                    that.getAllCategories()
                    that.selectedRowKeys=[]
                  }
                })
              },
              onCancel() {

              },
            });
          },
          //点击删除按钮
          deleteCategories(e){
            let id=e.id
            let that=this
            this.$confirm({
              title: '确定要删除该分类吗?',
              content: '该分类包含多个子分类',
              okText: '确定',
              okType: 'primary',
              cancelText: '取消',
              onOk() {
                deleteAction('/kunze/category/categoryDel',{id:id}).then((res)=>{
                  if(res.success==true){
                    that.$message.success(
                      '删除成功'
                    );
                    that.getAllCategories()
                  }
                })
              },
              onCancel() {

              },
            });
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
            this.formmodifyform.validateFields((err, values) => {
                if(values.name && values.sort) {
                  // that.adddjform.name = values.name
                  // that.adddjform.sort = values.sort

                  this.modifyvisible=false
                  let category={
                    id: this.pid,
                    name: values.name,
                    sort: values.sort,
                  }
                  postAction('/kunze/category/categoryUpdate',category).then((res)=>{
                    if(res.success){
                      this.$message.success(
                        '修改成功'
                      );
                      this.getAllCategories()
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
                this.formmodifyform.setFieldsValue(pick(this.modifyform, 'name','sort'))
              });
          },
          adddjhandleOk(){
            let that = this
            // 触发表单验证
            this.formadddjform.validateFields((err, values) => {
                if(values.name && values.sort) {
                  that.adddjform.name = values.name
                  that.adddjform.sort = values.sort


                    let category={
                      isParent:'1',
                      name:values.name,
                      parentId:'0',
                      image: "string",
                      index: "string",
                      isflag: "string",
                      sort:values.sort
                    }
                    postAction('/kunze/category/categorySave',category).then((res)=>{
                      console.log(res)
                      if(res.success){
                        this.$message.success(
                          '添加成功'
                        );
                        this.adddjvisible=false
                        this.getAllCategories()
                        this.adddjform.name=''
                        this.adddjform.sort=''
                      }else {
                        this.$message.error('添加失败');
                        this.adddjvisible=false
                        this.getAllCategories()
                        this.adddjform.name=''
                        this.adddjform.sort=''
                      }

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
            let that = this
            // 触发表单验证
            this.formTranslate.validateFields((err, values) => {
              if(values.name && values.sort){
                that.form.name=values.name
                that.form.sort=values.sort
                // if(record.parentId!=0 && record.children && record.image==null)
                debugger
                this.addvisible=false
                let category={}
                if(that.parentId==0){
                   category={
                    isParent:1,
                    name:values.name,
                    parentId:that.pid,
                    image: "string",
                    index: "string",
                    isflag: "string",
                    sort:values.sort
                  }
                }else {
                   category={
                    isParent:0,
                    name:values.name,
                    parentId:that.pid,
                    image: "string",
                    index: "string",
                    isflag: "string",
                    sort:values.sort
                  }
                }

                    postAction('/kunze/category/categorySave',category).then((res)=>{
                      console.log(res)
                      if(res.success){
                        this.$message.success(
                          '添加成功'
                        );
                        this.getAllCategories()
                      }else {
                        this.$message.error('添加失败');
                      }
                      this.form.name=''
                      this.form.sort=''
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
            this.formfileList1.validateFields((err, values) => {
                if(values.fileList1){
                  let children=JSON.stringify(this.citem3.children)
                  delete this.citem3.children
                  delete this.citem3.image
                  delete this.citem3.childrenList
                  let category=this.citem3
                    category.image=values.fileList1
                    category.children=children
                  // console.log(category)
                  postAction('kunze/category/categoryUpdate',category ).then((res)=>{
                      // console.log(res)
                      if(res.success==true){
                        that.$message.success('添加成功')
                        that.addvisibleImg=false
                        this.getAllCategories()
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
            if(e=='no'){
              this.$message.error('三级分类，不可以添加子分类')
            }else {
              if(e.image==null){
                this.fileList1.fileList1=''
                this.$nextTick(() => {
                  this.formfileList1.setFieldsValue(pick(this.fileList1, 'fileList1',))
                });
              }else {
                this.fileList1.fileList1= window._CONFIG['staticDomainURL'] +"/"+e.image
                this.$nextTick(() => {
                  this.formfileList1.setFieldsValue(pick(this.fileList1, 'fileList1',))
                });
              }
              this.citem3=e
              this.addvisibleImg=true
            }


          },
          // 点击添加子集分类
          addCategories(e){
            debugger
            // console.log(e)
            this.pid=e.id
            this.parentId=e.parentId
            this.addvisible=true

          },
          // 获取全部分类
          getAllCategories(){
            let param = new URLSearchParams()
            param.append('cateId','')
            postAction('/kunze/category/qryList',param).then((res)=>{
              console.log(res)
              this.data=res.result
              let key=0
              this.data.forEach(e=>{
                e.key=key++
                e.children=JSON.parse(JSON.stringify(e.childrenList))
                e.childrenList=[]
                if(e.children!=null){
                  e.children.forEach(e=>{

                    e.key=key++
                    if(e.image!=null){
                      e.image= window._CONFIG['staticDomainURL']+'/'+ e.image
                    }

                    e.children=JSON.parse(JSON.stringify(e.childrenList))
                    e.childrenList=[]
                    if(e.children!=null){
                      e.children.forEach(e=>{
                        e.key=key++
                      })
                    }

                  })
                }

              })

            })
          }
        },
        mounted(){
          this.shopType=localStorage.getItem('shopType')
          this.getAllCategories()
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
