<template>
	<view>
        <!--
        * 广告组件
        * timedown 倒计时时间
        * imageUrl 背景图
        * url 跳转链接
        *  -->
        <!-- #ifndef MP -->
        <advert
        	ref="advert"
        	:timedown="advertTimedown"
        	:imageUrl="imageUrl"
        	:url="advertUrl"
        ></advert>
        <!-- #endif -->


		<!-- 头部导航 -->
		<nav-bar :logo="logo" :title="title" :showInput="showInput" :rightIcon="rightIcon"></nav-bar>

        <!-- 二级导航 -->
        <view style="height: 100%;">
            <scroll-view id="nav-bar" class="nav-bar" scroll-x scroll-with-animation :scroll-left="scrollLeft">
            	<view
            		v-for="(item, index) in tabBars" :key="item.id"
            		class="nav-item"
            		:class="{current: index === tabCurrentIndex}"
            		:id="'tab' + index"
            		@click="changeTab(index)"
            	>{{item.name}}</view>
            </scroll-view>

            <!-- 下拉刷新组件 -->
            <pulldown-refresh ref="pulldownRefresh" class="panel-content" :top="90" :pullIcon="pullIcon" @refresh="onPulldownReresh" @setEnableScroll="setEnableScroll">
                <!-- 内容部分 -->
                <swiper
                    id="swiper"
                    class="swiper-box"
                    :duration="300"
                    :current="tabCurrentIndex"
                    @change="changeTab"
                >
                    <swiper-item v-for="tabItem in tabBars" :key="tabItem.id">
                        <scroll-view
                            class="panel-scroll-box"
                            :scroll-y="enableScroll"
                            @scrolltolower="loadMore"
                            >


                            <!-- 文章列表 -->
                            <view v-for="(item, index) in tabItem.postsList" :key="index" class="posts-item" @click="navToDetails(item.uuid)">
                                <text :class="['title', 'title'+item.type]">{{item.title}}</text>

                                <!-- 空图片占位 -->
                                <view class="img-empty"></view>
                            </view>



                            <!-- 上滑加载更多组件 -->
                            <load-more :status="tabItem.loadMoreStatus" :loadingMoreIcon="loadingMoreIcon"></load-more>
                        </scroll-view>
                    </swiper-item>
                </swiper>
            </pulldown-refresh>
        </view>


        <!-- posts 文章组件 -->

        <!-- 点击进去需要登录 -->




<!--
        <view class="">
            <button type="primary" @tap="test()">sd</button>
            <button type="primary" @tap="login()">登录</button>
            <button type="primary" @tap="logout()">登出</button>
        </view> -->

	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { logout } from '@/utils/loginPlugin.js'
import navBar from '@/components/nav-bar'
import advert from '@/components/advert/vue/advert'    // 首页广告图插件
import pulldownRefresh from '@/components/pulldown-refresh/pulldown-refresh'    // 在滑块内的下拉刷新插件
import loadMore from '@/components/load-more/load-more'    // 在滑块内的上拉加载插件
import { getPostsList } from '@/apis/posts.js'

    let windowWidth = 0, scrollTimer = false, tabBar;
	export default {
		data() {
			return {
                logo: '/static/img/FMOCK-LOGO.png',
                leftIcon: 'iconback',
                leftWords: '',
                rightImg: '',
                rightIcon: '',
                rightWords: '',
                iconColor: '',
                title: '墨客社区',
				showInput: true,

                // 首页广告设置
                advertTimedown: 3,
                imageUrl: '/static/img/FMOCK-LOGO-S144.png',
                advertUrl: '/pages/advert/advert',

                // 二级导航
                tabBars: [],
                tabCurrentIndex: 0,  // 当前选项卡索引
                scrollLeft: 0,  // 顶部选项卡左滑距离
                enableScroll: true,
                pageSize: 10,    // 默认每页list数量，与后台服务一致，不得擅自修改

                pullIcon: '/static/img/FMOCK-LOGO-S144.png',
                loadingMoreIcon: ''
			}
		},
		computed: {
            ...mapState(['hasBinding', 'hasLogin']),
        },
		components: {
			navBar,
            advert,
            pulldownRefresh,
            loadMore,
		},
		onLoad: function () {
            // 在需要登录的地方执行初始化方法
            this.initLoginState()

            // 获取屏幕宽度
            windowWidth = uni.getSystemInfoSync().windowWidth;
            this.loadTabbars();
		},
        onReady: function () {
            // #ifndef MP
            this.$refs.advert.initAdvert();
            // #endif
        },
		methods: {
            ...mapActions(['initLoginState']),

            //获取分类
            loadTabbars() {
            	let tabList = [
                    {
                    	name: '热门',
                    	id: 'hot',
                    }, {
                    	name: '全部',
                    	id: 'all'
                    }, {
                    	name: '分享',
                    	id: 'share'
                    }, {
                    	name: '问答',
                    	id: 'question'
                    }, {
                    	name: '爆料',
                    	id: 'dynamite'
                    }, {
                    	name: '相亲',
                    	id: 'friend'
                    }, {
                    	name: '招聘',
                    	id: 'recruit'
                    }
                ]
            	tabList.forEach(item => {
            		item.postsList = [];
            		item.loadMoreStatus = 0;  //加载更多 0加载前，1加载中，2没有更多了
            		item.refreshing = 0;
                    item.curragePage = 1;
            	})
            	this.tabBars = tabList;console.log(this.tabBars)
            	this.loadPostsList('add');
            },

            // 获取文章列表数据
            loadPostsList(type) {
            	let tabItem = this.tabBars[this.tabCurrentIndex];

                // 加载
            	if (type === 'add') {
            		if(tabItem.loadMoreStatus === 2){
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
            		tabItem.refreshing = true;
            	}
            	// #endif

                getPostsList(tabItem.id, tabItem.curragePage).then(res => {
                    let list = res.data.data
                    if(type === 'refresh'){
                    	tabItem.postsList = []  // 刷新前清空数组
                    }
                    list.forEach(item => {
                    	item.id = parseInt(Math.random() * 10000)
                    	tabItem.postsList.push(item)
                    })

                    //下拉刷新 关闭刷新动画
                    if (type === 'refresh') {
                        this.$refs.pulldownRefresh && this.$refs.pulldownRefresh.endPulldownRefresh();
                        // #ifdef APP-PLUS
                        tabItem.refreshing = false;
                        // #endif
                        tabItem.loadMoreStatus = 0;
                    }

                    //上滑加载 处理状态以及页数
                    if (type === 'add') {
                        tabItem.loadMoreStatus = list.length < this.pageSize ? 2: 0;
                        tabItem.curragePage += 1
                    }
                }).catch(err => {})
            },

            // 文章详情
            navToDetails(uuid){
            	uni.navigateTo({
            		url: `/pages/post/${uuid}`
            	})
            },

            // 切换内容滑块
            async changeTab(e) {

                //多次切换只执行最后一次
                if (scrollTimer) {
                	clearTimeout(scrollTimer);
                	scrollTimer = false;
                }

                let index = e;
                // e=number为点击切换，e=object为swiper滑动切换
                if (typeof e === 'object') {
                	index = e.detail.current
                }
                if (typeof tabBar !== 'object') {
                	tabBar = await this.getElSize("nav-bar")
                }

                //计算宽度相关
                let tabBarScrollLeft = tabBar.scrollLeft;
                let width = 0;
                let nowWidth = 0;
                //获取可滑动总宽度
                for (let i = 0; i <= index; i++) {
                	let result = await this.getElSize('tab' + i);
                	width += result.width;
                	if(i === index){
                		nowWidth = result.width;
                	}
                }
                if (typeof e === 'number') {
                	//点击切换时先切换再滚动tabbar，避免同时切换视觉错位
                	this.tabCurrentIndex = index;
                }
                //延迟300ms,等待swiper动画结束再修改tabbar
                scrollTimer = setTimeout(() => {
                	if (width - nowWidth / 2 > windowWidth / 2) {
                		//如果当前项越过中心点，将其放在屏幕中心
                		this.scrollLeft = width - nowWidth / 2 - windowWidth / 2;
                	} else {
                		this.scrollLeft = 0;
                	}
                	if (typeof e === 'object') {
                		this.tabCurrentIndex = index;
                	}
                	this.tabCurrentIndex = index;


                	//第一次切换tab，动画结束后需要加载数据
                	let tabItem = this.tabBars[this.tabCurrentIndex];
                	if(this.tabCurrentIndex !== 0 && tabItem.loaded !== true){
                		this.loadPostsList('add');
                		tabItem.loaded = true;
                	}
                }, 300)
            },

            //获得元素的size
            getElSize(id) {
            	return new Promise((res, rej) => {
            		let el = uni.createSelectorQuery().select('#' + id);
            		el.fields({
            			size: true,
            			scrollOffset: true,
            			rect: true
            		}, (data) => {
            			res(data);
            		}).exec();
            	});
            },

            //下拉刷新
            onPulldownReresh(){
            	this.loadPostsList('refresh');
            },

            //上滑加载
            loadMore() {
            	this.loadPostsList('add');
            },

            //设置scroll-view是否允许滚动，在小程序里下拉刷新时避免列表可以滑动
            setEnableScroll(enable){
            	if(this.enableScroll !== enable){
            		this.enableScroll = enable;
            	}
            },





            // TEST
            test() {
                console.log(this.hasLogin)
                console.log(this.hasBinding)
            },
            login() {
                uni.navigateTo({
                    url: '/pages/login/login',
                })
            },
            logout() {
                logout().then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log('err', err)
                })
            }
		}
	}
</script>

<style lang='scss'>

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
