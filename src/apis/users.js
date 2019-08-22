import request from '../utils/request';

// 获取我的个人信息
function getMyInfo() {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/me').then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取其他用户信息
function getUserInfo(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/user/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}



export {
    getMyInfo, getUserInfo
}