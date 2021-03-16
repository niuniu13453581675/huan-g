<template>
<!--    展示分类-->
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>展示分类</span>
    </div>
    <div>
      <el-button type="primary" round class="flgl-btn" @click="dialogFormVisible = true">新增分类</el-button>

      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="分类名称">
        </el-table-column>
        <el-table-column
          label="排序">
          <template slot-scope="scope">
            <template v-if="scope.row.index!=1">
              <el-button type="primary" icon="el-icon-top" circle   @click="sheng(scope.row)"></el-button>
            </template>
            <template v-if="scope.row.index!=2">
              <el-button type="primary" icon="el-icon-bottom" circle @click="jiang(scope.row)"></el-button>
            </template>

          </template>
        </el-table-column>

        <el-table-column
          label="新增子类">
          <template slot-scope="scope">
            <el-button type="primary" round>新增子类</el-button>
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

    <el-dialog title="新增展示分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="活动名称" :label-width="formLabelWidth">
              <el-input v-model="form.name" autocomplete="off" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="活动区域" :label-width="formLabelWidth">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="图片" :label-width="formLabelWidth">
              <el-upload
                action="#"
                list-type="picture-card"
                :auto-upload="false">
                <i slot="default" class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" alt=""
                  >
                  <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="图片" :label-width="formLabelWidth">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleDownload(file)"
        >
          <i class="el-icon-download"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="活动形式" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.desc" style="40%"></el-input>
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
        data() {
            return {
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


                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false
            };
        },
        methods: {
            // 删除分类
            gldele(row){
                this.tableData.forEach(e=>{
                    if(e.paixv==row.paixv){

                    }
                })
            },
            // 降序排列
            jiang(row) {
                let that=this
                let i=this.tableData.length
                let n,m
                let y=-1
                while (i--) {
                    if (this.tableData[i].paixv === row.paixv) {
                        n=i
                    }
                }
                console.log(n-y);
                console.log(n);


                m=this.tableData[n]
                this.$set(this.tableData,n,this.tableData[n-y])
                this.$set(this.tableData,n-y,m)

                console.log(this.tableData);
                this.tableData.forEach(e=>{
                    e.index=0
                })
                this.tableData.forEach((e,j)=>{
                    if(j==0){
                        e.index=1
                    }
                    if(j==that.tableData.length-1){
                        e.index=2
                    }
                })
            },
            // 升序排列
            sheng(row) {
                let that=this
                let i=this.tableData.length
                let n,m
                let y=1
                while (i--) {
                    if (this.tableData[i].paixv === row.paixv) {
                        n=i
                    }
                }
                console.log(n-y);

                m=this.tableData[n]
                this.$set(this.tableData,n,this.tableData[n-y])
                this.$set(this.tableData,n-y,m)

                console.log(this.tableData);
                this.tableData.forEach(e=>{
                    e.index=0
                })
                this.tableData.forEach((e,j)=>{

                    if(j==0){
                        e.index=1
                    }
                    if(j==that.tableData.length-1){
                        e.index=2
                    }
                })
                console.log(this.tableData);

            },
            paixv(){
                let that=this
                let arr=[]
                this.tableData.forEach(e=>{
                    arr.push(e.paixv)
                })
                arr.sort();
                arr.sort(function (m, n) {
                    if (m < n) return -1
                    else if (m > n) return 1
                    else return 0
                });
                let arr1=[]
                arr.forEach(e=>{
                    that.tableData.forEach(y=>{
                        if(e==y.paixv){
                            arr1.push(y)
                        }
                    })
                })

                this.tableData=arr1

                this.tableData[0].index=1
                this.tableData[this.tableData.length-1].index=2
            },




            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleDownload(file) {
                console.log(file);
            }

        },
        mounted(){
            this.paixv()
        }
    };
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
