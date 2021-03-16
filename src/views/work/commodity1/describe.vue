<template>
  <!--    商品参数规格管理-->
  <div>
    <a-card title="商品参数规格管理">
      <a-tree
        v-model="checkedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        :replace-fields="replaceFields"
        @select="onSelect"
      />
    </a-card>


<!--    弹出参数模板-->
    <a-modal
      title="商品参数规格管理"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :width="width"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template v-for=" v in csdatas">
        <div class="nnn">

          <h4 class="nnn" style="float: left">{{v.group}}</h4>
          <div>
            <a-button class="modifyBtn" @click="addxinsx(v)" >添加新属性</a-button>
            <a-button class="modifyBtn" @click="xiuxinsx(v)" >修改分组</a-button>
            <a-button  icon="delete"  style="margin-bottom: 5px" @click="deleteFenzu(v.group)"  ></a-button>
          </div>
        </div>
        <a-table :columns="columns" :data-source="v.params" size="small" :pagination="false" >
          <span slot="bianji" slot-scope="text, record">
            <a @click="xiugaishuxin(record)">修改</a>
            <a-divider type="vertical" />
            <a @click="shanchushuxin(record)">删除</a>
          </span>
        </a-table>
      </template>
      <a-button  type="primary" @click="addxiFenzhu" style="margin-left: 53%" >添加分組</a-button>
    </a-modal>


<!--    修改分组-->
    <a-modal
      title="修改分组"
      :visible="xiufenzuvisible"
      :confirm-loading="fenzuconfirmLoading"
      @ok="xiufenzuhandleOk"
      @cancel="xiufenzuhandleCancel"
    >
      <a-form
        :form="xiufenzudatasform"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="分组名" hasFeedback>
          <a-input   v-decorator="['group', {rules: [{ required: true, message: '请输入分组名称', }]}]" />
        </a-form-item>
        <a-form-item label="权限" hasFeedback>
          <a-select  placeholder="选择权限"  v-decorator="['global', {rules: [{ required: true, message: '请选择选择权限', }]}]"  >
            <a-select-option value=true>全局</a-select-option>
            <a-select-option value=false>专属</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

    </a-modal>





<!--    添加新的分组弹出框-->
    <a-modal
      title="添加新的分组"
      :visible="fenzuvisible"
      :confirm-loading="fenzuconfirmLoading"
      @ok="fenzuhandleOk"
      @cancel="fenzuhandleCancel"
    >


      <a-tabs default-active-key="true" @change="jurisdiction">
        <a-tab-pane key="true" tab="全局">
          <a-form
            :form="fenzudatasform"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item label="分组名" hasFeedback>
              <a-input   v-decorator="['group', {rules: [{ required: true, message: '请输入分组名称', }]}]" />
            </a-form-item>

            <a-form-item label="属性名" hasFeedback>
              <a-input   v-decorator="['k', {rules: [{ required: true, message: '请填写属性名', }]}]" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="false" tab="专属" force-render>
          <a-form
            :form="fenzudatasform"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item label="分组名" hasFeedback>
              <a-input   v-decorator="['group', {rules: [{ required: true, message: '请输入分组名称', }]}]" />
            </a-form-item>

            <a-form-item label="属性名" hasFeedback>
              <a-input   v-decorator="['k', {rules: [{ required: true, message: '请填写属性名', }]}]" />
            </a-form-item>
            <a-form-item label="属性值" hasFeedback>
              <a-input   v-decorator="['options', {rules: [{ required: true, message: '请填写属性值', }]}]" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>





    </a-modal>

<!--    添加新属性弹出框-->
    <a-modal
      title="添加新的属性"
      :visible="shuxinvisible"
      :confirm-loading="shuxinconfirmLoading"
      @ok="shuxinhandleOk"
      @cancel="shuxinhandleCancel"
    >
      <a-form
        :form="shuxindatasform"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="属性名" hasFeedback>
          <a-input  v-decorator="['k', {rules: [{ required: true, message: '请填写属性名', }]}]"/>
        </a-form-item>
        <a-form-item label="属性值" hasFeedback v-if="grop.global!='true'">
          <a-input  v-decorator="['options', {rules: [{ required: true, message: '请填写属性值', }]}]"/>
        </a-form-item>
      </a-form>

    </a-modal>

<!--    修改属性弹出框-->
    <a-modal
      title="修改属性"
      :visible="xiugaivisible"
      :confirm-loading="xiugaiconfirmLoading"
      @ok="xiugaihandleOk"
      @cancel="xiugaihandleCancel"
    >
      <a-form
        :form="xiugaidatasform"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="属性名" hasFeedback>
          <a-input  v-decorator="['k', {rules: [{ required: true, message: '请填写属性名', }]}]"/>
        </a-form-item>
        <a-form-item label="属性值" hasFeedback v-if="grop.global!='true'">
          <a-input  v-decorator="['options', {rules: [{ required: true, message: '请填写属性值', }]}]"/>
        </a-form-item>
      </a-form>

    </a-modal>

    <!--    修删除属性弹出框-->
    <a-modal
      title="删除属性"
      :visible="shanchuvisible"
      :confirm-loading="shanchuconfirmLoading"
      @ok="shanchuhandleOk"
      @cancel="shanchuhandleCancel"
    >
      <p>是否要删除该属性</p>
    </a-modal>

    <!--    添加属性弹出框-->
    <a-modal
      title="添加属性"
      :visible="tianjiavisible"
      :confirm-loading="tianjiaconfirmLoading"
      @ok="tianjiahandleOk"
      @cancel="tianjiahandleCancel"
    >
      <a-tabs default-active-key="true" @change="jurisdiction">
        <a-tab-pane key="true" tab="全局">
                <a-form
                  :form="tianjiadatasform"
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                >
                  <a-form-item label="分组名" hasFeedback>
                    <a-input  v-decorator="['group', {rules: [{ required: true, message: '请填写分组名称', }]}]"/>
                  </a-form-item>
                  <a-form-item label="属性名" hasFeedback>
                    <a-input  v-decorator="['k', {rules: [{ required: true, message: '请添加属性名', }]}]"/>
                  </a-form-item>

                </a-form>
        </a-tab-pane>
        <a-tab-pane key="false" tab="专属" force-render>
          <a-form
            :form="tianjiadatasform"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item label="分组名" hasFeedback>
              <a-input  v-decorator="['group', {rules: [{ required: true, message: '请填写分组名称', }]}]"/>
            </a-form-item>
            <a-form-item label="属性名" hasFeedback>
              <a-input  v-decorator="['k', {rules: [{ required: true, message: '请添加属性名', }]}]"/>
            </a-form-item>
            <a-form-item label="属性值" hasFeedback >
              <a-input  v-decorator="['options', {rules: [{ required: true, message: '请添加属性值', }]}]"/>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>

    </a-modal>

  </div>
</template>

<script>
  import {getAction,postAction,deleteAction} from '../../../api/manage'
  import pick from 'lodash.pick'
  import 'url-search-params-polyfill'

  const columns = [
    {
      title: '参数名',
      dataIndex: 'k',
      key: 'key',
    },
    {
      title: '参数',
      dataIndex: 'options',
      key: 'key1',
    },
    { title: '编辑', dataIndex: 'key', key: 'key3', scopedSlots: { customRender: 'bianji' },fixed: 'right' },
  ];

  export default {
    data(){
      return {
        columns,
        width:'60%',
        visible: false,
        fenzuvisible: false,
        xiufenzuvisible: false,
        tianjiavisible: false,
        shuxinvisible: false,
        xiugaivisible: false,
        shanchuvisible: false,
        confirmLoading: false,
        tianjiaconfirmLoading: false,
        fenzuconfirmLoading: false,
        shanchuconfirmLoading: false,
        shuxinconfirmLoading: false,
        xiugaiconfirmLoading: false,

        replaceFields:{
          children:'childrenList',
          title:'name',
          key:'id'
        },
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        treeData:[],
        csdatas:[],  //所有参数
        fenzudatas:{
          group:'',
          global: '',
          k: '',
          options: "",
        },
        xiufenzudatas:{},
        fenzudatasform:this.$form.createForm(this),
        shuxindatasform:this.$form.createForm(this),
        xiugaidatasform:this.$form.createForm(this),
        tianjiadatasform:this.$form.createForm(this),
        xiufenzudatasform:this.$form.createForm(this),
        tianjiadatas:{
          group:'',
          global: '',
          k: '',
          options: ""
        },
        shuxindatas:{
          global: '',
          k: '',
          options: ""
        },
        xiugaidatas:{
          global: '',
          k: '',
          options: ""
        },
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        grop:'', //添加新属性group记录
        k:'', //修改属性k记录
        global:'true'
    }
    },

    methods: {
      //权限先择触发
      jurisdiction(key){
        this.global=key
      },
      //点击修改分组确定按钮
      xiufenzuhandleOk(){


        let that=this

        this.xiufenzudatasform.validateFields((err, values) =>{
          if (values.group && values.global){
            this.csdatas.forEach((e,i) => {
              if(e.group==that.xiufenzudatas.group){
                e.group=values.group
                this.csdatas[i].params.forEach(e=>{
                  e.global=values.global
                })
              }
            })





            let params={
              categoryId: that.selectedKeys[0],
              specifications:that.csdatas
            }
            // console.log(that.csdatas,'kjjk')
            postAction('/kunze/spec/updateSpec',params).then((res)=>{

              if(res.success==true){
                that.hqcsmb()
                that.$message.success('修改分组成功');
                this.xiufenzuvisible=false

              }else {
                that.$message.warning('修改分组失败');
                this.xiufenzuvisible=false

              }
            })

          }
        })
      },
      //点击修改分组取消按钮
      xiufenzuhandleCancel(){
        this.xiufenzuvisible=false
      },

      //点击修改分组按钮
      xiuxinsx(e){
        this.xiufenzudatas=e
        this.xiufenzudatas.global=e.params[0].global
        this.xiufenzuvisible=true

        this.$nextTick(() => {
          this.xiufenzudatasform.setFieldsValue(pick(this.xiufenzudatas,'global','group'))
        });

      },

      edit(record) {
        this.$nextTick(() => {
          this.fenzudatasform.setFieldsValue(pick(this.fenzudatas, 'group', 'global', 'k', 'options'))
          this.shuxindatasform.setFieldsValue(pick(this.shuxindatas, 'k', 'options'))
          this.xiugaidatasform.setFieldsValue(pick(this.xiugaidatas, 'k', 'options'))
          this.tianjiadatasform.setFieldsValue(pick(this.tianjiadatas, 'k', 'options','global','group'))
          this.xiufenzudatasform.setFieldsValue(pick(this.xiufenzudatas,'global','group'))

        });

      },


      tianjiahandleOk(){
        let that=this

        this.tianjiadatasform.validateFields((err, values) =>{

            if (values.k   && values.group) {
              that.csdatas = []

              // console.log(that.global)
              if(values.options){
                that.tianjiadatas={
                  group:values.group,
                  params:[
                    {
                      global: that.global,
                      k:values.k,
                      options: values.options
                    }
                  ]
                }
              }else {
                that.tianjiadatas={
                  group:values.group,
                  params:[
                    {
                      global: that.global,
                      k:values.k,
                    }
                  ]
                }
              }

              JSON.parse(JSON.stringify(that.csdatas.push(that.tianjiadatas)))
              let param = new URLSearchParams()
              param.append('categoryId', that.selectedKeys[0])
              param.append('specifications', JSON.stringify(that.csdatas))
              console.log(JSON.stringify(that.csdatas),'231321132')
              postAction('/kunze/spec/saveSpec', param).then((res) => {
                console.log(res)
                if (res.success == true) {
                  that.hqcsmb()
                  that.$message.success('添加分组成功');
                  that.tianjiavisible = false
                  that.tianjiadatas.group = ''
                  that.tianjiadatas.options = ''
                  that.tianjiadatas.k = ''
                  that.tianjiadatas.global = ''

                  that.$nextTick(() => {
                    that.tianjiadatasform.setFieldsValue(pick(this.tianjiadatas, 'k', 'options','global','group'))

                  });
                } else {
                  that.$message.warning('添加分组失败');
                  that.tianjiavisible = false
                  that.tianjiadatas.group = ''
                  that.tianjiadatas.options = ''
                  that.tianjiadatas.k = ''
                  that.tianjiadatas.global = ''
                }
              })

            }})


      },
      tianjiahandleCancel(){
        this.tianjiavisible=false
        this.tianjiadatas.group = ''
        this.tianjiadatas.options = ''
        this.tianjiadatas.k = ''
        this.tianjiadatas.global = ''
        this.$nextTick(() => {

          this.tianjiadatasform.setFieldsValue(pick(this.tianjiadatas, 'k', 'options','global','group'))

        });
      },
      shanchuhandleOk(){
        let that=this
        this.csdatas.forEach(e=>{
          e.params.forEach((y,i)=>{
            if(y.k==that.k){
              e.params.splice(i,1)
            }
          })
        })
        let params={
          categoryId: that.selectedKeys[0],
          specifications:that.csdatas
        }
        postAction('/kunze/spec/updateSpec',params).then((res)=>{
          if(res.success==true){
            that.hqcsmb()
            that.$message.success('删除属性成功');
            that.shanchuvisible=false
          }else {
            that.$message.warning('删除属性失败');
            that.shanchuvisible=false
          }
        })

      },
      shanchuhandleCancel(){
        this.shanchuvisible=false
      },
      //删除属性
      shanchushuxin(e){
        this.shanchuvisible=true
        this.k=e.k
      },
      xiugaihandleOk(){
        let that=this
        this.xiugaidatasform.validateFields((err, values) =>{

            if (values.k ) {
              this.csdatas.forEach(e => {
                e.params.forEach((e, i) => {
                  if (e.k == this.grop.k){
                    e.k = values.k
                    e.options = values.options
                    e.global=that.grop.global
                  }
                })
              })

              let params = {
                categoryId: that.selectedKeys[0],
                specifications: that.csdatas
              }
              postAction('/kunze/spec/updateSpec', params).then((res) => {
                if (res.success == true) {
                  that.hqcsmb()
                  that.$message.success('修改属性成功');
                  that.xiugaivisible = false
                  that.xiugaidatas.k = ''
                  that.xiugaidatas.options = ''
                } else {
                  that.$message.warning('修改属性失败');
                  that.xiugaivisible = false
                  that.xiugaidatas.k = ''
                  that.xiugaidatas.options = ''
                }
              })
            }})

      },
      xiugaihandleCancel(){
        this.xiugaivisible=false
        this.xiugaidatas.k=''
        this.xiugaidatas.options=''
      },
      //点击修稿按钮
      xiugaishuxin(w){
        let that=this
        this.grop=w

        this.k=w.k
        // this.xiufenzudatas.global=
        this.xiugaivisible=true
        this.csdatas.forEach(e=>{
          e.params.forEach((e,i)=>{
            if(e.k==that.k){
              that.xiugaidatas.k=e.k
              that.xiugaidatas.options=e.options
            }
          })
        })
        this.$nextTick(() => {

          this.xiugaidatasform.setFieldsValue(pick(this.xiugaidatas, 'k', 'options'))

        });
      },
      shuxinhandleOk(){
        let that=this
        this.shuxindatasform.validateFields((err, values) =>{

            if (values.k ) {
              that.shuxindatas={
                k: values.k,
                options: values.options,
                global:that.grop.params[0].global
              }

              this.csdatas.forEach(e => {
                if (e.group == that.grop.group) {
                  e.params[e.params.length] = JSON.parse(JSON.stringify(that.shuxindatas))
                }
              })
              let params = {
                categoryId: that.selectedKeys[0],
                specifications: that.csdatas,
                global:this.grop.params[0].global
              }
              postAction('/kunze/spec/updateSpec', params).then((res) => {
                console.log(res)
                if (res.success == true) {
                  this.hqcsmb()
                  this.$message.success('添加属性成功');
                  this.shuxinvisible = false
                  this.shuxindatas.k = ''
                  this.shuxindatas.options = ''
                } else {
                  this.$message.warning('添加属性失败');
                  this.shuxinvisible = false
                  this.shuxindatas.k = ''
                  this.shuxindatas.options = ''
                }
              })

            }}
        )


      },
      shuxinhandleCancel(){
        this.shuxinvisible=false
        this.shuxindatas.k=''
        this.shuxindatas.options=''
      },
      //添加新的属性
      addxinsx(w){
        this.shuxinvisible=true
        console.log(w)
        this.grop=w
        this.grop.global=w.params[0].global

      },
      // 添加分组取消按钮
      fenzuhandleCancel(){
        this.fenzuvisible=false
        this.fenzudatas.group=''
      },
      // 添加新分组确认按钮
      fenzuhandleOk(){
        let that=this

        this.fenzudatasform.validateFields((err, values) =>{
            if (values.group  && values.k){
              if(values.options){
                that.fenzudatas={
                  group:values.group,
                  params:[
                    {
                      global: this.global,
                      k:values.k,
                      options:values.options
                    }
                  ]
                }
              }else {
                that.fenzudatas={
                  group:values.group,
                  params:[
                    {
                      global: this.global,
                      k:values.k,

                    }
                  ]
                }
              }

            that.csdatas[that.csdatas.length]=JSON.parse(JSON.stringify(that.fenzudatas))
            let params={
              categoryId: that.selectedKeys[0],
              specifications:that.csdatas
            }
              console.log(that.csdatas,'2koj')
              postAction('/kunze/spec/updateSpec',params).then((res)=>{

              if(res.success==true){
                that.hqcsmb()
                that.$message.success('添加分组成功');
                that.fenzuvisible=false
                that.fenzudatas.group=''
                this.fenzudatas.global=''
                this.fenzudatas.k=''
                this.fenzudatas.options=''

              }else {
                that.$message.warning('添加分组失败');
                that.fenzuvisible=false
                that.fenzudatas.group=''
                this.fenzudatas.global=''
                this.fenzudatas.k=''
                this.fenzudatas.options=''
              }
            })

            }
        })


      },
      //添加新的分组
      addxiFenzhu(){
        this.fenzuvisible=true
        this.fenzudatas.group=''
        this.fenzudatas.global=''
        this.fenzudatas.k=''
        this.fenzudatas.options=''


        this.$nextTick(() => {
          this.fenzudatasform.setFieldsValue(pick(this.fenzudatas, 'group', 'global', 'k', 'options'))
        });
      },
      //删除分组
      deleteFenzu(v){
        let that=this
        this.$confirm({
          title: '删除',
          content: '确定要删除该分组吗 ?',
          onOk() {
            that.csdatas.forEach((e,i)=>{
              if(e.group==v){
                that.csdatas.splice(i,1)
              }
            })

            let params={
              categoryId: that.selectedKeys[0],
              specifications:that.csdatas
            }
            if(that.csdatas.length==0){

              deleteAction('/kunze/spec/delSpec',{categoryId:that.selectedKeys[0]}).then((res)=>{
                // console.log(res)
                if(res.success==true){
                      that.hqcsmb()
                      that.$message.success('删除成功');
                      that.visible=false
                      that.tianjiavisible=true

                    }else {
                      that.$message.warning('删除失败');
                    }
              })
            }else {
              postAction('/kunze/spec/updateSpec',params).then((res)=>{
                if(res.success==true){
                  that.hqcsmb()
                  that.$message.success('删除成功');

                }else {
                  that.$message.warning('删除失败');
                }
              })
            }


          },
          onCancel() {
          },
        })


      },
      onSelect(selectedKeys, info) {
        let that=this
        this.selectedKeys = selectedKeys;
        // console.log( selectedKeys[0]);
        this.treeData.forEach(e=>{
          if(e.id==selectedKeys[0]){

          }else {
            e.childrenList.forEach(e=>{
              if(e.id==selectedKeys[0]){

              }else {

                e.childrenList.forEach(e=>{
                  if(e.id==selectedKeys[0]){
                    getAction('/kunze/spec/specList',{categoryId:selectedKeys[0]}).then((res)=>{
                      console.log(res.result)
                      if(res.result==null){
                        // that.csdatas=JSON.parse(res.result.specifications)
                        that.tianjiavisible=true
                      }else {
                        that.csdatas=JSON.parse(res.result.specifications)
                        // console.log(that.csdatas)
                        let key=0
                        that.csdatas.forEach(e=>{
                          e.params.forEach(e=>{
                            e.key=key++
                            e.key1=key++
                            e.key3=key++
                            // if(e.options=='"\\"\\""'){
                            //   e.options=''
                            // }else {
                            //   e.options=JSON.parse(JSON.parse(e.options))
                            // }
                          })
                        })
                        // console.log(that.csdatas.length)
                        if(that.csdatas.length==0){
                          that.tianjiavisible=true
                        }else {
                          that.visible = true;
                        }
                      }

                    })




                  }
                })
              }
            })
          }
        })
      },
      hqcsmb(){
        let that=this
        getAction('/kunze/spec/specList',{categoryId:this.selectedKeys[0]}).then((res)=>{
          if(res.result==null){

          }else {

            that.csdatas=JSON.parse(res.result.specifications)
            let key=0
            that.csdatas.forEach(e=>{
              e.params.forEach(e=>{
                e.key=key++
                e.key1=key++
                e.key3=key++
                // if(e.options=='"\\"\\""'){
                //   e.options=''
                // }else {
                //   e.options=JSON.parse(JSON.parse(e.options))
                // }
              })
            })
          }
        })
      },
      hqfle(){
        let param = new URLSearchParams()
        param.append('cateId','')
        postAction('/kunze/category/qryList', param).then((res)=>{
          this.treeData=res.result
        })
      },
      handleOk(e) {
        this.visible = false;
        this.csdatas=[]
      },
      handleCancel(e) {
        this.visible = false;
        this.csdatas=[]
      },

    },
    mounted () {
      this.hqfle()
    }

  }
</script>

<style scoped>
  /deep/.ant-spin-nested-loading{
    margin-bottom: 10px;
  }
  .modifyBtn{
    margin-right: 10px;
  }
 .nnn{
   display: flex;
   justify-content: space-between;
   content:"";
 }

</style>
