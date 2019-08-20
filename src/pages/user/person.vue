<template>
    <view class="content">
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
        </view>
    </view>
</template>

<script>

    import { mapState, mapActions } from 'vuex'
    import { logout } from '@/utils/loginPlugin.js'

    export default {
        onLoad: function (e) {
            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态 并跳转到首页
            if (!this.hasLogin) {
                this.$toLogin()
            }
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin'])
        },
        methods: {
            ...mapActions(['initLoginState']),

            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },

            bindLogout() {
                logout()
                uni.reLaunch({
                    url: '../login/login',
                });
            }
        }
    }
</script>

<style>

</style>
