<template>
	<mescroll-uni :ref="'mescrollRef'+i" :fixed="true" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="goods-wrap">
			<block v-for="(info, index) in pageList" :key="index">
				<view style="margin-bottom: 30rpx;" @tap="$u.throttle($emit('tapItem',info))">
					<drinksItem :info="info" @plus="$emit('plus',info)" @minus="$emit('minus',info)"></drinksItem>
				</view>
			</block>
		</view>
		
	</mescroll-uni>
	
</template>

<script>
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	
	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import drinksItem from '@/components/drinks-item/drinks-item.vue'
	
	export default{
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollUni,
			drinksItem,
		},
		props:{
			goodsId:{
				type:String|Number,
				default:'',
			},
			clubId:{
				type:String|Number,
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
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					
				},
				
				url:'/api/commodity/list',
				params:{
					clubId:this.clubId,
					id:this.goodsId
				}
			}
		},
		computed:{
		
		},
		watch:{
			
		},
		methods:{
			setSCNum(shopingCartList){
				let pageList = this.$u.deepClone(this.pageList)
				pageList.forEach(e1=>{
					let index = shopingCartList.findIndex(e2=>{
						return e1.id==e2.commodity.id
					})
					if(index!=-1) {
						e1.count = shopingCartList[index].buyNum
					} else {
						e1.count = 0
					}
				})
				this.pageList = pageList
			},
			handleData(pageNumber,data){
				// console.log(data)
				let pageList = this.pageList
				if (pageNumber <= 1) {
					pageList = []
				} 
				pageList = pageList.concat(data.list);
				// console.log(pageList)
				this.pageList = pageList;
				this.totalPages = data.totalPage;
				this.$emit('listRefresh')
				uni.hideLoading();
				this.mescroll.endByPage(data.list.length, this.totalPages);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.goods-wrap {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
	}
</style>
