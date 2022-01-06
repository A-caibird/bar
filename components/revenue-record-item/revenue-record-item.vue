<template>
	<view class="record-item" >
		<view class="record-detail">
			<text>{{info.title}}</text>
			<text v-if="mode == 'wallet'">{{info.type=='income'?'+':'-'}}{{info.wineCoin}}币</text>
			<text v-if="mode == 'balance'">{{info.type=='income'?'+':'-'}}{{info.wineCoin}}元</text>
		</view>
		<view class="record-time">
			<text>{{info.createDate}}</text>
		</view>
		<u-gap height="1" bg-color="#31345B" margin-top="30" margin-bottom="30"></u-gap>
	</view>
</template>

<script>
	
	export default {
		props:{
			info:{
				type:Object,
				default:{}
			},
			mode:{
				type: String,
				default: 'wallet'
			}
		},
		data() {
			return {
				
			};
		},
		
		
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.record-item{
		padding: 0 30rpx;
		.record-detail{
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			color: #FFFFFF;
			
		}
		.record-time{
			font-size: 24rpx;
			color: #9292BA;
			padding: 10rpx 0;
		}
	}
		
</style>
