<template>
	<view class="club_item_box" @tap="$u.throttle(goGroupBuying(info))">
	<!-- <view class="club_item_box"> -->
		<view class="user_header">
			<view class="header_left" @tap.stop="$u.throttle(goPersonPage(info.userId))">
				<image :src="info.userAvatar"></image>
			</view>
			<view class="header_right">
				<view class="first_line">
					<view class="user_name" @tap.stop="$u.throttle(goPersonPage(info.userId))">
						<text>{{info.userNickName}}</text>
						<image v-if="info.sex == '女'" src="/static/imgs/register/female_icon.png" mode=""></image>
						<image v-else src="/static/imgs/register/male_icon.png" mode=""></image>
					</view>
					<view class="find_location" @tap.stop="openMap(info.clubLng,info.clubLat,info.clubAddress)">
						<image src="/static/imgs/common/location.png"></image>
						<text>{{info.distance}}</text>
					</view>
				</view>
				<view class="second_line" @tap.stop="$u.throttle(goPersonPage(info.userId))">
					<view class="time_text"> <text>{{info.payDate}}</text> </view>
				</view>
			</view>
		</view>
		<view class="club_intro" v-if="info.shareRequirements">
			<text>{{info.shareRequirements}}</text>
		</view>
		<view class="club_img">
			<image :src="info.clubCover"/>
		</view>
		<view class="club_footer">
			<view class="club_name">{{info.clubName}}</view>
			<view class="club_address">
				<text>{{info.clubAddress}}</text>
			</view>
			<view class="club_labels">
				<view class="commom_label" v-for="item,index in info.labelList" :key="index"> <text>{{item}}</text> </view>
			</view>
			<view class="feature_box">
				<view class="feature_left">
					<view class="first_line" v-if="info.type=='AA'">
						<view class="info_item">
							<text class="item_label">拼单方式：</text>
							<text class="item_text">AA 每人 {{info.shareWay.avgWineCoin}}元</text>
						</view>
					</view>
					<view class="first_line" v-if="info.type=='customize'">
						<view class="info_item">
							<text class="item_label">男：</text>
							<text class="item_text">{{info.shareWay.menWineCoin>0?`${info.shareWay.menWineCoin}元/人`:'免费'}}</text>
						</view>
						<view class="info_item" style="margin-left: 40rpx;">
							<text class="item_label">女：</text>
							<text class="item_text">{{info.shareWay.womenWineCoin>0?`${info.shareWay.womenWineCoin}元/人`:'免费'}}</text>
						</view>
					</view>
					<view class="first_line" v-if="info.type=='treat'">
						<view class="info_item">
							<text class="item_label">拼单方式：</text>
							<text class="item_text">发起人买单</text>
						</view>
					</view>
					<view class="second_line">
						<view class="info_item">
							<text class="item_label">时间：</text>
							<text class="item_text">{{info.date}}</text>
						</view>
					</view>
				</view>
				<block v-if="info.pingStatus=='canPing'">
					<view class="feature_btn" @tap.stop="pingTap">
						<image src="/static/imgs/common/club_share.png"></image>
						<text>拼享</text>
					</view>
				</block>
				<block v-if="info.pingStatus=='hasJoin'">
					<view class="feature_btn end">
						<text>已加入</text>
					</view>
				</block>
				<block v-if="info.pingStatus=='complete'">
					<view class="feature_btn end">
						<text>拼享结束</text>
					</view>
				</block>
				<block v-if="info.pingStatus=='waitAgree'">
					<view class="feature_btn end">
						<text>申请中</text>
					</view>
				</block>

			</view>
		</view>
		<pop
			v-if="popShow"
			title="加入拼享"
			cancelText="再看看" confirmText="加入拼享"
			:isMask="true"
			@cancel="popShow = false"
			@confirm="tapPingTap"
			@maskTap="popShow = false"
			mode="price"
			:price="popPrice"
		></pop>
	</view>
</template>

<script>
	const app = getApp()
	import pop from '@/components/commonPop/pop.vue'
	import $chat from '@/utils/chat/index.js'
	import loginMixins from '@/mixins/loginConfirm.js'
	export default {
		mixins:[loginMixins],
		props:{
			info:{
				type:Object,
				default:{
					labelList:[],
				}
			}
		},
		components:{
			pop
		},
		data(){
			return {
				popPrice: '',
				popShow: false,
				userInfo: app.globalData.userInfo,
			}
		},
		methods:{
			goPersonPage(userId){
				if(!this.loginConfirmHandle(false)) return;
				this.goPersonalHomepage(userId);
			},
			pingTap(){
				if(!this.loginConfirmHandle(false)) return;
				this.popPrice = this.info.amount;
				this.popShow = true;
			},
			async tapPingTap(){
				var info = this.info;
				this.judgeVerify().then(res => {
					console.log(res);
					if(res.hasAdult){
						this.tapPing(info);
					}else{
						this.$u.toast("未成年人员禁止拼享");
					}
				}).catch(e => {
					console.log(e);
				})
			},
			async tapPing(info){
				// await this.$toast.confirm('','确定要发起加入请求吗？')
				console.log("点击了===》")
				console.log(info)
				
				
				this.popShow = false
				uni.$on('sendInviteMsg2', (joinTogetherId) => {
					console.log('joinTogetherId', joinTogetherId);
					this.sendPingMsg(info, joinTogetherId);
					uni.$emit('find-share-list-refresh');// 刷新拼享快乐
					uni.$off('sendInviteMsg2');
				})
				this.$u.route('/pages/club/consumption/payPage',{
					allAmount: info.amount,
					orderId:info.id,
					method: 'sendInviteMsg2',
					type:'ping-join-order'})

			},
			
			sendPingMsg: function(orderInfo, joinTogetherId = ""){
				
				
				// let friendInfo = this.$u.deepClone(this.info)
				console.log("用户信息===》")
				console.log(this.info)
				// let friendUserInfo = {
				// 	userId:info.userId,
				// 	chatUserId:info.chatUserId,
				// 	chatToken:info.chatToken,
				// 	name:info.userNickName,
				// 	avatar:info.userAvatar,
				// 	hasSave:false,
				// }
				// $chat.sendMsg(userInfo, friendUserInfo, 'single', 'pingJoin', {
				// 	orderId: info.id,
				// 	clubCover: info.clubCover,
				// 	clubName: info.clubName,
				// 	date: info.date,
				// 	joinTogetherId: joinTogetherId,
				// 	cardTableName: info.cardTableSn,
				// 	agreeStatus: 'none',
				// })
				
				var p1 = {};
				p1.orderId = orderInfo.id
				p1.clubCover = orderInfo.clubCover
				p1.orderClubName = orderInfo.clubName
				p1.date = orderInfo.date
				p1.joinTogetherId = joinTogetherId
				p1.cardTableName = orderInfo.cardTableName
				p1.agreeStatus = 'none'
				p1.statement = "我想和你拼单"
				var last = JSON.stringify(p1);
				
				let params = {
					type: "applyJoinOrder",
					payloadStr: last,
					receiverId: "user@" + this.info.userId + "@"
				};
				this.$u.api.chatFriendMessageSend(params).then((res) => {
					console.log("发送成功")
				});
				
				
			},

      /**
       * 申请加入拼享订单
       * @param info
       */
			goGroupBuying:function(info){
				if(!this.loginConfirmHandle(false)) return;
				let clubId = info.clubId
				let orderId = info.id
				uni.$off('sendInviteMsg');
				this.$u.route('/pages/order/groupBuying', {
					id: clubId,
					orderId : orderId,
					pingStatus: info.pingStatus
				});
			}
		}

	}
</script>

<style lang="scss" scoped>
	.club_item_box {
		width: calc(100% - 60rpx);
		margin-left: 30rpx;
		padding: 30rpx;
		box-sizing: border-box;
		background: #2C3158;
		border-radius: 10rpx;

		.user_header {
			width: 100%;
			box-sizing: border-box;
			height: 80rpx;
			margin-bottom: 30rpx;
			display: flex;
			align-items: center;

			.header_left {
				&>image {
					height: 74rpx;
					width: 74rpx;
					border-radius: 50%;
				}
			}

			.header_right {
				width: calc(100% - 100rpx);
				margin-left: 26rpx;

				.first_line {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.user_name {
						display: flex;
						align-items: center;

						&>text {
							font-size: 30rpx;
							color: #FFFFFF;
						}

						&>image {
							height: 30rpx;
							width: 30rpx;
							margin-left: 14rpx;
						}
					}

					.find_location {
						display: flex;
						align-items: center;

						&>image {
							height: 26rpx;
							width: 22rpx;
						}

						&>text {
							font-size: 24rpx;
							color: #FFFFFF;
							margin-left: 4rpx;
						}
					}
				}

				.second_line {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.time_text {
						font-size: 22rpx;
						color: #A2A6D9;
					}
				}
			}

		}

		.club_intro {
			width: 100%;
			font-size: 30rpx;
			color: #FFFFFF;
			box-sizing: border-box;
			margin-bottom: 24rpx;
			@include multipleOmit(1);
		}

		.club_img {
			width: 100%;
			height: 285rpx;

			&>image {
				height: 100%;
				width: 100%;
			}
		}

		.club_footer {
			width: 100%;
			padding-top: 30rpx;
			box-sizing: border-box;

			.club_name {
				font-size: 34rpx;
				line-height: 48rpx;
				color: #FFFFFF;
				width: calc(100% - 80rpx);
				@include simpleOmit;
			}

			.club_address {
				font-size: 26rpx;
				line-height: 36rpx;
				color: #FFFFFF;
				width: calc(100% - 80rpx);
				@include simpleOmit;
			}

			.club_labels {
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 10rpx;

				.commom_label {
					height: 40rpx;

					@include flex-center();
					border: 1px solid #565B86;
					font-size: 20rpx;
					color: #B3BAEF;
					padding: 0 10rpx;
					border-radius: 2rpx;
					margin-right: 12rpx;
					margin-bottom: 10rpx;
				}
			}

			.feature_box {
				height: 60rpx;
				width: 100%;
				display: flex;
				align-items: center;
				position: relative;
				margin-top: 20rpx;

				.feature_left {
					.first_line {
						display: flex;
						align-items: center;
					}

					.info_item {
						display: flex;
						align-items: center;
						font-size: 24rpx;

						.item_label {
							color: #B3B3DD;
						}

						.item_text {
							color: #F9F9F9;
						}
					}
				}

				.feature_btn {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 60rpx;
					width: 170rpx;
					position: absolute;
					right: 0rpx;
					background: $uni-button-color;
					border-radius: 30rpx;

					&.end {
						background: #585E8D;
					}

					&>image {
						height: 26rpx;
						width: 26rpx;
						margin-right: 10rpx;
					}

					&>text {
						font-size: 28rpx;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
