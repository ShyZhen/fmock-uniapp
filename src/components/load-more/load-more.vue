<template>
	<view class="mix-load-more">
		<image
			class="mix-load-icon"
			:src="loadingMoreIcon"
			v-show="status === 1"
		>
		</image>
		<text class="mix-load-text">{{text[status]}}</text>
	</view>
</template>

<script>
	export default {
		name: "load-more",
		props: {
			status: {
				//0加载前，1加载中，2没有更多了
				type: Number,
				default: 0
			},
			text: {
				type: Array,
				default () {
					return [
						'上拉显示更多',
						'正在加载...',
						'没有更多数据了'
					];
				}
			},
            loadingMoreIcon: ''
		}
	}
</script>

<style>
	.mix-load-more{
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		height: 90upx;
		padding-top: 10upx;
	}
	.mix-load-icon{
		display: block;
		width: 36upx;
		height: 36upx;
		margin-right: 12upx;
		animation: load 1.2s cubic-bezier(.37,1.08,.7,.74) infinite;
	}
	.mix-load-text{
		font-size: 28upx;
		color: #888;
	}

	@-webkit-keyframes load {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>