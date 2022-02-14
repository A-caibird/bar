<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="新增动态" title-size="36" title-color="#FFFFFF" :background="{'background': '#191C3F'}"
			 :border-bottom="false">

			</u-navbar>
		</view>
		<view class="input-box">
			<u-input v-model="textarea" type="textarea" placeholder="请输入你要发表的内容" height="250" :clearable="false" :auto-height="false"
			 :custom-style="{'font-size':'30rpx','color':'#FFFFFF'}"></u-input>
		</view>
		<view class="photo-box borderBottom">
			<view class="photo-text">
				<text class="text-left">上传照片</text>
				<text class="text-right">(最多提交9张图片)</text>
			</view>
			<view class="photo-area">
				<view class="photo-area-item" v-for="(item, index) in imgList" :key="index" @tap="previewTap(index)">
					<image @tap="deletePhoto(index)" class="delete_icon" src="/static/imgs/common/cancel.png" mode=""></image>
					<image :src="item.avatar" mode=""></image>
				</view>
				<view class="photo-area-select" @tap="$u.throttle(select_photo)" v-if="imgList.length<9">
					<image src="/static/imgs/discovery/photo_select.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="photo-box">
			<view class="photo-text">
				<text class="text-left">动态视频</text>
				<text class="text-right"></text>
			</view>
			<view class="photo-area">
				<view class="photo-area-item" v-for="(info, index) in videoList" :key="index">
					<image @tap="deleteVideoHandle(index)" class="delete_icon" src="/static/imgs/common/cancel.png" mode=""></image>
					<image class="play_icon" src="/static/imgs/common/play_icon.png" @tap="$u.debounce(videoPlayTap(index), 500, true)"></image>
					<image :src="info.imgUrl" mode=""></image>
				</view>
				<view class="photo-area-select" @tap="chooseVideoHandle" v-if="videoList.length == 0">
					<image src="/static/imgs/discovery/photo_select.png" mode=""></image>
				</view>
				<video :direction="0" @fullscreenchange="fullScreenChange" class="videoBox" v-if="playUrl" id="videoId" :src="playUrl"></video>
			</view>
		</view>
		<view class="location-box" @tap="$u.route('pages/discovery/location')" v-if="hasLocation">
			<view class="location-text">
				<text v-if="!locInfo.areaName">所在位置</text>
				<text v-else>{{locInfo.city +'·'+ locInfo.address}}</text>
			</view>
			<view class="location-arrow">
				<image src="/static/imgs/common/right.png" mode=""></image>
			</view>
		</view>
		<block v-else>
			<location-btn></location-btn>
		</block>
		<view class="publish-box">
			<view class="publish-text">
				<text class="text-left">发布即代表着你同意</text>
				<text class="agreement-text" @tap="$u.throttle(goArticle('protocol'))">《用户协议》</text>
			</view>
			<view class="btn" @tap="$u.throttle(publishDynamic)" :class="{'active': textarea || imgList.length > 0 || videoList.length > 0}" type="default">我要发布</view>
		</view>
		<!-- <view class="box" style="width: 100%; height: 180rpx; margin-top: 300rpx;">

		</view> -->
	</view>

</template>

<script>
	import location from '@/mixins/location.js';
	import photoMixins from '@/mixins/photo.js'
	var videoBtnAvaliabe = true;
	var app = getApp();
	export default {
		mixins: [location, photoMixins], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				playUrl: '',
				videoList:[],
				textarea: '',
				avatar: '',
				imgList: [],
				locInfo: {
					areaName: '',
					lng: '',
					lat: '',
					address: '',
					fullName:'',
					city:app.globalData.location.cityName,
				},
			}
		},
	
		onLoad: function() {
			this.load()
			uni.$on('updataLocation', this.handelUpdataLocation)
		},
		onUnload: function() {
			uni.$off('updataLocation', this.handelUpdataLocation)
		},
		methods: {
			previewTap:function(index){
				let urls = [];
				this.imgList.forEach((item, i) => {
					urls.push(item.avatar);
				})
				uni.previewImage({
					urls,
					current: index
				})
			},
			fullScreenChange(e){
				if(!e.detail.fullScreen){
					var videoContext = uni.createVideoContext("videoId", this);
					videoContext.stop()
					this.playUrl = "";
				}
			},
			videoPlayTap(index){
				this.playUrl = this.videoList[index].videoUrl;
				var vm = this;
				this.$nextTick(function(){
					var videoContext = uni.createVideoContext("videoId", vm);
					videoContext.requestFullScreen({
						direction: 0
					});
					videoContext.play()
				})
			},
			deleteVideoHandle(index){
				this.videoList.splice(index, 1);
			},
			chooseVideoHandle(){
				var vm = this;
				if(!videoBtnAvaliabe){
					return
				}
				uni.chooseVideo({
					compressed: true,
					maxDuration: 20,
					success(res) {
						let tempPath = res.tempFilePath;
						videoBtnAvaliabe = false;
						vm.$u.api.uploadVideo(tempPath).then(res => {
							console.log(res);
							var footerImgUrl = '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast';
							let info = {
								videoUrl: res,
								imgUrl: res + footerImgUrl
							}
							vm.videoList.push(info);
							videoBtnAvaliabe = true;
						}).catch(e => {
							console.log(e);
							videoBtnAvaliabe = true;
						})
					},
					fail(e){
						console.log(e);
					}
				})
			},
			handleUpdateLocationService(){
				this.updateLocationService(()=>{
					if(this.canLocation) {
						this.getLocation()
					}
				})
			},
			async load(){
				this.hasLocation = await this.getLocation()
			},
			handleLocation(res){
				if(this.locInfo.areaName!='') return  
				let {latitude,longitude,address} = res
				let areaName = `${address.province}${address.city}${address.district}${address.street}${address.streetNum}`
				let addressS = address.poiName
				this.locInfo.lng = longitude
				this.locInfo.lat = latitude
				this.locInfo.areaName = areaName
				this.locInfo.address = addressS
				this.locInfo.fullName =  `${address.province}${address.city}`
				this.locInfo.city =  app.globalData.location.cityName
			},
			handelUpdataLocation(e){
				console.log(e)
				let locationStr = e.location;
				this.locInfo.lng = locationStr.split(',')[0] || 0;
				this.locInfo.lat = locationStr.split(',')[1] || 0;
				this.locInfo.areaName = this.analysisAreaName(e)
				this.locInfo.fullName = this.analysisFullName(e)
				this.locInfo.address = e.name;
				this.locInfo.city =  app.globalData.location.cityName
			},
			
			publishDynamic: function() {

				let params = this.getParams();
				if((!params.content && this.imgList.length <= 0 && !params.videoUrl) ||!params.areaName) {
					this.$u.toast('请将信息补充完整');
					return
				}
				console.log(params)
				uni.showLoading({
					title: '发布中'
				})
				this.$u.api.publishDynamic(params).then(res => {
					var code=res.code;
					uni.hideLoading();
					if (parseInt(code) == 0) {
						// uni.$emit('dynamic-refresh',{msg:''})
						uni.$emit('dynamic-refresh-follow',{msg:''})
						this.$cross.applyPageMethod(this.$cross.beforePage(), 'goFind')
						this.$u.toast('发布成功')
						uni.navigateBack({
							delta:1
						})
						// this.$u.route({
						// 	type:'reLaunch',
						// 	url: '/pages/index/index',
						// 	params:{
						// 		current:'find-nearby'
						// 	}
						// })
					}
				}).catch(e => {
					uni.hideLoading();
					console.log(e);
				})
			},
			getParams: function() {
				var params = {
					"areaName": this.locInfo.fullName, //地区
					"lng": this.locInfo.lng, //经度
					"lat": this.locInfo.lat, //纬度
					"address": this.locInfo.address, //地址
					"content": this.textarea, //内容
					"videoUrl": this.videoList.length > 0 ? this.videoList[0].videoUrl : "", 
				}
				var imgList = this.imgList;
				imgList.forEach((item, index) => {
					let key = `imgList[${index}]`;
					params[key] = item.avatar;
				})
				return params;
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
							this.sCompressImg(filePath).then(rs => {
								let path = rs.tempFilePath;
								vm.uploadFileHandle(path).then(() => {
									resolve()
								}).catch(e=> {
									reject()
								})
							}).catch(e => {
								vm.uploadFileHandle(filePath).then(() => {
									resolve()
								}).catch(e=> {
									reject()
								})
							})
						}
					} else {
						//超过九张，判断还可以加入几张照片
						let remainLen = 9 - (vm.imgList).length
						for (let i = 0; i < remainLen; i++) {
							const filePath = res.tempFilePaths[i]
							console.log(filePath)
							this.sCompressImg(filePath).then(rs => {
								let path = rs.tempFilePath;
								vm.uploadFileHandle(path).then(() => {
									resolve()
								}).catch(e=> {
									reject()
								})
							}).catch(e => {
								vm.uploadFileHandle(filePath).then(() => {
									resolve()
								}).catch(e=> {
									reject()
								})
							})
						}
					}

				})
			},
			uploadFileHandle(filePath){
				var vm = this;
				return new Promise(function(resolve,reject){
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

<style lang="scss" scoped>
	.container {
		position: relative;
		padding: 0 30rpx;
		box-sizing: border-box;
		padding-bottom: 200rpx;
		.header-box {}
		.videoBox{
			position: fixed;
			left: 0rpx;
			top: 0rpx;
			z-index: -1;
			height: 100%;
			width: 100%;
			display: block;
		}
		.input-box {
			height: 265rpx;
			border-bottom: 1px solid #31345b;
			margin-top: 30rpx;
		}

		.photo-box {
			display: flex;
			flex-direction: column;
			&.borderBottom{
				border-bottom: 1px solid #31345b;
			}
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
					.play_icon{
						height: 100rpx;
						width: 100rpx;
						position: absolute;
						left: 55rpx;
						top: 55rpx;
						z-index: 10;
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

		.location-box {
			display: flex;
			justify-content: space-between;
			margin-top: 60rpx;

			.location-text {
				font-size: 28rpx;
				color: #FFFFFF;
			}

			.location-arrow {
				image {
					width: 15rpx;
					height: 20rpx;
				}
			}
		}

		.publish-box {
			position: fixed;
			left: 50%;
			transform: translate(-50%, 0);
			bottom: 30rpx;
			width: 100%;

			.btn {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
				border-radius: 45rpx;
				background: #82799B;
				color: #FFFFFF;
				margin-top: 40rpx;
				font-size: 30rpx;
			}

			.active {
				background: $uni-button-color;
			}

			.publish-text {
				display: flex;
				justify-content: center;

				.text-left {
					font-size: 22rpx;
					color: #9292BA;
				}

				.agreement-text {
					font-size: 22rpx;
					color: #FFFFFF;
				}
			}

			button {
				width: 690rpx;
				height: 90rpx;
				background: #82799b;
				border-radius: 49rpx;
				margin-top: 30rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				line-height: 90rpx;
			}
		}
	}
</style>
