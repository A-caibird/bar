<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#1A1D29'
			}" title="订单结算" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="club_info">
				<view class="club_info_box" style="background: #1A1D29;">
					<image class="club_img" :src="clubInfo.clubCover"></image>
					<view class="club_info">
						<view class="club_name">{{clubInfo.name}}</view>
						<view class="club_subTitle">营业时间:{{clubInfo.businessHours}}</view>
					</view>
				</view>
			</view>
			<view class="order_detail_box">
				<view class="form-box">
					<view class="form-content">
						<view class="receptionist_box">
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">预订信息</view>
								</view>
							</view>
						</view>
						<view class="form_box">
							<common-input :disabled="true" :value="orderInfo.name" @input="orderInfo.name=$event" label="姓名"
								placeholder="请填写您的真实姓名"></common-input>
							<common-input :value="form.phone" @input="form.phone=$event" type="number" label="联系手机号"
								placeholder="请输入您的联系手机号"></common-input>
							<uni-datetime-picker type="time" :value="data.arrivalTimeHM" hide-second="true"
								:start="startDate" :end="endDate" return-type="timestamp" @change="arrivalTimeConfirm">
								<common-input :value="data.arrivalTime" label="预定到店" placeholder="请选择预定到店时间"
									:isArrow="true"></common-input>
							</uni-datetime-picker>
						</view>
						<view class="share_box">
							<view class="share_info" v-if="false">
								<view class="share_way">
									<view class="label_text"> <text>拼享方式</text> </view>
									<view class="way_list">
										<block v-for="(info, index) in shareWay" :key="index">
											<view class="common_way" @tap="tapSwitchShareWay(info.value)">
												<view class="circular-select"
													:class="{'pink-active':info.value==data.type}"></view>
												<text>{{info.label}}</text>
											</view>
										</block>

									</view>
								</view>
								<view class="share_people">
									<view class="label_text"> <text>拼享方式</text> </view>
									<view class="people_list">
										<view class="common_people">
											<text>男</text>
											<view class="selfNum">
												<self-number-box inputWidth="50" color="#ffffff" bgColor="#ffffff"
													inputHeight="40" :value="data.shareWay.menNumber"
													@plus="data.shareWay.menNumber++"
													@minus="data.shareWay.menNumber--"></self-number-box>
											</view>
											<input v-if="data.type=='customize'" type="number"
												v-model="data.shareWay.menWineCoin" placeholder="输入收费金额" />
											<view v-if="data.type=='AA'" class="avgAmount">{{menAvgAmount}}元</view>
										</view>
										<view class="common_people">
											<text>女</text>
											<view class="selfNum">
												<self-number-box inputWidth="50" color="#ffffff" bgColor="#ffffff"
													inputHeight="40" :value="data.shareWay.womenNumber"
													@plus="data.shareWay.womenNumber++"
													@minus="data.shareWay.womenNumber--"></self-number-box>
											</view>
											<input v-if="data.type=='customize'" type="number"
												v-model="data.shareWay.womenWineCoin" placeholder="输入收费金额" />
											<view v-if="data.type=='AA'" class="avgAmount">{{womenAvgAmount}}元</view>
										</view>

									</view>
								</view>
							</view>
						</view>
						<view class="receptionist_box">
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">接待人</view>
								</view>
							</view>
							<view class="person_info" @tap="$u.throttle(tapGoSelectStaff)">
								<image :src="receptorInfo.receptionistAvatar || '/static/imgs/register/male.png'"></image>
								<view class="info_name">
									<text>{{receptorInfo.receptionistName || '请选择接待人员'}}</text>
									<u-icon name="arrow-right" color="#777CBF"></u-icon>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="order_info_box">
					<view class="commodity_box">
						<view class="common_label">
							<view class="label_left">
								<view class="line"></view>
								<view class="label_text">商品信息</view>
							</view>
						</view>
						<view class="commodity_List">
							<block v-for="(info,index) in orderInfo.orderItemList" :key="info.id">
								<view class="commodity_item">
									<view class="car_goods_box">
										<view class="goods_img_panel">
											<image class="goods_img" :src="info.cover"></image>
										</view>
										<view class="goods_info_box">
											<view class="goods_name"> <text>{{info.commodityName}}</text></view>
											<view class="price_box">
												<view class="price_text"> <text>{{info.commodityPrice}}元</text> </view>
												<view class="num_box">
													<text>x{{info.buyNum}}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view style="height: 120rpx;"></view>
			<view class="footer_box">
				<view class="price_text">
					<text>{{orderInfo.totalAmount}}元</text>
				</view>
<!-- 				<view class="btn_text buy" @tap="tapGoDrinks">
					<text>继续选购</text>
				</view> -->
				<!-- <view class="btn_text active" @tap="$u.route('pages/club/consumption/payPage')"> -->
				
				<view class="btn_text active" @tap="setStatement" v-if="chatTag && info.orderType=='fullAmount'">
					<text>确认</text>
				</view>
				<view class="btn_text active" @tap="tapGoPayPage" v-else>
					<text>确认</text>
				</view>
			</view>
		</view>
		<statementPop ref="statementPopRef" btnText="确定" @btnTap="sendStatement"></statementPop>
		<u-picker v-model="arrivalTimeShow" mode="time" :params="{hour:true,minute:true}" @confirm="arrivalTimeConfirm">
		</u-picker>
		<!-- <u-picker mode="selector" v-model="staffListShow" :range="staffList" range-key="name" @confirm="receptionistConfirm"></u-picker> -->
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	import $chatUtils from '@/common/chat.js'
	import statementPop from '@/components/chatStatement/chatStatement'
	export default {
		components: {
			selfRate,
			statementPop
		},
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
				info: {},
				arrivalTimeShow:false,
				startDate:'00:01',
				endDate:'23:59',
				instantInfo: { //即时单信息
					instantArrival: false,
					instantArrivalTime: 0,
					instantTime: {},
				},
				data:{
					arrivalTime: '',
					arrivalTimeHM: ''
				},
				receptorInfo: {
					receptionistId: '',
					receptionistName: '',
					receptionistAvatar: ''
				},
				form:{
					phone: '', //联系方式
				},
				statement: '',
				chatTag: false,
			}
		},
		onLoad: function(opt) {
			let info = JSON.parse(opt.data)
			let {
				orderId
			} = info
			this.orderId = orderId
			this.info = info;
			this.data.date = info.date;
			this.load(info.orderType)
			uni.$on('select-receptionist',this.handleReceptionist)
			if(this.info.chatTag == 'true'){
				this.chatTag = true;
			}else{
				this.chatTag = false;
			}
		},
		onUnload() {
			uni.$off('select-receptionist');
		},
		methods: {
			handleReceptionist(e){
				this.receptorInfo.receptionistId = e.id
				this.receptorInfo.receptionistName = e.name
				this.receptorInfo.receptionistAvatar = e.avatar
			},
			tapGoSelectStaff(){
				this.$u.route('/pages/receptionist-list/receptionist-list',{
					receptionistId:this.receptorInfo.receptionistId,
					clubId:this.clubInfo.clubId,
					date: this.data.date
				})
			},
			// 显示常用语句
			setStatement(){
				if(this.data.arrivalTime=='') return uni.showToast({title:'请选择到店时间！',icon:'none'})
				if(this.compareTime(new Date(this.data.arrivalTime.replace(/-/g, '/')),new Date())==-1) return this.$toast.text('预约时间必须晚于当前时间！')
				this.$refs.statementPopRef.show();
			},
			// 确定常用语句
			sendStatement(e){
				this.statement = e;
				this.tapGoPayPage();
			},
			tapGoPayPage(){
				if(this.data.arrivalTime=='') return uni.showToast({title:'请选择到店时间！',icon:'none'})
				if(this.compareTime(new Date(this.data.arrivalTime.replace(/-/g, '/')),new Date())==-1) return this.$toast.text('预约时间必须晚于当前时间！')	
				this.confirmCreateOrder()
			},
			confirmCreateOrder(){
				let vm = this
				vm.changeOrder()
			},
			// 订单修改
			async changeOrder(){
				let vm = this
				let data = {
					cardTableId: this.info.seatId,//座位id
					arrivalTime: this.data.arrivalTime,//到店时间(yyyy-MM-dd HH:mm)
					orderId:this.orderId,
					receptionistId: this.receptorInfo.receptionistId,
					phone: this.form.phone
				};
				let type = this.info.orderType=='fullAmount'?'yao-order':'ping-order'
				let res =  await this.$u.api.changeOrderAPI(data)
				if(res.code==0) {
					this.sendMsgHandle();
					this.$u.route({
						type:'redirect',
						url:'/pages/club/consumption/paySuccess',
						params:{
							allAmount:this.orderInfo.totalAmount,
							orderId:this.orderId,
							distance: 3,
							type:type,
						}
					})
				} else {
					console.log(res);
				}
			},
			// 发送邀约消息
			sendMsgHandle(){
				if(this.chatTag){
					var chatFriendInfo = JSON.parse(this.info.chatFriendInfo);
					var sendChatParams = {
						friendInfo: chatFriendInfo,
						type: this.info.orderType == 'fullAmount' ? 'yaoyue' : 'ping',
						orderInfo: {
							id: this.orderId,
							clubCover: this.clubInfo.clubCover,
							clubName: this.clubInfo.name,
							date: this.data.arrivalTime,
							cardTableName: this.info.seatId,
						},
						statement: this.statement || "",
					}
					if(sendChatParams.type == 'yaoyue'){
						$chatUtils.sendYaoyueInfo(this, sendChatParams.orderInfo, sendChatParams.friendInfo, sendChatParams.statement)
					}else{
						$chatUtils.sendPingInfo(this, sendChatParams.orderInfo, sendChatParams.friendInfo);
					}
				}
			},
			// 时间比较
			compareTime(time1,time2){//time1大返回1 time2大返回-1 相等返回 0
				if(time1.getTime()>time2.getTime()) return 1
				else if(time1.getTime()==time2.getTime()) return 0
				else return -1
			},
			// 选择到达时间
			arrivalTimeConfirm(e){
				if(this.instantInfo.instantArrival){
					let nowTime = new Date();
					let selectTime = new Date(this.data.date+` ${e}`);
					let startTime = new Date(this.data.date + this.instantInfo.instantTime.beginTime);
					let endTime = new Date(this.data.date + this.instantInfo.instantTime.endTime); 
					let instantTime = this.instantInfo.instantArrivalTime;
					if(this.compareTime(selectTime, startTime) < 0 || this.compareTime(selectTime, endTime) > 0){
						// 设置成功
						this.data.arrivalTime = this.data.date+` ${e}`
						this.data.arrivalTimeHM = e
					}else{
						if(this.compareTime(nowTime, selectTime) > 0){
							this.$toast.text('预约时间必须晚于当前时间')
						}else{
							let subTime = selectTime.getTime() - nowTime.getTime();
							let subSecond = subTime / (1000 * 60);
							if(subSecond <= instantTime){
								// 设置成功
								this.data.arrivalTime = this.data.date+` ${e}`
								this.data.arrivalTimeHM = e
							}else{
								let text =  `${this.instantInfo.instantTime.beginTime}-${this.instantInfo.instantTime.endTime}内 预计到达时间不得多于${instantTime}分钟`;
								this.$toast.text(text);
							}
						}
					}
				}else{
					this.data.arrivalTime = this.data.date+` ${e}`
					this.data.arrivalTimeHM = e
				}
			},
			load(type) {
				if(type == 'share'){
					this.getPingOrderView()
				}else{
					this.getInviteOrderView()
				}
			},
			async getInviteOrderView() {
				let {
					code,
					data
				} = await this.$u.api.getInviteOrderView({
					orderId: this.orderId,
				})
				this.canRefund = data.canRefund;
				this.getPageInfo(data.pingOrderViewVo);
			},
			async getPingOrderView() {
				let {
					code,
					data
				} = await this.$u.api.getPingOrderView({
					orderId: this.orderId,
				})
				this.canRefund = data.canRefund;
				this.getPageInfo(data.pingOrderViewVo);
			},
			getPageInfo(orderInfo){
				this.clubInfo = orderInfo.clubSimpleInfoVo
				this.canBill = orderInfo.canBill;
				this.orderInfo = orderInfo
				this.form.phone = orderInfo.phone
				// this.data.arrivalTime = this.orderInfo.arriveTime;
				// this.data.arrivalTimeHM = this.orderInfo.arriveTime.split(' ')[1];
				if (this.orderInfo.isJoin) {
					this.inviteId = this.orderInfo.inviteId
				}
				this.$u.api.judgeReceptionintStatusApi({
					clubId: this.clubInfo.clubId,
					staffId: orderInfo.receptionistId,
					date: this.data.date || "",
				}).then(res => {
					let staffIsReset = res.data.staffIsReset || false;
					if(staffIsReset){
						// this.receptorInfo.receptionistId = "";
						// this.receptorInfo.receptionistName = "";
						// this.receptorInfo.receptionistAvatar = "";
					}else{
						this.receptorInfo.receptionistId = orderInfo.receptionistId;
						this.receptorInfo.receptionistName = orderInfo.receptionistName;
						this.receptorInfo.receptionistAvatar = orderInfo.receptionistAvatar;
					}
				}).catch(e => {
					console.log('judgeReceptionintStatusApi Error', e);
				})
			}
		},
	}
</script>
<style lang="scss" scoped>
	.container {
		width: 100%;
		background: #1A1D29;
		.circular-select {
			width: 24rpx;
			height: 24rpx;
			border-radius: 50%;
			border: 2rpx solid #FFFFFF;
			@include flex-center();

			&.active:after {
				content: '';
				width: 10rpx;
				height: 10rpx;
				border-radius: 50%;
				background-color: #FFFFFF;
			}

			&.pink-active {
				border: 2rpx solid #ff59c9;

				&:after {
					content: '';
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background-color: #ff59c9;
				}

			}
		}

		.club_info_box {
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 30rpx;
			display: flex;
			align-items: center;

			.club_img {
				height: 110rpx;
				width: 110rpx;
				border-radius: 6rpx;
				overflow: hidden;
			}

			.club_info {
				height: 110rpx;
				width: calc(100% - 130rpx);
				margin-left: 20rpx;

				.club_name {
					font-size: 36rpx;
					color: #FFFFFF;
				}

				.club_subTitle {
					font-size: 28rpx;
					color: #959AAA;
				}
			}
		}

		.middle_box {
			width: 100%;
			background-color: #1A1D29;

			.order_detail_box {
				width: 100%;

				.form-box {
					padding: 30rpx;

					.form_title {
						font-size: 32rpx;
						color: #FFFFFF;
					}

					.form-content {
						width: 100%;

						.form_box {
							padding: 20rpx 0rpx;
						}

						.share_box {
							width: 100%;

							.share_info {
								width: 100%;

								.share_way {
									height: 100rpx;
									width: 100%;
									display: flex;
									align-items: center;
									justify-content: space-between;

									.label_text {
										font-size: 26rpx;
										color: #959AAA;
									}

									.way_list {
										display: flex;
										align-items: center;

										.common_way {
											display: flex;
											align-items: center;
											margin-left: 50rpx;

											&>image {
												height: 40rpx;
												width: 40rpx;
												background: #FFFFFF;
											}

											&>text {
												font-size: 26rpx;
												margin-left: 12rpx;
												color: #959AAA;
											}
										}
									}
								}

								.share_people {
									width: 100%;
									display: flex;
									justify-content: space-between;

									.label_text {
										font-size: 26rpx;
										color: #959AAA;
										line-height: 60rpx;
									}

									.people_list {

										.common_people {
											display: flex;
											align-items: center;
											margin-bottom: 20rpx;

											&>text {
												color: #959AAA;
												font-size: 26rpx;
											}

											.selfNum {
												margin-left: 30rpx;
											}

											&>input {
												height: 60rpx;
												width: 210rpx;
												border-radius: 4rpx;
												border: 1px solid #9292BA;
												font-size: 26rpx;
												margin-left: 50rpx;
												text-align: center;
												color: #FFFFFF;
											}

											.avgAmount {
												color: #FFFFFF;
												font-size: 32rpx;
												padding-left: 15rpx;
												padding-right: 10rpx;
											}
										}
									}
								}

							}
						}

						.common_label {
							width: 100%;
							height: 100rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.label_left {
								display: flex;
								align-items: center;

								.line {
									width: 6rpx;
									height: 26rpx;
									background: #FF59C9;
								}

								.label_text {
									font-size: 30rpx;
									color: #FFFFFF;
									margin-left: 14rpx;
									font-weight: 500;
								}
							}
						}

						.receptionist_box {
							width: 100%;

							.person_info {
								width: 100%;
								display: flex;
								align-items: center;
								justify-content: space-between;

								&>image {
									height: 70rpx;
									width: 70rpx;
									border-radius: 50%;
								}
							}

							.info_name {
								display: flex;
								align-items: center;

								&>text {
									font-size: 26rpx;
									color: #FFFFFF;
									margin-right: 24rpx;
								}
							}
						}

						.tips_box {
							width: 100%;
							margin-top: 40rpx;

							.textarea_box {
								height: 200rpx;
								width: 100%;

								&>textarea {
									width: 100%;
									height: 100%;
									font-size: 28rpx;
									color: #FFFFFF;
								}
							}
						}

					}

				}

				.order_info_box {
					padding: 0 30rpx;
					box-sizing: border-box;
					width: 100%;

					.common_label {
						width: 100%;
						height: 100rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.label_left {
							display: flex;
							align-items: center;

							.line {
								width: 6rpx;
								height: 26rpx;
								background: #FF59C9;
							}

							.label_text {
								font-size: 30rpx;
								color: #FFFFFF;
								margin-left: 14rpx;
								font-weight: 500;
							}
						}
					}

					.commodity_box {
						width: 100%;
						margin-top: 20rpx;

						.label_right {
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 4rpx;
							border: 1px solid #9FA2C0;
							height: 60rpx;
							width: 180rpx;

							&>text {
								font-size: 30rpx;
								color: #FFFFFF;
								margin-left: 10rpx;
								line-height: 60rpx;
							}
						}

						.commodity_List {
							width: 100%;

							.commodity_item {
								width: 100%;
								margin-bottom: 20rpx;
								.car_goods_box{
									width: 100%;
									display: flex;
									align-items: center;
									box-sizing: border-box;
									// padding: 20rpx;
									.goods_img_panel{
										height: 160rpx;
										width: 160rpx;
										.goods_img{
											height: 100%;
											width: 100%;
										}
									}
									.goods_info_box{
										width: calc(100% - 190rpx);
										margin-left: 30rpx;
										height: 160rpx;
										.goods_name{
											font-size: 28rpx;
											color: #FFFFFF;
											width: 100%;
											text-overflow: ellipsis;
											white-space: nowrap;
											overflow: hidden;
										}
										.price_box{
											margin-top: 80rpx;
											width: 100%;
											display: flex;
											align-items: center;
											justify-content: space-between;
											.price_text{
												color: #FFFFFF;
												font-size: 26rpx;
											}
											.num_box{
												color: #FFFFFF;
												font-size: 26rpx;
											}
										}
									}
								}
							}
						}
					}

				}
			}

			.footer_box {
				position: relative;
				position: fixed;
				bottom: 0;
				left: 0;
				z-index: 100;
				right: 0;

				height: 120rpx;
				width: 100%;
				display: flex;
				align-items: center;
				// background: $uni-title-color;
				background: #22263B;
				border-top: 1px solid #31345B;

				.price_text {
					font-size: 34rpx;
					color: #FFFFFF;
					margin-left: 30rpx;
				}

				.common_item {
					.commom_item_panel {
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;

						.car_icon {
							height: 32rpx;
							width: 32rpx;
							position: relative;

							&>image {
								height: 32rpx;
								width: 32rpx;
							}
						}

						&>text {
							font-size: 22rpx;
							color: #FFFFFF;
							margin-top: 10rpx;
						}
					}
				}

				.btn_text {
					height: 80rpx;
					width: 200rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					color: #FFFFFF;
					border-radius: 48rpx;
					position: absolute;
					right: 30rpx;
					background: #82799B;

					&.buy {
						background: $uni-button-color;
						right: 260rpx;
					}

					&.active {
						background: $uni-button-color;
					}

					&>image {
						height: 30rpx;
						width: 30rpx;
						background: #FFFFFF;
						margin-right: 14rpx;
					}
				}
			}
		}
	}
</style>
