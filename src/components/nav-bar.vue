<!-- 通用navbar 左侧、中间、右侧 应该合理组合，避免导航栏过于臃肿-->
<!-- 需要在每个页面 初始化body高度 即除去导航栏+状态栏高度 -->
<template>
    <!-- 导航 -->
    <view :style="'height:' + navH + 'px'">
        <uni-nav-bar fixed="true" :background-color="bg" :shadow="shadow">
            <!-- 中间输入框 -->
            <view class="input-wrap" v-if="showInput">
                <text class="iconfont iconsearch"></text>
                <input type="text" disabled="true" placeholder="请输入搜索内容" @tap="inputClick"/>
            </view>
            <!-- 中间标题 -->
            <view v-else-if="title"><text>{{ title }}</text></view>
            <!-- 左边 -->
            <view slot="left">
                <!-- 左侧logo -->
                <image class="logo-img" :src="logo" v-if="logo" mode="widthFix"></image>
                <!-- 左侧图标 -->
                <text class="iconfont" v-else-if="leftIcon" :class="leftIcon" @tap="leftClick"></text>
                <!-- 左侧文字 -->
                <text v-else-if="leftWords" @tap="leftClick">{{ leftWords }}</text>
            </view>
            <!-- 右边 -->
            <view slot="right">
                <!-- 右侧图片 -->
                <image class="logo-img" v-if="rightImg" :src="rightImg" mode="widthFix"></image>
                <!-- 右侧图标 -->
                <text class="iconfont" v-else-if="rightIcon" :class="rightIcon" @tap="rightClick"></text>
                <!-- 右侧文字 -->
                <text v-else-if="rightWords" @tap="rightClick">{{ rightWords }}</text>
            </view>
        </uni-nav-bar>
    </view>
</template>
<script>
    import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'

    export default {
        name: 'navBar',
        props: {
            bg: '',
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
        components: {
            uniNavBar
        },

        data () {
            return {
                navH: 0
            }
        },
        created() {
            this.getNavHeight()
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
            // 将导航栏高度存储到localstorage中，使用开发者工具记得清理缓存
            getNavHeight: function() {
                let navHeight = this.navH ? this.navH : uni.getStorageSync('navHeight')
                if (!navHeight) {
                    navHeight = uni.getSystemInfoSync().statusBarHeight
                    uni.setStorageSync('navHeight', navHeight)
                }
                // 导航栏高度 = 默认46px + 状态栏高度
                this.navH = navHeight + 46
                console.log(this.navH)
            }
        }
    }
</script>
<style lang="scss" scoped>
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
        font-size: 23rpx;
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
</style>