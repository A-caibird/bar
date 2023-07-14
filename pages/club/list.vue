<template>
	<view class="container">
		<wyb-drop-down ref="dropDown" :defaultProps="dropDownDefaultProps" :options="dropDownOptions"
			@select="filterChane" :dropIcon="'line'" :bg-color="{header:'#16192B',content: '#16192B'}"
			:defaultColor="'#FFFFFF'" :activeColor="'#FFFFFF'"></wyb-drop-down>
		<view style="height: 100rpx;"></view>
		<view class="middle-box">
			<mescroll-uni ref="mescrollRef" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback"
				:up="upOption" @up="upCallback">
				<block v-if="hasLocation">
					<block v-for="(info, index) in pageList" :key="index">
						<club :info="info" :customEvent="true" @click="clubTap"></club>
						<block v-if="index != (pageList.length - 1)">
							<u-gap :height="20" bgColor="#16192Bs"></u-gap>
						</block>
					</block>
				</block>
				<block v-else>
					<location-btn></location-btn>
				</block>
			</mescroll-uni>
		</view>

	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	import club from '@/components/club-item/club-item.vue'
	import location from '@/mixins/location.js';
	var app = getApp();
	var webView = null
	export default {
		mixins: [MescrollMixin, location],
		components: {
			club,
			MescrollUni
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
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5

				},
				url: '/api/club/list',
				params: {
					cityName: app.globalData.location.cityName,
					areaName: "",
					lng: app.globalData.location.lng,
					lat: app.globalData.location.lat,
					sortCondition: '',
					searchKey: '',
				},

				dropDownDefaultProps: {
					label: 'name',
					value: 'id'
				},
				dropDownOptions: [{
					header: '全部',
					contents: []
				}, {
					header: '距离优先',
					contents: [{
							name: '距离优先',
							id: '',
						}, {
							name: '销量优先',
							id: 'order'
						},
						{
							name: '评分优先',
							id: 'avgScore'
						}
					]
				}, {
					header: '酒吧类型',
					contents: [{
						name: '全类型',
						id: ''
					}]
				}],
				mode: 'list',
				chatFriendInfo: ""
			}
		},
		onReady() {
			webView = this.$mp.page.$getAppWebview()
		},
		onLoad: function(options) {
			this.mode = options.mode
			this.chatFriendInfo = options.chatFriendInfo || ""
			this.load()

		},
		onNavigationBarSearchInputConfirmed(e) {
			this.$u.debounce(this.searchKeyChange(e.text), 200, true)
			webView.setTitleNViewSearchInputFocus(false)
		},
		methods: {
			clubTap(id) {
				let url = "/pages/club/detail?id=" + id;
				let chatFriendInfo = this.chatFriendInfo;
				if (chatFriendInfo) {
					url = url + `&chatFriendInfo=${chatFriendInfo}`
				}
				uni.navigateTo({
					url: url,
					animationType: "slide-in-right",
				})
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
					this.getCitys()
					this.downCallback()
				})
			},
			load() {
				console.log("调用load")
				this.getCitys()
				this.getClubType();
				if (this.mode == 'list') {
					this.$nextTick(function() {
						console.log("downCallback");
						this.downCallback()
					})
				}
			},
			async getClubType() {
				let {
					code,
					data
				} = await this.$u.api.getClubTypeAPI();
				let typeList = [{
					name: '全类型',
					id: ''
				}];
				let clubTypeList = data.clubTypeList;
				clubTypeList.forEach((item, index) => {
					let info = {
						name: item.name,
						id: item.id
					}
					typeList.push(info);
				})
				console.log(typeList)
				this.dropDownOptions[2].contents = typeList;
			},
			searchKeyChange(e) {
				let params = this.$u.deepClone(this.params)
				params.searchKey = e
				this.params = params
				this.downCallback()
			},
			filterChane(e) {
				console.log("filterChane")
				let params = this.$u.deepClone(this.params)
				this.dropDownOptions[e.headerIndex].header = e.content.name
				if (e.headerIndex == 0) {
					if (e.content.name == '全部') {
						params.areaName = "";
					} else {
						params.areaName = e.content.name
					}
				} else if (e.headerIndex == 1) {
					params.sortCondition = e.content.id
				} else if (e.headerIndex == 2) {
					params.clubTypeId = e.content.id
				}
				this.params = params
				this.downCallback()
				setTimeout(() => {
					console.log(this.pageList);
					this.$refs.dropDown.close()
				}, 300)
			},
			async getCitys() {
				console.log("获取城市数据")
				if (this.hasLocation) {
					console.log("获取城市数据1")
					let {
						code,
						data
					} = await this.$u.api.getLowerCitys(this.params.cityName)
					if (code == 0) {
						let {
							areaList
						} = data
						let newlist = [{
							name: '全部',
						}];
						newlist = newlist.concat(areaList)
						console.log(newlist)
						this.dropDownOptions[0].contents = newlist
					}
				} else {
					console.log("获取城市数据2")
					if (this.canLocation) {
						this.getLocation()
					}
				}


			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;

		.container {
			height: 100%;
			display: flex;
			flex-direction: column;

			.middle-box {
				padding: 0 32rpx;
				flex: 1;
				min-width: 0;
				min-height: 0;
			}


		}

	}
</style>