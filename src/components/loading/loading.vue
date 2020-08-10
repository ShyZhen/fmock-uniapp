<template>
	<!-- loading 加载 -->
	<view class="mix-loading-content">
		<view class="mix-loading-wrapper">
			<image
				class="mix-loading-icon"
				:src="loadingIcon">
			</image>
		</view>
	</view>
</template>

<script>
	export default {

		props: {
			top: {
				//距离顶部距离，单位rpx
				type: Number,
				default: 0
			},
            loadingIcon: ''
		},
		data() {
			return {

			};
		},
		methods: {

		}
	}
</script>

<style>
	.mix-loading-content{
		display:flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
	}
	.mix-loading-wrapper{
		display: flex;
		justify-content: center;
		align-items: center;
		animation: loading .5s ease-in infinite both alternate;
	}

	.mix-loading-icon{
		width: 80rpx;
		height: 80rpx;
		transition: .3s;
	}

	@keyframes loading {
		0% {
			transform: translateY(-20rpx) scaleX(1);
		}
		100% {
			transform: translateY(4rpx)  scaleX(1.3);
		}
	}

</style>
