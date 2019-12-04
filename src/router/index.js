import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../components/Login";
import Message from "../components/Message";
import MessageAdmin from "../components/MessageAdmin";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path:'/message',
    name:'message',
    component:Message
  },
  {
    path:'/messageAdmin',
    name:'messageAdmin',
    component:MessageAdmin
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
