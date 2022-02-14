<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" title="填写应聘信息"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="recruitment_info">
				<view class="common_line">
					<view class="line_left first">
						<text>{{jobInfo.name}}</text>
					</view>
					<view class="line_right first">
						<text>{{jobInfo.monthlySalary}}</text>
					</view>
				</view>
				<view class="common_line" style="margin-top: 14rpx;">
					<view class="line_right second">
						<text>招聘 {{jobInfo.recruitsNumber}}人</text>
					</view>
					<view class="line_left second">
						<text>{{jobInfo.salaryComposition}}</text>
					</view>
					
				</view>
			</view>
			<u-gap bgColor="#20234B" height="20"></u-gap>
			<view class="form_box">
				<view class="form_label">
					<view class="label_left">
						<view class="line"></view>
						<view class="label_text">基本资料</view>
					</view>
				</view>
				<commonInput v-model="formInfo.name" label='姓名' placeholder="请填写姓名" :isArrow="false"></commonInput>
				<commonInput type="number" v-model="formInfo.phone" label='手机号' placeholder="请填写手机号" :isArrow="false"></commonInput>
				<commonInput :isArrow="true" @select="selectPicker('sex')" v-model="picker.sex.value" label='性别' placeholder="请选择性别"></commonInput>
				<!-- <commonInput :isArrow="true" @select="selectPicker('birthday')" v-model="picker.birthday.value" label='生日'
				 placeholder="请选择生日"></commonInput> -->
				<commonInput type="number" v-model="formInfo.age" label='年龄' placeholder="请填写年龄" :isArrow="false"></commonInput>
				<commonInput type="digit" v-model="formInfo.height" label='身高(cm)' placeholder="请填写身高" :isArrow="false"></commonInput>
				<commonInput type="digit" v-model="formInfo.weight" label='体重(kg)' placeholder="请填写体重" :isArrow="false"></commonInput>
			</view>
			<u-gap bgColor="#20234B" height="10"></u-gap>
			<view class="person_img_box">
				<view class="upload_box">
					<view class="upload_label">
						<view class="label_line" style="height: 80rpx;">
							<view class="line"></view>
							<view class="label_text">个人形象照片</view>
						</view>
						<view class="tips_line">
							<text style="font-size: 28rpx; color: #72729E;">(必填,最多提交9张图片)</text>
						</view>
					</view>
					<view class="img_list">
						<block v-for="(info, index) in imgList" :key="index">
							<view class="common_img" :class="{'right': ( (index + 1) % 3 != 0)}">
								<image class="img" :src="info.avatar"></image>
								<image @tap="deleteHandle(index)" class="cancel_icon" src="/static/imgs/common/cancel.png"></image>
							</view>
						</block>
						<view class="common_img" @tap="chooseHandle" v-if="imgList.length<9">
							<image class="img" src="/static/imgs/common/upload.png"></image>
							<!-- <image class="cancel_icon" src="/static/imgs/common/cancel.png"></image> -->
						</view>
					</view>
				</view>
			</view>
			<u-gap bgColor="#20234B" height="10"></u-gap>
			<view class="person_img_box">
				<view class="upload_box">
					<view class="upload_label">
						<view class="label_line" style="height: 80rpx;">
							<view class="line"></view>
							<view class="label_text">视频介绍</view>
						</view>
						<view class="tips_line">
							<text style="font-size: 28rpx; color: #72729E;">(选填)</text>
						</view>
					</view>
					<view class="img_list">
						<block v-for="(info, index) in videoList" :key="index">
							<view class="common_img" :class="{'right': ( (index + 1) % 3 != 0)}">
								<image class="img" :src="info.imgUrl"></image>
								<image class="play_icon" src="/static/imgs/common/play_icon.png" @tap="$u.debounce(videoPlayTap(index), 500, true)"></image>
								<image @tap="deleteVideoHandle(index)" class="cancel_icon" src="/static/imgs/common/cancel.png"></image>
							</view>
						</block>
						<view class="common_img" @tap="chooseVideoHandle" v-if="videoList.length == 0">
							<image class="img" src="/static/imgs/common/upload.png"></image>
							<!-- <image class="cancel_icon" src="/static/imgs/common/cancel.png"></image> -->
						</view>
						<video :direction="0" @fullscreenchange="fullScreenChange" class="videoBox" id="videoId" v-if="playUrl" :src="playUrl"></video>
					</view>
				</view>
			</view>
			<view class="person_intro">
				<view class="label_line" style="height: 100rpx;">
					<view class="line"></view>
					<view class="label_text">自我介绍</view>
				</view>
				<view class="textarea_box">
					<textarea v-model="formInfo.intro" placeholder="请填写你要介绍自己的话"></textarea>
				</view>
			</view>
			<view class="submit_btn" @tap="$u.throttle(applyJob)"> <text>确定提交</text> </view>
			<u-picker @confirm="pickerConfirm($event, 'sex')" mode="selector" v-model="picker.sex.sexShow" range-key="label" :default-selector="[picker.sex.index]" :range="picker.sex.array"></u-picker>
			<u-picker @confirm="pickerConfirm($event, 'birthday')" mode="time" v-model="picker.birthday.birthdayShow"  :params="params"></u-picker>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import {
		sexList
	} from '@/common/selector.js'
	import photoMixins from '@/mixins/photo.js'
	import commonInput from '@/components/common-input/common-input.vue'
	var videoBtnAvaliabe = true;
	export default {
		mixins: [photoMixins],
		data() {
			return {
				id: "",
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				picker: {
					sex: {
						value: '',
						array: sexList,
						sexShow: false,
						index:0,
					},
					birthday: {
						value:'',
						birthdayShow: false
					}
				},
				sexShow: false,
				formInfo: {
					name: '',
					height: '',
					weight: '',
					intro: '',
					phone:'',
					age: '',
				},
				jobInfo: {},
				videoList:[],
				playUrl: '',
			}
		},
		components: {
			commonInput
		},
		onLoad: function(options) {
			let id = options.id;
			this.id = id;
			this.getDetail();
			this.getMyInfo();
		},
		methods: {
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
			// 申请工作
			async applyJob() {
				let params = this.getParams();
				if (!params.name || !params.phone || !params.sex || !params.elevated || !params.bodyWeight || !params.selfIntroduction) {
					this.checkTips(params)
					return
				}
				if(this.imgList.length <= 0){
					this.$u.toast('请至少添加一张个人形象图片')
					return
				}
				uni.showLoading({
					title: '申请中'
				})
				let {code} = await this.$u.api.applyJob(params)
				uni.hideLoading()
				if (code == 0) {
					this.$toast.text('申请成功！') 
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},500)
				}
			},
			checkTips(params){
				var tips = "";
				for(var key in params){
					if(!params[key]){
						switch(key){
							case 'name': tips="请填写姓名";break;
							case 'phone': tips="请填写手机号";break;
							case 'sex': tips="请选择性别";break;
							case 'elevated': tips="请填写身高";break;
							case 'bodyWeight': tips="请填写体重";break;
							case 'selfIntroduction': tips="请填写自我介绍";break;
							default:break;
						}
						if(tips){
							this.$u.toast(tips);
							break;
						}
					}
				}
			},
			getParams: function() {
				let formInfo = this.formInfo;
				let params = {
					id: this.id,
					name: formInfo.name,
					phone: formInfo.phone,
					sex: this.picker.sex.value,
					age: this.formInfo.age,
					// birthday: this.picker.birthday.value,
					elevated: formInfo.height, //招聘人升高(m)
					bodyWeight: formInfo.weight, //招聘人体重(kg)
					selfIntroduction: formInfo.intro,
					videoUrl: this.videoList.length > 0 ? this.videoList[0].videoUrl : '',
				}
				let imgs = this.imgList;
				imgs.forEach((item, index) => {
					let key = `personalImagePhoto[${index}]`;
					params[key] = item.avatar;
				})
				return params
			},
			// 获取工作详情
			getDetail: async function() {
				let {code,data} = await this.$u.api.getJobDetail(this.id)
				this.jobInfo = data.recruitment
			},
			// 获取个人数据
			getMyInfo: async function() {
				let {code,data} = await this.$u.api.getMyInfo
				if(code==0) {
					this.picker.sex.value = data.info.sex;
					this.picker.birthday.value = data.info.birthday
					this.formInfo.name = data.info.name || ''
					this.formInfo.phone = data.info.phone;
				}
				
			},
			// 删除文件
			deleteHandle: function(index) {
				this.deletePhoto(index);
			},
			// 上传文件
			chooseHandle: function() {
				this.chooseImgs();
			},
			// 选择事件
			selectPicker: function(key) {
				this.picker[key][`${key}Show`] = true
			},
			pickerConfirm: function(e, key){
				
				if(key == 'sex'){
					let index = e[0];
					this.picker.sex.value = this.picker.sex.array[index].value;
					this.picker.sex.index = index;
				}
				if(key == 'birthday'){
					this.picker.birthday.value = e.year + '-' + e.month + '-' + e.day
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.label_line {
		width: 100%;
		display: flex;
		align-items: center;

		.line {
			height: 26rpx;
			width: 6rpx;
			background: #FF59C9;
		}

		.label_text {
			font-size: 28rpx;
			color: #FFFFFF;
			margin-left: 10rpx;
		}
	}

	.container {
		width: 100%;

		.middle_box {
			width: 100%;

			.recruitment_info {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				padding: 30rpx 0rpx;
				box-sizing: border-box;

				.common_line {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.line_left {
						&.first {
							font-size: 36rpx;
							color: #FFFFFF;
						}

						&.second {
							font-size: 26rpx;
							color: #A8A8CE;
						}
					}

					.line_right {
						&.first {
							font-size: 30rpx;
							color: #FFFFFF;
						}

						&.second {
							font-size: 26rpx;
							color: #FFFFFF;
						}
					}
				}
			}

			.form_box {
				width: 100%;
				box-sizing: border-box;
				padding: 0 30rpx;

				.form_label {
					height: 110rpx;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #31345B;

					.label_left {
						display: flex;
						align-items: center;
						height: 110rpx;

						.line {
							height: 26rpx;
							width: 6rpx;
							background: #FF59C9;
						}

						.label_text {
							font-size: 28rpx;
							color: #FFFFFF;
							margin-left: 10rpx;
						}
					}
				}

				.common_form_item {
					width: 100%;
					height: 100rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.item_left {
						.item_label {
							font-size: 28rpx;
							color: #FFFFFF;
						}
					}

					.item_right {
						display: flex;
						align-items: center;

						.input_box {
							// height: 80rpx;
							width: 300rpx;

							&>input {
								width: 100%;
								height: 80rpx;
								text-align: right;
								font-size: 28rpx;
								color: #B4B2CF;
							}
						}

						.arrow {
							margin-left: 30rpx;
						}
					}
				}
			}

			.person_img_box {
				width: 100%;
				box-sizing: border-box;
				padding: 0 30rpx;

				.upload_box {
					width: 100%;
					margin-top: 32rpx;

					.upload_label {
						width: 100%;
						margin-bottom: 24rpx;
						font-size: 32rpx;
						color: #FFFFFF;
					}
					.videoBox{
						position: fixed;
						left: 0rpx;
						top: 0rpx;
						z-index: -1;
						height: 100%;
						width: 100%;
						opacity: 0;
					}
					.img_list {
						width: 100%;
						display: flex;
						align-items: center;
						flex-wrap: wrap;

						.common_img {
							height: 210rpx;
							width: 210rpx;
							position: relative;
							margin-bottom: 30rpx;

							&.right {
								margin-right: 30rpx;
							}

							.img {
								height: 100%;
								width: 100%;
							}
							.play_icon{
								height: 100rpx;
								width: 100rpx;
								position: absolute;
								left: 50%;
								top: 50%;
								transform: translate(-50%, -50%);
							}
							.cancel_icon {
								height: 40rpx;
								width: 40rpx;
								position: absolute;
								right: -20rpx;
								top: -20rpx;
							}
						}
					}
				}
			}

			.person_intro {
				width: 100%;
				box-sizing: border-box;
				padding: 0 30rpx;
				padding-bottom: 50rpx;

				.textarea_box {
					height: 255rpx;
					width: 100%;
					border-bottom: 1px solid #31345B;
					box-sizing: border-box;
					padding: 30rpx;
					background: #2C3158;
					border-radius: 10rpx;

					&>textarea {
						height: 100%;
						width: 100%;
						font-size: 26rpx;
						color: #FFFFFF;
					}
				}
			}

			.submit_btn {
				height: 100rpx;
				width: 100%;
				background: $uni-button-color;
				text-align: center;
				line-height: 100rpx;
				color: #FFFFFF;
				font-size: 30rpx;
			}
		}
	}
</style>
