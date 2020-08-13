<template>
	<view>
		<view
			class="fab-box fab"
			:class="{
				leftBottom: leftBottom,
				rightBottom: rightBottom,
				leftTop: leftTop,
				rightTop: rightTop
			}"
		>
			<view
				class="fab-circle"
				:class="{
					left: horizontal === 'left' && direction === 'horizontal',
					top: vertical === 'top' && direction === 'vertical',
					bottom: vertical === 'bottom' && direction === 'vertical',
					right: horizontal === 'right' && direction === 'horizontal'
				}"
				:style="{ 'background-color': styles.buttonColor }"
				@click="open"
			>
				<text class="icon icon-jia" :class="{ active: showContent }"></text>
			</view>
			<view
				class="fab-content"
				:class="{
					left: horizontal === 'left',
					right: horizontal === 'right',
					flexDirection: direction === 'vertical',
					flexDirectionStart: flexDirectionStart,
					flexDirectionEnd: flexDirectionEnd
				}"
				:style="{ width: boxWidth, height: boxHeight, background: styles.backgroundColor }"
			>
				<view v-if="flexDirectionStart || horizontalLeft" class="fab-item first"></view>
				<view
					class="fab-item"
					v-for="(item, index) in content"
					:key="index"
					:class="{ active: showContent }"
					:style="{
						color: item.active ? styles.selectedColor : styles.color
					}"
					@click="taps(index, item)"
				>
					<image
						class="content-image"
						:src="item.active ? item.selectedIconPath : item.iconPath"
						mode=""
					></image>
					<text class="text">{{ item.text }}</text>
				</view>
				<view v-if="flexDirectionEnd || horizontalRight" class="fab-item first"></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		pattern: {
			type: Object,
			default: () => {
				return {};
			}
		},
		horizontal: {
			type: String,
			default: 'left'
		},
		vertical: {
			type: String,
			default: 'bottom'
		},
		direction: {
			type: String,
			default: 'horizontal'
		},
		content: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			fabShow: false,
			flug: true,
			showContent: false,
			styles: {
				color: '#3c3e49',
				selectedColor: '#007AFF',
				backgroundColor: '#fff',
				buttonColor: '#3c3e49'
			}
		};
	},
	created() {
		if (this.top === 0) {
			this.fabShow = true;
		}
		// 初始化样式
		this.styles = Object.assign({}, this.styles, this.pattern);
	},
	methods: {
		open() {
			this.showContent = !this.showContent;
		},
		/**
		 * 按钮点击事件
		 */
		taps(index, item) {
			this.$emit('trigger', {
				index,
				item
			});
		},
		/**
		 * 获取 位置信息
		 */
		getPosition(types, paramA, paramB) {
			if (types === 0) {
				return this.horizontal === paramA && this.vertical === paramB;
			} else if (types === 1) {
				return this.direction === paramA && this.vertical === paramB;
			} else if (types === 2) {
				return this.direction === paramA && this.horizontal === paramB;
			} else {
				return this.showContent && this.direction === paramA
					? this.contentWidth
					: this.contentWidthMin;
			}
		}
	},
	watch: {
		pattern(newValue, oldValue) {
			console.log(JSON.stringify(newValue));
			this.styles = Object.assign({}, this.styles, newValue);
		}
	},
	computed: {
		contentWidth(e) {
			return uni.upx2px((this.content.length + 1) * 110 + 20) + 'px';
		},
		contentWidthMin() {
			return uni.upx2px(110) + 'px';
		},
		// 动态计算宽度
		boxWidth() {
			return this.getPosition(3, 'horizontal');
		},
		// 动态计算高度
		boxHeight() {
			return this.getPosition(3, 'vertical');
		},
		// 计算左下位置
		leftBottom() {
			return this.getPosition(0, 'left', 'bottom');
		},
		// 计算右下位置
		rightBottom() {
			return this.getPosition(0, 'right', 'bottom');
		},
		// 计算左上位置
		leftTop() {
			return this.getPosition(0, 'left', 'top');
		},
		rightTop() {
			return this.getPosition(0, 'right', 'top');
		},
		flexDirectionStart() {
			return this.getPosition(1, 'vertical', 'top');
		},
		flexDirectionEnd() {
			return this.getPosition(1, 'vertical', 'bottom');
		},
		horizontalLeft() {
			return this.getPosition(2, 'horizontal', 'left');
		},
		horizontalRight() {
			return this.getPosition(2, 'horizontal', 'right');
		}
	}
};
</script>

<style scoped>
.fab-box {
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
}

.fab-box.top {
	width: 60rpx;
	height: 60rpx;
	right: 30rpx;
	bottom: 60rpx;
	border: 1px #5989b9 solid;
	background: #6699cc;
	border-radius: 10rpx;
	color: #fff;
	transition: all 0.3;
	opacity: 0;
}

.fab-box.active {
	opacity: 1;
}

.fab-box.fab {
	z-index: 10;
}

.fab-box.fab.leftBottom {
	left: 30rpx;
	bottom: 60rpx;
}

.fab-box.fab.leftTop {
	left: 30rpx;
	top: 80rpx;
	/* #ifdef H5 */
	top: calc(80rpx + var(--window-top));
	/* #endif */
}

.fab-box.fab.rightBottom {
	right: 30rpx;
	/* #ifdef H5 */
	bottom: 160rpx;
	/* #endif */
	/* #ifdef MP-WEIXIN */
	bottom: 60rpx;
	/* #endif */
}

.fab-box.fab.rightTop {
	right: 30rpx;
	top: 80rpx;
	/* #ifdef H5 */
	top: calc(80rpx + var(--window-top));
	/* #endif */
}

.fab-circle {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 110rpx;
	height: 110rpx;
	background: #3c3e49;
	/* background: #5989b9; */
	border-radius: 50%;
	box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
	z-index: 11;
}

.fab-circle.left {
	left: 0;
}

.fab-circle.right {
	right: 0;
}

.fab-circle.top {
	top: 0;
}

.fab-circle.bottom {
	bottom: 0;
}

.fab-circle .icon-jia {
	color: #ffffff;
	font-size: 50rpx;
	transition: all 0.3s;
}

.fab-circle .icon-jia.active {
	transform: rotate(135deg);
}

.fab-content {
	background: #6699cc;
	box-sizing: border-box;
	display: flex;
	border-radius: 100rpx;
	overflow: hidden;
	box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.1);
	transition: all 0.2s;
	width: 110rpx;
}

.fab-content.left {
	justify-content: flex-start;
}

.fab-content.right {
	justify-content: flex-end;
}

.fab-content.flexDirection {
	flex-direction: column;
	justify-content: flex-end;
}

.fab-content.flexDirectionStart {
	flex-direction: column;
	justify-content: flex-start;
}

.fab-content.flexDirectionEnd {
	flex-direction: column;
	justify-content: flex-end;
}

.fab-content .fab-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 110rpx;
	height: 110rpx;
	font-size: 24rpx;
	color: #fff;
	opacity: 0;
	transition: opacity 0.2s;
}

.fab-content .fab-item.active {
	opacity: 1;
}

.fab-content .fab-item .content-image {
	width: 50rpx;
	height: 50rpx;
	margin-bottom: 5rpx;
}

.fab-content .fab-item.first {
	width: 110rpx;
}

.icon {
	font-family: 'iconfont' !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/* 该图标即static中的字体图标 */
.icon-jia:before {
	content: '\e646';    /* 箭头加号： \e6be */
}
</style>
