<template>
	<view class="scan_box">
		<view class="coupon_content">
			<view class="coupon_box" v-if="couponInfo">
				<view class="left">
					<view class="left-content">
						<block v-if="couponInfo.discountType == 'REBATE'">
							<text class="left-price">{{couponInfo.discountPrice}}</text>
						</block>
						<block v-else-if="couponInfo.discountType == 'DISCOUNT'">
							<text class="left-price">{{couponInfo.discountPrice}}折</text>
						</block>
						<block v-else>
							<text class="left-price">{{couponInfo.priceExpression}}</text>
						</block>
						<!-- <text>元</text> -->
					</view>
				</view>
				<view class="right">
					<view class="info-wrapper">
						<view class="coupon-type">{{typeConver(couponInfo.effectiveRange)}}</view>
						<view class="condition">{{ couponInfo.name }}</view>
						<view class="deadline">{{ formatTime(couponInfo.beginDate) }} - {{ formatTime(couponInfo.endDate) }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="receiveBtn" @tap="givecoupon"> <text>立即领取</text> </view>
		<image @tap="cancelTap" class="cance_icon" src="https://vverp1.oss-cn-shanghai.aliyuncs.com//upload/image/202007/52743340-780d-43cb-ab31-5da8c7a7f02d.png"></image>
	</view>
</template>

<script>
	import commonCoupon from '@/components/common-coupon/common-coupon.vue'
	const dateUtil = require('@/utils/date.js');
	export default {
		props:{
			couponInfo: Object,
		},
		components: {
			commonCoupon
		},
		methods:{
			givecoupon: function() {
				this.$api.giveCoupon2(this.couponInfo.id).then(res => {
					this.$emit('receiveHandle')
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: "none"
					});
				})
			},
			typeConver: function(type){
			 	return this.$convert.couponConvert(type);
			},
			formatTime: function(number) {
				if(number){
					return dateUtil.formatTime(number, 'Y/M/D')
				}
				else{
					return '';
				}
				
			},
			cancelTap:function(){
				this.$emit('cancelTap');
			}
		}
	}
</script>

<style lang="scss" scoped>
	$couponImg:'https://vverp1.oss-cn-shanghai.aliyuncs.com//upload/image/202008/509e0909-48ae-461a-955e-8ffc194fde8c.png';

	.scan_box {
		width: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		position: fixed;
		left: 0rpx;
		top: 30%;
		z-index: 1000;

		.coupon_content {
			height: 530rpx;
			width: 727rpx;
			background-image: url($couponImg);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-origin: content-box;
			.coupon_box{
				position: absolute;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				overflow: hidden;
				height: 204rpx;
				width: 520rpx;
				left: 126rpx;
				top: 184rpx;
				.left{
					width: 35%;
					color: #EC3A3A;
					margin-left: 60upx;
					.left-price {
						font-size: 30px;
						font-weight: bolder;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						display: block;
					}
				}
				.right{
					width: 75%;
					font-size: 24upx;
					color: #666666;
					.coupon-type {
						font-size: 15px;
						color: #323232;
						font-weight: bold;
						margin-bottom: 16upx;
					}
					.condition{
						font-size: 24rpx;
						color: #707172;
						line-height: 40rpx;
						
					}
				}
			}
		}
		.receiveBtn{
			height: 90rpx;
			width: 410rpx;
			line-height: 90rpx;
			text-align: center;
			background: #D4AA7A;
			color: #FFFFFF;
			font-size: 36rpx;
			border-radius: 50rpx;
		}
		.cance_icon{
			height: 76rpx;
			width: 76rpx;
			margin-top: 30rpx;
		}
	}
</style>
