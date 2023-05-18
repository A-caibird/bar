<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="账号注销" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }"
		 :border-bottom="false"></u-navbar>
		<view class="tips_info">
			<view class="tips_title">账号被注销后，如下信息将被清空且无法找回</view>
			<view class="tips_line">
				1、账号信息
			</view>
			<view class="tips_line">
				2、我的动态
			</view>
			<view class="tips_line">
				3、我的订单等交易信息
			</view>
		</view>
		<view class="footer_btn" @tap="nextTap">我了解风险，确定</view>
	</view>
</template>

<script>
	export default {
		methods: {
			nextTap() {
				uni.showModal({
					title: '提示',
					content: '账号将在7个工作日内注销',
					showCancel:false,
					success: function (res) {
						uni.navigateBack({
							delta: 1
						});
						
					}
				});
				
			}
		},
	}
</script>

<style lang="scss">
	// page{
	// 	height: 100%;
	// }
	.container{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		padding-top: 120rpx;
		background: #fff;
		.header_tips{
			display:flex;
			justify-content: center;
			&>image{
				height: 72rpx;
				width: 72rpx;
				margin-bottom: 24rpx;
			}
			.title{
				font-size: 36rpx;
				color: #fff;
				font-weight: bold;
			}
		}
		.tips_info{
			width: 100%;
			box-sizing: border-box;
			padding: 0rpx 56rpx;
			margin-top: 40rpx;
			.tips_title{
				color: #fff;
				font-size: 28rpx;
				margin-bottom: 20rpx;
			}
			.tips_line{
				font-size: 28rpx;
				color: #fff;
				line-height: 50rpx;
			}
		}
		.footer_btn{
			width: calc(100% - 64rpx);
			margin: 0 auto;
			margin-top: 96rpx;
			line-height: 84rpx;
			height: 84rpx;
			border-radius: 50rpx;
			background: $uni-button-color;
			color: #FFFFFF;
			font-size: 32rpx;
			text-align: center;
		}
	}
</style>