// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import './assets/iconfont.css'
import FastClick from 'fastclick'
// import axios from 'axios'
import mandMobile from 'mand-mobile'
import 'mand-mobile/lib/mand-mobile.css'
import Loading from '@/router/Loading/loading'
import App from './App'
import router from './router'
import vueWechatTitle from 'vue-wechat-title'
// import iosbugfixed from '@/directives'
// 引入屏幕适配 方案
//  import 'lib-flexible'
// import './assets/theme.custom.css'
Vue.config.productionTip = false

// axios.defaults.baseURL = process.env.API_ROOT
// axios.defaults.withCredentials = true
// Vue.prototype.$axios = axios;
Vue.use(vueWechatTitle)
Vue.use(Loading)
// Vue.use(mandMobile)
// Vue.use(cookie)
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    App,
  },
  template: "<App/>",
});
