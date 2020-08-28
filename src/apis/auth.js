import request from '../utils/request';

// 小程序登录API
function wxmpLogin(code, userInfo) {
    let params = {'code':code, 'user':userInfo}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/oauth/wechat/login', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 账号密码登录API
function accountLogin(account, password) {
    let params = {"account":account, "password":password}
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/login', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 登出API
function logout() {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/logout').then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
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
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 注册
function accountRegister(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/register', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
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
	        resolve(res.data)
	    }).catch(e => {
	        reject(e)
	    })
	})
}

function githubLogin() {
	return new Promise((resolve, reject) => {
	    request.request('GET', 'V1/oauth/github/login').then(res => {
	        resolve(res.data)
	    }).catch(e => {
	        reject(e)
	    })
	})
}

// 发送忘记密码 改密验证码
function getasswordCode(data) {
    let params = {
            "account": data.account,
        }

    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/password-code', params).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 改密
function updatePassword(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/password', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取当前登录用户的个人信息
function getMyInfo() {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/me').then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 更新个人信息（除了昵称）
function updateMyInfo(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/me', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 更新昵称
function updateMyName(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/my-name', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 上传头像
function updateAvatar(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/file/avatar', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取某个用户信息
function getUserDetail(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/user/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    wxmpLogin, accountLogin, logout, registerCode, accountRegister, getAccountStatus, githubLogin, getasswordCode, updatePassword,
    getMyInfo, updateMyInfo, updateMyName, updateAvatar, getUserDetail
}