<template>
	<view class="animation_box" v-if="gifUrl !== ''" @tap="close">
		<image class="animation_img"  mode="widthFix" :src="gifUrl"></image>
		<!-- <view class="animation_img" v-if="showImg" @tap="close">
		    <l-svga :src="gifUrl"></l-svga>
		</view> -->
	</view>
</template>

<script>
	var timeout = null;
	export default {
		data() {
			return {
				gifUrl: '',
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
				this.clearTimeout();
				this.gifUrl = '';
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
