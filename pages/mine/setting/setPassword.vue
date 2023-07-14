<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#ffffff" :title="title" title-size="36" title-color="#FFFFFF" :background="{ background: '#16192B' }"
			 :border-bottom="false"></u-navbar>
			<view class="password-kind">
				<text>{{passwordTypeText}}</text>
			</view>
			<view class="first_part">
				<view class="pay_input" @tap="showKeyboard = true">
					<message-input :breathe="false" lineColor="#FFFFFF" fontColor="#FFFFFF" :dotFill="true" v-model="password" :bold="false" :disabled-keyboard="true" font-size="50"
					 activeColor="#FFFFFF" inactiveColor="#FFFFFF" :maxlength="6" width="90" height="100"></message-input>
				</view>
			</view>
			<view class="bd"></view>
			<view class="save_btn">
				<button type="default" :class="{'active': btnActive}" @tap="$u.throttle(setHandle, 600)">保存</button>
			</view>
			<view class="input_box" v-if="showKeyboard">
				<keyboard-package ref="number"  @onInput="changeHandle" @onDelete="backspaceHandle" :disableDot="true"/>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import messageInput from '@/components/self-message-input/self-message-input.vue'
	export default {
		data() {
			return {
				oldPayPassword: '',
				newPayPassword: '',
				repeatPassword: '',
				password: '',
				passwordType: 'newPayPassword',
				showKeyboard: false,
				title:'设置支付密码',
				type:'',
				phone:'',
				code:''
			}
		},
		components: {
			messageInput
		},
		computed: {
			btnActive: function() {
				if (this.newPayPassword && this.repeatPassword) {
					return true;
				} else {
					return false;
				}
			},
			passwordTypeText:function(){
				if(this.passwordType == 'oldPayPassword'){
					return '请输入旧支付密码'
				}else if (this.passwordType == 'newPayPassword'){
					return '请输入新支付密码'
				}else if (this.passwordType == 'repeatPassword'){
					return '请再次输入'
				}
			}
		},
		watch:{
			password:function(val){
				if(this.passwordType != 'repeatPassword'){
					if(val.length == 6){
						this.password = ''
					}
				}

			}
		},
		onLoad:function(options){
			let type = options.type;
			this.type = type;
			if(type=='forget') {
				this.title = '重置支付密码'
			}
			if(type == 'modify'){
				this.title = '修改支付密码'
				this.phone = options.phone;
				this.code = options.code;
			}
		},
		methods: {
			setHandle: function() {
				let params = {
					// oldPayPassword: this.oldPayPassword,
					newPayPassword: this.newPayPassword,
				}

				if (!params.newPayPassword || !this.repeatPassword) {
					this.$u.toast('请将信息填写完整');
					return
				}
				
				if (params.newPayPassword != this.repeatPassword && this.repeatPassword != '') {
					this.password = ''
					this.newPayPassword = ''
					this.repeatPassword =''
					this.passwordType = 'newPayPassword'
					this.$u.toast('两次密码不一致，请重新输入新支付密码')
					return;
				}
				console.log('设置当前密码')
				this.setNewPayPassword(params.newPayPassword);
				
			},
			//设置新支付密码
			setNewPayPassword: function(newPayPassword) {
				let params = {
					"newPayPassword": newPayPassword, //密码
				}
				let apiMethod  = "";
				if(this.type == 'forget'){
					apiMethod = this.$u.api.forgetPayPasswordApi(params)
				}
				if(this.type == 'modify'){
					params = {
						"newPayPassword": newPayPassword, //密码
						phone: this.phone,
						code: this.code,
					}
					apiMethod = this.$u.api.changePayPasswordApi(params);
				}
				if(!apiMethod) return;
				apiMethod.then(res => {
					let code = res.code;
					if (parseInt(code) == 0) {
						this.$u.toast("设置支付密码成功");
						setTimeout(() => {
							this.$u.route({
								type:'back',
								delta:1,
							})
						}, 800);
					} else {
						this.$u.toast(res.msg);
						this.password = ''
						this.newPayPassword = ''
						this.repeatPassword =''
						this.passwordType = 'newPayPassword'
						console.log("错误失败")
					}
					this.getPasswordInputTimes();
				}).catch(e => {
					console.log(e)
				})
			},
			changeHandle: function(e) {
				this.password = this.password + e;
				if (this.passwordType == 'oldPayPassword') {
					this.oldPayPassword = this.password
					if (this.oldPayPassword.length == 6) {
						this.passwordType = 'newPayPassword'
						
					}
				} else if (this.passwordType == 'newPayPassword') {
					this.newPayPassword = this.password
					if (this.newPayPassword.length == 6) {
						this.password = ''
						this.passwordType = 'repeatPassword'
					}
				} else if (this.passwordType == 'repeatPassword') {
					this.repeatPassword = this.password
				}
			},
			backspaceHandle: function() {
				let password = this.password;
				password = password.substring(0, password.length - 1);
				this.password = password;
				if(this.passwordType == 'oldPayPassword'){
					this.oldPayPassword = this.password
				}else if(this.passwordType == 'newPayPassword'){
					this.newPayPassword = this.password
				}else if(this.passwordType == 'repeatPassword'){
					this.repeatPassword = this.password
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.first_part {
		margin: 59rpx 30rpx 33rpx 30rpx;
	}

	.item {
		margin-top: 48rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&>text {
			font-size: 30rpx;
			color: #ffffff;
		}


	}

	.bd {
		margin-top: 33rpx;
		width: 750rpx;
		height: 1rpx;
		border: 1rpx solid #31345b;
	}
	.password-kind{
		width: 100%;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;
		padding-top: 50rpx;
	}
	.item2 {
		margin-top: 23rpx;
		margin-left: 30rpx;

		&>text {
			font-size: 30rpx;
			color: #ffffff;
		}
	}

	.save_btn {
		margin-left: 30rpx;
		margin-right: 30rpx;
		margin-top: 33rpx;

		&>button {
			width: 690rpx;
			height: 90rpx;
			background: #82799B;
			font-size: 30rpx;
			color: #FFFFFF;
			line-height: 90rpx;
			border-radius: 49px;

			&.active {
				background: $uni-button-color;
			}
		}
	}

	.input_box {
		position: absolute;
		bottom: 0rpx;
		background: #FFFFFF;
		width: 100%;
		z-index: 10;
	}
</style>
