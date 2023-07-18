<template>
	<view class="container">
			<u-navbar back-icon-color="#FFFFFF" title="我的收藏" title-size="36" title-color="#FFFFFF" :background="{ background: '#16192B' }" :border-bottom="false"></u-navbar>

		<view class="order-info-box">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<block v-if="hasLocation">
					<myCollection :pageList="pageList" @refresh="refresh"></myCollection>
				</block>
				<block v-else>
					<location-btn></location-btn>
				</block>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	var app = getApp()
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import myCollection from '@/components/mycollection-item/mycollection-item.vue';
	import location from '@/mixins/location.js';
	export default {
		components: {
			myCollection
		},
		mixins: [MescrollMixin,location], // 使用mixin (在main.js注册全局组件)
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
				url:'/api/user/myCollect',
				params : {
					lng: app.globalData.location.lng, //经度
					lat: app.globalData.location.lat//纬度
				},
			};
		},
		onLoad() {
			this.load()
		},
		methods: {
			judgeLoad(){
				return this.hasLocation
			},
			handleUpdateLocation(){
				this.setLocation(()=>{
					let {cityName,lng,lat} = app.globalData.location
					this.params.lng = lng
					this.params.lat = lat
					this.downCallback();
				})
				
			},
			handleUpdateLocationService(){
				this.updateLocationService(()=>{
					if(this.canLocation&&!this.hasLocation) {
						this.getLocation()
					}
				})
			},
			load(){
				this.downRefresh()
			},
			refresh(){
				this.downCallback();
			},
			async downRefresh(){
				if(!this.hasLocation&&this.canLocation) {
					this.getLocation()
				} 
			}
		}
	};
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
			.order-info-box{
				flex: 1;
				min-width: 0;
				min-height: 0;
			}
		}
	}

</style>
