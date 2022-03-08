import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import routerr from './router'
import VueRouter from 'vue-router'
import axios from 'axios'
import Login from './components/Login'
import HelloWorld from './components/HelloWorld'
import Forword from './components/Forword'
import Register from './components/Register'
import SelectPeople from './components/SelectPeople'
Vue.use(VueRouter)

Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.config.productionTip = false
// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/', component: App, redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/talk/:id', component: HelloWorld },
  { path: '/forword', component: Forword },
  { path: '/register', component: Register },
  { path: '/select/:id', component: SelectPeople },
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
//路由守卫，防止用户没有登录就进入聊天室
router.beforeEach((to, from, next) => {
  if (to.path.split('/')[to.path.split('/').length - 2] === 'talk') {
    if (!localStorage.getItem("userId")) {
      next('/login')
    } else if (localStorage.getItem("userId") !== to.path.split('/')[to.path.split('/').length - 1]) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
new Vue({
  render: h => h(App),
  router,
  axios
  // routerr
}).$mount('#app')
