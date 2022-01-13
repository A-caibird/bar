<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="提现金额" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false"></u-navbar>
		<view class="content">
			<view class="first_item">
				<text>可提现余额</text>
				<text>{{ balanceAll }}元</text>
			</view>
			<view class="second_item"><text>需提现余额</text></view>
			<view class="third_item">
				<view style="height: 40px;color: #9292BA;font-size: 28rpx;" @tap="keyBoardShow=true">{{amount}}</view>
			</view>
			<view class="forth_item">
				<text>到账金额</text>
				<text>¥{{amount}}(元)</text>
			</view>
			<view class="bg"></view>
			<view class="fifth_item">
				<view class="left">
					<view class="line"></view>
					<text>支付宝提现<template v-if="!hasBindAliAccount"><text style="color : #ff59c9;margin-left: 5rpx;">(未绑定支付宝)</text></template></text>
				</view>
				<template v-if="hasBindAliAccount">
					<view class="right" @tap="$u.throttle(tapGoAlipayInfo('update'))">
						修改
					</view>
				</template>
				<template v-else>
					<view class="right" @tap="$u.throttle(tapGoAlipayInfo('bind'))">
						绑定
					</view>
				</template>
				
			</view>
			<template v-if="hasBindAliAccount">
				<view class="bg2"></view>
				<view class="msg_part">
					<text>真实姓名</text>
					<view class="part"><text>{{aliAccountRealName}}</text></view>
					<text>支付宝账号</text>
					<view class="part"><text>{{aliAccount}}</text></view>
				</view>
				<view class="sure_btn" @tap="$u.throttle(tapAliPayCashOut)"><button type="default" hover-class="none" >提现</button></view>
			</template>
			
		</view>
		<u-keyboard ref="diamondKeyBoard" mode="number" safe-area-inset-bottom :mask="false" :tooltip="false" :dot-enabled="true" v-model="keyBoardShow" @change="diamondKeyBoardC" @backspace="diamondKeyBoardB"></u-keyboard>
		<pay ref="alipayCashOut" :fillPassword="false" mode="cashOut" @pay="aliPayCashOut($event)"></pay>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				balanceAll: '',
				balance: '',
				keyBoardShow:false,
				
				hasBindAliAccount:false,
				aliAccount: '',
				aliAccountRealName: '',
			};
		},
		computed:{
			amount(){
				if(this.balance=='') return 0
				return parseFloat(this.balance)
			},
		
		},
		onLoad(options) {
			this.load()
			uni.$on('update-deposit',this.getBindAliAccountInfo)
			uni.$on('update-balance',this.getBalance)
		},
		onUnload() {
			uni.$off('update-deposit',this.getBindAliAccountInfo)
			uni.$off('update-balance',this.getBalance)
		},
		methods: {
			tapGoAlipayInfo(mode){
				this.$u.route('/pages/update-alipay-info/update-alipay-info'+`?mode=${mode}` + `&aliAccountRealName=${this.aliAccountRealName}` + `&aliAccount=${this.aliAccount}`)
			},
			async aliPayCashOut({password}) {
				let params = {
					amount: this.amount,
					payPassword: password,
					"name": this.aliAccountRealName ,     //真实姓名
					"aliAccount": this.aliAccount
				}
				console.log(params)
				let {code,data, msg} = await this.$u.api.balanceWithdrawAPI(params)
				if(code==0) {
					uni.$emit('update-balance')
					uni.$emit('update-walletIndex')
					this.$toast.confirm('','提现申请提交成功！',false)
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},500)
					this.setPayPasswordToStorage(params.payPassword)
				}  else {
					this.removePayPasswordToStorage()
					if(msg.indexOf('支付密码不正确') >= 0){
						this.$refs.alipayCashOut.subInputTimes();
					}
				}
			},
			async tapAliPayCashOut(){
				if(this.amount==0) return this.$toast.text('请输入提现金额！')
				await this.judgePayCode()
				this.$refs.alipayCashOut.open(this.amount)
			},
			
			diamondKeyBoardC(val) {
				let balance = this.balance;
				if( val == '.' && (balance.indexOf('.') >= 0 || !balance )){
					return
				}else{
					balance = balance + val
				}
				if(parseFloat(balance)>parseFloat(this.balanceAll)) {
					this.balance = this.balanceAll.toString()
				}else{
					this.balance = balance;
				}
			},
			diamondKeyBoardB() {
				if(this.balance.length) this.balance = this.balance.substr(0, this.balance.length - 1)
			},
			load(){
				this.getBalance()
				this.getBindAliAccountInfo()
			},
			async getBindAliAccountInfo(){
				let {code,data} = await this.$u.api.getBindAliAccountInfoApi()
				if(code==0){
					console.log(data)
					let {hasBindAliAccount,aliAccount,aliAccountRealName} = data
					this.hasBindAliAccount = hasBindAliAccount
					if(hasBindAliAccount) {
						this.aliAccount = aliAccount
						this.aliAccountRealName = aliAccountRealName
					} 
				}
			},
			//我的钱包余额
			getBalance: function() {
				let params = {}
				this.$u.api.myBalanceApi(params).then(res => {
					var code = res.code;
					if (parseInt(code) == 0) {
						this.balanceAll=res.data.balance
					}
				}).catch(e => {
					console.log(e)
				})
			}
			
		}
	};
	
</script>

<style lang="scss">
.content {
	margin-top: 39rpx;
	margin-right: 30rpx;
	margin-left: 30rpx;
}

.first_item {
	font-size: 30rpx;
	color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;

	& > text:nth-last-child(1) {
		color: #ff59c9;
	}
}

.second_item {
	margin-top: 42rpx;
	font-size: 30rpx;
	color: #ffffff;
}
.third_item {
	margin-top: 42rpx;
	width: 690rpx;
	height: 90rpx;
	border: 1px solid #474d7e;
	padding-left: 25rpx;
	padding-top: 25rpx;
}
.forth_item {
	font-size: 30rpx;
	color: #ffffff;
	margin-top: 29rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	& > text:nth-last-child(1) {
		color: #ff59c9;
	}
}

.bg {
	margin-left: -30rpx;
	margin-top: 24rpx;
	width: 750rpx;
	height: 20rpx;
	background: #20234b;
}

.fifth_item {
	margin-top: 33rpx;
	@include height-center();
	justify-content: space-between;
	.left {
		@include height-center();
		.line {
			width: 6rpx;
			height: 26rpx;
			background: #ff59c9;
			margin-right: 14rpx;
		}
		text {
			font-size: 30rpx;
			color: #ffffff;
		}
	}
	.right {
		font-size: 28rpx;
		color: #ff59c9;
	}
}


.bg2 {
	margin-top: 30rpx;
	width: 690rpx;
	height: 1rpx;
	border: 1rpx solid #31345b;
}

.sixth_item {
	margin-top: 22rpx;
	color: #aeaee7;
	font-size: 26rpx;
}

.msg_part {
	margin-top: 35rpx;
	& > text {
		font-size: 30rpx;
		color: #ffffff;
	}
}

.part {
	margin-top: 21rpx;
	width: 100%;
	height: 90rpx;
	border: 1px solid #474d7e;
	padding-left: 25rpx;
	padding-right: 25rpx;
	padding-top: 25rpx;
	margin-bottom: 31rpx;
	
	text {
		@include ellipsis();
		color: #ffffff;
	}
}

.sure_btn {
	margin-bottom: 30rpx;
	margin-top: 50rpx;
	& > button {
		color: #ffffff;
		font-size: 30rpx;
		line-height: 90rpx;
		width: 690rpx;
		height: 90rpx;
		background: linear-gradient(270deg, #bb0cf9, #f92faf);
		border-radius: 49rpx;
	}
}
</style>
