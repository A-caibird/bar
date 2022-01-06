<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="个人设置" title-size="36" title-color="#FFFFFF" :background="{'background': '#191C3F'}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="info-box">
			<view class="info-box-item">
				<text style="line-height: 80rpx;">头像</text>
				<view class="info-box-right" @tap="$u.throttle(getHeadImg)">
					<image class="head-img" :src="avatar" mode=""></image>
					<image class="arrow-img" src="/static/imgs/common/right.png" mode=""></image>
				</view>
			</view>
			<view class="info-box-item">
				<text>昵称</text>
				<view class="info-box-right">
					<u-input v-model="nickName" @blur="changeNickName()" :focus="false" type="text" :clearable="false" input-align="right"
					 height="40" :custom-style="{'color':'#FFFFFF'}" />
				</view>
			</view>
			<view class="info-box-item">
				<text>性别</text>
				<view class="info-box-right">
					<text>{{sex}}</text>
				</view>
			</view>
			<view class="info-box-item">
				<text>出生年月</text>
				<view class="info-box-right" @click=" showBirthday = true">
					<text>{{birthday}}</text>
					<u-picker v-model="showBirthday" mode="time" :params="timeObj" :default-time="this.birthday" @confirm="changeBirthday"></u-picker>
					<image class="arrow-img" src="/static/imgs/common/right.png" mode=""></image>
				</view>
			</view>
			<view class="info-box-item" @tap="showProvice = !showProvice">
				<text>地区</text>
				<view class="info-box-right">
					<text>{{areaName}}</text>
					<u-select v-model="showProvice" value-name="id" label-name="name"  :list="proviceList" @confirm="proviceC"></u-select>
					<u-select v-model="showCity" value-name="id" label-name="name"  :list="cityList" @confirm="cityC"></u-select>
					<image class="arrow-img" src="/static/imgs/common/right.png"></image>
				</view>
			</view>
			<view class="info-box-item" @tap="$u.debounce(goIntro, 400, true)">
				<text>简介</text>
				<view class="info-box-right">
					<view class="text">{{info.personalProfile}}</view>
					<image class="arrow-img" src="/static/imgs/common/right.png" mode=""></image>
				</view>
			</view>
			<view class="info-box-item">
				<text>个性签名</text>
				<view class="info-box-right">
					<u-input v-model="signature" @blur="changeSignature()" type="textarea" :clearable="false" input-align="right"
					 height="70" :custom-style="{'color':'#FFFFFF','font-size':'28rpx'}" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {provice} from '@/common/city.js'
	export default {
		data() {
			return {
				showBirthday: false,
				avatar: "/static/imgs/register/male_a.png",
				nickName: "",
				signature: '',
				birthday: "",
				sex:'',
				timeObj: {
					year: true,
					month: true,
					day: true,
					timestamp: true
				},
				areaName:'',
				
				showProvice:false,
				proviceList:provice,
				showCity:false,
				cityList:[],
				info:""
			}
		},
		onLoad:function(){
			this.load();
			uni.$on('upload-avatar',this.uploadAvatarHandler)
			uni.$on('personal-info-refresh',this.handlePersonalInfoRefresh)
		},
		onUnload() {
			uni.$off('upload-avatar',this.uploadAvatarHandler)
			uni.$off('personal-info-refresh',this.handlePersonalInfoRefresh)
		},
		methods: {
			goIntro(){
				this.$u.route('/pages/mine/personalSetting/intro', {info: JSON.stringify(this.info)})
			},
			load(){
				this.getMyInfo();
			},
			handlePersonalInfoRefresh(){
				this.getMyInfo();
			},
			uploadAvatarHandler(e){
				console.log(e)
				this.avatar = e.avatar
				this.changeAvatar()
			},
			async cityC(e){//选择城市
				console.log(e)
				let {code} = await this.$u.api.changeAreaApi({areaId:e[0].value})
				if (parseInt(code) == 0) {
					this.getMyInfo()
					this.$u.toast('修改成功');
					uni.$emit('personal-info-refresh')				} 
			},
			async proviceC(e){//选择省
				console.log(e)
				let {code,data} = await this.$u.api.getLowerCitys(e[0].label)
				if(parseInt(code) == 0) {
					this.cityList = data.areaList
					this.showCity = true
				} 
			},
			
			
			// 个人信息
			getMyInfo: async function(){
				let {code,data} = await this.$u.api.getMyInfo()
				if(code==0) {
					let info = data.info
					this.info = data.info;
					this.avatar = info.avatar;
					this.nickName = info.nickName;
					this.sex = info.sex;
					this.birthday = info.birthday;
					this.signature = info.signature
					this.areaName = info.areaName
				}
				
			},
			//获取头像地址 之后 修改头像
			getHeadImg: function() {
				let vm = this
				uni.chooseImage({
					count: 1, //默认9
					success: (res) => {
						vm.$u.route('/pages/cut-avatar/cut-avatar',{
							pic:res.tempFilePaths[0]
						})
						// const filePath = res.tempFilePaths[0]
						// // console.log(filePath);
						// uni.showLoading({
						// 	title: '上传中'
						// })
						// vm.$u.api.uploadFile(filePath).then(url => {
						// 	console.log(res);
						// 	this.avatar = url;
						// 	this.$nextTick(function() {
						// 		this.changeAvatar()
						// 		uni.hideLoading();
						// 	})
						// }).catch(e => {
						// 	console.log(e);
						// 	uni.hideLoading();
						// })
					}
				});
			},
			//修改头像
			changeAvatar: function() {
				let params = {
					"avatar": this.avatar
				}
				if (!params.avatar) {
					this.$u.toast("上传的头像不得为空");
				}
				this.$u.api.changeAvatarApi(params).then(res => {
					let code = res.code;
					if (parseInt(code) == 0) {
						this.$u.toast('修改成功');
						uni.$emit('personal-info-refresh')

					} 
				}).catch(e => {
					console.log(e)
				})
			},
			//修改昵称
			changeNickName: function() {
				let params = {
					"nickName": this.nickName,
				}
				if (!params.nickName) {
					this.$u.toast("修改的昵称不得为空");
				}

				this.$u.api.changeNickNameApi(params).then(res => {
					let code = res.code;
					if (parseInt(code) == 0) {
						this.$u.toast('修改成功');
						uni.$emit('personal-info-refresh')

					} 
				}).catch(e => {
					console.log(e)
				})
			},
			//修改出生年月
			async changeBirthday(e) {
				console.log(e)
				let oldTime = this.birthday
				let birthday = e.year + '-' + e.month + '-' + e.day
				let params = {
					birthday: birthday,
				}
				console.log(oldTime)
				console.log(birthday)
				if (oldTime === birthday) {
					return this.$u.toast("前后日期一致，无需修改");
				}

				let {code} = await this.$u.api.changeBirthdayApi(params)
				if (code == 0) {
					this.$u.toast('修改成功');
					uni.$emit('personal-info-refresh')
				
				}
			},

			//修改个性签名
			changeSignature: function(e) {
				console.log(e);
				let params = {
					"signature": this.signature,
				}
				this.$u.api.changeSignatureApi(params).then(res => {
					let code = res.code;
					if (parseInt(code) == 0) {
						this.$u.toast('修改成功');
						uni.$emit('personal-info-refresh')
					} 
				}).catch(e => {
					console.log(e)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;
		padding: 0 30rpx;

		.info-box {
			display: flex;
			flex-direction: column;
			padding-top: 25rpx;

			.info-box-item {
				display: flex;
				justify-content: space-between;
				// align-items: center;
				color: #FFFFFF;
				font-size: 30rpx;
				padding-bottom: 25rpx;
				padding-top: 25rpx;

				.info-box-right {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					width: 50%;
					.text{
						max-width: 300rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.head-img {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}

					.arrow-img {
						width: 12rpx;
						height: 20rpx;
						padding-left: 34rpx;
					}
				}
			}
		}

		textarea {
			color: #FFFFFF;
		}

		input {
			color: #FFFFFF;
		}

	}
</style>
