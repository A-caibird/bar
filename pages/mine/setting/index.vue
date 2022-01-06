<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="个人设置" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }"
			 :border-bottom="false"></u-navbar>
		</view>
		<view class="first_part">
			<view class="first_item" @tap="$u.throttle($u.route('/pages/mine/setting/account'))">
				<text>账号与安全</text>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
			</view>
			<!-- <view class="items" @tap="$u.route('/pages/mine/notifySetting/notifySetting')">
				<text>通知设置</text>
				<image src="/static/imgs/mine/common_right.png"  mode=""></image>
			</view> -->
		<!-- 	<view class="items" @tap="$u.throttle($u.route('/pages/feedbackHelp/feedbackHelp'))">
				<text>反馈与帮助</text>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
			</view> -->
			<!-- <view class="items" @tap="$u.throttle(goArticle('protocol'))">
				<text>用户协议</text>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
			</view> -->
			<view class="items" @tap="$u.throttle($u.route('/pages/mine/setting/yinsi'))">
				<text>隐私设置</text>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
			</view>
			<view class="second_part" @tap="logOut"><button type="default">退出登录</button></view>
		</view>
	</view>
</template>

<script>
	import logout from '@/utils/logout/index.js'
	var app = getApp();
	export default{
		data() {
			return {

			}
		},
		methods:{
			logOut: function(){
				logout()
			}
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
