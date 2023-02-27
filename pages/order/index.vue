<template>
	<view class="container">
		<view class="header-box">
			<u-navbar :customBack="backEvent" back-icon-color="#FFFFFF" :title="title" title-size="36"
				titleColor="#FFFFFF" :background="{
						'background': '#191C3F'
					}" :border-bottom="false">
			</u-navbar>
		</view>
		<view class="middle_box">
			<view class="classify_box">
				<classify fontSize="28" bgColor="#191C3F" ref="tabs" :list="status" :current="current" @change="change"
					:is-scroll="false" swiperWidth="750" inactiveColor="#B7B9D6" activeColor="#ffffff" :activeItemStyle="{
					 'font-size': '34rpx'
				 }"></classify>
			</view>
			<view class="order_list">
				<swiper circular class="swiper-box" :current="swiperCurrent" :duration="250" @change="animationfinish">
					<swiper-item v-for="(item,index) in status">
						<order-list ref="order-list" :i="index" :index="swiperCurrent" :mode="mode"
							:status="item.value"></order-list>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import classify from '@/components/classify/classify.vue'
	import orderMixins from '@/mixins/order.js'
	import {
		orderStatus
	} from '@/common/selector.js'
	export default {
		components: {
			classify,
		},
		mixins: [orderMixins],
		data() {
			return {
				title: '',
				status: orderStatus,
				current: 0,
				swiperCurrent: 0,
				mode: '',

				yaoOrderWaitPayNum: 0,
				pingOrderWaitPayNum: 0,
				distance: 0,
			}
		},
		onLoad: function(options) {
			uni.$on('order-list-refresh', this.refresh)
			uni.$on('fetch-wine', this.refresh)
			uni.$on('pay-order-refresh', this.refreshOrderWaitPaySize)
			if (options.type == 'share' || options.type) {
				this.mode = 'share'
				this.getNotPayJoinOrderSize()
			} else {
				this.mode = 'common'
				this.getNotPayInviteOrderSize()
			}
			if (options.distance) {
				this.distance = parseInt(options.distance);
			}
		},
		onUnload() {
			uni.$off('order-list-refresh', this.refresh)
			uni.$off('fetch-wine', this.refresh)
			uni.$off('pay-order-refresh', this.refreshOrderWaitPaySize)
		},
		watch: {
			mode: function(value) {
				if (value == 'share') {
					this.title = '拼享订单'
					this.url = '/api/order/pingList'
				}
				if (value == 'common') {
					this.title = '我的订单'
					this.url = '/api/order/inviteOrderList'
				}
			},
		},
		methods: {
			backEvent() {
				let distance = this.distance;
				if (distance <= 0) {
					distance = 1;
				}
				uni.navigateBack({
					delta: distance
				})
			},
			refreshOrderWaitPaySize() {
				if (this.mode == 'share') {
					this.getNotPayJoinOrderSize()
				} else {
					this.getNotPayInviteOrderSize()
				}
			},
			// 未付款邀约订单数
			async getNotPayInviteOrderSize() {
				let {
					code,
					data
				} = await this.$u.api.getNotPayInviteOrderSizeApi({})
				if (code == 0) {
					console.log(data)
					let {
						size
					} = data
					this.yaoOrderWaitPayNum = size
					this.status[1].num = this.yaoOrderWaitPayNum
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
					this.status[1].num = this.pingOrderWaitPayNum
					this.$forceUpdate()
				}
			},
			// 获取指定下标的mescroll对象
			getMescroll(i) {
				let mescrollItems = this.$refs['order-list'];
				if (mescrollItems) {
					let item = mescrollItems[i]
					if (item) return item.mescroll
				}
				return null
			},
			refresh(e) {
				let curMescroll = this.getMescroll(this.swiperCurrent)
				if (curMescroll) curMescroll && curMescroll.resetUpScroll()
			},
			// 查看详情
			detailTap: function(id) {
				this.lookDetail(id);
			},
			// tab栏切换
			change(index) {
				this.swiperCurrent = index;
				this.current = index;
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.swiperCurrent = current;
				this.current = current;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;

		.container {
			height: 100%;
			display: flex;
			flex-direction: column;

			.middle_box {
				flex: 1;
				min-width: 0;
				min-height: 0;

				display: flex;
				flex-direction: column;

				.order_list {
					flex: 1;
					min-width: 0;
					min-height: 0;

					.swiper-box {
						height: 100%;
						width: 100%;
						box-sizing: border-box;
						padding-top: 30rpx;

						.scroll {
							height: 100%;
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
						}
					}
				}
			}
		}

	}
</style>
