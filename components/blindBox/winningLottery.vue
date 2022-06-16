<template>
	<view class="lottery" :class="{'show': lotteryShow}">
		<view class="mask" @tap="closeTap" v-if="lotteryShow"></view>
		<view class="lottery_content" v-if="lotteryShow">
			<view class="content_box">
				<image class="close_icon" @tap="closeTap" src="/static/imgs/blindBox/lottery/close.png"></image>
				<image class="box_img" :class="{'shake': shakeShow}" v-if="!hasLottery"
					src="/static/imgs/blindBox/lottery/boxImg.png"></image>
				<block v-if="hasLottery && prizeType == 'coupon'">
					<view class="lottery_title">恭喜获得</view>
					<view class="lottery_text">{{prizeInfo.lotteryPrize}}</view>
					<view class="coupon_info">
						<image class="coupon_img" src="/static/imgs/blindBox/lottery/couponImg.png"></image>
						<view class="coupon_date">有效期至2022–06-18</view>
						<view class="coupon_price">
							<text>￥</text>
							<text style="font-size: 60rpx;">{{prizeInfo.prize}}</text>
						</view>
						<view class="coupon_condition">
							<text>满{{prizeInfo.minimumPrice}} 可用</text>
						</view>
					</view>
				</block>
				<block v-if="hasLottery && prizeType == 'wineCoin'">
					<view class="lottery_title">恭喜获得</view>
					<view class="lottery_tips">
						<image src="/static/imgs/blindBox/price_coin.png"></image>
						<text>x{{prizeInfo.prize}}</text>
					</view>
					<image class="prize_img" src="/static/imgs/blindBox/lottery/coin.png"></image>
				</block>
				<view class="win_btn" @tap="$u.throttle(lotteryTap)">{{btnText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			poolId: String | Number, //奖池id
			freetimes: String | Number, //免费次数
			unitPrice: String | Number, //单次价格
		},
		data() {
			return {
				shakeShow: false, //抖动动画
				lotteryShow: false,
				hasLottery: false, //是否已经抽奖
				prizeInfo: {},
				prizeType: '',
			}
		},
		computed:{
			'btnText': function(){
				if(this.hasLottery){
					return '开心收下';
				}else{
					if(this.freetimes <= 0){
						return "需花费"+ this.unitPrice + '酒币拆开'
					}else{
						return "立即拆开"
					}
				}
			}
		},
		methods: {
			// 展示弹窗事件
			display() {
				this.lotteryShow = true;
				this.hasLottery = false;
			},
			// 关闭事件
			closeTap() {
				this.lotteryShow = false;
				this.hasLottery = false;
				this.$emit('close');
			},
			// 抽奖按钮点击事件
			lotteryTap() {
				if(this.hasLottery){
					this.closeTap();
				}else{
					this.shakeShow = !this.shakeShow
					setTimeout(function(){
						this.lotteryHandle();
					}.bind(this), 1000)
				}
			},
			// 抽奖
			lotteryHandle(){
				let params = {
				    id: this.poolId,
				    type: 'single'
				};
				this.$u.api.awarddrawApi(params).then(res => {
					let prize = res.data.prizeList[0];
					this.prizeType = prize.typeEnum;
					this.prizeInfo = prize;
					this.shakeShow = false;
					this.hasLottery = true;
				}).catch(e => {
					console.log('awarddrawApi Error', e);
					this.shakeShow = false;
					this.hasLottery = false;
				})
			}

		}
	}
</script>

<style lang="scss">
	@import "./animationSelect.scss";

	.lottery {
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		width: 100%;
		height: 0;
		z-index: -1;
		opacity: 0;
		&.show {
			opacity: 1;
			z-index: 100;
			height: 100%;
		}

		.mask {
			position: relative;
			width: 100%;
			height: 100%;
			background: #22122C;
			opacity: 0.9;
			z-index: 10;
		}

		.lottery_content {
			position: absolute;
			top: 300rpx;
			left: 0rpx;
			z-index: 100;
			width: 100%;

			.close_icon {
				position: absolute;
				top: 0rpx;
				right: 72rpx;
				height: 60rpx;
				width: 60rpx;
			}

			.content_box {
				position: relative;
				width: 100%;
				padding-top: 60rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;

				.box_img {
					width: 750rpx;
					height: 463rpx;
					margin-bottom: 70rpx;
					&.shake{
						animation: shake-slow 5s infinite ease-in-out;
					}
				}

				.lottery_title {
					font-size: 54rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					box-sizing: border-box;
					padding-top: 76rpx;
				}

				.lottery_text {
					font-size: 32rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
				}

				.lottery_tips {
					display: flex;
					align-items: center;

					&>image {
						height: 40rpx;
						width: 40rpx;
						margin-right: 6rpx;
					}

					&>text {
						line-height: 66rpx;
						font-size: 48rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
					}
				}

				.prize_img {
					height: 253rpx;
					width: 273rpx;
					margin-bottom: 74rpx;
					margin-top: 100rpx;
				}
			}

			.coupon_info {
				height: 320rpx;
				width: 320rpx;
				margin-top: 60rpx;
				margin-bottom: 80rpx;
				position: relative;

				.coupon_img {
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					z-index: 10;
					height: 100%;
					width: 100%;
				}

				.coupon_date {
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					z-index: 12;
					height: 60rpx;
					line-height: 60rpx;
					width: 100%;
					text-align: center;
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
				}

				.coupon_price {
					position: absolute;
					top: 150rpx;
					left: 36rpx;
					z-index: 12;
					height: 100rpx;
					line-height: 100rpx;
					width: 160rpx;
					text-align: center;
					font-size: 40rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #BC2C4C;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					&>text {
						line-height: 100rpx;
						vertical-align: top;
					}
				}

				.coupon_condition {
					position: absolute;
					top: 170rpx;
					left: 208rpx;
					z-index: 12;
					height: 70rpx;
					width: 68rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #BC2C4C;
				}

			}

			.win_btn {
				min-width: 360rpx;
				box-sizing: border-box;
				padding: 0rpx 30rpx;
				text-align: center;
				height: 90rpx;
				line-height: 90rpx;
				background: linear-gradient(311deg, #7A0CF9 0%, #BB0CF9 45%, #F92FAF 100%);
				box-shadow: inset 0px -6rpx 7rpx 0rpx #8619C8, inset 0rpx 6rpx 6rpx 0rpx #FF65E5;
				border-radius: 49rpx;
				color: #FFFFFF;
				font-size: 30rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				max-width: 750rpx;
				@include simpleOmit();
			}

		}
	}
</style>
