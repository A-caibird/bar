<template>
	<view class="pop_box">
		<view class="mask_box" @tap.stop="noneEvent" v-if="isMask"></view>
		<view class="pop_panel">
			<view class="pop_content">
				<image class="header_icon" src="/static/imgs/common/invite_icon.png"></image>
				<view class="content_box" v-if="mode == 'common'">
					<view class="title_box">{{title}}</view>
					<view class="text_box">{{content}}</view>
				</view>
				<view class="content_box" v-if="mode == 'price'">
					<view class="title_box">{{title}}</view>
					<view class="price_info">
						<view class="price_text">{{price}}</view>
						<view class="price_label">拼享金额（元）</view>
					</view>
					<view class="tips_info">
						<view class="tips_title">注意事项</view>
						<view class="tips_text">对方未同意拼单加入，拼单费用会自动退回</view>
						<view class="tips_text">拼单成功后请准时到达哦</view>
						<view class="tips_text">禁止和陌生人拼单，谨防诈骗</view>
					</view>
				</view>
				<view class="btn_box">
					<view class="common_box line" @tap.stop="$u.throttle(cancelTap)">{{cancelText}}</view>
					<view class="common_box fill" @tap.stop="$u.throttle(confirmTap)">{{confirmText}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			mode:{ // 默认
				type: String,
				default: 'common' 
			},
			title: String,
			content: String,
			price: String | Number,
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
					.price_info{
						width: 100%;
						text-align: center;
						margin-top: 60rpx;
						.price_text{
							font-size: 40rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #000000;
							width: 100%;
							@include simpleOmit();
						}
						.price_label{
							font-size: 28rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #666666;
							margin-top: 20rpx;
						}
					}
					.tips_info{
						width: 100%;
						margin-top: 40rpx;
						text-align: center;
						.tips_title{
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #666666;
							margin-bottom: 20rpx;
						}
						.tips_text{
							font-size: 22rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #B6B6B6;
							line-height: 40rpx;
						}
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
