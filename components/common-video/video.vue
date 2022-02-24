<template>
	<view class="video_box" :class="{'show': videoPlayUrl}">
		<video :controls="false" :src="src" :enable-progress-gesture="false" v-if="videoPlayUrl" :direction="0" @fullscreenchange="fullScreenChange" class="videoBox" id="videoId">
			<cover-view class="screen_panel" @tap="stopVideoTap"></cover-view>
		</video>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				videoPlayUrl: '',
				src: ''
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
				console.log(url);
				this.videoPlayUrl = url;
				setTimeout(() => {
					var vm = this;
					this.src = url;
					this.$nextTick(function(){
						var videoContext = uni.createVideoContext("videoId", vm);
						// 	videoContext.requestFullScreen({
						// 		direction: 0
						// 	});
						videoContext.play()
					})
				},300)
				
			},
			stopVideoTap(){
				var videoContext = uni.createVideoContext("videoId", this);
				videoContext.stop()
				this.videoPlayUrl = "";
			}
		}
	}
</script>

<style scoped>
	.video_box{
		position: fixed;
		height: 100vh;
		width: 100%;
		top: 0rpx;
		left: 0rpx;
		z-index: -1;
	}
	.video_box.show{
		z-index: 300;
	}
	.videoBox{
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		z-index: 300;
		height: 100vh;
		width: 750rpx;
		opacity: 1;
	}
	.screen_panel{
		height: 100vh;
		width: 750rpx;
		z-index: 300;
	}
</style>
