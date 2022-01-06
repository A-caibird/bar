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
		beforeCreate() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
			// #endif
		},
		onLoad() {
			this.$nextTick(function(){
				uni.redirectTo({
					url:'/pages/snatch-record/snatch-record'
				})
			})
			
		},
		
		
	}
</script>

<style>

</style>
