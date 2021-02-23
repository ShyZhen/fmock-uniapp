import request from '../utils/request';
import * as qiniu from 'qiniu-js'

// 获取上传文件的token（七牛）
function getUploadToken(type) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/file/token/' + type).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 上传文件成功后，调用入库
function saveVideo(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/video/item', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 轮询转码结果
function transcode(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/video/item/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 生成带前缀的uuid
function getUniqueName(prefix) {
    let pre = prefix ? prefix +'-' : ''
    return pre + (S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4()+S4());
}
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}


export {
    getUploadToken, getUniqueName, saveVideo, transcode
}
