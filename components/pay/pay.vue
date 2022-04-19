<template>
	<view class="pay_box" v-if="show">
		<view class="mask" @tap="closeTap"></view>
		<view class="confirm_box">
			<view class="first_line">
				<view class="close_icon" @tap="closeTap">
					<u-icon name="close"></u-icon>
				</view>
				<text>请输入支付密码</text>
			</view>
			<view class="price_info">
				<text>{{titleText}}</text>
				<text v-if="mode=='pay'">{{allAmount}}{{unitText}}</text>
				<text v-else>￥{{allAmount}}</text>
			</view>
			<view class="pay_input">
				<message-input :disabledKeyboard="true" :breathe="canInput" :dotFill="true" v-model="password" :bold="false" font-size="50" active-color="#CCCCCC" inactive-color="#CCCCCC" :maxlength="6" width="90" height="100"></message-input>
			</view>
			<view class="tips" v-if="inputTimes > 0">目前还有{{inputTimes}}次输入机会</view>
			<view class="tips red" v-else>密码已被锁定，请重置支付密码</view>
			<!-- <view class="btn" @tap="$u.throttle(tapEmitPay)"> <text>支付</text> </view> -->
		</view>
		<view class="input_box" v-if="canInput">
			<keyboard-package  ref="number"  @onInput="changeHandle" @onDelete="backspaceHandle" @onConfirm="handleConfirm" :disableDot="true" :showConfirm="false"/>
		</view>
	</view>
</template>

<script>
	import messageInput from '@/components/self-message-input/self-message-input.vue'
	export default{
		props:{
			mode:{
				type:String,
				default:'pay'
			},
			unitText: {
				type:String,
				default:'酒币'
			},
			fillPassword: {
				type: Boolean,
				default: true
			}
		},
		components:{
			messageInput
		},
		data() {
			return {
				show: false,
				password: '',
				allAmount:'',
				inputTimes: 0,
			}
		},
		computed:{
			canInput(){
				if(this.inputTimes > 0){
					return true;
				}else{
					return false
				}
			},
			titleText(){
				let str = ''
				switch (this.mode){
					case 'pay':
						str = '支付'
						break;
					case 'cashOut':
						str = '提现'
						break;
					default:
						break;
				}
				return str
			},
		},
		methods:{
			async open(allAmount){
				await this.judgePayCode()
				this.allAmount = allAmount
				if(this.fillPassword){
					this.password = getApp().globalData.payPassword ? getApp().globalData.payPassword : (this.$storage.getPayPassword() || "")
				}else{
					this.password = "";
				}
				this.show = true
				this.getInputTimes();
			},
			getInputTimes(){
				console.log('刷新 inputTimes')
				this.inputTimes = getApp().globalData.passwordInputTimes;
				if(this.inputTimes <= 0){
					setTimeout(() => {
						this.close();
						uni.navigateTo({
							url: '/pages/mine/setting/amend'
						})
					}, 1600)
				}
			},
			subInputTimes(){
				this.inputTimes = this.inputTimes - 1;
				this.password = "";
			},
			close(){
				this.show = false
			},	
			tapEmitPay(){
				if(this.password.length<6) return
				this.close()
				this.$emit('pay',{password:this.password})
			},
			closeTap: function(){
				this.close()
			},
			handleConfirm(){
				if(this.password.length==6) {
					this.$emit('pay',{password:this.password})
					this.close()
				} 
			},
			changeHandle: function(e){
				if(this.password.length<6) {
					this.password = this.password + e;
					if(this.password.length == 6){
						// this.handleConfirm();
						this.$emit('pay',{password:this.password})
					}
				}
			},
			backspaceHandle:function(){
				let password = this.password;
				password = password.substring(0, password.length - 1);
				this.password = password;
			}
		}
	}
</script>

<style lang="scss">
	.pay_box{
		.mask{
			height: 100%;
			width: 100%;
			position: absolute;
			z-index: 5;
			background: #0D0F28;
			opacity: 0.53;
		}
		position: fixed;
		height: 100%;
		width: 100%;
		top: 0rpx;
		left: 0rpx;
		z-index: 10001;
		.confirm_box{
			width: calc(100% - 100rpx);
			margin-left: 50rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			padding: 40rpx 30rpx;
			box-sizing: border-box;
			position: absolute;
			top: 14%;
			z-index: 10;
			.first_line{
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				.close_icon{
					position: absolute;
					left: 30rpx;
				}
				&>text{
					font-size: 36rpx;
					color: #333333;
				}
			}
			.price_info{
				display: flex;
				align-items: center;
				flex-direction: column;
				margin-top: 46rpx;
				&>text:first-child{
					color: #666666;
					font-size: 38rpx;
				}
				&>text:last-child{
					color: #666666;
					font-size: 50rpx;
				}
			}
			.pay_input{
				width: 100%;
				margin-top: 40rpx;
			}
			.tips{
				font-size: 24rpx;
				color: #999999;
				margin-top: 10rpx;
				&.red{
					color: red;
				}
			}
			.btn{
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				line-height: 90rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 34rpx;
				background: $uni-button-color;
				border-radius: 46rpx;
				margin-top: 30rpx;
			}
		}
		.input_box{
			position: absolute;
			bottom: 0rpx;
			background: #FFFFFF;
			width: 100%;
			z-index: 10;
		}
	}
</style>
