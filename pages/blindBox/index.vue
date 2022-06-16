<template>
	<view class="container" :class="{'noScroll': lotteryShow}">
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
				<blindBox ref="blindBoxRef" :poolId="prizePoolId" :freetimes="freetimes" :unitPrice="unitPrice"  @refreshTime="refreshTime" @lotteryChange="lotteryChange"></blindBox>
			</view>
			<view class="blindBox_area_footer" :style="{'zIndex': lotteryShow ? 4 : 5}">
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
						<view class="count_text">{{freetimes}}</view>
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
						<block v-for="(item, index) in prizeCoinList" :key="index">
							<view class="coin_price">
								<image class="coin_icon" src="/static/imgs/common/price_icon.png"></image>
								<text>{{item.prize}}</text>
							</view>
						</block>
					</view>
				</scroll-view>
				<scroll-view class="price_pool_coupon" :scroll-x="true" v-if="prizeCouponList.length > 0">
					<view class="price_list">
						<view class="coupon_price" v-for="(item, index) in prizeCouponList" :key="index">
							<image class="coupon_icon" src="/static/imgs/blindBox/price_coupon.png"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="price_btn" @tap="randomTap">
				<text v-if="freetimes > 0">还剩{{freetimes}}次免费拆盲盒</text>
				<text v-else>花费{{unitPrice}}酒吧拆盲盒</text>
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
		data() {
			return {
				prizePoolId: '',
				prizeCoinList:[],
				prizeCouponList:[],
				freetimes: 0,
				unitPrice: 20,
				lotteryShow: false,
			}
		},
		onLoad() {
			this.getPrizeList();
		},
		methods:{
			// 抽奖弹窗的改变
			lotteryChange(e){
				this.lotteryShow = e;
			},
			// 随机抽取盲盒
			randomTap(){
				let index = Math.floor(Math.random()*10); // 随机获取0~9整数
				this.$refs.blindBoxRef.setSelectAnimation(index);
			},
			// 刷新免费次数
			refreshTime(){
				this.$u.api.getFreeCountApi({id: this.prizePoolId}).then(res => {
					this.freetimes = res.data.freetimes;
					this.unitPrice = res.data.unitPrice;
				}).catch(e => {
					console.log('getFreeCountApi Error', e);
				})
			},
			// 获取奖池列表
			getPrizeList(){
				this.$u.api.awardApi().then(res => {
					let list = res.data.lottery.lotteryItemList || [];
					let prizeCouponList = [];
					let prizeCoinList = [];
					let prizePoolId = res.data.lottery.id;
					list.forEach((item, index) => {
						if(item.typeEnum == 'wineCoin'){
							prizeCoinList.push(item)
						}else if(item.typeEnum == 'coupon'){
							prizeCouponList.push(item);
						}
					})
					this.prizeCouponList = prizeCouponList;
					this.prizeCoinList = prizeCoinList;
					this.prizePoolId = prizePoolId;
					this.getFreeCount(prizePoolId);
				}).catch(e => {
					console.log(e);
					this.$nextTick(function(){
						setTimeout(() => {
							this.$refs.blindBoxRef.showEvent();
						}, 1200)
					}.bind(this))
				})
			},
			getFreeCount(poolId){
				this.$u.api.getFreeCountApi({id: poolId}).then(res => {
					this.freetimes = parseInt(res.data.freetimes);
					this.unitPrice = parseInt(res.data.unitPrice);
					this.$nextTick(function(){
						setTimeout(() => {
							this.$refs.blindBoxRef.showEvent();
						}, 1200)
					}.bind(this))
				}).catch(e => {
					console.log('getFreeCountApi', e);
					this.$nextTick(function(){
						setTimeout(() => {
							this.$refs.blindBoxRef.showEvent();
						}, 1200)
					}.bind(this))
				})
			},
			// 跳转记录页面
			goRecord(){
				this.$u.route('/pages/blindBox/record', {id: this.prizePoolId})
			},
			// 跳转规则页面
			goRule(){
				this.$u.route('/pages/article/article', {type:'BlindBox'})
			}
		}
	}
</script>

<style lang="scss">
	page{
		min-height: 100%;
	}
	.container{
		width: 100%;
		min-height: 100%;
		box-sizing: border-box;
		padding-bottom: 120rpx;
		&.noScroll{
			height: 100%;
			overflow: hidden;
		}
	}
	.blindBox_area{
		height: 900rpx;
		width: 100%;
		position: relative;
		z-index: 1;
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
			z-index: 4;
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
		&_middle{
			position: relative;
			z-index: 5;
		}
		&_footer{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			z-index: 4;
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
					z-index: 10;
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
