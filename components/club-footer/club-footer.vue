<template>
	<view class="club_footer">
		<view class="footer_box">
			<view class="common_item" v-if="!isAppleAudit" @tap="$u.throttle(clickTap('service'),1200)">
				<view class="common_icon">
					<image src="/static/imgs/common/kefu.png"></image>
				</view>		
				<text>客服</text>
			</view>
			<view class="common_item" @tap="$u.throttle(clickTap('collect'), 1200)">
				<view class="common_icon">
					<image src="/static/imgs/common/star_icon.png" v-if="collect"></image>
					<image src="/static/imgs/common/star_no_icon.png" v-else></image>
				</view>
				<text>收藏</text>
			</view>
			<view class="common_item" @tap="$u.throttle(clickTap('share'), 1200)">
				<view class="common_icon">
					<image src="/static/imgs/mine/forward.png"></image>
				</view>
				<text>分享</text>
			</view>
			<view class="btn_text" :class="{end:isJoin}" @tap="$u.throttle(clickTap(isJoin?'null':'ping'))" v-if="isPing">
				<block v-if="isJoin">
					<text>已加入</text>
				</block>
				<block v-else>
					<image src="/static/imgs/common/club_share.png"></image>
					<text>拼享</text>
				</block>
			</view>
			<view class="btn_text share_btn" @tap="$u.throttle(clickTap('fight'), 1200)" v-if="!isAppleAudit || platform != 'android'">
				<image src="/static/imgs/common/seat_icon.png"></image>
				<text>拼享</text>
			</view>
			<view class="btn_text" @tap="$u.throttle(clickTap('book'), 1200)" v-if="!isAppleAudit || platform != 'android'">
				<image src="/static/imgs/common/seat_icon.png"></image>
				<text>订座</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			isAppleAudit: {
				type: Boolean,
				default: false,
			},
			collect:{
				type: Boolean,
				default: false
			},
			isPing:{
				type: Boolean,
				default: false
			},
			isJoin:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				platform: getApp().globalData.platform,
			}
		},
		methods:{
			clickTap: function(type){
				this.$emit('clickTap',{
					type: type
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.club_footer{
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		z-index: 100;
		width: 100%;
		.footer_box{
			height: 120rpx;
			width: 100%;
			display: flex;
			align-items: center;
			background: $uni-title-color;
			position: relative;
			.common_item{
				height: 100%;
				width: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.common_icon {
					width: 40rpx;
					height: 40rpx;
					@include flex-center();
					image {
						height: 40rpx;
						width: 40rpx;
					}
				}
				&>text{
					font-size: 24rpx;
					color: rgba(255,255,255,0.5);
				}
			}
			.btn_text{
				height: 80rpx;
				width: 200rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: $uni-button-color;
				font-size: 28rpx;
				color: #FFFFFF;
				border-radius: 48rpx;
				position: absolute;
				right: 30rpx;
				&.share_btn{
					right: 260rpx;
				}
				&.end {
					background: #585E8D;
				}
				&>image{
					height: 30rpx;
					width: 30rpx;
					margin-right: 14rpx;
				}
			}
		}
	}
</style>
