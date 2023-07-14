<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="收支明细" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="record-item" v-for="item,index in 12" :key="index" v-if="hasRecord">
			<view class="record-detail">
				<text>充值酒币300个</text>
				<text>30元</text>
			</view>
			<view class="record-time">
				<text>2020-05-10 18:34</text>
			</view>
			<u-gap height="1" bg-color="#31345B" ></u-gap>
		</view>
		<!-- 收支为空时  显示空页面 -->
		<view class="empty" v-else>
			<image src="/static/imgs/common/nothing.png" mode=""></image>
			<text>暂无记录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hasRecord:true
			}
		},
		onReachBottom(){
			console.log("1")
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		position: relative;
		.header-box{
			
		}
		.empty{
			display: flex;
			flex-direction: column;
			text-align: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			&>image{
				width: 150rpx;
				height: 150rpx;
				padding-bottom: 50rpx;
			}
			&>text{
				font-size: 30rpx;
				color: #FFFFFF;
			}
		}
		.record-item{
			margin-top: 40rpx;
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
				margin-bottom: 40rpx;
			}
		}
	}
</style>