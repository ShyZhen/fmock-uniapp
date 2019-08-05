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
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/register', data).then(res => {
            resolve(res.data);
        }).catch(e => {
            reject(e);
        })
    })
}

// 获取用户状态 是否存在 是否已冻结
function getAccountStatus(data) {
	let params = {
		"account": data.account,
	}
	
	return new Promise((resolve, reject) => {
	    request.request('POST', 'V1/user-check', params).then(res => {
	        resolve(res.data);
	    }).catch(e => {
	        reject(e);
	    })
	})
}

function githubLogin() {
	return new Promise((resolve, reject) => {
	    request.request('GET', 'V1/oauth/github/login').then(res => {
	        resolve(res.data);
	    }).catch(e => {
	        reject(e);
	    })
	})
}


export {
    wxmpLogin, accountLogin, logout, registerCode, accountRegister, getAccountStatus, githubLogin
}