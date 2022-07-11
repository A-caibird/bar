<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="订单详情" title-size="36" title-color="#FFFFFF" :background="{
						'background': '#191C3F'
					}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="middle_box">
			<block v-if="orderInfo.isJoin">
				<view class="order_status_text" v-if="orderInfo.status=='noShop'">
					<image src="/static/imgs/common/white-hook.png"></image>
					<text style="font-weight: 500;margin-left: 16rpx;">已加入拼享</text>
				</view>
				<view class="order_status_text" v-if="orderInfo.status=='arrived'">
					<image src="/static/imgs/common/white-hook.png"></image>
					<text style="font-weight: 500;margin-left: 16rpx;">已加入拼享</text>
				</view>
				<view class="order_status_text" v-if="orderInfo.status=='comment'">
					<image src="/static/imgs/common/white-hook.png"></image>
					<text style="font-weight: 500;margin-left: 16rpx;">已完成</text>
					<text style="font-size: 26rpx;">(欢迎下次继续光临本店)</text>
				</view>
				<view class="order_status_text" v-if="orderInfo.status=='complete'">
					<image src="/static/imgs/common/white-hook.png"></image>
					<text style="font-weight: 500;margin-left: 16rpx;">已完成</text>
					<text style="font-size: 26rpx;">(欢迎下次继续光临本店)</text>
				</view>
			</block>	
			<view class="club_info" @tap="$u.throttle(goClub)">
				<view class="club_img" v-if="clubInfo.bannerList.length > 1">
					<u-swiper :list="clubInfo.bannerList" height="435" bgColor="#191C3F" @click="$u.throttle(goClub)"></u-swiper>
				</view>
				<view class="club_img" v-if="clubInfo.bannerList.length == 1">
					<image :src="clubInfo.bannerList[0]" mode="aspectFill"></image>
				</view>
				<view class="info_box">
					<view class="first_line">
						<view class="line_left">
							<view class="club_name"> <text>{{clubInfo.name}}</text> </view>
							<view class="club_intro"> <text>{{clubInfo.subtitle}}</text> </view>
						</view>
						<view class="line_right">
							<!-- <view class="common_btn">
								<image src="@/static/imgs/common/kefu.png"></image>
								<text>客服</text>
							</view> -->
							<view class="common_btn" @tap.stop="callPhone">
								<u-icon size="32" name="phone" color="#FFFFFF"></u-icon>
								<text>电话</text>
							</view>
						</view>
					</view>
					<view class="info_eva">
						<view class="rate_box">
							<selfRate :score="clubInfo.avgScore" size="24"></selfRate>
						</view>
						<text>{{clubInfo.avgScore}} 评分</text>
					</view>
					<view class="info_open_time">
						<text>营业时间</text>
						<view class="line"></view>
						<text>{{clubInfo.businessHours?clubInfo.businessHours:'暂未填写'}}</text>
					</view>
					<view class="info_label">
						<block v-for="(info, index) in clubInfo.labelList" :key="index">
							<view class="common_label"> <text>{{info}}</text> </view>
						</block>
					</view>
				</view>
				<u-gap height="10" bgColor="#20234B"></u-gap>
			</view>
			<view class="order_club">
				<view class="user-list">
					<view class="user-list-item" @tap="$u.throttle(goInfo)">
						<text class="title">发起人：</text>
						<image class="avatar" :src="orderInfo.sponsorAvatar"></image>
						<text class="name">{{orderInfo.name}}</text>
					</view>
					<view class="user-list-item">
						<text class="title">接待人：</text>
						<image class="avatar" @tap="$u.throttle(previewImg(orderInfo.receptionistAvatar))" :src="orderInfo.receptionistAvatar"></image>
						<text class="name">{{orderInfo.receptionistName}}</text>
					</view>
				</view>
				<view class="common_info_item">
					<view class="item_left"> 
						<text style="color: #9292BA;">到店时间：</text> 
					</view>
					<view class="item_right">
						<text style="color: #FFFFFF;">{{orderInfo.arriveTime}}</text>
					</view>
				</view>
				<view class="common_info_item">
					<view class="item_left"> 
						<text style="color: #9292BA;">台位位置：</text> 
					</view>
					<view class="item_right">
						<text style="color: #FFFFFF;">{{orderInfo.cardTableName}} 卡台</text>
					</view>
				</view>
				<block v-if="orderInfo.status!='cancel'">
					<view class="common_info_item">
						<view class="item_left"> 
							<text style="color: #9292BA;">拼单人数：</text> 
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF;">{{orderInfo.orderAllPersonNum}}人</text>
						</view>
					</view>
					<view class="common_info_item" @tap="$u.throttle(goPingMemberList(orderId,orderInfo.isJoin?'join':'notjoin'))">
						<view class="item_left"> 
							<text style="color: #9292BA;">已拼人数：</text> 
						</view>
						<view class="item_right">
							<text style="color: #FFFFFF; margin-right: 14rpx;">男：{{orderInfo.menNum}}人</text>
							<text style="color: #FFFFFF; margin-right: 14rpx;">女：{{orderInfo.womenNum}}人</text>
							<text style="color: #FFFFFF;">{{orderInfo.menNum+orderInfo.womenNum}}/{{orderInfo.orderAllPersonNum}}人</text>
							<u-icon name="arrow-right" color="#ffffff"></u-icon>
						</view>
					</view>
					<view class="common_info_item" >
						<view class="item_left"> 
							<text style="color: #9292BA;">拼单方式：</text> 
						</view>
						<view class="item_right" v-if="orderInfo.type=='AA'">
							<text style="color: #FFFFFF; ">AA</text>
						</view>
						<view class="item_right" v-if="orderInfo.type=='customize'">
							<block v-if="orderInfo.shareWay.menNumber>0">
								<text style="color: #FFFFFF; margin-right: 14rpx;" v-if="orderInfo.shareWay.menWineCoin">男：{{orderInfo.shareWay.menWineCoin}}元</text>
								<text style="color: #FFFFFF; margin-right: 14rpx;" v-else>男：免费</text>
							</block>
							<block v-if="orderInfo.shareWay.womenNumber>0">
								<text style="color: #FFFFFF; " v-if="orderInfo.shareWay.womenWineCoin">女：{{orderInfo.shareWay.womenWineCoin}}元</text>
								<text style="color: #FFFFFF; " v-else>女：免费</text>
							</block>
						</view>
						<view class="item_right" v-if="orderInfo.type=='treat'">
							<text style="color: #FFFFFF; ">发起人买单</text>
						</view>
					</view>
					
				</block>
				
				
				<view class="textarea-info-item">
					<view class="left">
						<text >备注要求：</text>
					</view>
					<view class="right">
						<text>{{orderInfo.demo}}</text>
					</view>
				</view>
			
				<u-gap height="1" bgColor="#20234B" style="margin-top: 20rpx;"></u-gap>
				
				<!-- <view class="common_info_item" style="margin-top: 20rpx;">
					<view class="item_left"> 
						<text style="color: #9292BA;">订单总价:</text> 
					</view>
					<view class="item_right">
						<text style="color: #FFFFFF;">{{orderInfo.totalAmount}}元</text>
					</view>
				</view> -->
				<view class="common_info_item" v-if="orderInfo.isJoin">
					<view class="item_left"> 
						<text style="color: #9292BA;">实际付款：</text> 
					</view>
					<view class="item_right">
						<text style="color: #FF59C9; font-size: 36rpx;"> <text style="font-weight: 500;">{{orderInfo.amount}}</text>元 </text>
					</view>
				</view>
			</view>
			<u-gap height="20" bgColor="#20234B"></u-gap>
			<!-- <view class="order_info">
				<common-label leftText="订单信息" :showRight="false"></common-label>
				<view class="common_info_item">
					<view class="item_left"> 
						<text style="color: #9292BA;">订单编号：</text> 
					</view>
					<view class="item_right">
						<text style="color: #FFFFFF; font-size: 28;">{{orderInfo.sn}}</text>
						<view class="copy_btn" @tap="copyClipvoard(orderInfo.sn,'订单编号已复制')"> <text>复制</text> </view>
					</view>
				</view>
				<view class="common_info_item">
					<view class="item_left"> 
						<text style="color: #9292BA;">下单时间：</text> 
					</view>
					<view class="item_right">
						<text style="color: #FFFFFF;">{{orderInfo.orderTime}}</text>
					</view>
				</view>
				<view class="common_info_item">
					<view class="item_left"> 
						<text style="color: #9292BA;">手机号：</text> 
					</view>
					<view class="item_right">
						<text style="color: #FFFFFF;">{{orderInfo.phone}}</text>
					</view>
				</view>
			</view>
			<u-gap height="20" bgColor="#20234B"></u-gap> -->
			<view class="oerder_goods">
				<common-label leftText="酒水套餐" :showRight="false"></common-label>
				<view class="goods_box">
					<view class="common_goods_box" v-for="(info, index) in orderInfo.orderItemList" :key="index">
						<view class="goods_img">
							<image :src="info.cover"></image>
						</view>
						<view class="goods_name"> <text>{{info.commodityName}}</text> </view>
						<view class="price_number_box">
							<view class="price_info">
								<text style="font-size: 26rpx; color: #FF59C9;">{{info.commodityPrice}}元</text>
								<!-- <text style="font-size: 24rpx; color: #9292BA; text-decoration: line-through;">200元</text> -->
							</view>
							<view class="num_box"> <text>x{{info.buyNum}}</text> </view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<block v-if="orderInfo.isJoin">
			<view class="foot_box" v-if="orderInfo.status=='paying'">
				<view class="common_btn" @tap="$u.throttle(tapCancel)"> <text>取消订单</text> </view>
				<view class="common_btn color" @tap="$u.throttle($u.route('/pages/club/consumption/payPage',{allAmount:orderInfo.amount,joinTogetherId:orderInfo.joinTogetherId,type:'ping-join-order'}))"> <text>去付款</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='noShop'">
				<view class="common_btn color" @tap="$u.throttle(tapQuitPing)"> <text>退出拼享</text> </view>                                                                                      
			</view>
			<view class="foot_box" v-if="orderInfo.status=='arrived'">
				<view class="common_btn" @tap="$u.throttle(tapQuitPing)"> <text>退出拼享</text> </view>
				<view class="common_btn color" @tap="$u.throttle(tapGoAddWine)"> <text>加单酒水</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='comment'">
				<view class="common_btn color" @tap="$u.throttle($u.route('/pages/order/evaluation',{orderId:orderId}))"> <text>我要评价</text> </view>
			</view>
			<view class="foot_box" v-if="orderInfo.status=='complete'">
				<!-- <view class="common_btn color" @tap="tapDelete"> <text>删除</text> </view> -->
			</view>
			<view class="foot_box" v-if="orderInfo.status=='cancel'">
				<!-- <view class="common_btn color" @tap="tapDelete"> <text>删除</text> </view> -->
			</view>
			<view class="foot_box" v-if="orderInfo.status=='refund'">
				<!-- <view class="common_btn color"> <text>删除</text> </view> -->
			</view>
		</block>
		<block v-else>
			<view class="foot_box" v-if="orderInfo.status == 'paying'">
				<view class="common_btn color"> <text>报名费{{orderInfo.amount}}元</text> </view>
				<view class="common_btn" @tap="$u.throttle(tapJoin)"> <text>加入拼享</text> </view>
			</view>
			<view class="foot_box" v-else>
				<view class="common_btn" @tap="$u.throttle(tapQuitPing)"> <text>退出拼享</text> </view>
			</view>
		</block>
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	import $chat from '@/utils/chat/index.js'
	const app = getApp()
	export default {
		components:{
			selfRate
		},
		data() {
			return {
				orderId:-1,
				joinTogetherId:-1,
				clubInfo:{
					bannerList:[],
				},
				orderInfo:{},
				userInfo:app.globalData.userInfo
			}
		},
		onLoad: function(opt) {
			console.log(opt)
			let {orderId} = opt
			this.orderId = orderId
			this.load()
			
			uni.$on('ping-order-detail-refresh',this.load)
			uni.$on('sendInviteMsg', (joinTogetherId) => {
				console.log('joinTogetherId', joinTogetherId);
				this.sendPingMsg(joinTogetherId);
				uni.$off('sendInviteMsg');
			})
		},
		onUnload() {
			uni.$off('ping-order-detail-refresh',this.load)
			uni.$off('sendInviteMsg');
		},
		methods:{
			goInfo(){
				this.$u.route('/pages/mine/dynamic/myDynamic',{
					id: this.orderInfo.sponsorId
				});
			},
			goClub(){
				this.$u.route('/pages/club/detail', {
					id: this.clubInfo.clubId
				})
			},
			async tapJoin(){
				await this.$toast.confirm('','确定要发起加入请求吗？')
				this.$u.route('/pages/club/consumption/payPage',{
					allAmount: this.orderInfo.amount,
					orderId:this.orderId,
					method: 'sendInviteMsg',
					type:'ping-join-order'})
			},
			sendPingMsg(joinTogetherId = ""){
				let {sponsorId,sponsorChatId,sponsorChatToken,name,sponsorAvatar,} = this.orderInfo
				let {id,clubSimpleInfoVo,arriveTime,cardTableName} = this.orderInfo
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = {
					userId:sponsorId,
					chatUserId:sponsorChatId,
					chatToken:sponsorChatToken,
					name:name,
					avatar:sponsorAvatar,
					hasSave:false,
				}
				let msgInfo = {
					orderId: id,
					clubCover: clubSimpleInfoVo.clubCover,
					clubName: clubSimpleInfoVo.name,
					date: arriveTime,
					cardTableName: cardTableName,
					agreeStatus: 'none',
					joinTogetherId: joinTogetherId,
				}
				console.log(msgInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'pingJoin', msgInfo)
			},
			async tapQuitPing(){
				await this.$toast.confirm('','确定退出拼享？')
				let {code} = await this.$u.api.refundPingOrderApi({
					joinTogetherId:this.joinTogetherId,
				})
				if(code==0) {
					this.$toast.text('退出拼享成功！')
					uni.$emit('order-list-refresh')
					uni.$emit('find-share-list-refresh')
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},1200)
				}
			},
			tapGoAddWine(){
				this.$u.route('/pages/order/add-wine',{
					orderId:this.orderId,
					clubId:this.clubInfo.clubId,
				})
			},
			tapGoPing(){
				this.$u.route({
					type:'reLaunch',
					url:'/pages/index/index',
					params:{
						goFind:true
					}
				})
			},
			// 拨打电话
			callPhone: function(){
				uni.makePhoneCall({
					phoneNumber: this.clubInfo.phone
				})
			},
			load(){
				this.getPingOrderView()
			},
			async tapArrive(){
				await this.$toast.confirm('','确定已经到店？')
				this.arriveOrder()
			},
			async arriveOrder(){
				let {code} = await this.$u.api.arriveOrderApi({
					orderId:this.orderId,
				})
				if(code==0) {
					this.$toast.text('到店成功！')
					uni.$emit('order-list-refresh')
					this.load()
				}
			
			},
			async tapCancel(){
				await this.$toast.confirm('','确定要取消该订单？')
				this.cancelOrder()
			},
			async cancelOrder(){
				let {code} = await this.$u.api.pingJoinCancelApi({
					joinTogetherId:this.joinTogetherId,
				})
				if(code==0) {
					uni.$emit('pay-order-refresh')
					uni.$emit('order-list-refresh')
					this.load()
					this.$toast.text('取消成功！')
				}
			
			},
			async tapDelete(){
				await this.$toast.confirm('','确定要删除该订单？')
				this.deletePingOrder()
			},
			async deletePingOrder(){
				let {code} = await this.$u.api.deletePingOrderApi({
					joinTogetherId:this.joinTogetherId,
				})
				if(code==0) {
					this.$toast.text('删除成功！')
					uni.$emit('order-list-refresh')
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},500)
				}
			
			},
			
			async getPingOrderView(){
				let {code,data} = await this.$u.api.getPingOrderView({
					orderId:this.orderId,
				})
				console.log(data)
				this.clubInfo = data.pingOrderViewVo.clubSimpleInfoVo
				this.orderInfo = data.pingOrderViewVo
				if(this.orderInfo.isJoin) {
					this.joinTogetherId = this.orderInfo.joinTogetherId
				}else{
					if(this.orderInfo.status == 'waitAgree'){
						this.joinTogetherId = this.orderInfo.joinTogetherId
					}
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.middle_box {
		border-top: 1px solid #20234B;

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

			.club_img {
				width: 100%;
				height: 435rpx;
				background: #191C3F;
				image{
					width: 100%;
					height: 100%;
				}
			}

			.info_box {
				width: 100%;
				box-sizing: border-box;
				padding: 30rpx;

				.first_line {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.line_left {
						.club_name {
							font-size: 40rpx;
							color: #FFFFFF;
							font-weight: 500;
						}

						.club_intro {
							font-size: 28rpx;
							color: #FFFFFF;
							line-height: 40rpx;
						}
					}

					.line_right {
						display: flex;
						align-items: center;

						.common_btn {
							display: flex;
							align-items: center;
							flex-direction: column;

							&:nth-child(2) {
								margin-left: 40rpx;
							}

							&>image {
								height: 30rpx;
								width: 30rpx;
							}

							&>text {
								color: #FFFFFF;
								font-size: 22rpx;
								margin-top: 14rpx;
							}
						}
					}
				}

				.info_eva {
					height: 80rpx;
					display: flex;
					align-items: center;
					color: #F72EB2;
					font-size: 26rpx;

					&>text {
						margin-left: 14rpx;
					}
				}
				.info_open_time {
					display: flex;
					align-items: center;
					font-size: 26rpx;
					color: #FFFFFF;
				
					.line {
						height: 20rpx;
						width: 1px;
						background: #575B85;
						margin: 0 14rpx;
					}
				}
				
				.info_label {
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					margin: 16rpx 0rpx;
				
					.common_label {
						height: 40rpx;
						@include flex-center();
						border-radius: 2rpx;
						padding: 0 14rpx;
						border: 1px solid #565B86;
						color: #B3BAEF;
						font-size: 20rpx;
						margin-right: 10rpx;
						margin-top: 10rpx;
					}
				}
			}		
		}
		.common_info_item{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			min-height: 54rpx;
			.item_left{
				display: flex;
				align-items: center;
				font-size: 26rpx;
				margin-left: 30rpx;
			}
			.item_right{
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
					color: #9292BA;
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
					color: #9292BA;
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
		.order_club{
			width: 100%;
			padding: 30rpx 0rpx;
			box-sizing: border-box;
		}
		.order_info{
			padding-bottom: 20rpx;
			.copy_btn{
				line-height: 36rpx;
				text-align: center;
				width: 76rpx;
				border-radius: 18rpx;
				border: 1px solid #565A89;
				font-size: 20rpx;
				color: #FFFFFF;
				margin-left: 30rpx;
			}
		}
		.oerder_goods{
			width: 100%;
			padding-bottom: 130rpx;
			.goods_box{
				width: 100%;
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				justify-content: space-between;
				.common_goods_box{
					width: 334rpx;
					padding-bottom: 20rpx;
					.goods_img{
						width: 100%;
						height: 250rpx;
						&>image{
							height: 100%;
							width: 100%;
							border-radius: 10rpx;
						}
					}
					.goods_name{
						font-size: 30rpx;
						line-height: 40rpx;
						color: #FFFFFF;
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						margin-top: 16rpx;
					}
					.price_number_box{
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 20rpx;
						.price_info{
							font-size: 28rpx;
							color: #FFFFFF;
							display: flex;
							flex-direction: column;
							align-items: center;
						}
						.num_box{
							font-size: 20rpx;
							color: #FFFFFF;
						}
					}
				}
			}
		}
	}
	.foot_box{
		width: 100%;
		display: flex;
		align-items: center;
		height: 120rpx;
		border-bottom: 1px solid #242854;
		position: fixed;
		bottom: 0rpx;
		z-index: 100;
		background:$uni-title-color;
		.common_btn{
			flex: 1;
			margin: 0 30rpx;
			height: 80rpx;
			width: 320rpx;
			text-align: center;
			line-height: 78rpx;
			border-radius: 40rpx;
			border: 1px solid #7B7E9D;
			color: #FFFFFF;
			&.color{
				background: $uni-button-color;
				border: 0rpx;
				color: #FFFFFF;
				line-height: 80rpx;
			}
		}
	}
</style>
