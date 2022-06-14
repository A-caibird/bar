<template>
	<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="list">
			<block v-for="(item,index) in pageList" :key="index">
				<view class="order-info-item" @tap="$u.throttle($u.route('/pages/mine/wineCellar/detail',{clubId:item.clubId,id:item.id}))">
					<view class="item-top">
						<view class="order-num" >
							<text class="red_point" v-if="item.noticeUnRead"></text> 订单号:<text style="font-size: 26rpx; color: #FFFFFF; padding-left: 4rpx;">{{item.sn}}</text>
						</view>
						<view class="remain-num">剩余:<text style="font-size: 26rpx; color: #FFFFFF;padding-left: 4rpx;">{{item.surplusNum}}瓶</text>
						</view>
					</view>
					<image class="item-img" :src="item.clubCover" mode="aspectFill"></image>
					<view class="item-bottom">
						<text class="order-title">{{item.clubName}}</text>
						<view class="order-endtime">
							到期时间：<text style="font-size: 26rpx; color: #FFFFFF; ">{{item.endDate}}</text>
						</view>
						<view class="order-wine-num">
							<text class="title">剩余酒量：</text>
							<view class="text-content">
								<block v-for="wine,wineIndex in item.saveWineItemList">{{wine.commodity.name}}: {{wine.surplusNum}}瓶<block v-if="wineIndex!=item.saveWineItemList.length-1">、</block></block>
							</view>
						</view>
					</view>
					<template v-if="!item.canTake">
						<view class="expired-label">
							<text>已过期</text>
						</view>
					</template>
					<template v-if="item.expiringSoon">
						<view class="expired-label expiring">
							<text>即将过期</text>
						</view>
					</template>
					
				</view>
			</block>
		</view>
		
	</mescroll-uni>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	export default {
		mixins:[MescrollMixin],
		components: {
			MescrollUni
		},
		data() {
			return {
				downOption:{
					auto:true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					
				},
				url : '/api/saveWine/saveWineList',
			}
		},
		methods: {
			readWineCellPage(id){
				this.pageList.forEach((item, index) => {
					if(item.id == id){
						item.noticeUnRead = false;
					}
				})
				this.$forceUpdate();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		padding: 0 30rpx;
		.order-info-item {
			background-color: #2C3158;
			border-radius: 10px;
			margin-top: 20rpx;
			padding: 0 30rpx;
			position: relative;
			.item-top {
				display: flex;
				justify-content: space-between;
				padding: 30rpx 0;
		
				.order-num {
					font-size: 26rpx;
					color: #B4B2CF;
					display: flex;
					align-items: center;
					.red_point{
						display: inline-block;
						height: 10rpx;
						width: 10rpx;
						background: red;
						border-radius: 50%;
						margin-right: 4rpx;
					}
				}
		
				.remain-num {
					font-size: 26rpx;
					color: #B4B2CF;
				}
			}
		
			.item-img {
				width: 100%;
				height: 327rpx;
				margin-bottom: 25rpx;
		
				&>image {
					width: 100%;
					height: 100%;
				}
			}
		
			.item-bottom {
				padding-bottom: 25rpx;
		
				.order-title {
					font-size: 34rpx;
					color: #FFFFFF;
					margin-bottom: 10rpx;
				}
		
				.order-endtime {
					font-size: 26rpx;
					color: #B3B3DD;
					margin-top: 10rpx;
				}
		
				.order-wine-num {
					display: flex;
					.title {
						font-size: 26rpx; 
						color: #B3B3DD;
					}
					.text-content {
						@include ellipsis();
						width: 360rpx;
						font-size: 26rpx; 
						color: #FFFFFF;
						// flex: 1;
						// min-width: 0;
					}
				}
			}
		
			.expired-label {
				position: absolute;
				right: 30rpx;
				bottom: 25rpx;
				width: 100rpx;
				height: 40rpx;
				@include flex-center();
				border: 1px solid #565B86;
				border-radius: 2rpx;
				text {
					font-size: 20rpx;
					color: #B3BAEF;
				}
				&.expiring{
					border-color: red;
					text {
						color: red;
					}
				}
			}
		}
		
	}
			
</style>
