<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#16192B'
			}" :title="activity.title" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="activity_info">
				<!-- <view class="activity_name"> <text>{{activity.title}}</text> </view> -->
				<view class="second_line">
					<view class="act_time"> <text>{{activity.publishTime}}</text> </view>
				</view>
			</view>
			<view class="act_detail" style="color: #FFFFFF;">
				<u-parse :html="activity.content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				activity: {
					title: '',
					publishTime: '',
					content:'',
				},
				clubName:'',
				id: "",
				clubId: '', //酒吧id
			}
		},
		onLoad:function(options){
			let id = options.id;
			this.id = id;
			this.activityDetail();
		},
		methods:{
			activityDetail: async function(){
				this.updatePushCount();
				let {code,data} = await this.$u.api.platformActivityDetailApi(this.id)
				if(code==0) {
					let {platformActivity} = data
					this.activity = platformActivity
				}
			},
			updatePushCount(){
				uni.$emit('push_listener');
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		.middle_box{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			padding: 30rpx 0rpx;
			.activity_info{
				width: 100%;
				.activity_name{
					font-size: 40rpx;
					color: #FFFFFF;
					font-weight: 500;
				}
				.second_line{
					display: flex;
					align-items: center;
					line-height: 60rpx;
					.act_location{
						font-size: 26rpx;
						color: #FFFFFF;
					}
					.act_time{
						// font-size: 24rpx;
						font-size: 28rpx;
						color: #A8A8CE;
						// margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>
