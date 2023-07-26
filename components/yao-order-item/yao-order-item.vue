<template>
	<view class="order_box" @tap="$u.throttle(tapGoDetail(info))">
		<view class="order_info">
			<view class="fri-part">
				<view class="info_img">
					<image :src="info.clubCover"></image>
				</view>
				<view class="info_box">
					<view class="name_price">
						<view class="info_name"> <text>{{info.clubName}}</text> </view>
						<view class="info_status"> <text>{{getOrderStatus(info.status)}}</text> </view>
						<view class="info_price"> <text>{{info.originalWineCoin}}元</text> </view>
					</view>
					<view class="item_info">
						<view class="item_info_label" style="color: rgba(255,255,255,0.5);">预约时间：</view>
						<view class="item_info_text">{{info.date}}</view>
					</view>
					<view class="item_info">
						<view class="item_info_label" style="color: rgba(255,255,255,0.5);">台位位置：</view>
						<view class="item_info_text">{{info.cardTableName}} 卡台</view>
					</view>
					<view class="item_info">
						<view class="item_info_label" style="color: rgba(255,255,255,0.5);">参与人数：</view>
						<view class="item_info_text">{{info.joinPersonNumber}}人</view>
					</view>
				</view>
			</view>

			<view class="order_btn"
				v-if="deleteShow || goPayShow||cancelOrderShow||commentShow||arriveShow||yaoyueShow||addWineShow||quiteOrderShow||fetchWineShow || rescheduleShow">
				<view class="common_btn" v-if="fetchWineShow" @tap.stop="$u.throttle(tapFetchWine)"> <text>取酒</text>
				</view>
				<view class="common_btn" v-if="rescheduleShow" @tap.stop="$u.throttle(rescheduleHandle)">
					<text>改期</text>
				</view>
				<block v-if="goPayShow">
					<view class="common_btn"  v-if="chatTag" @tap.stop="$u.throttle(statementPopShowTap)">去付款
					</view>
					<view class="common_btn"  v-else @tap.stop="$u.throttle(goPay)">去付款</view>
				</block>
				<view class="common_btn" v-if="deleteShow" @tap.stop="$u.throttle(tapGoDelete)"> <text>删除</text> </view>
				<view class="common_btn" v-if="cancelOrderShow" @tap.stop="tapCancel"> <text>取消订单</text> </view>
				<view class="common_btn" v-if="commentShow"
					@tap.stop="$u.throttle($u.route('/pages/order/evaluation',{orderId:info.id}))"> <text>评价</text>
				</view>
				<view class="common_btn" v-if="arriveShow" @tap.stop="tapArrive"> <text>确认到店</text> </view>
				<view class="common_btn" v-if="yaoyueShow" @tap.stop="$u.throttle(tapGoYaoyue)"> <text>去邀约</text>
				</view>
				<view class="common_btn" v-if="addWineShow" @tap.stop="$u.throttle(tapGoAddWine)"> <text>加单酒水</text>
				</view>
				<view class="common_btn" v-if="quiteOrderShow" @tap.stop="$u.throttle(tapQuitYao)"> <text>退出邀约</text>
				</view>
				<!-- <view class="common_btn" v-if="canRefund" @tap.stop="$u.throttle(tapRefundOrder)"> <text>退款</text> </view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import orderUtils from '@/common/orderUtils.js'
	export default {
		props: {
			info: {
				type: Object,
				default: {},
			},
		},
		computed: {
			rescheduleShow() { // 是否能改期
				return (this.info.status == 'expired' && this.info.isCreator)
			},
			chatTag() { // 是否存在聊天
				return (this.info.saveInviteUser && this.info.isCreator)
			},
			canRefund() { //退款
				return this.info.canRefund
			},
			fetchWineShow() { //取酒
				return (this.info.status == 'arrived') && (this.info.canFetch) && this.info.isCreator
			},
			quiteOrderShow() { //退出邀约按钮
				return (this.info.status == 'noShop' || this.info.status == 'arrived') && !this.info.isCreator
			},
			addWineShow() { //添加酒水按钮
				return this.info.status == 'arrived'
			},
			yaoyueShow() { //邀约按钮
				return (this.info.status == 'noShop' || this.info.status == 'arrived') && this.info.isCreator
			},
			deleteShow() { //删除按钮 非创造者
				return (this.info.status == 'complete' || this.info.status == 'comment')
			},
			goPayShow() { //去付款按钮
				return (this.info.status == 'paying') && this.info.isCreator
			},
			cancelOrderShow() { //取消订单按钮
				return (this.info.status == 'paying') && this.info.isCreator
			},
			commentShow() { //评价按钮
				return this.info.status == 'comment'
			},
			arriveShow() { //到店按钮
				return (this.info.status == 'noShop') && this.info.isCreator
			},
		},
		methods: {
			rescheduleHandle() { // 改期逻辑
				this.$u.route('/pages/order/reschedule/seat', {
					orderId: this.info.id,
					orderType: 'yaoyue',
					clubId: this.info.clubId
				})
			},
			statementPopShowTap() {
				this.$emit('statementPopShowTap', this.info);
			},
			goPay() {
				orderUtils.goPay(this, 'yaoyue', this.info);
			},
			async tapFetchWine() {
				this.$u.route('/pages/order/fetch-wine', {
					orderId: this.info.id,
				})
			},
			async tapRefundOrder() {
				await this.$toast.confirm('', '确定要退款吗？')
				let {
					code
				} = await this.$u.api.refundInviteOrderApi({
					id: this.info.id
				})
				if (code == 0) {
					this.$toast.text('退款成功！具体退款时间请以实际情况为准')
					uni.$emit('order-list-refresh')
				}
			},
			async tapQuitYao() {
				await this.$toast.confirm('', '确定要退出邀约？')
				let {
					code
				} = await this.$u.api.quitInviteOrderApi({
					inviteId: this.info.inviteId
				})
				if (code == 0) {
					this.$toast.text('退出成功！')
					uni.$emit('order-list-refresh')
				}
			},
			tapGoAddWine() {
				this.$u.route('/pages/order/add-wine', {
					orderId: this.info.id,
					clubId: this.info.clubId,
				})
			},
			tapGoYaoyue() {
				this.$u.route({
					type: 'reLaunch',
					url: '/pages/index/index',
					params: {
						goFind: true
					}
				})
			},
			async tapArrive() {
				await this.$toast.confirm('', '确定已经到店？')
				this.arriveOrder()
			},
			async arriveOrder() {
				let {
					code
				} = await this.$u.api.arriveOrderApi({
					orderId: this.info.id,
				})
				if (code == 0) {
					this.$toast.text('到店成功！')
					uni.$emit('order-list-refresh')
				}

			},
			async tapCancel() {
				await this.$toast.confirm('', '确定要取消该订单？')
				this.cancelOrder()
			},
			async cancelOrder() {
				let {
					code
				} = await this.$u.api.cancelOrderApi({
					orderId: this.info.id,
				})
				if (code == 0) {
					uni.$emit('pay-order-refresh')
					uni.$emit('order-list-refresh')
					this.$toast.text('取消成功！')
				}

			},
			// 隐藏
			async tapGoDelete() {
				await this.$toast.confirm('', '确定要删除该订单？')
				let {
					code
				} = await this.$u.api.hideYaoOrderApi({
					inviteId: this.info.inviteId
				})
				if (code == 0) {
					uni.$emit('order-list-refresh')
					this.$toast.text('删除成功！')
				}
			},
			// 删除
			async tapDelete() {
				await this.$toast.confirm('', '确定要删除该订单？')
				this.deleteYaoOrder()
			},
			async deleteYaoOrder() {
				let {
					code
				} = await this.$u.api.deleteYaoOrderApi({
					inviteId: this.info.inviteId
				})
				if (code == 0) {
					uni.$emit('order-list-refresh')
					this.$toast.text('删除成功！')
				}
			},
			tapGoDetail(info) {
				if (info.isCreator) {
					this.$u.route('/pages/order/yao-create-detail', {
						orderId: info.id,
						imagePath: info.clubCover
					})
				} else {
					this.$u.route('/pages/order/yao-invited-detail', {
						orderId: info.id,
						imagePath: info.clubCover
					})
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.order_box {
		width: 100%;
		background: #16192B;

		.order_info {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			border-radius: 16rpx;
			border: 2rpx solid rgba(255, 255, 255, 0.05);
			background: rgba(255, 255, 255, 0.05);
			// box-sizing: border-box;
			padding: 0rpx 20rpx 10rpx 10rpx;
			position: relative;
			display: flex;
			flex-direction: column;

			.fri-part {
				display: flex;
				flex-direction: row;
				position: relative;
				left: 20rpx;

				.info_img {
					width: 200rpx;
					height: 200rpx;
					margin-top: 30rpx;
					border-radius: 6rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.info_box {
					margin-top: 26rpx;
					width: 100%;
					position: relative;
					left: 25rpx;
					display: flex;
					flex-direction: column;
					padding-right: 24rpx;

					.name_price {
						display: flex;
						align-items: center;
						flex-direction: row;
						font-family: PingFangSC-Medium, PingFang SC;
						font-size: 32rpx;
						color: #FFFFFF;
						font-weight: 500;

						.info_status {
							border: 1px solid rgba(255, 255, 255, 0.05);
							border-radius: 8rpx;
							background-color: rgba(255, 255, 255, 0.10);
							padding: 1rpx 1rpx 1rpx 1rpx;
							position: relative;
							top: 4rpx;
							height: 28rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							text {
								font-size: 20rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #FFFFFF;
								position: relative;
								top: -20rpx;

							}
						}

						.info_name {
							height: 42rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							text {
								font-size: 30rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #FFFFFF;
							}

							margin-right: 20rpx;
						}

						.info_price {
							height: 44rpx;
							font-size: 32rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #FFFFFF;
							line-height: 44rpx;
							position: absolute;
							right: 50rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.item_info {
						display: flex;
						align-items: center;
						position: relative;
						top: 45rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						line-height: 40rpx;
						font-size: 26rpx;
						color: rgba(255, 255, 255, 0.5);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}



			.order_btn {
				margin-top: 24rpx;
				border-top: 1px solid rgba(255, 255, 255, 0.05);
				width: 637rpx;
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				padding-top: 25rpx;
				position: relative;
				right: 10rpx;
				left: 20rpx;

				.common_btn {
					height: 62rpx;
					background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
					border-radius: 36rpx;
					text-align: center;
					
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					margin-left: 40rpx;
					margin-bottom: 15rpx;
					padding-left: 40rpx;
					padding-right: 40rpx;
					padding-top:14rpx;
					color: #FFFFFF;
					text {
						font-size: 30rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #FFFFFF;
						line-height: 32rpx;
					}
				}
			}
		}
	}
</style>