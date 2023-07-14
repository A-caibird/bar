<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="取酒记录" title-size="36" title-color="#FFFFFF"
		:background="{'background': ' #16192B'}" :border-bottom="false">
		</u-navbar>
		<view class="record-box">
			<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="record-item" v-for="item,index in pageList" :key="index">
					<view class="record-info-item">
						酒吧名称：<text style="color: #FFFFFF;">{{item.clubName}}</text>
					</view>
					<view class="record-info-item">
						订单编号：<text style="color: #FFFFFF;">{{item.sn}}</text>
					</view>
					<view class="record-info-item">
						到期时间：<text style="color: #FFFFFF;">{{item.endDate}}</text>
					</view>
					<view class="record-info-item">
						取酒数量：<text style="color: #FFFFFF;"><block v-for="wine,wineIndex in item.fetchWineItemList">{{wine.commodity.name}}: {{wine.num}}瓶<block v-if="wineIndex!=item.fetchWineItemList.length-1">、</block></block></text>
					</view>
					<view class="record-info-item">
						取酒时间：<text style="color: #FFFFFF;">{{item.fetchWineDate}}</text>
					</view>
				</view>
			</mescroll-uni>
			
		</view>


	</view>

</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	
	export default{
		mixins:[MescrollMixin],
		components: {
			MescrollUni
		},
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
				url : '/api/fetchWine/fetchWineList',
			}
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.container{
			height: 100%;
			display: flex;
			flex-direction: column;
			background-color: #16192B; // Acaibird 颜色修改
			.record-box{
				flex: 1;
				min-height: 0;
				min-width: 0;
				.record-item{
					display: flex;
					flex-direction: column;
					width: 100%;
					padding: 30rpx;
					border-bottom:1px solid #31345B;
					.record-info-item{
						font-size: 26rpx;
						color: #B3B3DD;
						padding-top: 10rpx;
					}
				}
			}
		}
	}

</style>
