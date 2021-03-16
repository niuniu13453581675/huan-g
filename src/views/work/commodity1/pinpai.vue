<template>
  <!--    商品品牌-->
  <div>
    <a-card title="品牌管理" >
      <a-button type="primary" class="modifyBtn1" @click="deleteAllBrandBtn()">批量删除</a-button>
      <a-button type="primary" class="modifyBtn1" @click="addBrandBtn()">添加商品品牌</a-button>
      <a-table :columns="columns" :data-source="data" :row-selection="{  onChange: onSelectChange }" >
        <span slot="avatarslot" slot-scope="text,record">
          <!-- <img :src="getAvatarView(record.image)" alt="" >-->
            <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
        </span>
<!--        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
          </div>
        </template>-->
        <span slot="bianji" slot-scope="text,record">
          <a-button type="primary" class="modifyBtn" @click="xiuBrandBtn(record)">修改</a-button>
          <a-button type="primary" @click="deleteBrandBtn(record)">删除</a-button>
        </span>
      </a-table>
    </a-card>

<!--    添加商品品牌弹出框-->
    <a-drawer
      title="添加商品品牌"
      :width="720"
      :visible="addBrandvisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onBrandClose"
    >
      <a-form :form="formTranslate" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" >
        <a-form-item label="品牌名" hasFeedback>
          <a-input  v-decorator="['name', {rules: [{ required: true, message: '请输入品牌名称', }]}]" />
        </a-form-item>
          <a-form-item label="首字母" hasFeedback>
          <a-input  v-decorator="['letter', {rules: [{ required: true, message: '请输入品牌名称首字母', }]}]" maxLength="1" />
        </a-form-item>
        <a-form-item label="所属分类ID" hasFeedback>
          <a-cascader
            :field-names="{ label: 'name', value: 'id', children: 'childrenList'}"
            :options="options"
            placeholder="选择所属分类"
            @change="onChangeShop"
            v-decorator="['kid',{rules: [{ type: 'array', required: true, message: '请选择所属分类' }]}]"
          />
        </a-form-item>
        <a-form-item label="品牌商标" hasFeedback>
          <j-image-upload class="avatar-uploader" text="上传"   v-decorator="['fileList',{rules: [{  required: true, message: '请上传商标' }]}]"></j-image-upload>
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
      <a-button :style="{ marginRight: '8px' }" @click="onBrandClose">
        取消
      </a-button>
      <a-button type="primary" @click="addBrandConfirm">
        确认
      </a-button>
      </div>
    </a-drawer>

    <!--    修改商品品牌弹出框-->
    <a-drawer
      title="修改商品品牌"
      :width="480"
      :visible="xiuBrandvisible"
      :body-style="{ paddingBottom: '80px' }"
      @close="xiuBrandClose"
    >
      <a-form :form="formTranslate" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }" >
        <a-form-item label="品牌名" hasFeedback>
          <a-input   v-decorator="['name', {rules: [{ required: true, message: '请输入品牌名称', }]}]" />
        </a-form-item>
        <a-form-item label="首字母" hasFeedback>
          <a-input   v-decorator="['letter', {rules: [{ required: true, message: '请输入品牌名称首字母', }]}]" maxLength="1" />
        </a-form-item>
        <a-form-item label="所属分类ID" hasFeedback>

            <a-cascader
              :field-names="{ label: 'name', value: 'id', children: 'childrenList'}"
              :options="options"
              placeholder="选择所属分类"
              @change="onChangeShop"
              v-decorator="['kid',{rules: [{ type: 'array', required: true, message: '请选择所属分类' },],},]"

            />
          </a-form-item>

        <a-form-item label="品牌商标" hasFeedback>
          <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['fileList',{rules: [{  required: true, message: '请上传商标' }]}]"></j-image-upload>
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button :style="{ marginRight: '8px' }" @click="xiuBrandClose">
          取消
        </a-button>
        <a-button type="primary" @click="xiuBrandConfirm">
          确认
        </a-button>
      </div>
    </a-drawer>

  </div>
</template>

<script>
  import {getAction,postAction,deleteAction,getFileAccessHttpUrl} from '@/api/manage'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import pick from 'lodash.pick'
  import 'url-search-params-polyfill'


  export default {
    components: {
      JImageUpload
    },
    data() {
      return {
        formTranslate: this.$form.createForm(this),
        columns:[
          {
            title: '序号',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          { title: '品牌名称', dataIndex: 'bname', key: 'bname' },
          { title: '商标', dataIndex: 'image', key: 'image',scopedSlots: { customRender: 'avatarslot' } },
          { title: '首字母', dataIndex: 'letter', key: 'letter' },
          { title: '更新人', dataIndex: 'updateName', key: 'updateName' },
          { title: '所属分类', dataIndex: 'kname', key: 'kname' },
          { title: '编辑', dataIndex: 'isflag', key: 'isflag', scopedSlots: { customRender: 'bianji' } },
        ],
        data:[],
        addBrandvisible:false,
        xiuBrandvisible:false,
        fileList:[],
        brandForm:{
          name:'',
          letter:'',
          kid:'',
          image:''
        },
        cids:[],
        xiubrandForm:{
          name:'',
          letter:'',
          kid:'',
          image:'',
        },
        bids:[],

        url:{
          imgerver:window._CONFIG['staticDomainURL'],
        }
      };
    },
    methods: {
      //获取所有分类
      getAllCid(){
        let param = new URLSearchParams()
        param.append('cateId','')
        postAction('/kunze/category/qryList',param).then((res)=>{
          this.options=res.result
        })
      },
      onChangeShop(e){
        console.log(e)
      },
      edit(record) {
        this.$nextTick(() => {
          this.formTranslate.setFieldsValue(pick(this.xiubrandForm, 'name', 'letter','kid',"fileList"))
        });

      },
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      // 点击批量删除按钮
      deleteAllBrandBtn(){

        let that=this
        this.$confirm({
            title: '确定要删除该这些品牌吗?',
            content: '确定要删除该这些品牌吗',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
              let param = new URLSearchParams()
              param.append('bids', that.bids)
              deleteAction('/kunze/brand/delBrands', param).then((res) => {
                if(res.success==true){
                  that.$message.success('删除成功');
                  that.getAllBrand()
                }else {
                  that.$message.warning('删除失败');
                }
              })
            }
      })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        let that=this
        selectedRows.forEach(e=>{
          that.bids .push(e.bid)
        })
      },
      //点击删除按钮
      deleteBrandBtn(e){
        let that=this
        let bid=e.bid
        this.$confirm({
            title: '确定要删除该这些品牌吗?',
            content: '确定要删除该这些品牌吗',
            okText: '确定',
            okType: 'primary',
            cancelText: '取消',
            onOk() {
        deleteAction('/kunze/brand/delBrand',{bid:bid}).then((res)=>{
          if(res.success==true){
            that.$message.success('删除成功');
            that.getAllBrand()
          }else {
            that.$message.warning('删除失败');
          }
        })
      }
        })
      }
      ,
      // 点击修改按钮
      xiuBrandBtn(e){
        this.xiubrandForm.id=e.bid
        this.xiubrandForm.name=e.bname
        this.xiubrandForm.letter=e.letter
        this.xiubrandForm.kid=e.kid
        this.xiubrandForm.fileList=e.image
        this.xiuBrandvisible=true
        this.$nextTick(() => {
          this.formTranslate.setFieldsValue(pick(this.xiubrandForm, 'name', 'letter','kid','fileList'))
        });

      },
      // 点击修改确认按钮
      xiuBrandConfirm(){


        let that = this
        // 触发表单验证
        this.formTranslate.validateFields((err, values) => {
          console.log(values.name, values.letter, values.kid)
          if(values.name && values.letter && values.kid){

              that.xiubrandForm.image=that.fileList
              let brandVo={
                'id':that.xiubrandForm.id,
                "image":that.xiubrandForm.image ,
                "kid": JSON.stringify(values.kid),
                "letter": values.letter,
                "name": values.name
              }
            console.log(brandVo)
            postAction('/kunze/brand/updateBrand',brandVo).then((res)=>{
                console.log(res)
                if(res.success){
                  this.$message.success(res.message);
                  this.getAllBrand()
                  that.xiuBrandvisible=false
                  that.xiubrandForm.name=''
                  that.xiubrandForm.letter=''
                  that.xiubrandForm.kid=''
                  that.xiubrandForm.image=''
                  that.xiubrandForm.id=''
                  that.fileList=[]
                }else {
                  this.$message.warning(res.message);
                  that.xiuBrandvisible=false
                  that.xiubrandForm.name=''
                  that.xiubrandForm.letter=''
                  that.xiubrandForm.kid=''
                  that.xiubrandForm.image=''
                  that.xiubrandForm.id=''
                  that.fileList=[]
                }

              })


          }
        })






      },
      // 点击添加确认按钮
      addBrandConfirm(){
          let that=this
        this.formTranslate.validateFields((err, values) => {
          if(values.name && values.letter && values.kid && values.fileList){
            that.brandForm.image=that.fileList
              let brandVo={
                name:values.name,
                letter:values.letter,
                kid:JSON.stringify(values.kid),
                image:values.fileList
              }
              console.log(brandVo)
              postAction('/kunze/brand/saveBrand',brandVo).then((res)=>{
                console.log(res)
                if(res.success==true){
                  this.$message.success('品牌添加成功');
                  this.getAllBrand()
                  that.addBrandvisible=false
                  that.brandForm.name=''
                  that.brandForm.letter=''
                  that.brandForm.kid=''
                  that.brandForm.image=''
                  that.fileList=[]
                }else {
                  this.$message.warning('品牌添加失败');
                  that.addBrandvisible=false
                  that.brandForm.name=''
                  that.brandForm.letter=''
                  that.brandForm.kid=''
                  that.brandForm.image=''
                  that.fileList=[]
                }
              })
          }
        })


      },
      // 点击添加按钮
      addBrandBtn(){
        this.addBrandvisible=true
      },
      // 点击关闭添加弹窗
      onBrandClose(){
        this.addBrandvisible=false
        this.brandForm.name=''
        this.brandForm.letter=''
        this.brandForm.kid=''
        this.brandForm.image=''
        this.fileList=[]
        this.$nextTick(() => {
          this.formTranslate.setFieldsValue(pick(this.xiubrandForm, 'name', 'letter','kid','fileList'))
        });
      },
      // 点击关闭修改弹窗
      xiuBrandClose(){
        this.xiuBrandvisible=false
        this.xiubrandForm.name=''
        this.xiubrandForm.letter=''
        this.xiubrandForm.kid=''
        this.xiubrandForm.image=''
        this.fileList=[]
        this.$nextTick(() => {
          this.formTranslate.setFieldsValue(pick(this.xiubrandForm, 'name', 'letter','kid','fileList'))
        });
      },
      // 获取全部分类
      getAllBrand(){
        let that=this
        getAction('/kunze/brand/qryBrandList',{pageSize:1,pageNo:1}).then((res)=>{
          getAction('/kunze/brand/qryBrandList',{pageSize:res.result.pages}).then((res)=>{
           that.data=res.result.list
            let key=0
            that.data.forEach(e=>{
              e.key=key++
            })
            console.log(that.data,111)
          })
        })

      }
    },
    mounted(){
      this.getAllBrand()
      this.getAllCid()
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
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
</style>
