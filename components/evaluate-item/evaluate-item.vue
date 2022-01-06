<template>
	<view class="evaluate_item_box">
		<view class="evaluator_box">
			<view class="box_left">
				<image src="/static/imgs/register/male.png" v-if="info.hasAnonymous"></image>
				<image :src="info.avatar" v-else></image>
			</view>
			<view class="box_right">
				<view class="first_line">
					<view class="name" v-if="info.hasAnonymous">匿名用户</view>
					<view class="name" v-else>{{info.nickName}}</view>
					<view class="time">{{info.time}}</view>
				</view>
				<view class="second_line">
					<view class="rate">
						<selfRate :score="info.avgScore" size="16"></selfRate>
					</view>
				</view>
			</view>
		</view>
		<view class="evaluate_context" :class="{noBorder:isLast}">
			<text>{{info.content}}</text>
		</view>
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	export default{
		components:{
			selfRate
		},
		props:{
			info:{
				type:Object,
				default:{}
			},
			isLast:{
				type:Boolean,
				default:false
			},
		},
		
	}
</script>

<style lang="scss" scoped>
	.evaluate_item_box{
		width: 100%;
		.evaluator_box{
			display: flex;
			align-items: center;
			height: 108rpx;
			.box_left{
				height: 64rpx;
				width: 64rpx;
				&>image{
					height: 100%;
					width: 100%;
					background: #FFFFFF;
					border-radius: 50%;
				}	
			}
			.box_right{
				width: calc(100% - 90rpx);
				margin-left: 26rpx;
				.first_line{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.name{
						font-size: 26rpx;
						color: #FFFFFF;
					}
					.time{
						font-size: 22rpx;
						color: #A2A6D9;
					}
				}
				.second_line{
					height: 30rpx;
					margin-top: 10rpx;
				}
			}
		}
		.evaluate_context{
			font-size: 26rpx;
			color: #FFFFFF;
			padding-bottom: 32rpx;
			border-bottom: 1px solid #31345B;
			&.noBorder {
				border: none;
			}
		}
	}
</style>
