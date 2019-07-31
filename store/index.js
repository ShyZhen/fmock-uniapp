import Vue from 'vue'
import Vuex from 'vuex'
import {getToken, getBinding} from '../utils/auth'


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasBinding: false,
        hasLogin: false,
    },
    mutations: {
        login(state) {
            state.hasLogin = true;
        },
        logout(state) {
            state.hasLogin = false;
        },
        binding(state) {
            state.hasBinding = true;
        },
        setLoginState(state) {
            if (state.hasLogin == false) {
                state.hasLogin = getToken() ? true : false;
            }
            if (state.hasBinding == false) {
                state.hasBinding = getBinding() ? true : false;
            }
        }
    },
})

export default store