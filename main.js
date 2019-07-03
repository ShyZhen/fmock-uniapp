import Vue from 'vue'
import App from './App'
import request from './utils/request.js'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = request

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
