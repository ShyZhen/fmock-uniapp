import Vue from 'vue'
import Vuex from 'vuex'
import Config from '../config/config.js'


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasBinding: uni.getStorageSync(Config.bindingKey) ? true : false,
        hasLogin: uni.getStorageSync(Config.tokenKey) ? true : false,
        userName: ""
    },
    mutations: {
        login(state, userName) {
            state.userName = userName || '新用户';
            state.hasLogin = true;
        },
        logout(state) {
            state.userName = "";
            state.hasLogin = false;
        }
    }
})

export default store
