<template>
	<view class="find-page">
		<block v-if="!pageLoading">
			<view class="find_header_box">
				<classify fontSize="28" bgColor="#16192B" ref="tabs" :list="list" :current="swiperCurrent"
					@dbTap="dbTap" @change="change" :is-scroll="false" swiperWidth="750" inactiveColor="#979797"
					activeColor="#ffffff" :activeItemStyle="{
						'color': '#fff',
						 }"></classify>
			</view>
			<view class="find_middle_box" v-if="!pageLoading">
				<swiper class="swiper-box" :duration="250" :current="swiperCurrent" @change="animationfinish">
					<!--关注动态-->
					<swiper-item class="swiper-item">
						<dynamic-list2 @reportTap="reportTap" @shareTap="$emit('shareTap')" ref="follow-dynamic-list"
							:index="swiperCurrent" @showYaoyue="handleShowYaoyue" @showPing="handleShowPing"
							:showPercent="!isAppleAudit" @oepnComment="openDynamicComment('follow',$event)"
							@oepnGift="oepnGift('follow',$event)">
						</dynamic-list2>
					</swiper-item>
					<!--附近动态-->
					<swiper-item class="swiper-item">
						<view style="height: 100%;">
							<dynamic-list @reportTap="reportTap" @videoPlayTap="videoPlayHandle"
								@shareTap="$emit('shareTap')" ref="nearby-dynamic-list" :index="swiperCurrent"
								@showYaoyue="handleShowYaoyue" @showPing="handleShowPing" :showPercent="!isAppleAudit"
								@oepnComment="openDynamicComment('nearby',$event)"
								@oepnGift="oepnGift('nearby',$event)">
							</dynamic-list>
						</view>
					</swiper-item>
					<!--拼享快乐-->
					<swiper-item class="swiper-item" v-if="!isAppleAudit">
						<find-share-list ref="find-share-list" :i="2" :index="swiperCurrent"></find-share-list>
					</swiper-item>
					<!--礼物排行-->
					<swiper-item class="swiper-item" v-if="!isAppleAudit">
						<gift-board ref="gift-board" :i="3" :index="swiperCurrent"></gift-board>
					</swiper-item>
				</swiper>
			</view>
		</block>
		<block v-else>
			<view class="loading_page" :class="{'hide': !pageLoading}">
				<image src="/static/imgs/common/home-loading.gif"></image>
			</view>
		</block>
		<videoBox ref="videoBox"></videoBox>
		<invite mode="awkward" ref="yaoyuePop" @openOrderList="handleOpenYaoOrderList"></invite>
		<invite mode="share" ref="pingPop" @openOrderList="handleOpenPingOrderList"></invite>
		<askward ref="askward" mode="invite" @goClub="goClub"></askward>
		<askward ref="pingAskward" mode="share" @goClub="goClub"></askward>
		<u-picker mode="selector" v-model="yaoOrderListShow" title="选择订单" :range="yaoOrderList" range-key="changeStr"
			@confirm="yaoOrderListConfirm"></u-picker>
		<u-picker mode="selector" v-model="pingOrderListShow" title="选择订单" :range="pingOrderList" range-key="changeStr"
			@confirm="pingOrderListConfirm"></u-picker>
		<!-- <giftAnimation ref="giftAnimation"></giftAnimation> -->
	</view>
</template>

<script>
	import classify from '@/components/classify/classify.vue';
	import findShare from '@/components/find-share/find-share.vue';
	import findShareList from '@/components/find-share-list/find-share-list.vue';
	import dynamicList from '@/components/dynamic-list/dynamic-list.vue';
	import dynamicList2 from '@/components/dynamic-list/list2.vue';
	import giftBoard from '@/components/gift-board/gift-board.vue';
	import invite from '@/components/pop/invite.vue';
	import askward from '@/components/pop/awkward-tips.vue';
	import appleAudit from '@/mixins/apple-audit.js'
	import loginConfirm from '@/mixins/loginConfirm.js'
	import $chat from '@/utils/chat/index.js'
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue' //礼物动画相关
	import videoBox from '@/components/common-video/video.vue' //视频播放组件
	var app = getApp();
	export default {
		mixins: [appleAudit, loginConfirm],
		components: {
			classify,
			findShare,
			invite,
			askward,
			dynamicList,
			dynamicList2,
			findShareList,
			giftBoard,
			giftAnimation,
			videoBox,
		},
		data() {
			return {
				pageLoading: true,
				giftList: '',
				awkwardShow: false,
				boxHeight: '',
				current: 1,
				swiperCurrent: 1,
				yaoInfo: {},
				pingInfo: {},
				yaoOrderList: [],
				yaoOrderListShow: false,
				pingOrderList: [],
				pingOrderListShow: false,
				userInfo: app.globalData.userInfo,
			};
		},
		computed: {
			//根据是否属于苹果审核状态，切换显示不同的数据
			list() {
				return (this.isAppleAudit) ? [{
					name: '关注动态',
					value: ''
				}, {
					name: '附近动态',
					value: ''
				}, ] : [{
					name: '关注动态',
					value: ''
				}, {
					name: '附近动态',
					value: ''
				}, {
					name: '拼享快乐',
					value: ''
				}, {
					name: '礼物排行',
					value: ''
				}, ]
			}
		},
		mounted() {
			var vm = this;
			this.pageLoading = true;
			this.$nextTick(function() {
				setTimeout(() => {
					vm.pageLoading = false;
				}, 300)
			})
		},
		methods: {

			//向上一级发送举报信息
			reportTap(info) {
				this.$emit('reportTap', info);
			},

			//动态中涉及到一些视频需要播放
			videoPlayHandle(e) {
				this.$refs.videoBox.videoPlayTap(e.src);
			},

			//打开动态评论
			openDynamicComment(mode, e) {
				let info = Object.assign(e, {
					mode
				});
				this.$emit('openDynamicComment', info);
			},

			//打开显示礼物
			oepnGift(mode, e) {
				let info = Object.assign(e, {
					mode
				});
				this.$emit('oepnGift', info);
			},


			show() {
				this.authorized = getApp().globalData.authorized;
				console.log("准备跳转到附近动态")
				if (this.$refs['nearby-dynamic-list']) {
					let ref = this.$refs['nearby-dynamic-list'];
					let searchValue = ref.params.searchKey;
					if (searchValue) {
						ref.searchChange("");
					}
				}
			},

			//看起来像是礼物发送完成的处理函数
			handleSendGiftSuccess(e) {
				this.$refs['follow-dynamic-list'].setGifttNum(e)
				this.$refs['nearby-dynamic-list'].setGifttNum(e)
				if (e.gifUrl) {
					this.$refs.giftAnimation.show(e.gifUrl)
				}
			},

			//看起来像是评论发送完成的处理函数
			handleSendComment(e) {
				if (e.mode == 'follow') {
					this.$refs['follow-dynamic-list'].setCommentNum(e)
				} else if (e.mode == 'nearby') {
					this.$refs['nearby-dynamic-list'].setCommentNum(e)
				} else {
					this.$refs['follow-dynamic-list'].setCommentNum(e)
					this.$refs['nearby-dynamic-list'].setCommentNum(e)
				}
			},

			goClub() {
				this.$emit('goClub')
			},

			pingOrderListConfirm(arr) {
				console.log(this.pingOrderList[arr[0]]) //订单信息
				console.log(this.pingInfo) //动态信息
				let friendUserInfo = this.$u.deepClone(this.pingInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				this.sendPing(this.pingOrderList[arr[0]], friendUserInfo)
			},

			yaoOrderListConfirm(arr) {
				console.log(this.yaoOrderList[arr[0]]) //订单信息
				console.log(this.yaoInfo) //动态信息
				let friendUserInfo = this.$u.deepClone(this.yaoInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				this.sendYaoyue(this.yaoOrderList[arr[0]], friendUserInfo)
			},

			async sendPing(orderInfo, friendUserInfo) {
				let userInfo = this.$u.deepClone(this.userInfo)
				console.log(orderInfo)
				console.log(userInfo)
				console.log(friendUserInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'ping', {
					orderId: orderInfo.id,
					clubCover: orderInfo.clubCover,
					clubName: orderInfo.clubName,
					date: orderInfo.date,
					cardTableName: orderInfo.cardTableName,
					agreeStatus: 'none',
				})
				this.goChat({
					userInfo: JSON.stringify(friendUserInfo)
				})
			},

			async sendYaoyue(orderInfo, friendUserInfo) {
				let userInfo = this.$u.deepClone(this.userInfo)
				console.log(orderInfo)
				console.log(userInfo)
				console.log(friendUserInfo)
				let {
					code,
					data
				} = await this.$u.api.yaoyueInviteApi({
					orderId: orderInfo.id,
					userId: friendUserInfo.userId
				})
				if (code == 0) {
					console.log(data)
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'yaoyue', {
						orderId: orderInfo.id,
						clubCover: orderInfo.clubCover,
						clubName: orderInfo.clubName,
						date: orderInfo.date,
						cardTableName: orderInfo.cardTableName,
						awkwardWineId: data.awkwardWineId,
						agreeStatus: 'none',
					})
					this.goChat({
						userInfo: JSON.stringify(friendUserInfo)
					})
				}
			},

			goChat(e) {
				this.$emit('goChat', e)
			},

			async handleOpenPingOrderList(info) {
				console.log(info)
				let {
					code,
					data
				} = await this.$u.api.getPingOrderApi({
					pageNumber: 1,
					pageSize: 20
				})
				if (code == 0) {
					console.log(data)
					if (data.list.length == 0) {
						this.pingOrderList = []
						this.$refs.pingAskward.open()
					} else {
						this.pingInfo = info
						this.pingOrderList = data.list
						this.pingOrderListShow = true
					}
				}
			},

			async handleOpenYaoOrderList(info) {
				console.log(info)
				let {
					code,
					data
				} = await this.$u.api.getYaoOrderApi({
					pageNumber: 1,
					pageSize: 20
				})
				if (code == 0) {
					console.log(data)
					if (data.list.length == 0) {
						this.yaoOrderList = []
						this.$refs.askward.open()
					} else {
						this.yaoInfo = info
						this.yaoOrderList = data.list
						this.yaoOrderListShow = true
					}
				}
			},

			handleShowPing(e) {
				this.$refs.pingPop.open(e)
			},

			handleShowYaoyue(e) {
				this.$refs.yaoyuePop.open(e)
			},
			//显示礼物排行
			switchToGift() {
				console.log('显示礼物排行')
				this.swiperCurrent = 3;
			},
			//显示拼享快乐
			switchToPing() {
				console.log('显示拼享快乐')
				this.swiperCurrent = 2;
			},
			switchToFind() { //显示附近动态
				console.log('显示附近动态')
				this.swiperCurrent = 1;
				this.$nextTick(() => {
					if (this.$refs['nearby-dynamic-list']) {
						let ref = this.$refs['nearby-dynamic-list'];
						ref.searchChange("");
					}
				})
			},
			// 显示附近动态
			switchToNearby() {
				this.swiperCurrent = 1;
				this.$nextTick(() => {
					if (this.$refs['nearby-dynamic-list']) {
						let ref = this.$refs['nearby-dynamic-list'];
						ref.searchChange("");
					}
				})
			},
			//切换显示关注动态
			switchToAtt() {
				this.swiperCurrent = 0;
				this.$nextTick(() => {
					if (this.$refs['follow-dynamic-list']) {
						let ref = this.$refs['follow-dynamic-list']
						ref.refreshScrll()
					}
				})
			},
			// 顶部tab 栏双击
			dbTap(index) {
				let refs = ['follow-dynamic-list', 'nearby-dynamic-list', 'find-share-list', 'gift-board'];
				this.$refs[refs[index]].toTopClick();
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
			},

			animationfinish({
				detail: {
					current
				}
			}) {
				this.swiperCurrent = current;
			},

		}
	};
</script>

<style lang="scss" scoped>
	.find-page {
		display: flex;
		flex-direction: column;
		height: 100%;
		position: relative;

		.loading_page {
			position: absolute;
			z-index: 100;
			left: 0rpx;
			top: 0rpx;
			opacity: 1;
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s;

			&>image {
				height: 60rpx;
				width: 60rpx;
			}

			&.hide {
				opacity: 0;
			}
		}

		.find_header_box {
			background-color: transparent;
			padding-top: var(--status-bar-height); //状态栏高度	
		}

		.find_middle_box {
			flex: 1;
			min-width: 0;
			min-height: 0;
			background: #16192B;

			.swiper-box {
				height: 100%;
				width: 100%;
				position: relative;
				background: #16192B;
			}

			.swiper-item {
				height: 100%;
				background: #16192B;
			}
		}
	}
</style>