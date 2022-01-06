<template>
	<view class="container">
		<view class="header_box">
		<u-navbar back-icon-color="#FFFFFF" title="信用积分" title-size="36" title-color="#FFFFFF" :background="{
					'background': '#191C3F'
				}" :border-bottom="false">
			<view class="header_box_right" @tap="$u.route('/pages/mine/credit/rule')" slot="right" style="color: #FFFFFF; font-size: 28rpx; padding-right: 30rpx;">
				规则说明
			</view>
				</u-navbar>


		</view>
		<view class="middle_box">
			<view class="middle_content">
				<image src="@/static/imgs/credit/credit.png" mode=""></image>
					<view class="score">100</view>
					<view class="score_text">信用分</view>
			</view>
		</view>
		<view class="bottom_box">
			<view class="bottom_title">
				<view class="title_left"></view>
				<view class="title_text">信用分记录</view>
			</view>
			<u-gap height="1" bg-color="#31345B"></u-gap>
			<view class="bottom_content" >
				<view class="content_item"  v-for="item,index in list" :key="index">
					<view class="content_item_top" >
						<view class="top_left">
							正常完成1次
						</view>
						<view class="top_right">
							信用分+1
						</view>
					</view>
					<view class="content_item_time">
						2020-5-10 18:34
					</view>
					<u-gap height="1" bg-color="#31345B"></u-gap>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[
					{
						num:'1'
					},
					{
						num:'2'
					},
					{
						num:'3'
					},
					{
						num:'4'
					}
				]
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		height: 100%;
		width: 100%;
		background-color: $uni-title-color;
		.header_box{
			display: flex;
			width: 100%;
			height: 50rpx;
			padding: 0 30rpx;

		}
		.middle_box{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 450rpx;
			.middle_content{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 108rpx;
				image{
					width: 108rpx;
					height: 116rpx;
				}
				.score{
					font-size: 60rpx;
					color: #FFFFFF
				}
				.score_text{
					font-size: 31rpx;
					color: #FFFFFF;
				}
			}
		}
		.bottom_box{
			width: 100%;
			padding: 0 30rpx;
			.bottom_title{
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				.title_left{
					width: 6rpx;
					height: 26rpx;
					background: #ff59c9;
				}
				.title_text{
					font-size: 30rpx;
					color: #FFFFFF;
					padding-left: 14rpx;
				}
			}
			.bottom_content{
				display: flex;
				flex-direction: column;
				height: 100%;
				.content_item{
					display: flex;
					flex-direction: column;
					width: 100%;
					height: 162rpx;
					
					.content_item_top{
						display: flex;
						justify-content: space-between;
						width: 100%;
						padding-top: 30rpx;
						.top_left{
							font-size: 30rpx;
							color: #FFFFFF
						}
						.top_right{
							font-size: 30rpx;
							color: #FFFFFF
						}
					}
					.content_item_time{
						font-size: 24rpx;
						color: #9292BA;
						padding-top: 11rpx;
						margin-bottom: 40rpx;
					}
				}
			}
		}
		
	}
</style>
