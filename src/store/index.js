import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, getBinding } from '../utils/auth'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasBinding: false,
        hasLogin: false,
        statusH: 0
    },
    mutations: {
        login(state, bool = true) {
            state.hasLogin = bool;
        },
        logout(state) {
            state.hasLogin = false;
        },
        binding(state, bool = true) {
            state.hasBinding = bool;
        },
        getStatusH(state, statusH) {
            state.statusH = statusH;
        }
    },
    actions: {
        initLoginState(context) {
            if (context.state.hasLogin == false) {
                context.commit('login', getToken() ? true : false)
            }
            if (context.state.hasBinding == false) {
                context.commit('binding', getBinding() ? true : false)
            }
        },
    }

})

export default store
