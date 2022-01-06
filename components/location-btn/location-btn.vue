<template>
	<view class="location-prap">
		<block v-if="!locationService">
			<view class="location-tip">未打开系统定位服务</view>
			<view class="location-btn" @tap="$u.throttle(openLocationService)">打开定位服务</view>
		</block>
		<block v-else-if="!locationPermission">
			<view class="location-tip">未获取系统定位权限</view>
			<view class="location-btn" @tap="$u.throttle(openLocationPermision)">获取定位权限</view>
		</block>
		<block v-else-if="!getLocationFail">
			<view class="location-tip">获取地址失败</view>
			<view class="location-btn" @tap="$u.throttle(getLocation)">重新获取地址</view>
		</block>
		<block v-else>
			<view class="location-tip">获取地址失败</view>
			<view class="location-btn" @tap="$u.throttle(getLocation)">重新获取地址</view>
		</block>
	</view>
</template>

<script>
	import location from '@/mixins/location.js';
	import $permision from "@/common/permission.js"
	export default {
		mixins: [location], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				
			};
		},
		methods:{
			openLocationService(){
				$permision.openGPSService()
			},
			openLocationPermision(){
				$permision.gotoAppSetting()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.location-prap {
		width: 100%;
		height: 400rpx;
		@include flex-center(column);
		.location-tip {
			margin-bottom: 20rpx;
			color: #B3B3DD;
			font-size: 26rpx;
		}
		.location-btn {
			@include height-center();
			padding-left: 20rpx;
			padding-right: 20rpx;
			height: 60rpx;
			background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
			border-radius: 30rpx;
			color: #FFFFFF;
			font-size: 28rpx;
		}
	}
</style>
