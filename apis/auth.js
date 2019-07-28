import request from '../utils/request';
// import Config from "../config/config.js"

function wxmpLogin(code) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'oauth/wechat/login', {"code":code}).then(res => {
            resolve(res.data);
        }).catch(e => {
            // request.js中无输出，统一处理
            // console.log('api.auth.js.err', e)
            // reject(e);
        })
    })
}

export {wxmpLogin}