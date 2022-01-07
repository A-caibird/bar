<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="个性背景" title-size="36" title-color="#FFFFFF"
			:background="{'background': '#191C3F'}" :border-bottom="false">
		</u-navbar>
		<view class="intro_box">
			<image class="bg_img" :src="bgImg || '/static/imgs/personalDynamic/dynamic_bgimg.png'" mode="aspectFill"></image>
			<view class="btn_text" @tap="$u.debounce(replaceTap, 800, true)">替换</view>
		</view>
	</view>
</template>

<script>
	var btnAvaliable = true;
	export default {
		data() {
			return {
				info: "",
				introText: '',
				bgImg:''
			}
		},
		onLoad(options) {
			this.info = JSON.parse(options.info);
			this.introText = this.info.personalProfile;
		},
		methods:{
			replaceTap(){
				console.log('替换');
				if(!btnAvaliable){
					this.$u.toast('请勿重复提交');
					return
				}
				btnAvaliable = false;
				this.select_photo();
			},
			//选择图片
			select_photo: function() {
				// console.log(e)
				let vm = this
				uni.chooseImage({
					count: 1, //默认9
					success: function(res) {
						// console.log(res.tempFilePaths)
						uni.showLoading({
							title: '上传中'
						})
						vm.upImg(res)
					},
					fail(e) {
						console.log(e);
						btnAvaliable = true;
					}
				});
			},
			//执行完上传，隐藏提示
			async upImg(res) {
				await this.uploadImg(res);
				btnAvaliable = true;
				uni.hideLoading()
			},
			//上传图片
			uploadImg: function(res) {
				return new Promise((resolve, reject) => {
					let vm = this
					//判断上传的图片数量有没有超过9张
					var filePath = res.tempFilePaths[i]
					vm.$u.api.uploadFile(filePath).then(url => {
						vm.bgImg = url
						resolve()
					}).catch(e => {
						console.log(e);
						btnAvaliable = true
						uni.hideLoading();
						reject()
					})
			
				})
			},
		}
	}
</script>

<style lang="scss">
	.intro_box {
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx 30rpx;

		.bg_img{
			width: 100%;
			height: 370rpx;
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
