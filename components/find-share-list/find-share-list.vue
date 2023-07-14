<template>
	<mescroll-uni :ref="'mescrollRef'+i" :canShowTop="false" :fixed="true" @init="mescrollInit" :down="downOption"
		@down="downCallback" :up="upOption" @up="upCallback">
		<block v-if="hasLocation">
			<block v-for="(info, index) in pageList" :key="index">
				<view class="common_item">
					<find-share :info="info"></find-share>
					<block v-if="index != pageList.length - 1"><u-gap :height="30" bgColor="#16192B"></u-gap></block>
				</view>
			</block>
		</block>
		<block v-else>
			<location-btn></location-btn>
		</block>
	</mescroll-uni>

</template>

<script>
	var app = getApp();
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";

	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'


	import findShare from '@/components/find-share/find-share.vue';
	import locationBtn from '@/components/location-btn/location-btn.vue';

	import location from '@/mixins/location.js';
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin, location], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
			findShare,
			locationBtn,
		},
		props: {

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
						size: 20 // 每页数据的数量
					},
					noMoreSize: 1, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5

				},

				url: '/api/order/list',
				params: {
					cityName: app.globalData.location.cityName,
					lng: app.globalData.location.lng, //经度
					lat: app.globalData.location.lat,
					areaName: app.globalData.location.cityName
				}
			}
		},
		mounted() {
			console.log("定位==》" + app.globalData.location.cityName, )
			uni.$on('find-share-list-refresh', () => {
				this.mescroll.resetUpScroll()
			})
		},
		beforeDestroy() {
			uni.$off('find-share-list-refresh');
		},
		methods: {
			toTopClick() {
				let mescrollRef = 'mescrollRef' + this.i;
				return this.$refs[mescrollRef] ? this.$refs[mescrollRef].toTopClick() : ""
			},
			judgeLoad() {
				if (app.globalData.location.cityName != '未定位') {
					this.hasLocation = true
					let {
						cityName,
						lng,
						lat
					} = app.globalData.location
					this.params.areaName = cityName
					this.params.lng = lng
					this.params.lat = lat
				} else {
					this.hasLocation = fasle
				}
				console.log('judgeLoad', this.hasLocation);
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
		}
	}
</script>