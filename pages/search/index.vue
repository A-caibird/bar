<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" :border-bottom="false" :is-fixed="true" :background="{
				'background': '#16192B'
			}">
				<view style="width: calc(100% - 60rpx);margin-left: 30rpx; display: flex; align-items: center;">
					<view class="search_box" style="width: 100%;">
						<u-search  :input-style="{'font-size': '28rpx', 'color': '#FFFFFF'}"  placeholder-color="#9497B5" :clearabled="false" color="#9497B5" bgColor="#33365B" shape="round" :action-style="{'color': '#FFFFFF', 'font-size' : '28rpx'}"></u-search>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="middle_box">
			<view class="record_box">
				<view class="record_label">
					<view class="label_left">
						<text>历史记录</text>
					</view>
					<view class="label_right">
						<image class="delete_icon" src="/static/imgs/common/delete_icon.png"></image>
					</view>
				</view>
				<view class="record_list">
					<block v-for="(info, index) in 9" :key="index">
						<view class="commonn_record"> <text>HAPTDJFJD 音乐就酒吧</text> </view>
					</block>
				</view>
			</view>
		</view>
	</view>	
</template>

<script>
</script>

<style lang="scss" scoped>
	
	.container{
		width: 100%;
		.middle_box{
			width: 100%;
			.record_box{
				width: 100%;
				.record_label{
					width: 100%;
					height: 120rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					box-sizing: border-box;
					padding: 0 30rpx;
					.label_left{
						font-size: 28rpx;
						color: #B3BAEF;
					}
					.label_right{
						.delete_icon{
							height: 26rpx;
							width: 26rpx;
						}
					}
				}
				.record_list{
					width: 100%;
					.commonn_record{
						width: 100%;
						padding: 0 30rpx;
						box-sizing: border-box;
						height: 100rpx;
						line-height: 100rpx;
						font-size: 28rpx;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
