<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="充值" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false">
				<view class="header-box-right" slot="right" @tap="$u.throttle(tapGoRechargeRecord)"><text>充值记录</text></view>
			</u-navbar>
		</view>
		<view class="remain-money">
			<image src="/static/imgs/mine/money_icon.png" mode=""></image>
			<text>您当前剩余酒币: {{wineCoin}}币</text>
		</view>
		<view class="line"><u-gap height="1" bg-color="#31345B"></u-gap></view>
		<view class="recharge-kind">
			<view class="recharge-item" :class="{ active: index==selectIndex }" @tap="selectIndex=index" v-for="(item, index) in coinRechargeList" :key="index">
				<view class="select-num"><!-- <image src="/static/imgs/mine/select_red.png" mode=""></image> --></view>
				<view class="recharge-get">
					<image src="/static/imgs/mine/money_icon.png" mode=""></image>
					<text>{{ item.wineCoin }}</text>
					酒币
				</view>
				<text>{{ item.rmb }}元</text>
			</view>
		</view>
		<view class="pay-title">
			<view class="title-line"></view>
			<text>支付方式</text>
		</view>
		<view class="line"><u-gap height="1" bg-color="#31345B"></u-gap></view>
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
			<view class="weixin-cost" @tap="payType='WeChat'">
				<view class="cost-left">
					<image src="/static/imgs/mine/weixin_pay.png" mode=""></image>
					<text>微信</text>
				</view>
				<view class="cost-right">
					<image src="/static/imgs/common/select.png" mode="" v-if="payType=='WeChat'"></image>
					<image src="/static/imgs/mine/no-select.png" mode="" v-else></image>
				</view>
			</view>
			<!-- <view class="weixin-cost" @tap="payType='Apple'" v-if="os == 'ios'">
				<view class="cost-left">
					<image src="/static/imgs/mine/apple_pay.png" mode=""></image>
					<text>苹果</text>
				</view>
				<view class="cost-right">
					<image src="/static/imgs/common/select.png" mode="" v-if="payType=='Apple'"></image>
					<image src="/static/imgs/mine/no-select.png" mode="" v-else></image>
				</view>
			</view> -->
		</view>
		<view class="recharge-btn">
			<button type="default" @tap="$u.throttle(tapSubmit)"><text>确认充值</text></button>
		</view>
	</view>
</template>

<script>
	import payment from '@/common/payment.js'
export default {
	data() {
		return {
			coinRechargeList: [],
			selectIndex:0,
			payType:'AliPay',
			// payType:'WeChat',
			wineCoin:'',
			os: '',
		};
	},
	onLoad() {
		this.os = this.$u.os();
		console.log(this.os)
		this.load();
		uni.$on('update-wineCoin',this.getBalance)
	},
	onUnload() {
		uni.$off('update-wineCoin',this.getBalance)
	},
	methods: {
		tapGoRechargeRecord(){
			this.$u.route('/pages/mine/myWallet/recharge-record')
		},
		load(){
			this.getBalance()
			this.getCoinRechargeList()
		},
		async getCoinRechargeList(){
			let {code,data} = await this.$u.api.getCoinRechargeListApi({})
			if(code==0) {
				let {coinRechargeList} = data
				this.coinRechargeList = coinRechargeList
			}
		},
		//我的钱包余额
		async getBalance() {
			let {code,data} = await this.$u.api.myWalletApi({})
			if(code==0) {
				let {wineCoin} = data
				this.wineCoin = wineCoin
			}
		},
		async tapSubmit(){
			let payType = this.payType
			let params = {coinRechargeId:this.coinRechargeList[this.selectIndex].id}
			let {code,data} = await this.$u.api.wineCoinRechargeApi(params)
			if(code==0) {
				let {id} = data
				switch (payType){
					case 'AliPay':
						this.getWineCoinAliPayPaymentApi(id,this.coinRechargeList[this.selectIndex].wineCoin)
						break;
					case 'WeChat':
						this.getWineCoinWeChatPayment(id,this.coinRechargeList[this.selectIndex].wineCoin)
						break;
					case 'Apple':
						this.applePayment(id,this.coinRechargeList[this.selectIndex].wineCoin);
						break;
					default:
						break;
				}
				
			}
		},
		async applePayment(id, wineCoin){
			payment.iphonePay(['jiubi6']).then(res => {
				console.log(res);
			}).catch(e => {
				console.log(e);
			})
		},
		async getWineCoinWeChatPayment(id,wineCoin){
			let vm = this
			let {code,data} = await this.$u.api.getWineCoinWeChatPaymentApi({"recharge.id":id})
			if(code==0) {
				console.log(data)
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo:{
						appid: data.res.appId,
						noncestr: data.res.nonceStr,
						timestamp: data.res.timeStamp,
						package: data.res.packageValue,
						sign: data.res.sign,
						partnerid: data.res.partnerId,
						prepayid: data.res.prepayId,
					},
					success: (res)=>{
						vm.payS(wineCoin)
					},
					fail: function (err) {
						vm.$toast.text('支付失败')
						console.log('fail:' + JSON.stringify(err));
					}
				});
			}
		},
		async getWineCoinAliPayPaymentApi(id,wineCoin){
			let vm = this
			let {code,data} = await this.$u.api.getWineCoinAliPayPaymentApi({"recharge.id":id})
			if(code==0) {
				console.log(data)
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: data.res.body, //微信、支付宝订单数据
					success:  (res) =>{
						vm.payS(wineCoin)			
					},
					fail: function (err) {
						vm.$toast.text('支付失败')
						console.log('fail:' + JSON.stringify(err));
					}
				})
			}
			
		},
		payS(wineCoin){
			uni.$emit('update-wineCoin')
			uni.$emit('update-walletIndex')
			this.$u.route({
				type:'redirect',
				url:'/pages/mine/myWallet/paySuccess',
				params:{
					wineCoin:wineCoin
				}
			})
		},
		
	}
};
</script>

<style lang="scss" scoped>
.container {
	position: relative;
	.header-box {
		margin-bottom: 40rpx;

		.header-box-right {
			color: #ffffff;
			font-size: 30rpx;
			padding-right: 30rpx;
		}
	}

	.remain-money {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		margin-bottom: 30rpx;

		& > image {
			width: 45rpx;
			height: 45rpx;
		}

		& > text {
			font-size: 32rpx;
			color: #ffffff;
			margin-left: 30rpx;
		}
	}

	.line {
		padding: 0 30rpx;
	}

	.recharge-kind {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30rpx;
		margin-top: 30rpx;

		.recharge-item {
			@include verticalCenter();
			flex-direction: column;
			justify-content: center;
			position: relative;
			width: 216rpx;
			height: 130rpx;
			background-color: #2c3158;
			border-radius: 6rpx;
			font-size: 25rpx;
			color: #979dce;
			margin-right: 20rpx;
			margin-bottom: 20rpx;

			&:nth-child(3n) {
				margin-right: 0rpx;
			}
			&.active {
				&:after {
					content: '';
					background: url('https://vverp1.oss-cn-shanghai.aliyuncs.com/202012/20201203/select_red-20201203113926147.png');
					background-size: 100% 100%;
					z-index: 3;
					width: 50rpx;
					height: 50rpx;
					position: absolute;
					right: -16rpx;
					top: -16rpx;
				}
			}
			// .select-num {
			// 	position: absolute;
			// 	right: -16rpx;
			// 	top: -16rpx;

			// 	&>image {
			// 		width: 50rpx;
			// 		height: 50rpx;
			// 	}
			// }

			.recharge-get {
				font-size: 28rpx;
				color: #ffffff;

				& > image {
					width: 28rpx;
					height: 28rpx;
				}

				& > text {
					font-size: 34rpx;
					margin-left: 9rpx;
				}
			}
		}
	}

	.pay-title {
		margin-top: 40rpx;
		padding: 0 30rpx;
		margin-bottom: 30rpx;
		@include verticalCenter();

		.title-line {
			width: 6rpx;
			height: 26rpx;
			background: #ff59c9;
			margin-right: 15rpx;
		}

		& > text {
			font-size: 30rpx;
			color: #ffffff;
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

	.recharge-btn {
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;

		& > button {
			@include verticalCenter();
			justify-content: center;
			width: 690rpx;
			height: 90rpx;
			background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
			border-radius: 49rpx;
			font-size: 30rpx;
			color: #ffffff;
		}
	}
}
</style>
