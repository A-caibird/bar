<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="举报" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="middle_box">
			<view class="report_list">
				<block v-for="(info, index) in reportList" :key="index">
					<view class="common_report" @tap="selectReport(index)">
						<image src="/static/imgs/common/select.png" v-if="index == selectIndex "></image>
						<image src="/static/imgs/common/no-select.png" v-else></image>
						<text>{{info.value}}</text>
					</view>
				</block>
			</view>
			<view class="other_reason">
				<textarea :disabled="selectIndex != 5" v-model="content" placeholder="请输入其它理由"></textarea>
			</view>
			<view class="submit_btn" @tap="$u.throttle(submitReport)"> <text>提交</text> </view>
		</view>
	</view>
</template>

<script>
	 import {reportList} from '@/common/selector.js'
	export default{
		data() {
			return {
				reportList: reportList,
				content: '',
				selectIndex: 0,
				id: '',
			}
		},
		onLoad:function(options){
			let id = options.id;
			this.id = options.id;
		},
		methods:{
			selectReport: function(index){
				this.selectIndex = index;
				// if(index != 5){
				// 	this.content = "";
				// }
			},
			// 提交举报
			submitReport: function(){
				let value = this.reportList[this.selectIndex].value
				let params = {
					id: this.id,
					content: value != '其它' ? value : this.content
				};
				this.$u.toast('感谢您的举报，我们会尽快处理~');
				setTimeout(() => {
					uni.navigateBack();
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.middle_box{
		.report_list{
			width: 100%;
			box-sizing: border-box;
			padding: 30rpx;
			.common_report{
				width: 100%;
				display: flex;
				align-items: center;
				height: 80rpx;
				&>image{
					height: 36rpx;
					width: 36rpx;
				}
				&>text{
					font-size: 30rpx;
					color: #FFFFFF;
					margin-left: 30rpx;
				}
			}
		}
		.other_reason{
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			border-radius: 10rpx;
			background: #2C3158;
			margin-top: 10rpx;
			padding: 30rpx;
			box-sizing: border-box;
			&>textarea{
				height: 200rpx;
				width: 100%;
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}
		.submit_btn{
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			margin-top: 40rpx;
			border-radius: 46rpx;
			background: $uni-button-color;
			color: #FFFFFF;
		}
	}
</style>
