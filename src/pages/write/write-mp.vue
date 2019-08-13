<template>
    <view class="content">
        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @rightClick="rightClick()"
                @leftClick="toBack()">
        </navBar>

        <view class="editor-content">
            <m-input class="m-input" type="text" clearable focus v-model="postTitle"  placeholder="输入文章标题"></m-input>

        </view>

        <button type="primary" class="primary e-font30" @tap="post">发布</button>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import mInput from '@/components/m-input.vue'

    export default {
        data() {
            return {
                logo: '',
                leftIcon: 'iconioscloseempty',
                rightWords: '发布',
                title: '发布主题内容mp',
                postTitle: '',
                anonymous: false,
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
                this.toLogin()
            }
        },
        onReady: function () {
        },
        methods: {
            ...mapActions(['initLoginState']),







            post() {
            },

            rightClick() {
                console.log('right')
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

<style>
    .content {
        background: #fff;
        padding: 0;
    }
    .editor-content {
        height: 85%;
        width: 100%;
    }
</style>
