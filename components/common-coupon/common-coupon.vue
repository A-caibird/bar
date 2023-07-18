<template>
	<view class="common-coupon" :data-coupon-full="coupon.full" @tap="clickCoupon">
		<view class="common-coupon-container">
			<view class="left">
				<text class="left-price">￥{{coupon.discountPrice}}</text>
			</view>
			<view class="right">
				<view class="coupon-type">{{coupon.type}}</view>
				<view class="condition">{{ coupon.name }}</view>
				<view class="condition">{{ coupon.introduce }}</view>
				<view class="deadline">{{coupon.canUseDate}}</view>
			</view>
			<view class="use_btn" @tap="$u.throttle(goPage)" v-if="btnShow && status == 'unused'">去使用</view>
			<view class="bottom">
				<view class="desc">{{ coupon.rule ? coupon.rule : '' }}</view>
			</view>
			<view v-if="status === 'used'" class="inside">已使用</view>
			<view v-if="status === 'expired'" class="inside">已过期</view>
		</view>
	</view>
</template>
<script>
	const STATUS_NORMAL = "unused";
	const STATUS_USED = "used";
	const STATUS_TIMEOUT = "expired";

	export default {
		data() {
			return {};
		},
		components: {},
		props: {
			btnShow: {
				type:Boolean,
				default: false,
			},
			status: {
				type: String,
				default: STATUS_NORMAL
			},
			coupon: Object,
			canSelect: {
				type: Boolean,
				default: false
			},
			selected: {
				type: Boolean,
				default: false
			},
			index: {
				type: Number
			}
		},
		methods: {
			goPage: function(){
				let info = this.coupon;
				if(info.type == '酒吧券'){
					uni.navigateTo({
						url: '/pages/club/detail?id=' + info.clubId
					})
				}else{
					uni.navigateTo({
						url: '/pages/club/list?mode=list'
					})
				}
			},
			clickCoupon: function() {
				if (!this.canSelect) {
					return;
				}
				let detail = this.coupon;
				detail = Object.assign({}, detail, {
					selected: this.selected,
				});

				this.$emit('coupon', {
					detail,
					index: this.index
				});
			}
		},
		computed: {},
		watch: {}
	};
</script>
<style lang="scss" scoped>
	.common-coupon {
		width: 100%;
		height: 214rpx;
		margin: 0;
		margin-bottom: 40rpx;
		border-radius: 24rpx;
		background: #212435;
	}

	.common-coupon-container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		align-items: center;
		overflow: hidden;
		
		
		.left {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 220rpx;
			height: 100%;
			color: #fff;
			background: url(/static/imgs/common/left_background.png) no-repeat 0 0 #16192B;
			background-size: 220rpx 214rpx;
			
			.left-price {
				font-size: 48rpx;
				font-weight: bolder;
			}
			
		}
		
		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 320rpx;
			height: 100%;
			font-size: 24rpx;
			color: #fff;
			padding: 16rpx 24rpx;
			
			.condition{
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.deadline {
				color: #979797;
			}
		}
	}

	.use_btn{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		width: 148rpx;
		color: #FFF;
		margin-right: 18rpx;
		background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
		border-radius: 32rpx;
		padding: 12rpx 32rpx;
		line-height: 40rpx;
	}
	.couponBG {
		width: 100%;
		height: 200rpx;
		position: absolute;
		top: 0;
		z-index: 1;

	}

	.coupon-type {
		font-size: 30rpx;
		color: #fff;;
		font-weight: bold;
		margin-bottom: 22rpx;
	}

	.common-coupon .inside {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		width: 148rpx;
		color: rgba(255,255,255,0.5);
		margin-right: 18rpx;
		border: 1rpx solid rgba(255,255,255,0.5);
		border-radius: 32rpx;
		padding: 12rpx 32rpx;
		line-height: 40rpx;
	}
	.icon_select {
		position: absolute;
		width: 32rpx;
		height: 32rpx;
		top: 28rpx;
		right: 36rpx;
		z-index: 100;
	}
</style>
