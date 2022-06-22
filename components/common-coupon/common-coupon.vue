<template>
	<view class="common-coupon" :data-coupon-full="coupon.full" @tap="clickCoupon">
		<view class="common-coupon-container">
			<view class="left">
				<view class="left-content">
					<text class="left-price">{{coupon.discountPrice}}</text>
				</view>
			</view>
			<view class="right">
				<view class="info-wrapper" :class="{'fixedWidth': btnShow && status == 'unused'}">
					<view class="coupon-type">{{coupon.type}}</view>
					<view class="condition">{{ coupon.name }}</view>
					<view class="condition" style="margin: 10rpx 0rpx;">{{ coupon.introduce }}</view>
					<view class="deadline">{{coupon.canUseDate}}</view>
				</view>
			</view>
			<view class="use_btn" @tap="$u.throttle(goPage)" v-if="btnShow && status == 'unused'">去使用</view>
			<view class="bottom">
				<view class="desc">{{ coupon.rule ? coupon.rule : '' }}</view>
			</view>
			<view class="circle circle-l"></view>
			<view class="circle circle-r"></view>
			<view v-if="status !== 'unused'" class="chapter">
				<view v-if="status === 'used'" class="inside">已使用</view>
				<view v-if="status === 'expired'" class="inside">已过期</view>
			</view>
			<block v-if="canSelect">
				<image class="icon_select" :src="selected ? '/static/imgs/common/select.png' : '/static/imgs/common/no-select.png'"></image>
			</block>
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
		width: calc(100% - 40upx);
		height: 200upx;
		margin: auto;
		margin-bottom: 40upx;
	}

	.common-coupon-container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		// background-image: url("http://vverp1.oss-cn-shanghai.aliyuncs.com/bg_discount.png");
		background-image: url(https://tuyishop.oss-cn-hangzhou.aliyuncs.com//upload/image/202105/b06cd323-c4fa-4d70-a4db-c138b17f3236.png);
		background-size: 100% 100%;
		overflow: hidden;
		.info-wrapper{
			width: initial;
			&.fixedWidth{
				width: 360rpx;
			}
			.condition{
				width: 100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}

	.left {
		width: 200rpx;
		color: #EC3A3A;
		text-align: center;
	}

	.left-price {
		font-size: 30px;
		font-weight: bolder;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.right {
		flex: 1;
		// width: 75%;
		// margin-right: 80upx;
		font-size: 24upx;
		// color: #666666;
		color: #EC3A3A;
	}
	.use_btn{
		line-height: 50rpx;
		padding: 0 10rpx;
		border: 1px solid #EC3A3A;
		font-size: 24rpx;
		color: #EC3A3A;
		border-radius: 30rpx;
		margin-right: 30rpx;
	}
	.couponBG {
		width: 100%;
		height: 200upx;
		position: absolute;
		top: 0;
		z-index: 1;

	}

	.coupon-type {
		font-size: 15px;
		// color: #323232;
		color: #EC3A3A;
		font-weight: bold;
		margin-bottom: 8upx;
	}

	.common-coupon .chapter {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		right: -80upx;
		bottom: -80upx;
		width: 240upx;
		height: 240upx;
		border: 4upx solid #cdcdcd;
		border-radius: 100%;
		transform: rotate(-45deg);
	}

	.common-coupon .inside {
		padding-top: 45upx;
		box-sizing: border-box;
		width: 212upx;
		height: 212upx;
		text-align: center;
		border: 1upx solid #cdcdcd;
		border-radius: 100%;
		font-size: 36upx;
		color: #cdcdcd;
	}
	.icon_select {
		position: absolute;
		width: 32upx;
		height: 32upx;
		top: 28upx;
		right: 36upx;
		z-index: 100;
	}
</style>
