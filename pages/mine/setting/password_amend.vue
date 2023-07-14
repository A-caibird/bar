<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" title="密码修改" title-size="36" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#16192B'}"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="form_box">
				<view class="form_item_panel">
					<view class="input_box">
						<input type="number" disabled="" v-model="phone" placeholder-class="placeholder" placeholder="请输入手机号码" />
					</view>
				</view>
				<view class="form_item_panel">
					<view class="input_box code">
						<input type="number" v-model="code" placeholder-class="placeholder" placeholder="请输入验证码" />
					</view>
					<view class="code_panel">
						<view class="line"></view>
						<view class="code_view">
							<view class="code_text" @tap="getCode">{{tips}}</view>
							<u-verification-code @change="codeChange" ref="uCode" :seconds="seconds" start-text="获取验证码" end-text="再次获取"
							 change-text="Xs"></u-verification-code>
						</view>
					</view>
				</view>
				<view class="form_item_panel">
					<view class="input_box">
						<input type="password" v-model="newPassword" placeholder-class="placeholder" placeholder="请新输入密码" />
					</view>
				</view>
				<view class="form_item_panel">
					<view class="input_box">
						<input type="password" v-model="repeatPassword" placeholder-class="placeholder" placeholder="请再次输入新密码" />
					</view>
				</view>
			</view>
			<view class="register_btn" :class="{'active':buttonActive}" @tap="$u.throttle(setHandle, 600)"> <text>确认</text>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp()
	export default {
		data() {
			return {
				phone: app.globalData.userInfo.phone,
				newPassword: '',
				repeatPassword: '',
				code: '',
				tips: '',
				seconds: 60
			}
		},
		computed: {
			buttonActive: function() {
				if (this.phone && this.code && this.newPassword && this.repeatPassword) {
					return true;
				} else {
					return false;
				}
			}
		},
		methods: {
			// 确认修改按钮
			setHandle: function() {
				// this.$u.route('pages/register/information')
				let params = {
					"newPassword": this.newPassword, //密码
				}
				let phoneCheck = this.$u.test.mobile(this.phone)
				if (!phoneCheck) {
					this.$u.toast('请输入正确的手机号')
					return;
				}
				if (!this.code) {
					this.$u.toast('请输入验证码')
					return;
				}
				if (params.newPassword != this.repeatPassword && params.newPassword != '') {
					this.$u.toast('两次密码不一致，请修改');
					return
				}

				this.$u.api.changePasswordApi(params).then(res => {
					let code = res.code;

					if (parseInt(code) == 0) {
						this.$u.route({
							type:'back',
							delta:1,
						})
						this.$u.toast('修改密码成功');
					}
				}).catch(e => {
					console.log(e)
				})

			},
			// 清除手机号
			clearPhone: function() {
				this.phone = "";
			},
			// 验证码提示
			codeChange(text) {
				this.tips = text;
			},
			getCode: function() {
				let params = {
					"phone": this.phone, //手机号
				}
				if (!this.$u.test.mobile(params.phone)) {
					this.$u.toast('请输入正确的手机号');
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码',
					})
					this.$u.api.registerCodeApi(params).then(res => {
						console.log(res)
						if(res.code==0) {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}
						
						
					}).catch(e => {

					})
				} else {
					this.$u.toast('验证码发送中');
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background: $uni-title-color;

		.middle_box {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			padding-top: 20rpx;

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
							font-size: 30rpx;
							color: #FFFFFF;
						}

						&.code {
							width: calc(100% - 200rpx);
						}
					}

					.code_panel {
						max-width: 200rpx;
						height: 42rpx;
						display: flex;
						align-items: center;

						.line {
							height: 24rpx;
							width: 2rpx;
							background: #FFFFFF;
						}

						.code_view {
							margin-left: 34rpx;
							color: #FFFFFF;
							width: 180rpx;
							line-height: 40rpx;
							text-align: center;
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

			.register_btn {
				width: 100%;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background: #82799B;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 46rpx;
				margin-top: 30rpx;

				&.active {
					background: $uni-button-color;
				}
			}

			.protocol_view {
				width: 100%;
				line-height: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 22rpx;

				.text1 {
					color: #9292BA;
				}

				.text2 {
					color: #FFFFFF;
				}
			}
		}
	}
</style>
