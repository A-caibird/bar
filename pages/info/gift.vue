<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="礼物" title-size="36" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#191C3F'}"></u-navbar>
		<view class="gift-label">
			<view class="label-left">
				<text class="label-left-text">总收礼物</text>
				<text class="label-left-num">{{receiveGiftNum}}</text>
			</view>
			<u-line  length="87" color="#5D628D" border-style="dashed" direction="col"/>
			<view class="label-right">
				<text class="label-right-text">今日收礼物</text>
				<text class="label-right-num">{{todayReceiveGiftNum}}</text>
			</view>
		</view>
		<view class="gift-grap">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="gift-box">
					<view class="gift-item" v-for="item,index in pageList" :key="index">
						<view class="gift-item-info" @tap="$u.throttle(goPersonPage(item.sendUserId))">
							<view class="gift-img">
								<image :src="item.giftImgUrl"></image>
							</view>
							<view class="record-detail">
								<text class="item-name">{{item.title}}</text>
								<text class="item-time">{{item.time}}</text>
							</view>
							<view class="record-count">
								<view class="item-money">+{{item.diamond}}钻石</view>
							</view>
							
						</view>
						<u-gap height="1" bg-color="#31345B"  margin-top="43"></u-gap>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<giftAnimation ref="giftAnimation"></giftAnimation>
	</view>
</template>

<script>
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
		components:{giftAnimation},
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
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
				
				
				url:'/api/user/myReceiveGift',
				receiveGiftNum:0,
				todayReceiveGiftNum:0,
			}
		},
		onLoad:function(opt){
			if(opt.url){
				this.$nextTick(() => {
					this.showGift(opt.url)
				})
			}
		},
		methods:{
			goPersonPage(id){
				uni.navigateTo({
					url: '/pages/mine/dynamic/myDynamic?id=' + id, 
				})
			},
			reLoad(){
				this.mescroll.resetUpScroll()
			},
			showGift(giftUrl){
				this.$refs.giftAnimation.show(giftUrl);
			},
			handleData(pageNumber,data){
				this.todayReceiveGiftNum = data.todayReceiveGiftNum
				this.receiveGiftNum = data.receiveGiftNum
				let pageList = this.pageList
				if (pageNumber <= 1) {
					pageList = []
				} 
				pageList = pageList.concat(data.list);
				this.pageList = pageList;
				this.totalPages = data.totalPage;
				uni.hideLoading();
				this.mescroll.endByPage(data.list.length, this.totalPages);
			},
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
			.gift-label {
				display: flex;
				align-items: center;
				width: 690rpx;
				height: 150rpx;
				background: #2c3158;
				border-radius: 6px;
				margin: 0 30rpx;
		
				.label-left {
					display: flex;
					flex: 1;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
		
					.label-left-text {
						font-size: 28rpx;
						color: #CECEE5;
					}
		
					.label-left-num {
						font-size: 34rpx;
						color: #FFFFFF;
					}
				}
		
		
				.label-right {
					display: flex;
					flex: 1;
					flex-direction: column;
					justify-content: center;
					align-items: center;
		
					.label-right-text {
						font-size: 28rpx;
						color: #CECEE5;
					}
		
					.label-right-num {
						font-size: 34rpx;
						color: #FFFFFF;
					}
				}
			}
		
			.gift-grap {
				flex: 1;
				min-width: 0;
				min-height: 0;
				.gift-box {
					display: flex;
					flex-direction: column;
					padding: 0rpx 30rpx;
					.gift-item {
						padding-top: 43rpx;
						.gift-item-info {
							display: flex;
							
							width: 100%;
							.gift-img {
								padding-right: 37rpx;
								image {
									width: 58rpx;
									height: 90rpx;
								}
							}
							
							.record-detail {
								flex: 1;
								min-width: 0;
								display: flex;
								flex-direction: column;
								.item-name {
									font-size: 30rpx;
									color: #FFFFFF;
									@include ellipsis(2);
								}
								.item-time {
									margin-top: 11rpx;
									font-size: 24rpx;
									color: #9292BA;
													
								}
							}
							.record-count {
								.item-money {
									font-size: 30rpx;
									color: #FFFFFF;
								}
							}
					
						}
					}
								
				
				}
			}
			
		}
		
	}
	
</style>
