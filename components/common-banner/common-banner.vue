<template>
	<view class="swiper_box" :style="{'height': height + 'rpx'}" v-if="bannerList.length>1">
		<swiper class="banner_swiper"  duration="500" interval="3000" :autoplay="true" :circular="true" indicator-dots indicator-active-color="#eaedf0" indicator-color="#7b597e">
			<swiper-item v-for="(item, index) in bannerList">
				<block v-if="showVideo && item[videoKey]">
					<view class="video_replace_item">
						<common-video :src="item[videoKey]" @videoPlayTap="videoPlayHandle"></common-video>
					</view>
				</block>
				<block v-else>
					<u-image :src="item[imgKey]" :height="height" @click="previewTap(item[imgKey])"></u-image>
				</block>
			</swiper-item>
		</swiper>
		<videoBox ref="videoBox"></videoBox>
	</view>
	<view class="swiper_box":style="{'height': height + 'rpx'}" v-else-if="bannerList.length == 1">
		<block v-if="showVideo && item[videoKey]">
			<common-video :src="item[videoKey]" @videoPlayTap="videoPlayHandle"></common-video>
		</block>
		<image v-else :src="bannerList[0][imgKey]" @tap="previewTap(bannerList[0][imgKey])"></image>
		
	</view>
	<view v-else class="swiper_box" :style="{'height': height + 'rpx'}"></view>
</template>

<script>
	import commonVideo from '@/components/common-video/common-video.vue'
	import videoBox from '@/components/common-video/video.vue'
	export default {
		components: {
			commonVideo,
			videoBox
		},
		props:{
			imgKey:String,
			bannerList: Array,
			height: {
				type: String|Number,
				default: '400' //单位 rpx
			},
			videoKey: String,
			showVideo: {
				type: Boolean,
				default: false 
			}
		},
		methods:{
			videoPlayHandle(e){
				this.$refs.videoBox.videoPlayTap(e.src);
			},
			previewTap(url){
				let imgs = [];
				let imgKey = this.imgKey
				this.bannerList.forEach((item, index) => {
					if(item[imgKey]){
						imgs.push(item[imgKey]);
					}
				})
				uni.previewImage({
					urls: imgs,
					current: url
				})
			}
		}
	}
</script>

<style lang="scss">
	.swiper_box {
		width: 100%;
		.banner_swiper {
			width: 100%;
			height: 100%;
			overflow: hidden;
	
			.swiper_item {
				height: 100%;
				width: 100%;
			}
	
			.video_replace_item {
				height: 100%;
				width: 100%;
				position: relative;
	
				.video_img {
					height: 100%;
					width: 100%;
				}
	
				.play_icon {
					height: 100rpx;
					width: 100rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					z-index: 10;
				}
			}
		}
	}
</style>
