<template>
	<view class="car_goods_panel">
		<view class="car_goods_info">
			<view class="click_view"></view>
			<image class="car_goods_img" :src="info.commodity.cover"></image>
			<view class="car_goods_right">
				<view class="car_goods_name">{{info.commodity.name}}</view>
				
				<view class="price_quantity">
					<view class="price_panel" v-if="type == 'shopping'">
						<text>{{info.amount}}元</text>
					</view>
					<view class="price_panel" v-if="type == 'adding'">
						<text>{{info.commodityPrice}}元</text>
					</view>
					<view class="quantity_panel">
						<self-number-box :min="0" color="#FFFFFF" size="26" inputHeight="35" inputWidth="50" :value="info.buyNum" @plus="handlePlus" @minus="handleMinus" :longPress="false"></self-number-box>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom_line" v-if="!noBorder"></view>
	</view>
</template>

<script>
	import selfNumberBox from '@/components/self-number-box/self-number-box.vue'
	export default {
		components:{
			selfNumberBox
		},
		props: {
			noBorder: {
				type: Boolean,
				default: false
			},
			info:{
				type:Object,
				default:{},
			},
			type: {
				type: String,
				default: 'shopping',
			}
		},
		data() {
			return {

			}
		},
		mounted() {
			
		},
		methods: {
			handlePlus(){
				this.$emit('plus')
			},
			handleMinus(){
				this.$emit('minus')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.car_goods_panel {
		width: 100%;
		height: 222rpx;
		background: #2C3158;
		.bottom_line{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			height: 2rpx;
			background: #373E6E;
		}
		.car_goods_info {
			width: 100%;
			background: #2C3158;
			display: flex;
			align-items: center;
			height: 220rpx;
			box-sizing: border-box;
			padding: 30rpx;
			box-sizing: border-box;
			position: relative;
			.click_view {
				position: absolute;
				height: 100%;
				width: calc(100% - 200rpx);
				left: 0rpx;
				top: 0rpx;
				z-index: 10;
				background: #007AFF;
				opacity: 0;
			}

			.car_goods_img {
				height: 160rpx;
				width: 160rpx;
				border-radius: 8rpx;
			}

			.car_goods_right {
				height: 160rpx;
				width: calc(100% - 180rpx);
				margin-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.car_goods_name {
					width: 100%;
					line-height: 36rpx;
					font-size: 30rpx;
					color: #FFFFFF;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.price_quantity {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.price_panel {
						width: 100%;
						overflow: hidden;
						font-size: 32rpx;
						color: #FFFFFF;
					}

					.quantity_panel {	
						border-radius: 4rpx;
						margin-top: 10rpx;
					}
				}
			}
		}
	}
</style>
