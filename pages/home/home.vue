<template>
	<view style="padding: 0 0 100px 0">
        <view class="">
            首页
             <button type="primary" @tap="test()">sd</button>
             <button type="primary" @tap="login()">登录</button>
             <button type="primary" @tap="logout()">登出</button>
        </view>

	</view>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {logout} from '../../utils/loginPlugin.js'

	export default {
		data() {
			return {

			}
		},
        components: {
            
        },

		computed: {
            ...mapState(['hasBinding', 'hasLogin']),
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
