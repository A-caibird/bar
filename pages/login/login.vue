<template>
	<view class="container">
		<view class="header_box">
			<view class="nav_box">
				<view class="back_panel" @tap="backTap">
					<u-icon name="home-fill" color="#FFFFFF" size="40" v-if="isHome"></u-icon>
					<u-icon name="arrow-left" color="#FFFFFF" size="44" v-else></u-icon>
				</view>
			</view>
			<view class="filter_panel"></view>
			<view class="sign_box">
				<image src="/static/imgs/common/icon.png"></image>
				<text>爬梯秀</text>
			</view>
		</view>
		<view class="middle_box">
			<view class="form_box">
				<view class="form_item_panel">
					<view class="input_box">
						<input type="number" v-model="phone" placeholder-class="placeholder" placeholder="请输入手机号码" />
					</view>
					<block v-if="phone">
						<image class="input_icon" src="/static/imgs/input/cancel.png" @tap="clearPhone"></image>
					</block>

				</view>
				<view class="form_item_panel">
					<view class="input_box" v-if="passwordLook">
						<input v-model="passText" class="password_input" type="text" placeholder-class="placeholder"
							placeholder="请输入密码" />
					</view>
					<view class="input_box" v-else>
						<input v-model="passText" class="password_input" type="password" placeholder-class="placeholder"
							placeholder="请输入密码" />
					</view>

					<block v-if="passwordLook">
						<image class="input_icon password" src="/static/imgs/input/look_open.png" @tap="toggleLook">
						</image>
					</block>
					<block v-else>
						<image class="input_icon password" src="/static/imgs/input/look_close.png" @tap="toggleLook">
						</image>
					</block>
				</view>
			</view>
			<view class="register_forget_box">
				<view class="register_text" @tap="$u.route('pages/register/index')"> <text>注册账户</text> </view>
				<view class="register_text" @tap="$u.route('pages/recoverPassword/recoverPassword')"> <text>忘记密码?</text>
				</view>
			</view>
			<view class="login_btn" :class="{'active': btnActive}" @tap="$u.throttle(loginHandle)"> <text>登录</text>
			</view>
			<view class="other_login" v-if="!isAppleAudit">
				<view class="login_decoration">
					<view class="line"></view>
					<view class="decoration_text">快捷登录</view>
					<view class="line"></view>
				</view>
				<view style="display:flex;flex-direction: row;">
					<view class="login_way">
						<!-- <view class="wechat_way" @tap="$u.route('pages/register/phoneBind')"> -->
						<view class="wechat_way" @tap="$u.throttle(tapWXLogin)">
							<image src="/static/imgs/common/wechat.png"></image>
							<text>微信登录</text>
						</view>
					</view>
					<view class="login_way">
						<!-- <view class="wechat_way" @tap="$u.route('pages/register/phoneBind')"> -->
						<view class="wechat_way" @tap="$u.throttle(phoneLogin)">
							<image src="/static/imgs/common/iphoneNumber.png"></image>
							<text>一键登录</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="protocol_view" @tap="isSelect=!isSelect">
			<view class="select">
				<image src="/static/imgs/common/select.png" v-if="isSelect"></image>
				<image src="/static/imgs/common/no-select.png" v-else></image>
			</view>
			<view class="text1">登录即代表着你同意</view>
			<view class="text2" @tap.stop="$u.throttle(goArticle('protocol'))">《爬梯秀用户协议》</view>
		</view>
	</view>
</template>

<script>
	import login from '@/utils/login/index.js'
	import appleAudit from '@/mixins/apple-audit.js'
	var app = getApp();
	export default {
		mixins: [appleAudit],
		data() {
			return {
				passwordLook: false,
				phone: '',
				passText: '',
				isSelect: false,
				options: "",
				isHome: false,
				deviceId: ''
			}
		},
		computed: {
			btnActive: function() {
				if (this.phone && this.passText && this.isSelect) {
					return true;
				} else {
					return false;
				}
			}
		},
		beforeCreate() {
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
			// #endif

		},
		onLoad: function(options) {
			if (options.data) {
				this.options = JSON.parse(decodeURIComponent(options.data))
				console.log(this.options);
			}
			if (options.register) {
				if (parseInt(options.register) == 1) {
					this.isHome = true;
				}
			}
		},
		methods: {
			backTap: function() {
				if (this.isHome) {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				} else {
					uni.navigateBack();
				}
			},
			async wxLogin(params) {
				uni.showLoading({
					title: '加载中'
				})
				let {
					code,
					data
				} = await this.$u.api.wxLoginApi(params)
				// console.log(data)
				uni.hideLoading();
				if (code == 0) {
					data['options'] = this.options;
					login(data, this.isHome);
				} else if (code == 1) { //未绑定手机
					this.$u.route('/pages/register/phoneBind', {
						openId: params.openId,
						wechatNickName: params.wechatNickName,
					})
				}
			},
			async phoneLogin(params) {
				uni.showLoading({
					title: '加载中'
				})
				let {
					code,
					data
				} = await this.$u.api.phoneLoginApi(params)
				// console.log(data)
				uni.hideLoading();
				if (code == 0) {
					data['options'] = this.options;
					login(data, this.isHome);
				}
			},
			tapWXLogin() {
				if (!this.isSelect) {
					this.$u.toast('请勾选爬梯秀用户协议') // 显示消息
					return;
				}
				let vm = this
				uni.login({
					provider: 'weixin',
					success: function(res) {
						// console.log(res);
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								// console.log(infoRes);

								let params = {
									openId: res.authResult.openid,
									wechatNickName: infoRes.userInfo.nickName,
									// #ifdef APP-PLUS
									clientId: plus.push.getClientInfo().clientid,
									// #endif
								}
								vm.wxLogin(params)
							},
							fail(err) {
								vm.$toast.text('微信登录失败！')
								console.log(err);
							}
						});
					},
					fail(err) {
						vm.$toast.text('微信登录失败！')
						console.log(err);
					}
				})
			},
			preLogin() {
				let vm = this;
				uni.preLogin({
					provider: 'univerify',
					success() { //预登录成功
						// 显示一键登录选项
					},
					fail(res) { // 预登录失败
						// 不显示一键登录选项（或置灰）
						// 根据错误信息判断失败原因，如有需要可将错误提交给统计服务器
						console.log(res.errCode)
						console.log(res.errMsg)
						vm.$u.toast('当前无法通过手机号一键登录，请检查您的手机SIM卡是否已安装')
					}
				})
			},
			phoneLogin() {
				if (!this.isSelect) {
					this.$u.toast('请勾选爬梯秀用户协议')
					return;
				}
				let vm = this;
				vm.preLogin();
				uni.login({ //正式登录，弹出授权窗
					provider: 'univerify',
					univerifyStyle: { // 自定义登录框样式
						"fullScreen": true, // 是否全屏显示，true表示全屏模式，false表示非全屏模式，默认值为false。
						"backgroundColor": "#ffffff", // 授权页面背景颜色，默认值：#ffffff 
						"phoneNum": {
							"color": "#2281F5", // 手机号文字颜色 默认值：#000000   
						},
						"authButton": {
							"normalColor": "#3479f5", // 授权按钮正常状态背景颜色 默认值：#3479f5  
							"highlightColor": "#2861c5", // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）  
							"disabledColor": "#73aaf5", // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）  
							"textColor": "#ffffff", // 授权按钮文字颜色 默认值：#ffffff  
							"title": "本机号码一键登录" // 授权按钮文案 默认值：“本机号码一键登录”  
						}
					},
					success(res) { // 正式登录成功
						console.log(res.authResult); // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
						// 在得到access_token后，通过callfunction调用云函数f
						uniCloud.callFunction({
							name: 'getPhoneNumber', // 云函数名称
							data: { //传给云函数的参数
								'access_token': res.authResult.access_token, // 客户端一键登录接口返回的access_token
								'openid': res.authResult.openid // 客户端一键登录接口返回的openid
							}
						}).then(
							data => {
								console.log("跳转到登录处理函数");
								vm.phone = data.result.phoneNumber;
								vm.passText = "12345"; //设置默认密码
								// vm.oneClickLogin();
								vm.loginHandle()
							})
					},
					fail(err) { // 正式登录失败
						vm.$toast.text('微信登录失败！')
						console.log(err);
						uni.closeAuthView() //关闭授权登录界面
					}
				})
			},
			getDeviceId() {
				let vm = this;
				uni.getSystemInfo({
					success: function(res) {
						console.log(res.deviceId);
						this.deviceId = res.deviceId;
					}
				})
			},
			oneClickLogin() {
				let vm = this;
				let params = {
					phone: vm.phone,
					clientld: vm.deviceId
				}
				vm.$u.api.oneClickLogin(params).then(data=>{
					console.log(JSON.stringify(data));
				})
				uni.closeAuthView() 
			},
			// 登录事件 $u.throttle() 节流防抖处理
			loginHandle: function() {
				let params = {
					phone: this.phone,
					password: this.passText,
					// #ifdef APP-PLUS
					clientId: plus.push.getClientInfo().clientid,
					// #endif
				}
				let phoneCheck = this.$u.test.mobile(params.phone)

				if (!phoneCheck) {
					this.$u.toast('请输入正确的手机号')
					return;
				}
				if (!params.password) {
					this.$u.toast('请输入密码')
					return;
				}
				if (!this.isSelect) {
					this.$u.toast('请勾选爬梯秀用户协议')
					return;
				}
				uni.showLoading({
					title: '加载中'
				})
				this.$u.api.phoneLoginApi(params).then(res => {
					uni.hideLoading();
					var code = res.code;
					if (parseInt(code) == 0) {
						login(res.data, this.isHome)
					}
					uni.closeAuthView();
				}).catch(e => {
					console.log(e)
					uni.hideLoading();
					uni.closeAuthView();
				})
			},
			// 清空手机号
			clearPhone: function() {
				this.phone = "";
			},
			// 是否显示密码
			toggleLook: function() {
				this.passwordLook = !this.passwordLook
			}
		}
	}
</script>

<style lang="scss" scoped>
	$backImg: "/static/imgs/common/login_header.png";

	.container {
		width: 100%;
		height: 100vh;
		background: $uni-title-color;

		.header_box {
			height: 432rpx;
			width: 100%;
			position: relative;
			padding-top: var(--status-bar-height);

			.nav_box {
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: flex-start;
				position: relative;
				z-index: 10;

				.back_panel {
					padding: 0rpx 24rpx;
					display: flex;
					align-items: center;
				}
			}

			.filter_panel {
				position: absolute;
				top: 0rpx;
				left: 0rpx;
				height: 100%;
				width: 100%;
				background-image: url($backImg);
				background-repeat: no-repeat;
				background-size: 100% 100%;
				background-origin: content-box
			}

			.sign_box {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				align-items: center;
				flex-direction: column;

				&>image {
					height: 142rpx;
					width: 142rpx;
				}

				&>text {
					font-size: 36rpx;
					color: #FFFFFF;
					margin-top: 20rpx;
				}
			}
		}

		.middle_box {
			width: calc(100% - 100rpx);
			margin-left: 50rpx;

			.form_box {
				width: 100%;

				.placeholder {
					color: #9292BA;
				}

				.form_item_panel {
					height: 100rpx;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #31345B;

					.input_box {
						height: 70rpx;
						width: calc(100% - 100rpx);

						&>input {
							width: 100%;
							height: 100%;
							font-size: 32rpx;
							color: #FFFFFF;
						}

						.password_input {
							width: 100%;
							height: 100%;
							font-size: 32rpx;
							color: #FFFFFF;
							background: $uni-title-color;
							border: 0rpx;
						}
					}

					.input_icon {
						height: 30rpx;
						width: 30rpx;

						&.password {
							height: 28rpx;
							width: 36rpx;
						}
					}
				}
			}

			.register_forget_box {
				height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				color: #FFFFFF;
			}

			.login_btn {
				width: 100%;
				height: 90rpx;
				color: #FFFFFF;
				line-height: 90rpx;
				text-align: center;
				background: #82799B;
				border-radius: 46rpx;
				margin-top: 20rpx;

				&.active {
					background: $uni-button-color;
				}
			}

			.other_login {
				width: 100%;
				margin-top: 120rpx;

				.login_decoration {
					display: flex;
					align-items: center;
					justify-content: center;

					.line {
						width: 80rpx;
						height: 2rpx;
						background: #474A6D;
					}

					.decoration_text {
						font-size: 26rpx;
						color: #FFFFFF;
						margin: 0 30rpx;
					}
				}

				.login_way {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 34rpx;

					.wechat_way {
						display: flex;
						align-items: center;
						flex-direction: column;

						&>image {
							height: 80rpx;
							width: 80rpx;
						}

						&>text {
							font-size: 26rpx;
							color: #FFFFFF;
							margin-top: 10rpx;
						}
					}
				}
			}
		}

		.protocol_view {
			position: fixed;
			bottom: 0rpx;
			width: 100%;
			line-height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 26rpx;

			.select {
				width: 26rpx;
				height: 26rpx;
				margin-right: 10rpx;
				@include flex-center();

				image {
					width: 100%;
					height: 100%;
				}
			}

			.text1 {
				color: #9292BA;
			}

			.text2 {
				color: #FFFFFF;
			}
		}
	}
</style>