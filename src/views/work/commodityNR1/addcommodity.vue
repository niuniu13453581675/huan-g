<template>
<!--    新增商品-->
  <div>
    <template v-if="shopType==1">
      <a-card title="新增商品">
        <div style="width: 65%">
          <template>
            <a-steps :current="current" class="jdt">
              <a-step>
                <!-- <span slot="title">Finished</span> -->
                <template slot="title">
                  基本信息
                </template>
              </a-step>
              <a-step>
                <template slot="title">
                  参数规格
                </template>
              </a-step>
              <a-step>
                <template slot="title">
                  商品描述
                </template>
              </a-step>
            </a-steps>
          </template>
    <!--第一步-->
        <template v-if="current==0">
          <a-form
            :form="formTranslate"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item label="标题"  hasFeedback>
              <a-input  maxlength="150" v-decorator="['title', {rules: [{ required: true, message: '请输入商品名称', }]}]" />
            </a-form-item>
            <a-form-item label="子标题" hasFeedback>
              <a-input  maxlength="200" v-decorator="['subTitle', {rules: [{ required: true, message: '请输入子标题', }]}]" />
            </a-form-item>
            <a-form-item label="商品条码" hasFeedback>
              <a-input  type="number"  placeholder="请填写国码或者自编码" maxlength="200" v-decorator="['barCode', {rules: [{ required: true, message: '请输入条码', }]}]" />
            </a-form-item>
    <!--        <a-form-item label="品牌" hasFeedback>-->
    <!--          <a-select  placeholder="选择品牌"  v-decorator="['brand', {rules: [{ required: true, message: '请选择选择品牌', }]}]"  >-->
    <!--          <a-select-option  v-for="v in brand" :value=v.bid :key="v.keys">-->
    <!--            {{v.bname}}-->
    <!--          </a-select-option>-->
    <!--        </a-select>-->
    <!--        </a-form-item>-->
          </a-form>
          <div style="margin-left: 35%">
            <a-button type="primary" disabled style="margin-right: 20px">
              上一步
            </a-button>
            <a-button type="primary" @click="nextStep">
              下一步
            </a-button>
          </div>

        </template>

    <!--第二步-->
          <template v-if="current==1">
            <a-form
              :form="formTranslate"
              :label-col="{span:9}"
              :wrapper-col="{span:15}"
            >
                    <a-form-item label="分类" hasFeedback >
                      <a-input v-model="fenl"  type="hidden" />
                      <a-cascader
                        :field-names="{ label: 'name', value: 'id', children: 'childrenList' }"
                        :options="options"
                        placeholder="选择所属分类"
                        @change="onChange"
                      />
                    </a-form-item>
                    <template v-if="dxuandatas.length!=0">
                      <a-form-item label="选择参数" >
                        <template v-for="(v,e) in dxuandatas">
                          <template v-for="(x,i) in v.params">
                            <template v-if="x.options!='' && x.global=='false'">
                              <a-row>
                                <a-col :span="4">
                                  <span class="fenzu">{{x.k}}:</span>
                                </a-col>
                                <a-col :span="20">
                                  <a-radio-group  :name=x.k :v-model=x.value :options="x.options" :default-value="x.options[0]" @change="onChange2" />
                                </a-col>
                              </a-row>
                              <br />
                            </template>
                          </template>
                        </template>
                        <template v-for="(v,e) in specifications">
                          <template v-for="(x,i) in v.params">
                            <a-row>
                              <a-col :span="4">
                                <span class="fenzu">{{x .k}}:</span>
                              </a-col>
                              <a-col :span="20">
    <!--                            <a-input  v-model="x.v" />-->
                                <a-input ref="userNameInput" v-model="x.v" >
                                  <a-tooltip slot="suffix" title="删除该属性">
                                    <a-icon type="delete" style="color: rgba(0,0,0,.45)" @click="deleteSpec(e,i) " />
                                  </a-tooltip>
                                </a-input>
                              </a-col>
                            </a-row>
                          </template>
                        </template>
                      </a-form-item>
                    </template>
                    <a-form-item label="销售价格" hasFeedback>
                      <a-input  placeholder="单位为元" maxlength="10" v-decorator="['price', validatorRules.spuPrice]" />
                    </a-form-item>
                    <a-form-item label="优惠价格" hasFeedback>
                      <a-input  placeholder="单位为元" maxlength="10" v-decorator="['newPrice', validatorRules.spuNewPrice]" />
                    </a-form-item>
                    <a-form-item label="商品库存" maxlength="10"  hasFeedback>
                      <a-input   v-decorator="['stock', validatorRules.Stock]"  />
                    </a-form-item>
                    <a-form-item label="商品图片" hasFeedback>
                      <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['image', {rules: [{ required: true, message: '请上传商品图片', }]}]" ></j-image-upload>
                    </a-form-item>

            </a-form>
            <div style="margin-left: 35%">
              <a-button type="primary"  style="margin-right: 20px" @click="nextStep1" >
                上一步
              </a-button>
              <a-button type="primary" @click="determine" style="margin-right: 20px">
                保存并再次添加
              </a-button>
              <a-button type="primary" @click="nextStep2">
                下一步
              </a-button>
            </div>

          </template>

          <!--第三步-->
          <template v-if="current==2">
            <a-form
              :model="form"
              :label-col="{span:10}"
              :wrapper-col="{span:14}"
            >
                    <a-form-item label="商品图片" >
                      <j-image-upload class="avatar-uploader" text="上传" v-model="fileList" ></j-image-upload>
                    </a-form-item>
                    <a-form-item label="商品轮播图片" >
                      <j-image-upload class="avatar-uploader" text="上传" v-model="bannerImg1" style="width: 104px;margin-right: 30px;float: left"></j-image-upload>
                      <j-image-upload class="avatar-uploader" text="上传" v-model="bannerImg2" style="width: 104px;margin-right: 30px;float: left"></j-image-upload>
                      <j-image-upload class="avatar-uploader" text="上传" v-model="bannerImg3" style="width: 104px;float: left "></j-image-upload>
                    </a-form-item>
                    <a-form-item label="包装清单"  >
                      <!--<a-input v-model="form.packingList" />-->
                        <a-textarea placeholder="请输入包装清单" maxlength="500" v-model="form.packingList" />
                    </a-form-item>
                    <a-form-item label="售后服务"   >
                      <!--<a-input v-model="form.afterService" />-->
                      <a-textarea placeholder="请输入售后服务" maxlength="500" v-model="form.afterService" />
                    </a-form-item>
                    <a-form-item label="商品描述" >
                      <j-editor v-model="form.description"/>
                    </a-form-item>

            </a-form>
            <div style="margin-left: 45%">
              <a-button type="primary"  style="margin-right: 20px" @click="nextStep3">
                上一步
              </a-button>
              <a-button type="primary" @click="onSubmit">
                确定添加
              </a-button>
            </div>

          </template>


        </div>
      </a-card>
    </template>

<!--    //饭店添加商品-->
    <template v-if="shopType==2">
      <a-card title="新增商品">

      <a-form   :form="hotelFormdata"  :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" >

        <a-form-item label="标题"  hasFeedback>
          <a-input  maxlength="150" v-decorator="['title', {rules: [{ required: true, message: '请输入商品名称', }]}]" />
        </a-form-item>
        <a-form-item label="商品介绍" hasFeedback>
          <a-input  maxlength="200" v-decorator="['skuInfo', {rules: [{ required: true, message: '请输入商品介绍', }]}]" />
        </a-form-item>
        <a-form-item label="价格"  hasFeedback>
          <a-input  maxlength="150" v-decorator="['price', {rules: [{ required: true, message: '请输入商品价格', }]}]" />
        </a-form-item>
        <a-form-item label="优惠价格"  hasFeedback>
          <a-input  maxlength="150" v-decorator="['newPrice', {rules: [{ required: false, message: '请输入商品名称', }]}]" />
        </a-form-item>


        <a-form-item label="所属分类" hasFeedback>
          <a-select  placeholder="选择分类"  v-decorator="['residence', {rules: [{ required: true, message: '请选择选择分类', }]}]"  >
            <a-select-option  v-for="v in residences" :value=v.id :key="v.name">
              {{v.name}}
            </a-select-option>
          </a-select>
        </a-form-item>


        <a-form-item label="商品图片" hasFeedback>
          <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['images', {rules: [{ required: true, message: '请上传商品图片', }]}]" ></j-image-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit" @click="handleSubmit()">
            提交
          </a-button>
        </a-form-item>
      </a-form>
      </a-card>
    </template>


  </div>

</template>

<script>
  import { getAction, httpAction, postAction } from '@/api/manage'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import JEditor from '@/components/jeecg/JEditor'
  import Vue from 'vue'
  import pick from 'lodash.pick'
  import moment from 'moment'
  import 'url-search-params-polyfill'
  import ATextarea from "ant-design-vue/es/input/TextArea";
  export default {
    name: 'addcommodity',
    components: {
      ATextarea,
      JImageUpload,
      JEditor
    },
      data(){
        return{
          bb:'',
          shopType:"",
          fenl:'',
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
          other: '',
          current:0,
          skuVos:[],
          shopId:"",
          form: {
            brand:'',
            price:"",
            stock:'',
            description:'',
            afterService:'',
            packingList:'',
            subTitle:'',
            title:'',
            image:'',
            newPrice:'',
            barCode:""
          },
          residences:[],
          hotelForm:{},
          brand:[],  //品牌的集合
          options:[],  //分类级联下拉
          dxuandatas:[],  //参数集合
          ownSpec:{},
          indexes:[],
          index:[],
          spuPrice:"",
          specTemplate:{},
          specifications:[],
          fileList:[],
          bannerImg1:'',
          bannerImg2:'',
          bannerImg3:'',
          cids:[],
          validatorRules:{
            spuPrice: {
              rules: [{required: true,validator: this.checkSpuPrice}]
            },
            spuNewPrice: {
              rules: [{required: false,validator: this.checkSpuNewPrice}]
            },
            Stock:{
              rules: [{required: true,validator: this.checkStock}]
            },
          },
          formTranslate: this.$form.createForm(this),
          hotelFormdata: this.$form.createForm(this),
        }
      },
      methods:{
      //饭店
        handleSubmit(){
          let that=this
          this.hotelFormdata.validateFields((err, values) => {
            if(values.title && values.skuInfo &&values.images && values.price && values.residence){
              let hotelSku ={
                "cid":values.residence,
                "images": values.images,
                "newPrice": values.newPrice,
                "price": values.price,
                "shopId": this.shopId,
                "skuInfo": values.skuInfo,
                "title": values.title,
              }
              console.log(hotelSku)
              postAction('/kunze/sku/addHotelSku',hotelSku).then((res)=>{
                console.log(res)
                if(res.success==true){
                  that.$message.success('添加成功')
                  this.hotelFormdata.resetFields()
                }
              })
            }
          })

        },







      //点击删除专属属性
        deleteDxuandatas(e,i,t){
          console.log(e, i)
          this.dxuandatas[e].params.splice(i,1)
          this.dxuandatas.forEach((x,y)=>{
            if(x.params.length==0){
              this.dxuandatas.splice(y,1)
            }
          })

          for(let key in this.ownSpec){
            if(t==key){
              delete this.ownSpec[key];
            }
          }
          this.indexes.splice(i,1)
          console.log(this.dxuandatas)
        },
      //点击删除全局属性
        deleteSpec(e,i){
          this.specifications[e].params.splice(i,1)
          this.specifications.forEach((x,y)=>{
            if(x.params.length==0){
              this.specifications.splice(y,1)
            }
          })
        },
        edit(record) {
          this.$nextTick(() => {
            this.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','brand','price','stock','image','newPrice','barCode'))
            this.hotelFormdata.setFieldsValue(pick(this.hotelForm, 'title', 'skuInfo','images','price','newPrice','residence'))
          });
        },
      // 点击下一步
        nextStep(){
          let that = this
          // 触发表单验证
          this.formTranslate.validateFields((err, values) => {
            if(values.title && values.subTitle && values.barCode){
              if(values.barCode.length>16){
                this.$message.warning('商品条码不得大于16位');
                return;
              }
              that.form.title=values.title
              that.form.subTitle=values.subTitle
              that.form.barCode=values.barCode
              // that.form.brand=values.brand
              this.current=this.current-(-1)
            }
          })
        },
        nextStep1(){
          this.current=this.current-1

          this.$nextTick(() => {
            this.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','brand','price','stock','image','newPrice','barCode'))
          });
        },
        nextStep2(){
          // console.log(this.specifications)
          this.formTranslate.validateFields((err, values) =>{
            debugger;
            if (values.price && values.stock && values.image){
              if(this.indexes.length==0 && this.specifications.length==0){
                this.$message.warning('请选择所属分类');
              }else {
                if(this.specifications.length!=0){

                }
              if (this.indexes.length != 0) {

                let nn = 0
                this.specifications.forEach(e => {
                  e.params.forEach(e=>{
                    if(e.v==''){
                      this.$message.error('请填写'+e.k);
                    }else {
                      nn+=1
                    }
                  })
                })
                if (nn == this.specifications.length) {
                  if(values.newPrice==undefined){
                    values.newPrice = "";
                  }
                  // this.specifications
                  this.skuVos.push({
                    indexes: this.indexes,
                    ownSpec: this.ownSpec,
                    price: values.price,
                    newPrice: values.newPrice,
                    stock: values.stock,
                    images: values.image
                  })
                  this.current = this.current - (-1)
                }

              }}

            }
          })
        },
        nextStep3(){
          this.current=this.current-1
          this.$nextTick(() => {
            this.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','brand','price','stock','image','newPrice','barCode'))
          });
        },
        determine(){
          this.formTranslate.validateFields((err, values) => {
            if(values.price && values.stock &&values.image && values.newPrice){
              if(this.indexes.length==0 && this.specifications.length==0){
                this.$message.warning('请选择所属分类');
              }else {
                if(this.specifications.length!=0){

                  let nn=0
                  this.specifications.forEach(e=>{
                    e.params.forEach(e=>{
                      if(e.v==''){
                        this.$message.error('请填写'+e.k);
                      }else {
                        nn+=1
                      }
                    })

                  })
                  if(nn==this.specifications.length) {

                    this.skuVos.push({
                      indexes: this.indexes,
                      ownSpec: this.ownSpec,
                      price: values.price,
                      newPrice: values.newPrice,
                      stock: values.stock,
                      images: values.image
                    })
                    this.form.stock = ''
                    this.form.price = ''
                    this.dxuandatas = []
                    this.$message.success('保存成功，可以再次添加');
                  }
                } else {
                  this.skuVos.push({
                    indexes: this.indexes,
                    ownSpec: this.ownSpec,
                    price: values.price,
                    newPrice: values.newPrice,
                    stock: values.stock,
                    images: values.image
                  })
                  this.form.stock = ''
                  this.form.price = ''
                  this.dxuandatas = []
                  this.$message.success('保存成功，可以再次添加');
                }
              }

            }
          })
        },

        //点击参数单选框
        onChange2(e){
          let val=e.target.value
          let key=e.target.name
          let that=this
          for(let i in that.ownSpec){
            if(key==i){
              that.ownSpec[i]=val
            }
          }
          that.index.forEach((e,y)=>{
            if(e==key){
              for(let i in that.specTemplate){
                if(key==i){
                  that.specTemplate[i].forEach((e,l)=>{
                    if(e==val){
                      that.indexes[y]=l
                    }
                  })
                }
              }
            }
          })
        },
        onChange(value){
          this.fenl=1
          this.cids=value
          let that=this
          that.indexes=[]
          that.ownSpec={}
          that.index=[]
          that.specTemplate={}
          this.specifications=[]
          that.dxuandatas=[]

          getAction('/kunze/spec/specList',{categoryId:value[2]}).then((res)=>{
            console.log(JSON.parse(res.result.specifications))
            if(res.result==null){
              that.dxuandatas=[]
            }else {
              that.dxuandatas=JSON.parse(res.result.specifications)
              // JSON.parse(res.result.specifications).forEach(e=>{
              //
              //     if(e.params[0].global=='false'){
              //       that.dxuandatas.push(e)
              //     }
              //
              // })
              // console.log(that.dxuandatas)
              that.dxuandatas.forEach(e=>{
                e.params.forEach((y,i)=>{
                  y.value=''

                  let nn= {
                    k:y.k,
                    global: true,
                    searchable: true,
                    v:''
                  }
                  let nm=[]
                  nm.push(nn)

                  if(y.global=='true'){
                    that.specifications.push({
                      group:e.group,
                      params:nm
                    })
                  }

                  // if(y.global=='true'){
                  //   that.specifications.push({
                  //       k:y.k,
                  //       val:''
                  //
                  //   })
                  //
                  // }


                  if(typeof y.options=='string' ){
                    y.options=y.options.split(',');
                    if(y.options[0]==''){
                    }else {
                      if(y.global=='false') {
                        Vue.set(that.ownSpec, y.k, y.options[0])
                      }
                      if(y.global=='false'){
                        Vue.set(that.specTemplate,y.k,y.options)
                      }
                      that.indexes.push(0)
                      that.index.push(y.k)
                    }
                  }
                })
              })
            }
          })
          // console.log(that.specifications)

        },
        onSubmit(){
          let that=this

              this.skuVos.forEach(e=>{
                e.indexes=JSON.stringify(e.indexes)
                e.ownSpec=JSON.stringify(e.ownSpec)
              })

              let bannerImgs=''
              if(this.bannerImg1!=''){
                bannerImgs+=this.bannerImg1+','
              }
            if(this.bannerImg2!=''){
              bannerImgs+=this.bannerImg2+','
            }
            if(this.bannerImg3!=''){
              bannerImgs+=this.bannerImg3
            }

          console.log(bannerImgs)
          let spuBo={
                'brandId': '6742',
                'cid1': this.cids[0],
                'cid2': this.cids[1],
                'cid3': this.cids[2],
                'image': this.fileList,
                'images': bannerImgs,
                'shopId':this.shopId,
                'skuVos':this.skuVos,
                'barCode':this.form.barCode,
                'spuDetail': {
                  'afterService': this.form.afterService,
                  'description': this.form.description,
                  'packingList': this.form.packingList,
                  'specTemplate': JSON.stringify(this.specTemplate),
                  'specifications':JSON.stringify(this.specifications),
                },
                'subTitle': this.form.subTitle,
                'title':this.form.title
              }

          httpAction('/kunze/spu/saveGood', spuBo,'post').then((res)=>{
                console.log(res)
                if(res.success==true){
                  that.current=0
                  that.form.brand=''
                  that.cids=[]
                  that.fileList=[]
                  that.skuVos=[]
                  that.form.afterService=''
                  that.form.description=''
                  that.form.price=''
                  that.form.stock=''
                  that.form.packingList=''
                  that.specTemplate=[]
                  that.specifications=[]
                  that.indexes=[]
                  that.form.subTitle=''
                  that.form.title=''
                  that.bannerImg1='', that.bannerImg2='', that.bannerImg3=''
                  that.$message.success('添加成功');
                }else {
                  if(res.message=="数据库中已存在该记录"){
                    that.$message.error('该条码已存在');
                  }else {
                    that.$message.error('修改失败');
                  }
                  that.current=0
                  that.form.brand=''
                  that.cids=[]
                  that.fileList=[]
                  that.skuVos=[]
                  that.form.afterService=''
                  that.form.description=''
                  that.form.price=''
                  that.form.stock=''
                  that.form.packingList=''
                  that.specTemplate=[]
                  that.specifications=[]
                  that.indexes=[]
                  that.form.subTitle=''
                  that.form.title=''
                  that.bannerImg1='', that.bannerImg2='', that.bannerImg3=''
                }
              })
        },
        resetForm(){},
        getBrand(){

          let that=this
         if(that.shopType==1){
           let param = new URLSearchParams()
           param.append('cateId','')
           postAction('/kunze/category/qryList',param).then((res)=>{
             that.options=res.result
           })
         }
         if(that.shopType==2){
           let param = new FormData()
           param.append('shopId',localStorage.getItem('shopId'))
           param.append('isShow ',false)
           postAction('/kunze/category/getHotelMenu',param).then((res)=>{
             this.residences=res.result
             // console.log(this.residences)
           })
         }

        },
        checkSpuPrice(rule, value, callback){
          if(!value||value=="0"){
            callback("销售价格不能为空或者销售价格不能为0！");
          }else {
            var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
            if(!value.match(priceReg)){
              callback("请输入正确的销售价格:整数或者保留两位小数");
            }else {
              callback();
            }
          }
        },
        checkSpuNewPrice(rule, value, callback){
          if(value=="0"){
            callback("优惠价格不能为0！");
          }else {
            if(value==null||value==""||value==undefined){
              callback();
            }else {
              var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
              if (!value.match(priceReg)) {
                callback("请输入正确的销售价格:整数或者保留两位小数");
              } else {
                let price = parseFloat(this.spuPrice);
                let newPrice = parseFloat(value);
                if (newPrice >= price) {
                  callback("优惠价格不能大于等于销售价格");
                } else {
                  callback();
                }
              }
            }
          }
        },
        checkStock(rule, value, callback){
          if(!value||value=="0"){
            callback("库存数量不能为空或者库存不能为0！");
          }else {
            var reg =/^([1-9][\d]{0,7}|0)?$/;
            if(!value.match(reg)){
              callback("库存数量只能输入数字！")
            }else {
              callback();
            }
          }
        },

        // detailsId(){}
      },
      mounted() {
        this.shopId=localStorage.getItem('shopId')
        this.shopType=localStorage.getItem('shopType')

          this.getBrand()


      }
  }
</script>
<style scoped>
  .fenzu{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .jdt{
    margin-bottom: 20px;
  }
</style>
