<!--我关注的用户 所发布的所有文章信息 按照发布时间倒序-->
<template>
    <view class="content">

        <!-- 头部导航 -->
        <nav-bar :logo="logo" :title="title" :showInput="showInput" :rightIcon="rightIcon" @inputClick="inputClick"></nav-bar>

        <!-- 二级导航 -->
        <view style="height: 100%;">

            <!-- 下拉刷新组件 -->
            <pulldown-refresh ref="pulldownRefresh" class="panel-content" :top="90" :pullIcon="pullIcon" @refresh="onPulldownReresh">
                <!-- 内容部分 -->


                            <uni-fab
                                    :pattern="pattern"
                                    :content="content"
                                    :horizontal="horizontal"
                                    :vertical="vertical"
                                    :direction="direction"
                                    @trigger="trigger"
                            ></uni-fab>


                            <!-- 文章列表 -->
                            <!-- posts 文章组件 -->
                            <view v-for="(item, index) in postsList" :key="index" class="posts-item" @click="navToDetails(item.uuid)">
                                <text :class="['title', 'title'+item.type]">{{item.title}}</text>
                                <text>{{item.summary}}</text>
                                <!-- 空图片占位 -->
                                <view class="img-empty">
                                    <image :src="item.poster"></image>
                                </view>
                            </view>

                            <!-- 上滑加载更多 组件 -->
                            <load-more :status="loadMoreStatus" :loadingMoreIcon="loadingMoreIcon"></load-more>

            </pulldown-refresh>
        </view>

    </view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import navBar from '@/components/nav-bar.vue'
import pulldownRefresh from '@/components/pulldown-refresh/pulldown-refresh'    // 在滑块内的下拉刷新插件
import loadMore from '@/components/load-more/load-more'    // 在滑块内的上拉加载插件
import { getMyFollowPostsList } from '@/apis/posts.js'
import uniFab from '@/components/uni-fab.vue';    // 悬浮按钮

    export default {
        data() {
            return {
                // 导航栏
                logo: '/static/img/FMOCK-LOGO.png',
                rightIcon: '',
                title: '墨客社区',
                showInput: true,

                curragePage: 1,
                pageSize: 10,    // 默认每页list数量，与后台服务一致，不得擅自修改
                postsList: [],
                loadMoreStatus: 1,

                // 上拉下滑图标设置
                pullIcon: '/static/img/FMOCK-LOGO-S144.png',
                loadingMoreIcon: '/static/img/loading.png',

                // 悬浮按钮设置
                horizontal: 'right',
                vertical: 'top',
                direction: 'horizontal',
                pattern: {
                    color: '#7A7E83',
                    backgroundColor: '#fff',
                    selectedColor: '#007AFF',
                    buttonColor:"#007AFF"
                },
                content: [
                    {
                        iconPath: '/static/img/write-c.png',
                        text: '创作',
                    },
                    {
                        iconPath: '/static/img/hot.png',
                        text: '搜索',
                    },
                    {
                        iconPath: '/static/img/messagecopy-a.png',
                        text: '吐槽',
                    }
                ]
            }
        },
        components: {
            navBar,
            pulldownRefresh,
            loadMore,
            uniFab
        },
		computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
        onLoad: function () {
            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            if (!this.hasLogin) {
                this.toLogin()
            }

            this.loadPostsList('add')
        },
        methods: {
            ...mapActions(['initLoginState']),

            // 获取文章列表数据
            loadPostsList(type) {

                // 加载
                if (type === 'add') {
                    if(this.loadMoreStatus === 2){
                        return
                    }
                    this.loadMoreStatus = 1
                }
                // 刷新
                if (type === 'refresh') {
                    this.curragePage = 1
                }

                // TODO 接口还未开放
                getMyFollowPostsList(this.curragePage).then(res => {
                    let list = res.data.data
                    if(type === 'refresh'){
                        this.postsList = []  // 刷新前清空数组
                    }
                    list.forEach(item => {
                        this.postsList.push(item)
                    })

                    // 下拉刷新 关闭刷新动画
                    if (type === 'refresh') {
                        this.$refs.pulldownRefresh && this.$refs.pulldownRefresh.endPulldownRefresh()

                        this.loadMoreStatus = 0
                    }

                    // 上滑加载 处理状态以及页数
                    if (type === 'add') {
                        this.loadMoreStatus = list.length < this.pageSize ? 2: 0
                    }

                    this.curragePage += 1

                }).catch(err => {})
            },

            // 文章详情页
            navToDetails(uuid){
                // #ifdef H5
                uni.navigateTo({
                    url: `/pages/post/post?id=${uuid}`
                })
                // #endif

                // #ifdef MP-WEIXIN
                uni.navigateTo({
                    url: `/pages/post/post-mp?id=${uuid}`
                })
                // #endif
            },

            // 下拉刷新
            onPulldownReresh(){
                this.loadPostsList('refresh')
            },

            // 上滑加载
            loadMore() {
                this.loadPostsList('add')
            },

            // 悬浮按钮监听事件
            trigger(e) {
                console.log(e.index)
                switch (e.index) {
                    case 0:
                        // #ifdef H5
                        uni.navigateTo({
                            url: '../write/write'
                        });
                        // #endif

                        // #ifdef MP-WEIXIN
                        uni.navigateTo({
                            url: '../write/write-mp'
                        });
                        // #endif

                        break
                    case 1:

                        break
                    case 2:

                        break
                }
            },





            // 搜索页面
            inputClick() {
                uni.navigateTo({
                    url: '../search/search'
                })
            },
            toLogin() {
                uni.reLaunch({
                    url: '../login/login'
                });
            },
            toHome() {
                uni.switchTab({
                    url: '../home/home'
                });
            },
        }
    }
</script>

<style lang="scss" scoped>

    page {
        background-color: #f8f8f8;
        height: 100%;
        overflow: hidden;
    }

    /* 顶部tabbar */
    .nav-bar{
        position: relative;
        z-index: 10;
        height: 49px;
        white-space: nowrap;
        box-shadow: 0 2rpx 8rpx rgba(0,0,0,.06);
        background-color: #fff;
    .nav-item{
        display: inline-block;
        width: 108rpx;
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

    .swiper-box{
        height: 100%;
    }

    .panel-scroll-box{
        height: 100%;

    .panel-item{
        background: #fff;
        padding: 30px 0;
        border-bottom: 2px solid #000;
    }
    }

    .posts-item {
        position:relative;
        width: 750rpx;
        padding: 24rpx 30rpx;
        border-bottom-width: 1px;
        border-color: #eee;
        background-color: #fff;
    }
    .title {
        line-height: 46rpx;
        height: 45rpx;
    }
    .img-empty{
        height: 20rpx;
    }
</style>
