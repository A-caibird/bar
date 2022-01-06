<template>
	<view class="record-container">
		<view class="record-item">
			<view class="gift-img">
				<image :src="info.giftImgUrl"></image>
			</view>
			<view class="record-detail">
				<text class="title">{{ info.title }}</text>
				<text class="time">{{ info.time }}</text>
			</view>
			<view class="record-count">
				<text>+{{ info.diamond }}钻石</text>
			</view>
		</view>
		
		<u-gap height="1" bg-color="#31345B" margin-top="43"></u-gap>
	</view>
	
</template>

<script>
	
	export default {
		props:{
			info:{
				type:Object,
				default:{}
			}
		},
		data() {
			return {
				
			};
		},
		
		
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
.container {
	.record-container {
		padding-left: 30rpx;
		padding-right: 30rpx;
		padding-top: 43rpx;
		.record-item {
			display: flex;
			.gift-img {
				padding-right: 37rpx;
				image {
					width: 55rpx;
					height: 86rpx;
				}
			}
			.record-detail {
				flex: 1;
				min-width: 0;
				display: flex;
				flex-direction: column;
				.title {
					font-size: 30rpx;
					color: #ffffff;
					@include ellipsis();
				}
				.time {
					margin-top: 11rpx;
					font-size: 24rpx;
					color: #9292ba;
				}
			}
			.record-count {
				font-size: 30rpx;
				color: #ffffff;
			}
		}
		
	}
	
}
</style>
