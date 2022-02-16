<template>
	<view class="home_box">
		<view class="header_box">
			<u-navbar :isBack="false" :border-bottom="false" :is-fixed="false" :background="{
					background: '#191C3F'
				}">
				<view style="width: calc(100% - 60rpx);margin-left: 30rpx; display: flex; align-items: center;">
					<view class="city_box" style="width: 160rpx; " @tap="$u.throttle(tapGoSelectCity)">
						<view class="city_text">{{ cityName }}</view>
						<u-icon name="arrow-down" size="20" style="margin-left: 10rpx;"></u-icon>
					</view>
					<view class="search_box" style="width: calc(100% - 160rpx);"
						@tap="$u.throttle(tapGoClubList('search'))">
						<u-search :input-style="{ 'font-size': '28rpx', color: '#FFFFFF' }" placeholder-color="#9497B5"
							:clearabled="false" color="#9497B5" bgColor="#33365B" shape="round" :show-action="false"
							:disabled="true"></u-search>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="middle-box">
			<scroll-view scroll-y="true" :lower-threshold="100" :scroll-into-view="scrollBottom" style="height: 100%;"
				@scrolltolower="reachBottomLoad">
				<view class="swiper_box" v-if="bannerList.length>1">
					<!-- <u-swiper bgColor="#191C3F" name="file" :list="bannerList" mode="rect" height="400" @click="bannerTap"></u-swiper> -->
					<swiper class="banner_swiper" style="height: 400rpx;" duration="500" interval="3000" :autoplay="true" :circular="true" indicator-dots indicator-active-color="#eaedf0" indicator-color="#7b597e">
						<swiper-item v-for="(item, index) in bannerList">
							<block v-if="item.videoUrl">
								<view class="video_replace_item" @tap="videoPlayTap(index)">
									<image class="video_img" :src="item.videoUrl + videoImgFooter"></image>
									<image class="play_icon" src="../../static/imgs/common/play_icon.png"></image>
								</view>
							</block>
							<block v-else>
								<u-image :src="item.file" height="400"></u-image>
							</block>
						</swiper-item>
					</swiper>
					<video :direction="0" @fullscreenchange="fullScreenChange" class="videoBox" id="videoId"
						v-if="playUrl" :src="playUrl"></video>
				</view>
				<view class="swiper_box" v-if="bannerList.length == 1">
					<image :src="bannerList[0].file"></image>
				</view>
				<view class="feature_box" v-if="!isAppleAudit">
					<u-grid col="4" :border="false" hover-class="none">
						<u-grid-item bgColor="#191C3F">
							<view class="feature_item" @tap="$u.throttle(tapGoClubList)">
								<image src="/static/imgs/index/club.png"></image>
								<text>CLUB</text>
							</view>
						</u-grid-item>
						<u-grid-item bgColor="#191C3F" @tap="$u.throttle(goPing, 1200)">
							<view class="feature_item">
								<image src="/static/imgs/index/share.png"></image>
								<text>拼享快乐</text>
							</view>
						</u-grid-item>
						<u-grid-item bgColor="#191C3F">
							<view class="feature_item" @tap="$u.throttle(goGift, 1200)">
								<image src="/static/imgs/index/gift.png"></image>
								<text>礼物排行</text>
							</view>
						</u-grid-item>
						<u-grid-item bgColor="#191C3F">
							<view class="feature_item" @tap="$u.throttle(goWheel, 1200)">
								<image src="/static/imgs/index/treasure.png"></image>
								<text>夺宝</text>
							</view>
						</u-grid-item>
					</u-grid>
				</view>
				<view class="club_box" id="club-list">
					<view class="club_label">
						<view class="label_left">
							<view class="line"></view>
							<text>酒吧</text>
						</view>
						<view class="label_right" @tap="$u.throttle(tapGoClubList)">
							<text>查看全部</text>
							<image src="/static/imgs/common/right.png"></image>
						</view>
					</view>
					<view class="club_list">
						<block v-if="hasLocation">
							<block v-for="(info, index) in pageList" :key="index">
								<club :info="info"></club>
								<block v-if="index != pageList.length - 1">
									<u-gap :height="20" bgColor="#20234B"></u-gap>
								</block>
							</block>
						</block>

						<block v-else>
							<location-btn></location-btn>
						</block>
					</view>
				</view>

			</scroll-view>

		</view>

	</view>
</template>

<script>
	import club from '@/components/club-item/club-item.vue';
	import pageable from '@/mixins/pageable.js';
	import location from '@/mixins/location.js';
	import appleAudit from '@/mixins/apple-audit.js'
	import loginConfirm from '@/mixins/loginConfirm.js'
	var app = getApp();
	export default {
		mixins: [pageable, location, appleAudit, loginConfirm],
		components: {
			club
		},
		data() {
			return {
				playUrl: '',
				bannerList: [],
				videoImgFooter: '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast',
				cityName: app.globalData.location.cityName,
				params: {
					cityName: app.globalData.location.cityName,
					areaName: '',
					lng: app.globalData.location.lng,
					lat: app.globalData.location.lat,
					sortCondition: 'distance',
				},
				scrollBottom: '',
				url: '/api/club/list',
				clubListLoad: false,
				bannerListLoad: false,
			};
		},
		mounted() {
			setTimeout(() => {
				this.$emit('homeLoad')
			}, 5 * 1000)
			this.load()
		},
		watch: {
			clubListLoad(val) {
				if (val && this.bannerListLoad) {
					setTimeout(() => {
						this.$emit('homeLoad')
					}, 1000)
				}
			},
			bannerListLoad(val) {
				if (val && this.clubListLoad) {
					setTimeout(() => {
						this.$emit('homeLoad')
					}, 1000)
				}
			},
			cityName: function(value) {
				// console.log(value);
				this.params.cityName = value;
				this.pullRefresh();
			}
		},
		methods: {
			fullScreenChange(e) {
				if (!e.detail.fullScreen) {
					var videoContext = uni.createVideoContext("videoId", this);
					videoContext.stop()
					this.playUrl = "";
				}
			},
			videoPlayTap(index) {
				this.playUrl = this.bannerList[index].videoUrl;
				var vm = this;
				this.$nextTick(function() {
					var videoContext = uni.createVideoContext("videoId", vm);
					videoContext.requestFullScreen({
						direction: 0
					});
					videoContext.play()
				})
			},
			goWheel() {
				if (!this.loginConfirmHandle(false)) return;
				this.$u.route('/pages/snatch/snatch')
			},
			bannerTap(e) {
				let index = e;
				let info = this.bannerList[index];
				this.$nav.bannberNav(info);
			},
			tapGoSelectCity() {
				// if(this.cityName=='未定位')return
				this.$u.route('/pages/select/city')
			},
			handleUpdateLocation() {
				this.setLocation(() => {
					let {
						cityName,
						lng,
						lat
					} = app.globalData.location
					this.cityName = cityName
					this.params.areaName = ""
					this.params.lng = lng
					this.params.lat = lat
					this.pullRefresh();
				})

			},
			handleUpdateLocationService() {
				this.updateLocationService(() => {
					if (this.canLocation && app.globalData.location.cityName == '未定位') {
						this.getLocation()
					}
				})
			},

			tapGoClubList(mode = 'list') {
				if (mode == 'list') {
					this.$u.route('/pages/club/list' + `?mode=${mode}`)
				}
				if (mode == 'search') {
					this.$u.route('/pages/club/search-list' + `?mode=${mode}`)
				}

			},
			load() {
				this.getHomeBannerList()
				this.getClubList()
			},
			async getClubList() {
				await this.getLocation()
				if (this.canLocation) {
					let hasLocation = await this.getLocation()
					if (!hasLocation && this.hasLocation) {
						this.pullRefresh()
					}
				} else {
					if (this.hasLocation) {
						this.pullRefresh()
					}
				}
			},
			scrollToClubList() {
				this.scrollBottom = ''
				this.$nextTick(() => {
					this.scrollBottom = 'club-list'
				})
			},
			handlePullRefresh() {
				this.clubListLoad = true
			},
			getSelfLocation: function() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						console.log(res);
					},
					fail: e => {
						console.log(e);
					}
				});
			},
			async getHomeBannerList() {
				let {
					code,
					data
				} = await this.$u.api.getHomeBannerListApi()
				if (code == 0) {
					var list = data.list;
					this.bannerList = list;
					this.bannerListLoad = true
				}
			},
			goGift: function() {
				if (!this.loginConfirmHandle(false)) return;
				this.$emit('goGift')
			},
			goPing: function() {
				if (!this.loginConfirmHandle(false)) return;
				this.$emit('goPing')
			},
		}
	};
</script>

<style lang="scss" scoped>
	.videoBox {
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		z-index: -1;
		height: 100%;
		width: 100%;
		opacity: 0;
	}
	.home_box {
		height: 100%;
		display: flex;
		flex-direction: column;

		.header_box {
			.city_box {
				font-size: 32rpx;
				color: #ffffff;
				display: flex;
				align-items: center;

				.city_text {
					max-width: 120rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}

		.middle-box {
			flex: 1;
			min-height: 0;
			min-width: 0;

			.swiper_box {
				width: 100%;
				height: 400rpx;

				image {
					width: 100%;
					height: 100%;
				}

				.banner_swiper {
					width: 100%;
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

			.feature_box {
				width: 100%;

				.feature_item {
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;

					&>image {
						height: 98rpx;
						width: 98rpx;
					}

					&>text {
						font-size: 24rpx;
						color: #ffffff;
					}
				}
			}

			.club_box {
				width: 100%;

				.club_label {
					height: 100rpx;
					width: 100%;
					padding: 0 30rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #31345b;

					.label_left {
						display: flex;
						align-items: center;
						font-size: 34rpx;
						color: #ffffff;
						font-weight: 500;

						.line {
							height: 32rpx;
							width: 6rpx;
							background: #ff59c9;
							margin-right: 14rpx;
						}
					}

					.label_right {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #bdc0da;

						&>image {
							height: 22rpx;
							width: 14rpx;
							margin-left: 16rpx;
						}
					}
				}
			}

		}

	}
</style>
