<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="收支记录" title-size="36" title-color="#FFFFFF" :background="{'background': 'rgba(0,0,0,0)'}"
		 :border-bottom="false">
		</u-navbar>
		<view class="content-title">
			<view class="content-dynamic" :class="{active:currentIndex === 0 }" @tap="select(0)">收入</view>
			<view class="content-dynamic" :class="{active:currentIndex === 1 }" @tap="select(1)">支出</view>
		</view> 
		<view class="swiper-container">
			<swiper @animationfinish="change" class="swiper-box" :current="currentIndex">
				<swiper-item>
					<revenue-record-list :type="'income'" ref="revenue-record-list" :i="0" :index="currentIndex"></revenue-record-list>
				</swiper-item>
				<swiper-item>
					<revenue-record-list :type="'expenditure'" ref="revenue-record-list" :i="0" :index="currentIndex"></revenue-record-list>
				</swiper-item>
			</swiper>
		</view>
		<!-- <view class="swiper-container">
			<swiper @animationfinish="change" :current="currentIndex">
				<swiper-item>
					<revenue-record-list :type="'expenditure'" ref="revenue-record-list" :i="0" :index="currentIndex"></revenue-record-list>
				</swiper-item>
			</swiper>
		</view> -->
		

	</view>
</template>

<script>
	// import rechargeRecord from '@/components/rechargeRecord-item/rechargeRecord-item.vue'
	export default {
		
		components: {
			// rechargeRecord
		},
		data() {
			return {
				currentIndex: 0,
			}
		},
		onLoad() {
			
		},
		methods: {
			select: function(e) {
				this.currentIndex = e
			},
			change(e) {
				const {current} = e.detail
				this.currentIndex = current
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
			
			.content-title {
				display: flex;
				align-items: center;
				width: 100%;
				height: 50rpx;
				color: #B7B9D6;
				font-size: 30rpx;
				margin-top: 30rpx;
				margin-bottom: 60rpx;
					
				.content-dynamic {
					position: relative;
					margin: 0 30rpx;
					
					&.active {
						font-size: 34rpx;
						color: #FFFFFF;
					
						&:after {
							content: "";
							position: absolute;
							bottom: -10rpx;
							left: 10rpx;
							width: 50rpx;
							height: 6rpx;
							background: #FF59C9;
							border-radius: 3rpx;
						}
					
					
					}
					
				}
			}
					
			.swiper-container {
				flex: 1;
				min-width: 0;
				min-height: 0;
				swiper {
					height: 100%;
					swiper-item {
						height: 100%;
					}
				}	
				
					
					
			}
					
		}
		
	}
	
	
	
</style>
