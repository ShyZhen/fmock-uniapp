/**
 * 各个环境下的登录处理，存储token，状态等
 */
import * as AuthApi from "../apis/auth.js"
import {setToken, setBinding} from '../utils/auth.js'
import store from '../store/index.js';

function webLogin() {

}

function wxmpLogin() {
    uni.login({
        provider: "weixin",
        success: (res) => {
            AuthApi.wxmpLogin(res.code).then(res => {
                if (res.access_token) {
                    // 保存token 绑定状态到storage；保存vuex状态
                    setToken(res.access_token)
                    setBinding(res.binding_status)
                    store.commit('login')
                    store.commit('binding')
                }
            }).catch (err => {
                // console.log(err)
            })
        },
        fail: (e) => {
            console.error('do login error:', e);
        }
    })
}

export {webLogin, wxmpLogin}