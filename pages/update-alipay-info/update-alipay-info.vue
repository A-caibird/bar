<template>
	<view class="page-wrap">
		<u-navbar back-icon-color="#FFFFFF" :title="title" title-size="36" title-color="#FFFFFF" :background="{ background: '#16192B' }" :border-bottom="false"></u-navbar>
		<view class="msg_part">
			<text>真实姓名</text>
			<view class="part">
				<u-input v-model="aliAccountRealName" :custom-style="{'color':'#ffffff'}" type="text" placeholder="请输入真实姓名" />
			</view>
			<text>支付宝账号</text>
			<view class="part">
				<u-input v-model="aliAccount" :custom-style="{'color':'#ffffff'}" type="text" placeholder="请输入支付宝账号"  />
			</view>
		</view>
		<view class="sure_btn" @tap="$u.throttle(tapSubmit)"><button type="default">{{btnText}}</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mode:'bind', // bind 第一次绑定支付宝 update 修改支付宝信息 
				aliAccountRealName:'',
				aliAccount:'',
			}
		},
		computed:{
			title(){
				if(this.mode == 'bind') return '绑定支付宝'
				else return '修改信息'
			},
			btnText(){
				if(this.mode == 'bind') return '绑定'
				else return '保存'
			},
			
		},
		onLoad(opt) {
			let {mode,aliAccountRealName,aliAccount} = opt
			this.mode = mode
			this.aliAccountRealName = aliAccountRealName
			this.aliAccount = aliAccount
		},
		methods: {
			async tapSubmit(){
				if(this.aliAccountRealName=='') return this.$toast.text('请输入真实姓名！')
				if(this.aliAccount=='') return this.$toast.text('请输入支付宝账号！')
				await this.$toast.confirm('',`确定要${this.btnText}支付宝信息？`)
				let params = {
					realName: this.aliAccountRealName,
					aliAccount: this.aliAccount 
				}
				this.bindAliAccount(params)
			},
			async bindAliAccount(params){
				console.log(params)
				let {code,data} = await this.$u.api.bindAliAccountApi(params)
				if(code==0) {
					uni.$emit('update-deposit')
					setTimeout(()=>{
						this.$toast.text(`${this.btnText}成功！`)
						this.$u.route({
							type:'back'
						})
					},500)
				}
				
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		.page-wrap {
			min-height: 100%;
			.msg_part {
				padding: 40rpx;
				& > text {
					font-size: 30rpx;
					color: #ffffff;
				}
				.part {
					margin-top: 21rpx;
					width: 100%;
					height: 90rpx;
					border: 1px solid #474d7e;
					padding-left: 25rpx;
					padding-right: 25rpx;
					margin-bottom: 31rpx;
					@include height-center();
					
				}
			}
			
			.sure_btn {
				margin-bottom: 30rpx;
				margin-top: 50rpx;
				& > button {
					color: #ffffff;
					font-size: 30rpx;
					line-height: 90rpx;
					width: 690rpx;
					height: 90rpx;
					background: linear-gradient(270deg, #bb0cf9, #f92faf);
					border-radius: 49rpx;
				}
			}
		}
	}
		
</style>
