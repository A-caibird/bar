<template>
	<view class="me_box">
		<scroll-view scroll-y="true" style="height: 100%;" :refresher-threshold="80" refresher-enabled="true"
			refresher-background="transparent" :refresher-triggered="triggered" @refresherrefresh="handlePageRefresh">
			<view class="middle_box">
				<view class="person_box">
					<view class="person_intro" v-if="authorized"
						@tap="$u.throttle(navigateHandle('/pages/mine/personalSetting/personalSetting'))">
						<image class="person_img" :src="userData.avatar" mode=""></image>
						<view class="intro_info">
							<view class="first_line">
								<view class="info_name"> <text>{{userData.nickName}}</text> </view>
								<image v-if="userData.sex == '男'" class="sex_img"
									src="/static/imgs/register/male_icon.png"></image>
								<image v-else class="sex_img" src="/static/imgs/register/female_icon.png"></image>
							</view>
							<view class="second_line">
								<view class="class_panel" v-if="userData.membershipLevel">
									<image src="/static/imgs/mine/class_icon2.png"></image>
									<text>{{userData.membershipLevel}}</text>
								</view>
							</view>
						</view>
						<image class="go_icon" src="/static/imgs/mine/common_right.png"></image>
					</view>

					<view class="person_intro" v-else @tap="$u.throttle($u.route('/pages/login/login'))">
						<image class="person_img" src="/static/imgs/common/default_avatar.png" mode=""></image>
						<view class="intro_info">
							<text style="color: #FFFFFF; font-size: 44rpx;">点击登录</text>
						</view>
					</view>

					<view class="dispaly_box">
						<view class="display_item"
							@tap="$u.throttle(navigateHandle('/pages/mine/dynamic/personalDynamic'))">
							<view> <text>{{userData.dynamicNumber || 0}}</text> </view>
							<view>动态</view>
						</view>
						<view class="display_item" @tap="$u.throttle(navigateHandle('/pages/mine/follow/follow'))">
							<view> <text>{{userData.attentionNumber || 0}}</text> </view>
							<view>关注</view>
						</view>
						<view class="display_item" @tap="$u.throttle(navigateHandle('/pages/info/fans'))">
							<view> <text>{{userData.fanNumber || 0}}</text> </view>
							<view>粉丝</view>
						</view>
						<view class="display_item">
							<view> <text>{{userData.creditScore || 0}}</text> </view>
							<view>信用分</view>
						</view>
					</view>

					<view class="feature_box">
						<block v-for="(info, index) in featureList" :key="index">
							<view class="feature_item" @tap="goRoute(info.url)">
								<view class="item_icon">
									<image :src="info.icon"></image>
								</view>
								<text>{{info.text}}</text>
								<template v-if="info.num">
									<view class="badge">
										<u-badge :count="info.num"></u-badge>
									</view>
								</template>
							</view>
						</block>
					</view>
				</view>
				<!-- <view class="dynamic-box">
					<commonLabel leftText="我的动态" :showRight="false"></commonLabel>
					<view class="bottom_line"></view>

					<dynamic kind="personal" :pageList="pageList"></dynamic>

				</view> -->
			</view>
			<view class="first_part">
				<view class="box-content">

					<!-- <view class="items" @tap="$u.route('/pages/mine/notifySetting/notifySetting')">
						<text>通知设置</text>
						<image src="/static/imgs/mine/common_right.png"  mode=""></image>
					</view> -->
					<!-- <view class="items" @tap="$u.throttle($u.route('/pages/feedbackHelp/feedbackHelp'))">
						<text>反馈与帮助</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view> -->
					<view class="items" @tap="$u.throttle(navigateHandle('/pages/feedback/feedback'))">
						<text>意见反馈</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
					<view v-if="!isAppleAudit" class="items"
						@tap="$u.throttle(navigateHandle('/pages/common-problem/common-problem'))">
						<text>常见问题</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
					<view class="items" @tap="navigateHandle('/pages/article/article?type=credit')">
						<text>信用规则</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
					<view v-if="!isAppleAudit" class="items" @tap="$u.throttle(goArticle('protocol'))">
						<text>用户协议</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
					<view v-if="isAppleAudit" class="items" @tap="$u.throttle(goArticle('privacy'))">
						<text>隐私政策</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
					<view v-if="isAppleAudit" class="items" @tap="navigateHandle('/pages/logout/tips')">
						<text>账户注销</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
					<view class="items" @tap="navigateHandle('/pages/business-settlement/business-settlement')">
						<text>商家入驻</text>
						<image src="/static/imgs/mine/common_right.png" mode=""></image>
					</view>
				</view>

			</view>
		</scroll-view>

	</view>
</template>

<script>
	var yaoOrderListUrl = '/pages/order/index'//显示订单列表
	var pingOrderListUrl = '/pages/order/index?type=share'//订单列表页面	
	var app = getApp();
	import commonLabel from '@/components/common-label/common-label.vue'
	import dynamic from '@/components/personalDynamic-item/personalDynamic-item.vue'
	import $storage from '@/common/storage.js'
	import appleAudit from '@/mixins/apple-audit.js'
	// #ifdef APP-PLUS
	// var plug = uni.requireNativePlugin("Html5app-Meiqia");
	// #endif
	export default {
		mixins: [appleAudit],
		components: {
			commonLabel,
			dynamic
		},
		data() {
			return {
				triggered: false,
				kind: 'personal',
				userData: {},
				dynamicNumber: '',
				authorized: false,
				yaoOrderWaitPayNum: 0,
				pingOrderWaitPayNum: 0,
				wineCellarNum: 0,
			}
		},
		computed: {
			featureList() {
				if (this.isAppleAudit) {
					if (app.globalData.platform == 'ios') {
						return [{
								icon: '/static/imgs/mine/collect_icon.png',
								text: '我的收藏',
								url: '/pages/mine/myCollection/myCollection'

							},
							{
								icon: '/static/imgs/mine/setting_icon.png',
								text: '个人设置',
								url: '/pages/mine/setting/index'
							},
							{
								icon: '/static/imgs/mine/order_icon.png',
								text: '我的订单',
								url: yaoOrderListUrl,
								num: this.yaoOrderWaitPayNum,
							},
							{
								icon: '/static/imgs/mine/share_order.png',
								text: '拼享订单',
								url: pingOrderListUrl,
								num: this.pingOrderWaitPayNum,
							}
						]
					} else {
						return [{
								icon: '/static/imgs/mine/collect_icon.png',
								text: '我的收藏',
								url: '/pages/mine/myCollection/myCollection'
							},
							{
								icon: '/static/imgs/mine/setting_icon.png',
								text: '个人设置',
								url: '/pages/mine/setting/index'
							}
						]
					}
				} else {
					return [{
							icon: '/static/imgs/mine/wine_icon.png',
							text: '酒库',
							url: '/pages/mine/wineCellar/wineCellar',
							num: this.wineCellarNum
						},
						{
							icon: '/static/imgs/mine/wallet_icon.png',
							text: '我的钱包',
							url: '/pages/mine/wallet/index'
							// url: '/pages/mine/myWallet/myWallet'
						},
						{
							icon: '/static/imgs/mine/order_icon.png',
							text: '我的订单',
							url: yaoOrderListUrl,
							num: this.yaoOrderWaitPayNum,
						},
						{
							icon: '/static/imgs/mine/share_order.png',
							text: '拼享订单',
							url: pingOrderListUrl,
							num: this.pingOrderWaitPayNum,
						},
						{
							icon: '/static/imgs/mine/member_icon.png',
							text: '会员中心',
							url: '/pages/mine/memberCenter/memberCenter'
						},
						{
							icon: '/static/imgs/mine/youhuiquan_icon.png',
							text: '优惠券',
							url: '/pages/coupon/coupon'
						},
						{
							icon: '/static/imgs/mine/collect_icon.png',
							text: '我的收藏',
							url: '/pages/mine/myCollection/myCollection'
						},
						// {
						// 	icon: '/static/imgs/mine/service_icon.png',
						// 	text: '在线客服',
						// 	url: 'kefu'
						// },
						{
							icon: '/static/imgs/mine/setting_icon.png',
							text: '个人设置',
							url: '/pages/mine/setting/index'
						}
					]
				}
			}
		},
		mounted() {
			// this.load()
			uni.$on('personal-info-refresh', this.refreshPersonalInfo)
			uni.$on('pay-order-refresh', this.refreshOrderWaitPaySize)
		},
		beforeDestroy() {
			uni.$off('personal-info-refresh', this.refreshPersonalInfo)
			uni.$off('pay-order-refresh', this.refreshOrderWaitPaySize)
		},
		methods: {
			// 页面跳转
			navigateHandle: function(url) {
				this.$nav.navigateTo({
					url,
				})
			},
			refreshOrderWaitPaySize() {
				if (this.authorized) {
					this.getNotPayInviteOrderSize()
					this.getNotPayJoinOrderSize()
				} else {
					uni.stopPullDownRefresh();
				}
			},
			async handlePageRefresh() {
				if (this.triggered) return;
				this.triggered = true;
				if (!this.authorized) {
					setTimeout(() => {
						this.triggered = false;
					}, 500)
					return;
				}
				this.getNotPayInviteOrderSize()
				this.getNotPayJoinOrderSize()
				this.$u.api.getMyInfo({}).then((code, data) => {
					if (code == 0) {
						this.userData = data.info
						this.upadteUserInfo(data.info.nickName, data.info.avatar)
					}
					setTimeout(() => {
						this.triggered = false;
					}, 500)
				}).catch(err => {
					setTimeout(() => {
						this.triggered = false;
					}, 500)
				})

			},
			goWallet() {
				this.$u.route('/pages/mine/myWallet/myWallet')
			},
			//显示之前的初始函数
			load() {
				let authorized = false;
				if (app.globalData.token) {
					authorized = true;
				} else {
					authorized = false;
				}
				this.authorized = authorized;
				if (authorized) {
					this.getMyInfo()
					this.getNotPayInviteOrderSize()
					this.getNotPayJoinOrderSize()
				}
			},
			refreshPersonalInfo() {
				let authorized = app.globalData.authorized;
				console.log('refreshPersonalInfo');
				if (authorized) {
					this.getMyInfo()
				} else {
					uni.showToast({
						title: '请先登录',
						icon: 'none'
					})
					// uni.stopPullDownRefresh();
				}
			},
			goYaoOrderList() {
				this.$u.route(yaoOrderListUrl)
			},
			
			goShareOrderList() {
				this.$u.route(pingOrderListUrl)
			},
			// 页面跳转
			goRoute: function(url) {
				if (url == 'kefu') {
					// plug.open({"groupId":"26b286ca4af3b84c102ced4aeb88b019"})
				} else {
					if (url) {
						// this.$u.route(url);
						this.navigateHandle(url);
					}
				}
			},
			// 未付款邀约订单数
			async getNotPayInviteOrderSize() {
				let {
					code,
					data
				} = await this.$u.api.getNotPayInviteOrderSizeApi({})
				if (code == 0) {
					let {
						size
					} = data
					this.yaoOrderWaitPayNum = size
					this.$forceUpdate()
				}

			},
			// 未付款拼享订单数
			async getNotPayJoinOrderSize() {
				let {
					code,
					data
				} = await this.$u.api.getNotPayJoinOrderSizeApi({})
				if (code == 0) {
					let {
						size
					} = data
					this.pingOrderWaitPayNum = size
					this.$forceUpdate()
				}
			},
			// 获取个人数据
			getMyInfo: async function() {
				let {
					code,
					data
				} = await this.$u.api.getMyInfo({})
				if (code == 0) {
					// console.log(data)
					this.wineCellarNum = data.info.saveWineNoticeUnreadNum;
					this.userData = data.info
					this.upadteUserInfo(data.info.nickName, data.info.avatar)
				}
			},
			upadteUserInfo(name, avatar) {
				let vm = this
				let userInfo = this.$u.deepClone(app.globalData.userInfo)
				if (userInfo.avatar == avatar) {
					if (userInfo.hasSave) {
						plus.io.getImageInfo({
							src: userInfo.localAvatar,
							success: function(res) {
								if (userInfo.name != name) {
									userInfo.name = name
									app.globalData.userInfo = userInfo
									$storage.setUserInfo(userInfo)
								}
							},
							fail: function(err) {
								// #ifdef APP-PLUS
								vm.setAvatarFromStorage(name, avatar)
								// #endif
							}
						})
					} else {
						// #ifdef APP-PLUS
						vm.setAvatarFromStorage(name, avatar)
						// #endif
					}
				} else {
					// #ifdef APP-PLUS
					vm.setAvatarFromStorage(name, avatar)
					// #endif
				}

			},
			setAvatarFromStorage(name, avatar) {
				let vm = this
				let userInfo = this.$u.deepClone(app.globalData.userInfo)
				let userAvatar = uni.getStorageSync(`userAvatar_${userInfo.userId}`)
				userInfo.avatar = avatar
				if (userAvatar.avatar == avatar) {
					plus.io.getImageInfo({
						src: userAvatar.localAvatar,
						success: function(res) {
							if (userInfo.name != name) {
								userInfo.name = name
								app.globalData.userInfo = userInfo
								$storage.setUserInfo(userInfo)
							}
						},
						fail: function(err) {
							vm.downloadAvatar(avatar).then(res => {
								userInfo.localAvatar = res
								userInfo.name = name
								userInfo.hasSave = true
								uni.setStorage({
									key: `userAvatar_${userInfo.userId}`,
									data: {
										avatar: avatar,
										localAvatar: res
									}
								})
								app.globalData.userInfo = userInfo
								$storage.setUserInfo(userInfo)
							}).catch(err => {
								if (userInfo.name != name) {
									userInfo.name = name
									app.globalData.userInfo = userInfo
									$storage.setUserInfo(userInfo)
								}
							})
						}
					})
				} else {
					vm.downloadAvatar(avatar).then(res => {
						userInfo.localAvatar = res
						userInfo.name = name
						userInfo.hasSave = true
						uni.setStorage({
							key: `userAvatar_${userInfo.userId}`,
							data: {
								avatar: avatar,
								localAvatar: res
							}
						})
						app.globalData.userInfo = userInfo
						$storage.setUserInfo(userInfo)
					}).catch(err => {
						if (userInfo.name != name) {
							userInfo.name = name
							app.globalData.userInfo = userInfo
							$storage.setUserInfo(userInfo)
						}
					})
				}

			},
			async downloadAvatar(url) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
						url,
						success: (res) => {
							if (res.statusCode === 200) {
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (ret) => {
										console.log('下载成功');
										resolve(ret.savedFilePath)
									},
									fail: () => {
										reject(res)
									}
								})

							} else {
								reject(res)
							}
						},
						fail(err) {
							reject(err)
						},
					})
				})
			},


		}
	}
</script>

<style lang="scss" scoped>
	.me_box {
		width: 100%;
		height: 100%;
		background-image: url('/static/imgs/mine/mineBackground.png');
		background-size: 100% 791rpx; // Acaibird颜色修改
		background-repeat: no-repeat;
		background-color: #16192B; // Acaibird颜色修改	

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: #16192B;
			z-index: -1;
		}

		.middle_box {
			width: 100%;
			padding-top: 140rpx;

			.person_box {
				width: 100%;
				box-sizing: border-box;
				padding: 0 30rpx;
				padding-top: 30rpx;

				.person_intro {
					width: 100%;
					padding: 30rpx 0rpx;
					display: flex;
					align-items: center;

					.person_img {
						height: 100rpx;
						width: 100rpx;
						border-radius: 50%;
					}

					.intro_info {
						flex: 1;
						margin: 0 26rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;

						.first_line {
							display: flex;
							align-items: center;

							.info_name {
								font-size: 38rpx;
								color: #FFFFFF;
							}

							.sex_img {
								height: 30rpx;
								width: 30rpx;
								margin-left: 18rpx;
							}
						}

						.second_line {
							display: flex;
							align-items: center;
							margin-top: 8rpx;

							.class_panel {
								padding: 0 20rpx;
								line-height: 36rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 18rpx;
								margin-right: 20rpx;
								background: linear-gradient(148deg, #7341B9 0%, #333EC2 100%);

								&>image {
									height: 16rpx;
									width: 18rpx;
								}

								&>text {
									font-size: 20rpx;
									color: #FFFFFF;
									font-weight: bold;
									height: 30rpx;
									line-height: 36rpx;
								}
							}

							.credit_panel {
								padding: 0 20rpx;
								line-height: 36rpx;
								justify-content: center;
								display: flex;
								align-items: center;
								border-radius: 18rpx;
								background: linear-gradient(306deg, #4997ff 5%, #006dff 88%);

								&>image {
									height: 20rpx;
									width: 18rpx;
								}

								&>text {
									font-size: 20rpx;
									color: #FFFFFF;
									margin-left: 12rpx;
								}
							}
						}
					}

					.go_icon {
						height: 24rpx;
						width: 16rpx;
					}
				}

				.dispaly_box {
					width: 100%;
					padding: 30rpx 0rpx;
					display: flex;
					align-items: center;
					justify-content: space-around;

					.display_item {
						display: flex;
						align-items: center;
						flex-direction: column;

						&>view:first-child {
							font-size: 36rpx;
							color: #FFFFFF;
							font-weight: 500;
						}

						&>view:last-child {
							font-size: 24rpx;
							color: #FFFFFF;
							margin-top: 10rpx;
						}
					}
				}

				.feature_box {
					width: 100%;
					// height: 328rpx;
					min-height: 164rpx;
					box-sizing: border-box;
					padding: 14rpx 0rpx;
					border-radius: 10rpx;
					background: rgba(255, 255, 255, 0.05);
					display: flex;
					// align-items: center;
					flex-wrap: wrap;

					.feature_item {
						height: 150rpx;
						width: 25%;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						position: relative;

						.item_icon {
							height: 46rpx;
							width: 46rpx;
							text-align: center;

							&>image {
								height: 46rpx;
								width: 46rpx;
							}
						}

						.badge {
							position: absolute;
							right: 5rpx;
							top: 0;
						}

						&>text {
							font-size: 26rpx;
							color: #FFFFFF;
							margin-top: 18rpx;
						}
					}
				}
			}

			.dynamic-box {
				width: 100%;


				.bottom_line {
					height: 1px;
					background-color: #31345B;
					width: 100%;
				}
			}
		}

		.first_part {
			padding: 30rpx;

			.box-content {
				border-radius: 10rpx;
				background: rgba(255, 255, 255, 0.05);

				.items {
					width: 100%;
					height: 80rpx;
					@include height-center();
					justify-content: space-between;
					padding-left: 30rpx;
					padding-right: 30rpx;

					&>text {
						font-size: 30rpx;
						color: #ffffff;
					}

					&>image {
						width: 12rpx;
						height: 20rpx;
					}
				}

			}

		}
	}
</style>