<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="反馈与帮助" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }"
			 :border-bottom="false"></u-navbar>
		</view>
		<view class="first_part">
			<view class="items" @tap="$u.throttle($u.route('/pages/feedback/feedback'))">
				<text>意见与反馈</text>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
			</view>
			<view class="items" @tap="$u.throttle($u.route('/pages/common-problem/common-problem'))">
				<text>常见问题</text>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
			</view>
			
		</view>
	</view>
</template>

<script>
	var app = getApp();
	export default{
		data() {
			return {

			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		
	}

	.first_part {
		margin: 30rpx 30rpx 614rpx 30rpx;
	}

	.first_item {
		width: 100%;
		height: 42rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&>text {
			font-size: 30rpx;
			color: #ffffff;
		}

		&>image {
			width: 12rpx;
			height: 20rpx;
		}
	}

	.items {
		width: 100%;
		height: 42rpx;
		margin-top: 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&>text {
			font-size: 30rpx;
			color: #ffffff;
		}

		&>image {
			width: 12rpx;
			height: 20rpx;
		}
	}

	.second_part {
		margin-top: 60rpx;

		&>button {
			width: 690rpx;
			height: 90rpx;
			color: #ffffff;
			font-size: 30rpx;
			line-height: 90rpx;
			background: linear-gradient(270deg, #BB0CF9, #F92FAF);
			border-radius: 49px;
		}
	}
</style>
