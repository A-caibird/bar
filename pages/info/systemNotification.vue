<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="系统通知" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#191C3F'
				}"
		 :border-bottom="false"></u-navbar>
		<view class="follow-person">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<block v-for="item in pageList" :key="item.id">
					<view class="message-item" >
						<view class="message-title">
							<text>{{item.title}} </text>
							<!-- <view class="point"></view> -->
						</view>
						<text class="message-content">
							{{item.content}}
						</text>
						<text class="message-time">
							{{item.modifyDate}}
						</text>
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
				url:'/api/user/systemNotificationList',
			}
		},
		onLoad() {
			this.readSysNotice();
		},
		methods:{
			readSysNotice(){
				this.$u.api.readSysNoticeAPI().then(res => {
					uni.$emit('refreshInfo');
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
			.follow-person {
				flex: 1;
				min-height: 0;
				.message-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					width: 690rpx;
					min-height: 212rpx;
					background: #2c3158;
					border-radius: 6rpx;
					margin: 0 30rpx;
					margin-top: 30rpx;
					box-sizing: border-box;
					padding: 20rpx 0rpx;
					.message-title {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 32rpx;
						color: #FFFFFF;
						padding: 0 30rpx;
				
						.point {
							width: 14rpx;
							height: 14rpx;
							background: #7d3fff;
							border-radius: 45rpx;
						}
					}
				
					.message-content {
						font-size: 27rpx;
						color: #A8A8CE;
						padding: 0 30rpx;
						margin: 15rpx 0;
					}
				
					.message-time {
						font-size: 22rpx;
						color: #A8A8CE;
						padding: 0 30rpx;
					}
				}
						
			}
		}
	}
	
</style>
