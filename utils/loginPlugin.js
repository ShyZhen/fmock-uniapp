/**
 * 各个环境下的登录处理，存储token，状态等
 */
import * as AuthApi from "../apis/auth.js"
import {setToken, setBinding, removeLoginStorage} from '../utils/auth.js'
import store from '../store/index.js';

// 账号密码登录插件
function accountLogin(account, password) {
    return new Promise((resolve, reject) => {
        AuthApi.accountLogin(account, password).then(res => {
            if (res.access_token) {
                // 保存token 绑定状态到storage；保存vuex状态
                setToken(res.access_token)
                setBinding(res.binding_status)
                store.commit('login')
                store.commit('binding')
            }
            resolve(res)
            
        }).catch(err => {
            reject(err)
        })
    })
}

// 小程序登录插件
function wxmpLogin() {
    return new Promise((resolve, reject) => {
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
                    
                    resolve(res)
                }).catch (err => {
                    reject(err)
                })
            },
            fail: (e) => {
                console.error('do login error:', e);
            }
        })
    })
}

// 登出插件
function logout() {
    return new Promise((resolve, reject) => {
        AuthApi.logout().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        }).finally(() => {
            // 清除localstorage和vuex
            removeLoginStorage()
            store.commit('logout')
        })
    })
}

export {accountLogin, wxmpLogin, logout}