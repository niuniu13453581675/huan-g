<template>
<!--    商品类型-->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品类型</span>
    </div>
    <div>
      <el-button type="primary" round class="flgl-btn" @click="dialogFormVisible = true">新增类型</el-button>

      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="分类名称">
        </el-table-column>

        <el-table-column
          label="查看商品">
          <template slot-scope="scope">
            <el-button type="primary" round>查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <el-button  type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="gldele(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>



    </div>



    <!--    添加分类弹窗-->

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="活动名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="活动形式" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域" style="width: 30%">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>



  </el-card>
</template>

<script>
  export default {
    name: 'commodityType',
      data(){
        return{
            tableData: [
                {
                    name: '电器',
                    paixv: '3',
                    addzi: '普陀区',
                    index:''
                },
                {
                    name: '电器11',
                    paixv: '4',
                    addzi: '普陀区',
                    index:''
                },
                {
                    name: '衣服',
                    paixv: '1',
                    addzi: '普陀区',
                    index:''
                },
                {
                    name: '出行',
                    paixv: '2',
                    addzi: '普陀区',
                    index:''
                }],
            dialogTableVisible: false,
            dialogFormVisible: false,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px',

          }
      }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width:100%;

  }
  .flgl-btn{
    margin-bottom: 20px;
  }
  /deep/.el-table td, .el-table th.is-leaf{
    text-align: center;
  }
  /deep/.el-table--border th, .el-table__fixed-right-patch{
    text-align: center;
  }
</style>
