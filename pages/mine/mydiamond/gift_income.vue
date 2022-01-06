<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="礼物收入" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false"></u-navbar>
		<!-- <view class="content-title">
			<view class="title" :class="{ active: currentIndex === 0 }" @tap="select(0)">收到</view>
			<view class="title" :class="{ active: currentIndex === 1 }" @tap="select(1)">送出</view>
		</view> -->
		<view class="swiper-container">
			<swiper class="swiper-box" @animationfinish="change" :current="currentIndex">
				<swiper-item>
					<gift-payments-list :isSend="false" ref="gift-payments-list" :i="0" :index="currentIndex"></gift-payments-list>
				</swiper-item>
				<!-- <swiper-item>
					<gift-payments-list :isSend="true" ref="gift-payments-list" :i="1" :index="currentIndex"></gift-payments-list>
				</swiper-item> -->
			</swiper>
		</view>
		
	</view>
</template>

<script>

export default {
	
	components: {
		// diamond
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
			this.currentIndex = e;
			
		},
		change(e){
			 const { current } = e.detail;
			 this.currentIndex = current;
		
		},
		
	}
	

};
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		.container {
			height: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			.content-title {
				display: flex;
				align-items: center;
				margin-top: 33rpx;
				height: 48rpx;
				margin-bottom: 67rpx;
			
				.title {
					font-size: 30rpx;
					color: #b7b9d6;
					margin: 0 30rpx;
					position: relative;
			
					&.active {
						font-size: 34rpx;
						color: #ffffff;
			
						&:after {
							content: '';
							bottom: -7rpx;
							left: 17rpx;
							position: absolute;
							width: 34rpx;
							height: 4rpx;
							background: #ff59c9;
							border-radius: 2rpx;
						}
					}
				}
			}
			
			.swiper-container {
				flex: 1;
				min-width: 0;
				min-height: 0;
				.swiper-box {
					height: 100%;
					width: 100%;
				}	
				
					
					
			}
		}
	}
	
	
</style>
