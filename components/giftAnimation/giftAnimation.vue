<template>
	<view class="animation_box" v-if="isShow" @tap="hide">
		<view class="img_box">
			<image class="animation_img" :src="gifUrl"></image>
		</view>
	</view>
</template>

<script>
	var timeout = null;
	export default{
		data() {
			return {
				isShow:false,
				gifUrl:'',
			}
		},
		methods:{
			hide(){
				this.isShow = false
				clearTimeout(timeout)
			},
			show(gifUrl){
				console.log("启动礼物动画");
				// this.gifUrl = gifUrl
				// this.isShow = true
				// timeout = setTimeout(()=>{
				// 	this.hide()
				// },5000)
			},
		}
	}
</script>

<style lang="scss">
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

			.close_img {
				height: 54rpx;
				width: 54rpx;
				margin-top: 30rpx;
			}
		}

	}

</style>
