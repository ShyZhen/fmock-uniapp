<template>
    <view class="content">
        <!-- 头部导航 -->
        <nav-bar :leftIcon="leftIcon" bg="transparent" shadow="false" @leftClick="toBack"></nav-bar>
        <!-- 页面标题 -->
        <view class="e-txtC e-font36 e-mt80">注册为新用户</view>

        <view class="container">
            <view class="input-group">
                <view class="input-row">
                    <m-input type="text" focus clearable v-model="name" placeholder="输入昵称"></m-input>
                </view>

                <view class="input-row e-flex_center">
                    <m-input type="text" clearable v-model="account" @input="checkIsCorAccount" placeholder="输入手机或邮箱"></m-input>
                    <button type="primary" class="mini-btn" @tap="registerCode">{{codeDuration ? codeDuration + 's' : '发送验证码' }}</button>
                </view>
                <view class="input-row">
                    <m-input type="text" clearable v-model="verify_code" placeholder="输入验证码"></m-input>
                </view>

                <view class="input-row">
                    <m-input type="password" displayable v-model="password" @input="checkIsCorPassword" placeholder="请输入密码"></m-input>
                </view>

                <view class="input-row">
                    <m-input type="password" displayable v-model="password_confirmation" placeholder="请再次确认密码"></m-input>
                </view>
            </view>
            <view class="btn-row">
                <button type="primary" class="primary e-font30" @tap="register">注册</button>
            </view>
            <!-- tip -->
            <view class="e-c9 e-font28 e-mt20">点击获取验证码按钮，即表示同意注册协议</view>
        </view>
    </view>
</template>

<script>

import mInput from '../../components/m-input.vue'
import { registerCode, accountRegister } from '@/utils/loginPlugin.js'
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar'
import * as Common from '@/utils/common.js'

    export default {
        onLoad: function () {
            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 判断登录状态 并跳转到首页
            if (this.hasLogin) {
                this.$toHome()
            }
        },
        components: {
            mInput,
            navBar
        },

        data() {
            return {
                leftIcon: 'iconjiantou',
                // 用户名称
                name: '',
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

                // 是否可以获取注册码|剩余时间
                codeDuration: 0
            }
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        methods: {
            ...mapActions(['initLoginState']),

            checkIsCorAccount() {
                const account = this.account;
                this.isCorrectAccount = Common.regular('email', account) || Common.regular('phone', account)
            },

            // 密码规则校验 数字、字母、特殊字符 最少俩种
            checkIsCorPassword() {
                const password = this.password;
                this.isCorrectPassword = Common.regular('password', password)
            },

            // 发送注册验证码
            registerCode() {
                if (this.codeDuration) {
                    this.$toast(`请在${this.codeDuration}秒后重试`)
                    return
                }
                if (!this.isCorrectAccount) {
                    this.$toast('登录账户格式错误')
                    return
                }

                // TODO 极验

                let data = {
                    account: this.account
                }
                registerCode(data).then(res => {
                    // 触发倒计时
                    this.codeDuration = 60
                    this.codeInterVal = setInterval(() => {
                        this.codeDuration--
                        if (this.codeDuration === 0) {
                            if (this.codeInterVal) {
                                clearInterval(this.codeInterVal)
                                this.codeInterVal = null
                            }
                        }
                    }, 1000)

                }).catch(err => {
                    this.$toast('验证码发送失败：' + err.data.message)
                })
            },

            // 注册
            register() {
                this.$loading()

                if (!Common.strLen(this.name.trim()) || Common.strLen(this.name.trim()) > 16) {
                    this.$toast('昵称最多不得超过8个汉字或16个字符')
                    return
                }
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
                if (this.password.trim() !== this.password_confirmation.trim()) {
                    this.$toast('密码与重复密码不一致!')
                    return
                }

                let data = {
                    name: this.name,
                    password: this.password,
                    account: this.account,
                    verify_code: this.verify_code,
                    password_confirmation: this.password_confirmation
                }

                accountRegister(data).then(res => {
                    console.log(res)
                    this.$loading(false)
                    this.$toHome()
                }).catch(err => {
                    console.log('err', err)
                })

            },
            toBack() {
                const pages = getCurrentPages()
                this.$toBack(pages.length)
            }
        }
    }
</script>

<style scoped lang="scss">
    .uni-navbar {
        background: transparent !important;
    }
    .container {
        width: 80%;
        margin: 0 auto;
    }
    .mini-btn {
        font-size: 12px;
        color: #0faeff;
        border-left: 1px solid #eaeaea;
        text-align: right;
        background: transparent;
        &::after{border: none;}
    }
    .input-group {
        font-size: 13px;
        border: 0;
        background: transparent;
        &::before, &::after {background: none;}
        .input-row {
            border-top: 0;
            border-bottom: 1rpx solid $e-line;
            margin-top: 70rpx;
        }
    }
    .btn-row {
        margin-top: 40rpx;
        padding: 0;
    }
</style>
