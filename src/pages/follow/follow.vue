<!--我关注的用户 所发布的所有文章信息 按照发布时间倒序-->
<template>
    <view class="content">

        <!-- 头部导航 -->
<!--        <nav-bar :logo="logo" :title="title" :showInput="showInput" :rightIcon="rightIcon" @inputClick="inputClick"></nav-bar>-->
        <nav-bar :logo="logo" :title="title"></nav-bar>

        <!-- 二级导航 -->
        <scroll-view id="nav-bar" class="nav-bar" :style="{top: statusH + 44 + 'px'}">
            <view
                    v-for="(item, index) in tabBars" :key="item.id"
                    class="nav-item"
                    :class="{current: index === tabCurrentIndex}"
                    :id="'tab' + index"
                    @click="changeTab(index)"
            >{{item.name}}</view>
        </scroll-view>

        <view :style="{paddingTop: statusH + 88 + 'px'}" class="panel-content">
            <!-- 下拉刷新组件 -->
            <pulldown-refresh ref="pulldownRefresh" class="panel-content" :top="statusH + 88" :pullIcon="pullIcon" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
                <!-- 内容部分 -->
                <swiper
                        id="swiper"
                        class="swiper-box"
                        :duration="300"
                        :current="tabCurrentIndex"
                        @animationfinish="changeTab"
                >
                    <swiper-item v-for="tabItem in tabBars" :key="tabItem.id">
                        <scroll-view
                                class="panel-scroll-box"
                                :scroll-y="enableScroll"
                                @scrolltolower="loadMore"
                        >
                            <!-- 文章列表 -->
                            <!-- posts 文章组件 -->
                            <view v-for="(item, index) in tabItem.postsList" :key="index" class="posts-item e-box_f e-mt10" @click="navToDetails(item.uuid)">
                                <!-- 标题 -->
                                <view class="e-font36 e-c0 e-omit2" :class="['title', 'title'+item.type]">{{item.title}}</view>
                                <!-- 内容 -->
                                <view class="e-flex e-pr20">
                                    <view class="e-flex_auto">
                                        <!-- 作者 -->
                                        <view class="e-flex_left user-info e-mt10 e-mb10 e-font28">
                                            <image :src="item.user_info.avatar"></image>
                                            <view class="e-ml10 e-c6 e-bold e-omit1 e-lp1">{{item.user_info.username}}</view>
                                            <!-- 这里使用的是标签不是一句话介绍，后面要换 -->
                                            <view class="e-flex_auto e-ml10 e-omit1 e-pr20 e-c9">{{item.user_info.bio}}</view>
                                        </view>
                                        <!-- 摘要 -->
                                        <view class="e-omit2 e-font30 e-c6">{{item.summary}}</view>
                                    </view>
                                    <!-- 空图片占位 -->
                                    <view class="img-empty" v-if="item.poster">
                                        <image :src="item.poster"></image>
                                    </view>
                                </view>
                                <!-- 点赞评论 -->
                                <view class="e-flex_center e-mt20">
                                    <view class="e-flex e-c9">
                                        <view>{{item.like_num}} 赞</view>
                                        <view class="e-ml10 e-mr10">·</view>
                                        <view>{{item.comment_num}} 评论</view>
                                    </view>
                                    <!-- more -->
                                    <view class="icon"></view>
                                </view>
                            </view>
                            <!-- 上滑加载更多 组件 -->
                            <load-more :status="tabItem.loadMoreStatus" :loadingMoreIcon="loadingMoreIcon"></load-more>
                        </scroll-view>
                    </swiper-item>
                </swiper>
            </pulldown-refresh>
        </view>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import pulldownRefresh from '@/components/pulldown-refresh/pulldown-refresh'    // 在滑块内的下拉刷新插件
import loadMore from '@/components/load-more/load-more'    // 在滑块内的上拉加载插件
import { getMyFollowPostsList } from '@/apis/action.js'
import { setTimeout } from 'timers';

let scrollTimer = false
export default {
    data() {
        return {
            logo: '/static/img/FMOCK-LOGO.png',
            title: '与我相关',
            showInput: true,

            // 二级导航
            tabBars: [],
            tabCurrentIndex: 0,  // 当前选项卡索引
            enableScroll: true,
            pageSize: 10,    // 默认每页list数量，与后台服务一致，不得擅自修改

            // 上拉下滑图标设置
            pullIcon: '/static/img/FMOCK-LOGO-S144.png',
            loadingMoreIcon: '/static/img/loading.png',
        }
    },
    computed: {
        ...mapState(['hasBinding', 'hasLogin', 'statusH']),
    },
    components: {
        navBar,
        pulldownRefresh,
        loadMore,
    },
    onLoad: function () {
        // 在需要登录的地方执行初始化方法
        this.initLoginState()

        // 判断登录状态
        if (!this.hasLogin) {
            this.$toLogin()
        }

        // 获取屏幕宽度
        // windowWidth = uni.getSystemInfoSync().windowWidth;
        this.loadTabbars()
    },
    methods: {
        ...mapActions(['initLoginState']),

        // 获取分类
        loadTabbars() {
            let tabList = [
                {
                    name: '文章',
                    id: 'post',
                }, {
                    name: '回答',
                    id: 'answer'
                }, {
                    name: '视频',
                    id: 'video'
                }
            ]
            tabList.forEach(item => {
                item.postsList = []
                item.loadMoreStatus = 0  // 加载更多 0加载前，1加载中，2没有更多了
                item.refreshing = 0
                item.curragePage = 1
            })
            this.tabBars = tabList
            this.loadPostsList('add')
        },

        // 获取文章列表数据
        loadPostsList(type) {

            let tabItem = this.tabBars[this.tabCurrentIndex]

            // 加载
            if (type === 'add') {
                if (tabItem.loadMoreStatus === 2){
                    return
                }
                tabItem.loadMoreStatus = 1
            }
            // 刷新
            if (type === 'refresh') {
                tabItem.curragePage = 1
            }

            // #ifdef APP-PLUS
            else if(type === 'refresh'){
                tabItem.refreshing = true
            }
            // #endif

            getMyFollowPostsList(tabItem.id, tabItem.curragePage).then(res => {
                let list = res.data.data
                if(type === 'refresh'){
                    // 刷新前清空数组
                    tabItem.postsList = []
                }
                list.forEach(item => {
                    tabItem.postsList.push(item)
                })

                // 下拉刷新 关闭刷新动画
                if (type === 'refresh') {
                    this.$refs.pulldownRefresh && this.$refs.pulldownRefresh.endPulldownRefresh()
                    // #ifdef APP-PLUS
                    tabItem.refreshing = false
                    // #endif
                    tabItem.loadMoreStatus = 0
                }

                // 上滑加载 处理状态以及页数
                if (type === 'add') {
                    tabItem.loadMoreStatus = list.length < this.pageSize ? 2: 0
                }

                tabItem.curragePage += 1

            }).catch(err => {})
        },

        // 文章详情页
        navToDetails(uuid){
            // 动态跳转到 post/answer/video 详情页面
            let currentPageIndex = this.tabBars[this.tabCurrentIndex].id
            if (currentPageIndex === 'video') {
                uni.navigateTo({
                    url: `/pages/study/detail?id=${uuid}`
                })
            } else {
                uni.navigateTo({
                    url: `/pages/post/${currentPageIndex}?id=${uuid}`
                })
            }
        },

        // 切换内容滑块
        async changeTab(e) {

            // 多次切换只执行最后一次
            if (scrollTimer) {
                clearTimeout(scrollTimer)
                scrollTimer = false
            }

            let index = e;
            // e = number为点击切换，e = object为swiper滑动切换
            if (typeof e === 'object') {
                index = e.detail.current
            }

            if (typeof e === 'number') {
                // 点击切换时先切换再滚动tabbar，避免同时切换视觉错位
                this.tabCurrentIndex = index
            }
            // 延迟300ms,等待swiper动画结束再修改tabbar
            scrollTimer = setTimeout(() => {
                if (typeof e === 'object') {
                    this.tabCurrentIndex = index
                }
                this.tabCurrentIndex = index

                // 第一次切换tab，动画结束后需要加载数据
                let tabItem = this.tabBars[this.tabCurrentIndex]
                if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
                    this.loadPostsList('add')
                    tabItem.loaded = true
                }
            }, 300)
        },

        // 下拉刷新
        onPulldownReresh(){
            this.loadPostsList('refresh')
        },

        // 上滑加载
        loadMore() {
            setTimeout(() => {
                this.loadPostsList('add')
            }, 1000);
        },

        // 设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
        setEnableScroll(enable){
            if(this.enableScroll !== enable){
                this.enableScroll = enable
            }
        },

        // 搜索页面
        inputClick() {
            uni.navigateTo({
                url: '../search/search'
            })
        },
    }
}
</script>

<style lang='scss'>
    .article {
        height: 100vh;
        box-sizing: border-box;
        position: relative;
    }
    /* 顶部tabbar */
    .nav-bar{
        position: fixed;
        left: 0;
        z-index: 10;
        height: 44px;
        white-space: nowrap;
        box-shadow: 0 2rpx 8rpx rgba(0,0,0,.06);
        background-color: #fff;
        .nav-item{
            display: inline-block;
            width: 250rpx;
            height: 49px;
            text-align: center;
            line-height: 49px;
            font-size: 14px;
            color: #303133;
            position: relative;
            &:after{
                content: '';
                width: 0;
                height: 0;
                border-bottom: 4rpx solid #007aff;
                position: absolute;
                left: 50%;
                bottom: 0;
                transform: translateX(-50%);
                transition: .3s;
            }
        }
        .current{
            color: #007aff;
            &:after{
                width: 50%;
            }
        }
    }

    /*兼容H5的页面高度*/
    .panel-content {
        height: 102%;
    }
    .swiper-box{
        box-sizing: border-box;
        height: 100%;
        overflow: hidden;
    }

    .panel-scroll-box{
        height: 100%;
        overflow: hidden;
        .panel-item{
            background: #fff;
            padding: 30px 0;
            border-bottom: 2px solid #000;
        }
    }

    .posts-item {
        position:relative;
        width: 100%;
        padding: 24rpx 30rpx;
        border-bottom-width: 1px;
        border-color: #eee;
        background-color: #fff;
    }
    .title {
        // line-height: 46rpx;
        // height: 45rpx;
    }
    .user-info {
        image {
            width: 40rpx;
            height: 40rpx;
            border-radius: 20rpx;
        }
    }
    .img-empty{
        width: 175rpx;
        height: 140rpx;
        border-radius: 3px;
        margin-left: 20rpx;
        overflow: hidden;
        image {
            width: 100%;
            height: 100%;
        }
    }
</style>
