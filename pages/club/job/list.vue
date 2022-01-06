<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" :title="`招聘`"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<mescroll-uni :ref="'mescrollRef'+i" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption"
			 @up="upCallback">
			 <view style="padding: 30rpx 0rpx;">
				 <block v-for="(info, index) in pageList" :key="index">
					<view style="margin-bottom: 20rpx;">
						<recruitment :info="info"></recruitment>
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


	import recruitment from '@/components/recruitment-item/recruitment-item.vue'
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
			recruitment,
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

				url: '/api/recruitment/list',
				params: {
					clubId: this.clubId,
				}
			}
		},
		onLoad(opt) {
			this.clubId = opt.clubId;
			this.params.clubId = opt.clubId
			this.$nextTick(function() {
				this.downCallback()
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
	}
</style>
