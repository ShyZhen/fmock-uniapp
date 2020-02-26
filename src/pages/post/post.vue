<template>
    <view class="content">

        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @rightClick="rightClick()"
                @leftClick="toBack()">
        </navBar>

        <view :style="{paddingTop: statusH + 44 + 'px'}">
            <!-- 文章主图 -->
            <image :src="postObj.bg" />
            <!-- 作者 -->
            <view class="e-flex_left user-info e-b-bottom">
                <image :src="postObj.user_info.avatar"></image>
                <view class="e-ml10 e-flex_auto" @tap="toUserDetail(postObj.user_info.uuid)">
                    <view class="e-ml10 e-c6 e-bold e-omit1 e-lp1">{{postObj.user_info.username}}</view>
                    <view class="e-flex_auto e-ml10 e-omit1 e-pr20 e-c9">{{postObj.user_info.bio}}</view>
                </view>
                <button class="blue-btn" @click="concern">关注</button>
            </view>
            <!-- 标题 -->
            <view class="e-font44 e-mt30 e-bold e-mb30">{{postObj.title}}</view>

            <!-- 点赞 -->
            <!-- <view class="e-c9 e-mb30">{{postObj.like_num}}人为这篇文章点赞</view> -->

            <!-- 正文 -->
            <view v-html="postObj.content"></view>

            <!-- 底部操作栏 -->
            <view class="e-fixed_bottom e-bottom-btnGroup e-flex_center e-b-top">
                <view>
                    <text class="iconfont iconsupport"></text>
                    <text>赞</text>
                </view>
                <view>
                    <text class="iconfont iconshoucang"></text>
                    <text>收藏</text>
                </view>
                <view>
                    <text class="iconfont iconpinglun"></text>
                    <text>评论</text>
                </view>
                <view>举报</view>
            </view>
        </view>

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
            <view id="editor-content"></view>
            <!-- #endif -->

        </view>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import { getPostDetail } from '@/apis/posts'

// #ifdef H5
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'
// #endif

    export default {
        data() {
            return {
                logo: '',
                leftIcon: 'iconjiantou',
                rightWords: '',
                title: '文章详情',
                idObj: {},
                postObj: {},
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

                // #ifdef H5
                this.initQuill(JSON.parse(this.postObj.content).ops)
                // #endif
                // #ifdef MP-WEIXIN
                this.initEditor(JSON.parse(this.postObj.content).ops)
                // #endif
            }).catch(err => {
                this.$loading(false)
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
                uni.navigateBack({
                    delta: 1
                });
            },
        }
    }
</script>


<style lang="scss" scoped>
    .content {
        background-color: $e-f;
    }
    .editor {
        height: 85%;
        width: 100%;
    }
    .user-info {
        font-size: 28rpx;
        padding: 20rpx;
        image {
            width: 80upx;
            height: 80upx;
            border-radius: 40upx;
        }
    }
    .img-empty{
        width: 175upx;
        height: 140upx;
        border-radius: 3px;
        margin-left: 20upx;
        overflow: hidden;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .blue-btn {
        width: 120rpx;
        height: 60rpx;
        line-height: 60rpx;
        background-color: dodgerblue;
        color: $e-f;
        font-size: 26rpx;
    }
    .e-bottom-btnGroup {
        padding: 12rpx 60rpx;
        .iconfont {
            font-size: 30upx;
        }
    }
</style>
