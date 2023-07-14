<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="账号与安全" title-size="36" title-color="#FFFFFF" :background="{ background: '#16192B' }"
		 :border-bottom="false"></u-navbar>
		<view class="list">
			<view class="item" @tap="$u.throttle(tapGoSetPaswword)">
				<view class="item-wrap column">
					<text class="title">密码修改</text>
				</view>
				<view class="item-wrap">
					<image class="right-arrow" src="/static/imgs/mine/common_right.png" />
				</view>
			</view>
			<template v-if="!isAppleAudit">
				<view class="item" v-if="hasBindWeChat" @tap="$u.throttle(tapUnBindWeChat)">
					<view class="item-wrap column">
						<text class="title">微信账号</text>
						<text class="subTitle ellipsis">{{wechatNickName}}</text>
					</view>
					<view class="item-wrap">
						<view class="unbind">解绑</view>
						<image class="right-arrow" src="/static/imgs/mine/common_right.png" />
					</view>
				</view>
				<view class="item" v-else @tap="$u.throttle(tapBindWeChat)">
				<!-- <view class="item" v-else @tap="$u.throttle(tapUnBindWeChat)"> -->
					<view class="item-wrap column">
						<text class="title">微信账号</text>
					</view>
					<view class="item-wrap">
						<text class="subTitle">未绑定</text>
						<image class="right-arrow" src="/static/imgs/mine/common_right.png" />
					</view>
				</view>
			</template>
			
			
			<view class="item"  @tap="$u.throttle(tapAuthentication(hasVerified))">
				<view class="item-wrap column">
					<text class="title">实名认证</text>
				</view>
				<view class="item-wrap">
					<text class="subTitle">{{hasVerified?'已实名认证':'未认证'}}</text>
					<image class="right-arrow" src="/static/imgs/mine/common_right.png" />
				</view>
			</view>
			<template v-if="!isAppleAudit">
				<view class="item" v-if="hasSetPayPassword" @tap="$u.throttle(tapUpadtePassword)">
					<view class="item-wrap column">
						<text class="title">支付密码</text>
					</view>
					<view class="item-wrap">
						<text class="subTitle">修改支付密码</text>
						<image class="right-arrow" src="/static/imgs/mine/common_right.png" />
					</view>
				</view>
				<view class="item" v-else  @tap="$u.throttle(tapSetPassword)">
					<view class="item-wrap column">
						<text class="title">支付密码</text>
					</view>
					<view class="item-wrap">
						<text class="subTitle">您当前还未设置密码</text>
						<image class="right-arrow" src="/static/imgs/mine/common_right.png" />
					</view>
				</view>
			</template>
			
			
			
		</view>
	</view>
</template>

<script>
	import appleAudit from '@/mixins/apple-audit.js'
	export default {
		mixins:[appleAudit],
		data() {
			return {
				hasSetPayPassword: false,//显示支付密码已设置 或 未设置				
				hasVerified: false,//显示实名已认证或 未认证				
				hasBindWeChat: false,//是否绑定微信				
				wechatNickName: '',//微信昵称				
			}
		},
		onLoad() {
			this.load()
			uni.$on('setPayPassword',this.handleSetPayPassword)
			uni.$on('setAuthentication',this.handleSetAuthentication)
		},
		onUnload() {
			uni.$off('setPayPassword',this.handleSetPayPassword)
			uni.$off('setAuthentication',this.handleSetAuthentication)
		},
		methods: {
			handleSetPayPassword(){
				this.hasSetPayPassword = true
			},
			handleSetAuthentication(){
				this.hasVerified = true
			},
			load(){
				this.getAccountSecurity()
			},
			async getAccountSecurity(){
				let {code,data} = await this.$u.api.getAccountSecurityApi()
				if(code==0) {
					let {hasBindWeChat,hasSetPayPassword,hasVerified,wechatNickName} = data
					this.hasBindWeChat = hasBindWeChat
					this.hasSetPayPassword = hasSetPayPassword
					this.hasVerified = hasVerified
					this.wechatNickName = wechatNickName
				}
			},
			tapGoSetPaswword(){
				this.$u.route('/pages/mine/setting/password_amend')
			},
			async tapUnBindWeChat(){
				await this.$toast.confirm('提示','解绑微信后你将无法使用微信登录，你确定要解绑吗？')
				let {code} = await this.$u.api.untieWeChatApi({})
				if(code==0) {
					this.hasBindWeChat = false
					this.$toast.text('解绑成功！')
				}
			},
			tapBindWeChat(){
				let vm = this
				uni.login({
					provider:'weixin',
					success: function (res) {
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log(infoRes);
								let params = {
									openId : infoRes.userInfo.openId,
									wechatNickName : infoRes.userInfo.nickName,
								}
								console.log(params)
								vm.bindWeChat(params)
							},
							fail(err) {
								vm.$toast.text('绑定微信失败！')
								console.log(err);
							}
						});
					},
					fail(err) {
						vm.$toast.text('绑定微信失败！')
						console.log(err);
					}
				})
			},
			async bindWeChat(params) {
				let {code,data} = await this.$u.api.bindWeChatApi(params)
				if(code==0) {
					this.load()
					this.$toast.text('绑定微信成功！')
				}
			},
			tapAuthentication(hasVerified){
				this.$u.route('/pages/mine/setting/certification',{
					hasVerified:hasVerified?'verify':'unverify'
				})
			},
			tapUpadtePassword(){
				this.$u.route('/pages/mine/setting/amend')
			},
			tapSetPassword(){
				this.$u.route('/pages/mine/setting/pay_password')
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		.container {
			min-height: 100%;
			background-color: #16192B;
		
			.list {
				display: flex;
				flex-direction: column;
				.item {
					padding: 24rpx 30rpx;
					@include height-center();
					justify-content: space-between;
					.item-wrap {
						@include height-center();
						&.column {
							flex-direction: column;
							align-items: initial;
						}
						.title {
							color: #FFFFFF;
							font-size: 30rpx;
						}
						.subTitle {
							color: #B4B2CF;
							font-size: 28rpx;
							&.ellipsis {
								@include ellipsis();
								max-width: 300rpx;
							}
							
						}
						.unbind {
							width: 90rpx;
							height: 46rpx;
							border-radius: 4rpx;
							border: 1rpx solid #64689B;
							@include flex-center();
							color: #B4B2CF;
							font-size: 28rpx;
						}
						.right-arrow {
							margin-left: 30rpx;
							width: 12rpx;
							height: 20rpx;
						}
					}
				}
			}
		}
	}
	

	



	

	
</style>
