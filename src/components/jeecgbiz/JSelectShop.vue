<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectShop',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '超市',
          displayKey: 'shopName',
          returnKeys: ['id','id'],
          listUrl: '/kunze/shop/list',
          queryParamCode: 'shopName',
          queryParamText: '超市名称',
          columns: [
            { title: '超市名称', dataIndex: 'shopName', align: 'center', width: '40%', widthRight: '70%' },
            { title: '超市地址', dataIndex: 'shopAddress', align: 'center', width: '45%' },
          ]
        }
      }
    },
    computed: {
      configs() {
        return Object.assign({ value: this.value }, this.settings, this.$attrs)
      }
    }
  }
</script>

<style lang="less" scoped></style>