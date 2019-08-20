import Config from "../config/config.js"

/**
 * 绑定状态
 */
const BINDING = Config.bindingKey

/**
 * token存储键名
 */
const TOKENKEY = Config.tokenKey

/**
 * 前端存储过期时间 （单位天）
 */
const TOKENEXPIRE = Config.tokenExpire

/**
 * 获取token
 */
function getToken() {
    try {
        let res = uni.getStorageSync(TOKENKEY)
        if (res) {
            res = JSON.parse(res)
            if (res.end > new Date().getTime()) {
                return res.key
            }
        }
    } catch (e) {}

    return false;
}

/**
 * 存储token
 * @param {string} token
 */
function setToken(token) {
    try {
        uni.setStorageSync(TOKENKEY, JSON.stringify({key: token, end: new Date().getTime() + 3600000 * 24 * TOKENEXPIRE}))
        return true
    } catch (e) {
        // console.log(e);
        return false
    }
}

/**
 * 获取绑定状态
 */
function getBinding() {
    try {
        let res = uni.getStorageSync(BINDING)
        if (res) {
            res = JSON.parse(res)
            if (res.end > new Date().getTime()) {
                return res.key
            }
        }
    } catch (e) {}

    return false
}

/**
 * 激活状态（设置绑定状态）
 * @param {boolean} bool
 */
function setBinding(bool) {
    try {
        uni.setStorageSync(BINDING, JSON.stringify({key: bool, end: new Date().getTime() + 3600000 * 24 * TOKENEXPIRE}))
        return true
    } catch (e) {
        // console.log(e);
        return false
    }
}

/**
 * 登出 移除本地缓存数据
 */
function removeLoginStorage() {
    try {
        uni.removeStorageSync(TOKENKEY)
        uni.removeStorageSync(BINDING)
        return true
    } catch (e) {
        // error
        return false
    }
}

export { getToken, setToken, getBinding, setBinding, removeLoginStorage }