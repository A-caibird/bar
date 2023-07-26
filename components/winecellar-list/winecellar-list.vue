<template>
	<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
		:up="upOption" @up="upCallback">
		<view class="list">
			<block v-for="(item,index) in pageList" :key="index">
				<view class="order-info-item" @tap="tapGetDetail(item)">
					<view class="item-box">
						<image class="item-img" :src="item.clubCover" mode="aspectFill"></image>
						<view class="item-bottom">
							<text class="order-title">{{item.clubName}}</text>
							<view class="box">
								<view class="order-endtime">
									存酒总数:<text> {{item.surplusNum}}</text>
								</view>
								<view class="order-wine-num">
									<text class="title">存酒到期：</text>
									<view class="text-content">
										<block v-for="wine,wineIndex in item.saveWineItemList">
											{{wine.surplusNum}}瓶<block v-if="wineIndex!=item.saveWineItemList.length-1">
												、
											</block>
										</block>
									</view>
								</view>
								<view class="order-endtime">
									最近到期:<text>{{item.endDate}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="divi"></view>
					<view class="button-group">
						<view class="btn">
							查看
						</view>
					</view>
				</view>
			</block>
		</view>

	</mescroll-uni>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	export default {
		mixins: [MescrollMixin],
		components: {
			MescrollUni
		},
		data() {
			return {
				downOption: {
					auto: true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5

				},
				url: '/api/saveWine/saveWineList',
			}
		},
		methods: {
			readWineCellPage(id) {
				this.pageList.forEach((item, index) => {
					if (item.id == id) {
						item.noticeUnRead = false;
					}
				})
				this.$forceUpdate();
			},
			tapGetDetail(params) {
				let {
					clubCover,
					clubName,
					surplusNum,
					saveWineItemList,
					expiringSoon,
					canTake
				} = params;
				console.log(params);
				this.$u.throttle(this.$u.route('/pages/mine/wineCellar/detail', {
					clubName: clubName,
					clubCover: clubCover,
					surplusNum: surplusNum,
					// saveWineItemList: saveWineItemList,
					expiringSoon:expiringSoon,
					canTake:canTake
				}),500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		padding: 0 30rpx;

		.order-info-item {
			width: 686rpx;
			height: 350rpx;
			background-color: rgba(255, 255, 255, 0.05);
			border-radius: 16rpx;
			margin-top: 20rpx;
			padding: 20rpx 30rpx;
			position: relative;

			.item-box {
				display: flex;
				flex-direction: row;
				place-items: center;

				.item-img {
					flex-shrink: 0;
					width: 200rpx;
					height: 200rpx;
					margin-bottom: 25rpx;
					margin-right: 50rpx;

					&>image {
						width: 100%;
						height: 100%;
					}
				}

				.item-bottom {
					position: relative;

					.order-title {
						font-size: 16px;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #FFFFFF;
						line-height: 22px;
						position: absolute;
						top: -50rpx;
					}

					.box {
						.order-wine-num {
							display: flex;
							font-size: 14px;
							font-size: 14px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(255, 255, 255, 0.5);

							&>.title {
								width: 130rpx;
							}

							&>.text-content {
								width: 360rpx;
							}
						}

						.order-endtime {
							font-size: 14px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(255, 255, 255, 0.5);
							line-height: 20px;
							margin-top: 10rpx;

							&>text {
								margin-left: 20rpx;
							}
						}

					}
				}
			}

			.divi {
				width: 638rpx;
				height: 2rpx;
				background: rgba(255, 255, 255, 0.05);
				border-radius: 1rpx;
			}

			.button-group {
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				margin: 20rpx 0;
				gap: 20rpx; //按钮的间隔

				.btn {
					width: 160rpx;
					height: 72rpx;
					// background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
					background: rgba(255, 255, 255, 0.05);
					border: 1rpx solid rgba(255, 255, 255, 0.5);
					border-radius: 36rpx;
					font-size: 30rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #FFFFFF;
					line-height: 72rpx;
					text-align: center;

				}
			}
		}
	}
</style>