import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import "@/assets/iconfont/iconfont.css"
import "./dependences/element-ui"
import './dependences/routerMy'
import router from './dependences/routerMy'
Vue.prototype.$axios = axios
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  router,
  axios
  // routerr
}).$mount('#app')
