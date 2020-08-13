import request from '../utils/request';

// 点赞文章、回答、视频、评论（评论传id，而非uuid）| type = post/answer/video/comment
function like(uuid, type) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/like/' + type + '/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 踩文章
function dislike(uuid, type) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/dislike/' + type + '/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

//获取 点赞 踩 收藏相关信息
function getInitStatus(uuid, type) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/status/' + type + '/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

/*
// 点赞评论
function likeComment(id) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/like/comment/' + id).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 踩评论
function dislikeComment(id) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/dislike/comment/' + id).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

//获取 点赞 踩 收藏相关信息
function getCommentInitStatus(id) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/status/comment/' + id).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 点赞回答
function likeAnswer(uuid) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/like/answer/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 踩回答
function dislikeAnswer(uuid) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/dislike/answer/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

//获取 点赞 踩 收藏相关信息
function getAnswerInitStatus(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/status/answer/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 点赞视频
function likeVideo(uuid) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/like/video/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 踩视频
function dislikeVideo(uuid) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/dislike/video/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

//获取 点赞 踩 收藏相关信息
function getVideoInitStatus(uuid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/status/video/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}
 */

// 收藏文章、回答、视频
function collect(data) {
    return new Promise((resolve, reject) => {
        request.request('POST', 'V1/collection', data).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 取消收藏
function unCollect(uuid, type) {
    return new Promise((resolve, reject) => {
        request.request('DELETE', 'V1/collection/' + type + '/' + uuid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

function getMyFollowPostsList(type, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/track/' + type + '?page=' + page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    like, dislike, getInitStatus,
    collect, unCollect, getMyFollowPostsList
}