<template>
	<view>
		<video :src="videoPlayUrl" v-if="videoPlayUrl" :direction="0" @fullscreenchange.stop="fullScreenChange" class="videoBox" id="videoId"></video>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				videoPlayUrl: '',
			}
		},
		methods:{
			fullScreenChange(e){
				if(!e.detail.fullScreen){
					var videoContext = uni.createVideoContext("videoId", this);
					videoContext.stop()
					this.videoPlayUrl = "";
				}
			},
			videoPlayTap(url){
				this.videoPlayUrl = url;
				var vm = this;
				this.$nextTick(function(){
					var videoContext = uni.createVideoContext("videoId", vm);
					videoContext.requestFullScreen({
						direction: 0
					});
					videoContext.play()
				})
			},
			stopVideoTap(){
				console.log('stopVideoTap');
				var videoContext = uni.createVideoContext("videoId", vm);
				videoContext.exitFullScreen();
				videoContext.stop()
				this.videoPlayUrl = "";
			}
		}
	}
</script>

<style scoped>
	.videoBox{
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		z-index: -1;
		height: 100vh;
		width: 100%;
		opacity: 0;
	}
</style>
