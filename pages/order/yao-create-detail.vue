<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="订单详情" title-size="36" title-color="#FFFFFF" :background="{
						'background': '#16192B'
					}" :border-bottom="false">
			</u-navbar>
		</view>

		<view class="middle_box">
			<view class="oerder_goods">
				<view class="goods_box">
					<view class="goods-title">酒水信息</view>
					<view class="common_goods_box" v-for="(info, index) in orderInfo.orderItemList" :key="index">
						<view class="goods-detail">
							<view class="goods_img">
								<image :src="info.cover" @tap="$u.throttle(previewImg(info.cover))"></image>
							</view>
							<view class="goods-right">
								<view class="goods_name"> <text>{{info.commodityName}}</text> </view>
								<view class="num_box">数量: <text> x{{info.buyNum}}</text> </view>

							</view>

						</view>
						<view class="price_info">
							<text>
								{{info.commodityPrice}}元</text>
						</view>
						<u-gap height="1" bgColor="rgba(255,255,255,0.1)"></u-gap>
					</view>
				</view>
				<view class="allPrice">
					<view class="common_info_item" style="margin-top: 20rpx;">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">订单总价:</text>
						</view>
						<view class="item_right">
							<text style="color: rgba(255,255,255,0.5);">{{orderInfo.totalAmount}}元</text>
						</view>
					</view>
					<view class="common_info_item" v-if="orderInfo.isCreator">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">实际付款：</text>
						</view>
						<view class="item_right">
							<text style="color:  rgba(255,255,255,0.5);font-size: 28rpx;"> <text
									style="font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;">
									{{orderInfo.amount}}</text>元 </text>
						</view>
					</view>
				</view>
			</view>
			<u-gap height="20" bgColor="#16192B"></u-gap>

			<block v-if="orderInfo.isCreator">
				<view class="order_info">
					<view class="other-messeage">其他信息</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">订单编号：</text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF; font-size: 28;">{{orderInfo.sn}}</text>
							<view class="copy_btn1" @tap="copyClipvoard(orderInfo.sn,'订单编号已复制')"> <text>复制</text>
							</view>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">核销码：</text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF; font-size: 28;">{{orderInfo.code}}</text>
							<view class="copy_btn2" @tap="$u.debounce(getQrCode, 600, true)"> <text>核销</text> </view>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">下单时间：</text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.orderTime}}</text>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">台位位置:</text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.cardTableName}}</text>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">下单人：</text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.name}}</text>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">手机号：</text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.phone}}</text>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">接待人: </text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.receptionistName}}</text>
						</view>
					</view>
					<view class="common_info_item">
						<view class="item_left">
							<text style="color: rgba(255,255,255,0.5);">备注要求: </text>
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.demo}}</text>
						</view>
					</view>
				</view>
				<u-gap height="20" bgColor="#16192B"></u-gap>
			</block>
			<view class="club_info" @tap="$u.throttle(goClub)">
				<view class="info_box">
					<view class="first_line">
						<view class="line">
							<view class="head">
								<view class="club_name"> <text>{{clubInfo.name}}</text> </view>
								<view class="info_eva">
									<view class="rate_box">
										<selfRate :score="clubInfo.avgScore" size="24"></selfRate>
									</view>
									<text>{{clubInfo.avgScore}} 评分</text>
								</view>
							</view>
							<view class="club_intro"> <text>{{clubInfo.subtitle}}</text> </view>
						</view>
					</view>
					<view class="info_label">
						<block v-for="(info, index) in clubInfo.labelList" :key="index">
							<view class="common_label"> <text>{{info}}</text> </view>
						</block>
					</view>
					<view class="clubPhoto">
						<image :src="clubPath">
						</image>
					</view>
					<view class="time-phone">
						<view class="info_open_time">
							<text class="title">营业时间</text>
							<text>{{clubInfo.businessHours?clubInfo.businessHours:'暂未填写'}}</text>
						</view>
						<view class="line_right">
							<view class="common_btn" @tap.stop="callPhone">
								<u-icon size="30" name="phone" color="rgba(255, 255, 255, 0.5)"></u-icon>
								<text>电话</text>
							</view>
						</view>
					</view>
					<u-gap height="1" bgColor="rgba(255,255,255,0.1)"></u-gap>
				</view>
			</view>
			<block v-if="orderInfo.isCreator">
				<view class="service_box">
					<view class="service_left">
						<image src="/static/imgs/common/service-fill.png"></image>
						<view class="service_text">
							<view class="service_text1">客服小助手</view>
							<view class="service_text2"></view>
						</view>
					</view>
					<view class="service_btn" @tap="$u.throttle(serviceTap)">联系客服</view>
				</view>
			</block>
		</view>

		<block v-if="orderInfo.isCreator">
			<view class="foot_box" v-if="orderInfo.status=='paying'">
				<view class="common_btn" @tap="tapCancel"> <text>取消订单</text> </view>
				<view class="common_btn color" @tap="$u.throttle(statementShowTap)" v-if="chatTag"> <text>去付款</text>
				</view>
				<view class="common_btn color" @tap="$u.throttle(goPay)" v-else> <text>去付款</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='noShop'">
				<!-- <view class="common_btn" @tap="$u.throttle(tapBill)" v-if="canBill"> <text>开票</text> </view> -->
				<!-- <view class="common_btn" @tap="$u.throttle(tapRefund)" v-if="canRefund"> <text>退款</text> </view> -->
				<view class="common_btn" @tap="$u.throttle(tapGoYaoyue)"> <text>去邀约</text> </view>
				<view class="common_btn color" @tap="tapArrive"> <text>确认到店</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='expired'">
				<!-- <view class="common_btn" @tap="$u.throttle(tapGoYaoyue)"> <text>去邀约</text> </view> -->
				<view class="common_btn" @tap="$u.throttle(rescheduleHandle)"> <text>改期</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='arrived'">
				<!-- <view class="common_btn" @tap="$u.throttle(tapBill)" v-if="canBill"> <text>开票</text> </view> -->
				<view class="common_btn" v-if="orderInfo.canFetch " @tap="$u.throttle(tapFetchWIne)"> <text>取酒</text>
				</view>
				<view class="common_btn" @tap="$u.throttle(tapGoYaoyue)"> <text>去邀约</text> </view>
				<view class="common_btn color" @tap="$u.throttle(tapGoAddWine)"> <text>加单酒水</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='comment'">
				<!-- <view class="common_btn" @tap="$u.throttle(tapBill)" v-if="canBill"> <text>开票</text> </view> -->
				<view class="common_btn color"
					@tap="$u.throttle($u.route('/pages/order/evaluation',{orderId:orderId}))"> <text>我要评价</text> </view>
				<view class="common_btn" @tap="tapDelete"> <text>删除</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='complete'">
				<!-- <view class="common_btn" @tap="$u.throttle(tapBill)" v-if="canBill"> <text>开票</text> </view> -->
				<view class="common_btn" @tap="tapDelete"> <text>删除</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='cancel'">
				<!-- <view class="common_btn" @tap="tapDelete"> <text>删除</text> </view> -->
			</view>
			<view class="foot_box" v-if="orderInfo.status=='refund'">
				<!-- <view class="common_btn" @tap="tapDelete"> <text>删除</text> </view> -->
			</view>
		</block>

		<block v-else>
			<block v-if="orderInfo.isJoin">
				<view class="foot_box" v-if="orderInfo.status=='noShop'">
					<view class="common_btn color" @tap="$u.throttle(tapQuitYao)"> <text>退出邀约</text> </view>
				</view>
				<view class="foot_box" v-if="orderInfo.status=='arrived'">
					<view class="common_btn color" @tap="$u.throttle(tapQuitYao)"> <text>退出邀约</text> </view>
					<view class="common_btn color" @tap="$u.throttle(tapGoAddWine)"> <text>加单酒水</text> </view>
				</view>
				<view class="foot_box" v-if="orderInfo.status=='comment'">
					<view class="common_btn color"
						@tap="$u.throttle($u.route('/pages/order/evaluation',{orderId:orderId}))"> <text>我要评价</text>
					</view>
					<view class="common_btn" @tap="tapDelete"> <text>删除</text> </view>
				</view>
			</block>
		</block>

		<statementPop ref="statementPopRef" btnText="去付款" @btnTap="statementSelectTap"></statementPop>
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	import statementPop from '@/components/chatStatement/chatStatement.vue'
	import countdownMixins from '@/mixins/limit.js'
	var timeInterval = null;
	export default {
		components: {
			selfRate,
			statementPop
		},
		mixins: [countdownMixins],
		data() {
			return {
				orderId: -1,
				inviteId: -1,
				clubInfo: {
					bannerList: [],
				},
				orderInfo: {},
				canRefund: false,
				canBill: false,
				chatTag: false,
				chatParams: "",
				statement: '',
				minutes: '00',
				seconds: '00',
				clubPath: ''
			}
		},
		onLoad: function(opt) {
			console.log(opt)
			this.orderId = opt.orderId
			this.clubPath = opt.imagePath
			this.load()
			uni.$on('yao-order-detail-refresh', this.load)
			uni.$on('fetch-wine', this.load)
		},
		onUnload() {
			uni.$off('yao-order-detail-refresh', this.load)
			uni.$off('fetch-wine', this.load)
			if (timeInterval) {
				clearInterval(timeInterval);
			}
		},
		methods: {
			// 改期按钮事件
			rescheduleHandle() {
				this.$u.route('/pages/order/reschedule/seat', {
					orderId: this.orderId,
					orderType: 'yaoyue',
					clubId: this.clubInfo.clubId
				})
			},
			timeIntervalEnd() {
				if (timeInterval) {
					clearInterval(timeInterval);
				}
				this.orderInfo.status = 'cancel';
			},
			statementShowTap() {
				this.$refs.statementPopRef.show();
			},
			statementSelectTap(e) {
				this.statement = e;
				this.goPay();
			},
			goPay() {
				let params = {
					allAmount: this.orderInfo.totalAmount,
					orderId: this.orderId,
					type: 'yao-order',
					chatTag: false,
				}
				if (this.chatTag) {
					let chatParams = this.chatParams;
					chatParams['statement'] = this.statement;
					params.chatTag = true;
					params['chatParams'] = encodeURIComponent(JSON.stringify(chatParams));;
				}
				this.$u.route('/pages/club/consumption/payPage', params);
			},
			goInfo() {
				if (this.orderInfo.isCreator) {
					this.$u.route('/pages/mine/personalSetting/personalSetting');
				} else {
					this.$u.route('/pages/mine/dynamic/myDynamic', {
						id: this.orderInfo.sponsorId
					});
				}
			},
			goClub() {
				this.$u.route('/pages/club/detail', {
					id: this.clubInfo.clubId
				})
			},
			serviceTap() {
				let clubId = this.clubInfo.clubId;
				this.$u.api.clubServiceAPI(clubId).then(res => {
					console.log(res);
					if (res.data.hasStaff) {
						this.$u.route('/pages/customerRoom/index', {
							id: res.data.id,
							avatar: res.data.avatar,
							nickname: res.data.nickname
						});
					} else {
						uni.showToast({
							title: '暂无客服人员',
							icon: 'none'
						})
					}
				}).catch(e => {
					console.log(e);
				})
			},
			tapBill() {
				this.$u.route('/pages/order/bill/add', {
					orderId: this.orderId
				});
			},
			getQrCode() {
				let code = this.orderInfo.code;
				if (code) {
					let img = 'https://ercode.vverp.com/code?text=' + code;
					uni.previewImage({
						current: 0,
						urls: [img],
					})
				} else {
					this.$u.toast('暂无核销码')
				}
			},
			tapFetchWIne() {
				this.$u.route('/pages/order/fetch-wine', {
					orderId: this.orderId,
				})
			},
			// 退出邀约
			async tapQuitYao() {
				await this.$toast.confirm('', '确定要退出邀约？')
				let {
					code
				} = await this.$u.api.quitInviteOrderApi({
					inviteId: this.inviteId
				})
				if (code == 0) {
					this.$toast.text('退出成功！')
					uni.$emit('order-list-refresh')
					this.load()
				}
			},
			// 加单酒水
			tapGoAddWine() {
				this.$u.route('/pages/order/add-wine', {
					orderId: this.orderId,
					clubId: this.clubInfo.clubId,
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
					orderId: this.orderId,
				})
				if (code == 0) {
					this.$toast.text('到店成功！')
					uni.$emit('order-list-refresh')
					this.load()
				}

			},
			async tapRefund() {
				await this.$toast.confirm('', '确定要退款吗？')
				let {
					code
				} = await this.$u.api.refundInviteOrderApi({
					id: this.orderInfo.id
				})
				if (code == 0) {
					this.$toast.text('退款成功！具体退款时间请以实际情况为准')
					uni.$emit('order-list-refresh')
					this.load()
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
					orderId: this.orderId,
				})
				if (code == 0) {
					uni.$emit('pay-order-refresh')
					uni.$emit('order-list-refresh')
					this.load()
					this.$toast.text('取消成功！')
				}

			},
			async tapDelete() {
				await this.$toast.confirm('', '确定要删除该订单？')
				let {
					code
				} = await this.$u.api.hideYaoOrderApi({
					inviteId: this.inviteId
				})
				if (code == 0) {
					this.$toast.text('删除成功！')
					uni.$emit('order-list-refresh')
					setTimeout(() => {
						this.$u.route({
							type: 'back'
						})
					}, 500)
				}
				// this.deleteYaoOrder()
			},
			async deleteYaoOrder() {
				let {
					code
				} = await this.$u.api.deleteYaoOrderApi({
					inviteId: this.inviteId
				})
				if (code == 0) {
					this.$toast.text('删除成功！')
					uni.$emit('order-list-refresh')
					setTimeout(() => {
						this.$u.route({
							type: 'back'
						})
					}, 500)
				}
			},
			// 拨打电话
			callPhone: function() {
				uni.makePhoneCall({
					phoneNumber: this.clubInfo.phone
				})
			},
			load() {
				this.getInviteOrderView()
			},
			async getInviteOrderView() {
				let {
					code,
					data
				} = await this.$u.api.getInviteOrderView({
					orderId: this.orderId,
				})
				console.log(data)
				this.clubInfo = data.pingOrderViewVo.clubSimpleInfoVo
				this.canRefund = data.canRefund;
				this.canBill = data.pingOrderViewVo.canBill;
				this.orderInfo = data.pingOrderViewVo
				let orderInfo = data.pingOrderViewVo;
				if (orderInfo.saveInviteUser && orderInfo.isCreator) {
					this.chatTag = true;
					let chatParams = {
						type: 'yaoyue',
						friendInfo: {
							chatToken: orderInfo.saveInviteUser.chatToken,
							name: orderInfo.saveInviteUser.nickName,
							avatar: orderInfo.saveInviteUser.avatar,
							userId: orderInfo.saveInviteUser.id,
							chatUserId: orderInfo.saveInviteUser.chatUserId
						},
						orderInfo: {
							id: this.orderId,
							clubCover: orderInfo.clubSimpleInfoVo.clubCover,
							clubName: orderInfo.clubSimpleInfoVo.name,
							date: orderInfo.arriveTime,
							cardTableName: orderInfo.cardTableName
						}
					}
					this.chatParams = chatParams;
				}
				if (this.orderInfo.isJoin) {
					this.inviteId = this.orderInfo.inviteId
				}
				if (this.orderInfo.status == 'paying') {
					this.startCoundDonw(this.orderInfo.payEndTimestamp)
				}
			},
			startCoundDonw(endTime) {
				timeInterval = setInterval(() => {
					this.countdown(endTime);
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.middle_box {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16rpx;
		margin-left: 32rpx;
		margin-right: 32rpx;
		overflow-y:auto;
		padding-bottom: 140rpx;
		
		.order_status_text {
			width: 100%;
			height: 112rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			box-sizing: border-box;

			&>image {
				height: 30rpx;
				width: 30rpx;
				border-radius: 50%;
			}

			&>text {
				font-size: 34rpx;
				color: #FFFFFF;
			}
		}

		.club_info {
			width: 100%;
			border-radius: 16rpx;
			position: relative;

			.club_img {
				width: 100%;
				height: 435rpx;
				background: #16192B;
			}

			.info_box {
				width: 100%;
				box-sizing: border-box;
				padding: 30rpx;

				.first_line {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.line {
						.head {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							place-items: center;
							gap: 20rpx;

							.club_name {
								font-size: 40rpx;
								color: #FFFFFF;
								font-weight: 500;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}

							.info_eva {
								// position: absolute;
								// right: 20rpx;
								height: 60rpx;
								display: flex;
								align-items: center;
								color: #832DFF;
								font-size: 26rpx;

								&>text {
									margin-left: 14rpx;
								}
							}
						}

						.club_intro {
							font-size: 28rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(255, 255, 255, 0.5);
							line-height: 40rpx;
						}
					}
				}

				.info_label {
					width: 100%;
					display: flex;
					align-items: center;
					margin: 16rpx 0rpx;
					flex-wrap: wrap;

					.common_label {
						height: 40rpx;
						@include flex-center();
						border-radius: 2rpx;
						padding: 0 10rpx;
						border: 1px solid #16192B;
						border-radius: 8rpx;
						color: #FFFFFF;
						font-size: 20rpx;
						margin-right: 10rpx;
						margin-bottom: 12rpx;
					}
				}

				.clubPhoto {
					width: 638rpx;
					height: 280rpx;
					margin-bottom: 30rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.time-phone {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					place-items: center;

					.info_open_time {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: rgba(255, 255, 255, 0.5);

						.title {
							margin-right: 20rpx;
						}
					}

					.line_right {
						.common_btn {
							display: flex;
							flex-direction: row;
							place-items: center;

							&>image {
								height: 28rpx;
								width: 28rpx;

							}

							&>text {
								color: rgba(255, 255, 255, 0.5);
								font-size: 28rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								line-height: 95rpx;
								flex-shrink: 0;
								position: relative;
								top: -3rpx;
							}
						}
					}
				}
			}
		}


		.service_box {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0rpx 30rpx;

			.service_left {
				display: flex;
				align-items: center;

				&>image {
					height: 60rpx;
					width: 60rpx;
					border-radius: 50%;
				}

				.service_text {
					margin-left: 20rpx;
					color: #FFFFFF;
					font-size: 28rpx;

					.service_text1 {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: rgba(255, 255, 255, 0.5);
						line-height: 40rpx;
						;
					}
				}
			}

			.service_btn {
				line-height: 54rpx;
				border-radius: 32rpx;
				border: 1rpx solid rgba(255, 255, 255, 0.5);
				box-sizing: border-box;
				padding: 10rpx 20rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(255, 255, 255, 0.5);
				line-height: 40rpx;
			}
		}

		.order_info {
			margin-top: 30rpx;

			.other-messeage {
				font-size: 30rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 42rpx;
				margin-left: 32rpx;
			}
		}

		.common_info_item {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-height: 64rpx;

			.item_left {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				margin-left: 30rpx;
			}

			.item_right {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				margin-right: 30rpx;
			}
		}

		.user-list {
			width: 100%;
			@include height-center();
			padding: 10rpx 30rpx;

			.user-list-item {
				flex: 1;
				min-width: 0;
				@include height-center();

				.title {
					font-size: 26rpx;
					color: rgba(255, 255, 255, 0.5);
					margin-right: 10rpx;
				}

				.avatar {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 10rpx;
				}

				.name {
					flex: 1;
					min-width: 0;
					@include ellipsis();
					color: #FFFFFF;
					margin-right: 20rpx;

				}
			}
		}

		.textarea-info-item {
			width: 100%;
			display: flex;
			padding: 10rpx 30rpx;

			.left {
				text {
					color: rgba(255, 255, 255, 0.5);
					font-size: 26rpx;
				}
			}

			.right {
				flex: 1;
				min-width: 0;
				padding-left: 40rpx;
				text-align: right;

				text {
					color: #FFFFFF;
					font-size: 26rpx;
				}
			}
		}

		.order_club {
			width: 100%;
			padding: 30rpx 0rpx;
			box-sizing: border-box;
		}

		.oerder_goods {
			width: 100%;
			height: auto;
			padding-bottom: 20rpx;
			border-radius: 16rpx;

			.goods_box {
				width: 100%;
				padding: 0 30rpx;
				display: flex;
				place-items: center;
				flex-direction: column;
				justify-content: space-between;

				.goods-title {
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 42rpx;
					position: relative;
					right: 40.5%;
					margin-top: 20rpx;
				}

				.common_goods_box {
					width: 100%;
					position: relative;
					margin: 20rpx 0;

					.price_info {
						position: absolute;
						right: 0rpx;
						top: -10rpx;

						text {
							font-size: 32rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #FFFFFF;
						}
					}

					.goods-detail {
						display: flex;
						flex-direction: row;
						padding-bottom: 25rpx;
						width: 500rpx;

						.goods_img {
							width: 160rpx;
							height: 160rpx;
							flex-shrink: 0;
							margin-right: 100rpx;

							&>image {
								height: 100%;
								width: 100%;
								border-radius: 12rpx;
							}
						}

						.goods-right {
							display: flex;
							flex-direction: column;
							gap:20rpx;
							position: relative;
							right:50rpx;
							.goods_name {
								font-size: 30rpx;
								line-height: 30rpx;
								color: #FFFFFF;
								width: 100%;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							.num_box {
								width: 272rpx;
								height: 40rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-size: 28rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: rgba(255,255,255,0.5);
								line-height: 40rpx;
								text{
									margin-left:20rpx;
								}	
							}
						}
					}
				}
			}

			.allPrice {
				margin-top: 0rpx;

				.common_info_item {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					// min-height: 64rpx;

					.item_left {
						display: flex;
						align-items: center;
						font-size: 26rpx;
					}

					.item_right {
						display: flex;
						align-items: center;
						font-size: 26rpx;
					}
				}
			}
		}

		.order_info {
			padding-bottom: 20rpx;
			border-radius: 16rpx;
			border-radius: 16rpx;

			.copy_btn2 {
				line-height: 36rpx;
				text-align: center;
				width: 76rpx;
				font-size: 20rpx;
				color: #FFFFFF;
				margin-left: 30rpx;
				background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
				border-radius: 40rpx;
			}

			.copy_btn1 {
				line-height: 36rpx;
				text-align: center;
				width: 76rpx;
				font-size: 20rpx;
				color: #AB3BFF;
				margin-left: 30rpx;
				border-radius: 40rpx !important;
				border: 1px solid;

			}
		}
	}

	.foot_box {
		width: 100%;
		display: flex;
		align-items: center;
		height: 120rpx;
		border-bottom: 1px solid #242854;
		position: fixed;
		bottom: 0rpx;
		z-index: 100rpx;
		background: $uni-title-color;
		.common_btn {
			flex: 1;
			margin: 0 20rpx;
			height: 80rpx;
			width: 320rpx;
			@include flex-center();
			border-radius: 40rpx;
			border: 1px solid #7B7E9D;
			color: #FFFFFF;
			background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
			&.color {
				background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
				// background: red;
				border: 0rpx;
				color: #FFFFFF;
			}
		}
	}
</style>