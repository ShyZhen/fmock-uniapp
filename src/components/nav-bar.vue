<!-- 通用navbar 左侧、中间、右侧 应该合理组合，避免导航栏过于臃肿-->
<!-- 需要在每个页面 初始化body高度 即除去导航栏+状态栏高度 -->
<template>
    <!-- 导航 -->
    <view class="navbar e-b-bottom" :style="{height: (statusH + 44) + 'px', backgroundColor: bg}">
        <!-- 状态栏 -->
        <view :style="'height:' + statusH + 'px'"></view>
        <view class="e-flex_center nav-wrapper">
            <!-- 左边 -->
            <view class="left">
                <!-- 左侧logo -->
                <image class="logo-img" :src="logo" v-if="logo" mode="widthFix"></image>
                <!-- 左侧图标 -->
                <view class="iconfont" v-else-if="leftIcon" :class="leftIcon" @tap="leftClick"></view>
                <!-- 左侧文字 -->
                <view v-else-if="leftWords" @tap="leftClick">{{ leftWords }}</view>
            </view>
            <!-- 中间输入框 -->
            <view class="input-wrap" v-if="showInput">
                <text class="iconfont iconsearch"></text>
                <input type="text" disabled="true" placeholder="请输入搜索内容" @tap="inputClick"/>
            </view>
            <!-- 中间标题 -->
            <view class="title" v-else-if="title"><text>{{ title }}</text></view>
            <!-- 右边 -->
            <view class="right">
                <!-- 右侧图片 -->
                <image class="logo-img" v-if="rightImg" :src="rightImg" mode="widthFix"></image>
                <!-- 右侧图标 -->
                <text class="iconfont" v-else-if="rightIcon" :class="rightIcon" @tap="rightClick"></text>
                <!-- 右侧文字 -->
                <text v-else-if="rightWords" @tap="rightClick">{{ rightWords }}</text>
            </view>
        </view>
    </view>
</template>
<script>

    export default {
        name: 'navBar',
        props: {
            bg: {
                type: String,
                default: '#fff'
            },
            shadow: true,
            logo: '',
            leftIcon: '',
            leftWords: '',
            rightImg: '',
            rightIcon: '',
            rightWords: '',
            iconColor: '',
            title: '',
            showInput: false
        },
        data () {
            return {
                // statusH: 0,
            }
        },
        computed: {
            statusH() {
                return this.$store.state.statusH;
            }
        },
        methods:{
            inputClick: function () {
                this.$emit('inputClick',this.value)
            },
            leftClick: function () {
                this.$emit('leftClick')
            },
            rightClick: function () {
                this.$emit('rightClick')
            },
            // // 将导航栏高度存储到localstorage中，使用开发者工具记得清理缓存
            // getstatusHeight: function() {
            //     let statusHeight = this.statusH ? this.statusH : uni.getStorageSync('statusHeight')
            //     if (!statusHeight) {
            //         statusHeight = uni.getSystemInfoSync().statusBarHeight
            //         uni.setStorageSync('statusHeight', statusHeight)
            //     }
            //     // 状态栏高度
            //     this.statusH = statusHeight;
            // }
        }
    }
</script>
<style lang="scss" scoped>
    .navbar {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
    }
    .nav-wrapper {
        position: relative;
        padding: 0 20rpx;
        height: 88rpx;
    }
    .iconfont {
        font-size: 24px;  //44rpx;
    }
    .logo-img {
        width: 85px;  //170rpx
    }

    .input-wrap {
        display: inline-block;
        width: 300rpx;
        height: 33px;  //60rpx;
        padding-left: 20rpx;
        box-sizing: border-box;
        background-color: #FFF;
        border: 1px solid #00A6FC;
        border-radius: 50rpx;
        position: relative;
        font-size: 12px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .input-wrap .iconsearch {
        color: #00A6FC;
        font-size: 16px;  //30rpx;
        position: relative;
        right: 10rpx;
        top: 2rpx;
    }

    .input-wrap input {
        font-size: 12px;  //23rpx;
    }
    .left, .right {
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        z-index: 2;
    }
    .title {
        width: 100%;
        height: 100%;
        font-size: 14px;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
</style>