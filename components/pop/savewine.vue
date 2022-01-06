<template>
	<view class="tips_box">
		<common-pop :customStyle="tipsStyle">
			<view class="tips_info" >
				<view class="tips_header">
					<text>存酒提醒</text> 
				</view>
				<view class="tips_content">
					<view class="tips_content_item">
						<view style="white-space:nowrap;">订单号：</view>
						<text>HF292394239453956496466</text>
					</view>
					<view class="tips_content_item" >
						<view style="white-space:nowrap;">存酒时间：</view>
						<text>2020-05-10 20:00</text>
					</view>
					<view class="tips_content_item" >
						<view style="white-space:nowrap;">存酒数量：</view>
						<text>20瓶</text>
					</view>
					<view class="tips_content_item" >
						<view style="white-space:nowrap;">存酒名称：</view>
						<text>科罗娜: 30瓶、黑桃A: 4瓶 百威: 12瓶 </text>
					</view>
					<view class="tips_content_item" >
						<view style="white-space:nowrap;">存酒人：</view>
						<text>凌风</text>
					</view>
					<view class="tips_content_item" >
						<view style="white-space:nowrap;">联系电话：</view>
						<text>15343233455</text>
					</view>
				</view>
				<view class="tips_btn" @tap="toggleShow"> <text>确认</text> </view>
			</view>
		</common-pop>
	</view>
</template>

<script>
	import commonPop from '@/components/pop/pop.vue'
	export default{
		components:{
			commonPop
		},
		data() {
			return {
				tipsStyle: {
					'top': '30%'
				},
			}
		},
		methods:{
			toggleShow: function(){
				this.$emit('showTap');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tips_info{
		width: calc(100% - 160rpx);
		margin-left: 80rpx;
		background: #FFFFFF;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 30rpx 40rpx;
		.tips_header{
			text-align: center;
			font-size: 34rpx;
			color: #333333;
			font-weight: 500;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #eeeeee;;
			padding-bottom: 25rpx;
			.icon{
				position: absolute;
				right: 0rpx;
			}
		}
		.tips_content{
			display: flex;
			flex-direction: column;
			width:100%;
			font-size: 30rpx;
			color: #666666;
			margin-top: 54rpx;
			.tips_content_item{
				display: flex;
				font-size: 26rpx;
				color: #666666;
				font-weight: 400;
				line-height: 37rpx;
				text-align: left;
				padding-bottom: 16rpx;
				text{
					color: #333333;
				}
			}
		}
		.tips_btn{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 530rpx;
			height: 80rpx;
			background: linear-gradient(270deg,#bb0cf9 -109%, #f92faf 5%);
			border-radius: 45rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #FFFFFF;
			margin-top: 27rpx;
		}
	}
</style>
