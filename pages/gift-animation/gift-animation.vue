<template>
	<view class="animation_box" @tap="hide">
		<view class="img_box">
			<image class="animation_img" :src="gifUrl"></image>
			<text class="send-text">{{sendInfo}}</text>
		</view>
	</view>
</template>

<script>
	var timeout = null;
	export default{
		data() {
			return {
				gifUrl:'',
				sendInfo:'',
			}
		},
		onLoad(opt) {
			this.gifUrl = opt.gifUrl
			this.sendInfo = opt.sendInfo
			// timeout = setTimeout(()=>{
			// 	this.hide()
			// },5000)
		},
		methods:{
			clearTimeout(){
				clearTimeout(timeout)
			},
			hide(){
				// this.clearTimeout()
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}

	.animation_box {
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.2);
	
		.img_box {
			position: absolute;
			top: 26%;
			left: 50%;
			transform: translateX(-50%);
	
			display: flex;
			flex-direction: column;
			align-items: center;
	
			.animation_img {
				height: 440rpx;
				width: 440rpx;
			}
	
			.send-text {
				margin-top: 30rpx;
				color: #FFF;
				font-size: 30rpx;
			}
		}
	
	}
	
</style>
