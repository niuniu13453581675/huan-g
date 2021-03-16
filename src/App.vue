<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>

</template>
<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enquireScreen from '@/utils/device'
  import {postAction} from './api/manage'

  export default {
    data () {
      return {
        locale: zhCN,
        _beforeUnload_time: 0,
        _gap_time: 0,
        is_fireFox: navigator.userAgent.indexOf("Firefox") > -1,
      }
    },

    created () {
      let that = this
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }

      })
      // 在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem('store')) {
        this.$store.replaceState(
          Object.assign(
            {},
            this.$store.state,
            JSON.parse(sessionStorage.getItem('store'))
          )
        )
      }
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      // 在页面刷新时将vuex里的信息保存到sessionStorage里
      // beforeunload事件在页面刷新时先触发
      window.addEventListener('beforeunload', (e) => {
        sessionStorage.setItem('store', JSON.stringify(this.$store.state))
      })

      window.addEventListener("beforeunload", e => {
        this.beforeunloadHandler(e)
        let userAgent = navigator.userAgent
        let isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) { //判断是否Opera浏览器
          return "Opera"
        };
        if(userAgent.indexOf("Firefox") > -1){
          // this.unloadHandler();
        }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera){
          e = e ? e : (window.event ? window.event : null);
          var cy = e.clientY || e.target.event.clientY;
          var ak = e.altKey || e.target.event.altKey;
          if (cy < 0 || ak) {
            this.unloadHandler();
          }
        }
      });
      window.addEventListener("unload", async e => {
        this.unloadHandler(e)
      });



    },
    methods:{
      beforeunloadHandler(e) {
        this._beforeUnload_time = new Date().getTime();
      },
      unloadHandler(e) {
        this._gap_time = new Date().getTime() - this._beforeUnload_time;

        //判断是窗口关闭还是刷新
        localStorage.setItem('time',this._gap_time)
        // if (this._gap_time <= 5) {
        //   postAction('/sys/logout').then((res) => {
        //     localStorage.setItem('shopId','')
        //     window.localStorage.clear()
        //   })
        // }
      },
    },

  }
</script>
<style>
  #app {
    height: 100% ;
  }
</style>