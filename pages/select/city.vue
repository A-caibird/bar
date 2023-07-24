<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" title="城市列表" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#16192B'}"></u-navbar>
		</view>
		<view class="middle_box">
			<!-- <u-index-list :scrollTop="scrollTop" :index-list="indexList">
				<view v-for="(item, index) in list" :key="index">
					<u-index-anchor :index="item.letter" :customStyle="{'color': '#FFFFFF', 'background': '#2C3158'}" />
					<view class="list-cell city_name" v-for="(item1, index) in item.data" :key="index">
						{{item1.name}}
					</view>
				</view>
			</u-index-list> -->
			<view class="list_box" v-if="citys.length > 0">
				<view class="title_line"> <text>开通城市</text> </view>
				<block v-for="(info, index) in citys" :key="index">
                 <view class="list-cell city_name" @tap="selectCity(info)"> <text>{{info.cityName}}</text> </view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import $storage from '@/common/storage.js'
	import indexList from "@/common/index.list.js";
	var app = getApp();
	const letterArr = indexList.list.map(val => {
		return val.letter;
	})
	export default {
		data() {
			return {
				scrollTop: 0,
				indexList: letterArr,
				list: indexList.list,
				citys: [],
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad:function(){
			this.getCitys();
		},
		methods:{
			// 获取开通城市
			getCitys: function(){
				this.$u.api.getCitys().then(res => {
					if(res.code==0) {
						this.citys = res.data.list || [];
						console.log(JSON.stringify(this.citys));
					}
				}).catch(e => {
					console.log(e);
				})
			},
			// 选择城市
			selectCity: function(city){
				console.log("选择城市",city.cityName);
				
				if(getApp().globalData.locationService) {
					// 存储当前位置城市名
					$storage.setLocation(getApp().globalData.location.cityName)
				}
				
				if($storage.getLocation() && getApp().globalData.locationService) {
					$storage.getLocation().cityName === city.cityName ? getApp().globalData.isCurrentLocation = true : getApp().globalData.isCurrentLocation = false;
				}
				
				
				getApp().globalData.location.cityName = city.cityName;
				
				uni.$emit('update-clubList',city.cityName)
				uni.navigateBack();
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.container {
		height: auto;
		min-height: 100%;

		.title_line {
			color: rgb(255, 255, 255);
			background: rgb(44, 49, 88);
			box-sizing: border-box;
			padding: 7px 12px;
			width: 100%;
			font-weight: 500;
			font-size: 14px;
			line-height: 1.2;
		}

		.city_name {
			color: #FFFFFF;
			height: 82rpx;
			line-height: 82rpx;
			box-sizing: border-box;
			padding-left: 40rpx;
			font-size: 30rpx;
		}
	}
</style>
