<template>
<!--    商品展示-->
  <div>
    <template v-if="shopType==1">
      <a-card title="商品展示" >
        <a-form :label-col="{ span: 8}" :wrapper-col="{ span:16 }" >
          <a-row>
            <a-col :span="8">
              <a-form-item label="商品ID">
                <a-input placeholder="商品ID" v-model="search.shopId"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="商品名称">
                <a-input placeholder="商品名称" v-model="search.title"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="是否上架">
                <a-select v-model="search.saleable"  >
                  <a-select-option value=''>全部</a-select-option>
                  <a-select-option value='1'>已上架</a-select-option>
                  <a-select-option value='0'>已下架</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="8">
              <a-form-item label="商品条码">
                <a-input placeholder="商品条码" v-model="search.barCode"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="商品分类">
                <a-cascader
                  :field-names="{ label: 'name', value: 'id', children: 'childrenList'}"
                  :options="options"
                  placeholder="选择所属分类"
                  :value="cids"
                  @change="onChangeShop"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="有无条形码">
                <a-select v-model="search.barCodeParam"  >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value='1'>无条码</a-select-option>
                  <a-select-option value='0'>有条码</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="2">
            </a-col>
            <a-col :span="4">
                <a-button type="primary" icon="search" @click="searchShop">
                  搜索
                </a-button>
            </a-col>
          </a-row>
        </a-form>


        <a-button type="primary" class="modifyBtn1" @click="deleteAllBrandBtn()">批量删除</a-button>
        <a-button type="primary" class="modifyBtn1" @click="updataAllsable()">批量上架</a-button>
        <a-button type="primary" class="modifyBtn1" @click="updataAllsablexia()">批量下架</a-button>
        <a-table
          :columns="columns"
          :data-source="data"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :pagination="ipagination"

          @change="handleTableChange">
             <span slot="image" slot-scope="text,record">
               <img :src=record.image alt="">
            </span>
          <span slot="saleable" slot-scope="text,record">
              <a-button type="primary" class="modifyBtn"  @click="shangjia(record)" v-if="record.saleable==1">已上架</a-button>
              <a-button type="danger" class="modifyBtn" @click="shangjia(record)" v-if="record.saleable==0">已下架</a-button>
          </span>
          <span slot="bianji" slot-scope="text,record">
              <a-button type="primary" class="modifyBtn" @click="xiuBrandBtn(record)">查看</a-button>
              <a-button type="primary" @click="deleteBrandBtn(record)">删除</a-button>
          </span>
        </a-table>
      </a-card>

<!--      添加sku-->
      <a-modal
        v-model="skuvisible"
        title="添加规格"
        @ok="skuhandleOk"
        @cancel="skuhandleCancel"
        width="60%">
        <a-form
          :form="formTranslate"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >

          <!--          //参数选择-->
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
                        <!--                            <a-button type="primary">-->
                        <!--                              自定义规格-->
                        <!--                            </a-button>-->
                      </a-col>
                    </a-row>
                    <br />
                  </template>
                </template>
              </template>
              <!--                      <template v-for="(v,e) in specifications">-->
              <!--                        <template v-for="(x,i) in v.params">-->
              <!--                          <a-row>-->
              <!--                            <a-col :span="4">-->
              <!--                              <span class="fenzu">{{x .k}}:</span>-->
              <!--                            </a-col>-->
              <!--                            <a-col :span="20">-->
              <!--                              &lt;!&ndash;                            <a-input  v-model="x.v" />&ndash;&gt;-->
              <!--                              <a-input ref="userNameInput" v-model="x.v" >-->
              <!--                                <a-tooltip slot="suffix" title="删除该属性">-->
              <!--                                  <a-icon type="delete" style="color: rgba(0,0,0,.45)" @click="deleteSpec(e,i) " />-->
              <!--                                </a-tooltip>-->
              <!--                              </a-input>-->
              <!--                            </a-col>-->
              <!--                          </a-row>-->
              <!--                        </template>-->
              <!--                      </template>-->
            </a-form-item>
          </template>




          <a-form-item label="销售价格"  hasFeedback>
            <a-input  placeholder="单位为元"  v-decorator="['price', {rules: [{ required: true, message: '请输入商品价格', }]}]"  />
            <!--            v-decorator="['price', validatorRules.spuPrice]"-->
          </a-form-item>
          <a-form-item label="优惠价格"  hasFeedback>
            <a-input  placeholder="单位为元"  v-decorator="['newPrice', {rules: [{ required: false, message: '请输入优惠价格', }]}]"  />
            <!--            v-decorator="['price', validatorRules.spuPrice]"-->
          </a-form-item>
          <a-form-item label="商品库存"    hasFeedback>
            <a-input type="number"  v-decorator="['stock', {rules: [{ required: true, message: '请输入商品库存', }]}]" />
            <!--            v-decorator="['stock', validatorRules.Stock]"-->
          </a-form-item>
          <a-form-item label="商品图片" hasFeedback>
            <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['skuimage', {rules: [{ required: true, message: '请输入商品图片', }]}]" ></j-image-upload>
          </a-form-item>
        </a-form>
      </a-modal>


        <!--    sku弹出窗-->
        <a-modal
          v-model="visible"
          title="商品"
          @ok="handleOk"
          @cancel="handleCancel"
          width="70%">

          <a-tabs :default-active-key=activeKey>
            <a-tab-pane key="1" tab="基本信息">
              <a-form
                :form="formTranslate"
                :label-col="{span:7}"
                :wrapper-col="{span:17}"
              >
                <a-row>
                  <a-col :span="12">
                    <a-form-item label="标题"  hasFeedback>
                      <a-input v-decorator="['title', {rules: [{ required: true, message: '请输入商品名称', }]}]"  />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="子标题" hasFeedback>
                      <a-input    v-decorator="['subTitle', {rules: [{ required: true, message: '请输入子标题', }]}]" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
    <!--              <a-col :span="12">-->
    <!--                <a-form-item label="品牌" hasFeedback>-->
    <!--                  <a-select  placeholder="选择品牌"   v-decorator="['brand', {rules: [{ required: true, message: '请选择品牌', }]}]">-->
    <!--                    <a-select-option  v-for="v in brand" :value=v.bid :key="v.keys" >-->
    <!--                      {{v.bname}}-->
    <!--                    </a-select-option>-->
    <!--                  </a-select>-->
    <!--                </a-form-item>-->
    <!--              </a-col>-->
                  <a-col :span="12">
                    <a-form-item label="包装清单" hasFeedback >
                      <a-input  v-decorator="['packingList', {rules: [{ required: false, message: '请输入包装清单', }]}]"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="售后服务"  hasFeedback  >
                      <a-input  v-decorator="['afterService', {rules: [{ required: false, message: '请输入售后服务', }]}]"/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="12">
                    <a-form-item label="商品条码"  hasFeedback>
                      <a-input  type="number"  placeholder="请填写国码或者自编码" v-decorator="['barCode', {rules: [{ required: true, message: '请输入商品条码', }]}]"  />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="15">
                    <a-form-item label="spu轮播图" hasFeedback>
                      <j-image-upload class="avatar-uploader" text="上传" style="float: left"  v-decorator="['spuimage1', {rules: [{ required: false, message: '请输入商品库存', }]}]" ></j-image-upload>
                      <j-image-upload class="avatar-uploader" text="上传" style="float: left"  v-decorator="['spuimage2', {rules: [{ required: false, message: '请输入商品库存', }]}]" ></j-image-upload>
                      <j-image-upload class="avatar-uploader" text="上传" style="float: left"  v-decorator="['spuimage3', {rules: [{ required: false, message: '请输入商品库存', }]}]" ></j-image-upload>
                    </a-form-item>
                  </a-col>
                  <a-col :span="9">
                    <a-form-item label="商品图片" hasFeedback>
                      <j-image-upload class="avatar-uploader" text="上传"   v-decorator="['spuimage', {rules: [{ required: false, message: '请输入商品库存', }]}]"></j-image-upload>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="基本信息" v-if="specifications.length!=0">
                      <template v-for="j in specifications">
                        <template v-for="x in j.params">
                          <a-row>
                            <a-col :span="3">
                              {{x.k}}
                            </a-col>
                            <a-col :span="1"></a-col>
                            <a-col :span="20">
                              <a-input v-model="x.v" />
                            </a-col>
                          </a-row>

                        </template>
                      </template>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col :span="24">
                    <a-form-item label="商品描述" hasFeedback>
                      <j-editor  v-decorator="['description', {rules: [{ required: false, message: '请输入商品描述', }]}]"/>
                    </a-form-item>
                  </a-col>
                </a-row>

              </a-form>
              <a-button type="primary" @click="modifyBasic" style="margin-left:43%">确定修改基本信息</a-button>
            </a-tab-pane>




            <a-tab-pane key="2"  tab="规格">
              <a-button type="primary" class="modifyBtn1" @click="addsku()">添加规格</a-button>
              <a-table :columns="skucolumns" :data-source="skudata"  v-if="isyousku==false">
             <span slot="images" slot-scope="text,record">
               <img :src=record.images alt="">
            </span>
                <span slot="bianji" slot-scope="text,record">
              <a-button type="primary" class="modifyBtn" @click="xiuskuBrandBtn(record)">修改</a-button>
              <a-button type="primary" @click="deleteskuBrandBtn(record)">删除</a-button>
            </span>
              </a-table>

    <template  v-if="isyousku==true">



                <a-form
                  :form="formTranslate"
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                >


                  <!--          //参数选择-->
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
    <!--                            <a-button type="primary">-->
    <!--                              自定义规格-->
    <!--                            </a-button>-->
                              </a-col>
                            </a-row>
                            <br />
                          </template>
                        </template>
                      </template>
<!--                      <template v-for="(v,e) in specifications">-->
<!--                        <template v-for="(x,i) in v.params">-->
<!--                          <a-row>-->
<!--                            <a-col :span="4">-->
<!--                              <span class="fenzu">{{x .k}}:</span>-->
<!--                            </a-col>-->
<!--                            <a-col :span="20">-->
<!--                              &lt;!&ndash;                            <a-input  v-model="x.v" />&ndash;&gt;-->
<!--                              <a-input ref="userNameInput" v-model="x.v" >-->
<!--                                <a-tooltip slot="suffix" title="删除该属性">-->
<!--                                  <a-icon type="delete" style="color: rgba(0,0,0,.45)" @click="deleteSpec(e,i) " />-->
<!--                                </a-tooltip>-->
<!--                              </a-input>-->
<!--                            </a-col>-->
<!--                          </a-row>-->
<!--                        </template>-->
<!--                      </template>-->
                    </a-form-item>
                  </template>




                  <a-form-item label="销售价格"  hasFeedback>
                    <a-input  placeholder="单位为元"  v-decorator="['price', {rules: [{ required: true, message: '请输入商品价格', }]}]"  />
                    <!--            v-decorator="['price', validatorRules.spuPrice]"-->
                  </a-form-item>
                  <a-form-item label="优惠价格"  hasFeedback>
                    <a-input  placeholder="单位为元"  v-decorator="['newPrice', {rules: [{ required: false, message: '请输入优惠价格', }]}]"  />
                    <!--            v-decorator="['price', validatorRules.spuPrice]"-->
                  </a-form-item>
                  <a-form-item label="商品库存"    hasFeedback>
                    <a-input type="number"  v-decorator="['stock', {rules: [{ required: true, message: '请输入商品库存', }]}]" />
                    <!--            v-decorator="['stock', validatorRules.Stock]"-->
                  </a-form-item>
                  <a-form-item label="商品图片" hasFeedback>
                    <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['skuimage', {rules: [{ required: true, message: '请输入商品图片', }]}]" ></j-image-upload>
                  </a-form-item>
                </a-form>

    </template>

            </a-tab-pane>
          </a-tabs>


        </a-modal>
    <!--        修改商品弹出框-->
          <a-modal
            v-model="xiuBrandvisible"
            title="商品"
            @ok="nextStep2"
            @cancel="xiuhandleCancel"
            width="60%">


            <a-form
              :form="formTranslate"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >

              <a-form-item label="分类" hasFeedback >
                <a-input v-model="fenl"  type="hidden" />
                <a-cascader
                  :field-names="{ label: 'name', value: 'id', children: 'childrenList' }"
                  :options="options"
                  :value="xiucids"
                  allowClear="true"
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
                            <a-radio-group  :name=x.k :v-model=x.value :options="x.options" :default-value="x.options[indexes[i]]" @change="onChange2" />
<!--                            {{indexes[i]}}{{i}}{{indexes}}-->
                          </a-col>
                        </a-row>
                        <br />
                      </template>
                    </template>
                  </template>

                </a-form-item>
              </template>

              <a-form-item label="销售价格"  hasFeedback>
                <a-input  placeholder="单位为元"  v-decorator="['price', {rules: [{ required: true, message: '请输入商品价格', }]}]"  />
              </a-form-item>
              <a-form-item label="优惠价格"  hasFeedback>
                <a-input  placeholder="单位为元"  v-decorator="['newPrice', {rules: [{ required: false, message: '请输入优惠价格', }]}]"/>
              </a-form-item>
              <a-form-item label="商品库存"    hasFeedback>
                <a-input type="number"  v-decorator="['stock', {rules: [{ required: true, message: '请输入商品库存', }]}]" />
              </a-form-item>
              <a-form-item label="商品图片" hasFeedback>
                <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['skuimage', {rules: [{ required: true, message: '请输入商品图片', }]}]" ></j-image-upload>
              </a-form-item>
            </a-form>
          </a-modal>
    <!--    删除商品提示框-->
        <a-modal
          title="删除"
          :visible="delspuvisible"
          @ok="delspuhandleOk"
          @cancel="delspuhandleCancel"
        >
          <p>确定要删除该商品吗</p>
        </a-modal>

      <!--    删除sku提示框-->
      <a-modal
        title="删除"
        :visible="skudelspuvisible"
        @ok="skudelspuhandleOk"
        @cancel="skudelspuhandleCancel"
      >
        <p>确定要删除该商品吗</p>
      </a-modal>
    </template>


    <template v-if="shopType==2">
        <a-card title="商品展示" >
          <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" >
            <a-row>
              <a-col :span="6">
                <a-form-item label="商品名称">
                  <a-input placeholder="商品名称" v-model="search.title"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="是否上架">
                  <a-select v-model="search.saleable"  >
                    <a-select-option value=''>全部</a-select-option>
                    <a-select-option value='1'>已上架</a-select-option>
                    <a-select-option value='0'>已下架</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <a-form-item label="商品分类">
                  <a-select  placeholder="选择分类"   v-model="serchfenl"  >
                    <a-select-option  v-for="v in residences" :value=v.id :key="v.name">
                      {{v.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="2">
              </a-col>
              <a-col :span="4">
                <a-button type="primary" icon="search" @click="hotelsearchShop" style="margin-right: 10px">
                  搜索
                </a-button>
                <a-button type="primary" icon="redo" @click="getAllsp">
                  重置
                </a-button>
              </a-col>
            </a-row>
          </a-form>
          <a-table
            :columns="hotelColumns"
            :data-source="hoteldata"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :pagination="ipagination"

            @change="handleTableChange">
           <span slot="image" slot-scope="text,record">
             <img :src=record.image alt="">
          </span>
                    <span slot="saleable" slot-scope="text,record">
                      <a-button type="primary" class="modifyBtn"  @click="hotelshangjia(record)" v-if="record.saleable==1">已上架</a-button>
                      <a-button type="danger" class="modifyBtn" @click="hotelshangjia(record)" v-if="record.saleable==0">已下架</a-button>
                  </span>
            <span slot="bianji" slot-scope="text,record">
            <a-button type="primary" class="modifyBtn" @click="hotelXiuBrandBtn(record)">编辑</a-button>
            <a-button type="primary" @click="hoteldeleteBrandBtn(record)">删除</a-button>
        </span>
          </a-table>
        </a-card>



      <a-modal
        title="删除"
        :visible="hoteldelspuvisible"
        @ok="hotedelspuhandleOk"
        @cancel="hotedelspuhandleCancel"
      >
        <p>确定要删除该商品吗</p>
      </a-modal>



<!--      商品修改弹出页面-->
      <a-modal
        v-model="hotelXiuBrandvisible"
        title="修改商品信息"
        @ok="hotelNextStep2"
        @cancel="hotelXiuhandleCancel"
        width="60%">

        <a-form   :form="hotelFormdata"  :label-col="labelCol" :wrapper-col="wrapperCol">

          <a-form-item label="标题"  hasFeedback>
            <a-input  v-decorator="['title', {rules: [{ required: true, message: '请输入商品名称', }]}]" />
          </a-form-item>
          <a-form-item label="商品介绍" hasFeedback>
            <a-input  v-decorator="['skuInfo', {rules: [{ required: true, message: '请输入商品介绍', }]}]" />
          </a-form-item>
          <a-form-item label="价格"  hasFeedback>
            <a-input   v-decorator="['price', {rules: [{ required: true, message: '请输入商品价格', }]}]" />
          </a-form-item>
          <a-form-item label="优惠价格"  hasFeedback>
            <a-input   v-decorator="['newPrice', {rules: [{ required: false, message: '请输入商品名称', }]}]" />
          </a-form-item>

                  <a-form-item label="所属分类" hasFeedback>
                    <a-select  placeholder="选择分类"  v-decorator="['residence', {rules: [{ required: true, message: '请选择选择品牌', }]}]"  >
                      <a-select-option  v-for="v in residences" :value=v.id :key="v.name">
                        {{v.name}}
                      </a-select-option>
                    </a-select>
                  </a-form-item>

          <a-form-item label="商品图片" hasFeedback>
            <j-image-upload class="avatar-uploader" text="上传"  v-decorator="['images', {rules: [{ required: true, message: '请上传商品图片', }]}]" ></j-image-upload>
          </a-form-item>
        </a-form>
      </a-modal>
    </template>
  </div>

</template>
<script>
  import {getAction, httpAction, postAction} from '@/api/manage'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import JEditor from '@/components/jeecg/JEditor'
  import Vue from 'vue'
  import pick from 'lodash.pick'
  import qs from 'qs'
  import 'url-search-params-polyfill'

  export default {
    components: {
      JImageUpload,
      JEditor
    },
    name: 'recycleBin',
      data(){
        return{
          shopType:"",
          activeKey:"1",
          serchfenl:"",
          residences:[],
          hoteldelspuvisible:false,
          skuvisible:false,
          selectedRowKeys:[],
          optionss:[],
          ckid:"",
          columns:[
            { title: '*', dataIndex: '',  key: 'rowIndex', width: 60, align: "center", customRender: function (t, r, index) {return parseInt(index) + 1;}},
           /* { title: '品牌名称', dataIndex: 'bname', key: 'bname' },*/
            { title: '图片', dataIndex: 'image', key: 'image',scopedSlots: { customRender: 'image' } },
            { title: '所属分类', dataIndex: 'cname', key: 'cname' },
            { title: '商品名称', dataIndex: 'title', key: 'title' },
            { title: '商品条码', dataIndex: 'barCode', key: 'barCode' },
            { title: '是否上架', dataIndex: 'saleable', key: 'saleable', scopedSlots: { customRender: 'saleable' } },
            { title: '编辑', dataIndex: 'isflag', key: 'isflag', scopedSlots: { customRender: 'bianji' } },
          ],
          hotelColumns:[
            { title: '*', dataIndex: '',  key: 'rowIndex', width: 60, align: "center", customRender: function (t, r, index) {return parseInt(index) + 1;}},
           /* { title: '品牌名称', dataIndex: 'bname', key: 'bname' },*/
            { title: '图片', dataIndex: 'image', key: 'image',scopedSlots: { customRender: 'image' } },
            { title: '所属分类', dataIndex: 'cidname', key: 'cidname' },
            { title: '商品名称', dataIndex: 'title', key: 'title' },
            { title: '商品介绍', dataIndex: 'skuInfo', key: 'skuInfo' },
            { title: '销售价格', dataIndex: 'price', key: 'price' },
            { title: '优惠价格', dataIndex: 'newPrice', key: 'newPrice' },
            { title: '是否上架', dataIndex: 'saleable', key: 'saleable', scopedSlots: { customRender: 'saleable' } },
            { title: '编辑', dataIndex: 'isflag', key: 'isflag', scopedSlots: { customRender: 'bianji' }},
          ],
          skucolumns:[
            { title: '商品名称', dataIndex: 'title', key: 'title' },
            { title: '规格', dataIndex: 'ownSpec', key: 'ownSpec' },
            { title: '图片', dataIndex: 'images', key: 'images',scopedSlots: { customRender: 'images' } },
            { title: '优惠价格', dataIndex: 'newPrice', key: 'price' },
            { title: '价格', dataIndex: 'price', key: 'price' },
            { title: '编辑', dataIndex: 'isflag', key: 'isflag', scopedSlots: { customRender: 'bianji' } },
          ],
          data:[],
          skudata:[],
          hoteldata:[],
          search:{
            shopId:"",
            title:'',
            barCode:'',
            cid3:'',
            saleable:"",
            barCodeParam:""
          },
          shopId:'',
          ids:[],
          idss:"",

          fenl:'',
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
          dxuandatas:[],
          brand:[],
          cids:[],
          form: {
            brand:'',
            price:"",
            newPrice:'',
            stock:'',
            description:'',
            afterService:'',
            packingList:'',
            subTitle:'',
            title:'',
            skuimage:"",
            spuimage:'',
            spuimage1:"",
            spuimage2:"",
            spuimage3:""
          },
          hotelForm:{
            title:"",
            skuInfo:"",
            images:"",
            price:"",
            newPrice:"",
            residence:""
          },
          skuVos:[],
          xiucids:[],
          isyousku:false,
          formTranslate: this.$form.createForm(this),
          hotelFormdata: this.$form.createForm(this),
          xiuBrandvisible:false,
          delspuvisible:false,
          skudelspuvisible:false,
          hotelXiuBrandvisible:false,
          visible:false,
          id:'',
          xiushopForm:{},
          // fileList:[],
          indexes:[],
          index:[],
          specifications:[],
          ownSpec:{},
          spu:{},
          sku:{},
          options:[],
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
          validatorRules:{
            spuPrice: {
              rules: [{required: true,validator: this.checkSpuPrice}]
            },
            Stock:{
              rules: [{required: true,validator: this.checkStock}]
            },
          },
        }
      },
      methods:{
        skuhandleOk(){

          let that=this

            this.formTranslate.validateFields((err, values) => {
              if(values.price && values.stock &&values.skuimage){
                if(this.indexes.length==0 && this.specifications.length==0){
                  this.$message.warning('请选择所属分类');
                }else {
                  if(this.specifications.length!=0){
                  }
                  if (this.indexes.length != 0) {


                    if(values.newPrice==undefined){
                      values.newPrice = "";
                    }
                    debugger
                    let skuVo={
                      spuId:that.spu.id,
                      title:that.spu.title,
                      indexes:JSON.stringify(that.indexes),
                      ownSpec:JSON.stringify(that.ownSpec),
                      price: values.price,
                      newPrice: values.newPrice,
                      stock: values.stock,
                      images: values.skuimage,
                      enable:'1',
                      shopId:that.shopId
                    }
                    httpAction('kunze/sku/saveSku',skuVo,'post').then(res=>{
                      console.log(res)
                      if(res.success==true){
                        that.$message.success('添加成功');
                        this.getAllProducts(this.shopId)
                        this.xiuBrandBtn(this.ckid)
                        // this.isyousku=false
                        this.specifications=[]
                        this.dxuandatas=[]
                        this.skuvisible=false
                        // this.visible=false
                        this.isyousku=false
                        // this.optionss=[]
                        // this.xiucids=[]
                        this.activeKey=1
                      }else {
                        that.$message.error('添加失败');
                        this.getAllProducts(this.shopId)
                        // this.isyousku=false
                        this.specifications=[]
                        this.dxuandatas=[]
                        this.skuvisible=false
                        // this.xiucids=[]
                        this.isyousku=false
                        this.activeKey=1
                        // this.visible=false
                        // this.optionss=[]
                      }
                    })



                  }}


              }
            })

        },
        skuhandleCancel(){
          this.skuvisible=false
        },
      // 添加sku
        addsku(){
          this.skuvisible=true
        },

      // 删除sku

        skudelspuhandleOk(){
          let param = new URLSearchParams()
          param.append('id',this.idss)
          debugger
          postAction('/kunze/sku/delSkuById',param).then(res=>{
            if(res.success=true){
              this.skudelspuvisible=false
              this.$message.success('删除成功');
              this.xiuBrandBtn()
            }else {
              this.skudelspuvisible=false
              this.$message.error('删除失败');
            }
            // console.log(res)
          })
        },
        skudelspuhandleCancel(){
          this.skudelspuvisible=false
          this.$message.error('删除失败');
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
          this.xiucids=value
          this.fenl=1
          this.cids=value
          let that=this
          that.indexes=[]
          that.ownSpec={}
          that.index=[]
          that.specTemplate={}
          this.specifications=[]
          that.dxuandatas=[]
          debugger
          getAction('/kunze/spec/specList',{categoryId:value[2]}).then((res)=>{
            console.log(res)
            console.log(JSON.parse(res.result.specifications))
            debugger
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

      //获取分类
        getBrand(){
          let that=this
          let param = new URLSearchParams()
          param.append('cateId','')
          postAction('/kunze/category/qryList',param).then((res)=>{
            that.options=res.result

          })
        },

      //确定修改基本信息
        modifyBasic(){

          let that=this
          this.formTranslate.validateFields((err, values) => {
            if(values.subTitle && values.title && values.barCode){
              console.log(typeof parseInt(values.barCode))
              if(values.barCode.length>16){
                this.$message.warning('商品条码不得大于16位');
                return;
              }

              debugger
              console.log(values)
              that.form.spuimage=values.spuimage
              that.form.spuimage1=values.spuimage1
              that.form.spuimage2=values.spuimage2
              that.form.spuimage3=values.spuimage3
             this.form.afterService=values.afterService
              this.form.packingList=values.packingList
              this.form.description=values.description
              let spuBo = {
                'brandId':'213',
                'cid1': this.cids[0],
                'cid2': this.cids[1],
                'cid3': this.cids[2],
                'image': this.form.spuimage,
                "images": values.spuimage1 + ',' + values.spuimage2 + ',' + values.spuimage3,
                'shopId': this.shopId,
                "id": this.spu.id,
                'barCode': values.barCode,
                'spuDetail': {
                  'afterService': values.afterService,
                  'description': values.description,
                  'packingList': values.packingList,
                  "specifications":JSON.stringify(this.specifications),
                },
                'subTitle': values.subTitle,
                'title': values.title
              }
              console.log(spuBo)
              httpAction('/kunze/spu/updateSpu', spuBo, 'post').then((res) => {
                console.log(res)
                if (res.success == true) {
                  that.form.brand = ""
                  that.cids = []
                  this.form.spuimage = ""
                  that.form.afterService = ''
                  that.form.description = ''
                  that.form.packingList = ''
                  that.form.subTitle = ''
                  that.form.title = ''
                  // that.xiuBrandvisible = false
                  // that.visible = false
                  that.$message.success('修改成功');
                  this.getAllProducts(this.shopId)
                }else {
                  if(res.message=="数据库中已存在该记录"){
                    that.$message.error('该条码已存在');
                  }else {
                    that.$message.error('修改失败');
                  }
                  that.form.brand = ""
                  that.cids = []
                  this.form.spuimage = ""
                  that.form.afterService = ''
                  that.form.description = ''
                  that.form.packingList = ''
                  that.form.subTitle = ''
                  that.form.title = ''
                  // that.xiuBrandvisible = false
                  // that.visible = false

                }
              })
            }

          })

        },
        delspuhandleCancel(){
          this.delspuvisible=false
        },
        delspuhandleOk(){
          // /kunze/spu/template/deletes
          this.delspuvisible=false
          console.log(this.ids)
          if (this.isyousku==false){
            postAction('/kunze/spu/deleteSpu',this.ids).then((res)=>{
              if(res.success==true){
                this.getAllProducts(this.shopId)
                this.$message.success('删除商品成功');
                this.ids=[]
                this.selectedRowKeys=[]
              }else {
                this.getAllProducts(this.shopId)
                this.$message.error('删除商品失败');
                this.ids=[]
                this.selectedRowKeys=[]
              }
            })
          } else {
            postAction('/kunze/spu/template/deletes ',this.ids).then((res)=>{
              if(res.success==true){
                this.getAllProducts(this.shopId)
                this.$message.success('删除商品成功');
                this.selectedRowKeys=[]
                this.ids=[]
              }else {
                this.getAllProducts(this.shopId)
                this.$message.error('删除商品失败');
                this.selectedRowKeys=[]
                this.ids=[]
              }
            })
          }

        },
      //批量上架
        updataAllsable(){
            let  data = {
              saleable:'1',
              shopId:this.shopId,
              spuList:this.ids
            }
          postAction('/kunze/spu/updateSpuSaleable',data).then((res)=>{
              if(res.success==true){
                this.getAllProducts(this.shopId)
                this.$message.success('上架成功');
              }else {
                this.$message.warning('上架失败 ');
              }
            })
        },
        //批量下架
        updataAllsablexia(){
            let  data = {
              saleable:'0',
              shopId:this.shopId,
              spuList:this.ids
            }
            postAction('/kunze/spu/updateSpuSaleable',data).then((res)=>{
              // console.log(res)
              if(res.success==true){
                this.getAllProducts(this.shopId)
                this.$message.success('下架成功');
              }else {
                this.$message.warning('下架失败 ');
              }
            })
        },
      //选择分类
        onChangeShop(e){
          this.cids=e
          this.search.cid3=e[2]
        },
      //点击搜索商品
        searchShop(){
          let that=this
          getAction('/kunze/spu/spuList',{
            pageNo :"1",
            pageSize : that.ipagination.pageSize,
            shopId : that.shopId,
            barCode:that.search.barCode,
            cid3:that.search.cid3,
            title:that.search.title,
            saleable:that.search.saleable,
            id:that.search.shopId,
            barCodeParam:that.search.barCodeParam
          }).then((res)=>{
            that.data=res.result.list
            let key=0
            that.data.forEach(e=>{
              e.image=window._CONFIG['domianURL']+'/'+e.image
              e.key=key++
            })
            that.ipagination.total = res.result.total;
          })
        },
      //点击商品上架或下架
        shangjia(e){
          let spuList=[]
          spuList.push(e.id)
          if(e.saleable==0){
            let  data = {
              saleable:'1',
              shopId:this.shopId,
              spuList:spuList
            }
            postAction('/kunze/spu/updateSpuSaleable',data).then((res)=>{
              if(res.success==true){
                this.getAllProducts(this.shopId)
                this.$message.success('上架成功');
              }else {
                this.$message.warning('上架失败 ');
              }
            })
          }else {
            let  data = {
              saleable:'0',
              shopId:this.shopId,
              spuList:spuList
            }
            postAction('/kunze/spu/updateSpuSaleable',data).then((res)=>{
              if(res.success==true){
                this.getAllProducts(this.shopId)
                this.$message.success('下架成功');
              }else {
                this.$message.warning('下架失败 ');
              }
            })
          }
        },
        //分页
        handleTableChange(pagination, filters, sorter) {
          //分页、排序、筛选变化时触发
          //TODO 筛选
          debugger
          if (Object.keys(sorter).length > 0) {
            this.isorter.column = sorter.field;
            this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
          }
          this.ipagination = pagination;
          if(this.shopType==1){
            this.getAllProducts(this.shopId);
          }else {
            this.getAllsp()
          }

        },
        xiuskuBrandBtn(e){
          console.log(this.dxuandatas)
          this.sku=e
          let that=this

          console.log(this.xiucids)
          this.xiuBrandvisible=true
          this.form.price=e.price
          this.form.stock=e.stock
          this.form.newPrice=e.newPrice
          this.form.skuimage=e.skuimage
          this.$nextTick(() => {

            this.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','price','stock','brand','skuimage','spuimage','spuimage1','spuimage2','spuimage3','afterService','packingList','description','newPrice','barCode'))

          });




          this.fenl=1
          // that.indexes=[]
          that.ownSpec={}
          that.index=[]
          that.specTemplate={}
          this.specifications=[]
          that.dxuandatas=[]

          getAction('/kunze/spec/specList',{categoryId:that.xiucids[2]}).then((res)=>{

            // console.log(JSON.parse(res.result.specifications))
            if(res.result==null){
              that.dxuandatas=[]
            }else {
              that.dxuandatas=JSON.parse(res.result.specifications)
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
                      // that.indexes.push(0)
                      that.index.push(y.k)
                    }
                  }
                })
              })
            }
          })
        },
        deleteskuBrandBtn(e){
          this.skudelspuvisible=true
          this.idss=e.id
        },
        handleCancel(){
          this.visible=false
          this.isyousku=false
          this.activeKey=1
          this.optionss=[]
          this.xiucids=[]
        },
        handleOk(){
          let that=this
          if(that.isyousku==true){
            this.formTranslate.validateFields((err, values) => {
                if(values.price && values.stock &&values.skuimage){
                  if(this.indexes.length==0 && this.specifications.length==0){
                    this.$message.warning('请选择所属分类');
                  }else {
                    if(this.specifications.length!=0){
                    }
                    if (this.indexes.length != 0) {


                        if(values.newPrice==undefined){
                          values.newPrice = "";
                        }
                        debugger
                          let skuVo={
                          spuId:that.spu.id,
                          title:that.spu.title,
                          indexes:JSON.stringify(that.indexes),
                          ownSpec:JSON.stringify(that.ownSpec),
                          price: values.price,
                          newPrice: values.newPrice,
                          stock: values.stock,
                          images: values.skuimage,
                          enable:'1',
                          shopId:that.shopId
                        }
                        httpAction('kunze/sku/saveSku',skuVo,'post').then(res=>{
                          console.log(res)
                          if(res.success==true){
                            that.$message.success('修改成功');
                            this.getAllProducts(this.shopId)
                            this.isyousku=false
                            this.specifications=[]
                            this.dxuandatas=[]
                            this.visible=false
                            this.xiuBrandBtn(this.ckid)
                            this.isyousku=false
                            // this.optionss=[]
                            // this.xiucids=[]
                            this.activeKey=1
                          }else {
                            that.$message.error('修改失败');
                            this.getAllProducts(this.shopId)
                            this.isyousku=false
                            this.specifications=[]
                            this.dxuandatas=[]
                            // this.visible=false
                            // this.xiucids=[]
                            this.isyousku=false
                            this.activeKey=1
                            // this.optionss=[]
                          }
                        })



                    }}


                }
            })
          }
        },
        xiuBrandConfirm(){
          this.xiuBrandvisible=false
        },
        xiuBrandClose(){
          this.xiuBrandvisible=false
        },
        xiushop(){
          this.xiuBrandvisible=false
        },
        deleteBrandBtn(e){
          this.delspuvisible=true
          this.ids=[]
          this.ids.push(e.id)
          let param = new URLSearchParams()
          param.append('spuId',e.id)
          postAction('/kunze/sku/qrySkuBySpuId',param).then((res)=> {
            console.log(res)
            if(res.result==null){
              this.isyousku=true
            }else {
              this.isyousku=false
            }
          })

        },
        //批量删除
        deleteAllBrandBtn(){
          this.delspuvisible=true
          // console.log(this.ids)
        },
        //点击查看按钮
        xiuBrandBtn(e){
          // debugger/
          // this.form.banimage1=e.images
          console.log(e)
          // if(e==)
          this.ckid=e
          this.spu=[]
          this.skudata=[]

          let that=this
          let param = new URLSearchParams()
          param.append('spuId',e.id)
          postAction('/kunze/sku/qrySkuBySpuId',param).then((res)=>{
            debugger
            console.log(res)
            if(res.success==true && res.result!=null && res.result!='null'){
              if(res.result[0].specifications!=null){
                this.specifications=[]
                this.specifications=JSON.parse(res.result[0].specifications)
              }
              // res.result.forEach(e=>{
              //   e.indexes
              // })
              // that.getBrand()
              that.xiucids=null
              that.indexes=JSON.parse(res.result[0].indexes)
              console.log(that.indexes)
              let arr=[]
              that.xiucids=JSON.parse(JSON.stringify(arr))
              // console.log(this.specifications)
              // that.xiucids.push(res.result[0].cid1)
              // that.xiucids.push(res.result[0].cid2)
              // that.xiucids.push(res.result[0].cid3)

              Vue.set(that.xiucids,0,res.result[0].cid1)
              Vue.set(that.xiucids,1,res.result[0].cid2)
              Vue.set(that.xiucids,2,res.result[0].cid3)


              let param = new URLSearchParams()
              param.append('cateId','')
              postAction('/kunze/category/qryList',param).then((res)=>{
                that.options=res.result
                that.optionss=res.result

              })

              that.skudata=res.result
              that.skudata.forEach(e=>{
                console.log(e)
                e.skuimage=e.images
                e.images=window._CONFIG['domianURL']+'/'+e.images
                e.ownSpec=e.ownSpec.slice(1,e.ownSpec.length-1)
              })
              this.form.packingList= that.skudata[0].packingList
              this.form.afterService=that.skudata[0].afterService
              this.form.description=that.skudata[0].description

            }else {
              that.isyousku=true
            }

            //
            that.spu=e
            if(that.spu.images && typeof that.spu.images == 'string'){
              that.spu.images=that.spu.images.split(",")
            }
            console.log(that.spu)

            this.form.title=this.spu.title
            this.form.barCode=this.spu.barCode
            this.form.subTitle=this.spu.subTitle
            this.brand.forEach(e=>{
              if(e.bname==this.spu.bname){
                this.form.brand=e.bid
              }
            })
            this.form.spuimage= this.spu.spuimage
            this.form.spuimage1=this.spu.images[0]
            this.form.spuimage2=this.spu.images[1]
            this.form.spuimage3=this.spu.images[2]
            this.$nextTick(() => {
              this.formTranslate.setFieldsValue(pick(this.form, 'title','barCode', 'subTitle','price','newPrice','stock','brand','skuimage','spuimage','spuimage1','spuimage2','spuimage3','afterService','packingList','description'))
            });
            this.visible=true
          })




        },
        onSelectChange(selectedRowKeys, selectedRows){
          // console.log(selectedRowKeys, selectedRows)
          this.selectedRowKeys=selectedRowKeys
          let that=this
          that.ids=[]
          selectedRows.forEach(e=>{
            that.ids.push(e.id)
          })
        },
        //获取所有商品
        getAllProducts(e){
          let that=this
          debugger
          // console.log(that.shopId)
          getAction('/kunze/spu/spuList',{
            pageNo :that.ipagination.current,
            pageSize : that.ipagination.pageSize,
            shopId : e,
              barCode:that.search.barCode,
            cid3:that.search.cid3,
            title:that.search.title,
            saleable:that.search.saleable,
            id:that.search.shopId,
            barCodeParam:that.search.barCodeParam
          }).then((res)=>{
            console.log(res)
            that.data=res.result.list

            let key=0
            that.data.forEach(e=>{
              e.spuimage=e.image
              e.image=window._CONFIG['domianURL']+'/'+e.image

              e.key=key++
            })
            that.ipagination.total = res.result.total;
            // console.log(that.data)
          })
        },
        edit(record) {
          this.$nextTick(() => {
            this.hotelFormdata.setFieldsValue(pick(this.hotelForm, 'title', 'skuInfo','images','price','newPrice','residence'))
            this.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','price','newPrice','stock','skuimage','spuimage','spuimage1','spuimage2','spuimage3','afterService','packingList','description'))
          });
        },

        //点击修改sku取消按钮
        xiuhandleCancel(){
          this.xiuBrandvisible=false
          // this.xiucids=[]
          this.dxuandatas=[]
          this.form.price=""
          this.form.stock=""
          this.form.newPrice=""
          this.form.skuimage=""
          this.$nextTick(() => {
            this.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','price','stock','brand','skuimage','spuimage','spuimage1','spuimage2','spuimage3','afterService','packingList','description','newPrice'))
          });
        },
        //表单验证
        checkSpuPrice(rule, value, callback){
          // console.log(value)
          if(!value){
            callback("商品价格不能为空！");
          }else {
            var priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
            if(!value.match(priceReg)){
              callback("请输入正确的商品价格:整数或者保留两位小数");
            }else {
              callback();
            }
          }
        },
        checkStock(rule, value, callback){
          if(!value){
            callback("库存数量不能为空！");
          }else {
            var reg =/^([1-9][\d]{0,7}|0)?$/;
            if(!value.match(reg)){
              callback("库存数量只能输入数字！")
            }else {
              callback();
            }
          }
        },
        //点击修改sku确认按钮
        nextStep2(){
          let that = this;
          // 触发表单验证
          that.formTranslate.validateFields((err, values) => {
            if(values.newPrice==undefined){
              values.newPrice="";
            }
            that.form.stock=values.stock
            that.form.price=values.price
            that.form.newprice=values.newPrice
            that.form.skuimage=values.skuimage
            // console.log(values.price, values.stock, values.skuimage, values.newPrice)

            if (that.form.stock=='0'){
              this.$message.warning('库存不能为0');
              return;
            }
            if (that.form.price=='0'){
              this.$message.warning('销售价格不能为0');
              return;
            }
            if (that.form.newprice=='0'){
              this.$message.warning('优惠价格不能为0');
              return;
            }
            if(values.price,values.stock,values.skuimage){
              let priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
              if(!that.form.price.match(priceReg)){
                this.$message.warning('请输入正确的商品价格:整数或者保留两位小数');
                return
              }else {
                if(that.form.newprice!=""&&that.form.newprice!=undefined&&that.form.newprice!=null){
                  if(!that.form.newprice.match(priceReg)){
                    this.$message.warning('请输入正确的商品优惠价格:整数或者保留两位小数');
                    return;
                  }else {
                    let newPrice = parseFloat(that.form.newprice);
                    let price = parseFloat(that.form.price);
                    if(newPrice>=price){
                      this.$message.warning('优惠价格不能大于销售价格！');
                      return;
                    }
                  }
                }
                    that.form.stock=values.stock
                    that.form.price=values.price
                    that.form.newPrice=values.newPrice
                    that.form.skuimage=values.skuimage
                    this.skuVos=[]
                    this.skuVos.push({
                      id: that.sku.id,
                      price: values.price,
                      stock: values.stock,
                      images:values.skuimage,
                      newPrice:values.newPrice,
                      indexes: JSON.stringify(that.indexes),
                      ownSpec:JSON.stringify(that.ownSpec)

                    });

                let spuBo = {
                      'shopId': this.shopId,
                      "id": this.spu.id,
                      "cid1":this.xiucids[0],
                      "cid2":this.xiucids[1],
                      "cid3":this.xiucids[2],
                      'skuVos': this.skuVos,
                    }
                    debugger
                  httpAction('/kunze/spu/updateSpu', spuBo, 'post').then((res) => {
                    console.log(res)
                    if (res.success == true) {
                        that.skuVos = []
                        that.xiuBrandvisible = false
                        // that.visible = false
                      that.xiuBrandBtn(this.ckid)
                      // that.xiucids=[]
                        that.$message.success('修改成功');
                      that.getAllProducts(this.shopId)
                      that.form.price=""
                      that.form.stock=""
                      that.form.newPrice=""
                      that.form.skuimage=""
                      that.dxuandatas=[]
                      that.$nextTick(() => {

                        that.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','price','stock','brand','skuimage','spuimage','spuimage1','spuimage2','spuimage3','afterService','packingList','description','newPrice'))

                      });
                      }else {
                      that.form.price=""
                      that.form.stock=""
                      that.form.newPrice=""
                      that.form.skuimage=""
                      that.$nextTick(() => {

                        that.formTranslate.setFieldsValue(pick(this.form, 'title', 'subTitle','price','stock','brand','skuimage','spuimage','spuimage1','spuimage2','spuimage3','afterService','packingList','description','newPrice'))

                      });
                      that.$message.error('修改失败');
                      // that.xiucids=[]
                      that.dxuandatas=[]

                      that.getAllProducts(this.shopId)
                    }
                    })

              }


            }
          })
        },



        // 点击上架或者下架
        hotelshangjia(e){
          console.log(e)
          let hotelSku={
            "id":e.id,
            "saleable": 0,
          }
          if(e.saleable==0){
            hotelSku.saleable=1
          }else{
            hotelSku.saleable=0
          }
          console.log(hotelSku)



          postAction('/kunze/sku/updateHotelSku',hotelSku).then((res)=>{
            console.log(res)
            if(res.success==true){
              if(hotelSku.saleable==1){
                this.$message.success('上架成功');
              }else {
                this.$message.success('下架成功');
              }
              this.getAllsp()
              this.hotelXiuBrandvisible=false
            }else {
              if(hotelSku.saleable==1){
                this.$message.error('上架失败');
              }else {
                this.$message.error('下架失败');
              }

              this.getAllsp()
              this.hotelXiuBrandvisible=false
            }

          })

        },

        // 点击删除确认按钮
        hotedelspuhandleOk(){
          console.log(this.hotelForm.id)
          let param = new URLSearchParams()
          param.append('id',this.hotelForm.id)
          postAction('/kunze/sku/delHotelSkuById',param).then(res=>{
            if(res.success==true){
              this.$message.success('删除成功');
              this.getAllsp()
              this.hoteldelspuvisible=false
            }else {
              this.$message.error('删除失败');
              this.getAllsp()
              this.hoteldelspuvisible=false
            }
            // console.log(res)
          })
        },
        // 点击删除取消按钮、
         hotedelspuhandleCancel(){
           this.hoteldelspuvisible=false
         },
        // 点击删除按钮
        hoteldeleteBrandBtn(e){
          // console.log(e)
          this.hoteldelspuvisible=true
          this.hotelForm.id=e.id
        },

        // 点击饭店商品修改确认按钮
        hotelNextStep2(){

          this.hotelFormdata.validateFields((err, values) => {
              if(values.title && values.skuInfo && values.images && values.price  && values.residence){
                console.log(values.images)
                let hotelSku={
                  "cid": values.residence,
                  "id":this.hotelForm.id,
                  "images": values.images,
                  "newPrice": values.newPrice,
                  "price": values.price,
                  "skuInfo": values.skuInfo,
                  "title": values.title,
                }
                if(values.residence==this.hotelForm.residence){
                  hotelSku.cid=this.hotelForm.cid
                }
                postAction('/kunze/sku/updateHotelSku',hotelSku).then((res)=>{
                  console.log(res)
                  if(res.success==true){
                    this.$message.success('修改成功');
                    this.getAllsp()
                    this.hotelXiuBrandvisible=false
                  }else {
                    this.$message.error('修改失败');
                    this.getAllsp()
                    this.hotelXiuBrandvisible=false
                  }

                })
              }
          })
        },
        // 点击饭店商品修改取消按钮
        hotelXiuhandleCancel(){
          this.hotelXiuBrandvisible=false
        },
        //点击饭店商品修改按钮
        hotelXiuBrandBtn(e){
          console.log(e)
          this.hotelXiuBrandvisible=true
          this.hotelForm.title=e.title
          this.hotelForm.skuInfo=e.skuInfo
          this.hotelForm.images=e.images
          // this.hotelForm.image=e.images
          this.hotelForm.price=e.price
          this.hotelForm.newPrice=e.newPrice
          this.hotelForm.residence=e.cidname
          this.hotelForm.cid=e.cid
          this.hotelForm.id=e.id
          this.$nextTick(() => {
            this.hotelFormdata.setFieldsValue(pick(this.hotelForm, 'title', 'skuInfo','images','price','newPrice','residence'))
          });


          // postAction('/kunze/sku/updateHotelSku',)
        },
        //获取饭店所有商品
        getAllsp(){
          debugger
          let param = new URLSearchParams()
          param.append('shopId',this.shopId)
          param.append('pageNo',this.ipagination.current)
          param.append('pageSize',this.ipagination.pageSize)
          postAction('/kunze/sku/queryHotelSku',param).then((res)=>{
            console.log(res)
            this.hoteldata=res.result.list
            this.ipagination.total = res.result.total
            let key=0
            this.hoteldata.forEach(e=>{
              console.log(e)
              if(e.newPrice!="" || e.newPrice!=null){
                e.newPrice=e.newPrice/100
              }
              if(e.price!="" || e.price!=null){
                e.price=e.price/100
              }
              e.image=window._CONFIG['domianURL']+'/'+e.images

              e.key=key++
            })
          })
        },

        //搜索
        hotelsearchShop(){
          let that=this
          let param = new URLSearchParams()
          param.append('shopId',this.shopId)
          param.append('title',that.search.title)
          param.append('saleable',that.search.saleable)
          param.append('cid',that.serchfenl)
          param.append('pageNo',this.ipagination.current)
          param.append('pageSize',this.ipagination.pageSize)
          postAction('/kunze/sku/queryHotelSku',param).then((res)=>{
            console.log(res)
            this.hoteldata=res.result.list

            let key=0
            this.hoteldata.forEach(e=>{
              console.log(e)
              if(e.newPrice!="" || e.newPrice!=null){
                e.newPrice=e.newPrice/100
              }
              if(e.price!="" || e.price!=null){
                e.price=e.price/100
              }
              e.image=window._CONFIG['domianURL']+'/'+e.images

              e.key=key++
            })
          })
        },
        getAllfl(){
          let param = new FormData()
          param.append('shopId',localStorage.getItem('shopId'))
          param.append('isShow ',false)
          postAction('/kunze/category/getHotelMenu',param).then((res)=>{
            this.residences=res.result
            // console.log(this.residences)
          })
        }

      },
      mounted() {
        this.shopId=localStorage.getItem('shopId')
        this.shopType=localStorage.getItem('shopType')
        if(localStorage.getItem('shopType')==1){
          this.getAllProducts(this.shopId)
          this.getBrand()
        }else {
          this.getAllsp()
          this.getAllfl()
        }


      }
  }
</script>
<style scoped>
  .modifyBtn{
    margin-right: 10px;
  }
  .modifyBtn1{
    margin-bottom: 10px;
    margin-right: 10px;
  }
  img{
    width: 50px;
    height: 50px;
  }
</style>
