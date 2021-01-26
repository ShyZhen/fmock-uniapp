<!--视频详情页 通过视频uuid获取视频详情-->
<template>
	<view class="content">
		<view class="uni-padding-wrap uni-common-mt">
			<view>
<!--				<video id="fmock-video-context" src="https://video.fmock.com/hls/2020/08/f7bc3a7fe892ff13cbad3971bea669d9.m3u8"-->
				<video id="fmock-video-context" src="https://video.fmock.com/hls/1280/video-e9b41439-c1b0-7e54-60e5-6ad50d6d64ce.m3u8"
					   @error="videoErrorCallback" :danmu-list="danmuList" enable-danmu danmu-btn controls></video>
			</view>
			<!-- #ifndef MP-ALIPAY -->
			<view class="uni-list uni-common-mt">
				<view class="uni-list-cell">
					<view>
						<view class="uni-label">弹幕内容</view>
					</view>
					<view class="uni-list-cell-db">
						<input v-model="danmuValue" class="uni-input" type="text" placeholder="在此处输入弹幕内容" />
					</view>
				</view>
			</view>
			<view class="uni-btn-v">
				<button @click="sendDanmu" class="page-body-button">发送弹幕</button>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

	export default {
		data() {
			return {
				src: '',
				danmuList: [],
				danmuValue: ''
			}
		},
		computed: {
			...mapState(['hasBinding', 'hasLogin']),
		},
		onLoad(idObj) {

			// 在需要登录的地方执行初始化方法
			this.initLoginState()

			// 判断登录状态
			if (!this.hasLogin) {
				this.$toLogin()
			}

			this.idObj = idObj
			console.log(this.idObj)
		},
		onReady: function(res) {
			// #ifndef MP-ALIPAY
			this.videoContext = uni.createVideoContext('fmock-video-context')
			// #endif
		},
		methods: {
			...mapActions(['initLoginState']),

			sendDanmu: function() {
				this.videoContext.sendDanmu({
					text: this.danmuValue,
					color: this.getRandomColor()
				});
				this.danmuValue = '';
			},
			videoErrorCallback: function(e) {
				console.log(e)
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			getRandomColor: function() {
				const rgb = []
				for (let i = 0; i < 3; ++i) {
					let color = Math.floor(Math.random() * 256).toString(16)
					color = color.length == 1 ? '0' + color : color
					rgb.push(color)
				}
				return '#' + rgb.join('')
			}
		}
	}
</script>

<style>

</style>
