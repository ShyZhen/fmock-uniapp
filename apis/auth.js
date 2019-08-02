import request from '../utils/request';

// 小程序登录API
function wxmpLogin(code) {
    let params = {"code":code}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/oauth/wechat/login', params).then(res => {
            resolve(res.data);
        }).catch(e => {
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

// 发送注册验证码
function registerCode(data) {
    let params = {
            "account": data.account,
        }

    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/register-code', params).then(res => {
            resolve(res.data);
        }).catch(e => {
            reject(e);
        })
    })
}

// 注册
function accountRegister(data) {
    let params = {
            "name":data.name,
            "verify_code": data.verifyCode,
            "account": data.account,
            "password": data.password,
            "password_confirmation": data.passwordConfirmation
        }

    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/register', params).then(res => {
            resolve(res.data);
        }).catch(e => {
            reject(e);
        })
    })
}


export {wxmpLogin, accountLogin, logout, registerCode, accountRegister}