<template>
	<view class="find-page">
		<block v-if="!pageLoading">
			<view class="find_header_box">
				<classify fontSize="28" bgColor="#191C3F" ref="tabs" :list="list" :current="current" @change="change"
					:is-scroll="false" swiperWidth="750" inactiveColor="#B7B9D6" activeColor="#ffffff" :activeItemStyle="{
						'font-size': '34rpx'
					}"></classify>
			</view>
			<view class="find_middle_box" v-if="!pageLoading">
				<swiper class="swiper-box" :duration="250" :current="swiperCurrent" @change="animationfinish">
					<swiper-item class="swiper-item">
						<dynamic-list @shareTap="$emit('shareTap')" ref="follow-dynamic-list" :i="0" :index="swiperCurrent" mode="follow"
							@showYaoyue="handleShowYaoyue" @showPing="handleShowPing" :showPercent="!isAppleAudit"
							@oepnComment="$emit('openDynamicComment',$event)" @oepnGift="$emit('oepnGift',$event)">
						</dynamic-list>
					</swiper-item>
					<swiper-item class="swiper-item">
						<view style="height: 100%;">
							<dynamic-list @shareTap="$emit('shareTap')" ref="nearby-dynamic-list" :i="1" :index="swiperCurrent" mode="nearby"
								@showYaoyue="handleShowYaoyue" @showPing="handleShowPing" :showPercent="!isAppleAudit"
								@oepnComment="$emit('openDynamicComment',$event)" @oepnGift="$emit('oepnGift',$event)">
							</dynamic-list>
						</view>
					</swiper-item>
			
					<swiper-item class="swiper-item" v-if="!isAppleAudit && authorized">
						<find-share-list ref="find-share-list" :i="2" :index="swiperCurrent"></find-share-list>
					</swiper-item>
					<swiper-item class="swiper-item" v-if="!isAppleAudit && authorized">
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
		<invite mode="awkward" ref="yaoyuePop" @openOrderList="handleOpenYaoOrderList"></invite>
		<invite mode="share" ref="pingPop" @openOrderList="handleOpenPingOrderList"></invite>
		<askward ref="askward" mode="invite" @goClub="goClub"></askward>
		<askward ref="pingAskward" mode="share" @goClub="goClub"></askward>
		<u-picker mode="selector" v-model="yaoOrderListShow" title="选择订单" :range="yaoOrderList" range-key="changeStr"
			@confirm="yaoOrderListConfirm"></u-picker>
		<u-picker mode="selector" v-model="pingOrderListShow" title="选择订单" :range="pingOrderList" range-key="changeStr"
			@confirm="pingOrderListConfirm"></u-picker>
		<giftAnimation ref="giftAnimation"></giftAnimation>
	</view>
</template>

<script>
	import classify from '@/components/classify/classify.vue';
	import findShare from '@/components/find-share/find-share.vue';
	import findShareList from '@/components/find-share-list/find-share-list.vue';
	import dynamicList from '@/components/dynamic-list/dynamic-list.vue';
	import giftBoard from '@/components/gift-board/gift-board.vue';
	import invite from '@/components/pop/invite.vue';
	import askward from '@/components/pop/awkward-tips.vue';
	import appleAudit from '@/mixins/apple-audit.js'
	import loginConfirm from '@/mixins/loginConfirm.js'
	import $chat from '@/utils/chat/index.js'
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	var app = getApp();
	export default {
		mixins: [appleAudit,loginConfirm],
		components: {
			classify,
			findShare,
			invite,
			askward,
			dynamicList,
			findShareList,
			giftBoard,
			giftAnimation,
		},
		data() {
			return {
				pageLoading: true,
				giftList: '',
				awkwardShow: false,
				giftFilter: {
					gift: {
						array: [{
								value: '',
								name: '魅力榜'
							},
							{
								value: '',
								name: '土豪榜'
							}
						],
						valArray: [{
								value: '',
								name: '魅力值'
							},
							{
								value: '',
								name: '豪气值'
							}
						],

						selectIndex: 0
					},
					time: {
						array: [{
								value: '',
								name: '周榜'
							},
							{
								value: '',
								name: '月榜'
							}
						],
						selectIndex: 0
					}
				},
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
			list() {
				return (this.isAppleAudit || !this.authorized) ? [{name: '关注动态',value: ''},{name: '附近动态',value: ''},] : [{name: '关注动态',value: ''},{name: '附近动态',value: ''},{name: '拼享快乐',value: ''},{name: '礼物排行',value: ''},]
			}
		},
		mounted() {	
			var vm = this;
			this.pageLoading = true;
			this.$nextTick(function(){
				setTimeout(() => {
					vm.pageLoading = false;
				}, 300)
			})
		},
		methods: {
			show(){
				this.authorized = getApp().globalData.authorized;
				console.log(this.authorized);
				if(this.$refs['nearby-dynamic-list']){
					let ref = this.$refs['nearby-dynamic-list'];
					let searchValue = ref.params.searchKey;
					if(searchValue){
						ref.searchChange("");
					}
				}
			},
			handleSendGiftSuccess(e) {
				this.$refs['follow-dynamic-list'].setGifttNum(e)
				this.$refs['nearby-dynamic-list'].setGifttNum(e)
				if (e.gifUrl) {
					this.$refs.giftAnimation.show(e.gifUrl)
				}

			},
			handleSendComment(e) {
				this.$refs['follow-dynamic-list'].setCommentNum(e)
				this.$refs['nearby-dynamic-list'].setCommentNum(e)
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
			switchToGift() { //显示礼物排行
			console.log('显示礼物排行')
				this.swiperCurrent = 3;
			},
			switchToPing() { //显示拼享快乐
				console.log('显示拼享快乐')
				this.swiperCurrent = 2;
			},
			switchToFind() { //显示附近动态
			console.log('显示附近动态')
				this.swiperCurrent = 1;
				this.$nextTick(() => {
					if(this.$refs['nearby-dynamic-list']){
						let ref = this.$refs['nearby-dynamic-list'];
						ref.searchChange("");
					}
				})
			},
			switchToNearby() { //显示附近动态
				this.swiperCurrent = 1;
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
				this.current = current;
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
		.loading_page{
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
			&>image{
				height: 60rpx;
				width: 60rpx;
			}
			&.hide{
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

			.swiper-box {
				height: 100%;
				width: 100%;
				position: relative;
			}

			.swiper-item {
				height: 100%;


			}
		}
	}
</style>
