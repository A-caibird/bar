<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" :title="`全部评价（${total}）`"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption"
			 @up="upCallback">
				<view class="evaluate_list">
					<block v-for="(info, index) in pageList" :key="index">
						<evaluate :info="info" :isLast="index==pageList.length-1"></evaluate>
					</block>
				</view>
			</mescroll-uni>

		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import evaluate from '@/components/evaluate-item/evaluate-item.vue'
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		components: {
			evaluate,
		},
		data() {
			return {
				url: '/api/club/evaluationList',
				params: {
					clubId: -1,
				},
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
				total:0,
			}
		},
		onLoad(opt) {
			this.params.clubId = opt.clubId
			this.$nextTick(function() {
				this.downCallback()
			})
		},
		methods: {
			handleData(pageNumber,data) {
				console.log(data)
				let pageList = this.pageList
				if (pageNumber <= 1) {
					pageList = []
				}
				pageList = pageList.concat(data.list);
				this.total = data.total;
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

			.middle_box {
				flex: 1;
				min-width: 0;
				min-height: 0;
				padding-left: 30rpx;
				padding-right: 30rpx;

				.evaluate_list {
					width: 100%;
				}
			}
		}
	}
</style>
