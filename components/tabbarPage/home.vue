<template>
	<view class="home_box">
		<view class="header_box">
			<u-navbar :isBack="false" :border-bottom="false" :is-fixed="false" :background="{
					background: '#16192B'
				}">
				<view style="width: calc(100% - 60rpx);margin-left: 30rpx; display: flex; align-items: center;">
					<view class="city_box" style="width: 160rpx; " @tap.stop="$u.throttle(tapGoSelectCity)">
						<view class="city_text">{{ cityName }}</view>
						<u-icon name="arrow-down" size="20" style="margin-left: 10rpx;"></u-icon>
					</view>
					<view class="search_box" style="width: calc(100% - 160rpx);"
						@tap.stop="$u.throttle(tapGoClubList('search'))">
						<u-search :input-style="{ 'font-size': '28rpx', color: '#FFFFFF' }" placeholder-color="#9497B5"
							:clearabled="false" color="#9497B5" bgColor="#33365B" shape="round" :show-action="false"
							:disabled="true"></u-search>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="middle-box">
			<scroll-view :scroll-y="true" :lower-threshold="100" :refresher-threshold="10" :refresher-enabled="true"
				refresher-default-style="none" :scroll-into-view="scrollBottom" style="height: 100%;"
				@scrolltolower="reachBottomLoad" :refresher-triggered="refreshBool" refresher-background="#16192B"
				@refresherpulling="refresherpulling" @refresherrefresh="refresherrefresh"
				@refresherrestore="refresherrestore">
				<view class="loading_box" :class="{'show': refreshBool}">
					<image class="load_text" style="height: 50rpx;width: 50rpx;" src="../../static/imgs/loading.gif">
					</image>
				</view>
				<commonBanner ref="commonBanner" :bannerList="bannerList" imgKey="file" height="280" :showVideo="true"
					videoKey="videoUrl" mode="normal" :customEvent="true" @click="bannerTap"></commonBanner>
				<view class="feature_box" v-if="!isAppleAudit">
					<u-grid col="4" :border="false" hover-class="none">
						<u-grid-item bgColor="#16192B">
							<view class="feature_item" @tap="$u.throttle(tapGoClubList)">
								<image src="/static/imgs/index/club.png"></image>
								<text>CLUB</text>
							</view>
						</u-grid-item>
						<u-grid-item bgColor="#16192B" @tap="$u.throttle(goPing, 1200)">
							<view class="feature_item">
								<image src="/static/imgs/index/share.png"></image>
								<text>拼享快乐</text>
							</view>
						</u-grid-item>
						<u-grid-item bgColor="#16192B">
							<view class="feature_item" @tap="$u.throttle(goGift, 1200)">
								<image src="/static/imgs/index/gift.png"></image>
								<text>礼物排行</text>
							</view>
						</u-grid-item>
						<u-grid-item bgColor="#16192B">
							<view class="feature_item" @tap="$u.throttle(goWheel, 1200)">
								<image src="/static/imgs/index/treasure.png"></image>
								<text>拆盲盒</text>
							</view>
						</u-grid-item>
					</u-grid>
				</view>
				<view class="club_box" id="club-list">
					<view class="club_label">
						<view class="label_left">
							<text>酒吧推荐</text>
						</view>
						<view class="label_right" @tap="$u.throttle(tapGoClubList)">
							<text>更多</text>
							<image src="/static/imgs/common/right.png"></image>
						</view>
					</view>
					<view class="club_list">
						<block v-if="hasLocation">
							<block v-for="(info, index) in pageList" :key="index">
								<club :info="info"></club>
								<block v-if="index != pageList.length - 1">
									<u-gap :height="20" bgColor="#16192B"></u-gap>
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
	import appleAudit from '@/mixins/apple-audit.js' //混合一个是否审核的变量进来，组件mounted就触发
	import loginConfirm from '@/mixins/loginConfirm.js'
	import commonBanner from '@/components/common-banner/common-banner.vue'
	var app = getApp();
	var timeoutEvent = null;
	export default {
		mixins: [pageable, location, appleAudit, loginConfirm],
		components: {
			club,
			commonBanner
		},
		data() {
			return {
				refreshBool: false,
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
			}
		},
		methods: {
			// 自定义下拉刷新控件被下拉
			refresherpulling(e) {
				if (e.detail.deltaY > 40) {
					this.refreshBool = true;
				}
			},
			// 自定义下拉刷新被触发
			refresherrefresh() {
				if (this.refreshBool) {
					if (timeoutEvent) {
						console.log("timeoutEvent", timeoutEvent);
						return
					};
					timeoutEvent = setTimeout(() => {
						this.pullRefresh(() => {
							this.refreshBool = false;
						});
					}, 2000)
				}

			},
			// 自定义下拉刷新被复位
			refresherrestore() {
				this.refreshBool = false;
				if (timeoutEvent) {
					clearTimeout(timeoutEvent);
					timeoutEvent = "";
				}
			},
			// 页面隐藏事件，发现首页index有主动调用
			hideEvent() {
				if (this.$refs.commonBanner && this.$refs.commonBanner.playVideoUrl) {
					this.$refs.commonBanner.colseVideo();
				}
			},

			//点击轮播图
			bannerTap(e) {
				let index = e.detail.index;
				let info = this.bannerList[index];
				this.$nav.bannberNav(info);
			},
			//点击城市选择
			tapGoSelectCity() {
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
					this.params.lng = lng;
					this.params.lat = lat;
					this.params.cityName = cityName;
					this.pullRefresh();
				})
			},

			handleUpdateLocationService() {
				// this.updateLocationService(() => {
				// 	if (this.canLocation && app.globalData.location.cityName == '未定位') {
				// 		this.getLocation()
				// 	}
				// })
			},

			//功能按钮区触发，去酒吧列表
			tapGoClubList(mode = 'list') {

				if (mode == 'list') {
					this.$u.route('/pages/club/list' + `?mode=${mode}`)
				}
				if (mode == 'search') {
					this.$u.route('/pages/club/search-list' + `?mode=${mode}`)
				}

			},


			load() {
				console.log("载入load方法")
				this.getHomeBannerList()
				this.getClubList()
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


			// getSelfLocation: function() {
			// 	uni.getLocation({
			// 		type: 'wgs84',
			// 		success: res => {
			// 			console.log(res);
			// 		},
			// 		fail: e => {
			// 			console.log(e);
			// 		}
			// 	});
			// },
			//最初的触发方法
			getHomeBannerList() {
				var that = this;

				this.$u.api.getHomeBannerListApi().then(function(res) {
					if (res.code == 0) {
						var list = res.data.list;
						that.bannerList = list;
						that.bannerListLoad = true
					}
				}).catch(function() {

				});


			},
			//最初触发的方法,原先的方法，目前重写了
			// async getClubList() {
			// 	//调用mixins/location的方法，拿到经纬度和城市名，存起来
			// 	await this.getLocation()

			// 	if (this.canLocation) {//是location.js中的一个变量
			// 		let hasLocation = await this.getLocation()
			// 		if (!hasLocation && this.hasLocation) {
			// 			this.pullRefresh()
			// 		}
			// 	} else {
			// 		if (this.hasLocation) {
			// 			this.pullRefresh()
			// 		}
			// 	}
			// },

			//需要修改，目前这边只传了标准的经纬度，城市默认是宁波，但是后台这边是根据城市名来的
			getClubList() {
				console.log("111")
				var that = this;
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success(res) {
						console.log("定位成功===>")
						console.log(res)
						let {
							latitude,
							longitude,
							address
						} = res
						let location = {
							lng: longitude,
							lat: latitude,
							cityName: address.city
						}

						getApp().globalData.location = location;

						// console.log(res)
						that.pullRefresh()

					},
					fail(err) {
						console.log("定位失败===>")
						console.log(err)

					}
				})
			},

			//功能按钮区触发，去礼物列表
			goGift: function() {
				if (!this.loginConfirmHandle(false)) return;
				this.$emit('goGift')
			},
			//功能按钮区触发，去拼享列表
			goPing: function() {
				if (!this.loginConfirmHandle(false)) return;
				this.$emit('goPing')
			},
			//盲盒
			goWheel() {
				if (!this.loginConfirmHandle(false)) return;
				this.$u.route('/pages/blindBox/index')
				// this.$u.route('/pages/snatch/snatch')
			},
		}
	};
</script>

<style lang="scss" scoped>
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
			overflow: hidden;
			position: relative;

			.loading_box {
				// position: absolute;
				// top: 40rpx;
				// left: 0rpx;
				margin-bottom: 0rpx;
				width: 100%;
				// height: 50rpx;
				height: 0rpx;
				text-align: center;
				z-index: -1;
				opacity: 0;
				transition: all 0.3s;

				&.show {
					height: 50rpx;
					opacity: 1;
					z-index: 2;
					margin-bottom: 30rpx;
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
						height: 84rpx;
						width: 84rpx;
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
					padding: 0 32rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					background-color: #16192B;

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
						color: rgba(255, 255, 255, 0.5);

						&>image {
							height: 20rpx;
							width: 20rpx;
							margin-left: 6rpx;
						}
					}
				}

				.club_list {
					padding: 0 32rpx;
					background-color: #16192B;
				}
			}

		}

	}
</style>