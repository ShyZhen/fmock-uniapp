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
		onLoad: function () {
		    // 小程序不需要登出界面
		    // #ifdef MP-WEIXIN
		    this.toHome()
		    // #endif
		
		    // 在需要登录的地方执行初始化方法
		    this.initLoginState()
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
