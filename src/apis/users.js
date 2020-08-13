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

// 关注/取关 某人
function followUser(uuid) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/follow/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function followStatus(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/follow/status/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}
function followList(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/follows/list/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}
function fanList(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/fans/list/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}


export {
    getMyInfo, getUserInfo, followUser, followStatus, followList, fanList
}