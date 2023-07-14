<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="实名认证" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
			 :border-bottom="false">

			</u-navbar>
		</view>
		<view class="tip-box" v-if="!hasVerified">
			<view class="tip-title">
				<image src="/static/imgs/mine/tips.png" mode=""></image>
				<text>温馨提醒</text>
			</view>
			<view class="tip-content">
				<text>你的实名认证信息将用于完成必要安全检查，以提升你的账号安全性。证件信息绑定后将不能修改，请填写本人实名信息，如非本人实名将无法提现，账号丢失也将无法找回账号</text>
			</view>
		</view>
		<view class="input-box">
			<view class="info-name">
				<text>真实姓名</text>
				<u-input v-model="realName" :disabled="hasVerified" type="text" :border="false" input-align="right" :custom-style="{'font-size':'30rpx','color':'#FFFFFF'}"
				 :clearable="false" placeholder="请填写你的真实姓名" placeholder-style="font-size:30rpx;color:#B4B2CF" />
			</view>
			<view class="info-idnum">
				<text>身份证号</text>
				<block v-if="hasVerified">
					<text>{{hideIdCard(identityNumber)}}</text>
				</block>
				<block v-else>
					<u-input v-model="identityNumber" type="text" :border="false" input-align="right" :custom-style="{'font-size':'30rpx','color':'#FFFFFF'}"
					 :clearable="false" placeholder="请填写你的身份证号码" placeholder-style="font-size:30rpx;color:#B4B2CF" />
				</block>
				
			</view>
			<button v-if="!hasVerified" type="default" :class="{'active': btnActive}" @tap="$u.throttle(submitHandle)">确认提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				realName: '',
				identityNumber: '',
				hasVerified: false,
			}
		},
		computed:{
			btnActive: function() {
				if (this.realName && this.identityNumber) {
					return true;
				} else {
					return false;
				}
			}
		},
		onLoad(opt) {
			this.hasVerified = opt.hasVerified=='verify'?true:false
			if(this.hasVerified) {
				this.getIdentityNumberRealName()
			}
		},
		methods:{
			async getIdentityNumberRealName(){
				let {code,data} = await this.$u.api.getIdentityNumberRealNameApi({})
				if(code==0) {
					let {identityNumber,realName} = data
					this.identityNumber = identityNumber
					this.realName = realName
				}
			},
			submitHandle:function(){
					let params = {
						"realName":this.realName,
						"identityNumber": this.identityNumber,
					}
					
					let realNameCheck = this.$u.test.chinese(params.realName)
					let identityNumberCheck = this.$u.test.idCard(params.identityNumber)
								
					if(!realNameCheck){
						this.$u.toast('请输入真实姓名')
						return;
					}
					if(!identityNumberCheck){
						this.$u.toast('请输入正确的身份证号')
						return;
					}	
					this.$u.api.verifiedApi(params).then(res => {
						var code = res.code;
						if(parseInt(code) == 0){
							uni.$emit('setAuthentication')
							this.$u.route({
								type:'back',
								delta:1,
							})
							this.$u.toast('实名认证成功')
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
		.header-box {
			padding-bottom: 10rpx;

		}

		.tip-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 710rpx;
			height: 231rpx;
			background-color: #2C3158;
			border-radius: 10px;
			margin: 0 20rpx;

			.tip-title {
				display: flex;
				align-items: center;
				font-size: 26rpx;
				color: #FFFFFF;
				padding: 0 30rpx;
				padding-bottom: 23rpx;

				image {
					width: 25rpx;
					height: 26rpx;
					padding-right: 9rpx;
				}
			}

			.tip-content {
				font-size: 24rpx;
				color: #FFFFFF;
				padding: 0 30rpx;
			}
		}

		.input-box {
			display: flex;
			flex-direction: column;
			font-size: 30rpx;
			color: #FFFFFF;
			padding: 0 30rpx;
			margin-top: 70rpx;

			.info-name {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 20rpx;
			}

			.info-idnum {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 113rpx;
			}

			&>button {
			width: 690rpx;
			height: 90rpx;
			background: #82799b;
			font-size: 30rpx;
			color: #ffffff;
			line-height: 90rpx;
			border-radius: 49px;
			&.active {
				background: $uni-button-color;
			}
			}
		}
	}
</style>
