<template>
	<view class="pop_box">
		<view class="mask_box" @tap.stop="noneEvent" v-if="isMask"></view>
		<view class="pop_panel">
			<view class="pop_content">
				<image class="header_icon" src="/static/imgs/common/invite_icon.png"></image>
				<view class="content_box">
					<view class="title_box">{{title}}</view>
					<view class="text_box">{{content}}</view>
				</view>
				<view class="btn_box">
					<view class="common_box line" @tap="$u.throttle(cancelTap)">{{cancelText}}</view>
					<view class="common_box fill" @tap="$u.throttle(confirmTap)">{{confirmText}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: String,
			content: String,
			cancelText: {
				type: String,
				default: '返回'
			},
			confirmText: {
				type: String,
				default: '确定'
			},
			isMask:{
				type:Boolean,
				default: true
			}
		},
		methods:{
			noneEvent(){
				this.$emit('maskTap');
			},
			cancelTap(){
				this.$emit('cancel');
			},
			confirmTap(){
				this.$emit('confirm');
			}
		}
	}
</script>

<style lang="scss">
	.pop_box{
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		height: 100%;
		width: 100%;
		z-index: 10;
		.mask_box{
			height: 100%;
			width: 100%;
			background: rgba(11, 13, 34, 0.6);
			position: relative;
			z-index: 5;
		}
		.pop_panel{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 10;
			width: 100%;
			.pop_content{
				width: calc(100% - 160rpx);
				margin-left: 80rpx;
				background: #FFFFFF;
				position: relative;
				border-radius: 12rpx;
				box-sizing: border-box;
				padding-top: 136rpx;
				padding-bottom: 20rpx;
				.header_icon{
					height: 246rpx;
					width: 284rpx;
					position: absolute;
					left: calc(50% - 142rpx);
					top: -124rpx;
					z-index: 20;
				}
				.content_box{
					width: 100%;
					.title_box{
						width: 100%;
						text-align: center;
						color: #333333;
						font-size: 34rpx;
						font-weight: bold;
					}
					.text_box{
						box-sizing: border-box;
						width: 100%;
						padding: 0 46rpx;
						text-align: center;
						color: #666666;
						font-size: 30rpx;
						margin-top: 50rpx;
					}
				}
				.btn_box{
					box-sizing: border-box;
					width: 100%;
					padding: 0 30rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 90rpx;
					.common_box{
						line-height: 80rpx;
						width: 254rpx;
						text-align: center;
						font-size: 28rpx;
						border: 1px solid transparent;
						border-radius: 40rpx;
						&.line{
							border: 1px solid #F22BB8;
							color: #F22BB8;
						}
						&.fill{
							background: linear-gradient(270deg, #BB0CF9 0%, #F92FAF 100%);
							color: #FFFFFF;
						}
					}
				}
			}
		}
		
	}
</style>
