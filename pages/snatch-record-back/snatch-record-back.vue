<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		beforeCreate() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('landscape-primary'); //锁死屏幕方向为竖屏
			// #endif
		},
		onLoad() {
			uni.navigateBack()
		},
	}
</script>

<style>

</style>
