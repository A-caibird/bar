<template>
	<view>
		<u-navbar
			:border-bottom="false"
			:is-fixed="true"
			:background="{
				background: '#191C3F'
			}"
			title="拆盲盒赢酒币"
			title-color="#FFFFFF"
			back-icon-color="#FFFFFF"
		></u-navbar>
		<view class="blindBox_area">
			<image class="area_img" src="/static/imgs/blindBox/header_img.png"></image>
			<view class="blindBox_area_header">
				<image class="rule_icon" src="/static/imgs/blindBox/rule_icon.png" @tap="$u.throttle(goRule)"></image>
				<image class="title_img" src="/static/imgs/blindBox/title_img.png"></image>
			</view>
			<view class="blindBox_area_middle">
				<blindBox ref="blindBoxRef"></blindBox>
			</view>
			<view class="blindBox_area_footer">
				<view class="price_record" @tap="$u.throttle(goRecord)">
					<image class="record_img" src="/static/imgs/blindBox/record_icon.png"></image>
					<text class="record_label">中奖记录</text>
					<view class="bg_circle_view"></view>
				</view>
				<view class="price_count">
					<view class="count_tips">
						<countTips text="每天0点来送3次"></countTips>
					</view>
					<view class="count_box">
						<view class="count_text">3</view>
						<view class="count_bg_view">
							<image src="/static/imgs/blindBox/bottom_icon.png"></image>
						</view>
					</view>
					<view class="count_label">免费拆盒次数</view>
				</view>
			</view>
		</view>
		<view class="prize_box">
			<view class="price_pool">
				<view class="price_pool_title">目标奖池</view>
				<scroll-view class="price_pool_coin" :scroll-x="true">
					<view class="price_list">
						<block v-for="(item, index) in 10" :key="index">
							<view class="coin_price">
								<image class="coin_icon" src="/static/imgs/common/price_icon.png"></image>
								<text>{{index}}</text>
							</view>
						</block>
					</view>
				</scroll-view>
				<scroll-view class="price_pool_coupon">
					<view class="price_list">
						<view class="coupon_price">
							<image class="coupon_icon" src="/static/imgs/blindBox/price_coupon.png"></image>
							<text>50元优惠券</text>
						</view>
						<view class="coupon_price">
							<image class="coupon_icon" src="/static/imgs/blindBox/price_coupon.png"></image>
							<text>20元优惠券</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="price_btn">
				<text>还剩3次免费拆盲盒</text>
			</view>
		</view>
	</view>
</template>

<script>
	import countTips from '@/components/blindBox/countTips.vue'
	import blindBox from '@/components/blindBox/index.vue'
	export default {
		components:{
			countTips,
			blindBox
		},
		onLoad() {
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.blindBoxRef.showEvent();
				}, 1200)
			})
		},
		methods:{
			goRecord(){
				this.$u.route('/pages/blindBox/record')
			},
			goRule(){
				this.$u.route('/pages/article/article', {type:'BlindBox'})
			}
		}
	}
</script>

<style lang="scss">
	.blindBox_area{
		height: 900rpx;
		width: 100%;
		position: relative;
		.area_img{
			position: absolute;
			top: 0rpx;
			left: 0prx;
			height: 900rpx;
			width: 100%;
			z-index: 1;
		}
		&_header{
			width: 100%;
			box-sizing: border-box;
			padding-top: 55rpx;
			position: relative;
			z-index: 5;
			.rule_icon{
				position: absolute;
				right: 30rpx;
				top: 26rpx;
				height: 48rpx;
				width: 48rpx;
				border-radius: 50%;
			}
			.title_img{
				width: calc(100% - 155rpx);
				margin-left: 103rpx;
				height: 146rpx;
			}
		}
		&_footer{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			z-index: 5;
			.price_record{
				position: relative;
				width: 120rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				.bg_circle_view{
					position: absolute;
					left: 50%;
					bottom: 0rpx;
					transform: translateX(-50%);
					height: 120rpx;
					width: 120rpx;
					border-radius: 50%;
					background: #7A67C4;
					z-index: 1;
				}
				.record_img{
					height: 112rpx;
					width: 102rpx;
					position: relative;
					z-index: 5;
				}
				.record_label{
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 33rpx;
					letter-spacing: 1rpx;
					position: relative;
					z-index: 5;
				}
			}
			.price_count{
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				position: relative;
				.count_tips{
					position: absolute;
					top: -80rpx;
					right: 0rpx;
					z-index: 5;
				}
				.count_box{
					width: 150rpx;
					position: relative;
					text-align: center;
					align-self: flex-end;
					.count_text{
						font-size: 90rpx;
						font-family: DINAlternate-Bold, DINAlternate;
						font-weight: bold;
						color: #FFFFFF;
						line-height: 104rpx;
						position: relative;
						z-index: 5;
					}
					.count_bg_view{
						height: 14rpx;
						width: 82rpx;
						position: absolute;
						left: 50%;
						z-index: 1;
						transform: translateX(-50%);
						bottom: 16rpx;
						&>image{
							height: 100%;
							width: 100%;
							vertical-align: top;
						}
					}
				}
				.count_label{
					align-self: flex-end;
					width: 150rpx;
					text-align: center;
					font-size: 24rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 33rpx;
				}
			}
		}
	}
	.prize_box{
		width: 100%;
		.price_pool{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			background: #2C3158;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 20rpx;
			&_title{
				width: 100%;
				font-size: 30rpx;
				color: #FFFFFF;
				font-weight: bold;
				letter-spacing: 2rpx;
			}
			.price_list{
				display: flex;
				align-items: center;
			}
			&_coin{
				width: 100%;
				height: 100rpx;
				margin-top: 40rpx;
				overflow: hidden;
				white-space: nowrap;
				.coin_price{
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
					margin-right: 40rpx;
					&>image{
						height: 40rpx;
						width: 40rpx;
					}
					&>text{
						font-size: 32rpx;
						color: #FFFFFF;
						margin-top: 10rpx;
					}
				}
			}
			&_coupon{
				width: 100%;
				height: 120rpx;
				margin-top: 40rpx;
				overflow: hidden;
				white-space: nowrap;
				.coupon_price{
					height: 100rpx;
					box-sizing: border-box;
					padding: 0 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 20rpx;
					border: 1px solid #474E82;
					border-radius: 20rpx;
					&>image{
						height: 50rpx;
						width: 48rpx;
						margin-right: 20rpx;
					}
					&>text{
						font-size: 32rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 45rpx;
						letter-spacing: 2rpx;
					}
				}
			}	
		}
		.price_btn{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			margin-top: 40rpx;
			text-align: center;
			height: 90rpx;
			line-height: 90rpx;
			color: #FFFFFF;
			font-size: 30rpx;
			background: linear-gradient(270deg, #BB0CF9 0%, #F92FAF 100%);
			border-radius: 50rpx;
		}
	}
</style>
