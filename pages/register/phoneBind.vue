<template>
	<view class="container">
		<view class="header_box">
			<u-navbar back-icon-color="#FFFFFF" title="绑定手机号" title-color="#FFFFFF" :border-bottom="false" :background="{'backgroundColor': '#16192B'}"></u-navbar>
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
					<view class="input_box code">
						<input type="number" v-model="code" placeholder-class="placeholder" placeholder="请输入验证码" />
					</view>
					<view class="code_panel">
						<view class="line"></view>
						<view class="code_view">
							<view class="code_text" @tap="getCode">{{tips}}</view>
							<u-verification-code @change="codeChange" ref="uCode" :seconds="seconds" start-text="获取验证码" end-text="再次获取" change-text="Xs"></u-verification-code>
						</view>
					</view>
				</view>
				<view class="form_item_panel">
					<view class="input_box">
						<input v-model="password" placeholder-class="placeholder" placeholder="请输入密码" />
					</view>
				</view>
			</view>
			<view class="register_btn" :class="{'active':buttonActive}" @tap="tapBind"> <text>立即绑定</text> </view>
		</view>
	</view>
</template>

<script>
	import login from '@/utils/login/index.js'
	export default {
		data() {
			return {
				phone: '',
				password: '',
				code: '',
				tips: '',
				seconds: 60,
				openId:'',
				wechatNickName:'',
			}
		},
		computed:{
			buttonActive: function(){
				if(this.phone && this.code && this.password){
					return true;
				}
				else{
					return false;
				}
			}
		},
		onLoad(opt) {
			this.openId = opt.openId
			this.wechatNickName = opt.wechatNickName
		},
		methods: {
			async wxBindPhone(params) {
				let {code,data} = await this.$u.api.wxBindPhoneApi(params)
				if(code==0) {
					console.log(data)
					login(data)
				}
			},
			async tapBind(){
				if (!this.$u.test.mobile(this.phone)) {
					this.$u.toast('请输入正确的手机号');
					return
				}
				if(this.code=='') return this.$u.toast('请输入验证码')
				if(this.password=='') return this.$u.toast('请输入密码')
				await this.$toast.confirm('','确定要绑定该手机号码？')
				this.wxBindPhone({
					openId:this.openId,
					wechatNickName:this.wechatNickName,
					phone:this.phone,
					password:this.password,
					code:this.code,
					clientId:plus.push.getClientInfo().clientid,
				})
			},
			clearPhone: function(){
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
				console.log(params)
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
						console.log(res);
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
			.register_btn{
				width: 100%;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background: #82799B;
				color: #FFFFFF;
				font-size: 32rpx;
				border-radius: 46rpx;
				margin-top: 30rpx;			
				&.active{
					background: $uni-button-color;
				}
			}
		}
	}
</style>
