<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="支付成功" title-size="36" title-color="#FFFFFF" :background="{'background': '#191C3F'}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="display—box">
			<image src="/static/imgs/mine/paySuccess.png" mode=""></image>
			<view class="money-text">
				<text>恭喜你充值成功</text>
			</view>
			<view class="money-amount">
				<text>{{wineCoin}}</text>元
			</view>
			<view class="look-wallet" >
				<text>去查看我的钱包</text>
			</view>
			<button class="recharge-btn" type="default" @tap="$u.throttle($u.route({type:'back'}))"><text>我的钱包</text></button>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				wineCoin:'',
			}
		},
		onLoad(opt) {
			let {wineCoin} = opt
			this.wineCoin = wineCoin
		},
		methods:{
			tapGoWallet(){
				uni.reLaunch({
					url:'/pages/index/index' + '?goWallet=true'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.header-box {

		}

		.display—box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			padding-top: 120rpx;
			&>image {
				width: 100rpx;
				height: 100rpx;
			}

			.money-text {
				font-size: 36rpx;
				padding-top: 40rpx;
			}

			.money-amount {
				font-size: 38rpx;
				padding-top: 20rpx;
				margin-bottom: 130rpx;
				&>text {
					font-size: 60rpx;
				}
			}
			.look-wallet{
				font-size: 28rpx;
				color: #B4B2CF;
			}
			.recharge-btn {
				width: 300rpx;
				height: 80rpx;
				background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
				border-radius: 45rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				line-height: 80rpx;
				margin-top: 40rpx;
			}
		}

	}
</style>
