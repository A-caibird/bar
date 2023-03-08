<template>
	<view class="page-wrap">
		<view class="list-wrap">
			<scroll-view scroll-y="true" style="height: 100%;">
				<view style="margin-top: 30rpx;" v-for="(info, index) in list" :key="info.id">
					<yao-order-item-invite v-if="info.type=='yao'" :isSelect="selectIndex==index" :info="info"
						@selectOrder="selectOrder"></yao-order-item-invite>
					<ping-order-item-invite v-if="info.type=='ping'" :isSelect="selectIndex==index" :info="info"
						@selectOrder="selectOrder"></ping-order-item-invite>
				</view>
			</scroll-view>
		</view>
		<pop-common v-if="popShow" title='提示' content='您当前没有可以用来邀约尬酒的订单！' confirmText='打个招呼' cancelText='立马下单'
			@confirm="confirmEvent" @cancel="cancelEvent" @maskTap="maskEvent"></pop-common>
		<statementPop ref="statementPopRef" @btnTap="sendYaoyueStatement"></statementPop>
		<view class="btn" @tap="$u.throttle(tapSubmit)" :class="{'active': selectIndex!=-1}" type="default">确认邀请</view>
	</view>


</template>

<script>
	// import $chatUtils from '@/common/chat.js'
	import popCommon from '@/components/commonPop/pop.vue'
	import statementPop from '@/components/chatStatement/chatStatement.vue'
	const app = getApp()
	export default {
		components: {
			popCommon,
			statementPop
		},
		data() {
			return {
				statement: '',
				popShow: false,
				list: [],
				dynamicInfo: {},
				userInfo: app.globalData.userInfo,
				selectIndex: -1,
			}
		},
		methods: {
			load() {
				this.getCanOrder()
			},

			/**
			 * 确认邀请
			 * @returns {*}
			 */
			tapSubmit() {
				if (this.selectIndex == -1) return this.$toast.text('请选择订单！')
				let friendUserInfo = this.$u.deepClone(this.dynamicInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				let orderInfo = this.list[this.selectIndex]
				if (orderInfo.type == 'yao') {
					this.$refs.statementPopRef.show();
				} else {
					this.sendPing(orderInfo, friendUserInfo)
				}
			},
			async getCanOrder() {
				let {
					code,
					data
				} = await this.$u.api.getCanOrderApi({
					targetUserId: this.dynamicInfo.userId
				})
				console.log(data)
				if (code == 0) {
					this.list = data.list
					if (this.list.length == 0) {
						this.popShow = true;
					}
				}
			},
			/**
			 * 跳到打招呼页面
			 */
			confirmEvent() {
				let vm = this
				let friendUserInfo = this.$u.deepClone(this.dynamicInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				let infoStr = JSON.stringify(friendUserInfo) //转成了包含好友昵称的对象
				this.popShow = false;
				vm.$u.route({
					type: 'redirect',
					url: '/pages/chat/chat?isGreet=1',
					params: {
						userInfo: infoStr

					}
				})
			},

			/**
			 * 跳到下单页面
			 */
			cancelEvent() {
				let vm = this
				this.popShow = false;
				let dynamicInfo = this.dynamicInfo;
				let userInfo = {
					chatToken: dynamicInfo.chatToken,
					name: dynamicInfo.nickName,
					avatar: dynamicInfo.avatar,
					userId: dynamicInfo.userId,
					chatUserId: dynamicInfo.chatUserId,
				}
				vm.$u.route({
					type: 'redirect',
					url: 'pages/club/list?mode=list&chatFriendInfo=' + encodeURIComponent(JSON.stringify(userInfo))
				})
			},
			maskEvent() {
				this.popShow = false;
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 选择某一个可以邀约的订单
			 * @param orderInfo
			 */
			selectOrder({
				orderInfo
			}) {
				let index = this.list.findIndex(e => {
					return e.id == orderInfo.id
				})
				if (index != -1) {
					if (this.selectIndex == index) {
						this.selectIndex = -1
					} else {
						this.selectIndex = index
					}
				}
			},

/**
 * 普通的发送邀约
 * @param {Object} statement
 */
			sendYaoyueStatement(statement) {
				if (this.selectIndex == -1) return this.$toast.text('请选择订单！')
				let friendUserInfo = this.$u.deepClone(this.dynamicInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				let orderInfo = this.list[this.selectIndex]
				this.sendYaoyue(orderInfo, friendUserInfo, statement);
			},

			/**
			 * 确定发送邀约的处理
			 */
			sendYaoyue(orderInfo, friendUserInfo, statement) {

				console.log("确定邀约")
				var that = this;

				this.$u.api.yaoyueInviteApi({
					orderId: orderInfo.id,
					userId: friendUserInfo.userId
				}).then((res) => {
					
					if(res.code == 0){
						var p1 = {};
						p1.orderId = orderInfo.id
						p1.orderSn = orderInfo.sn
						p1.orderClubId = orderInfo.clubId
						p1.clubCover = orderInfo.clubCover
						p1.orderClubName = orderInfo.clubName
						p1.awkwardWineId = res.data.awkwardWineId
						p1.text = statement
						p1.agreeStatus = 'none'
						var last = JSON.stringify(p1);
						
						let params = {
							type: "chat",
							payloadStr: last,
							receiverId: "user@" + friendUserInfo.userId + "@"
						};
						that.$u.api.chatFriendMessageSend(params).then((res) => {
						
						});
						
						that.$toast.text('已发送邀约请求')
						setTimeout(() => {
							that.$u.route({
								type: 'back'
							})
						}, 500)
						
					}else{
						console.log(res)
						// that.$toast.text(res.data.)
						// setTimeout(() => {
						// 	that.$u.route({
						// 		type: 'back'
						// 	})
						// }, 500)
					}
					
				
				
				});

			},

			/**
			 * 发送拼享消息【调试中】
			 */
			sendPing(orderInfo, friendInfo) {
				var that = this;
			
				this.$u.api.pingInviteApi({
					orderId: orderInfo.id,
					userId: friendInfo.userId
				}).then((res) => {
					console.log("订单信息")
					console.log(orderInfo)
					
					if(res.code == 0){
						var p1 = {};
						p1.orderId = orderInfo.id
						p1.orderSn = orderInfo.sn
						p1.orderClubId = orderInfo.clubId
						p1.clubCover = orderInfo.clubCover
						p1.orderClubName = orderInfo.clubName
						p1.orderPingHistoryId = res.data.orderPingHistoryId
						p1.agreeStatus = 'none'
						p1.statement = "跟我一起来拼订单吧"
						p1.amount = orderInfo.amount
						var last = JSON.stringify(p1);
						
						let params = {
							type: "inviteJoinOrder",
							payloadStr: last,
							receiverId: "user@" + friendInfo.userId + "@"
						};
						that.$u.api.chatFriendMessageSend(params).then((res) => {
							console.log("发送成功")
						});
						
						console.log("1")
						that.$toast.text('已发送邀约请求')
						setTimeout(() => {
							that.$u.route({
								type: 'back'
							})
						}, 500)
						
					}else{
						console.log(res)
						// that.$toast.text(res.data.)
						// setTimeout(() => {
						// 	that.$u.route({
						// 		type: 'back'
						// 	})
						// }, 500)
					}
					
					
				});
				

			},
		},
		onLoad(opt) {
			//发现这边的动态信息会传过来
			console.log("当前点击的动态信息=====》")
			console.log(this.dynamicInfo)
			this.dynamicInfo = JSON.parse(decodeURIComponent(opt.dynamicInfo))
			this.load()
		},
	}
</script>

<style lang="scss">
	page {
		height: 100%;

		.page-wrap {
			height: 100%;
			display: flex;
			flex-direction: column;

			.list-wrap {
				flex: 1;
				min-height: 0;
			}

			.btn {
				width: calc(100% - 60rpx);
				margin: 30rpx;
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
				border-radius: 45rpx;
				background: #82799B;
				color: #FFFFFF;

				&.active {
					background: $uni-button-color;
				}
			}

		}

	}
</style>
