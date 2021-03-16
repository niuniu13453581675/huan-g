<template>
  <!--    商品批量上传-->
  <div>
    <a-card title="商品批量上传">
      <a-tree
        v-model="checkedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        :replace-fields="replaceFields"
        @select="onSelect"
      />
      <a-modal
        title="选择商品"
        :width="1600"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        @ok="handleOk"
        cancelText="关闭"
      >

        <a-table
          :columns="columns"
          :data-source="data"
          :row-selection="{ selectedRowKeys: selectedRowKeys,  onChange: onSelectChange }"
          :pagination="ipagination"
          @change="handleTableChange">
          <span slot="image" slot-scope="text,record">
            <img :src=record.spuimage alt="" style="height: 50px;width: 50px">
          </span>
        </a-table>

      </a-modal>
    </a-card>
  </div>
</template>

<script>
  import {getAction,postAction} from '../../../api/manage'
  import 'url-search-params-polyfill'



  export default {
    data(){
      return {
        data:[],
        selectedRowKeys:[],
        columns:[
          { title: '*', dataIndex: '',  key: 'rowIndex', width: 60, align: "center", customRender: function (t, r, index) {return parseInt(index) + 1;}},
          /* { title: '品牌名称', dataIndex: 'bname', key: 'bname' },*/
          { title: '图片', dataIndex: 'spuimage', key: 'spuimage',scopedSlots: { customRender: 'image' } },
          { title: '商品名称', dataIndex: 'title', key: 'title' },
        ],

        visible: false,
        confirmLoading: false,
        replaceFields:{
          children:'childrenList',
          title:'name',
          key:'id'
        },
        autoExpandParent: true,
        checkedKeys: [],
        selectedKeys: [],
        treeData:[],
        ipagination:{
          current: 1,
          pageSize: 30,
          pageSizeOptions: ['30', '40', '50'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        shopId:'',
        cid:'',
        ids:[]

      }
    },

    methods: {
      //分页
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        // if (Object.keys(sorter).length > 0) {
        //   this.isorter.column = sorter.field;
        //   this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        // }
        this.ipagination = pagination;
        this.getAllProducts(this.cid);
      },
      onSelectChange(selectedRowKeys, selectedRows){
        this.selectedRowKeys=selectedRowKeys
        let that=this
        that.ids=[]
        selectedRows.forEach(e=>{
          // console.log(e)
          delete e.key
          e.shopId=this.shopId
          that.ids.push(e)
        })
      },
      handleCancel(){
        this.visible=false
      },
      handleOk(){
        console.log(this.ids)
        postAction('/kunze/spu/template/add',this.ids).then((res)=>{
          // console.log(res)
          if(res.success==true){
            this.visible=false
            this.selectedRowKeys=[]
            this.$message.success('批量上传成功');
          }else {
            this.visible=false
            this.selectedRowKeys=[]
            this.$message.error('批量上传失败');
          }
        })
      },


      onSelect(selectedKeys, info) {
        if(info.selectedNodes[0].data.props.isParent==0){
          this.visible=true
          this.cid=selectedKeys[0]
          this.getAllProducts(selectedKeys[0])
        }
      },

      hqfle(){
        let param = new URLSearchParams()
        param.append('cateId','')
        postAction('/kunze/category/qryList', param).then((res)=>{
          this.treeData=res.result
        })
      },
      getAllProducts(e){
        let that=this
        // console.log(that.shopId)
        getAction('/kunze/spu/template/list',{
          pageNo :that.ipagination.current,
          pageSize : that.ipagination.pageSize,
          cid:e
        }).then((res)=>{
          console.log(res)
          that.data=res.result.list

          let key=0
          that.data.forEach(e=>{
            // e.spuimage=e.image
            e.spuimage=window._CONFIG['domianURL']+'/'+e.image

            e.key=key++
          })
          that.ipagination.total = res.result.total;
          // console.log(that.data)
        })
      },

    },
    mounted () {
      this.shopId=localStorage.getItem('shopId')
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
  }

</style>
