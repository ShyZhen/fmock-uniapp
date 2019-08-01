import request from '../utils/request';
// import Config from "../config/config.js"

// 小程序登录API
function wxmpLogin(code) {
    let params = {"code":code}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/oauth/wechat/login', params).then(res => {
            resolve(res.data);
        }).catch(e => {
            // request.js中无输出，统一处理
            reject(e);
        })
    })
}

// 账号密码登录API
function accountLogin(account, password) {
    let params = {"account":account, "password":password}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/login', params).then(res => {
            resolve(res.data);
        }).catch(e => {
            reject(e);
        })
    })
}

// 登出API
function logout() {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/logout').then(res => {
            resolve(res.data);
        }).catch(e => {
            reject(e);
        })
    })
}

// 注册


export {wxmpLogin, accountLogin, logout}