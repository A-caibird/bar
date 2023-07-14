<template>
	<view class="swiper_box" :style="{'height': height + 'rpx'}" v-if="bannerList.length>1">
		<swiper class="banner_swiper" duration="500" interval="3000" :autoplay="autoplay" :circular="true"
			indicator-dots indicator-active-color="#FFF" indicator-color="rgba(255, 255, 255, 0.5)">
			<swiper-item v-for="(item, index) in bannerList">
				<block v-if="showVideo && item[videoKey]">
					<view class="video_replace_item">
						<common-video :src="item[videoKey]" @videoPlayTap="videoPlayHandle"></common-video>
					</view>
				</block>
				<block v-else>
					<u-image :src="item[imgKey]" :height="height" @click="imgTap(index)"></u-image>
				</block>
			</swiper-item>
		</swiper>
		<videoBox ref="videoBox" v-if="mode == 'enlarge'"></videoBox>
		<video id="swiperVideo" class="video_play_box" :autoplay="true" @pause="colseVideo" @ended="colseVideo"
			v-if="playVideoUrl" :src="playVideoUrl"></video>
	</view>
	<view class="swiper_box" :style="{'height': height + 'rpx'}" v-else-if="bannerList.length == 1">
		<block v-if="showVideo && item[videoKey]">
			<common-video :src="item[videoKey]" @videoPlayTap="videoPlayHandle"></common-video>
		</block>
		<image v-else :src="bannerList[0][imgKey]" @tap="imgTap(0)"></image>
		<videoBox ref="videoBox" v-if="mode == 'enlarge'"></videoBox>
		<video id="swiperVideo" class="video_play_box" :autoplay="true" @pause="colseVideo" @ended="colseVideo"
			v-if="playVideoUrl" :src="playVideoUrl"></video>
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
		props: {
			imgKey: String,
			bannerList: Array,
			height: {
				type: String | Number,
				default: '280' //单位 rpx
			},
			videoKey: String,
			showVideo: {
				type: Boolean,
				default: false
			},
			mode: {
				type: String,
				default: 'enlarge', // enlarge: 放大模式，// normal:正常模式
			},
			customEvent: {
				type: Boolean,
				default: false
			}

		},
		data() {
			return {
				autoplay: true,
				playVideoUrl: '',
			}
		},
		methods: {
			//图片点击
			imgTap(index) {
				if (this.customEvent) {
					this.$emit('click', {
						mode: 'img',
						detail: {
							index: index
						}
					})
				} else {
					var banner = this.bannerList[index];
					this.previewTap(banner[this.imgKey])
				}
			},
			// 关闭视频
			colseVideo() {
				var videoContext = uni.createVideoContext("swiperVideo", this);
				videoContext.exitFullScreen();
				videoContext.stop()
				this.playVideoUrl = "";
				this.autoplay = true;
			},
			videoPlayHandle(e) {
				if (this.mode == 'enlarge') {
					this.$refs.videoBox.videoPlayTap(e.src);
				}
				if (this.mode == 'normal') {
					this.playVideoUrl = e.src;
					this.autoplay = false;
				}
			},
			previewTap(url) {
				let imgs = [];
				let imgKey = this.imgKey
				this.bannerList.forEach((item, index) => {
					if (item[imgKey]) {
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
		position: relative;
		background-color: #16192B;
		padding: 16rpx 32rpx 0;

		.video_play_box {
			position: absolute;
			height: 100%;
			width: 100%;
			z-index: 10;
			left: 0rpx;
			top: 0rpx;
		}

		.banner_swiper {
			width: 100%;
			height: 100%;
			overflow: hidden;

			::v-deep .uni-swiper-dot-active {
				width: 34rpx;
				background: #FFFFFF;
				border-radius: 9rpx;
			}

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