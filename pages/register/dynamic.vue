<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" title="发布动态" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#191C3F'}">
				<view slot="right" style="margin-right: 30rpx; color: #FFFFFF; font-size: 30rpx;"> <text>跳过</text> </view>
			</u-navbar>
		</view>
		<view class="middle_box">
			<view class="textarea_box">
				<textarea placeholder-class="placeholder" placeholder="这一刻的想法…"></textarea>
			</view>
			<view class="upload_box">
				<view class="upload_label">
					<text>上传照片</text>
					<text style="font-size: 28rpx; color: #72729E;">（选填,最多提交9张图片）</text>
				</view>
				<view class="img_list">
					<block v-for="(img, index) in 1" :key="index">
						<view class="common_img" :class="{'right': ( (index + 1) % 3 != 0)}">
							<image class="img" src="/static/imgs/common/upload.png"></image>
							<!-- <image class="cancel_icon" src="/static/imgs/common/cancel.png"></image> -->
						</view>
					</block>
				</view>
			</view>
			<view class="address_box">
				<view class="box_left">
					<view class="address_label"> <text>所在位置</text> </view>
				</view>
				<view class="box_right">
					<view class="address_text"> <text>所在位置</text> </view>
					<image class="common_right" src="/static/imgs/common/right.png"></image>
				</view>
			</view>
		</view>
		<view class="sure_btn active"> <text>确认</text> </view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100%;
		width: 100%;
		background: $uni-title-color;
		padding-bottom: 150rpx;

		.middle_box {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;

			.textarea_box {
				height: 300rpx;
				width: 100%;
				border-bottom: 1px solid #31345B;
				box-sizing: border-box;

				&>textarea {
					height: 100%;
					width: 100%;
					padding: 20rpx 0rpx;
					font-size: 32rpx;
					color: #FFFFFF;
				}
			}

			.upload_box {
				width: 100%;
				margin-top: 32rpx;

				.upload_label {
					width: 100%;
					margin-bottom: 24rpx;
					font-size: 32rpx;
					color: #FFFFFF;
				}

				.img_list {
					width: 100%;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					.common_img {
						height: 210rpx;
						width: 210rpx;
						position: relative;
						margin-bottom: 30rpx;

						&.right {
							margin-right: 30rpx;
						}

						.img {
							height: 100%;
							width: 100%;
						}

						.cancel_icon {
							height: 40rpx;
							width: 40rpx;
							position: absolute;
							right: -20rpx;
							top: -20rpx;
						}
					}
				}
			}

			.address_box {
				line-height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.address_label {
					font-size: 28rpx;
					color: #FFFFFF;
				}
				.box_right{
					display: flex;
					align-items: center;
					.address_text {
						font-size: 28rpx;
						color: #72729E;
					}				
					.common_right {
						height: 22rpx;
						width: 14rpx;
						margin-left: 16rpx;
					}
				}		
			}

		}

		.sure_btn {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			height: 90rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			text-align: center;
			background: #82799B;
			border-radius: 46rpx;
			margin-top: 20rpx;
			position: fixed;
			bottom: 30rpx;
			&.active {
				background: $uni-button-color;
			}
		}
	}
</style>
