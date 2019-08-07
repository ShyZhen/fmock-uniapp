import request from '../utils/request';

// 获取文章列表
function getPostsList(type, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/posts?type='+type+'&page='+page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取文章详情
function getPostDetail(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/post/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    getPostsList, getPostDetail
}