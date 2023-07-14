<template>
	<!--附近动态-->
	<view>
		<mescroll-uni ref="mescrollRef" :canShowTop="false" :fixed="true" @init="mescrollInit" :down="downOption"
			@down="downCallback" :up="upOption" @up="upCallback">
			<block v-if="hasLocation">
				<view class="search_box">
					<u-search :value="params.searchKey" height="64" placeholder="请输入昵称" :showAction="false"
						@change="searchChange" bg-color="rgba(255,255,255,0.1)"
						placeholder-color="rgba(255,255,255,0.2)"></u-search>
				</view>
				<view v-for="(info, index) in pageList" :key="index">
					<block v-if="info.type=='club' || info.type == 'clubActivity'">
						<dynamic-item @reportTap="reportTap" :info="info" :btnShow="true&&showPercent"
							swiperHeight="468.75"></dynamic-item>
					</block>
					<block v-else>
						<find-item @reportTap="reportTap" @videoPlayTap="videoPlayTap" :mode="mode" :info="info"
							:showPercent="showPercent" @shareTap="$emit('shareTap')" @showYaoyue="handleShowYaoyue"
							@showPing="handleShowPing" @oepnComment="$emit('oepnComment',$event)"
							@oepnGift="$emit('oepnGift',$event)"></find-item>
					</block>
					<block v-if="index != pageList.length - 1"><u-gap :height="2"
							bgColor="rgba(255,255,255,0.08)"></u-gap></block>
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
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js"; //精致的下拉刷新和上拉加载js框架
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js"; //精致的下拉刷新和上拉加载js框架
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue' //精致的下拉刷新和上拉加载js框架

	import findItem from '@/components/find-item/find-item.vue'; //两种item的显示
	import dynamicItem from '@/components/nearby-club-dynamic/nearby-club-dynamic.vue' //两种item的显示

	import locationBtn from '@/components/location-btn/location-btn.vue'; //获取定位相关的
	import location from '@/mixins/location.js'; //获取定位相关的
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin, location], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
			findItem,
			dynamicItem,
			locationBtn,
		},
		props: {
			showPercent: { //follow 关注的动态 nearby 附件动态
				type: Boolean,
				default: false,
			},
		},
		mounted() {
			uni.$on('dynamic-refresh', this.refresh)
			this.refresh({
				msg: 'refresh'
			});
		},
		beforeDestroy() {
			uni.$off('dynamic-refresh', this.refresh)
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 8 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5

				},

				url: '/api/dynamic/nearby',
				params: {
					lng: app.globalData.location.lng, //经度
					lat: app.globalData.location.lat,
					areaName: app.globalData.location.cityName,
					searchKey: '',
				},
				mode: 'nearby'
			}
		},
		computed: {

		},
		methods: {
			reportTap(info) {
				this.$emit('reportTap', info);
			},
			videoPlayTap(e) {
				this.$emit('videoPlayTap', e);
			},
			toTopClick() {
				return this.$refs.mescrollRef ? this.$refs.mescrollRef.toTopClick() : ""
			},
			refreshScrll() {
				this.mescroll.resetUpScroll()
			},
			searchChange(e) {
				console.log("显示附近动态")
				this.params.searchKey = e;
				this.mescroll.resetUpScroll()
			},
			judgeLoad() {
				return this.hasLocation
			},
			handleUpdateLocation() {
				this.setLocation(() => {
					let {
						cityName,
						lng,
						lat
					} = app.globalData.location
					this.params.areaName = cityName
					this.params.lng = lng
					this.params.lat = lat
					this.downCallback()
				})
			},
			setGifttNum(data) {
				let {
					id,
					giftNum
				} = data
				this.setList('id', id, {
					giftNum: giftNum
				}, this.pageList).then(res => {
					// this.refresh({msg:this.mode});
					uni.$emit('dynamic-refresh-follow', {
						msg: this.mode
					})
				}).catch(e => {
					console.log(e);
				})
			},
			setCommentNum(data) {
				let {
					id,
					commentNum
				} = data
				this.setList('id', id, {
					commentNum: commentNum
				}, this.pageList).then(res => {
					// this.refresh({msg:this.mode});
					uni.$emit('dynamic-refresh-follow', {
						msg: this.mode
					})
				}).catch(e => {
					console.log(e);
				})
			},
			refresh(e) {
				console.log(e);
				if (e.msg != this.mode) {
					console.log('刷新附近动态列表')
					this.mescroll.resetUpScroll()
				}
			},
			handleShowPing(e) {
				this.$emit("showPing", e)
			},
			handleShowYaoyue(e) {
				this.$emit("showYaoyue", e)
			},
		}
	}
</script>
<style lang="scss">
	.search_box {
		box-sizing: border-box;
		padding: 20rpx 30rpx;
	}

	::v-deep .u-input {
		background-color: transparent !important;
	}
</style>