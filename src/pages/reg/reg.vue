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
                    <button type="primary" class="mini-btn" @tap="registerCode">{{emailText.text}}</button>
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
            registerCode() {
                if (!this.canGetRegisterCode) {
                    return
                }
                if (!this.isCorrectAccount) {
                    this.$toast('登录账户格式错误')
                    return
                }

                // TODO 极验

                this.$loading()
                let data = {
                    account: this.account
                }
                registerCode(data).then(res => {
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

            // 注册
            register() {
                this.$loading()

                // 非空判断
                if (!this.strlen(this.name.trim()) || this.strlen(this.name.trim()) > 16) {
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
                // 密码与重复密码不一致
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
                    this.toHome()
                }).catch(err => {
                    console.log('err', err)
                })

            },

            // 中英文长度计算
            strlen(str){
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
                this.$toHome()
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
