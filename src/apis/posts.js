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

// 创建文章
function createPost(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/post', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 上传图片(二进制)
function uploadImage(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/file/image', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 上传图片(uniapp通用方式)
function uniUploadImage(filePath) {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: request.buildFullUrl('/V1/file/image'),
            filePath: filePath,
            name: 'image',
            header: request.buildHeader({}),
            success: (uploadRes) => {
                resolve(uploadRes)
            },
            fail: (failRes) => {
                reject(failRes)
            }
        });
    })

}

// 删除自己的文章
function deletePost(uuid) {
    return new Promise((resolve, reject) => {
        request.request('DELETE', 'V1/post/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 某用户发布的所有文章(包括自己)
function getUserPosts(userUuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/user/posts/' + userUuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 更新自己的某篇文章
function updatePost(uuid, data) {
    return new Promise((resolve, reject) => {
        request.request('PUT', 'V1/post/' + uuid, data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    getPostsList, getPostDetail, createPost, uploadImage, deletePost, getUserPosts, updatePost, uniUploadImage
}