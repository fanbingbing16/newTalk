import VueRouter from 'vue-router'
import Login from '../components/Login'
import HelloWorld from '../components/HelloWorld'
import Forword from '../components/Forword'
import Register from '../components/Register'
import Select from '../components/Select'
import Mzhengpaiban from '../components/Mzhengpaiban'
import Navigation from '../components/Navigation'
import DoctorDetail from '../components/DoctorDetail'
import MedicalKnowledge from '../components/MedicalKnowledge'
import OnlineConsultation from '../components/Onlineconsultation/OnlineConsultation'
import Talk from '../components/Onlineconsultation/Talk'
import Charge from '../components/Charge'
import ChargeMoney from '../components/ChargeMoney'
import RegisterDoctor from '../components/RegisterDoctor'
import Reservation from '../components/Reservation'
import History from '../components/Onlineconsultation/History'
import Prescription from '../components/Prescription'
import Welcome from '../components/Welcome'
import ManageLogin from '../components/manage/Login'
import ManageNavigation from '../components/manage/Navigation'
import ManagePrescription from '../components/manage/Prescription'
import ManageMengZheng from '../components/manage/MengZheng'
import App from '../App.vue'

import Vue from 'vue'

const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)
// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
// 我们晚点再讨论嵌套路由。
const routes = [
  { path: '/', component: App, redirect: '/login' },
  { path: '/manage/login', component: ManageLogin },
  { path: '/login', component: Login },
  { path: '/talk/:id', component: HelloWorld },
  { path: '/forword', component: Forword },
  { path: '/register', component: Register },
  { path: '/select/:id', component: Select },
  {
    path: '/navigation', component: Navigation, redirect: 'navigation/welcome',
    children: [
      { path: 'mengzhengpaiban', component: Mzhengpaiban },
      { path: ':id/medicalknowledge', component: MedicalKnowledge },
      {
        path: 'onlineconsultation', component: OnlineConsultation,
      },
      {
        path: 'history', component: History
      },
      {
        path: 'charge', component: Charge
      },
      { path: 'reservation', component: Reservation },
      {
        path: 'prescription', component: Prescription
      },
      {
        path: 'welcome', component: Welcome
      }
    ]
  },
  {
    path: '/manage/navigation', component: ManageNavigation, redirect: '/manage/navigation/welcome', children: [
      {
        path: 'welcome', component: Welcome
      },
      {
        path: 'prescription', component: ManagePrescription
      },
      { path: 'mengzheng', component: ManageMengZheng }
    ]
  },
  { path: '/talkdoctor/:id', component: Talk, name: 'talkdoctor' },
  {
    path: '/doctor', component: DoctorDetail
  },
  {
    path: '/chargeMoney/:id', name: 'ChargeMoney', component: ChargeMoney
  },
  {
    path: '/doctor/register', component: RegisterDoctor
  }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})
//路由守卫，防止用户没有登录就进入聊天室,（现在改成任何页面都不可以进去，除非登录）
router.beforeEach((to, from, next) => {
  //talk是聊天室
  if (to.path === '/manage/login' || to.path === '/login' || to.path === '/forword' || to.path === '/register' || to.path === '/doctor/register') {
    next()
  } else {
    if (!localStorage.getItem("userId")) {
      next('/login')
    }
    else {
      next()
    }
  }
})
export default router