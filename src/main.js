import Vue from 'vue'
import App from './App'
// import request from './utils/request.js'    // 所有请求放到 `/apis` 中
import store from './store'
import { toast, loading, toLogin, toBack, toHome } from './utils/global.js'

// 字体图标库
import './static/font/iconfont.css'

Vue.config.productionTip = false

Vue.prototype.$store = store
// Vue.prototype.$http = request        // 所有请求放到 `/apis` 中
Vue.prototype.$loading = loading
Vue.prototype.$toast = toast
Vue.prototype.$toLogin = toLogin
Vue.prototype.$toBack = toBack
Vue.prototype.$toHome = toHome

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
