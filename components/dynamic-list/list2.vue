<template>
	<view>
		<mescroll-uni ref="mescrollRef" :canShowTop="false" :fixed="true" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
			<block v-if="hasLocation">
				<view  v-for="(info, index) in pageList" :key="index">
					<block v-if="info.type=='club'">
						<dynamic-item :info="info" @reportTap="reportTap" :btnShow="true&&showPercent" swiperHeight=468.75 ></dynamic-item>
					</block>
					<block v-else>
						<find-item @reportTap="reportTap" @videoPlayTap="videoPlayTap" mode="follow" :info="info" :showPercent="showPercent" @shareTap="$emit('shareTap')" @showYaoyue="handleShowYaoyue" @showPing="handleShowPing" @oepnComment="$emit('oepnComment',$event)" @oepnGift="$emit('oepnGift',$event)"></find-item>
					</block>
					<block v-if="index != pageList.length - 1"><u-gap :height="30" bgColor="#20234B"></u-gap></block>
				</view>
			</block>
			<block v-else>
				<location-btn></location-btn>
			</block>
		</mescroll-uni>
		
	</view>
	
</template>

<script>
	var app = getApp();
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	
	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'

	import findItem from '@/components/find-item/find-item.vue';
	import dynamicItem from '@/components/nearby-club-dynamic/nearby-club-dynamic.vue'
	
	import locationBtn from '@/components/location-btn/location-btn.vue';
	
	import location from '@/mixins/location.js';
	export default{
		mixins: [MescrollMixin,MescrollMoreItemMixin,location], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollUni,
			findItem,
			dynamicItem,
			locationBtn,
		},
		props:{
			showPercent:{//follow 关注的动态 nearby 附件动态
				type:Boolean,
				default:false,
			},
		},
		mounted() {
			uni.$on('dynamic-refresh-follow',this.refresh)
			this.refresh({msg:'refresh'});
		},
		beforeDestroy() {
			uni.$off('dynamic-refresh-follow',this.refresh)
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
				
				url: '/api/dynamic/myAttentionUserDynamic',
				params:{
					lng:  app.globalData.location.lng, //经度
					lat: app.globalData.location.lat,
					areaName: app.globalData.location.cityName,
					searchKey:'',
				},
				mode: 'follow'
			}
		},
		computed:{
		
		},
		methods:{
			reportTap(info){
				this.$emit('reportTap', info);
			},
			videoPlayTap(e){
				this.$emit('videoPlayTap', e);
			},
			toTopClick(){
				return this.$refs.mescrollRef ? this.$refs.mescrollRef.toTopClick() : "" 
			},
			refreshScrll(){
				this.mescroll.resetUpScroll()
			},
			searchChange(e){
				this.params.searchKey = e;
				this.mescroll.resetUpScroll()
			},
			judgeLoad(){
				return this.hasLocation
			},
			handleUpdateLocation(){
				this.setLocation(()=>{
					let {cityName,lng,lat} = app.globalData.location
					this.params.areaName = cityName
					this.params.lng = lng
					this.params.lat = lat
					this.downCallback()
				})
			},
			setGifttNum(data){
				let {id,giftNum} = data
				this.setList('id',id,{giftNum:giftNum},this.pageList).then(res => {
					uni.$emit('dynamic-refresh',{msg:this.mode})
					this.refresh({msg:this.mode});
				}).catch(e => {
					console.log(e);
				})
			},
			setCommentNum(data){
				let {id,commentNum} = data
				this.setList('id',id,{commentNum:commentNum},this.pageList).then(res => {
					uni.$emit('dynamic-refresh',{msg:this.mode})
					// this.refresh({msg:this.mode});
				}).catch(e => {
					console.log(e);
				})
			},
			refresh(e){
				if(e.msg!=this.mode) {
					console.log('刷新关注动态页面');
					this.mescroll.resetUpScroll()
				}
			},
			handleShowPing(e){
				this.$emit("showPing",e)
			},
			handleShowYaoyue(e){
				this.$emit("showYaoyue",e)
			},
		}
	}
</script>
<style lang="scss">
	.search_box{
		box-sizing: border-box;
		padding: 20rpx 30rpx;
	}
</style>

