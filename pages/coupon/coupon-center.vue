<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="优惠券中心" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#191C3F'
				}"
		 :border-bottom="false">
		</u-navbar>
		<!-- <view class="write_off_box" :style="{'top': (offTop + 'px')}">
			<view class="write_input_box">
				<input type="text" v-model="couponCode" placeholder="请输入优惠码" value="" />
			</view>
			<view class="off_btn" @tap="writeOffCoupon" :class="{'effctive': couponCode }">
				<text>兑换</text>
			</view>
		</view> -->
		
		<block v-for="(item, index) of pageList" :key="item.id">
			<!-- <view class="couponlist" :class="{disable:item.checked}"> -->
			<view class="couponlist">
				<view class="coupon-type">{{item.type}}</view>
				<view class="coupon-title">{{item.name}}</view>
				<view class="coupon-used">{{item.introduce}}</view>
				<block>
					<view class="coupon-time">{{item.canUseDate}}</view>
				</block>
				<view class="coupon-btn" @tap="givecoupon" :data-id="item.id" v-if="!item.checked" :data-index="index">立即领取</view>
				<view class="coupon-btn" :data-id="item.id" v-else @tap="goPage(item)">去使用</view>
				<!-- <view class="coupon-btn" :data-id="item.id" v-else="">已领取</view> -->
			</view>
		</block>
		<view class="noticeMask" v-if="couponpop" @touchmove.stop="noticelongtap" @tap="couponpop = false"></view>
		<view class="tip-view" @longtap.stop="noticelongtap" @touchmove.stop.prevent="noticelongtap" v-if="couponpop">
			<coupon-pop @getcoupons="ongetCoupons"></coupon-pop>
		</view>
		<view class="no-result" v-if="pageList.length == 0">
			<image src="/static/imgs/common/empty-icon.png"></image>
			<text>空空如也</text>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	const pageable = require('@/common/pageable.js')
	import couponPop from '@/components/coupon-pop/coupon-pop.vue'
	export default {
		data() {
			return {
				//控制弹窗数据
				couponCode: '',
				lastReceiveIndex: -1,
				couponpop: false,
				pageNumber: 0,
				pageSize: 20,
				pageList: [],
				radio: uni.getSystemInfoSync().windowWidth / 750,
				offTop: 0,
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				
			};
		},
		onPullDownRefresh:function(){
			this.pageNumber = 0;
			this.getPageItem();
		},
		onReachBottom: function() {
			this.getPageItem();
		},
		onLoad: function(options) {
			this.getPageItem();
			this.offTop = this.statusBarHeight + 88 * this.radio;
		},
		onShow:function(){
			this.returnCoupon();
		},
		components: {
			couponPop
		},
		props: {},
		methods: {
			writeOffCoupon: function(){
				let code = this.couponCode;
				if(!code){
					uni.showToast({
						title: '请先输入优惠码',
						icon: 'none'
					})
					return
				}
				this.$api.writeOffCoupon(code).then(res => {
					console.log(res);
					this.couponpop = true;
					this.pageNumber = 0;
					this.getPageItem();
				}).catch(e => {
					console.log(e);
					if(e.msg){
						uni.showToast({
							title: e.msg,
							icon: 'none'
						})
					}
				})
			},
			goPage: function(item){
				let info = item;
				if(info.type == '酒吧券'){
					uni.navigateTo({
						url: '/pages/club/detail?id=' + info.clubId
					})
				}else{
					uni.navigateTo({
						url: '/pages/club/list?mode=list'
					})
				}
			},
			// 获取优惠列表
			getPageItem: function() {
				const url = '/api/coupon/canReceiveCoupon'
				pageable.getPage(this, url, {}, 'list',(res) => {
					console.log(res);
					uni.stopPullDownRefresh();
				})
			},
			// 得到优惠卷
			givecoupon: function(e) {
				this.$u.api.giveCouponApi(e.currentTarget.dataset.id).then(res => {
					if(parseInt(res.code) == 0){
						this.couponpop = true;
						this.switchBtn(e);
					}
				}).catch(err => {
					uni.showToast({
						title: err.msg,
						icon: "none"
					});
				})
			},
			switchBtn: function(e) {
				var pageList = this.pageList
				var index = e.currentTarget.dataset.index
				this.lastReceiveIndex = index;
				pageList[index].checked = true
				this.pageList = pageList
			},
			returnCoupon: function(){
				let lastReceiveIndex = this.lastReceiveIndex;
				var pageList = this.pageList
				if(lastReceiveIndex >= 0){
					pageList[lastReceiveIndex].checked = false;
					this.pageList = pageList
					this.$forceUpdate();
				}
			},
			goTouse: function() {
				this.$nav.switchTab({
					url: '/pages/index/index'
				});
			},
			// 模拟弹窗
			noticelongtap: function() {
				return;
			},
			ongetCoupons: function() {
				this.couponpop = false
			}
		},
		computed: {},
		watch: {}
	};
</script>
<style lang="scss">
	/* pages/coupon-conter/coupon-conter.css */
	page {
		min-height: 100%;
		/* background: #fff; */
	}
	.container {
		margin-top: 15upx;
		margin-bottom: 60upx;
		min-height: 100%;
		/* background: #fff; */
	}
	.write_off_box{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		position: sticky;
		z-index: 10;
		left: 0rpx;
		background: #FFFFFF;
	}
	.write_off_box .write_input_box{
		width: 500rpx;
		height: 70rpx;
		border-radius: 6rpx;
		border: 1px solid #cccccc;
		box-sizing: border-box;
		padding: 0 20rpx;
		display: flex;
		align-items: center;
	}
	.write_off_box .write_input_box>input{
		height: 66rpx;
		width: 100%;
		font-size: 26rpx;
	}
	.write_off_box .off_btn{
		line-height: 70rpx;
		width: 150rpx;
		margin-left: 30rpx;
		border-radius: 6rpx;
		text-align: center;
		background: #cccccc;
		color: #FFFFFF;
	}
	.write_off_box .off_btn.effctive{
		background: #ff1616;
	}
	.couponlist {
		width: 690upx;
		height: 180upx;
		margin: auto;
		margin-top: 25upx;
		background-image: url("https://vverp1.oss-cn-shanghai.aliyuncs.com//upload/image/202006/1daa93e3-6f6a-427b-a148-6e75414724bf.png");
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border-radius: 20rpx;
		overflow: hidden;
		position: relative;
	}
	.coupon-used{
		line-height: 60rpx;
		position: absolute;
		right: 30rpx;
		top: 0rpx;
		width: 300rpx;
		text-align: right;
		@include ellipsis();
		color: #FF1616;
		font-size: 24rpx;
	}
	.coupon-type{
		max-width: 180rpx;
		height: 60rpx;
		border-radius: 0 0 30rpx 0;
		background-color: #fee5e5;
		color: #FF1616;
		text-align: center;
		line-height: 60rpx;
		overflow: hidden;
		
	}
	.coupon-title{
		font-size: 28rpx;
		color: #333333;
		font-weight: 500;
		padding-top: 22rpx;
		padding-bottom: 6rpx;
		padding-left: 30rpx;
		padding-right: 210rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.coupon-time{
		font-size: 24rpx;
		color: #808080;
		padding-left: 30rpx;
	}
	.coupon-btn{
		width: 150rpx;
		line-height: 56rpx;
		border: 2rpx solid #ff1616;
		border-radius: 28rpx;
		position: absolute;
		bottom: 30rpx;
		right: 30rpx;
		font-size: 24rpx;
		color: #ff1616;
		text-align: center;
		line-height: 56rpx;
		box-sizing: border-box;
	}
	.noticeMask {
		position: fixed;
		height: 100%;
		width: 100%;
		display: flex;
		z-index: 8004;
		background-color: #000;
		opacity: 0.7;
		top: 0upx;
	}

	.tip-view {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 9000;
	}

	.no-result {
		display: flex;
		flex-direction: column;
		text-align: center;
		font-size: 28upx;
		color: #999;
		margin-top: 340upx;
	}

	.no-result image {
		width: 160upx;
		height: 160upx;
		margin: auto;
		margin-bottom: 20upx;
	}
</style>
