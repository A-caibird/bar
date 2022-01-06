<template>
	<mescroll-uni :ref="'mescrollRef'+i" :fixed="true" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view style="margin-bottom: 30rpx;" v-for="(info, index) in pageList" :key="info.id">
			<gift-payments-item :info="info"></gift-payments-item>
		</view>
	</mescroll-uni>
	
</template>

<script>
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	
	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import revenueRecordItem from '@/components/revenue-record-item/revenue-record-item.vue'
	
	export default{
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollUni,
			revenueRecordItem,
		},
		props:{
			isSend:{
				type:Boolean,
				default:false,
			},
			
		},
		
		data(){
			return {
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					
				},
				
				url:'/api/user/giftHistoryList',
				params:{
					isSend:this.isSend,
				}
			}
		},
		computed:{
		
		},
		watch:{
			isSend(val){
				this.params.isSend = this.isSend
				this.downCallback()
			}
		},
		methods:{
			
		}
	}
</script>


