<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#1A1D29'
			}" :title="title"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="club_info">
				<view class="club_info_box" style="background: #1A1D29;">
					<image class="club_img" :src="clubImg"></image>
					<view class="club_info">
						<view class="club_name">{{clubInfo.name}}</view>
						<view class="club_subTitle">营业时间:{{clubInfo.businessHours}}</view>
					</view>
				</view>
			</view>
			<view class="order_detail_box">
				<view class="form-box">
					<view class="form-content">
						<view class="receptionist_box" >
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">预订信息</view>
								</view>
							</view>
						</view>
						<view class="form_box">
							<common-input :value="data.name" @input="data.name=$event" label="姓名" placeholder="请填写您的真实姓名"></common-input>
							<common-input :value="data.phone"  @input="data.phone=$event" type="number" label="联系手机号" placeholder="请输入您的联系手机号"></common-input>
							<uni-datetime-picker type="time" :value="data.arrivalTimeHM" hide-second="true" :start="startDate" :end="endDate"
							    return-type="timestamp" @change="arrivalTimeConfirm">
								<common-input  :value="data.arrivalTime" label="预定到店" placeholder="请选择预定到店时间" :isArrow="true"></common-input>
							</uni-datetime-picker>
						</view>
						<view class="share_box">
							<view class="share_info" v-if="data.type!='fullAmount'">
								<view class="share_way">
									<view class="label_text"> <text>拼享方式</text> </view>
									<view class="way_list">
										<block v-for="(info, index) in shareWay"  :key="index">
											<view class="common_way" :class="{'pink-active':info.value==data.type}" @tap="tapSwitchShareWay(info.value)">
												<view class="circular-select" :class="{'pink-active':info.value==data.type}"></view>
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
												<self-number-box inputWidth="50" color="#ffffff" bgColor="#ffffff" inputHeight="40" :value="data.shareWay.menNumber" @plus="data.shareWay.menNumber++" @minus="data.shareWay.menNumber--"></self-number-box>
											</view>
											<input v-if="data.type=='customize'" type="number" v-model="data.shareWay.menWineCoin" placeholder="输入收费金额" />
											<view v-if="data.type=='AA'" class="avgAmount">{{menAvgAmount}}元</view>
										</view>
										<view class="common_people">
											<text>女</text>
											<view class="selfNum">
												<self-number-box inputWidth="50" color="#ffffff" bgColor="#ffffff" inputHeight="40"  :value="data.shareWay.womenNumber"  @plus="data.shareWay.womenNumber++" @minus="data.shareWay.womenNumber--"></self-number-box>
											</view>
											<input v-if="data.type=='customize'" type="number" v-model="data.shareWay.womenWineCoin" placeholder="输入收费金额" />
											<view v-if="data.type=='AA'" class="avgAmount">{{womenAvgAmount}}元</view>
										</view>
										
									</view>
								</view>
							</view>
						</view>
						<view class="receptionist_box" > 
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">接待人</view>
								</view>
							</view>
							<view class="person_info" @tap="$u.throttle(tapGoSelectStaff)">
								<image :src="data.receptionistAvatar"></image>
								<view class="info_name">
									<text>{{data.receptionistName}}</text>
									<u-icon name="arrow-right" color="#777CBF"></u-icon>
								</view>
							</view>
						</view>
						<view class="receptionist_box" style="margin-top: 40rpx;">
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">优惠</view>
								</view>
							</view>
							<view class="person_info" @tap="$u.throttle(couponTap)">
								<view class="discount_label" style="color: #FFFFFF;">优惠券</view>
								<view class="info_name">
									<block v-if="coupon">
										<text>立减{{coupon.discountPrice}}元</text>
									</block>
									<block v-else>
										<text v-if="couponPurview.count > 0">可使用优惠券{{couponPurview.count}}张</text>
										<text v-else>暂无可使用优惠券</text>
									</block>
									<u-icon name="arrow-right" color="#777CBF"></u-icon>
								</view>
							</view>
						</view>
						<view class="tips_box" v-if="data.type!='fullAmount'">
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">拼享要求</view>
								</view>
							</view>
							<view class="textarea_box">
								<textarea placeholder="请输入您的拼享要求" v-model="data.shareRequirements" placeholder-class="placeholder"></textarea>
							</view>
						</view>
						<view class="tips_box">
							<view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<view class="label_text">订单备注</view>
								</view>
							</view>
							<view class="textarea_box">
								<textarea placeholder="请输入您的备注信息" v-model="data.demo" placeholder-class="placeholder"></textarea>
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
							<block v-for="(item,index) in shopingCartList" :key="item.id" >
								<view class="commodity_item" @tap="$u.throttle(tapGoCommodity(item.commodity.id))">
									<drinksItem  mode="show" :info="item.commodity" :buyNum="item.buyNum"></drinksItem>
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
			<view style="height: 120rpx;"></view>
			<view class="footer_box">
				<view class="price_text">
					<text>{{orderAmount}}元</text>
				</view>
				<view class="btn_text buy" @tap="$u.throttle(tapGoDrinks, 2000)">
					<text>继续选购</text>
				</view>
				<view class="btn_text active" v-if="chatTag && data.type=='fullAmount'" @tap="$u.throttle(statementShowTap, 2000)">
					<text>去付款</text>
				</view>
				<view class="btn_text active" v-else @tap="$u.throttle(tapGoPayPage, 2000)">
					<text>去付款</text>
				</view>
			</view>
		</view>
		<statementPop ref="statementPopRef" btnText="去付款" @btnTap="sendStatement"></statementPop>
		<u-picker v-model="arrivalTimeShow" mode="time" :params="{hour:true,minute:true}" @confirm="arrivalTimeConfirm"></u-picker>
		<!-- <u-picker mode="selector" v-model="staffListShow" :range="staffList" range-key="name" @confirm="receptionistConfirm"></u-picker> -->
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	import commonInput from '@/components/common-input/common-input.vue'
	import drinksItem from '@/components/drinks-item/drinks-item.vue'
	import $calc from '@/utils/calc/index.js'
	import statementPop from '@/components/chatStatement/chatStatement'
	var app = getApp()
	export default{
		components:{
			statementPop,
			selfRate,
			commonInput,
			drinksItem
		},
		data() {
			return {
				statement:'',
				coupon:"",
				couponPurview:{},
				arrivalTimeShow:false,
				title: "填写订单",
				value: 4.5,
				sharePeople: [
					{
						label: '男',
						quantity: 1,
						money: ""
					},
					{
						label: '女',
						quantity: 1,
						money: ""
					}
				],
				shareWay: [
					{
						label: '我请客',
						value:'treat'
					},
					{
						label: 'AA',
						value:'AA'
					},
					{
						label: '自定义',
						value:'customize'
					}
				],
				
				clubInfo:{
					bannerList:[],
				},
				clubImg: '',
				seatInterval:'',
				seatIntervalStop:false,
				
				closeInterval:'',
				closeTime:0,
				data:{
					type:'',
					name:app.globalData.userInfo.name,
					phone:app.globalData.userInfo.phone,
					arrivalTime:'',
					arrivalTimeHM:'',
					receptionistId:'',
					receptionistName:'请选择接待人',
					receptionistAvatar:'/static/imgs/register/male.png',
					shareRequirements:'',
					demo:'',
					shareWay:{ //订单类型不是fullAmount时的拼享收费
						menNumber:0,
						menWineCoin:'',
						womenNumber:0,
						womenWineCoin:'',
					},
					allAmount:0,
					// shopingCartList:[],
				},
				shopingCartList:[],
				startDate:'00:01',
				endDate:'23:59',
				instantInfo: { //即时单信息
					instantArrival: false,
					instantArrivalTime: 0,
					instantTime: {},
				},
				chatTag: false,
			}
		},
		computed:{
			menAvgAmount(){
				if(this.data.shareWay.menNumber==0) return 0
				let total = this.data.shareWay.menNumber + this.data.shareWay.womenNumber 
				return this.parseFloat($calc.cDiv(this.data.allAmount,total+1))
			},
			womenAvgAmount(){
				if(this.data.shareWay.womenNumber==0) return 0
				let total = this.data.shareWay.menNumber + this.data.shareWay.womenNumber 
				return this.parseFloat($calc.cDiv(this.data.allAmount,total+1))
			},
			orderAmount(){
				let discount = this.coupon.discountPrice ? parseFloat(this.coupon.discountPrice) : 0;
				return this.data.allAmount - discount;
			}
		},
		onLoad(opt) {
			this.data = this.$u.deepMerge(this.data,JSON.parse(opt.data))
			if(this.data.chatTag == 'true'){
				this.chatTag = true;
			}else{
				this.chatTag = false;
			}
			this.load()
			if(!this.data.type){
				this.initType(this.data.orderType);
			}
			this.clearInterval = setInterval(this.jusgeEndExtend,60*1000)
			uni.$on('select-receptionist',this.handleReceptionist)
		},
		onUnload() {
			clearInterval(this.seatInterval)
			clearInterval(this.clearInterval)
			uni.$off('select-receptionist',this.handleReceptionist)
		},
		onShow() {
			this.seatIntervalStop = false
			clearInterval(this.seatInterval)
			this.seatInterval = setInterval(this.extendCardTableSelectTime,120*1000)
		},
		onHide() {
			this.seatIntervalStop = true
		},
		methods:{
			setCoupon(e){
				this.coupon = e;
			},
			couponTap(){
				if(this.couponPurview.count > 0 || this.coupon){
					uni.navigateTo({
						url: '/pages/coupon/choose-coupon?info=' + JSON.stringify({
							clubId: this.data.clubId,
							couponId: this.coupon.id || "",
							orderAmount: this.data.allAmount
						})
					})
				}
			},
			// 获取优惠券权限
			getCouponPurview(){
				this.$u.api.getCouponPurviewApi({
					orderAmount: this.data.allAmount,
					clubId: this.data.clubId
				}).then(res => {
					if(parseInt(res.code) == 0){
						this.couponPurview = res.data
					}
				}).catch(e => {
					console.log(e)
				})
			},
			initType(orderType){
				switch(orderType){
					case 'book': {
						this.data.type='fullAmount'
					};break;
					case 'fight': {
						this.data.type='customize'
					};break;
					default: break;
				}
			},
			tapGoSelectStaff(){
				this.$u.route('/pages/receptionist-list/receptionist-list',{
					receptionistId:this.data.receptionistId,
					clubId:this.data.clubId,
					date:this.data.date
				})
			},
			tapGoCommodity(id){
				this.$u.route('/pages/club/consumption/detail-not-save',{
					id:id
				})
			},
			async getShoppingCardView(){
				let {code,data} = await this.$u.api.getShoppingCardViewApi({
					cardTableId : this.data.seat.id,
					date : this.data.date,
				})
				if(code==0) {
					this.shopingCartList = data.list
				}
				
			},
			jusgeEndExtend(){
				if(this.seatIntervalStop) {
					this.closeTime++
				} else {
					this.closeTime = 0
				} 
				if(this.closeTime>=10) {
					this.closeTime = 0
					clearInterval(this.seatInterval)
				}
			},
			async extendCardTableSelectTime(){
				if(this.seatIntervalStop) return
				let {code} = await this.$u.api.extendCardTableSelectTimeApi({selectId:this.data.seat.selectId})	
				
			},
			tapGoDrinks(){
				uni.$emit('refresh-drinks',{data:JSON.stringify(this.data)})
				setTimeout(()=>{
					this.$u.route({
						type:'back'
						
					})
				},300)
			},
			goDrinks(){
				// this.data.shopingCartList = []
				uni.$emit('refresh-drinks',{data:JSON.stringify(this.data)})
				setTimeout(()=>{
					this.$u.route({
						type:'back'
						
					})
				},1000)
			},
			goSeat(){
				uni.$emit('refresh-seat')
				setTimeout(()=>{
					this.$u.route({
						type:'back',
						delta:2,
					})
				},1000)
				
			},
			compareTime(time1,time2){//time1大返回1 time2大返回-1 相等返回 0
				if(time1.getTime()>time2.getTime()) return 1
				else if(time1.getTime()==time2.getTime()) return 0
				else return -1
			},
			// 显示常用句
			statementShowTap(){
				if(this.data.name=='') return uni.showToast({title:'请输入姓名！',icon:'none'})
				// if(this.data.phone=='') return uni.showToast({title:'请输入手机号！',icon:'none'})
				if(!this.$u.test.mobile(this.data.phone)) return uni.showToast({title:'请输入正确的手机号！',icon:'none'})
				if(this.data.arrivalTime=='') return uni.showToast({title:'请选择到店时间！',icon:'none'})
				if(this.compareTime(new Date(this.data.arrivalTime.replace(/-/g, '/')),new Date())==-1) return this.$toast.text('预约时间必须晚于当前时间！')
				if(this.data.type=='customize') {
					if(this.data.shareWay.menNumber>0&&(this.data.shareWay.menWineCoin==''||parseFloat(this.data.shareWay.menWineCoin)<0)) {
						return uni.showToast({title:'必须输入男生的收费金额并且大于等于0！',icon:'none'})
					}
					if(this.data.shareWay.womenNumber>0&&(this.data.shareWay.womenWineCoin==''||parseFloat(this.data.shareWay.womenWineCoin)<0)) {
						return uni.showToast({title:'必须输入女生的收费金额并且大于等于0！',icon:'none'})
					}
				}
				if(this.data.receptionistId=='') return uni.showToast({title:'请选择接待人！',icon:'none'})
				this.$refs.statementPopRef.show();
			},
			// 确定常用语句
			sendStatement(e){
				this.statement = e;
				this.tapGoPayPage();
			},
			// 支付
			tapGoPayPage(){
				if(this.data.name=='') return uni.showToast({title:'请输入姓名！',icon:'none'})
				// if(this.data.phone=='') return uni.showToast({title:'请输入手机号！',icon:'none'})
				if(!this.$u.test.mobile(this.data.phone)) return uni.showToast({title:'请输入正确的手机号！',icon:'none'})
				if(this.data.arrivalTime=='') return uni.showToast({title:'请选择到店时间！',icon:'none'})
				if(this.compareTime(new Date(this.data.arrivalTime.replace(/-/g, '/')),new Date())==-1) return this.$toast.text('预约时间必须晚于当前时间！')
				if(this.data.type=='customize') {
					if(this.data.shareWay.menNumber>0&&(this.data.shareWay.menWineCoin==''||parseFloat(this.data.shareWay.menWineCoin)<0)) {
						return uni.showToast({title:'必须输入男生的收费金额并且大于等于0！',icon:'none'})
					}
					if(this.data.shareWay.womenNumber>0&&(this.data.shareWay.womenWineCoin==''||parseFloat(this.data.shareWay.womenWineCoin)<0)) {
						return uni.showToast({title:'必须输入女生的收费金额并且大于等于0！',icon:'none'})
					}
				}
				if(this.data.receptionistId=='') return uni.showToast({title:'请选择接待人！',icon:'none'})
				
				if(this.data.type!='fullAmount'&&(this.data.shareWay.menNumber==0&&this.data.shareWay.womenNumber==0)) {//拼享订单 没有选择人数
					return this.confirmZeroPartner()
				}
				this.confirmCreateOrder()
			},
			confirmCreateOrder(){
				let vm = this
				vm.createOrder()
			},
			confirmZeroPartner(){
				let vm = this
				uni.showModal({
				    title:'提示',
				    content:'当前拼享订单没有设置任何参团人数',
					cancelText:'设置人数',
					confirmText:'继续',
				    success: (res)=> {
				        if (res.confirm){
				            vm.confirmCreateOrder()
				        } else {
				            
				        }
				    }
				})
			},
			async createOrder(){
				uni.showLoading({
					title: '加载中'
				})
				let vm = this
				let data = this.$u.deepClone(this.data)
				let type = data.type=='fullAmount'?'yao-order':'ping-order'
				let chatFriendInfo = "";
				if(this.chatTag && data.chatFriendInfo){
					chatFriendInfo = JSON.parse(data.chatFriendInfo);
				}
				data['saveInviteUserId'] = chatFriendInfo.userId || ""; 
				data.shareWay.menNumber = data.shareWay.menNumber.toString()
				data.shareWay.menWineCoin = data.shareWay.menWineCoin==''?'0':data.shareWay.menWineCoin
				data.shareWay.womenNumber = data.shareWay.womenNumber.toString()
				data.shareWay.womenWineCoin = data.shareWay.womenWineCoin==''?'0':data.shareWay.womenWineCoin
				data = this.$u.deepMerge(data,{cardTableId:data.seat.id,shareWay:JSON.stringify(data.shareWay)})
				data['couponId'] = this.coupon.id || "";
				
				let res =  await this.$u.api.createOrderApi(data)
				uni.hideLoading();
				if(res.code==0) {
					let sendChatParams = "";
					if(this.chatTag){
						sendChatParams = {
							friendInfo: chatFriendInfo,
							type: type == 'yao-order' ? 'yaoyue' : 'ping',
							orderInfo: {
								id: res.data.orderId,
								clubCover: this.clubImg,
								clubName: this.clubInfo.name,
								date: data.arrivalTime,
								cardTableName: data.seat.sn,
							},
							statement: this.statement || "",
						}
					}
					
					this.$u.route({
						url:'pages/club/consumption/payPage',
						params:{
							chatTag: this.chatTag,
							chatParams: encodeURIComponent(JSON.stringify(sendChatParams)),
							allAmount:this.orderAmount,
							orderId:res.data.orderId,
							type:type,
							distance:4,
						},
					})
				} else if(res.code==1) {
					this.goSeat()
				} else if(res.code==2) {
					this.goDrinks()
				}
				
			},
			handleReceptionist(e){
				this.data.receptionistId = e.id
				this.data.receptionistName = e.name
				this.data.receptionistAvatar = e.avatar
			},
			arrivalTimeConfirm(e){
				if(this.instantInfo.instantArrival){
					let nowTime = new Date();
					let selectTime = new Date(this.data.date+` ${e}`);
					let startTime = new Date(this.data.date + this.instantInfo.instantTime.beginTime);
					let endTime = new Date(this.data.date + this.instantInfo.instantTime.endTime); 
					let instantTime = this.instantInfo.instantArrivalTime;
					if(this.compareTime(nowTime, startTime) < 0 || this.compareTime(nowTime, endTime) > 0){
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
			tapSwitchShareWay(type){
				if(type!='customize') {
					this.data.shareWay.menWineCoin = ''
					this.data.shareWay.womenWineCoin = ''
				}
				this.data.type = type
			},
			load(){
				this.getClubDetail()
				this.getShoppingCardView()
				this.getCanOrderTime()
				this.getCouponPurview();
			},
			getClubDetail: async function(){
				let {code,data} = await this.$u.api.getClubDetail(this.data.clubId)
				if(code==0) {
					this.clubInfo = data.info;
					let bannerList = data.info.bannerObjList;
					this.clubImg = this.getClubFrontImg(bannerList);
				}
			},
			async getCanOrderTime(){
				let {code,data} = await this.$u.api.getCanOrderTimeApi({
					id:this.data.clubId,
				})
				if(code==0) {
					let {instantArrival, instantArrivalTime, time, singleTimePeriod} = data
					this.startDate = time.startDate
					this.endDate = time.endDate
					this.instantInfo.instantArrival = instantArrival;
					this.instantInfo.instantArrivalTime = instantArrivalTime;
					this.instantInfo.instantTime = singleTimePeriod;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		.club_info_box{
			width: 100%;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 30rpx;
			display: flex;
			align-items: center;
			.club_img{
				height: 110rpx;
				width: 110rpx;
				border-radius: 6rpx;
				overflow: hidden;
			}
			.club_info{
				height: 110rpx;
				width: calc(100% - 130rpx);
				margin-left: 20rpx;
				.club_name{
					font-size: 36rpx;
					color: #FFFFFF;
				}
				.club_subTitle{
					font-size: 28rpx;
					color: #959AAA;
				}
			}
		}
		.middle_box{
			width: 100%;
			background-color: #1A1D29;
			.order_detail_box{
				width: 100%;
				.form-box {
					padding: 30rpx;
					.form_title{
						font-size: 32rpx;
						color: #FFFFFF;
					}
					.form-content {
						width: 100%;
						.form_box{
							padding: 20rpx 0rpx;
						}
						.share_box{
							width: 100%;
							.share_info{
								width: 100%;
								background: #272D41;
								border-radius: 20rpx;
								box-shadow: 0px 2rpx 10rpx 0px #191D4D;
								box-sizing: border-box;
								padding: 0rpx 30rpx;
								overflow: hidden;
								.share_way{
									height: 100rpx;
									width: 100%;
									display: flex;
									align-items: center;
									justify-content: space-between;
									.label_text{
										font-size: 28rpx;
										color: #FFFFFF;
									}
									.way_list{
										display: flex;
										align-items: center;
										.common_way{
											display: flex;
											align-items: center;
											justify-content: center;
											margin-left: 16rpx;
											height: 40rpx;
											width: 106rpx;
											background: #414168;
											border-radius: 8rpx;
											overflow: hidden;
											&.pink-active{
												background: linear-gradient(270deg, #BB0CF9 0%, #F92FAF 100%);
											}
											&>text{
												font-size: 26rpx;
												color: #FFFFFF;
											}
										}
									}
								}
								.share_people{
									width: 100%;
									display: flex;
									justify-content: space-between;
									.label_text{
										font-size: 28rpx;
										color: #FFFFFF;
										line-height: 60rpx;
									}
									.people_list{
							
										.common_people{
											display: flex;
											align-items: center;
											margin-bottom: 20rpx;
											&>text{
												color: #FFFFFF;
												font-size: 28rpx;
											}
											.selfNum{
												margin-left: 30rpx;
											}
											&>input{
												height: 60rpx;
												width: 210rpx;
												border-radius: 4rpx;
												border: 1px solid #9292BA;
												font-size: 28rpx;
												margin-left: 50rpx;
												text-align: center;
												color: #FFFFFF;
											}
											.avgAmount {
												color: #FFFFFF;
												font-size: 30rpx;
												padding-left: 15rpx;
												padding-right: 10rpx;
											}
										}
									}
								}
							
							}
						}
						.common_label{
							width: 100%;
							height: 100rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							.label_left{
								display: flex;
								align-items: center;
								.line{
									width: 6rpx;
									height: 26rpx;
									background: #FF59C9;
								}
								.label_text{
									font-size: 30rpx;
									color: #FFFFFF;
									margin-left: 14rpx;
									font-weight: 500;
								}
							}
						}
						.receptionist_box{
							width: 100%;
							.person_info{
								width: 100%;
								display: flex;
								align-items: center;
								justify-content: space-between;
								&>image{
									height: 70rpx;
									width: 70rpx;
									border-radius: 50%;
								}
							}
							.info_name{
								display: flex;
								align-items: center;
								&>text{
									font-size: 26rpx;
									color: #FFFFFF;
									margin-right: 24rpx;
								}
							}
						}
						.tips_box{
							width: 100%;
							margin-top: 40rpx;
							.textarea_box{
								height: 200rpx;
								width: 100%;
								&>textarea{
									width: 100%;
									height: 100%;
									font-size: 28rpx;
									color: #FFFFFF;
								}
							}
						}
						
					}
					
				}
								
				.order_info_box{
					padding: 0 30rpx;
					box-sizing: border-box;
					width: 100%;
					.common_label{
						width: 100%;
						height: 100rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.label_left{
							display: flex;
							align-items: center;
							.line{
								width: 6rpx;
								height: 26rpx;
								background: #FF59C9;
							}
							.label_text{
								font-size: 30rpx;
								color: #FFFFFF;
								margin-left: 14rpx;
								font-weight: 500;
							}
						}
					}
					
					.commodity_box{
						width: 100%;
						margin-top: 20rpx;
						.label_right{
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 4rpx;
							border: 1px solid #9FA2C0;
							height: 60rpx;
							width: 180rpx;
							&>text{
								font-size: 30rpx;
								color: #FFFFFF;
								margin-left: 10rpx;
								line-height: 60rpx;
							}
						}
						.commodity_List{
							width: 100%;
							.commodity_item{
								width: 100%;
								margin-bottom: 20rpx;
							}
						}
					}
					
				}
			}
			.footer_box{
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
				.price_text{
					font-size: 34rpx;
					color: #FFFFFF;
					margin-left: 30rpx;
				}
				.common_item{
					.commom_item_panel{
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						.car_icon{
							height: 32rpx;
							width: 32rpx;
							position: relative;
							&>image{
								height: 32rpx;
								width: 32rpx;
							}
						}			
						&>text{
							font-size: 22rpx;
							color: #FFFFFF;
							margin-top: 10rpx;
						}
					}
				}
				.btn_text{
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
					&.buy{
						background: $uni-button-color;
						right: 260rpx;
					}
					&.active{
						background: $uni-button-color;
					}
					&>image{
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
