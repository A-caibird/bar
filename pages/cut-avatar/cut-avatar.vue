<template>
	<view>
		<tui-picture-cropper :lockRatio="true" :imageUrl="imageUrl" @ready="ready" @cropper="cropper" :width="width" :height="height" ></tui-picture-cropper>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				pic:'',
				imageUrl: '', //要裁剪的图片
				lockRatio: true, //锁定比例
				edgeColor: '#6138CB', //边缘线颜色
				startCutting: 0, //开始裁剪
				rotateAngle: 0, //旋转角度
				lockWidth: false, //裁剪框宽度锁定
				lockHeight: false, //裁剪框高度锁定
				disableRotate: true, //是否禁用触摸旋转 组件默认是true
				limitMove: true, //是否限制移动范围(剪裁框只能在图片内,为true不可触摸转动图片)
				width: '',
				height: '',
			}
		},
		onLoad(options) {
			this.pic = options.pic
			this.width = options.width ? parseInt(options.width) : 300;
			this.height = options.height ? parseInt(options.height) : 300;
		},
		methods:{
			ready(){
				this.imageUrl = this.pic
			},
			async cropper(e) {
				// e.url 需要预览的图片http链接列表
				console.log(this.imageUrl)
				console.log(e)
				let avatar = await this.$u.api.uploadImg(e.url)
				let beforePage = this.$cross.beforePage();
				console.log(beforePage.route);
				if(beforePage.route == 'pages/mine/personalSetting/personalBg'){
					this.$cross.applyPageMethod(beforePage, 'setImg', avatar);
				}else{
					uni.$emit('upload-avatar',{avatar:avatar})
				}
				this.$u.route({
					type:'back',
				})
			},
		},
		
	}
</script>

<style scoped lang="scss">
.btn-container{
	width: 100%;
	height: 180rpx;
	background-color: #4A4A4A;
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
	color: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 100;
	>view{
		width: 128rpx;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 28rpx;
		border: 2rpx solid #fff;
		text-align: center;
		margin-top: 20rpx;
	}
	.btn-back{
		margin-left: 30rpx;
		border: none;
	}
	.btn-confirm{
		margin-right: 30rpx;
	}
}
</style>
