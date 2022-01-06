<template>
	<view class="recruitment_item_box" @tap="$u.throttle($u.route('pages/club/job/job-detail?id='+info.id))">
		<view class="common_line">
			<view class="line_left first">
				<text>{{info.name}}</text>
			</view>
			<view class="line_right first">
				<text>{{info.monthlySalary}}</text>
			</view>
		</view>
		<view class="common_line" style="margin-top: 14rpx;">
			<view class="line_right second">
				<text>招聘 {{info.recruitsNumber}}人</text>
			</view>
			
			<view class="line_left second">
				<text>{{info.salaryComposition}}</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			info: Object
		}
	}
</script>

<style lang="scss" scoped>
	.recruitment_item_box{
		width: 100%;
		background: #2C3158;
		border-radius: 10rpx;
		padding: 30rpx;
		box-sizing: border-box;
		.common_line{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.line_left{
				&.first{
					font-size: 30rpx;
					color: #FFFFFF;
				}
				&.second{
					font-size: 26rpx;
					color: #A8A8CE;
				}
			}
			.line_right{
				&.first{
					font-size: 28rpx;
					color: #FFFFFF;
				}
				&.second{
					font-size: 26rpx;
					color: #A8A8CE;
				}
			}
		}
	}
</style>
