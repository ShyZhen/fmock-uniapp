<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input type="text" focus clearable v-model="account" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row border">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
            </view>
            <view class="input-row">
                <text class="title">邮箱：</text>
                <m-input type="text" clearable v-model="email" placeholder="请输入邮箱"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="register">注册</button>
            
            <button type="primary" @tap="registerCode">发送注册验证码</button>
        </view>
    </view>
</template>

<script>
import mInput from '../../components/m-input.vue'
import {registerCode, accountRegister} from '@/utils/loginPlugin.js'
import {mapState, mapActions} from 'vuex'

    export default {
        onLoad: function () {
            // 小程序不需要注册界面
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
                account: '',
                password: '',
                email: '',
                verifyCode: '',
                passwordConfirmation: ''
                
            }
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        methods: {
            ...mapActions(['initLoginState']),
            
            // 发送注册验证码
            registerCode() {
                const data = {
                    account: "13476835720"
                }
                registerCode(data).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log('err', err)
                })
            },
            
            // 注册
            register() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                if (this.email.length < 3 || !~this.email.indexOf('@')) {
                    uni.showToast({
                        icon: 'none',
                        title: '邮箱地址不合法'
                    });
                    return;
                }

                const data = {
                    name: this.name,
                    password: this.password,
                    account: this.email,
                    verifyCode: this.verifyCode,
                    passwordConfirmation: this.passwordConfirmation
                }

                accountRegister(data).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log('err', err)
                })

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
