<template>
	<view></view>
</template>

<script>
	const app = getApp();
	export default{
		beforeCreate() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
			// #endif
		},
		onLoad:function(){
			
			let token = this.$storage.getLoginToken();
			console.log('token：'+token);
			if(token){
				app.globalData.token = token;
				app.globalData.authorized = true;
				uni.reLaunch({
					url: '/pages/index/index' + `?maskShow=true`
				})
			}else{
				app.globalData.token = "";
				app.globalData.authorized = false;
				// uni.reLaunch({
				// 	url: '/pages/login/login'
				// })
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style>
</style>
