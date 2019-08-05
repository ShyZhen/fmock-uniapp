<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input class="m-input" type="text" clearable focus v-model="account" @blur="validateAccount" placeholder="输入手机号或邮箱"></m-input>
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="password" placeholder="输入密码"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="bindLogin">登录</button>
        </view>
        <view class="action-row">
            <navigator url="../reg/reg">注册账号</navigator>
            <text>|</text>
            <navigator url="../pwd/pwd">忘记密码</navigator>
        </view>
        <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
            <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
                <image :src="provider.image" @tap="oauth(provider.value)"></image>
            </view>
        </view>
    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { accountLogin, getAccountStatus, githubLogin, githubCallback } from '@/utils/loginPlugin.js'
import mInput from '@/components/m-input.vue'

    export default {
        onLoad: function () {
            // 小程序不需要登录界面
            // #ifdef MP-WEIXIN
            this.toHome()
            // #endif
        
            // 在需要登录的地方执行初始化方法
            this.initLoginState()
            
            // 判断登录状态 并跳转到首页
            if (this.hasLogin) {
                this.toHome()
            }
        },
        components: {
            mInput
        },
        data() {
            return {
				// 是否提供第三方登录
				hasProvider: true,
                providerList: [
					{"value":"github", "image":"/static/img/github.png"},
					{"value":"wechat", "image":"/static/img/weixin.png"},
					{"value":"qq", "image":"/static/img/qq.png"},
				],
                account: '',
                password: '',
				canLogin: false,
                positionTop: 0
            }
        },
		computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        methods: {
            ...mapActions(['initLoginState']),
            
			// 验证账号
			validateAccount() {
                const regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                const regPhone = /^1(?:3|4|5|6|7|8|9)\d{9}$/

                if (!this.account) {
                    this.canLogin = false;
                } else if (!(regEmail.test(this.account) || regPhone.test(this.account))) {
                    this.canLogin = false;
                    this.$toast('用户名格式不正确!')
                } else {
					// 检测用户是否已经注册
					let data = {
						"account": this.account,
					}
					getAccountStatus(data).then(res => {
						this.canLogin = true;
					}).catch(err => {}) 
                }
            },
			
			// 账号密码登录
            bindLogin() {
                if (!this.canLogin) {
                    this.$toast('用户名格式不正确!')
                    return
                };
				
				if (!this.password || this.password.length < 6) {
                    this.$toast('密码格式不正确!')
					return
				}
                
                // 调用登录插件进行登录
                this.$loading('登录中...')
                accountLogin(this.account, this.password).then(res => {
					this.$loading(false)
                    this.toHome()
                }).catch (err => {})
            },
			
			// 第三方OAUTH登录
			oauth(provider) {
                this.$loading('登录中...')
				switch (provider){
					case 'github':
					    githubLogin().then(res => {
							if (res.redirectUrl) {
								window.open(res.redirectUrl)
								window.addEventListener('message', (e) => {
									let res = JSON.parse(e.data);
									console.log('RES', res);
									if (res.access_token && res.binding_status) {
										// 本地存储token
										this.$loading(false)
                                        githubCallback(res)
										this.toHome()
									}
								}, false)
							}
						}).catch(err => {
							console.log('err', err)
						})
						break;
					case 'qq':
					    console.log('qq', provider)
						break;
					case 'wechat':
					    console.log('ww', provider)
						break;
					default:
					    this.$loading(false)
						break;
				}
			},

            toHome() {
                uni.reLaunch({
                    url: '../home/home'
                });
            },
            
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
        },
        onReady() {
            this.initPosition();
        }
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }

    .oauth-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }

    .oauth-image {
        width: 100upx;
        height: 100upx;
        /* border: 1upx solid #dddddd; */
        /* border-radius: 100upx; */
        margin: 0 40upx;
        /* background-color: #ffffff; */
    }

    .oauth-image image {
        width: 60upx;
        height: 60upx;
        margin: 10upx;
    }
</style>
