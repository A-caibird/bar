<template>
	<view class="awkward_box" v-if="show">
		<common-pop :customStyle="tipsStyle" @click="close">
			<view class="awkward_info" v-if="mode=='invite'">
				<view class="title_text"> <text>尬酒提醒</text> </view>
				<view class="content_text"> <text>您当前没有订单，请先在酒吧下单后\n进行尬酒邀约。</text> </view>
				<view class="awkward_pop">
					<view class="cancel_btn" @tap="close"> <text>取消</text> </view>
					<view class="awkward_btn" @tap="tapGoClub"> <text>去下订单</text> </view>
				</view>
			</view>
			<view class="awkward_info" v-else>
				<view class="title_text"> <text>拼享提醒</text> </view>
				<view class="content_text"> <text>您当前没有订单，请先在酒吧下单后\n进行拼享邀约。</text> </view>
				<view class="awkward_pop">
					<view class="cancel_btn" @tap="close"> <text>取消</text> </view>
					<view class="awkward_btn" @tap="tapGoClub"> <text>去下订单</text> </view>
				</view>
			</view>
		</common-pop>
	</view>
</template>

<script>
	import commonPop from '@/components/pop/pop.vue'
	export default{
		props:{
			mode:{
				type:String,
				default:'invite'
			}
		},
		components:{
			commonPop
		},
		data() {
			return {
				tipsStyle: {
					'top': '30%'
				},
				show:false,
			}
			
		},
		methods:{
			tapGoClub(){
				this.$emit('goClub')
				this.close()
			},
			open(){
				this.show = true
			},
			close(){
				this.show = false
			},
		}
		
	}
</script>

<style lang="scss" scoped>
	.awkward_info{
		width: calc(100% - 160rpx);
		margin-left: 80rpx;
		background: #FFFFFF;
		position: relative;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		padding: 30rpx;
		.awkward_icon{
			height: 245rpx;
			width: 284rpx;
			position: absolute;
			top: -122rpx;
		}
		.title_text{
			font-size: 36rpx;
			color: #000000;
			font-weight: 500;
		}
		.content_text{
			font-size: 30rpx;
			color: #666666;
			margin-top: 22rpx;
			line-height: 50rpx;
			text-align: center;
			margin-top: 56rpx;
		}
		.awkward_pop{
			width: 100%;
			margin-top: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.cancel_btn{
				width: 254rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border: 1px solid #F22BB8;
				color: #F22BB8;
				border-radius: 40rpx;
			}
			.awkward_btn{
				width: 254rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background: $uni-button-color;
				color: #FFFFFF;
				border-radius: 40rpx;
			}
		}
	}
</style>
