<template>
    <view class="content">
        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @leftClick="toBack()">
        </navBar>


        <view class="editor-warpper">
            <view style="height: 100rpx">
                <m-input class="m-input" type="text" clearable focus v-model="postTitle"  placeholder="输入文章标题"></m-input>
            </view>

            <!--小程序编辑器-->
            <editor
                id="editor"
                class="ql-container"
                :placeholder="placeholder"
                @statuschange="onStatusChange"
                :read-only="readOnly"
                @ready="onEditorReady()">
            </editor>

            <!--编辑器工具栏-->
            <view class='toolbar' @tap="format">
                <i class="iconfont iconformatheader1" :class="{'ql-active' : formats.header === 1}" data-name="header" data-value="1"></i>
                <i class="iconfont iconformatheader3" :class="{'ql-active' : formats.header === 3}" data-name="header" data-value="3"></i>
                <i class="iconfont iconeditor-bold" :class="{'ql-active' : formats.bold}" data-name="bold"></i>
                <i class="iconfont iconeditor-italic" :class="{'ql-active' : formats.italic}" data-name="italic"></i>
                <i class="iconfont iconeditor-underline" :class="{'ql-active' : formats.underline}" data-name="underline"></i>
                <i class="iconfont iconeditor-strikethrough" :class="{'ql-active' : formats.strike}" data-name="strike"></i>
                <i class="iconfont iconeditor-align-left" :class="{'ql-active' : formats.align === 'left'}" data-name="align" data-value="left"></i>
                <i class="iconfont iconeditor-align-center" :class="{'ql-active' : formats.align === 'center'}" data-name="align" data-value="center"></i>
                <i class="iconfont iconeditor-align-right" :class="{'ql-active' : formats.align === 'right'}" data-name="align" data-value="right"></i>
                <i class="iconfont iconeditor-align-justify" :class="{'ql-active' : formats.align === 'justify'}" data-name="align" data-value="justify"></i>
                <i class="iconfont iconeditor-list-numbers" :class="{'ql-active' : formats.list === 'ordered'}" data-name="list" data-value="ordered"></i>
                <i class="iconfont iconeditor-list-bulleted" :class="{'ql-active' : formats.list === 'bullet'}" data-name="list" data-value="bullet"></i>
                <i class="iconfont iconclearformat" @tap="removeFormat"></i>
                <i class="iconfont iconimage" @tap="imageHandler"></i>
                <i class="iconfont iconeditor-undo" @tap="undo"></i>
                <i class="iconfont iconeditor-redo" @tap="redo"></i>
            </view>
        </view>

        <button type="primary" class="primary e-font30" @tap="submitPost">发布</button>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import mInput from '@/components/m-input.vue'
import { uniUploadImage, createPost } from '@/apis/posts'

    export default {
        data() {
            return {
                logo: '',
                leftIcon: 'iconioscloseempty',
                rightWords: '',
                title: '发布主题内容',
                postTitle: '',
                anonymous: false,
                type: 'share',

                // 小程序编辑器
                placeholder: '输入内容...',
                readOnly: false,
                formats: {},
            }
        },
        components: {
            navBar,
            mInput,
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad: function () {
            // 只有小程序才能打开该编辑器
            // #ifndef MP-WEIXIN
            this.toHome()
            // #endif

            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态
            if (!this.hasLogin) {
                this.toHome()
            }
        },
        methods: {
            ...mapActions(['initLoginState']),

            // 编辑器初始化方法
            onEditorReady() {
                const that = this
                uni.createSelectorQuery().select('#editor').context((res) => {
                    that.editorCtx = res.context
                }).exec()
            },
            undo() {
                this.editorCtx.undo()
            },
            redo() {
                this.editorCtx.redo()
            },
            // 高亮
            onStatusChange(e) {
                const formats = e.detail
                this.formats = formats
            },
            // 清空编辑器内容
            clear() {
                this.editorCtx.clear({})
            },
            // 清除格式
            removeFormat() {
                this.editorCtx.removeFormat()
            },
            // 插入图片
            imageHandler() {
                const that = this
                uni.chooseImage({
                    count: 1,
                    sizeType: ['compressed'],    // 可以指定是原图还是压缩图，默认二者都有'original',
                    sourceType: ['album', 'camera'],    // 从相册选择
                    success: function (res) {
                        if (res.tempFilePaths.length) {

                            // 上传文件到服务器
                            that.$loading()
                            uniUploadImage(res.tempFilePaths[0]).then(res => {
                                that.$loading(false)
                                that.insertImage(JSON.parse(res.data).data)
                            }).catch(err => {
                                that.$loading(false)
                                that.$toast('上传失败，请重试')
                            })
                        }
                    }
                })
            },
            // 图片资源回显
            insertImage(url) {
                this.editorCtx.insertImage({
                    src: url,
                    alt: '图片失效',
                })
            },
            // 初始化所有编辑器功能
            format(e) {
                let { name, value } = e.target.dataset
                if (!name) return
                this.editorCtx.format(name, value)
            },

            // 发布文章
            submitPost() {
                let that = this
                this.editorCtx.getContents({
                    success: function (res) {
                        let summary = res.text.replace(/\n/g, ' ').slice(0, 80)
                        if (that.postTitle && summary) {
                            let data = {
                                title: that.postTitle.trim(),
                                content: JSON.stringify(res.delta),
                                summary: summary,
                                poster: that.imgUrlFun(res.html),
                                anonymous: that.anonymous,
                                type: that.type
                            }
                            createPost(data).then(res => {
                                that.$loading(false)
                                that.navToDetails(res.data)
                            }).catch(err => {
                                that.$loading(false)
                            })
                        } else {
                            that.$toast('啊嘞！是不是少写了什么')
                        }

                    }
                })
            },

            // 正则匹配第一幅图片,作为海报传递给后台
            imgUrlFun(str) {
                let data = '';
                str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
                    data =  capture;
                });
                return data
            },
            // 文章详情
            navToDetails(uuid){
                uni.navigateTo({
                    url: `/pages/post/post-mp?id=${uuid}`
                })
            },
            toHome() {
                uni.switchTab({
                    url: '../home/home'
                });
            },
            toBack() {
                uni.navigateBack({
                    delta: 1
                });
            },
        }
    }
</script>

<style>
    .editor-warpper {
        padding: 5px;
    }
    #editor {
        width: 100%;
        height: 300px;
        background-color: #fff;
    }

    /*编辑器*/
    .iconfont {
        display: inline-block;
        padding: 8px 8px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 20px;
    }
    .toolbar {
        box-sizing: border-box;
        /* border: 1px solid #ccc; */
        border-bottom: 0;
        font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    }
    .ql-container {
        box-sizing: border-box;
        padding: 12px 15px;
        width: 100%;
        min-height: 30vh;
        height: auto;
        /* border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc; */
        background: #fff;
        margin-top: 20px;
        font-size: 16px;
        line-height: 1.5;
    }
    .ql-active {
        color: #06c;
    }

</style>
