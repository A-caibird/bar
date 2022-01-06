<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" title="开票" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="form_box">
				<view class="form_label">
					<view class="label_left">
						<view class="line"></view>
						<view class="label_text">基本资料</view>
					</view>
				</view>
				<commonInput v-model="form.invoice" label='发票抬头' placeholder="请填写发票抬头" :isArrow="false"></commonInput>
				<commonInput v-model="form.invoiceType" @select="selectPicker('bill')" label='发票类型' placeholder="请选择发票类型" :isArrow="true">
				</commonInput>
				<commonInput v-model="form.creditCode" label='社会信用代码' placeholder="请填写社会信用代码" :isArrow="false"></commonInput>
				<commonInput v-model="form.accountBankName" label='开户银行名称' placeholder="请填写开户银行名称" :isArrow="false">
				</commonInput>
				<commonInput v-model="form.basicAccountNumber" label='开户账号' placeholder="请填写开户账号" :isArrow="false">
				</commonInput>
				<commonInput v-model="form.registeredPlaceAddress" label='注册场所地址' placeholder="请填写注册场所地址" :isArrow="false"></commonInput>
				<commonInput v-model="form.registeredLandline" label='固定电话' placeholder="请填写固定电话" :isArrow="false"></commonInput>
				<commonInput v-model="form.email" label='发送邮箱' placeholder="请填写发送邮箱" :isArrow="false"></commonInput>
			</view>
			<u-picker v-model="billPickerShow" mode="selector" :range="billTypeList" range-key="label" @confirm="pickerConfirm" @cancel="billPickerShow = false"></u-picker>

			<view class="submit_btn" @tap="$u.throttle(submitTap)"> <text>确定提交</text> </view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	import {
		billTypeList
	} from '@/common/selector.js'
	import commonInput from '@/components/common-input/common-input.vue'
	export default {
		data() {
			return {
				billPickerShow: false,
				billType: '', //发票类型值
				billTypeList:billTypeList,
				orderId:'',
				form: {
					invoice: "", //发票抬头
					invoiceType: "", //发票类型(增值税普通发票，增值税专用发票)
					creditCode: "", //统一社会信用代码
					accountBankName: "", //开户银行名称
					basicAccountNumber: "", //基本开户账号
					registeredPlaceAddress: "", //注册场所地址
					registeredLandline: "", //注册固定电话
					email: "" //发送邮箱
				}
			}
		},
		components: {
			commonInput
		},
		onLoad: function(options) {
			this.orderId = options.orderId;
		},
		methods: {
			pickerConfirm(e){
				console.log(e);
				this.billType = billTypeList[e[0]].value;
				this.form.invoiceType = billTypeList[e[0]].label;
			},
			selectPicker(type){
				if(type == 'bill') this.billPickerShow = true;
			},
			async submitTap(){
				var params = this.form;
				let judgeResult = this.judgeParam(params);
				if(judgeResult){
					params['orderId'] = this.orderId;
					var {code} = await this.creatOrderBill(params);
					if(parseInt(code) == 0){
						this.$u.toast('开票成功')
						setTimeout(() => {
							uni.$emit('yao-order-detail-refresh');
							uni.navigateBack({
								delta:1
							})
						}, 1200)
					}else{
						console.log(code);
					}
				}else{
					return;
				}
			},
			judgeParam(params){
				//增值税普通发票必填：发票抬头，统一社会信用代码, 邮箱
				// 增值税专用发票： 全部必填
				let billType = this.billType;
				if(!billType){
					this.$u.toast('请选择发票类型')
					return false
				}else{
					for(var key in params){
						if(!params[key]){
							var text = "";
							if(billType == 'professional'){
								console.log(key);
								text = this.getTips(key);
								if(text){
									this.$u.toast(text);
								}
								return false
							}
							if(billType == 'normal' && (key == 'invoice' || key == 'creditCode' || key == 'email')){
								console.log(key);
								text = this.getTips(key);
								if(text){
									this.$u.toast(text);
								}
								return false;
							}
						}
					}
				}
				return true;
			},
			getTips(key){
				let text = ""
				switch(key) {
					case 'invoice': text = "请填写发票抬头";break;
					case 'creditCode': text = "请填写社会信用代码";break;
					case 'accountBankName': text = "请填写开户银行名称";break;
					case 'basicAccountNumber': text = "请填写开户账号";break;
					case 'registeredPlaceAddress': text = "请填写注册场所地址";break;
					case 'registeredLandline': text = "请填写固定电话";break;
					case 'email': text = "请填写发送邮箱";break;
					default: text="";break;
				}
				return text;
			},
			async creatOrderBill(params){
				return this.$u.api.creatOrderBillAPI(params);
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

			.submit_btn {
				height: 100rpx;
				width: 100%;
				margin-top: 40rpx;
				background: $uni-button-color;
				text-align: center;
				line-height: 100rpx;
				color: #FFFFFF;
				font-size: 30rpx;
			}
		}
	}
</style>
