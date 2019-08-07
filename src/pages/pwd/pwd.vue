<template>
    <view class="content">
        <view class="input-group">
			
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input type="text" clearable v-model="account" @input="checkIsCorAccount" placeholder="输入手机或邮箱"></m-input>
            </view>
            <view class="input-row border" v-show="isCorrectAccount">
                <text class="title">验证码：</text>
                <m-input type="text" clearable v-model="verify_code" placeholder="输入验证码"></m-input>
				<button type="primary" @tap="getCode">{{emailText.text}}</button>
            </view>
			
            <view class="input-row border">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="password" @input="checkIsCorPassword" placeholder="请输入密码"></m-input>
            </view>
			
            <view class="input-row border">
                <text class="title">确认密码：</text>
                <m-input type="password" displayable v-model="password_confirmation" placeholder="请再次确认密码"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="updatePassword">更新密码</button>
        </view>
    </view>
</template>

<script>
    
import mInput from '../../components/m-input.vue'
import { getasswordCode, updatePassword } from '@/utils/loginPlugin.js'
import { mapState, mapActions } from 'vuex'

    export default {
        onLoad: function () {
            // 小程序不需要忘记密码界面
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
				// 用户邮箱
				account: '',
				// 验证码
				verify_code: '',
				// 用户密码
				password: '',
				// 用户密码验证
				password_confirmation: '',
				
				// 是否是正确的邮箱或者手机号码
                isCorrectAccount: false,
                
                // 密码格式是否正确
                isCorrectPassword: false,
				
				// 是否可以获取注册码
                canGetRegisterCode: true,
				
				emailText: {
                    text: '获取验证码'
                },
            }
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        methods: {
            ...mapActions(['initLoginState']),
			
			checkIsCorAccount() {
                const regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
                const regPhone = /^1(?:3|4|5|6|7|8|9)\d{9}$/
                const account = this.account;

                this.isCorrectAccount = regEmail.test(account) || regPhone.test(account);
            },
            
            // 密码规则校验 数字、字母、特殊字符 最少俩种
            checkIsCorPassword() {
                const regPassword = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!@#$%^&*()_.]+$)[\da-zA-Z!@#$%^&*()_.]{6,20}$/
                const password = this.password;
            
                this.isCorrectPassword = regPassword.test(password);
            },

            // 发送注册验证码
            getCode() {
				if(!this.canGetRegisterCode){
                    return
                }
				
				// TODO 极验
				
				this.$loading()
                let data = {
                    account: this.account
                }
                getasswordCode(data).then(res => {
					this.$loading(false)
					const _this = this
					this.canGetRegisterCode = false
					
					// 触发倒计时
                    _countDown(this.emailText)
                    function _countDown(textObj, time = 60) {
                        let timer = null;

                        timer = setInterval(() => {
                            if (time === 0) {
                                textObj.text = '获取验证码'
                                _this.canGetRegisterCode = true
                                clearInterval(timer)
                                return
                            }
                            time--;
                            textObj.text = `${time}s后重新发送`
                        }, 1000)    
                    }
					
                }).catch(err => {
					this.canGetRegisterCode = true
                    console.log('err', err)
                })
            },
            
            // 改密
            updatePassword() {
				this.$loading()

                if (!this.account.trim().length || !this.isCorrectAccount) {
                    this.$toast('登录账户格式错误!')
                    return 
                }
                if (this.verify_code.trim().length !== 6) {
                    this.$toast('验证码格式错误!')
                    return 
                }
                if (this.password.trim().length < 6 || this.password.trim().length > 20) {
                    this.$toast('密码最少需要6个字符，且不得超过20个字符!')
                    return 
                }
                if (!this.isCorrectPassword) {
                    this.$toast('密码只能由字母、数字、特殊字符组成，最少包含两种!')
                    return 
                }
                if (this.password_confirmation.trim().length < 6) {
                    this.$toast('请确认密码!')
                    return 
                }
                // 密码与重复密码不一致
                if (this.password.trim() !== this.password_confirmation.trim()) {
                    this.$toast('密码与重复密码不一致!')
                    return 
                }

                let data = {
                    password: this.password,
                    account: this.account,
                    verify_code: this.verify_code,
                    password_confirmation: this.password_confirmation
                }

                updatePassword(data).then(res => {
                    console.log(res)
					this.$loading(false)
					this.toHome()
                }).catch(err => {
                    console.log('err', err)
                })

            },
			
			// 中英文长度计算
			strlen(str) {
				let len = 0;
				for (let i = 0; i < str.length; i++) { 
					let c = str.charCodeAt(i); 
					//单字节加1 
					if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f))    { 
						len++; 
					} 
					else { 
						len+=2; 
					} 
				} 
				return len;
			},
			
            toHome() {
                uni.reLaunch({
                    url: '../home/home'
                });
            }
        }
    }
</script>

<style>

</style>
