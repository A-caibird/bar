<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" title="我的中奖"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<mescroll-uni :ref="'mescrollRef'+i" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption"
			 @up="upCallback">
			 <view style="padding: 30rpx 0rpx;">
				 <block v-for="(info, index) in pageList" :key="index">
					<view style="margin-bottom: 20rpx;">
						<view class="price_info">
							<view class="price_info_left">
								<image class="price_icon" src="/static/imgs/common/price_icon.png"></image>
							</view>
							<view class="price_info_middle">
								<view class="price_name">酒币*50</view>
								<view class="price_date">2022-03-03 12:00:00</view>
							</view>
							<view class="price_info_right">
								<view class="price_btn">去查看</view>
							</view>
						</view>
					</view>
				 </block>
			 </view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";

	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5

				},

				url: '/api/recruitment/list',
				params: {
					clubId: this.clubId,
				}
			}
		},
		onLoad(opt) {
			this.$nextTick(function() {
				// this.downCallback()
			})
		},
		methods: {

		}

	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;

		.container {
			height: 100%;
			display: flex;
			flex-direction: column;

			.middle_box {
				flex: 1;
				min-width: 0;
				min-height: 0;
				padding-left: 30rpx;
				padding-right: 30rpx;
			}
		}
		.price_info{
			width: 100%;
			background: #2C3158;
			border-radius: 20rpx;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			padding: 24rpx 30rpx;
			&_left{
				height: 60rpx;
				width: 60rpx;
				.price_icon{
					height: 60rpx;
					width: 60rpx;
				}
			}
			&_middle{
				width: calc(100% - 160rpx);
				margin-left: 20rpx;
				margin-right: 20rpx;
				.price_name{
					font-size: 28rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 40rpx;
					letter-spacing: 2rpx;
				}
				.price_date{
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #BBBBBD;
					line-height: 28rpx;
					margin-top: 6rpx;
				}
			}
			&_right{
				.price_btn{
					width: 120rpx;
					height: 50rpx;
					line-height: 50rpx;
					text-align: center;
					background: linear-gradient(270deg, #BB0CF9 0%, #F92FAF 100%);
					border-radius: 24rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					letter-spacing: 1rpx
				}
			}
		}
	}
</style>
