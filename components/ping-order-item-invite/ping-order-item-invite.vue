<template>
	<view class="ping-order-wrap">
		<view class="order-info">
			<view class="club-name-label-wrap" @tap="$u.throttle(tapGoDetail(info))">
				<!-- <text class="club-name-text">撒的空间卢是卡斯就到了卡教师的教案上课了解到卢卡斯就到了卡机</text> -->
				<view class="club-name">
					<text>{{info.clubName}}</text>
				</view>
				<view class="label-wrap">
					<view class="label">
						<text>拼享</text>
					</view>
				</view>
				
			</view>
			<view class="seat-amount-wrap">
				<view class="seat">
					<text class="text1">台位：</text>
					<text class="text2">{{info.cardTableName}}</text>
				</view>
				<view class="amount">
					<text class="text1">金额：</text>
					<text class="text2">{{info.originalWineCoin}}</text>
				</view>
			</view>
			<view class="date">
				<text class="text1">预约时间：</text>
				<text class="text2">{{info.date}}</text>
			</view>
		</view>
		<view class="select" @tap="$u.throttle(tapSelectOrder)">
			<template v-if="isSelect">
				<image src="/static/imgs/common/select.png" mode=""></image>
			</template>
			<template v-else>
				<image src="/static/imgs/mine/no-select.png" mode=""></image>
			</template>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			info:{
				type:Object,
				default:{},
			},
			isSelect:{
				type: Boolean,
				default: false,
			},
		},
		methods:{
			async tapSelectOrder(){
				this.$emit('selectOrder',{orderInfo:this.info})
			},
			tapGoDetail(info){
				console.log(info)
				if(info.isCreator) {
					this.$u.route('/pages/order/ping-create-detail', {
						orderId: info.id,
					})
				} else {
					this.$u.route('/pages/order/ping-invited-detail', {
						orderId: info.id,
					})
				}
				
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.ping-order-wrap {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		border-radius: 10rpx;
		background: #2C3158;
		box-sizing: border-box;
		padding: 26rpx 30rpx;
		@include height-center();
		.order-info {
			flex:1;
			min-width: 0;
			border-right: 1px dashed #fff;
			.club-name-label-wrap {
				@include height-center();
				.club-name {
					flex: 1;
					text {
						@include ellipsis();
						font-size: 34rpx;
						color: #FFFFFF;
						font-weight: 500;
					}
					
				}
				.label-wrap {
					flex: 1;
					.label {
						@include flex-center();
						width: 70rpx;
						padding: 3rpx 0;
						border: 1px solid #565B86;
						border-radius: 2px;
						text {
							font-size: 26rpx;
							color: #B3BAEF;
						}
						
						
					}
				}
				
			}
			
			.seat-amount-wrap {
				margin-top: 5rpx;
				@include height-center();
				.seat {
					flex: 1;
					@include height-center();
					.text1 {
						color: #B3B3DD;
						font-size: 34rpx;
					}
					.text2 {
						flex: 1;
						min-width: 0;
						
						@include ellipsis();
						color: #fff;
						font-size: 34rpx;
					}
				}
				.amount {
					flex: 1;
					@include height-center();
					.text1 {
						color: #B3B3DD;
						font-size: 34rpx;
					}
					.text2 {
						flex: 1;
						min-width: 0;
						
						@include ellipsis();
						color: #fff;
						font-size: 34rpx;
					}
				}
			}
			.date {
				margin-top: 5rpx;
				@include height-center();
				.text1 {
					color: #B3B3DD;
					font-size: 34rpx;
				}
				.text2 {
					flex: 1;
					min-width: 0;
					
					@include ellipsis();
					color: #fff;
					font-size: 34rpx;
				}
			}
		
		}
		
		.select {
			padding: 0 0 0 30rpx;
			image {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
