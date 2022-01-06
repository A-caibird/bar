<template>
	<view class="activity_item_box" @tap="$u.throttle(tapGoDetail)">
		<view class="activity_img">
			<image :src="info.cover"></image>
		</view>
		<view class="activity_footer">
			<view class="activity_intro">
				<text>{{info.title}}</text>
			</view>
			<view class="activity_intro2">
				<text>{{info.subTitle}}</text>
			</view>
			<view class="activity_date"> <text>{{info.publishTime}}</text> </view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			info: Object
		},
		methods:{
			tapGoDetail(){
				console.log(this.info)
				this.$u.route('/pages/club/activity/detail',{
					id:this.info.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity_item_box{
		width: 100%;
		.activity_img{
			width: 100%;
			height: 360rpx;
			&>image{
				height: 100%;
				width: 100%;
				// background: #007AFF;
			}
		}
		.activity_footer{
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			background: #2C3158;
			.activity_intro{
				width: 100%;
				max-height: 40rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				@include ellipsis();
			}
			.activity_intro2{
				width: 100%;
				max-height: 40rpx;
				font-size: 28rpx;
				color: #A8A8CE;
				margin-top: 10rpx;
				@include ellipsis();
			}
			.activity_date{
				color: #A8A8CE;
				font-size: 22rpx;
				margin-top: 14rpx;
			}
		}
	}
</style>
