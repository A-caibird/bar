<template>
	<view class="animation_box" @tap="hide">
		<image class="animation_img" mode="widthFix" :src="gifUrl"></image>
	</view>
</template>

<script>
	var timeout = null;
	export default {
		data() {
			return {
				gifUrl: '',
				sendInfo: '',
			}
		},
		onLoad(opt) {
			this.gifUrl = opt.gifUrl
			// this.sendInfo = opt.sendInfo
			timeout = setTimeout(()=>{
				console.log('关闭礼物页面')
				uni.navigateBack()
			}, 6000)
		},
		methods: {
			clearTimeout() {
				if(timeout){
					clearTimeout(timeout)
				}
			},
			hide() {
				// uni.navigateBack()
				this.clearTimeout()
				uni.redirectTo({
					url: '/pages/info/gift'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}
	.animation_img {
		position: fixed;
		z-index: 1000;
		top: 50%;
		left: 0rpx;
		width: 100%;
		transform: translateY(-50%);
	}
</style>
