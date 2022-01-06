<template>
	<view class="tips_box">
		<common-pop :customStyle="tipsStyle">
			<view class="tips_info">
				<view class="tips_header"> <text>青少年提醒</text> </view>
				<view class="tips_content"> 
					<text>本软件为酒吧服务软件，请确定您已满18周岁。根据相关法律法规未成人禁止进入酒吧场所</text> 
				</view>
				<view class="tips_btn"> <text>我知道了</text> </view>
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
		}
		.tips_content{
			width:100%;
			font-size: 30rpx;
			color: #666666;
			text-align: center;
			margin-top: 56rpx;
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
