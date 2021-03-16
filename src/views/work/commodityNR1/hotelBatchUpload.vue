<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item label="超市名称">
              <a-input placeholder="请输入超市名称" v-model="queryParam.shopName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 批量上传弹出框区域 -->
    <a-modal
      title="选择分类"
      :width="1600"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      @ok="handleOk"
      cancelText="关闭"
    >
      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="batchcolumns"
          :dataSource="batchdataSource"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChangem,type:'radio'}">


        </a-table>
      </div>
    </a-modal>




    <a-modal
      title="选择饭店"
      :width="1600"
      :visible="visibleShop"
      :confirmLoading="confirmLoadingShop"
      @cancel="handleCancelShop"
      @ok="handleOkShop"
      cancelText="关闭"
    >
      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="batchcolumnsShop"
          :dataSource="batchdataSourceShop"
          :rowSelection="{selectedRowKeys: selectedRowKeysShop, onChange: onSelectChangemShop}">
          <span slot="shopName" slot-scope="text,record" @click="getskus(record)">
            <a href="javascript:;">{{record.shopName}}</a>
          </span>

        </a-table>
      </div>
    </a-modal>



    <a-modal
      title="选择商品"
      :width="1600"
      :visible="visiblehotel"
      :confirmLoading="confirmLoadinghotel"
      @cancel="handleCancelhotel"
      @ok="handleOkhotel"
      cancelText="关闭"
    >
      <!-- table区域-begin -->
      <div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="batchcolumnshotel"
          :dataSource="batchdataSourcehotel"
          :rowSelection="{selectedRowKeys: selectedRowKeyshotel, onChange: onSelectChangemhotel}">


        </a-table>
      </div>
    </a-modal>



    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"

        @change="handleTableChange">

        <template slot="avatarslot" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.image)" icon="user"/>
          </div>
        </template>
        <!-- 字符串超长截取省略号显示-->
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>


        <span slot="action" slot-scope="text, record">
          <a @click="batchUpload(record)">批量添加</a>



        </span>

      </a-table>
    </div>

  </a-card>
</template>
<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin';
  import {deleteAction, getAction, postAction,getFileAccessHttpUrl} from '@/api/manage';
  import {filterObj,timeFix} from '@/utils/util';
  import SuperModules from  "../Supermarket/modules/SuperModules";
  import JEllipsis from "@/components/jeecg/JEllipsis";
  // import 'url-search-params-polyfill'

  export default {
    name:"SuperList",
    mixins:[JeecgListMixin],
    components:{
      ARow,
      SuperModules,
      JEllipsis
    },
    data(){
      return{
        hotelSku:[],
        emptyShopId:"",
        fullShopId:"",
        visible:false,
        confirmLoading:false,
        visiblehotel:false,
        confirmLoadinghotel:false,
        visibleShop:false,
        confirmLoadingShop:false,
        selectedRowKeys: [],
        selectionRows: [],
        selectedRowKeysShop: [],
        selectionRowsShop: [],
        selectedRowKeyshotel: [],
        selectionRowshotel: [],
        description: '超市管理页面',
        loading: false,
        // 查询条件
        queryParam: {},
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '超市名称',
            align:"center",
            width: 100,
            dataIndex: 'shopName',
            scopedSlots: {customRender: 'description'},
          },
          {
            title: '超市地址',
            width: 300,
            align:"center",
            dataIndex: 'addressTotal',
            scopedSlots: {customRender: 'description'},
          },
          {
            title: '图片',
            align:"center",
            dataIndex: 'image',
            scopedSlots: {customRender: "avatarslot"}
          },
          {
            title: '营业时间',
            align:"center",
            dataIndex: 'businessHours'
          },
          {
            title: '负责人',
            align:"center",
            dataIndex: 'personCharge'
          },
          {
            title:'联系方式',
            align:"center",
            dataIndex:'telphone'
          },
          {
            title:'售后电话',
            align:"center",
            dataIndex:'afterSale'
          },
          {
            title:'身份证号码',
            align:"center",
            dataIndex:'idenitiy'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        // 批量修改表头
        batchcolumns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '分类名称',
            align: "center",
            dataIndex: 'name',
          }
        ],
        //数据集
        dataSource: [],
        // 批量修改表头
        batchcolumnshotel: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '商品名',
            align: "center",
            dataIndex: 'title',
          }
        ],
        //数据集
        batchdataSourcehotel: [],
        // 批量修改表头
        batchcolumnsShop: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '超市名',
            align: "center",
            dataIndex: 'shopName',
           key: 'shopName',
            scopedSlots: { customRender: 'shopName' }
          }

        ],
        //数据集
        batchdataSourceShop: [],
        batchdataSource: [],
        // 分页参数
        ipagination: {
          current: 1,
          pageSize: 30,
          pageSizeOptions: ['20', '30', '40'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc',
        },

        selectedRows: [],
        url:{
          list:"/kunze/shop/list",
          delete:"/kunze/shop/delShops",
          shelves:"/kunze/shop/updateShop",
          imgerver:window._CONFIG['staticDomainURL'],
        },
      }
    },
    created() {
      this.loadData();
    },
    methods:{
      handleCancelhotel(){
        this.visiblehotel=false

      },
      handleOkhotel(){
        this.visiblehotel=false

        this.selectionRowshotel.forEach(e=>{
          this.hotelSku.push(e)
        })

      },
      getskus(e){
        let n=0
        this.selectionRowsShop.forEach(x=>{
          if(e.shopId==x.shopId){
            n=1
            // console.log(e)
            let params =  new FormData()
            params.append('cid',e.cid)
            params.append('shopId',e.shopId)
            postAction('/kunze/sku/queryRestaurantSkuByCid',params).then((res)=> {
              console.log(res)
              this.batchdataSourcehotel=res.result
              this.visiblehotel=true

            })
          }
        })
        if(n==0){
          this.$message.warning('请先选中该超市再选择商品');
        }

      },

      handleCancelShop(){
        this.visibleShop=false
      },
      handleOkShop(){
        this.visibleShop=false

            let restayrant ={
              'name':this.selectionRows[0].name,
              'hotelSku':this.hotelSku,
              'shopIds':this.emptyShopId
            }

            postAction('/kunze/sku/addRestaurant',restayrant ).then((res) => {
              console.log(res)
              if(res.result==1){
                this.$message.success('添加成功');
              }else {
                this.$message.error('添加失败');

              }


            })





      },

      onSelectChangem(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;


      },
      onSelectChangemhotel(selectedRowKeys, selectionRows) {
        this.selectedRowKeyshotel = selectedRowKeys;
        this.selectionRowshotel = selectionRows;
      },
      onSelectChangemShop(selectedRowKeys, selectionRows) {
        this.selectedRowKeysShop = selectedRowKeys;
        this.selectionRowsShop = selectionRows;
        console.log(selectedRowKeys, selectionRows)
      },
      // onClearSelected() {
      //   this.selectedRowKeys = [];
      //   this.selectionRows = [];
      // },
      handleCancel(){
        this.visible=false
      },
      handleOk(){
        this.batchdataSourceShop=[]
        this.visible=false
        let param =  new FormData()
        param.append('name',this.selectionRows[0].name)
        postAction('/kunze/sku/queryHotelByName',param).then((res)=>{
          console.log(res)
          if(res.code==500){
            this.$message.warning('暂无相应数据');
          }else {
            this.visibleShop=true
            res.result.forEach(e=>{
              if(e.shopId!=this.emptyShopId){
                this.batchdataSourceShop.push(e)
              }
            })
          }



        })

      },
      batchUpload(e){
        this.emptyShopId=e.id
        var param =  new FormData()
        param.append('shopId',e.id)
        param.append('isShow ',false)
        postAction('/kunze/category/getHotelMenu',param).then((res)=>{
          console.log(res)
          this.batchdataSource=res.result
        })
        this.visible=true
        this.hotelSku=[]
      },

      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },
      loadData(arg) {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        debugger
        getAction(this.url.list, params).then((res) => {
          console.log(res)
          if (res.success) {
            this.dataSource = res.result.list;
            this.dataSource.forEach(e=>{
              e.arr=1
            })
            this.ipagination.total = res.result.total;
          }
        })
      },
      handleAdd:function(e){

        this.$refs.SuperModules.add();
        this.$refs.SuperModules.title = "新增超市信息";
      },




      modalFormOk() {
        // 新增/修改 成功时，重载列表
        this.loadData();
      },
      searchReset() {
        var that = this;
        that.queryParam = {}
        that.loadData(1);
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.isFlag = this.filters.isFlag;
        param.shopType = 2;
        return filterObj(param);
      },
      getQueryField() {
        //TODO 字段权限控制
        var str = "id,";
        this.columns.forEach(function (value, index) {
          str += "," + value.dataIndex;
        });
        return str;
      },

      searchQuery(){
        this.loadData(1);
      },
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        debugger
        console.log(sorter);
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        if( filters.isFlag){
          this.filters.isFlag = filters.isFlag[0];
        }

        this.ipagination = pagination;
        this.loadData();
      },
    }

  }
</script>