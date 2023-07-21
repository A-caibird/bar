<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" title="信用积分" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#16192B'
				}" :border-bottom="false">
				<view class="header_box_right" @tap="$u.route('/pages/mine/credit/rule')" slot="right"
					style="color: #FFFFFF; font-size: 28rpx; padding-right: 30rpx;">
					规则说明
				</view>
			</u-navbar>
		</view>
		<mescroll-uni ref="mescrollRef" :canShowTop="false" :fixed="true" @init="mescrollInit" :down="downOption"
			@down="downCallback" :up="upOption" @up="upCallback">
			<view class="middle_box">
				<view class="middle_content">
					<image src="@/static/imgs/credit/credit.png" mode=""></image>
					<view class="score">{{sorce}}</view>
					<view class="score_text">我的信用分</view>
				</view>
			</view>
			<view class="bottom_box" :style="{height:divheight}">
				<view class="bottom_title">
					<view class="title_text">信用分记录</view>
				</view>
				<view class="bottom_content" >
					<view class="content_item" v-for="(item,index) in pageList" :key="index" :class="{bar:index!=pageList.length-1}">
						<view class="content_item_top">
							<view class="top_left">
								{{item.content}}
							</view>
							<view class="top_right">
								{{item.creditScore>0?'+':'-'}}{{item.creditScore}}
							</view>
						</view>
						<view class="content_item_time">
							{{item.createDate}}
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import $storage from '@/common/storage.js'
	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import loadding from '@/components/loading/loading.vue';

	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
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
						size: 20 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
				},
				url: '/api/user/creditScoreList',
				params: {
					token: getApp().globalData.token,
					pageNumber: 0,
					pageSize: 20
				},
				mode: 'credit',
				sorce: 1
			}
		},
		mounted() {
			uni.$on('credit-refresh', this.refresh)
			this.refresh({
				msg: 'refresh'
			});
		},
		beforeDestroy() {
			uni.$off('credit-refresh', this.refresh)
		},
		//注释为自定义 到达底部分页数据请求
		onLoad(props) {
			// this.getCredit();
			this.sorce = props.sorce;
		},
		computed:{
			divheight(){
				let total=this.pageList.length*190;
		        return total<1500?'1150rpx':'100%';
			}
		},
		methods: {
			// getCredit() {
			// 	let vm = this;
			// 	let params = {
			// 		token: this.token,
			// 		pageNumber: this.pageNumber,
			// 		pageSize: this.pageSize
			// 	};
			// 	vm.$u.api.getCreditRecord(vm.params).then(res => {
			// 		console.log("数据" + JSON.stringify(res));
			// 		// vm.totalPage = res.data.totalPage;  
			// 		// 获取总页数

			// 		// 测试
			// 		let testlist = [{
			// 			num: 100
			// 		}, {
			// 			num: 100
			// 		}, {
			// 			num: 100
			// 		}]
			// 		vm.list.push(...testlist)

			// 		// vm.list.push(...res.data.list)  // 后台返回的信用分记录数据

			// 	}).catch(err => {
			// 		console.log(err);
			// 	})
			// },

			refresh(e) {
				console.log(e);
				if (e.msg != this.mode) {
					console.log('刷新信用积分变化列表')
					this.mescroll.resetUpScroll()
				}
			},
		},
		onReachBottom() {
			// if (this.pageNumber == this.totalPage) {
			// 	this.status = "no-more"
			// 	return;
			// }
			// //如果到了底部，还执行到下面那肯定还有数据，那么就让状态处于加载中
			// this.pageNumber++;
			// this.status = 'loading';
			// this.getCredit();
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		height: 100%;
		width: 100%;
		background-color: $uni-title-color;

		.header_box {
			display: flex;
			width: 100%;
			height: 50rpx;
			padding: 0 30rpx;

		}

		.middle_box {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 450rpx;
			position: relative;
			top: 80rpx;

			.middle_content {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 168rpx;

				image {
					width: 108rpx;
					height: 116rpx;
				}

				.score {
					font-size: 60rpx;
					color: #FFFFFF
				}

				.score_text {
					font-size: 31rpx;
					color: #FFFFFF;
				}
			}
		}

		.bottom_box {
			width: 700rpx;
			padding: 30rpx 30rpx 10rpx 30rpx;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 16rpx 16rpx 0rpx 0rpx;
            margin:20rpx 30rpx 30rpx 30rpx;
			// height:100vh;
			.bottom_title {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				.title_text {
					font-size: 30rpx;
					color: #FFFFFF;
				}
			}

			.bottom_content {
				display: flex;
				flex-direction: column;
				height: 100%;

				.content_item {
					display: flex;
					flex-direction: column;
					width: 100%;
					height: 138rpx;
					padding-bottom: 30rpx;   
                   &.bar{
					   border-bottom: 1rpx solid  rgba(255, 255, 255, 0.05);
				   }
					.content_item_top {
						display: flex;
						justify-content: space-between;
						width: 100%;
						padding-top: 30rpx;

						.top_left {
							font-size: 30rpx;
							color: #FFFFFF
						}

						.top_right {
							font-size: 30rpx;
							color: #FFFFFF
						}
					}

					.content_item_time {
						font-size: 24rpx;
						color: rgba(255, 255, 255, 0.5);
						padding-top: 11rpx;
						margin-bottom: 40rpx;
					}
				}
			}
		}

	}
</style>