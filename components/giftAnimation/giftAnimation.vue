<template>
	<view class="animation_box">
		<image v-if="showImg" class="animation_img" mode="widthFix" :src="gifUrl" @tap="close"></image>
	</view>
</template>

<script>
	var timeout = null;
	export default {
		data() {
			return {
				gifUrl: '',
				showImg: false,
			}
		},
		methods: {
			show(gifUrl){
				if(timeout){
					clearTimeout(timeout);
				}
				this.gifUrl = gifUrl;
				this.showImg = true;
				this.$nextTick(() => {
					timeout = setTimeout(()=>{
						console.log('关闭礼物弹窗')
						this.showImg = false;
					}, 6000)
				})
			},
			clearTimeout() {
				if(timeout){
					clearTimeout(timeout)
				}
			},
			close() {
				// uni.navigateBack()
				this.clearTimeout()
				this.showImg = false;
			},
		}
	}
</script>

<style lang="scss">
	.animation_img {
		position: fixed;
		z-index: 1001;
		top: 50%;
		left: 0rpx;
		width: 100%;
		transform: translateY(-50%);
	}
</style>
