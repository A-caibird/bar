<template>
	<view class="page-wrap">
		<view class="textarea_box">
			<textarea placeholder="请输入您的问题或反馈" v-model="content" placeholder-class="placeholder" maxlength="999"></textarea>
		</view>
		<view class="photo-box">
			<view class="photo-text">
				<text class="text-left">上传照片</text>
				<text class="text-right">(选填，最多提交9张图片)</text>
			</view>
			<view class="photo-area">
				<view class="photo-area-item" v-for="(item, index) in imgList" :key="index">
					<image @tap="deletePhoto(index)" class="delete_icon" src="/static/imgs/common/cancel.png" mode=""></image>
					<image :src="item.avatar" @tap="$u.throttle(previewImgList(imgList,index,'avatar'))"></image>
				</view>
				<view class="photo-area-select" @tap="select_photo" v-if="imgList.length<9">
					<image src="/static/imgs/discovery/photo_select.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="submit_btn" @tap="$u.throttle(tapSubmit)"> <text>提交</text> </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				imgList:[],
			}
		},
		onLoad(opt) {
			
		},
		methods: {
			async tapSubmit(){
				if(this.content=='') {
					return this.$toast.text('请输入问题描述！')
				}
				await this.$toast.confirm('','确定要提交该问题？')
				let params = {
					content:this.content
				}
				if(this.imgList.length>0) {
					let imgList = this.$u.deepClone(this.imgList);
					imgList.forEach((item, index) => {
						let key = `imgList[${index}]`;
						params[key] = item.avatar;
					})
				}
				let {code} = await this.$u.api.feedBackSaveApi(params)
				if(code==0) {
					this.$toast.text('提交成功！')
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},500)
				}
				
			},
			//选择图片
			select_photo: function(e) {
				// console.log(e)
				let vm = this
				uni.chooseImage({
					count: 9-(vm.imgList).length, //默认9
					success: function(res) {
						// console.log(res.tempFilePaths)
						uni.showLoading({
							title: '上传中'
						})
			
						vm.upImg(res)
			
					}
				});
			},
			//执行完上传，隐藏提示
			async upImg(res) {
				await this.uploadImg(res);
				uni.hideLoading()
			},
			//上传图片
			uploadImg: function(res) {
				return new Promise((resolve, reject) => {
					let vm = this
					//判断上传的图片数量有没有超过9张
					let len = (res.tempFilePaths).length + (vm.imgList).length
					if (len < 9) {
						for (let i = 0; i < (res.tempFilePaths).length; i++) {
							const filePath = res.tempFilePaths[i]
							console.log(filePath)
							vm.$u.api.uploadFile(filePath).then(url => {
								
								let obj = {};
								obj.avatar = url;
								vm.imgList.push(obj);
								console.log(vm.imgList)
								resolve()
							}).catch(e => {
								console.log(e);
								uni.hideLoading();
								reject()
							})
			
						}
			
					} else {
						//超过九张，判断还可以加入几张照片
						let remainLen = 9 - (vm.imgList).length
						for (let i = 0; i < remainLen; i++) {
							const filePath = res.tempFilePaths[i]
							console.log(filePath)
							vm.$u.api.uploadFile(filePath).then(url => {
								let obj = {};
								obj.avatar = url;
								vm.imgList.push(obj);
								console.log(vm.imgList)
								resolve()
							}).catch(e => {
								console.log(e);
								uni.hideLoading();
								reject()
							})
			
						}
					}
			
				})
			
			
			},
			
			//删除图片
			deletePhoto: function(e) {
				console.log(e)
				this.imgList.splice(e, 1)
			},
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
			.photo-box {
				display: flex;
				flex-direction: column;
			
				.photo-text {
					padding: 30rpx 0;
			
					.text-left {
						font-size: 32rpx;
						color: #FFFFFF;
					}
			
					.text-right {
						font-size: 28rpx;
						color: #72729E;
					}
				}
			
				.photo-area {
					display: flex;
					flex-wrap: wrap;
					padding: 15rpx 0;
			
					.photo-area-item {
						position: relative;
						padding-right: 30rpx;
						padding-bottom: 30rpx;
			
						&:nth-child(3n) {
							padding-right: 0;
						}
			
						.delete_icon {
							position: absolute;
							z-index: 2;
							top: -20rpx;
							transform: translateX(190rpx);
							width: 40rpx;
							height: 40rpx;
						}
			
						image {
							width: 210rpx;
							height: 210rpx;
						}
					}
			
					.photo-area-select {
						image {
							width: 210rpx;
							height: 210rpx;
						}
					}
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
