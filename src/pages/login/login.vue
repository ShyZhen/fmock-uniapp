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
                <navigator url="../pwd/pwd">找回密码？</navigator>
                <navigator url="../reg/reg">注册</navigator>
            </view>
            <view class="oauth-row" v-if="hasProvider" v-bind:style="{top: positionTop + 'px'}">
                <view class="oauth-image" v-for="provider in providerList" :key="provider.value">
                    <image :src="provider.image" @tap="oauth(provider.value)"></image>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import { accountLogin, getAccountStatus, githubLogin, githubCallback, registerCode } from '@/utils/loginPlugin.js'
    import mInput from '@/components/m-input.vue'
    import navBar from '@/components/nav-bar'

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
            mInput,
            navBar
        },
        data() {
            return {
                leftIcon: 'iconback',
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
                }

                if (!this.password || this.password.length < 6) {
                    this.$toast('密码格式不正确!')
                    return
                }

                // 调用登录插件进行登录
                this.$loading('登录中...')
                accountLogin(this.account, this.password).then(res => {
                    this.$loading(false)
                    this.toHome()
                }).catch (err => {
                    this.$loading(false)
                })
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
                                    if (res.access_token) {
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
                uni.switchTab({
                    url: '../home/home'
                });
            },
            toBack() {
                uni.navigateBack({
                    delta: 1
                });
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
    .oauth-image image {
        width: 60rpx;
        height: 60rpx;
    }
</style>
