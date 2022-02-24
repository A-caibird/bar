<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="我的动态" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false">
			<view class="btn-publish" slot="right">
				<button @tap="$u.route('pages/discovery/addDynamic')" type="default">
					<u-icon name="plus" color="#FFFFFF" size="28"></u-icon>
					<text>发布</text>
				</button>
			</view>
		</u-navbar>
		<view class="dynamic-wrap">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<block v-if="hasLocation">
				<!-- kind值为personal时 个人动态组件 -->
					<personalDynamic @deleteTap="deleteHandle" :pageList="pageList" @videoPlayTap="videoPlayHandle" @shareTap="popShareShow = true" @oepnComment="$refs.dynamicComment.open($event)" @oepnGift="$refs.dynamicGift.open($event)" :showPercent="!isAppleAudit"></personalDynamic>
				</block>
				<block v-else>
					<location-btn></location-btn>
				</block>
			</mescroll-uni>
		</view>
		<videoBox ref="videoBox"></videoBox>
		<dynamic-comment ref="dynamicComment" @sendComment="setCommentNum($event)"></dynamic-comment>
		<dynamic-gift ref="dynamicGift" @refreshInputTimes="refreshInputTimes" @oepnGiftEdit="$refs.dynamicGiftEdit.open($event)" @openPay="$refs.payDynamicGift.open($event)" @sendGiftSuccess="handleSendGiftSuccess($event)"></dynamic-gift>
		<dynamic-gift-edit ref="dynamicGiftEdit" @confirm="$refs.dynamicGift.setSendNum($event)"></dynamic-gift-edit>
		<pay ref="payDynamicGift" @pay="$refs.dynamicGift.pay($event)"></pay>
		<giftAnimation ref="giftAnimation"></giftAnimation>
		<popShare v-model="popShareShow"></popShare>
	</view>
</template>

<script>
	var app = getApp();
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import myCollection from '@/components/mycollection-item/mycollection-item.vue';
	import personalDynamic from '@/components/personalDynamic-item/personalDynamic-item.vue';
	import location from '@/mixins/location.js';
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	import appleAudit from '@/mixins/apple-audit.js'
	import videoBox from '@/components/common-video/video.vue'
	export default {
		mixins: [MescrollMixin,location,appleAudit], // 使用mixin (在main.js注册全局组件)
		components: {
			personalDynamic,
			giftAnimation,
			videoBox
		},
		data() {
			return {
				popShareShow: false,
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
				url:'/api/dynamic/myPublishList',
				params : {
					lng: app.globalData.location.lng, //经度
					lat: app.globalData.location.lat//纬度
				},
			};
		},
		onLoad() {
			this.load();
			uni.$on('dynamic-refresh',this.handleDynamicRefresh)
		},
		beforeDestroy() {
			uni.$off('dynamic-refresh',this.handleDynamicRefresh)
		},
		methods: {
			deleteHandle(e){
				let id = e.dynamicId
				var vm = this;
				uni.showModal({
					title: '提示',
					content: '是否删除该动态',
					success(res){
						if(res.confirm){
							vm.$u.api.dynamicDeleteApi(id).then(res => {
								if(parseInt(res.code) == 0){
									vm.$u.toast('成功删除');
									uni.$emit('dynamic-refresh',{msg:'dynamic-detail'})
									uni.$emit('dynamic-refresh-follow',{msg:'dynamic-detail'})
								}
							}).catch(e => {
								console.log(e);
							})
						}
					}
				})
			},
			videoPlayHandle(e){
				this.$refs.videoBox.videoPlayTap(e.src);
			},
			refreshInputTimes(){
				this.$refs.payDynamicGift.subInputTimes();
			},
			handleDynamicRefresh(e){
				if(e.msg!='myDynamic') {
					console.log('刷新我的动态列表')
					this.mescroll.resetUpScroll()
				}
			},
			setGifttNum(data){
				let {id,giftNum} = data
				this.setList('id',id,{giftNum:giftNum},this.pageList)
				uni.$emit('dynamic-refresh',{msg:'myDynamic'})
			},
			handleSendGiftSuccess(e){
				this.setGifttNum(e)
				if(e.gifUrl) {
					this.$refs.giftAnimation.show(e.gifUrl)
				}
				
			},
			setCommentNum(data){
				let {id,commentNum} = data
				this.setList('id',id,{commentNum:commentNum},this.pageList)
				uni.$emit('dynamic-refresh',{msg:'myDynamic'})
			},
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
			async downRefresh(){
				if(!this.hasLocation&&this.canLocation) {
					this.getLocation()
				} 
			}
			
		},
		
	};
	
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
			.btn-publish {
				padding-right: 30rpx;
				color: #ffffff;
				font-size: 28rpx;
				button {
					padding: 0;
					width: 140rpx;
					height: 64rpx;
					background: #f72eb2;
					color: #ffffff;
					font-size: 28rpx;
					border-radius: 49rpx;
					line-height: 64rpx;
					& > text {
						margin-left: 8rpx;
					}
				}
			}
			.dynamic-wrap {
				flex: 1;
				min-width: 0;
				min-height: 0;
				
			}
		}
	}
	
</style>
