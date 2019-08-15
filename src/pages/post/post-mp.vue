<template>
    <view class="content">

        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @rightClick="rightClick()"
                @leftClick="toBack()">
        </navBar>

        <text>{{postObj.title}}</text>

        <view class="editor">
            <!--小程序编辑器-->
            <editor
                    id="editor"
                    class="ql-container"
                    :read-only="readOnly"
                    @ready="onEditorReady()">
            </editor>
        </view>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import { getPostDetail } from '@/apis/posts'

    export default {
        data() {
            return {
                logo: '',
                leftIcon: 'iconback',
                rightWords: '',
                title: '文章详情',
                idObj: {},
                postObj: {},

                // 编辑器相关
                readOnly: false,
            }
        },
        components: {
            navBar,
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad(idObj) {

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

            this.idObj = idObj
        },
        onReady() {
            // 获取文章详情
            this.$loading()
            getPostDetail(this.idObj.id).then(res => {
                this.$loading(false)
                this.postObj = res.data
                this.initEditor(JSON.parse(this.postObj.content).ops)
            }).catch(err => {
                this.$loading(false)
            })
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

            // 初始化内容
            initEditor(content) {
                this.editorCtx.setContents({
                    'delta': content
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


<style scoped>
    .editor {
        height: 85%;
        width: 100%;
    }
</style>
