<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="我的余额" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
		 :border-bottom="false">
		</u-navbar>
		<view class="display—box">
			<image src="/static/imgs/mine/money_icon.png" mode=""></image>
			<view class="money-text">
				<text>余额</text>
			</view>
			<view class="money-amount">
				<text>{{balance}}</text>
			</view>
			<button class="recharge-btn" type="default" @tap="$u.route('pages/mine/balance/withdraw')"><text>我要提现</text></button>
		</view>
		<u-gap height="20" bg-color="#20234B"></u-gap>
		<view class="bottom-box">
			<view class="income-record" @tap="$u.throttle($u.route('pages/mine/balance/incomeRecord'))">
				<view class="income-left">
					<image src="/static/imgs/mine/lock_icon.png" mode=""></image>
					<text>收支记录</text>
				</view>
				<view class="income-right">
					<image src="/static/imgs/common/right.png" mode=""></image>
				</view>
			</view>
			<view class="income-record" @tap="$u.throttle($u.route('pages/mine/balance/withdrawRecord'))">
				<view class="income-left">
					<image src="/static/imgs/mine/lock_icon.png" mode=""></image>
					<text>提现记录</text>
				</view>
				<view class="income-right">
					<image src="/static/imgs/common/right.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				balance: 0,
			}
		},
		onLoad() {
			this.getBalance()
			uni.$on('update-balance',this.getBalance)
		},
		onUnload() {
			uni.$off('update-balance');
		},
		methods: {
			//我的钱包余额
			getBalance: function() {
				let params = {}
				this.$u.api.myBalanceApi(params).then(res => {
					var code = res.code;
					if (parseInt(code) == 0) {
						this.balance=res.data.balance
					}
				}).catch(e => {
					console.log(e)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.header-box-right {
			color: #FFFFFF;
			font-size: 30rpx;
			padding-right: 30rpx;
		}
		.display—box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			padding: 80rpx 0;

			&>image {
				width: 120rpx;
				height: 120rpx;
			}

			.money-text {
				font-size: 36rpx;
				padding-top: 40rpx;
			}

			.money-amount {
				font-size: 38rpx;
				padding-top: 20rpx;

				&>text {
					font-size: 60rpx;
				}
			}

			.recharge-btn {
				width: 410rpx;
				height: 90rpx;
				background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
				border-radius: 45rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				line-height: 90rpx;
				margin-top: 40rpx;
			}
		}

		.bottom-box {
			width: 100%;
			margin-top: 35rpx;
			.income-record {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 30rpx;
				line-height: 100rpx;
				.income-left {
					display: flex;
					align-items: center;
					font-size: 30rpx;
					color: #FFFFFF;

					&>image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 15rpx;
					}
				}
				.income-right {
					&>image {
						width: 14rpx;
						height: 22rpx;
					}
				}
			}
		}
	}
</style>
