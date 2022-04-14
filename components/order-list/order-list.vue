<template>
	<mescroll-uni :ref="'mescrollRef'+i" :fixed="true" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view style="margin-bottom: 30rpx;" v-for="(info, index) in pageList" :key="info.id">
			<yao-order-item v-if="mode=='common'" :info="info" @statementPopShowTap="statementPopShowTap"></yao-order-item>
			<ping-order-item v-if="mode=='share'" :info="info"></ping-order-item>
			<statementPop ref="statementPopRef" btnText="去付款" @btnTap="statementSelectTap"></statementPop>
		</view>
	</mescroll-uni>
	
</template>

<script>
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	
	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import PingOrderItem from '@/components/ping-order-item/ping-order-item.vue'
	import YaoOrderItem from '@/components/yao-order-item/yao-order-item.vue'
	import statementPop from '@/components/chatStatement/chatStatement.vue'
	import orderUtils from '@/common/orderUtils.js'
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollUni,
			PingOrderItem,
			YaoOrderItem,
			statementPop
		},
		props:{
			mode:{
				type:String,
				default:'common',
			},
			status:{
				type:String,
				default:'',
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
				
				url:this.mode=='share'?'/api/order/pingList':'/api/order/inviteOrderList',
				params:{
					status:this.status,
				},
				orderInfo: {},
			}
		},
		computed:{
		
		},
		watch:{
			
		},
		methods:{
			statementPopShowTap(orderInfo){
				this.orderInfo = orderInfo;
				this.$refs.statementPopRef[0].show();
			},
			statementSelectTap(e){
				let statement = e;
				let info = this.$u.deepClone(this.orderInfo);
				info = Object.assign({
					statementStr: statement,
				}, info)
				orderUtils.goPay(this, 'yaoyue', info);
			}
		}
	}
</script>


