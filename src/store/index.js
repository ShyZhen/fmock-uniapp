import Vue from 'vue'
import Vuex from 'vuex'
import { getToken, getBinding } from '../utils/auth'


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasBinding: false,
        hasLogin: false,
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
        
        // 该方法移植到actions中
        // setLoginState(state) {
        //     if (state.hasLogin == false) {
        //         this.commit('login', getToken() ? true : false)
        //     }
        //     if (state.hasBinding == false) {
        //         this.commit('binding', getBinding() ? true : false)
        //     }
        // }
    },
    actions: {
        initLoginState(context) {
            if (context.state.hasLogin == false) {
                context.commit('login', getToken() ? true : false)
            }
            if (context.state.hasBinding == false) {
                context.commit('binding', getBinding() ? true : false)
            }
        }
    }

})

export default store
