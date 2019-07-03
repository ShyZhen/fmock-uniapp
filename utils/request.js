import Config from "../config/config.js"
import * as Auth from "./auth.js"

class Request 
{
    /**
     * 构建全路径
     * @param {string} uri
     */
    buildFullUrl(uri) {
        let baseUrl = Config.apiBaseUrl;
        (baseUrl.substring(baseUrl.length-1) !== '/') && (baseUrl += '/');
        (uri.substring(0, 1) === '/') && (uri = uri.substring(1));
        return baseUrl + uri
    }
    
    /**
     * 构建带authorization的header头
     * @param {Object} headers
     */
    buildHeader(headers) {
        let auth = {'Authorization': 'Bearer ' + Auth.getToken()};
        return Object.assign({}, headers || {}, auth);
    }
    
    /**
     * 发送请求 分装成promise
     * @param {string} method
     * @param {string} uri
     * @param {Object} data
     * @param {Object} headers
     */
    request(method, uri, data, headers) {
        return new Promise((resolve, reject) => {
            uni.request({
                url: this.buildFullUrl(uri),
                method: method,
                data: data,
                header: this.buildHeader(headers)
            }).then(result => {
                let [error, res]  = result;
                
                if (error !== null) {
                    uni.showToast({
                        title: '糟糕！好像出了什么问题',
                        icon: 'none',
                        duration: 2000,
                    })
                    // 调试输出
                    reject(error)
                    
                } else {
                    // 认证失败状态，不需要返回，直接跳转登录
                    if (res.statusCode === 401) {
                        uni.showToast({
                            title: '需要登录才能访问',
                            icon: 'none',
                            duration: 2000,
                        });
        
                        setTimeout(() => {
                            uni.redirectTo({
                                url: '/pages/login/login',
                            });
                        }, 2000);
                        // 调试输出
                        reject(res)
                        
                    } else if (res.statusCode >= 200 && res.statusCode <= 299) {
                        // 成功状态
                        resolve(res)
                    } else {
                        // 其他错误状态
                        let errMsg = res.data.message || res.errMsg || '糟糕！好像出了什么问题';
                        uni.showToast({
                            title: errMsg,
                            icon: 'none',
                            duration: 3000,
                        });
                        // 调试输出
                        reject(res)
                    }
                }
            })
            .catch(error => {
                reject(error)
            })
        })
    }
}

export default new Request()