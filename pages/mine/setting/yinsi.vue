<template>
	<view class="container">
		<view class="first_part">
			<u-navbar back-icon-color="#FFFFFF" title="隐私" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false"></u-navbar>
		</view>

		<view class="second_part">

			<view class="icon2">
				<text>是否展示我关注的用户</text>
				<u-switch v-model="showAttention" active-color="#F72EB2" @change="switchShowAttention"></u-switch>
			</view>

			<view class="icon2">
				<text>是否展示我的粉丝</text>
				<u-switch v-model="showFans" active-color="#F72EB2" @change="switchShowFans"></u-switch>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			showAttention:'',
			showFans:'',
		};
	},
	onLoad() {
		this.myOpenChooseStatus()
	},
	methods: {
		//显示关注
		switchShowAttention: function(e) {

			let params = {
				open:this.showAttention
			}

			this.$u.api.changeShowMyAttentionUserApi(params).then(res=>{
				let code = res.code
				console.log(res)
				if(code == 0){
					
				}else{
					this.$u.toast(res.msg)
					this.showAttention = !this.showAttention
				}
			})	
		},
		//显示粉丝
		switchShowFans: function(e) {
			let params = {
				open:this.showFans
			}

			this.$u.api.changeShowMyFansApi(params).then(res=>{
				let code = res.code
				console.log(res)
				if(code == 0){
					
				}else{
					this.$u.toast(res.msg)
					this.showFans = !this.showFans
				}
			})	
		},

		//获取粉丝，关注用户是否开启，状态详情
		myOpenChooseStatus:function(){
			this.$u.api.myOpenChooseApi({}).then(res=>{
				let code = res.code
				if(code == 0){
					this.showAttention = res.data.showMyAttentionUser
					this.showFans = res.data.showMyFans
				}else{
					this.$u.toast(res.msg)
				}
			})	
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
}

.second_part {
	margin: 40rpx 29rpx 883rpx 30rpx;
}
.icon1{
	margin-top: 40rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	& > text {
		font-size: 30rpx;
		color: #ffffff;
	}
}

.icon2 {
	margin-top: 54rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	& > text {
		font-size: 30rpx;
		color: #ffffff;
	}
	& > switch {
	}
}
</style>
