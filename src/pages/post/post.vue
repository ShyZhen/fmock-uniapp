<template>
    <view class="content">

        <navBar :logo="logo" :leftIcon="leftIcon"
                :title="title"
                @leftClick="toBack()">
        </navBar>

        <view :style="{paddingTop: statusH + 44 + 'px'}">
            <!-- 作者 -->
            <view class="e-flex_left user-info e-b-bottom">
                <image :src="postObj.user_info.avatar"></image>
                <view class="e-ml10 e-flex_auto" @tap="toUserDetail(postObj.user_info.uuid)">
                    <view class="e-ml10 e-c6 e-bold e-omit1 e-lp1">{{postObj.user_info.username}}</view>
                    <view class="e-flex_auto e-ml10 e-omit1 e-pr20 e-c9">{{postObj.user_info.bio}}</view>
                </view>
                <button class="blue-btn" @click="follow">{{followText}}</button>
            </view>
            <view class="e-pd20 e-mb100">
                <!-- 标题 -->
                <view class="e-font44 e-mt30 e-bold e-mb30 post-title">{{postObj.title}}</view>

                <!-- 点赞 -->
                 <view class="e-c9 e-mb30">{{postObj.like_num}}人为这篇文章点赞</view>

                <!-- 正文 -->
                <view>
                    <view class="editor">

                        <!-- #ifdef MP-WEIXIN -->
                        <!--小程序编辑器-->
                        <editor
                                id="editor-content"
                                class="ql-container"
                                :read-only=true
                                @ready="onEditorReady()">
                        </editor>
                        <!-- #endif -->

                        <!-- #ifdef H5 -->
                        <!-- quill编辑器 -->
                        <view class="ql-container ql-bubble">
                            <view id="editor-content"></view>
                        </view>
                        <!-- #endif -->
                    </view>
                </view>
            </view>

            <!-- 底部操作栏 -->
            <view class="e-fixed_bottom e-bottom-btnGroup e-flex_center e-b-top">
                <view class="e-flex_left">
                    <view v-if="bottom.status.liked">
                        <image src="/static/img/liked2.png" @tap="userAction('like')"></image>
                    </view>
                    <view v-else>
                        <image src="/static/img/like2.png" @tap="userAction('like')"></image>
                    </view>
                    <text>{{bottom.num.likeNum}}</text>
                </view>
                <view class="e-flex_left">
                    <view v-if="bottom.status.disliked">
                        <image src="/static/img/disliked2.png" @tap="userAction('dislike')"></image>
                    </view>
                    <view v-else>
                        <image src="/static/img/dislike2.png" @tap="userAction('dislike')"></image>
                    </view>
                    <text>{{bottom.num.dislikeNum}}</text>
                </view>
                <view class="e-flex_left">
                    <view v-if="bottom.status.collected">
                        <image src="/static/img/hearted.png" @tap="userAction('collect')"></image>
                    </view>
                    <view v-else>
                        <image src="/static/img/heart.png" @tap="userAction('collect')"></image>
                    </view>
                    <text>{{bottom.num.collectedNum}}</text>
                </view>
                <view class="e-flex_left">
                    <view>
                        <image src="/static/img/u-comment.png" @tap=getAllComment()></image>
                    </view>
                    <text>{{bottom.num.commentNum}}</text>
                </view>

                <view>举报</view>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import { getPostDetail } from '@/apis/posts'
import { getInitStatus, like, dislike, collect, unCollect } from '@/apis/action';
import { getAllComment } from '@/apis/comment';
import { followUser, followStatus } from '@/apis/users';

// #ifdef H5
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'
// #endif

    export default {
        data() {
            return {
                logo: '',
                leftIcon: 'iconjiantou',
                title: '',
                actionType: 'post',
                idObj: {},
                postObj: {
                    user_info: {}
                },
                editor: {},
                bottom:{
                    num: {
                        likeNum: 0,
                        dislikeNum: 0,
                        collectedNum: 0,
                        commentNum: 0
                    },
                    status: {
                        liked: false,
                        disliked: false,
                        collected: false,
                        inMyFollows: false,
                        inMyFans: false,
                    }
                },
                actionFinish: false,
                followText: '关注',
            }
        },
        components: {
            navBar,
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin', 'statusH']),
        },
        onLoad(idObj) {

            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态
            if (!this.hasLogin) {
                this.$toLogin()
            }

            this.idObj = idObj
        },
        onReady() {
            // 获取文章详情
            this.$loading()
            getPostDetail(this.idObj.id).then(res => {
                this.$loading(false)
                this.postObj = res.data
                this.title = res.data.title
                this.bottom.num.likeNum = res.data.like_num
                this.bottom.num.dislikeNum = res.data.dislike_num
                this.bottom.num.collectedNum = res.data.collect_num
                this.bottom.num.commentNum = res.data.comment_num
                if (this.title.length > 15) {
                    this.title = this.title.substring(0, 15) + '...'
                }

                // #ifdef H5
                this.initQuill(JSON.parse(this.postObj.content).ops)
                // #endif
                // #ifdef MP-WEIXIN
                this.initEditor(JSON.parse(this.postObj.content).ops)
                // #endif

                // 当前用户与我的互粉关系(匿名用户除外)
                if (res.data.user_info.uuid !== 'user-anonymous') {
                    followStatus(res.data.user_info.uuid).then(followRes => {
                        this.bottom.status.inMyFollows = followRes.data.inMyFollows
                        this.bottom.status.inMyFans = followRes.data.inMyFans
                        this.updateFollowText(this.bottom.status.inMyFans, this.bottom.status.inMyFollows)
                    })
                }
            }).catch(err => {
                this.$loading(false)
            })

            // 获取底栏文字赞踩收藏状态
            getInitStatus(this.idObj.id, this.actionType).then(res => {
                this.bottom.status.liked = res.data.liked
                this.bottom.status.disliked =res.data.disliked
                this.bottom.status.collected = res.data.collected
            })
        },
        methods: {
            ...mapActions(['initLoginState']),

            // 初始化quill内容
            initQuill(content) {
                let editorOption = {
                    readOnly: true
                }
                const quill =  new Quill('#editor-content', editorOption)
                this.editor = quill
                this.editor.setContents(content)
            },

            // 初始化小程序内容
            initEditor(content) {
                this.editorCtx.setContents({
                    'delta': content
                })
            },

            // 编辑器初始化方法
            onEditorReady() {
                const that = this
                uni.createSelectorQuery().select('#editor-content').context((res) => {
                    that.editorCtx = res.context
                }).exec()
            },

            // 底部操作栏
            userAction(action) {
                this.postAction(action).then(() => {
                    this.actionFinish && this.postStatus(action)
                })
            },

            // 同步接口请求
            async postAction(action) {
                this.$loading()
                switch (action) {
                    case 'like':
                        await like(this.idObj.id, this.actionType).then(res => {
                            this.actionFinish = true;
                            this.$loading(false)
                        }).catch(err => {
                            console.log('err', err)
                        })
                        break;
                    case 'dislike':
                        await dislike(this.idObj.id, this.actionType).then(res => {
                            this.actionFinish = true;
                            this.$loading(false)
                        }).catch(err => {
                            console.log('err', err)
                        })
                        break;
                    case 'collect':
                        let data = {
                            resource_uuid: this.idObj.id,
                            type: this.actionType
                        }
                        if (this.bottom.status.collected) {
                            // 取消收藏
                            await unCollect(data.resource_uuid, data.type).then(res => {
                                this.actionFinish = true;
                                this.$loading(false)
                            }).catch(err => {
                                console.log('err', err)
                            })
                        } else {
                            // 收藏
                            await collect(data).then(res => {
                                this.actionFinish = true;
                                this.$loading(false)
                            }).catch(err => {
                                console.log('err', err)
                            })
                        }
                        break;
                    default:
                        this.$loading(false)
                        break;
                }
            },

            // 异步更新状态及数值
            postStatus(action) {
                switch (action) {
                    case 'like':
                        if (this.bottom.status.liked) {
                            this.bottom.status.liked = false
                            this.bottom.num.likeNum -= 1
                        } else {
                            this.bottom.status.liked = true
                            this.bottom.num.likeNum += 1
                        }
                        break
                    case 'dislike':
                        if (this.bottom.status.disliked) {
                            this.bottom.status.disliked = false
                            this.bottom.num.dislikeNum -= 1
                        } else {
                            this.bottom.status.disliked = true
                            this.bottom.num.dislikeNum += 1
                        }
                        break
                    case 'collect':
                        if (this.bottom.status.collected) {
                            this.bottom.status.collected = false
                            this.bottom.num.collectedNum -= 1
                        } else {
                            this.bottom.status.collected = true
                            this.bottom.num.collectedNum += 1
                        }
                        break
                    default:
                        break
                }
            },

            // todo 获取评论列表,下拉刷新（时间排序）
            getAllComment() {
                let page = 1
                this.$loading()
                getAllComment(this.idObj.id, this.actionType, 'new', page).then(res => {
                    console.log(res)
                    this.$loading(false)
                }).catch(err => {
                    this.$loading(false)
                })
            },
            // 获取热门评论列表（展示在最上面,不需要下拉刷新）
            getHotComment() {
                this.$loading()
                getAllComment(this.idObj.id, this.actionType, 'hot', 1).then(res => {
                    console.log(res)
                    this.$loading(false)
                }).catch(err => {
                    this.$loading(false)
                })
            },

            // 关注、取消关注 某人
            follow() {
                if (this.postObj.user_info.uuid !== 'user-anonymous') {
                    this.$loading()
                    followUser(this.postObj.user_info.uuid).then(res => {
                        if (this.bottom.status.inMyFollows) {
                            this.bottom.status.inMyFollows = false
                        } else {
                            this.bottom.status.inMyFollows = true
                        }
                        this.updateFollowText(this.bottom.status.inMyFans, this.bottom.status.inMyFollows)
                        this.$toast(res.message)
                        this.$loading(false)
                    }).catch(err => {
                        this.$loading(false)
                    })
                } else {
                    this.$toast('匿名用户无法被关注')
                }
            },

            // 更改按钮文本
            updateFollowText(inMyFans, inMyFollows) {
                if (inMyFollows) {
                    if (inMyFans) {
                        this.followText = '互相关注'
                    } else {
                        this.followText = '已关注'
                    }
                } else {
                    this.followText = '关注'
                }
            },

            // 用户信息也
            toUserDetail(uuid) {
                if (uuid !== 'user-anonymous') {
                    uni.navigateTo({
                        url: `/pages/user/person?id=${uuid}`
                    })
                } else {
                    this.$toast('该作者已匿名')
                }
            },
            toBack() {
                const pages = getCurrentPages()
                this.$toBack(pages.length)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .content {
        background-color: $e-f;
        padding: 0;
    }
    .editor {
        height: 85%;
        width: 100%;
    }
    .user-info {
        font-size: 28rpx;
        padding: 20rpx;
        image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 40rpx;
        }
    }
    .img-empty{
        width: 175rpx;
        height: 140rpx;
        border-radius: 3px;
        margin-left: 20rpx;
        overflow: hidden;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .blue-btn {
        width: 196rpx;
        height: 60rpx;
        line-height: 60rpx;
        background-color: dodgerblue;
        color: $e-f;
        font-size: 26rpx;
    }
    .e-bottom-btnGroup {
        padding: 12rpx 60rpx;
        image {
            height: 30rpx;
            width: 30rpx;
        }
    }
    .post-title {
        word-break: break-all;
    }
</style>
