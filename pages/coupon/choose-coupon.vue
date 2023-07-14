<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="选择优惠券" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#16192B'
				}"
		 :border-bottom="false">
		</u-navbar>
		<view class="coupon-list">
			<view class="coupon-wrapper">
				<common-coupon v-for="(item, index) in pageList" :key="index" :coupon="item" @coupon="clickCoupon" :canSelect="true"
				 :selected="selectedCoupon.id == item.id ? true : false" :index="index"></common-coupon>
			</view>
		</view>
		<view class="footer_panel">
			<view @tap="clickBtn" class="btn" :class="{'green': selectedCoupon.id}">{{ btnText }}</view>
		</view>
	</view>

</template>
<script>
	// pages/choose-coupon/choose-coupon.js
	const app = getApp();
	const pageable = require('@/common/pageable.js')
	const cross = require('@/common/cross.js')
	import commonCoupon from "@/components/common-coupon/common-coupon"

	export default {
		data() {
			return {
				pageNumber: 0,
				pageSize: 10,
				pageList: [],
				productId: '',
				type:'',
				code:'',
				selectedCoupon: {},
				info:{},
			};
		},
		onLoad: function(options) {
			const info = JSON.parse(options.info)
			this.info = info;
			this.selectedCoupon = {
				id: this.info.couponId
			}
			this.getPage()
		},
		components: {
			commonCoupon
		},
		props: {},
		methods: {
			// 获得满足条件的优惠券列表
			getPage: function() {
				const params = {
					orderAmount: this.info.orderAmount,
					clubId: this.info.clubId
				}
				const url = '/api/coupon/canOrderUseCoupon'
				pageable.getPage(this, url, params, 'list',(res) => {
					console.log(res);
					uni.stopPullDownRefresh();
				})
			},
			
			clickCoupon: function(e) {
				const index = e.index
				const detail = e.detail
				let pageList = this.pageList
				for (let i in pageList) {
					if (i == index) {
						if (detail.selected) {
							this.selectedCoupon = {}
						} else {
							this.selectedCoupon = detail
						}
						break;
					}
				}
				this.pageList = pageList
			},
			clickBtn: function() {
				var beforePrice = 0;
				const beforePage = cross.beforePage()
				if (beforePage.route === 'pages/club/consumption/create_order') {
					cross.applyPageMethod(beforePage, 'setCoupon', this.selectedCoupon);
					uni.navigateBack()
				}
			}
		},
		computed: {
			btnText: function() {
				return this.selectedCoupon.id ? '使用该优惠券' : '不使用优惠券'
			}
		},
		watch: {}
	};
</script>
<style lang="scss" scoped>
	/* pages/choose-coupon/choose-coupon.css */

	page {
		min-height: 100%;
		background: #f3f3f3;
	}

	.container {
		padding-bottom: 80upx;
		min-height: 100%;
		background: #f3f3f3;
		box-sizing: border-box;
	}

	.coupon-list {
		padding: 20upx 0;
		width: 100%;
	}

	.coupon-wrapper {
		padding: 0 25upx;
	}
	.footer_panel{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		width: 100%;
		background: #FFFFFF;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
	.btn {
		width: 100%;
		box-sizing: border-box;
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		text-align: center;
		background: #FE7774;
		color: #fff;
		&.green{
			background: green;
		}
	}

	.btn.disabled {
		background: #ddd;
	}
</style>
