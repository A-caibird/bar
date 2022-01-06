<template>
	<u-popup
		v-model="show"
		:mask="true"
		mode="center"
		zIndex="10000"
	>
		<view class="awkward_info">
			<view  class="title_text"> <text>填写赠送数量</text> </view>
			<view class="content_input">
				<input v-model="sendNum" type="digit" class="input" placeholder-style="color: #A7A7B5" placeholder="输入赠送数量"  />
			</view>
			<view class="awkward_pop">
				<view class="cancel_btn" @tap="close"> <text>取消</text> </view>
				<view class="awkward_btn" @tap="submit"> <text>确认</text> </view>
			</view>
		</view>
	</u-popup>
	
</template>

<script>
	export default{
		props:{
			
		},
		components:{
		},
		data() {
			return {
				show:false,
				
				sendNum:'',
				
			}
		},
		methods:{
		
			open(){
				this.show = true
			},
			close(){
				this.show = false
			},
			submit(){
				if(!( /^[0-9]*[1-9][0-9]*$/.test(this.sendNum))){
					return this.$toast.text('请输入正整数')
				}
				this.$emit('confirm',this.sendNum)
				this.close()
			},
		}
		
	}
</script>

<style lang="scss" scoped>
	.awkward_info{
		background: #FFFFFF;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		padding: 46rpx 30rpx 30rpx 30rpx;
		
		.title_text{
			font-size: 36rpx;
			color: #000000;
			font-weight: 500;
		}
		.content_input{
			width: 100%;
			height: 90rpx;
			border: 4rpx;
			background: #F9F9F9;
			margin-top: 40rpx;
			font-weight: 400;
			.input{
				width: 100%;
				height: 90rpx;
				box-sizing: border-box;
				padding: 0 30rpx;
				font-size: 28rpx;
			}
		}
		.awkward_pop{
			width: 100%;
			margin-top: 56rpx;
			display: flex;
			align-items: center;
			
			.cancel_btn{
				margin-right: 40rpx;
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
