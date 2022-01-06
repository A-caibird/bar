<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="我的钱包" title-size="36" title-color="#FFFFFF" :background="{'background': '#191C3F'}"
		 :border-bottom="false">
		
		</u-navbar>
		<view class="middle_box">
			<block v-for="(item, index) in walletList" :key="index">
				<view  @tap.stop="$u.throttle(goUrl(item.url))" class="wallet_box" :class="[item.type, (index < (walletList.length -1) ? 'marginBottom' : ''  )]">
					<view class="first_part">
						<view class="first_part_left">
							<view class="title">{{item.title}}</view>
							<view class="count">{{item.count}}</view>
						</view>
						<view class="first_part_right">
							<image class="wallet_icon" :src="item.icon"></image>
						</view>
					</view>
					<view class="second_part">
						<view class="second_part_left" @tap.stop="$u.throttle(goUrl(item.leftUrl))">
							<image class="label_icon" src="/static/imgs/wallet/label_icon.png"></image>
							<view class="text">{{item.labelText}}</view>
							<image class="nav_icon" src="/static/imgs/wallet/nav_icon.png"></image>
						</view>
						<view class="second_part_right" @tap.stop="$u.throttle(goUrl(item.rightUrl))">
							<image class="label_icon" src="/static/imgs/wallet/record_icon.png"></image>
							<view class="text">{{item.recordText}}</view>
							<image class="nav_icon" src="/static/imgs/wallet/nav_icon.png"></image>
						</view>
					</view>
				</view>
			</block>
			
			
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				walletList:[
					{
						url: '/pages/mine/myWallet/myWallet',
						type:'jiubi',
						title: '酒币金额（币）',
						count: 0,
						icon: '/static/imgs/wallet/jiubi_icon.png',
						labelText: '充值',
						recordText: '收支记录',
						leftUrl: '/pages/mine/myWallet/recharge',
						rightUrl: '/pages/mine/myWallet/incomeRecord'
					},
					{
						url: '/pages/mine/mydiamond/mydiamond',
						type:'zuanshi',
						title: '钻石数量',
						count: 0,
						icon: '/static/imgs/wallet/zuanshi_icon.png',
						labelText: '提现',
						recordText: '提现记录',
						leftUrl: '/pages/mine/mydiamond/deposit',
						rightUrl: '/pages/mine/mydiamond/record'
					},
					{
						url: '/pages/mine/balance/balance',
						type:'yue',
						title: '余额（元）',
						count: 0,
						icon: '/static/imgs/wallet/yue_icon.png',
						labelText: '提现',
						recordText: '收支记录',
						leftUrl: '/pages/mine/balance/withdraw',
						rightUrl: '/pages/mine/balance/incomeRecord'
					}
				]
			}
		},
		onLoad() {
			this.load();
			uni.$on('update-walletIndex',this.load)
		},
		onUnload() {
			uni.$off('update-walletIndex')
		},
		methods:{
			goUrl(url){
				if(url){
					this.$nav.navigateTo({
						url,
					})
				}
			},
			load(){
				this.getWallet();
				this.getBalance();
			},
			//我的钱包余额
			getWallet: function() {
				let params = {}
				this.$u.api.myWalletApi(params).then(res => {
					var code = res.code;
					if (parseInt(code) == 0) {
						this.walletList[0].count=res.data.wineCoin
						this.walletList[1].count = res.data.diamond;
					}else{
						this.walletList[0].count = 0
						this.walletList[1].count = 0
					}
				}).catch(e => {
					console.log(e)
					this.walletList[0].count = 0
					this.walletList[1].count = 0
				})
			},
			//我的钱包余额
			getBalance: function() {
				let params = {}
				this.$u.api.myBalanceApi(params).then(res => {
					var code = res.code;
					if (parseInt(code) == 0) {
						this.walletList[2].count = res.data.balance
					}else{
						this.walletList[2].count = 0
					}
				}).catch(e => {
					console.log(e)
					this.walletList[2].count = 0
				})
			}
		}
	}
</script>

<style lang="scss">
	@mixin commonFlex() {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.middle_box{
		width: 100%;
		box-sizing: border-box;
		padding: 30rpx;
		padding-top: 60rpx;
		.wallet_box{
			height: 320rpx;
			width: 100%;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 34rpx 44rpx;
			&.marginBottom{
				margin-bottom: 30rpx;
			}
			&.jiubi{
				background: linear-gradient(137deg, #2633A0 0%, #90198D 100%);
			}
			&.zuanshi{
				background: linear-gradient(137deg, #444DBF 0%, #0034B2 100%);
			}
			&.yue{
				background: linear-gradient(137deg, #26A785 0%, #035A98 100%);
			}
			
			.first_part{
				@include commonFlex();
				.title{
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 40rpx;
				}
				.count{
					font-size: 60rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 84rpx;
					max-width: 400rpx;
					@include simpleOmit();
				}
				.wallet_icon{
					height: 90rpx;
					width: 90rpx;
				}
			}
			.second_part{
				margin-top: 90rpx;
				@include commonFlex();
				.second_part_left, .second_part_right{
					@include commonFlex();
				}
				.label_icon{
					height: 36rpx;
					width: 36rpx;
				}
				.text{
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 42rpx;
					margin: 0 14rpx;
				}
				.nav_icon{
					height: 20rpx;
					width: 20rpx;
				}
			}
		}
	}
</style>
