<template>
	<view class="container">
		<view class="header-box">
			<u-navbar :is-fixed="true" :isBack="true" :background="{
				'background': '#16192B'
			}" :titleColor="'#ffffff'" :title="clubName" :borderBottom="false" back-icon-color="#FFFFFF">
			</u-navbar>
		</view>
		<view class="tag-select">
			<view class="tag" @tap="tapSelect(0)">
				<view :class="{ 'active': currentIndex === 0 }">可使用({{}})</view>
			</view>
			<view class="tag" @tap="tapSelect(1)">
				<view :class="{ 'active': currentIndex === 1 }">已经过期({{}})</view>
			</view>
		</view>
		<template v-if="currentIndex === 0">
			<view class="detail-area"  :class="{noData:true}">

			</view>
		</template>
		<template v-if="currentIndex === 1">
			<view class="detail-area">
				<view class="detail-item" v-for="item in 10" :key="item">
					<view class="image-box">
						<image src="@/static/share/static/icon1.png"></image>
					</view>
					<view class="detail-text">
						<view class="bar">
							<text>
								{{}}酒
							</text>
							<text>
								{{}}瓶
							</text>
						</view>
						<view class="time">
							<text>到期时间:</text>
							<text>2023-08-01 20:00</text>
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
			clubName: '',
			clubCover: '',
			clubName: '',
			surplusNum: '',
			saveWineItemList: [],
			expiringSoon: '',
			canTake: '',
			currentIndex: 1
		}
	},
	onLoad(option) {
		this.clubName = '酒库-' + option.clubName;
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
		display: flex;

		.tag {
			flex: 1;
			display: flex;
			justify-content: center;
			padding: 22rpx 0 24rpx;

			view {
				color: #979797;
				font-size: 30rpx;
				position: relative;

				&.active {
					color: #FFF;
					z-index: 1;

					&::after {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						bottom: 0;
						right: 0;
						background: #832DFF; // 模糊字体背景颜色
						transform: translateZ(0);
						z-index: -1;
						filter: blur(10rpx);
						border-radius: 100%;
					}

					&::before {
						content: "";
						position: absolute;
						top: 50rpx;
						left: 50%;
						width: 40rpx;
						height: 4rpx;
						background: #FFFFFF;
						border-radius: 3rpx;
						opacity: 0.2;
						transform: translateX(-50%);
					}
				}
			}
		}
	}

	.detail-area {
		width: 686rpx;
		overflow-y: auto;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16rpx;
		display: flex;
		flex-direction: column;
		place-items: center;
		padding: 20rpx 20rpx;

		.detail-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
			position: relative;
			margin: 20rpx 0;

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
				// place-items: center;
				justify-content: space-between;
				position: relative;
				left: -60rpx;

				.bar {
					display: flex;
					flex-direction: row;
					place-items: center;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					&>text {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 34rpx;
						&:nth-child(1){
							margin-right:20rpx;
						}
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
				text-align: center;

				text {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(255, 255, 255, 0.5);
					line-height: 34rpx;
					
				}
			}
		}
		&.noData{
			padding:0 0;
		}
	}

}</style>