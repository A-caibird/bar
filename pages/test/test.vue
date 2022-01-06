<template>
	<view class="page-wrap">
		<view class="textarea_box">
			<textarea placeholder="请输入您的问题或反馈" v-model="content" placeholder-class="placeholder"></textarea>
		</view>
		<view class="submit_btn"> <text>提交</text> </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
			}
		},
		onLoad(opt) {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.page-wrap {
			 min-height: 100%;
			 padding: 30rpx;
			.textarea_box{
				padding: 30rpx 30rpx 0;
				height: 300rpx;
				background: #2C3158;
				border-radius: 10rpx;
				.placeholder {
					color: #9292BA;
				}
				&>textarea{
					width: 100%;
					height: 100%;
					font-size: 28rpx;
					color: #FFFFFF;
					
					
				}
			}
			.submit_btn{
				height: 90rpx;
				@include flex-center();
				margin-top: 40rpx;
				border-radius: 46rpx;
				background: $uni-button-color;
				color: #FFFFFF;
			}
		}
	}
		
</style>
