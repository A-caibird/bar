<template>
	<view class="page-wrap">
		<u-navbar back-icon-color="#FFFFFF" title="提现记录" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false"></u-navbar>
		
		<view class="list-wrap">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="record-item" v-for="(item, index) in pageList" :key="index" >
					<view class="record-detail">
						<text>提现钻石{{item.diamond}}个</text>
						<text>{{item.amount}}元</text>
					</view>
					<view class="record-time">
						<text class="date">{{item.date}}</text>
						<text class="status">{{item.status}}</text>
					</view>
					<u-gap height="1" bg-color="#31345B"></u-gap>
				</view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default {
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
				url:'/api/user/withdrawalList',
				params: {
					type: 'diamond'
				}
			}
		},
		methods:{
			
		},
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
		flex-direction: column;
		.list-wrap {
			flex: 1;
			min-width: 0;
			min-height: 0;
			display: flex;
			flex-direction: column;
			padding: 0 30rpx;
			.record-item {
				margin-top: 40rpx;
				.record-detail {
					display: flex;
					justify-content: space-between;
					font-size: 30rpx;
					color: #ffffff;
				}
				.record-time {
					
					padding: 10rpx 0;
					margin-bottom: 40rpx;
					@include height-center();
					justify-content: space-between;
					.date {
						font-size: 24rpx;
						color: #9292ba;
					}
					.status {
						font-size: 30rpx;
						color: #ffffff;
					}
				}
			}
		}
	}

</style>
