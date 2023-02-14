<template>
	<mescroll-uni :ref="'mescrollRef'+i" :fixed="true" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" :height="height" :upperThreshold="upperThreshold"  @scrolltoupper="$emit('scrolltoupper',$event)"
	 @up="upCallback" :canScroll="canScroll">
	 <view style="padding: 30rpx;">
		 <block v-for="(info, index) in pageList" :key="index">
		 	<dynamic :info="info"></dynamic>
		 </block>
	 </view>

	</mescroll-uni>

</template>

<script>
	var app = getApp();
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";

	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import dynamic from '@/components/dynamic-item/dynamic-item.vue'
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
			dynamic,
		},
		props: {
			clubId: Number | String,
			upperThreshold: {
				type:Number | String,
				default:50
			},
			height: {
				type:Number | String,
				default: 0
			},
			canScroll:{
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {

				downOption: {
					use:false,
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

				url: '/api/club/dynamicList',
				params: {
					clubId: this.clubId,
				}
			}
		},
		methods: {
			refreshPage(callback = null){
				this.getList(callback)
			},
			getList(callback){
				let params = {
					  "clubId": this.clubId,
					  "pageNumber": 1,
					  "pageSize": 10,
				}
				this.$u.api.commonRequest(this.url, params).then(res => {
					if(parseInt(res.code) == 0){
						this.pageList = res.data.list
						if(callback){
							callback();
						}
					}else {
						this.pageList = [];
					}
				})
			}
		}

	}
</script>



<style lang="scss">
	.item {
		margin-bottom: 20rpx;
	}
</style>
