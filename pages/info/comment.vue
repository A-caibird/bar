<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="评论" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#191C3F'}"></u-navbar>
		<view class="comment-person">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="comment-item" :class="{active:mode=='jump'&&commentId==item.id}" v-for="item,index in pageList" :key="item.id">
					<view class="avatar">
						<image :src="item.userAvatar" @tap="$u.throttle(goPersonalHomepage(item.userId))"></image>
					</view>
					<view class="item-member" @tap="$u.throttle($u.route('/pages/discovery/dynamic_detail?id=' + item.dynamicId))">
						<view class="item-member-info">
							<text class="item-name">{{item.userNickName}}</text>
							<view class="item-time">{{item.time}}</view>
						</view>
						<view class="item-member-message">
							<text>{{item.comment}}</text>
						</view>
					</view>
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
				url:'/api/dynamic/myReceiveDynamicComment',
				mode:'nojump',
				commentId:'',
			}
		},
		onLoad(opt) {
			if(opt&&opt.mode) {
				this.mode = opt.mode
				if(this.mode=='jump') {
					this.commentId = opt.commentId
				}
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
			.comment-person {
				flex: 1;
				min-width: 0;
				min-height: 0;
				padding: 0 30rpx;
		
				.comment-item {
					display: flex;
					align-items: center;
					width: 100%;
					height: 150rpx;
					// &.active {
					// 	background-color: orange;
					// 	color: #FFFFFF;
					// }
					.avatar {
						padding-right: 30rpx;
						image {
							width: 90rpx;
							height: 90rpx;
							border-radius: 50%;
						}
						
					}
					.item-member {
						display: flex;
						flex-direction: column;
						flex: 1;
						min-width: 0;
		
						.item-member-info {
							display: flex;
							align-items: center;
							justify-content: space-between;
		
							.item-name {
								font-size: 32rpx;
								color: #FFFFFF;
		
							}
		
							.item-time {
								font-size: 24rpx;
								color: #B3B3DD;
							}
						}
		
						.item-member-message {
							font-size: 26rpx;
							color: #FFFFFF;
							@include ellipsis(2);
		
						}
					}
		
		
				}
			}
		}
		
	}

</style>
