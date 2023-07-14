<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="所在位置" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
			 :border-bottom="false"></u-navbar>
		<view class="search-box">
			<image src="/static/imgs/discovery/search.png" v-if="!hasContent"></image>
			<u-input  @input="inputEvent" type="text" :border="false" placeholder="搜索附近位置" :clearable="false" placeholder-style="text-align:center"
			 :custom-style="{'background': '#33365B',
					'border-radius': '45rpx',
					'padding-left':'30rpx',
					'padding-right':'30rpx',
					'color':'#FFFFFF'
					}" />
		</view>
		<view class="location-box">
			<block v-for="(item, index ) in searchList" :key="index">
				<view class="location-item" @tap="selectTick(index)" v-if="item.address && item.address.length > 0">
					<text class="location-name">{{item.name}}</text>
					<text class="location-detail">{{analysisAreaName(item)}}</text>
					<view class="location-select" v-if="isTick === index">
						<image src="/static/imgs/discovery/tick.png" mode=""></image>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	export default {
		data() {
			return {
				isTick: '',
				keyword: '',
				hasContent: false,
				searchList: [],
			}
		},
		watch: {
			keyword: function(val, oldVal) {
				if(val === ''){
					this.hasContent=false
				}else{
					this.hasContent=true
				}
			}
		},
		onLoad:function(){
			this.getSurroundAddress();
		},
		methods: {
		
			selectTick: function(e) {
				this.isTick = e;
				uni.$emit('updataLocation', this.searchList[e]);
				this.$u.route({type:'back'})
			},
			inputEvent: function(e){
				this.keyword = e;
				this.searchAddress(e);
			},
			// 根据搜索获取地址
			searchAddress: function(sarchValue = ""){
				this.$map.getInputtips({
					keywords: sarchValue,
					city: app.globalData.location.cityName,
					success: (res) =>{
						let searchList = res.tips;
						this.searchList = searchList;
					},
					fail: (e) => {
						console.log(e);
					}
				})
			},
			// 默认获取周边地址
			getSurroundAddress(){
				this.$map.getPoiAround({
					// querykeywords: '酒吧',
					success: (res) =>{
						let searchList = res.poisData;
						this.searchList = searchList;
					},
					fail: (e) => {
						console.log(e);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.header-box {
			.header-box-right {
				color: #FFFFFF;
				font-size: 28rpx;
				padding-right: 30rpx;

			}
		}

		.search-box {
			position: relative;
			width: 690rpx;
			margin: 0 30rpx;
			padding-bottom: 40rpx;

			image {
				position: absolute;
				top: 20rpx;
				left: 230rpx;
				width: 30rpx;
				height: 30rpx;
				z-index: 2;
			}
		}

		.location-box {
			display: flex;
			flex-direction: column;
			margin: 0 30rpx;

			.location-item {
				position: relative;
				display: flex;
				flex-direction: column;
				border-bottom: 1px solid #31345b;

				.location-name {
					font-size: 32rpx;
					color: #FFFFFF;
					padding: 20rpx 0;
				}

				.location-detail {
					font-size: 24rpx;
					color: #A8A8CE;
					padding-bottom: 40rpx;
				}

				.location-select {
					position: absolute;
					right: 30rpx;
					top: 50%;
					transform: translateY(-50%);

					image {
						width: 30rpx;
						height: 25rpx;
					}
				}
			}
		}
	}
</style>
