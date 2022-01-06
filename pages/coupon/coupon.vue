<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="我的优惠券" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#191C3F'
				}"
		 :border-bottom="false">
		</u-navbar>
		<view class="topbar">
			<classify fontSize="28" bgColor="#191C3F" ref="tabs" :list="status" :current="currentIndex" @change="clickTopTar" :is-scroll="false"
			 swiperWidth="750" inactiveColor="#B7B9D6" activeColor="#ffffff" :activeItemStyle="{
				 'font-size': '34rpx'
			 }"></classify>
			<!-- <view data-status="unused" @tap="clickTopTar" class="item" :class=" currentIndex === 'unused' ? 'active' : '' ">可使用({{unused}})</view>
			<view data-status="used" @tap="clickTopTar" class="item" :class=" currentIndex === 'used' ? 'active' : '' ">已使用({{used}})</view>
			<view data-status="expired" @tap="clickTopTar" class="item" :class=" currentIndex === 'expired' ? 'active' : '' ">已过期({{expired}})</view> -->
		</view>

		<view class="main">
			<view class="coupon-wrapper">
				<common-coupon :btnShow="true" :status="currentStatus" v-for="(item, index) in pageList" :key="index" :coupon="item"></common-coupon>
			</view>
			<view class="no-coupon" v-if="noResult">
				<view class="img">
					<image src="/static/imgs/coupon/unll.png"></image>
				</view>
				<view class="title">每个月都有领券活动哦 ！</view>
			</view>
		</view>
		<view v-if="noResult || !more" class="btn" @tap="goToCouponconter">
			<!-- <image src="/static/imgs/coupon.png" class="img"></image> -->
			<view>去领劵中心逛逛>></view>
		</view>

		<view class="loading-wrapper" v-if="loading">
			<loading></loading>
		</view>
	</view>
</template>
<script>
	// pages/coupon/coupon.js
	const pageable = require('@/common/pageable.js');
	import commonCoupon from "@/components/common-coupon/common-coupon";
	import loading from "components/loading/loading";

	export default {
		data() {
			return {
				currentIndex: 0,
				expired: 0,
				unused: 0,
				used: 0,
				pageNumber: 0,
				pageSize: 20,
				loading: false,
				noResult: false,
				more: true,
				pageList: [],
				status:[
					{
						"name": '可使用',
						'value': 'unused',
					},
					{
						"name": '已使用',
						'value': 'used',
					},
					{
						"name": '已过期',
						'value': 'expired',
					},
					
				]
			}
		},
		onShow: function() {
			this.pageNumber = 0
			this.getPageItem()
		},
		onReachBottom: function() {
			this.getPageItem();
		},
		onLoad: function(options) {},
		components: {
			commonCoupon,
			loading
		},
		computed: {
			currentStatus() {
				return this.status[this.currentIndex].value;
			}
		},
		props: {},
		methods: {
			clickTopTar: function(e) {
				if (this.currentIndex === e) {
					return
				}
				this.currentIndex = e;
				this.pageNumber = 0
				this.getPageItem()
			},
			goToCouponconter: function() {
				this.$nav.navigateTo({
					url: '/pages/coupon/coupon-center'
				});
			},
			getPageItem: function() {
				const url = '/api/coupon/myCouponList'
				const params = {
					statusEnum: this.currentStatus,
				}
				pageable.getPage(this, url, params, 'list', res => {
					this.expired = res.expired
					this.unused = res.unused
					this.used = res.used
				})
			}
		}
	};
</script>
<style lang="scss">
	page {
		min-height: 100%;
		background: #f3f3f3;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100%;
		// background: #f3f3f3;
	}

	.topbar {
		display: flex;
		margin-bottom: 35upx;
		width: 100%;
		height: 90upx;
		line-height: 90upx;
		background: #fff;
		// box-shadow: 0 2px 4px 0 rgba(204, 204, 204, 0.50);
	}

	.topbar .item {
		margin: 0 40upx;
		box-sizing: border-box;
		flex: 1;
		text-align: center;
		font-size: 28upx;
		color: #323232;
	}

	.topbar .item.active {
		color: #ff59c9;
	}

	.main {
		width: 100%;
	}


	.no-coupon {
		width: 100%;
		height: 475upx;
	}

	.no-coupon .img {
		width: 360upx;
		height: 200upx;
		margin-top: 100upx;
		margin-left: 180upx;
	}

	.no-coupon .img image {
		width: 100%;
		height: 100%;
	}

	.no-coupon .title {
		font-size: 30upx;
		color: #999;
		text-align: center;
		margin-top: 45upx;
	}

	.btn {
		width: 590upx;
		height: 80upx;
		line-height: 80upx;
		margin-bottom: 35upx;
		border: 1upx solid #ff59c9;
		border-radius: 12upx;
		color: #ff59c9;
		font-size: 30upx;
		text-align: center;
	}

	.btn .img {
		width: 35upx;
		height: 30upx;
		margin-left: 150upx;
	}

	.loading-wrapper {
		position: fixed;
		display: flex;
		justify-content: center;
		width: 100%;
		top: 50%;
		transform: translateY(-50%)
	}
</style>
