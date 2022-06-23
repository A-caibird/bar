<template>
	<view class="container">
		<u-navbar
			:border-bottom="false"
			:is-fixed="true"
			title-color="#FFFFFF"
			:background="{
				background: `rgba(25,28,63,1)`
			}"
			title="支付成功"
			:customBack="back"
			back-icon-color="#FFFFFF"
		></u-navbar>
		<view class="display—box">
			<image src="/static/imgs/mine/paySuccess.png" mode=""></image>
			<view class="money-text">
				<text>恭喜您支付成功</text>
			</view>
			<view class="money-amount">
				<text>{{allAmount}}</text>元
			</view>
			<view class="look-wallet">
				<text v-for="(item,index) in tipList" :key="index">{{item}}</text>
			</view>

			<block v-if="type=='ping-order'">
				<view class="recharge-btn color" type="default" @tap="tapGoFind"><text>邀请附近的人拼享</text></view>
				<view class="recharge-btn" type="default" @tap="$u.throttle(tapGoPingOrderList)"><text>查看我的拼享订单</text>
				</view>
			</block>

			<block v-if="type=='yao-order'">
				<view class="recharge-btn color" type="default" @tap="tapGoFind"><text>邀请附近的人尬酒</text></view>
				<view class="recharge-btn" type="default" @tap="$u.throttle(tapGoYaoOrderList)"><text>查看订单</text></view>
			</block>
			<block v-if="type=='add-wine'">
				<view class="recharge-btn color" type="default" @tap="$u.route({type:'back'})"><text>返回</text></view>
			</block>
			<block v-if="type=='ping-join-order'">
				<view class="recharge-btn color" type="default" @tap="$u.route({type:'back'})"><text>返回</text></view>
			</block>
		</view>


	</view>
</template>

<script>
	// @tap="$u.route('pages/mine/wineCellar/wineRecord')"
	export default {
		data() {
			return {
				allAmount: 0,
				type: '',
				distance: 1,
			}
		},
		computed: {
			tipList() {
				switch (this.type) {
					case 'ping-order':
						return ['您当前下了拼享订单', '可以点击以下邀请附近人拼享按钮']
						break;
					case 'yao-order':
						return ['您已成功创建订单', '可以点击以下邀请附近人尬酒按钮']
						break;
					default:
						return []
				}
			},
		},
		onLoad(opt) {
			this.allAmount = opt.allAmount
			this.type = opt.type
			if (opt.distance) {
				this.distance = opt.distance
			}
		},
		methods: {
			tapGoYaoOrderList() {
				this.$u.route({
					type: 'redirectTo',
					url: '/pages/order/index',
					params: {
						goYaoOrderList: true,
						distance: this.distance,
					}
				})
			},
			tapGoPingOrderList() {
				this.$u.route({
					type: 'redirectTo',
					url: '/pages/order/index?type=share&distance=' + this.distance
				})
			},
			back() {
				this.$u.route({
					type: 'back',
					delta: this.distance
				})
				// this.$u.route({
				// 	type: 'reLaunch',
				// 	url: '/pages/index/index',
				// 	params: {
				// 		index: true
				// 	}
				// })
			},
			tapGoFind() {
				// this.$u.route({
				// 	type:'redirectTo',
				// 	url:'/pages/club/list?mode=list'
				// })
				this.$u.route({
					type: 'reLaunch',
					url: '/pages/index/index',
					params: {
						goFind: true
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.header-box {}

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
				margin-bottom: 30rpx;

				&>text {
					font-size: 60rpx;
				}
			}

			.look-wallet {
				font-size: 28rpx;
				color: #B4B2CF;
				display: flex;
				align-items: center;
				flex-direction: column;
				margin-bottom: 130rpx;
			}

			.recharge-btn {
				width: 420rpx;
				height: 90rpx;
				border-radius: 45rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				line-height: 90rpx;
				margin-top: 40rpx;
				border: 1px solid #FFFFFF;
				text-align: center;

				&.color {
					border: 0rpx;
					background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
				}
			}
		}

	}
</style>
