<template>
	<view class="countTips_box">
		<view class="tips_text">
			<text>{{text}}</text>
		</view>
		<view class="deretion_box"></view>
	</view>
</template>

<script>
	export default {
		props: {
			text: String,
		}
	}
</script>

<style lang="scss">
	.countTips_box{
		position: relative;
		padding-bottom: 20rpx;
		display: inline-block;
		width: auto;
	}
	.tips_text{
		height: 60rpx;
		line-height: 60rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		background: #7A67C4;
		font-size: 22rpx;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #FFFFFF;
		letter-spacing: 2rpx;
		white-space: nowrap;
	}
	.deretion_box{
		height: 20rpx;
		width: 36rpx;
		border-top: 20rpx solid #7A67C4;
		border-right: 36rpx solid transparent;
		position: absolute;
		bottom: 0rpx;
		right: 30rpx;
	}
</style>
