<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="积分明细" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#16192B'
				}"
		 :border-bottom="false"></u-navbar>
		<view class="follow-person">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<block v-for="item,index in pageList" :key="item.id">
					<view class="record-item" >
						<view class="record-detail">
							<text>{{item.title}}</text>
							<text>+{{item.point}}分</text>
						</view>
						<view class="record-time">
							<text>{{item.createDate}}</text>
						</view>
						<u-gap height="1" bg-color="#31345B" margin-top="30" margin-bottom="30"></u-gap>
					</view>
				</block>
			
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
				url:'/api/user/pointsLogList',
			
			}
		},
		methods:{
			
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
			.follow-person {
				flex: 1;
				min-width: 0;
				min-height: 0;
				display: flex;
				flex-direction: column;
				.record-item{
					padding: 0 30rpx;
					.record-detail{
						display: flex;
						justify-content: space-between;
						font-size: 30rpx;
						color: #FFFFFF;
						
					}
					.record-time{
						font-size: 24rpx;
						color: #9292BA;
						padding: 10rpx 0;
					}
				}
			}
		}
		
		
	}
	
</style>
