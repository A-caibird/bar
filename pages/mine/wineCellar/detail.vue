<template>
	<view class="container">
		<view class="header-box">
			<u-navbar :is-fixed="true" :isBack="true" :background="{
				'background': '#16192B'
			}" :titleColor="'#ffffff'" :title="headTitle" :borderBottom="false" back-icon-color="#FFFFFF">
			</u-navbar>
		</view>
		<view class="tag-select">
			<view class="tag" :class="{'active':currentIndex === 0 }" @tap="tapSelect(0)">可使用({{}})</view>
			<view class="tag" :class="{'active':currentIndex === 1 }" @tap="tapSelect(1)">已经过期({{}})</view>
		</view>
		<template v-if="currentIndex === 0">
			<view class="detail-area">
				
			</view>
		</template>
		<template v-if="currentIndex === 1">
			<view class="detail-area">
				
			</view>
		</template>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				headTitle: '',
				currentIndex: 0
			}
		},
		onLoad(option) {
			this.headTitle = '酒库-' + option.title;
		},
		methods:{
			tapSelect(num)
			{
				this.currentIndex=num;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.adjust-location1 {}

	.adjust-location2 {}

	.container {
		width: 100%;
		padding: 0 40rpx;

		.tag-select {
			margin: 40rpx auto; //上下边距
			display: flex;
			flex-direction: row;
			// position: relative;
			// left: 13%;
			gap: 200rpx;

			.tag {
				// transition: ;
				color: #979797;
				position: relative;
				&.active {
					color: #FFF;
					&::after {
						content: "";
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						width: 100rpx;
						height: 100rpx;
						background: #832DFF; // 模糊字体背景颜色
						transform: translateZ(0);
						filter: blur(10rpx);
						border-radius: 50%;
						z-index: -1;
					}

					&::after {
						content: "";
						position: absolute;
						top: 50rpx;
						left: 24%;
						width: 40rpx;
						height: 4rpx;
						background: #FFFFFF;
						border-radius: 3rpx;
						opacity: 0.2;
						transform: translateZ(0);
					}
				}
			}
		}
		
		.detail-area{
			width: 686rpx;
			height: 586rpx;
			background: rgba(255,255,255,0.05);
			border-radius: 16rpx;
		}
		
	}
</style>