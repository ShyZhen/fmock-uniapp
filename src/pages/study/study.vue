<!--视频列表页-->
<template>
	<view class="content">
		<view v-for="(item, index) in videoList" :key="index" class="posts-item e-box_f e-mt10" @click="navToDetails(item.uuid)">
			{{item.poster}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoList: []
			}
		},
		onLoad: function () {
			this.loadVideoList()
		},
		methods: {
			loadVideoList() {
				this.videoList = [
					{'uuid':1,'poster':'www.litblc.com'},
					{'uuid':2,'poster':'www.github.com'},
					{'uuid':3,'poster':'www.google.com'},
				];
			},
			// 视频详情页
			navToDetails(uuid){
				uni.navigateTo({
					url: `/pages/study/detail?id=${uuid}`
				})
			},
		}
	}
</script>

<style>

</style>
