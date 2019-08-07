import Vue from 'vue'
import App from './App'
import request from './utils/request.js'
import store from './store'
import { toast, loading } from './utils/global.js'

// 字体图标库
import './static/font/iconfont.css'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = request
Vue.prototype.$loading = loading;
Vue.prototype.$toast = toast;

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
