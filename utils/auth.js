import Config from "../config/config.js"

/**
 * token存储键名
 */
const TOKENKEY = Config.tokenKey

/**
 * 前端存储过期时间 （单位天）
 */
const TOKENEXPIRE = Config.tokenExpire;

/**
 * 获取token
 */
function getToken() {
    try {
        let res = uni.getStorageSync(TOKENKEY);
        if (res) {
            res = JSON.parse(res);
            if (res.end > new Date().getTime()) {
                return res.key;
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
        console.log('set token: ' + token);
        uni.setStorageSync(TOKENKEY, JSON.stringify({key: token, end: new Date().getTime() + 3600000 * TOKENEXPIRE}))
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export {getToken, setToken}