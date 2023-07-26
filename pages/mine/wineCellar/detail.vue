<template>
	<view class="container">
		<view class="header-box">
			<u-navbar :is-fixed="true" :isBack="true" :background="{
				'background': '#16192B'
			}" :titleColor="'#ffffff'" :title="headTitle" :borderBottom="false" back-icon-color="#FFFFFF">
			</u-navbar>
		</view>
		<view class="tag-select">
			<view class="tag" :class="{ 'active': currentIndex === 0 }" @tap="tapSelect(0)">可使用({{}})</view>
			<view class="tag" :class="{ 'active': currentIndex === 1 }" @tap="tapSelect(1)">已经过期({{}})</view>
		</view>
		<template v-if="currentIndex === 0">
			<view class="detail-area">

			</view>
		</template>
		<template v-if="currentIndex === 1">
			<view class="detail-area">
				<view class="detail-item">
					<view class="image-box">
						<image></image>
					</view>
					<view class="detail-text">
						<view class="bar">
							<text>
								{{}}酒
							</text>
							<text>
								{{ }}瓶
							</text>
						</view>
						<view class="time">
							<text>到期时间:</text>
							<text>{{ }}</text>
						</view>
					</view>
					<view class="button">
						<text>查看订单</text>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>
<script>
export default {
	data() {
		return {
			headTitle: '',
			currentIndex: 0,
			detail_list:[]
		}
	},
	onLoad(option) {
		this.headTitle = '酒库-' + option.title;
	},
	methods: {
		tapSelect(num) {
			this.currentIndex = num;
		}
	}
}
</script>
<style lang="scss" scoped>
.adjust-location1 {}

.adjust-location2 {}

.container {
	width: 100%;
	padding: 0 40rpx;

	.tag-select {
		margin: 40rpx auto; //上下边距
		display: flex;
		flex-direction: row;
		position: relative;
		left: 13%;
		gap: 200rpx;

		.tag {

			// transition: ;
			color: #979797;

			&.active {
				position: relative;
				color: #FFF;

				&::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					width: 100rpx;
					height: 100rpx;
					background: #832DFF; // 模糊字体背景颜色
					transform: translateZ(0);
					filter: blur(10rpx);
					border-radius: 50%;
					z-index: -1;
				}

				&::after {
					content: "";
					position: absolute;
					top: 50rpx;
					left: 24%;
					width: 40rpx;
					height: 4rpx;
					background: #FFFFFF;
					border-radius: 3rpx;
					opacity: 0.2;
					transform: translateZ(0);
				}
			}
		}
	}

	.detail-area {
		width: 686rpx;
		height: 586rpx;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		place-items: center;

		&>.detail-item {
			display: flex;
			flex-direction: row;
			place-items: center;

			&>.image-box {
				width: 80rpx;
				height: 80rpx;

				&>image {
					width: 100%;
					height: 100%;
				}
			}

			&>.detail-text {
				display: flex;
				flex-direction: column;
				place-items: center;

				.bar {
					display: flex;
					flex-direction: row;
					place-items: center;

					&>text {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 34rpx;
					}
				}

				.time {
					display: flex;
					flex-direction: row;
					place-items: center;

					&>text {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(255, 255, 255, 0.5);
						line-height: 34rpx;
					}
				}
			}

			&>.button {
				width: 128rpx;
				height: 46rpx;
				border-radius: 40rpx;
				border: 1rpx solid rgba(255, 255, 255, 0.5);

				text {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(255, 255, 255, 0.5);
					line-height: 34rpx;
				}
			}
		}
	}

}
</style>