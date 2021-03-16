<template>
  <div class="rank">
    <h4 class="title">{{ title }}<a id="more" @click="more" style="margin-left: 68%;cursor: pointer">全部</a></h4>
    <ul class="list" :style="{height:height?`${height}px`:'auto',overflow:'auto'}">
      <li :key="index" v-for="(item, index) in list">
        <a @click="loads(item.id)">
          <span :class="index < 3 ? 'active' : null">{{ index + 1 }}</span>
          <span>{{ item.name }}</span>
          <span style="color: #00DB00;font-weight: bold;"><span style="color: #2eabff;background-color: #fff;font-weight: bold"> {{ item.shopCharge }}</span> {{ item.total }}<span style="color: red;font-weight: bold;margin-left: 50px">{{item.charge}}</span></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "RankList",
    // ['title', 'list']
    props: {
      title: {
        type: String,
        default: ''
      },
      list: {
        type: Array,
        default: null
      },
      height: {
        type: Number,
        default: null
      }
    },
    methods:{
      loads(shopId){
        this.$emit('func',shopId)
      },
      more(){
        this.$emit('more');
      }
    }
  }
</script>

<style lang="less" scoped>
  #more:hover{
    text-decoration:underline;
  }
  .rank {
    padding: 0 32px 32px 72px;

    .list {
      margin: 25px 0 0;
      padding: 0;
      list-style: none;

      li {
        margin-top: 16px;

        span {
          color: rgba(0, 0, 0, .65);
          font-size: 14px;
          line-height: 22px;

          &:first-child {
            background-color: #f5f5f5;
            border-radius: 20px;
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            margin-right: 24px;
            height: 20px;
            line-height: 20px;
            width: 20px;
            text-align: center;
          }
          &:nth-child(3){
            width: 190px;
          }
          &.active {
            background-color: #314659;
            color: #fff;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
  }

  .mobile .rank {
    padding: 0 32px 32px 32px;
  }

</style>