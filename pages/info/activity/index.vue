<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#16192B'
			}" :title="`活动`"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<mescroll-uni :ref="'mescrollRef'+i" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption"
			 @up="upCallback">
			 <view style="padding: 30rpx 0rpx;">
				 <block v-for="(info, index) in pageList" :key="index">
					 <view style="margin-bottom: 20rpx;">
						 <view class="activity_item_box" @tap="$u.throttle(tapGoDetail(info.id))">
							<view class="activity_img">
						 		<image :src="info.cover"></image>
						 	</view>
						 	<view class="activity_footer">
								<view class="redPoint" v-if="!info.hasRead"></view>
						 		<view class="activity_intro">
						 			<text>{{info.title}}</text>
						 		</view>
						 		<view class="activity_intro2">
						 			<text>{{info.subTitle}}</text>
						 		</view>
						 		<view class="activity_date"> <text>{{info.publishTime}}</text> </view>
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

	import activity from '@/components/activity-item/activity-item.vue'
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
			activity,
		},
		data() {
			return {
				clubId: '',
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

				url: '/api/platformActivity/list',
				params: {}
			}
		},
		onLoad(opt) {
			this.$nextTick(function() {
				this.downCallback()
			})
		},
		methods: {
			tapGoDetail(id){
				this.pageList.forEach((item, index) => {
					if(item.id == id){
						item.hasRead = true;
						return false
					}
				})
				this.$forceUpdate();
				this.$u.route('/pages/info/activity/detail', {id})
			}
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
		.activity_item_box{
			width: 100%;
			border-radius: 10rpx;
			overflow: hidden;
			position: relative;
			.redPoint{
				position: absolute;
				height: 20rpx;
				width: 20rpx;
				z-index: 10;
				border-radius: 50%;
				left: 4rpx;
				top: 40rpx;
				background: red;
			}
			.activity_img{
				width: 100%;
				height: 360rpx;
				&>image{
					height: 100%;
					width: 100%;
					// background: #007AFF;
				}
			}
			.activity_footer{
				width: 100%;
				padding: 30rpx;
				box-sizing: border-box;
				background: #2C3158;
				position: relative;
				.activity_intro{
					width: 100%;
					max-height: 40rpx;
					font-size: 30rpx;
					color: #FFFFFF;
					@include ellipsis();
				}
				.activity_intro2{
					width: 100%;
					max-height: 40rpx;
					font-size: 28rpx;
					color: #A8A8CE;
					margin-top: 10rpx;
					@include ellipsis();
				}
				.activity_date{
					color: #A8A8CE;
					font-size: 22rpx;
					margin-top: 14rpx;
				}
			}
		}
	}
</style>
