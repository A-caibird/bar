<template>
	<view class="invite_box" v-if="show">
		<common-pop :customStyle="tipsStyle" @click="close">
			<view class="invite_info" v-if="mode == 'awkward'">
				<image class="invite_icon" src="/static/imgs/common/invite_icon.png"></image>
				<view class="title_text"> <text>邀请尬酒</text> </view>
				<view class="content_text"> <text>您当前确定\n要邀请{{info.nickName}}尬酒么？</text> </view>
				<view class="invite_pop">
					<view class="cancel_btn" @tap="close"> <text>取消</text> </view>
					<view class="invite_btn"  @tap="tapYaoyue"> <text>我要尬酒</text> </view>
				</view>
			</view>
			<view class="invite_info" v-if="mode == 'share'">
				<image class="invite_icon" src="/static/imgs/common/invite_icon.png"></image>
				<view class="title_text"> <text>邀请拼享</text> </view>
				<view class="content_text"> <text>您当前确定\n要邀请{{info.nickName}}拼享么？</text> </view>
				<view class="invite_pop">
					<view class="cancel_btn"  @tap="close"> <text>取消</text> </view>
					<view class="invite_btn" @tap="tapPing"> <text>邀请拼享</text> </view>
				</view>
			</view>
		</common-pop>
	</view>
</template>

<script>
	import commonPop from '@/components/pop/pop.vue'
	export default{
		props:{
			mode: {
				type: String,
				default: 'awkward' // awkward: 尬酒, share：邀请
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
				
				info:{},
			}
		},
		methods:{
			tapYaoyue(){
				this.$emit('openOrderList',this.info)
				this.close()
				
			},
			tapPing(){
				this.$emit('openOrderList',this.info)
				this.close()
				
			},
			init(e){
				this.info = e
			},
			
			open(e){
				this.init(e)
				console.log(e)
				this.show = true
			},
			close(){
				this.show = false
			},
			
			
		}
		
	}
</script>

<style lang="scss" scoped>
	.invite_info{
		width: calc(100% - 160rpx);
		margin-left: 80rpx;
		background: #FFFFFF;
		position: relative;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		padding:  112rpx 30rpx 30rpx 30rpx;
		.invite_icon{
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
		}
		.invite_pop{
			width: 100%;
			margin-top: 70rpx;
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
			.invite_btn{
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
