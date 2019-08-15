<template>
    <view class="content">

        <!-- 头部导航 -->
        <nav-bar :logo="logo" :title="title" :showInput="showInput" :rightIcon="rightIcon" @inputClick="inputClick"></nav-bar>
        关注
        <button type="primary" @tap="">sdddd</button>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
    export default {
        data() {
            return {
                logo: '/static/img/FMOCK-LOGO.png',
                rightIcon: '',
                title: '墨客社区',
                showInput: true,
            }
        },
        components: {
            navBar
        },
		computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad: function () {
            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态 并跳转到首页
            if (!this.hasLogin) {
                // #ifdef MP-WEIXIN
                this.toHome()
                // #endif
                // #ifdef H5
                this.toLogin()
                // #endif
            }
        },
        methods: {
            ...mapActions(['initLoginState']),

            // 搜索页面
            inputClick() {
                uni.navigateTo({
                    url: '../search/search'
                })
            },
            toLogin() {
                uni.reLaunch({
                    url: '../login/login'
                });
            },
            toHome() {
                uni.switchTab({
                    url: '../home/home'
                });
            },
        }
    }
</script>

<style>

</style>
