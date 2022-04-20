<template>
	<view class="container">
		<view class="middle_box">
			<view class="pay_description">
				<view class="desc_item">
					<image src="/static/imgs/common/desc_icon.png"></image>
					<view class="desc_text">
						<text>购买须知</text>
					</view>
				</view>
				<block v-if="type == 'ping-order'">
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>感谢您的光临，<text style="color: red;">确认下单将不予退还，请在预订时间内到达场所</text> 否则将自动取消，您的本次预约不能退还，可以改天消费或存酒</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>如当天订单未能及时消费，可修改一次日期预定台位，第二次预定若未能到店将不予改期只能存酒</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>台位非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退还</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>改期所选台位的最低消费不得高于逾期订单的支付金额</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>请在有效期内按规定重新下单或取酒，如有疑问请及时联系客服</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>未成年人禁止娱乐后果自负</text>
						</view>
					</view>
				</block>
				<block v-else-if="type == 'yao-order'">
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>感谢您的光临，<text style="color: red;">确认下单将不予退还，请在预订时间内到达场所</text>否则将自动取消，您的本次预约不能退还，可以改天消费或存酒</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>台位非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退还</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>如当天订单未能及时消费，可修改一次日期预定台位，第二次预定若未能到店将不予改期只能存酒</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>改期所选台位的最低消费不得高于逾期订单的支付金额</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>请在有效期内按规定重新下单或取酒，如有疑问请及时联系客服</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>未成年人禁止娱乐后果自负</text>
						</view>
					</view>
				</block>
				<block v-else-if="type == 'ping-join-order'">
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>感谢您的光临，<text style="color: red;">参与别人拼单，可在预约时间前1个小时退出拼单并退款，过时不予退款，且无法改期</text> </text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text style="color: red;">若发起拼单者当天未能及时消费，参与别人拼单者会自动退款</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>台位非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退还</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>未成年人禁止娱乐后果自负</text>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>感谢您的光临，请在预订时间内到达场所否则将自动取消，您的本次预约不能退还，可以改天消费或者存酒 </text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>若超过预约时间，您有一次改期机会，可在酒吧重新选位下单，第二次将不予改期，只能存酒</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>改期所选台位的最低消费不得高于逾期订单的支付金额</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>请在有效期内按规定重新下单或取酒，如有疑问，请及时联系客服</text>
						</view>
					</view>
					<view class="desc_item"  style="margin-top: 10rpx;" >
						<view class="point"></view>
						<view class="desc_text">
							<text>未成年人禁止娱乐后果自负</text>
						</view>
					</view>
				</block>
				<view class="purchase_select_box" @tap="noteAgree = !noteAgree">
					<image src="/static/imgs/common/select2.png" v-if="noteAgree"></image>
					<image src="/static/imgs/common/no-select.png" v-else></image>
					<text>确认已读购买须知</text>
				</view>
			</view>
			<view class="common_tips" v-if="type == 'ping-join-order'">
				<view class="common_tips_item">支持提前1小时退</view>
				<view class="common_tips_item">过时不可改期</view>
			</view>
			<view class="common_tips" v-else>
				<view class="common_tips_item">不支持退</view>
				<view class="common_tips_item">可以改期</view>
			</view>
			<view class="pay-kind">
				<view class="alipay-cost" @tap="payType='AliPay'">
					<view class="cost-left">
						<image src="/static/imgs/mine/AliPay.png" mode=""></image>
						<text>支付宝</text>
					</view>
					<view class="cost-right">
						<image src="/static/imgs/common/select.png" mode="" v-if="payType=='AliPay'"></image>
						<image src="/static/imgs/mine/no-select.png" mode="" v-else></image>
					</view>
				</view>
				<view class="weixin-cost" @tap="payType='WechatPay'">
					<view class="cost-left">
						<image src="/static/imgs/mine/weixin_pay.png" mode=""></image>
						<text>微信</text>
					</view>
					<view class="cost-right">
						<image src="/static/imgs/common/select.png" mode="" v-if="payType=='WechatPay'"></image>
						<image src="/static/imgs/mine/no-select.png" mode="" v-else></image>
					</view>
				</view>
				<view class="weixin-cost" @tap="payType='Balance'">
					<view class="cost-left">
						<image src="/static/imgs/mine/balance_pay.png" mode=""></image>
						<text>余额</text>
					</view>
					<view class="cost-right">
						<image src="/static/imgs/common/select.png" mode="" v-if="payType=='Balance'"></image>
						<image src="/static/imgs/mine/no-select.png" mode="" v-else></image>
					</view>
				</view>
			</view>
			<view class="pay_info">
				<view class="info_icon"> <image src="/static/imgs/common/price_icon.png"></image> </view>
				<view class="info_price"> <text>{{allAmount}}</text> </view>
				<view class="info_unit"></view>
				<view class="tips">
					<view class="tips_icon" @tap="toggleAgree">
						<image v-if="!tipsAgree" src="/static/imgs/common/no-select.png" ></image>
						<image v-else src="/static/imgs/common/select2.png" ></image>
					</view>
					
					<text>用户安全须知 <text style="color: #FFFFFF;" @tap="$u.throttle(goArticle('protocol'))">《爬梯秀用户协议》</text> </text>
				</view>
			</view>
		</view>
		<view class="footer_box">
			<view class="pay_btn" @tap="$u.debounce(tapPay, 400, true)"> <text>支付{{allAmount}}元</text> </view>
		</view>
		<pay ref="payRef" @pay="handlePay" :fillPassword="false" unitText="元"></pay>
	</view>
</template>

<script>
	import paymentUtils from '@/common/payment.js'
	import $chatUtils from '@/common/chat.js'
	// import noteUtils from './purchaseNotes.js'
	const app = getApp()
	export default{
		components:{
		},
		data() {
			return {
				tipsAgree: true,
				noteAgree: false,
				params:{},
				allAmount:0,
				type:'',
				distance:1,
				payType: 'AliPay',
				btnAvaliable: true,
			}
		},
		computed:{
			// buyMustKnowList(){
			// 	if(this.type=='ping-order') {//拼享订单购买须知
			// 		return noteUtils.pingNotes;
			// 	}else if(this.type=='yao-order'){ //邀约订单购买须知
			// 		return noteUtils.yaoyueNotes;
			// 	}else if(this.type=='ping-join-order'){//加入拼享订单付款
			// 		return noteUtils.joinPingNotes;
			// 	}else{ // 默认
			// 		return noteUtils.defaultNotes;
			// 	}
			// },
		},
		onLoad(opt) {
			this.params = this.$u.deepClone(opt)
			let {allAmount,type} = opt
			if(opt.distance) {
				this.distance = opt.distance
			}
			this.allAmount = allAmount
			this.type = type;
		},
		onBackPress(options) {  
			if (options.from === 'navigateBack') {  
				return false;  
			}  
			this.back(this.distance)
			return true;  
		},  
		methods:{
			// 邀约发信息
			sendInfo(){
				let chatParams = JSON.parse(this.params.chatParams);
				if(chatParams.type == 'yaoyue'){
					$chatUtils.sendYaoyueInfo(this, chatParams.orderInfo, chatParams.friendInfo, chatParams.statement)
				}else{
					$chatUtils.sendPingInfo(this, chatParams.orderInfo, chatParams.friendInfo);
				}
			},
			back(delta){
				this.$u.route({
					type:'back',
					delta:delta
				}) 
			},
			paymentHandle: function(data, callback){
				let payParams = {};
				let payType = this.payType;
				if(payType == 'Balance'){
					callback();
					return
				}
				if(payType == 'AliPay'){
					payParams = {
						provider: 'alipay',
						orderInfo: data.res.body
					}
				}
				if(payType == 'WechatPay'){
					payParams = {
						provider: 'wxpay',
						orderInfo:{
							appId: data.res.appId,
							nonceStr: data.res.nonceStr,
							timeStamp: data.res.timeStamp,
							packageValue: data.res.packageValue,
							sign: data.res.sign,
							partnerId: data.res.partnerId,
							prepayId: data.res.prepayId,
						}
					}
				}
				paymentUtils.initPay(payParams).then(res => {
					callback();
				}).catch(e => {
					console.log(e)
					this.btnAvaliable = true;
					uni.showToast({
						title: '支付失败',
						icon: 'none'
					})
				});
			},
			handlePay(e){
				let data = {
					payType: this.payType
				}
				if(this.payType == 'Balance'){
					let password = e.password || "";
					data['payPassword'] = password;
				}
				if(this.type=='ping-order') { //拼享订单支付
					data = this.$u.deepMerge(data,{orderId:this.params.orderId})
					this.payOrder(data)
				} 
				if(this.type=='yao-order') { // 邀约订单支付
					data = this.$u.deepMerge(data,{orderId:this.params.orderId})
					this.payOrder(data)
				}
				if(this.type=='add-wine') {
					data = this.$u.deepMerge(data,{orderId:this.params.orderId})
					this.addWinePay(data)
				}
				if(this.type=='ping-join-order') { //别人加入我的支付
					data['orderId'] = this.params.orderId;
					this.payPingJoin(data)
				}
				if(this.type == 'ping-join-order-invite'){// 我邀请别人支付
					data['orderId'] = this.params.orderId;
					this.payPingJoinInvite(data)
				} 
			},
			async payPingJoinInvite(params){
				uni.showLoading({
					title: '加载中'
				})
				let {code,data} = await this.$u.api.payPingInviteApi(params)
				uni.hideLoading()
				if(code==0) {
					this.paymentHandle(data, () => {
						this.$refs.payRef.close();
						this.btnAvaliable = true;
						uni.$emit('order-list-refresh')
						uni.$emit('ping-order-detail-refresh')
						uni.$emit('agreePingSuccess')
						this.$u.route({
							type:'redirect',
							url:'/pages/club/consumption/paySuccess',
							params:{allAmount:this.allAmount,type:'ping-join-order',distance:this.distance},
						})
						this.setPayPasswordToStorage(params.payPassword)
					})
				} else if(code==1) {//订单不存在
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index?type=share', 
						})
					},500)
				} else if(code==2) {//已经付款
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index?type=share',
						})
					},500)
				} else if(code==3) {//该订单已经超出付款时间被取消了
					this.$u.route({
						type:'back'
					})
				} else if(code==4) {//支付密码未设置
					setTimeout(()=>{
						this.$u.route({
							url:'/pages/mine/setting/pay_password',
						})
					},500)
				} else if(code==5) {//余额不足
				this.btnAvaliable = true;
					this.$u.toast('余额不足,请更换支付方式');
				} else if(code==7) {
					this.$refs.payRef.subInputTimes();
					this.removePayPasswordToStorage();
					this.btnAvaliable = true;
				} else if(code == 8){
					uni.navigateBack({
						delta:2
					})
				} else {
					this.btnAvaliable = true;
				}
			},
			async payPingJoin(params){
				uni.showLoading({
					title: '加载中'
				})
				let {code,data} = await this.$u.api.payPingJoinApi(params)
				uni.hideLoading()
				if(code==0) {
					this.paymentHandle(data, () => {
						this.$refs.payRef.close();
						this.btnAvaliable = true;
						uni.$emit('order-list-refresh')
						uni.$emit('ping-order-detail-refresh')
						uni.$emit(this.params.method, data.joinTogetherId);
						this.$u.route({
							type:'redirect',
							url:'/pages/club/consumption/paySuccess',
							params:{allAmount:this.allAmount,type:this.type,distance:this.distance},
						})
						this.setPayPasswordToStorage(params.payPassword)
					})
				} else if(code==1) {//订单不存在
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index?type=share', 
						})
					},500)
				} else if(code==2) {//已经付款
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index?type=share',
						})
					},500)
				} else if(code==3) {//该订单已经超出付款时间被取消了
					this.$u.route({
						type:'back'
					})
				} else if(code==4) {//支付密码未设置
					setTimeout(()=>{
						this.$u.route({
							url:'/pages/mine/setting/pay_password',
						})
					},500)
				} else if(code==5) {//余额不足
				this.btnAvaliable = true;
					this.$u.toast('余额不足,请更换支付方式');
				} else if(code==7){ // 密码输入错误
					this.$refs.payRef.subInputTimes();
					this.btnAvaliable = true;
					this.removePayPasswordToStorage()
				} else if(code == 8){
					uni.navigateBack({
						delta:2
					})
				} else {
					this.btnAvaliable = true;
				}
			},
			async addWinePay(params){
				uni.showLoading({
					title: '加载中'
				})
				let {code,data} = await this.$u.api.addWinePayApi(params)
				uni.hideLoading();
				if(code==0) {
					this.paymentHandle(data, () => {
						this.$refs.payRef.close();
						this.btnAvaliable = true;
						this.refreshPage();
						if(this.params.chatTag && this.params.chatTag == 'true'){
							this.sendInfo();
						}
						this.$u.route({
							type:'redirect',
							url:'/pages/club/consumption/paySuccess',
							params:{allAmount:this.allAmount,type:this.type,distance:this.distance},
						})
					})	
				} else if(code==1) {//订单不存在
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index', 
						})
					},500)
				} else if(code==2) {//订单未支付
					setTimeout(()=>{
						uni.reLaunch({
							url: '/pages/index/index',
						})
					},500)
				} else if(code==3) {//未添加酒水
					this.$u.route({
						type:'back'
					})
				} else if(code==4) {//库存不足
					this.$u.route({
						type:'back'
					})
				} else if(code==5) {//支付密码未设置
					setTimeout(()=>{
						this.$u.route({
							url:'/pages/mine/setting/pay_password',
						})
					},500)
				} else if(code==6) {//余额不足
					this.$u.toast('余额不足,请更换支付方式');
					this.btnAvaliable = true;
				} else if(code == 7){ // 支付密码错误
					this.$refs.payRef.subInputTimes();
					this.removePayPasswordToStorage();
					this.btnAvaliable = true;
				} else if(code == 8){
					uni.navigateBack({
						delta:2
					})
				} else {
					this.btnAvaliable = true;
				}
			},
			async payOrder(params){
				uni.showLoading({
					title: '加载中'
				})
				let {code,data} = await this.$u.api.payOrdertApi(params)
				uni.hideLoading();
				if(code==0) {
					this.paymentHandle(data, () => {
						this.$refs.payRef.close();
						this.btnAvaliable = true;
						this.refreshPage();
						if(this.params.chatTag && this.params.chatTag == 'true'){
							this.sendInfo();
						}
						this.$u.route({
							type:'redirect',
							url:'/pages/club/consumption/paySuccess',
							params:{allAmount:this.allAmount,type:this.type,distance:this.distance},
						})
					})
				} else if(code==1) {
					setTimeout(()=>{
						let url = '';
						if(this.type =='ping-order'){
							url = '/pages/index/index?type=share';
						}else{
							url = '/pages/index/index'
						}
						uni.reLaunch({
							url: url,
						})
					},500)
				} else if(code==2) { // 设置密码
					setTimeout(()=>{
						this.$u.route({
							url:'/pages/mine/setting/pay_password',
						})
					},500)
				} else if(code==3) { // 余额不足
					this.$u.toast('余额不足,请更换支付方式');
					this.btnAvaliable = true;
					// setTimeout(()=>{
					// 	this.$u.route({
					// 		url:'/pages/mine/myWallet/recharge',
					// 	})
					// },500)
				} else if(code== 7) { // 密码输入错误
					this.removePayPasswordToStorage()
					this.$refs.payRef.subInputTimes();
					this.btnAvaliable = true;
				} else if(code == 8){
					uni.navigateBack({
						delta:2
					})
				} else{
					this.btnAvaliable = true;
				}
			},
			refreshPage(){
				uni.$emit('order-list-refresh')
				uni.$emit('yao-order-detail-refresh')
				uni.$emit('ping-order-detail-refresh')
				uni.$emit('pay-order-refresh')
				uni.$emit('refresh-seat');
				uni.$emit('refresh-drinks-detail')
			},
			toggleAgree: function(){
				this.tipsAgree = !this.tipsAgree;
			},
			tapPay: function(){
				if(!this.noteAgree)  return uni.showToast({title:'请勾选购买须知！',icon:'none'})
				if(!this.tipsAgree)  return uni.showToast({title:'请勾选用户安全须知！',icon:'none'})
				if(!this.btnAvaliable){
					this.$u.toast('请勿重复点击')
					return
				}
				if(this.payType == 'Balance'){
					this.$refs.payRef.open(this.allAmount);
				}else{
					this.btnAvaliable = false;
					this.handlePay();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.middle_box{
		width: 100%;
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 230rpx;
		.common_tips{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			&_item{
				line-height: 30rpx;
				border: 1px solid #F92FAF;
				color: #F92FAF;
				margin-right: 20rpx;
				box-sizing: border-box;
				padding: 0 10rpx;
				font-size: 24rpx;
			}
		}
		.pay_description{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			border-radius: 10rpx;
			background: #2C3158;
			box-sizing: border-box;
			padding: 30rpx;
			.purchase_select_box{
				width: 100%;
				display: flex;
				align-items: center;
				height: 60rpx;
				&>image{
					height: 30rpx;
					width: 30rpx;
					margin-right: 20rpx;
				}
				&>text{
					font-size: 26rpx;
					color: #FFFFFF;
				}
			}
			.desc_item{
				width: 100%;
				line-height: 40rpx;
				display: flex;
				color: #FFFFFF;
				font-size: 26rpx;
				.point{
					height: 8rpx;
					width: 8rpx;
					background: #FFFFFF;
					border-radius: 50%;
					margin: 16rpx;
					margin-left: 8rpx;
				}
				&>image{
					height: 26rpx;
					width: 26rpx;
					text-align: center;
					margin-top: 7rpx;
				}
				.desc_text{
					flex: 1;
					margin-left: 14rpx;
				}
			}
		}
		.pay-kind {
			padding: 0 30rpx;
			.alipay-cost {
				@include verticalCenter();
				justify-content: space-between;
				margin-top: 45rpx;
				.cost-left {
					font-size: 30rpx;
					color: #ffffff;
					@include verticalCenter();
					& > image {
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}	
				.cost-right {
					& > image {
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
			.weixin-cost {
				@include verticalCenter();
				justify-content: space-between;
				margin-top: 60rpx;
		
				.cost-left {
					font-size: 30rpx;
					color: #ffffff;
					@include verticalCenter();
		
					& > image {
						width: 50rpx;
						height: 50rpx;
						margin-right: 20rpx;
					}
				}
		
				.cost-right {
					& > image {
						width: 30rpx;
						height: 30rpx;
					}
				}
			}
		}
		.tips{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 40rpx;
			.tips_icon{
				height: 26rpx;
				width: 26rpx;
				text-align: center;
				&>image{
					height: 100%;
					width: 100%;
					vertical-align: top;
				}
			}
			&>text{
				font-size: 22rpx;
				color: #9292BA;
				margin-left: 20rpx;
			}
		}
		.pay_info{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			width: 100%;
			margin-top: 100rpx;
			.info_icon{
				height: 100rpx;
				width: 100rpx;
				&>image{
					height: 100%;
					width: 100%;
				}
			}
			.info_price{
				font-size: 60rpx;
				color: #FFFFFF;
				font-size: 500;
				line-height: 80rpx;
			}
			.info_unit{
				font-size: 36rpx;
				color: #FFFFFF;
				line-height: 46rpx;
			}
			
		}
	}
	.footer_box{
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		z-index: 10;
		box-sizing: border-box;
		padding-bottom: 30rpx;
		background: #191C3F;
		.pay_btn{
			height: 80rpx;
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			line-height: 80rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 30rpx;
			border-radius: 40rpx;
			margin-top: 60rpx;
			background: $uni-button-color;
		}
	}
</style>
