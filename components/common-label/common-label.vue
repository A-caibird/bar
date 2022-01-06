<template>
	<view class="common_label">
		<view class="label_left" v-if="showLeft">
			<view class="line"></view>
			<text>{{leftText}}</text>
		</view>
		<view class="label_right" @tap="rightTap" v-if="showRight">
			<text>{{rightText}}</text>
			<image src="/static/imgs/common/right.png"></image>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			leftText: String,
			rightText: String,
			showLeft: {
				type: Boolean,
				default: true
			},
			showRight: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
				
			}
		},
		methods:{
			rightTap: function(){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.common_label{
		height: 100rpx;
		width: 100%;
		box-sizing: border-box;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		
		.label_left{
			display: flex;
			align-items: center;
			font-size: 32rpx;
			color: #FFFFFF;
			font-weight: 500;
			.line{
				height: 32rpx;
				width: 6rpx;
				background: #FF59C9;
				margin-right: 14rpx;
			}
		}
		.label_right{
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: #BDC0DA;
			&>image{
				height: 22rpx;
				width: 14rpx;
				margin-left: 16rpx;
			}
		}
	}
</style>
