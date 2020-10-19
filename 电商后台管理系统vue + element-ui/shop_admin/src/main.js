// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 引入路由 进行挂载
import router from './router/router.js'

// 引入element-ui
import ElementUI from 'element-ui'
// 如果引入在线的css需注释掉本地引入
import 'element-ui/lib/theme-chalk/index.css'

// 引入自定义全局公共css
import './assets/css/common.css'
// 导入vue-table-with-tree-grid组件并使用
import TreeTable from 'vue-table-with-tree-grid'

// 处理axios的三个问题
import axios from 'axios'
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 响应拦截器里 token失效问题
// axios.interceptors.response.use(
//   function (response) {
//     // 方式1 与后台约定100010为过期:
//     if (response.data.meta.status === 100010) {
//       // 1.跳转 过登录页
//       this.$router.push('/login')
//     }

//     // 方式2 更新token:
//     if (response.data.data.token) {
//       localStorage.setItem('token', token)
//     }

//     return response
//   },
//   function (error) {
//     // Do something with response error
//     return Promise.reject(error)
//   }
// )

// 问题1 每次都要添加基准路径的解决
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 问题2 每个组件页面都要引入axios的解决
Vue.prototype.$axios = axios // 以后组组件内 this.$axios
// 问题3 : 请求拦截器 解决每次请求都要携带token
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = localStorage.getItem('token')

    return config
  },
  function (error) {
    // Do something with request error 返回错误信息
    return Promise.reject(error)
  }
)
Vue.use(VueQuillEditor /* { default global options } */ )

// 安装element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

// 注册vue-table-with-tree-grid组件为全局可用的组件
Vue.component('tree-table', TreeTable)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  components: {
    App
  },
  template: '<App/>'
})
