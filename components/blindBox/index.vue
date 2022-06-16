<template>
	<view class="blind_box">
		<image class="bg_img" :class="{'show': show}" src="/static/imgs/blindBox/liwu_bg.png"></image>
		<view class="liwu_item_one" @tap="$u.throttle(setSelectAnimation(0), 1000)" :class="{'show': show, 'selected': selectPrize == 0}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_two" @tap="$u.throttle(setSelectAnimation(1), 1000)" :class="{'show': show, 'selected': selectPrize == 1}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_third" @tap="$u.throttle(setSelectAnimation(2), 1000)" :class="{'show': show, 'selected': selectPrize == 2}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_four" @tap="$u.throttle(setSelectAnimation(3), 1000)" :class="{'show': show, 'selected': selectPrize == 3}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_five" @tap="$u.throttle(setSelectAnimation(4), 1000)" :class="{'show': show, 'selected': selectPrize == 4}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_six" @tap="$u.throttle(setSelectAnimation(5), 1000)" :class="{'show': show, 'selected': selectPrize == 5}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_seven" @tap="$u.throttle(setSelectAnimation(6), 1000)" :class="{'show': show, 'selected': selectPrize == 6}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_eight" @tap="$u.throttle(setSelectAnimation(7), 1000)" :class="{'show': show, 'selected': selectPrize == 7}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<view class="liwu_item_nine" @tap="$u.throttle(setSelectAnimation(8), 1000)" :class="{'show': show, 'selected': selectPrize == 8}">
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image>
		</view>
		<winLottery ref="winLottery" :freetimes="freetimes" :unitPrice="unitPrice" :poolId="poolId" @close="closeLottery"></winLottery>
	</view>
</template>

<script>
	const proportion = uni.getSystemInfoSync().windowWidth / 750;
	import winLottery from './winningLottery.vue'
	export default {
		data() {
			return {
				show: false,
				selected: false,
				selectPrize: -1,
			}
		},
		props:{
			freetimes: String | Number, //免费次数
			unitPrice: String | Number, //单次价格
			poolId: String | Number, //奖池id
		},
		components:{
			winLottery
		},
		mounted() {
			this.selectAnimation = {};
		},
		methods: {
			showEvent() {
				this.show = true;
			},
			setSelectAnimation(index) {
				this.selectPrize = index;
				setTimeout(() => {
					this.$refs.winLottery.display();
					this.$emit('lotteryChange', true);
				}, 1300)
			},
			closeLottery(){
				this.selectPrize = -1;
				this.$emit('lotteryChange', false);
				this.$emit('refreshTime');
			}

		}
	}
</script>

<style lang="scss">
	@import "./animationSelect.scss";
	.blind_box {
		width: 100%;
		height: 395rpx;
		position: relative;
		z-index: 10;
		margin-top: 60rpx;
		margin-bottom: 50rpx;

		.bg_img {
			width: 594rpx;
			height: 395rpx;
			position: absolute;
			left: 103rpx;
			top: 0rpx;
			z-index: 10;
			opacity: 0;
			transition: all 1s ease-in-out;

			&.show {
				opacity: 1;
			}
		}

		.liwu_item_one {
			position: absolute;
			z-index: 11;
			left: 290rpx;
			// top: -41rpx;
			top: -196rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: -41rpx;
				opacity: 1;
			}
			&.selected {
				animation: selectAnimationOne 1.5s 1;
				opacity: 0;
			}
			&>image {
				width: 153rpx;
				height: 155rpx;
			}
		}

		.liwu_item_two {
			position: absolute;
			z-index: 12;
			left: 182rpx;
			// top: 37rpx;
			top: -153rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: 37rpx;
				opacity: 1;
			}
			&.selected {
				opacity: 0;
				animation: selectAnimationTwo 1.5s 1;
			}

			&>image {
				width: 157rpx;
				height: 160rpx;
			}
		}

		.liwu_item_third {
			position: absolute;
			z-index: 13;
			left: 410rpx;
			// top: -40rpx;
			top: -164rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: -4rpx;
				opacity: 1;
			}
			
			&.selected {
				opacity: 0;
				animation: selectAnimationThird 1.5s 1;
			}

			&>image {
				width: 157rpx;
				height: 160rpx;
			}
		}

		.liwu_item_four {
			position: absolute;
			z-index: 14;
			left: 82rpx;
			// top: 130rpx;
			top: -40rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: 130rpx;
				opacity: 1;
			}
			&.selected {
				opacity: 0;
				animation: selectAnimationFour 1.5s 1;
			}

			&>image {
				width: 167rpx;
				height: 170rpx;
			}
		}

		.liwu_item_five {
			position: absolute;
			z-index: 15;
			left: 303rpx;
			// top: 73rpx;
			top: -97rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: 73rpx;
				opacity: 1;
			}
			&.selected {
				opacity: 0;
				animation: selectAnimationFive 1.5s 1;
			}
			&>image {
				width: 167rpx;
				height: 170rpx;
			}
		}

		.liwu_item_six {
			position: absolute;
			z-index: 16;
			left: 542rpx;
			// top: 27rpx;
			top: -143rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: 27rpx;
				opacity: 1;
			}
			&.selected {
				opacity: 0;
				animation: selectAnimationSix 1.5s 1;
			}
			&>image {
				width: 167rpx;
				height: 170rpx;
			}
		}

		.liwu_item_seven {
			position: absolute;
			z-index: 17;
			left: 198rpx;
			// top: 165rpx;
			top: -14rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: 165rpx;
				opacity: 1;
			}
			&.selected {
				opacity: 0;
				animation: selectAnimationSeven 1.5s 1;
			}
			&>image {
				width: 177rpx;
				height: 179rpx;
			}
		}

		.liwu_item_eight {
			position: absolute;
			z-index: 18;
			left: 432rpx;
			top: -69rpx;
			// top: 110rpx;
			transition: all 1s ease-in-out;
			opacity: 0;

			&.show {
				top: 110rpx;
				opacity: 1;
			}
			&.selected {
				opacity: 0;
				animation: selectAnimationEight 1.5s 1;
			}
			&>image {
				width: 177rpx;
				height: 179rpx;
			}
		}

		.liwu_item_nine {
			position: absolute;
			z-index: 19;
			left: 313rpx;
			// top: 201rpx;
			top: 10rpx;
			transition: all 1s ease-in-out;
			transform: scale(1);
			opacity: 0;

			&.show {
				top: 201rpx;
				opacity: 1;
			}
			
			&.selected {
				opacity: 0;
				animation: selectAnimationNine 1.5s 1;
			}

			&>image {
				width: 188rpx;
				height: 191rpx;
			}
		}
	}
</style>
