<template>
	<view class="tips_box">
		<common-pop :customStyle="tipsStyle">
			<view class="tips_info">
				<view class="tips_header"> 
					<text>实名认证</text> 
					<view class="icon">
						<u-icon name="close"></u-icon>
					</view>
				</view>
				<view class="tips_content"> 
					<text>您当前还没有认证\n认证了才能下单</text> 
				</view>
				<view class="tips_btn"> <text>去认证</text> </view>
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
				}
			}
		},
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
			.icon{
				position: absolute;
				right: 0rpx;
			}
		}
		.tips_content{
			width:100%;
			font-size: 30rpx;
			color: #666666;
			text-align: center;
			margin-top: 54rpx;
		}
		.tips_btn{
			width:100%;
			height: 80rpx;
			background: #733CFF;
			color: #FFFFFF;
			text-align: center;
			line-height: 80rpx;
			font-size: 30rpx;
			border-radius: 40rpx;
			margin-top: 54rpx;
		}
	}
</style>
