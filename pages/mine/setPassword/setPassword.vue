<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="设置登陆密码" title-size="36" title-color="#FFFFFF" :background="{'background': '#191C3F'}"
			 :border-bottom="false">

			</u-navbar>
		</view>
		<view class="input-box">
			<view class="info-name">
				<text>新密码</text>
				<u-input v-model="new_password" type="password" :border="false" input-align="right" 
				:custom-style="{'font-size':'30rpx','color':'#FFFFFF'}" :password-icon="false"
				 :clearable="false" placeholder="请输入新密码" placeholder-style="font-size:30rpx;color:#B4B2CF" />
			</view>
			<view class="info-idnum">
				<text>重复密码</text>
				<u-input v-model="repeat_password" type="password" :border="false" input-align="right" 
				:custom-style="{'font-size':'30rpx','color':'#FFFFFF'}" :password-icon="false"
				 :clearable="false" placeholder="请重复输入新密码" placeholder-style="font-size:30rpx;color:#B4B2CF" />
			</view>
			<button class="save_btn" :class="{'noSave': isSave}"  type="default" @tap="out" :disabled="isSave">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				new_password:'',
				repeat_password:'',
				isSave:'ture'
			}
		},
		watch:{
			repeat_password(res){
				if(res !== '' && res === this.new_password){
					this.isSave = false
				}else{
					this.isSave = true
				}
			}
		},
		methods:{
			out(){
				console.log("121")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
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

			.save_btn{
				width: 690rpx;
				height: 90rpx;
				background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
				border-radius: 49rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				line-height: 90rpx;
				&.noSave{
					width: 690rpx;
					height: 90rpx;
					background: #82799b;
					border-radius: 49rpx;
					font-size: 30rpx;
					color: #FFFFFF;
					line-height: 90rpx;
				}
			}
		}
	}
</style>
