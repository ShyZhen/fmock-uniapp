<template>
    <view class="content">
        <!-- 头部导航 -->
        <nav-bar :leftIcon="leftIcon" bg="transparent" shadow="false" @leftClick="toBack"></nav-bar>

        <!-- 页面标题 -->
        <view class="e-txtC e-font36 e-mt80">密码登录</view>

        <view class="container">
            <!-- 登录信息 -->
            <view class="input-group">
                <view class="input-row">
                    <m-input class="m-input" type="text" clearable focus v-model="account" @blur="validateAccount" placeholder="输入手机号或邮箱"></m-input>
                </view>
                <view class="input-row">
                    <m-input type="password" displayable v-model="password" placeholder="输入密码"></m-input>
                </view>
            </view>
            <!-- 登录按钮 -->
            <view class="btn-row">
                <button type="primary" class="primary e-font30" @tap="bindLogin">登录</button>
            </view>
            <view class="action-row e-flex_center e-mt30">
                <navigator url="../pwd/pwd">找回密码?</navigator>
                <navigator url="../reg/reg">注册</navigator>
            </view>
            <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
                <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
                    <image :src="provider.image" @tap="oauth(provider.value)"></image>
                    <!-- #ifdef MP-WEIXIN -->
                    <button open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
                    <!-- #endif -->
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// #ifdef MP-WEIXIN
import { wxmpLogin } from '@/utils/loginPlugin.js'
// #endif
import { mapState, mapActions } from 'vuex'
import { accountLogin, getAccountStatus, githubLogin, githubCallback } from '@/utils/loginPlugin.js'
import mInput from '@/components/m-input.vue'
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
                // 是否提供第三方登录
                hasProvider: true,
                providerList: [],
                account: '',
                password: '',
                canLogin: false,
                positionTop: 0,
                isDevtools: false,
            }
        },
        computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        methods: {
            ...mapActions(['initLoginState']),

            initProvider() {

                // 只有H5有github登录
                // #ifdef H5
                this.setProviderList('github')
                // #endif

                // 非H5根据情况循环添加,目前只有微信小程序
                const filters = ['weixin']
                uni.getProvider({
                    service: 'oauth',
                    success: (res) => {
                        if (res.provider && res.provider.length) {
                            for (let i = 0; i < res.provider.length; i++) {
                                if (~filters.indexOf(res.provider[i])) {
                                    this.setProviderList(res.provider[i])
                                }
                            }
                            this.hasProvider = true
                        }
                    },
                    fail: (err) => {
                        console.error('获取服务供应商失败：' + JSON.stringify(err))
                    }
                });
            },

            setProviderList(provider) {
                this.providerList.push({
                    value: provider,
                    image: '../../static/img/' + provider + '.png'
                })
            },

            // 验证账号
            validateAccount() {
                if (!this.account) {
                    this.canLogin = false
                } else if (!Common.regular('email', this.account) && !Common.regular('phone', this.account)) {
                    this.canLogin = false
                    this.$toast('用户名格式不正确!')
                } else {
                    // 检测用户状态是否正常、是否存在
                    let data = {
                        'account': this.account,
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
                }

                if (!this.password || this.password.length < 6) {
                    this.$toast('密码格式不正确!')
                    return
                }

                // 调用登录插件进行登录
                this.$loading('登录中...')
                accountLogin(this.account, this.password).then(res => {
                    this.$loading(false)
                    this.$toHome()
                }).catch (err => {
                    this.$loading(false)
                })
            },

            // 第三方OAUTH登录
            oauth(provider) {
                this.$loading('登录中...')
                switch (provider) {
                    case 'github':
                        githubLogin().then(res => {
                            if (res.redirectUrl) {
                                window.open(res.redirectUrl)
                                window.addEventListener('message', (e) => {
                                    let res = JSON.parse(e.data)
                                    if (res.access_token) {
                                        // 本地存储token
                                        this.$loading(false)
                                        githubCallback(res)
                                        this.$toHome()
                                    }
                                }, false)
                            }
                        }).catch(err => {
                            console.log('err', err)
                        })
                        break
                    case 'qq':
                        this.$toast(provider + '还没开通')
                        break
                    default:
                        this.$loading(false)
                        break
                }
            },

            getUserInfo({detail}) {
                if (detail.userInfo) {
                    wxmpLogin(detail.userInfo).then(res => {
                        this.$loading(false)
                        this.$toHome()
                    }).catch(err => {
                        setTimeout(() => {this.$toast('微信登录失败'), 500})
                    })
                } else {
                    this.$toast('获取用户信息失败')
                }
            },
            toBack() {
                const pages = getCurrentPages()
                this.$toBack(pages.length)
            },

            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100
            },
        },
        onReady() {
            this.initPosition()
            this.initProvider()
            // #ifdef MP-WEIXIN
            this.isDevtools = uni.getSystemInfoSync().platform === 'devtools'
            // #endif
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
    .oauth-row {
        width: 60%;
        position: absolute;
        bottom: 30rpx;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .oauth-image {
        position: relative;
        width: 30px;
        height: 30px;
        border: 1px solid #dddddd;
        border-radius: 50px;
        margin: 0 20px;
        background-color: #ffffff;
    }

    .oauth-image image {
        width: 30px;
        height: 30px;
    }
    .oauth-image button {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
</style>
