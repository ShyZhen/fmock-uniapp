<template>
    <view class="content">

        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @rightClick="rightClick()"
                @leftClick="toBack()">
        </navBar>

        <text>{{postObj}}</text>

        <view class="editor">
            <!-- quill编辑器 -->
            <view id="editor-content"></view>
        </view>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import { getPostDetail } from '@/apis/posts'
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'

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
                editor: {}
            }
        },
        components: {
            navBar,
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad(idObj) {

            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态
            if (!this.hasLogin) {
                this.toLogin()
            }

            this.idObj = idObj
        },
        onReady() {
            // 获取文章详情
            this.$loading()
            getPostDetail(this.idObj.id).then(res => {
                this.$loading(false)
                this.postObj = res.data
                this.initQuill(JSON.parse(this.postObj.content).ops)
            }).catch(err => {
                this.$loading(false)
            })
        },
        methods: {
            ...mapActions(['initLoginState']),

            // 初始化quill
            initQuill(content) {
                let editorOption = {
                    readOnly: true
                }
                const quill =  new Quill('#editor-content', editorOption)
                this.editor = quill
                this.editor.setContents(content)
            },

            toLogin() {
                uni.reLaunch({
                    url: '../login/login'
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
