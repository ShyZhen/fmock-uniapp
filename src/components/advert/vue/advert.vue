<!-- 首页广告大图插件 -->
<!-- 
     * advert 启动页广告 使用
     * 1. 引入组件并注册 
     * 		import mixAdvert from '@/components/mix-advert/vue/mix-advert';
     *      components: {mixAdvert},
             <!- #ifndef MP ->
                <mix-advert 
                    ref="mixAdvert" 
                    :timedown="8" 
                    imageUrl="/static/advert.jpg"
                    :url="advertNavUrl"
                ></mix-advert>
            <!- #endif ->
     * 	2. 调用组件的initAdvert()方法进行初始化
     *     this.$refs.advert.initAdvert();
     *  初始化的时机应该是在splash关闭时，否则会造成在app端广告显示了数秒后首屏才渲染出来 
-->
<template>
	<view 
		class="mix-advert-content" 
		:class="advertState===0 ? 'none' : advertState===1 ? 'show' : 'hide'"
		@click="advetTap"
	>
		<image class="mix-advert-bg" :src="imageUrl" mode="scaleToFill"></image>
		<view class="mix-advert-btn" @click.stop.prevent="hideAdvert">
			<text class="mix-advert-timer">跳过 {{timer}}</text>
		</view>
	</view>
</template>
 
<script>
	import advert from '@/components/advert/js/advert.js';
	export default {
		data() {
			return {
				advertState: 0,
				interval: null,
				timer: 8,
			}
		},
		props: {
			timedown: {
				type: Number,
				default: 8
			},
			imageUrl: {
				type: String,
				default: '/static/img/FMOCK-LOGO-S144.png'
			},
			url:{
				type: String,
				default: 'https://www.litblc.com'
			},
		},
		created(){
			this.timer = this.timedown;
		},
		methods: {
			initAdvert(){
				// #ifdef APP-PLUS
				let aaa = this.clickEvent;
				let params ={
					timer: this.timer,
					imageUrl: this.imageUrl,
					url: this.url
				}
				advert.initAdvert(params); 
				// #endif
				// #ifdef H5
				this.advertState = 1;
				this.startTimedown();
				// #endif
			},
			// #ifdef H5
			startTimedown(){
				this.interval = setInterval(()=>{
					this.timer -= 1;
					if(this.timer < 1){
						this.hideAdvert();
					}
				}, 1000)
			},

			hideAdvert(type){
				let timer = type === 'show' ? 10 : 800;
				let	state = type === 'show' ? 1 : 0;
				this.advertState = 2;
				clearInterval(this.interval);
				setTimeout(()=>{
					this.advertState = state;
				}, timer)
			},
			advetTap(){
				uni.navigateTo({
					url: this.url
				})
				
				this.hideAdvert();
			},
			// #endif
		},
	}
</script>

<style>
	.mix-advert-content{
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		z-index: 9999;
		transition: transform .6s, opacity 1s;
		opacity: 1;
	}
	.none{
		display: none;
	}
	.hide{
		opacity: 0;
		transform: scale(1.2);
	}
	.hide .cate-content{
		transform: translateX(0);
	}
	.mix-advert-bg{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.mix-advert-btn{
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 30rpx;
		top: 30rpx;
		z-index: 10;
		height: 50rpx;
		padding: 0 20rpx;
		background: rgba(0,0,0,.3);
		border-radius: 100px;
	}
	.mix-advert-timer{
		color: #fff;
		font-size: 26rpx;
		line-height: 1;
	}
</style>
