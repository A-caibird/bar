<template>
	<view class="video_box">
		<u-image width="100%" height="100%" class="dy_img" :src="videoCover" @click="$u.throttle(videoPlayTap)"></u-image>
		<image @tap.stop="$u.throttle(videoPlayTap)" class="play_icon" src="/static/imgs/common/play_icon.png" :style="{'height': (iconHeight + 'rpx'), 'width': (iconHeight + 'rpx')}"></image>
	</view>
</template>

<script>
	var footerImgUrl = '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast';
	import uImage from 'uview-ui/components/u-image/u-image.vue'
	export default {
		components:{
			uImage
		},
		props:{
			iconHeight: {
				type: Number,
				default: 140
			},
			src: String,
		},
		data() {
			return {
				videoCover: '',
				playUrl: '',
			}
		},
		watch: {
			src(newValue) {
				this.getVideoConver(newValue)
			}
		},
		mounted() {
			this.getVideoConver(this.src);
		},
		methods: {
			videoPlayTap(){
				this.$emit('videoPlayTap', {
					src: this.src
				})
			},
			getVideoConver(src){
				this.videoCover = src + footerImgUrl;
			}
		}
	}
</script>

<style lang="scss">
	.video_box{
		position: relative;
		height: 100%;
		width: 100%;
		.play_icon{
			position: absolute;
			left: 50%;
			top: 50%;
			z-index: 10;
			transform: translate(-50%, -50%);
		}
	}
</style>
