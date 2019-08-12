<template>
    <view class="content">
        <navBar :logo="logo" :leftIcon="leftIcon"
                :rightWords="rightWords"
                :title="title"
                @rightClick="rightClick()"
                @leftClick="toBack()">
        </navBar>

        <m-input class="m-input" type="text" clearable focus v-model="postTitle"  placeholder="输入文章标题"></m-input>

        <view class="editor-content">
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
                title: '发布主题内容',
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
        height: 100%;
        width: 100%;
        background: #0086b3;
    }
</style>
