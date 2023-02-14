<template>
	<view class="container">
		<scroll-view class="dynamic-details" scroll-y="true" @scrolltolower="upRefresh()" refresher-enabled="true"
		 :refresher-triggered="triggered" :refresher-threshold="50" refresher-background="#191C3F" @refresherrefresh="downRefresh()">
		<view class="record-item" v-for="(item,index) in pageList" :key="index">
			<view class="record-detail">
				<text>{{item.text}}</text>
				<text>+126币</text>
			</view>
			<view class="record-time">
				<text>2020-05-10 18:34</text>
			</view>
			<u-gap height="1" bg-color="#31345B" margin-top="30" margin-bottom="30"></u-gap>
		</view>
		</scroll-view>
	</view>
</template>

<script>
	import pageable from '@/mixins/pageable.js'
	export default {
		mixins: [pageable],
		props:{
			paramsInfo:Object
		},
		data() {
			return {
				triggered: false,
				url: '/api/user/revenueRecordList',//收益记录
				testTResult: { //测试数据
					"msg": "success",
					"code": 0,
					"data": {
						"totalPage": 3,
						"list": [
							// {
							// 	"text": "小叮当1赠送你啤酒 126", //啤酒礼物
							// },
						]
					}
				},
				testFResult: { //测试数据
					"msg": "success",
					"code": 0,
					"data": {
						"totalPage": 3,
						"list": [
							// {
							// 	"text": "你支持一个啤酒1 -126", //啤酒礼物
							// },
						]
					}
				}
			};
		},
		mounted() {
			this.downRefresh()
		},
		watch: {
			// 判断loading值确认下拉刷新是否完成
			loading: function(val, oldVal) {
				if (val === false) {
					this.finishRefresh()
				}
			}
		},
		methods:{
			//上拉加载
			upRefresh:function(){
				// this.params = this.paramsInfo
				this.more=true
				if(this.params.type==true){
					this.result=this.testTResult
				}else{
					this.result=this.testFResult
				}
				this.reachBottomLoad()
				if (this.more === true) {
					this.$u.toast("加载更多")
				} else {
					this.$u.toast("没有更多内容")
				}
			},
			//下拉刷新
			downRefresh:function(){
				// this.params = this.paramsInfo
				if (this.triggered) return;
				this.triggered = true
				if(this.params.type==true){
					this.result=this.testTResult
				}else{
					this.result=this.testFResult
				}
				this.pullRefresh()
			},
			//结束刷新动画
			finishRefresh:function(){
				this.triggered = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		.dynamic-details{
			height: calc(100vh - 240rpx);
		}
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
	}
</style>
