<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="个性签名" title-size="36" title-color="#FFFFFF"
			:background="{'background': '#16192B'}" :border-bottom="false">
		</u-navbar>
		<view class="intro_box">
			<textarea class="textarea_box" placeholder="请输入个性签名" v-model="introText"></textarea>
			<view class="btn_text" @tap="$u.debounce(finishTap, 500, true)">完成</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: "",
				introText: '',
			}
		},
		onLoad(options) {
			this.info = JSON.parse(options.info);
			this.introText = this.info.signature;
		},
		methods:{
			finishTap(){
				if(!this.introText){
					this.$u.toast('请输入个性签名');
					return;
				}
				this.$u.api.changeSignatureApi({
					signature: this.introText,
				}).then(res => {
					uni.$emit('personal-info-refresh');
					uni.navigateBack({
						delta:1
					})
				}).catch(e => {
					console.log(e);
				})
			}
		}
	}
</script>

<style lang="scss">
	.intro_box {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 30rpx;

		.textarea_box {
			width: 100%;
			height: 400rpx;
			background: #20234b;
			box-sizing: border-box;
			padding: 20rpx;
			font-size: 30rpx;
			border-radius: 20rpx;
			color: #FFFFFF;
		}

		.btn_text {
			height: 90rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			margin-top: 80rpx;
			border-radius: 46rpx;
			background: linear-gradient(270deg, #BB0CF9, #F92FAF);
			color: #FFFFFF;
		}
	}
</style>
