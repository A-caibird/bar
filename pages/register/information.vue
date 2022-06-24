<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" title="填写信息" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#191C3F'}"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="avatar_panel">
				<block v-if="avatar">
					<image class="avatar_img" :src="avatar"  @tap="getHeadImg"></image>
				</block>
				<block v-else>
					<view class="avatar_box" @tap="getHeadImg">
						<image src="/static/imgs/register/camera.png"></image>	
						<text>上传头像</text>
					</view>
				</block>
			</view>
			<view class="sex_box">
				<view class="sex_item_box" @tap="chooseHe">
					<view class="sex_icon" v-if="!maleChoose">
						<image  src="/static/imgs/register/male.png"></image>
					</view>
					<view class="sex_icon" v-if="maleChoose">
						<image  src="/static/imgs/register/male_a.png"></image>
					</view>
					<view class="sex_label">
						<image src="/static/imgs/register/male_icon.png"></image>
						<text>男生</text>
					</view>
				</view>
				<view class="sex_item_box" @tap="chooseShe">
					<view class="sex_icon" v-if="!femaleChoose">
						<image  src="/static/imgs/register/female.png"></image>
					</view>
					<view class="sex_icon" v-if="femaleChoose">
						<image  src="/static/imgs/register/female_a.png"></image>
					</view>
					<view class="sex_label">
						<image src="/static/imgs/register/female_icon.png"></image>
						<text>女生</text>
					</view>
				</view>

			</view>
			<view class="sex_tips"> <text>*性别决定后，不可改变</text> </view>
			<view class="common_line"></view>
			<view class="common_info">
				<view class="common_info_item">
					<view class="info_left">
						<view class="label"> <text>昵称</text> </view>
					</view>
					<view class="info_right">
						<view class="info_input">
							<input maxlength="8" v-model="nickName" type="text" placeholder-class="placeholder" placeholder="请填写昵称" />
						</view>
					</view>
				</view>
				<view class="common_info_item">
					<view class="info_left">
						<view class="label"> <text>出生日期</text> </view>
					</view>
					<view class="info_right" @click="show = true">
						<view class="info_input" style="width: calc(100% - 30rpx);">
							<u-picker v-model="show" mode="time" :params="timeObj" @confirm="confirm"></u-picker>
							<input :disabled="true" v-model="birthday" type="text" placeholder-class="placeholder" placeholder="请填写出生日期" />
						</view>
						<image class="right_icon" src="/static/imgs/common/right.png"></image>
					</view>
				</view>
				<view class="common_info_item">
					<view class="info_left">
						<view class="label"> <text>个人简介</text> </view>
					</view>
					<view class="info_right">
						<view class="info_input">
							<input maxlength="20" v-model="personalProfile" type="text" placeholder-class="placeholder" placeholder="请设置个人简介" />
						</view>
					</view>
				</view>
				<view class="common_info_item">
					<view class="info_left">
						<view class="label"> <text>个人签名</text> </view>
					</view>
					<view class="info_right">
						<view class="info_input">
							<input maxlength="20" v-model="signature" type="text" placeholder-class="placeholder" placeholder="请设置个人签名" />
						</view>
					</view>
				</view>
			</view>
			<!-- @tap="$u.route('pages/register/dynamic')"  下一步 跳转 -->
			<view class="next_btn" :class="{'active':buttonActive}" @tap="$u.throttle(registerHandle, 600)"> <text>下一步</text> </view>

		</view>
	</view>
</template>

<script>
	import login from '@/utils/login/index.js'
	export default {
		data() {
			return {
				show: false,
				maleChoose: false,
				femaleChoose: false,
				"avatar": "", //头像
				"sex": "", //性别
				"nickName": "", //昵称
				"birthday": "", //生日
				"signature": "", //个性签名
				"personalProfile": '', //个人简介
				timeObj: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false,
					timestamp: true
				},
				token:'',
				register: false,
			}
		},
		computed: {
			buttonActive: function() {
				if (this.avatar && this.sex && this.nickName && this.birthday && this.signature) {
					return true;
				} else {
					return false;
				}
			}
		},
		onLoad(opt) {
			console.log(opt)
			this.token = opt.token
			uni.$on('upload-avatar',this.uploadAvatarHandler)
			if(opt.register){
				this.register = true;
			}else{
				this.register = false;
			}
		},
		onUnload() {
			uni.$off('upload-avatar',this.uploadAvatarHandler)
		},
		methods: {
			uploadAvatarHandler(e){
				this.avatar = e.avatar
			},
			confirm: function(e) {
				let time = e.year + '-' + e.month + '-' + e.day
				this.birthday = time
			},
			getHeadImg: function() {
				let vm = this
				vm.$u.route('/pages/cut-avatar/cut-avatar')
			},
			chooseHe() {
				if (this.maleChoose === true) {
					this.femaleChoose = false
					this.sex = "男"
				} else {
					this.maleChoose = true
					this.femaleChoose = false
					this.sex = "男"
				}
			},
			chooseShe() {
				if (this.femaleChoose === true) {
					this.maleChoose = false
					this.sex = "女"
				} else {
					this.femaleChoose = true
					this.maleChoose = false
					this.sex = "女"
				}
			},
			registerHandle: function() {
				let defaultAvatar = 'https://patixiu.oss-cn-shanghai.aliyuncs.com/202112/20211201/default_avatar-20211201132703685.png';
				let params = {
					"avatar": this.avatar || defaultAvatar,
					"sex": this.sex,
					"nickName": this.nickName,
					"birthday": this.birthday,
					"signature": this.signature,
					"personalProfile": this.personalProfile,
					token:this.token,
				}
				if (!params.avatar) {
					this.$u.toast('请上传头像');
					return
				}
				if (!params.sex) {
					this.$u.toast('请选择性别');
					return
				}
				if (!params.nickName) {
					this.$u.toast('请填写昵称');
					return
				}
				if (!params.birthday) {
					this.$u.toast('请选择出生日期');
					return
				}
				if (!params.signature) {
					this.$u.toast('请设置个人签名');
					return
				}
				if (!params.personalProfile) {
					this.$u.toast('请设置个人简介');
					return
				}
				this.$u.api.fillInformationApi(params).then(res => {
					console.log(res)
					let code = res.code
					if (parseInt(code) == 0) {
						res.data.fillInformation = true
						login(res.data, this.register);
					} else {
						if(res.msg){
							this.$u.toast(res.msg);
						}else{
							this.$u.toast('请重试');
						}
					}
				}).catch(e => {
					console.log(e)
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: 100%;
		background: $uni-title-color;

		.middle_box {
			width: 100%;

			.avatar_panel {
				width: 100%;
				margin-top: 80rpx;
				.avatar_img{
					width: 200rpx;
					height: 200rpx;
					margin-left: calc(50% - 100rpx);
					border-radius: 50%;
				}
				.avatar_box {
					width: 200rpx;
					height: 200rpx;
					margin-left: calc(50% - 100rpx);
					background: #443963;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					color: #FFFFFF;
					border-radius: 6rpx;

					&>image {
						height: 42rpx;
						width: 52rpx;
					}

					&>text {
						font-size: 26rpx;
						color: #FFFFFF;
						margin-top: 26rpx;
					}
				}
			}

			.sex_box {
				width: 100%;
				margin-top: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;

				.sex_icon {
					&>image{
						height: 110rpx;
						width: 110rpx;
					}
				}

				.sex_label {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;

					&>image {
						height: 28rpx;
						width: 28rpx;
					}

					&>text {
						font-size: 28rpx;
						color: #FFFFFF;
						margin-left: 4rpx;
					}
				}
			}

			.sex_tips {
				width: 100%;
				font-size: 28rpx;
				color: #FF50C6;
				margin-top: 44rpx;
				text-align: center;
			}

			.common_line {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				height: 1px;
				background: #31345B;
				margin-top: 60rpx;
			}

			.common_info {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				margin-top: 20rpx;

				.common_info_item {
					width: 100%;
					height: 100rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.info_left {
						.label {
							font-size: 28rpx;
							color: #FFFFFF;
						}
					}

					.info_right {
						width: calc(100% - 300rpx);
						display: flex;
						align-items: center;

						.info_input {
							width: 100%;

							&>input {
								width: 100%;
								height: 70rpx;
								text-align: right;
								font-size: 28rpx;
								color: #FFFFFF;
							}
						}

						.right_icon {
							height: 22rpx;
							width: 14rpx;
							margin-left: 16rpx;
						}
					}
				}
			}

			.next_btn {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				margin-top: 80rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background: #82799B;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 46rpx;

				&.active {
					background: $uni-button-color;
				}
			}
		}
	}
</style>
