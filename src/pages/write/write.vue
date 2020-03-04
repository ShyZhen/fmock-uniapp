<template>
    <view class="content">
        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @leftClick="toHome()">
        </navBar>

        <view class="editor-warpper">
            <view :style="{paddingTop: statusH + 44 + 'px'}">
                <m-input class="m-input" type="text" clearable focus v-model="postTitle"  placeholder="输入文章标题"></m-input>
            </view>

            <!-- #ifdef H5 -->
            <!-- quill编辑器 -->
            <view id="editor-content"></view>
            <!-- #endif -->

            <!-- #ifdef MP-WEIXIN -->
            <!--小程序编辑器-->
            <editor
                    id="editor"
                    class="ql-container"
                    :placeholder="placeholder"
                    @statuschange="onStatusChange"
                    :read-only="false"
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
            <!-- #endif -->
        </view>

        匿名<switch @change="setAnonymous"/>
        <button type="primary" class="primary e-font30" @tap="submitPost">发布</button>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import mInput from '@/components/m-input.vue'
import { uniUploadImage, createPost } from '@/apis/posts'

// #ifdef H5
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'
// #endif

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

                // 富文本编辑器
                editor: {},
                placeholder: '请输入内容...',
                formats: {},
            }
        },
        components: {
            navBar,
            mInput,
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin', 'statusH']),
        },
        onLoad: function () {

            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态
            if (!this.hasLogin) {
                this.$toLogin()
            }
        },
        onReady: function () {
            // #ifdef H5
            this.initQuill()
            // #endif
        },
        methods: {
            ...mapActions(['initLoginState']),

            // #ifdef H5
            initQuill() {
                let editorOption = {
                    modules: {
                        toolbar: {
                            container:[
                                [
                                    { 'header':  1}, { 'header':  3}, 'bold', 'italic',
                                    'underline', 'strike', { 'align': [] }, { 'list': 'ordered'},
                                    { 'list': 'bullet' }, 'blockquote', 'code-block',  'clean', 'image'
                                ],
                            ],
                            handlers: {'image': this.imageHandler}
                        }
                    },
                    placeholder: this.placeholder,
                    readOnly: false,
                    theme: 'bubble'    // bubble
                }

                // 自定义icon
                const icons = Quill.import("ui/icons");
                icons.header[3] = `<svg viewBox="0 0 18 18"><path class="ql-fill" d="M16.65186,12.30664a2.6742,2.6742,0,0,1-2.915,2.68457,3.96592,3.96592,0,0,1-2.25537-.6709.56007.56007,0,0,1-.13232-.83594L11.64648,13c.209-.34082.48389-.36328.82471-.1543a2.32654,2.32654,0,0,0,1.12256.33008c.71484,0,1.12207-.35156,1.12207-.78125,0-.61523-.61621-.86816-1.46338-.86816H13.2085a.65159.65159,0,0,1-.68213-.41895l-.05518-.10937a.67114.67114,0,0,1,.14307-.78125l.71533-.86914a8.55289,8.55289,0,0,1,.68213-.7373V8.58887a3.93913,3.93913,0,0,1-.748.05469H11.9873a.54085.54085,0,0,1-.605-.60547V7.59863a.54085.54085,0,0,1,.605-.60547h3.75146a.53773.53773,0,0,1,.60547.59375v.17676a1.03723,1.03723,0,0,1-.27539.748L14.74854,10.0293A2.31132,2.31132,0,0,1,16.65186,12.30664ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"/></svg>`;

                const quill =  new Quill('#editor-content', editorOption)
                this.editor = quill
            },
            // 图片资源回显
            insertImage(url) {
                let range = this.editor.getSelection();
                this.editor.insertEmbed(range.index, 'image', url)
            },
            // 发布文章
            submitPost() {
                this.$loading()
                if (this.postTitle.trim() && this.editor.getLength() > 1) {
                    let data = {
                        title: this.postTitle.trim(),
                        // 存储html格式
                        // content: this.editor.root.innerHTML,
                        content: JSON.stringify(this.editor.getContents()),
                        summary: this.editor.getText(0, 80).replace(/\n/g, ' '),
                        poster: this.imgUrlFun(this.editor.root.innerHTML),
                        anonymous: this.anonymous,
                        type: this.type
                    }
                    createPost(data).then(res => {
                        this.$loading(false)
                        this.navToDetails(res.data)
                    }).catch(err => {
                        this.$loading(false)
                    })
                } else {
                    this.$toast('啊嘞！是不是少写了什么')
                }
            },
            // #endif


            // #ifdef MP-WEIXIN
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
            // #endif


            // 处理上传图片 并回显
            imageHandler: function () {
                let that = this
                uni.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'],    // 可以指定是原图还是压缩图，默认二者都有'original',
                    sourceType: ['album', 'camera'],    // 从相册选择
                    success: function (res) {
                        if (res.tempFilePaths.length) {

                            // 获取图片信息
                            // uni.getImageInfo({
                            //     src: res.tempFilePaths[0],
                            //     success: function (image) {
                            //         // 压缩图片
                            //         console.log(image.width);
                            //         console.log(image.height);
                            //     }
                            // });

                            // 预览图片
                            // uni.previewImage({
                            //     current: res.tempFilePaths[0],
                            //     urls: res.tempFilePaths,
                            //     longPressActions: {
                            //         itemList: ['发送给朋友', '保存图片', '收藏'],
                            //         success: function (res) {
                            //             console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
                            //         },
                            //         fail: function (res) {
                            //             console.log(res.errMsg);
                            //         }
                            //     }
                            // });

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
            // 正则匹配第一幅图片,作为海报传递给后台
            imgUrlFun(str) {
                let data = '';
                str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
                    data =  capture;
                });
                return data
            },
            setAnonymous(e) {
                this.anonymous = e.target.value
            },
            // 文章详情
            navToDetails(uuid){
                // 此页面不许返回直接关闭栈
                uni.redirectTo({
                    url: `/pages/post/post?id=${uuid}`
                })
            },

            toHome() {
                this.$toHome()
            },
        }
    }
</script>

<style scoped>
    .editor-warpper {
        height: 85%;
        width: 100%;
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
