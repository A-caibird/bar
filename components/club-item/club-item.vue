<template>
	<view class="club_item_box" @tap="$u.throttle(goClubDetail(info.id))">
		<view class="club_header">
			<view class="header_left">
				<view class="club_name">{{info.name}}</view>
			</view>
			<view class="header_right">
				<view class="club_location" @tap.stop="openMap(info.lng,info.lat,info.address)">
					<image src="/static/imgs/common/location.png"></image>
					<text>{{info.distance}}</text>
				</view>
			</view>
		</view>
		<view class="club_img">
			<image :src="info.cover" mode="aspectFill"></image>
		</view>
		<view class="club_footer">
			<view class="club_intro">
				<text>{{info.subtitle}}</text>
			</view>
			<view class="club_labels" v-if="info.labelList.length > 0">
				<block v-for="(item, index) in info.labelList" :key="index">
					<view class="commom_label"> <text>{{item}}</text> </view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			info: [Object]
		}
	}
</script>

<style lang="scss" scoped>
	.club_item_box{
		width: 100%;
		.club_header{
			width: 100%;
			height: 120rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header_left{
				display: flex;
				align-items: center;
				.club_name{
					font-size: 34rpx;
					color: #FFFFFF;
				}
			}
			.header_right{
				.club_location{
					display: flex;
					align-items: center;
					&>image{
						height: 26rpx;
						width: 22rpx;
					}
					&>text{
						font-size: 24rpx;
						color: #FFFFFF;
						margin-left: 4rpx;
					}
				}
			}
		}
		.club_img{
			width: 100%;
			height: 468.75rpx;
			&>image{
				height: 100%;
				width: 100%;
			}
		}
		.club_footer{
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			.club_intro{
				width: 100%;
				line-height: 40rpx;
				max-height: 80rpx;
				font-size: 30rpx;
				color: #FFFFFF;
			}
			.club_labels{
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 26rpx;
				.commom_label{
					height: 40rpx;
					@include flex-center();
					border: 1px solid #565B86;
					font-size: 20rpx;
					color: #B3BAEF;
					padding: 0 10rpx;
					border-radius: 2rpx;
					margin-right: 12rpx;
					margin-bottom: 12rpx;
				}
			}
		}
	}
</style>
