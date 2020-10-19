// 引入
import Vue from 'vue'
import VueRouter from 'vue-router'

// // 引入子组件
// import Login from '../components/login/Login.vue'
// import Home from '../components/home/Home.vue'
// import Users from '../components/users/Users.vue'
// import Roles from '../components/roles/Roles.vue'
// import Rights from '../components/rights/Rights.vue'
// import Categories from '../components/categories/Categories.vue'
// import Goods from '../components/goods/Goods.vue'
// import GoodsAdd from '../components/goods/GoodsAdd.vue'
// import Params from '../components/goods/Params.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

// 引入子组件 拆离出7个异步加载
const Login = () => import('../components/login/Login.vue')
const Home = () => import('../components/home/Home.vue')
const Users = () => import('../components/users/Users.vue')
const Roles = () => import('../components/roles/Roles.vue')
const Rights = () => import('../components/rights/Rights.vue')
const Categories = () => import('../components/categories/Categories.vue')
const Goods = () => import('../components/goods/Goods.vue')
const GoodsAdd = () => import('../components/goods/GoodsAdd.vue')
const Params = () => import('../components/goods/Params.vue')
const Order = () => import('../components/order/Order.vue')
const Report = () => import('../components/report/Report.vue')

// 模块化工程 使用Vue.use()
Vue.use(VueRouter)

// 实例化Router
const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
          path: '/users/:page?',
          name: 'users',
          component: Users
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/rights',
          name: 'rights',
          component: Rights
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: GoodsAdd
        },
        {
          path: '/params',
          name: 'params',
          component: Params
        },
        {
          path: '/orders',
          name: 'orders',
          component: Order
        },
        {
          path: '/reports',
          name: 'reports',
          component: Report
        }
      ]
    }
  ]
})

// 全局前置导航守卫  是 router 里面的一个方法
// to : 目标路由对象
// from : 来源路由对象
// next 下一步
//     next() 允许下一步/允许访问
//     next(false) 不允许
//     next('/login') 跳login
router.beforeEach((to, from, next) => {
  // 1. 判断是否是登录页
  if (to.path === '/login') {
    next()
  } else {
    // 2. 判断是否登录过
    const token = localStorage.getItem('token')
    token ? next() : next('/login')
  }
})

export default router
