<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="个性背景" title-size="36" title-color="#FFFFFF"
			:background="{'background': '#16192B'}" :border-bottom="false">
		</u-navbar>
		<view class="intro_box">
			<image class="bg_img"@tap="$u.throttle(chooseTap)"  :src="bgImg || '/static/imgs/personalDynamic/dynamic_bgimg.png'" mode="aspectFill"></image>
			<view class="btn_text" @tap="$u.debounce(replaceTap, 800, true)">确定</view>
		</view>
	</view>
</template>

<script>
	var btnAvaliable = true;
	import photoUtils from '@/mixins/photo.js'
	export default {
		data() {
			return {
				info: "",
				introText: '',
				bgImg:'',
				
			}
		},
		mixins:[photoUtils],
		onLoad(options) {
			this.info = JSON.parse(options.info);
			this.bgImg = this.info.background;
		},
		methods:{
			setImg(e){
				this.bgImg = e;
			},
			chooseTap(){
				if(!btnAvaliable){
					this.$u.toast('请勿重复提交');
					return
				}
				btnAvaliable = false;
				this.select_photo();
			},
			replaceTap(){
				this.replaceBackImg(this.bgImg);
			},
			//选择图片
			select_photo: function() {
				let vm = this
				vm.$u.route('/pages/cut-avatar/cut-avatar',{
					width: 345,
					height: 185
				})
			},
			//执行完上传，隐藏提示
			async upImg(res) {
				var url = await this.uploadImg(res);
				this.bgImg = url;
				btnAvaliable = true;
				uni.hideLoading()
			},
			//上传图片
			uploadImg: function(res) {
				return new Promise((resolve, reject) => {
					let vm = this
					//判断上传的图片数量有没有超过9张
					var filePath = res.tempFilePaths[0];
					console.log(filePath);
					this.sCompressImg(filePath).then(rs => {
						console.log(rs);
						let path = rs.tempFilePath;
						vm.$u.api.uploadFile(path).then(url => {
							resolve(url)
						}).catch(e => {
							console.log(e);
							btnAvaliable = true
							uni.hideLoading();
							reject()
						})
					}).catch(e => {
						btnAvaliable = true
						uni.hideLoading();
						reject()
					})
			
				})
			},
			
			// 更换图片背景
			replaceBackImg(url){
				this.$u.api.replaceBackImgAPI({
					background: url,
				}).then(res => {
					console.log(res);
					this.bgImg = url;
					uni.$emit('personal-info-refresh');
					this.$u.toast('更改成功');
					setTimeout(() => {
						uni.navigateBack({
							delta:1
						})
					}, 1200)
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
