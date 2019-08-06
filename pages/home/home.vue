<template>
	<view>
		<!-- 头部导航 -->
		<nav-bar :logo="logo" :title="title" :showInput="showInput" :rightIcon="rightIcon"></nav-bar>
        
        <view style="height: 10rpx;"></view>
        
        
        <view class="">
            首页
            <button type="primary" @tap="test()">sd</button>
            <button type="primary" @tap="login()">登录</button>
            <button type="primary" @tap="logout()">登出</button>
        </view>

	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { logout } from '@/utils/loginPlugin.js'
import navBar from '@/components/nav-bar'

	export default {
		data() {
			return {
                logo: '/static/img/FMOCK-LOGO.png',
                leftIcon: 'iconback',
                leftWords: '',
                rightImg: '',
                rightIcon: '',
                rightWords: '',
                iconColor: '',
                title: '墨客社区',
				showInput: true
			}
		},
		computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
		components: {
			navBar
		},
		onLoad: function () {
            // 在需要登录的地方执行初始化方法
            this.initLoginState()
		},
		methods: {
            ...mapActions(['initLoginState']),
            test() {
                console.log(this.hasLogin)
                console.log(this.hasBinding)
            },



            // TEST
            login() {
                uni.navigateTo({
                    url: '/pages/login/login',
                })
            },
            logout() {
                logout().then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log('err', err)
                })
            }
		}
	}
</script>

<style>
</style>
