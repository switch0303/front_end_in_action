<template>
  <div class="layout-wrapper">
    <div class="layout-side">
      <ul class="sub-apps">
        <li v-for="item in microApps" :class="{active: item.activeRule === current}" :key="item.name" @click="goto(item)">{{ item.description }}</li>
      </ul>
    </div>
    <div class="layout-main">
      <div class="userinfo">
          <div class="text">你好!{{ user.name }}</div>
      </div>
      <div id="subapp-viewport" class="subapp-main"></div>
    </div>
  </div>
</template>

<script>
import NProgress from 'nprogress'
import microApps from './micro-app'
import store from '@/store'
export default {
  name: 'App',
  data () {
    return {
      isLoading: true,
      microApps,
      current: '/sub-vue/'
    }
  },
  computed: {
    user () {
      return store.getGlobalState('user')
    }
  },
  watch: {
    isLoading (val) {
      if (val) {
        NProgress.start()
      } else {
        this.$nextTick(() => {
          NProgress.done()
        })
      }
    }
  },
  components: {},
  methods: {
    goto (item) {
      history.pushState(null, item.activeRule, item.activeRule)
      // this.current = item.name
    },
    bindCurrent () {
      const path = window.location.pathname
      if (this.microApps.findIndex(item => item.activeRule === path) >= 0) {
        this.current = path
      }
    },
    listenRouterChange () {
      const _wr = function (type) {
        const orig = history[type]
        return function () {
          const rv = orig.apply(this, arguments)
          const e = new Event(type)
          e.arguments = arguments
          window.dispatchEvent(e)
          return rv
        }
      }
      history.pushState = _wr('pushState')

      window.addEventListener('pushState', this.bindCurrent)
      window.addEventListener('popstate', this.bindCurrent)

      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('pushState', this.bindCurrent)
        window.removeEventListener('popstate', this.bindCurrent)
      })
    }
  },
  created () {
    this.bindCurrent()
    NProgress.start()
  },
  mounted () {
    this.listenRouterChange()
  }
}
</script>

<style lang="scss">
html, body{
  margin: 0 !important;
  padding: 0;
}
  .layout-wrapper{
      width: 100vw;
      height: 100vh;
      display: flex;
    .layout-side{
      width: 150px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      .sub-apps {
        display: flex;
        flex-direction: column;
        list-style: none;
        padding: 0;
        li{
          list-style: none;
          margin: 10px 20px;
          padding: 20px 16px;
          text-align: center;
          background-color: aliceblue;
          cursor: pointer;
          text-decoration: underline;
          &.active{
            color: #42b983;
          }
        }
      }
    }
    .layout-main{
        flex: 1;
        display: flex;
        flex-direction: column;
        .userinfo{
            flex: none;
            padding: 6px 60px;
            display: flex;
            .text {
                margin-left: auto;
            }
        }
        .subapp-main {
            flex: 1;
        }
    }
  }
</style>
