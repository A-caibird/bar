<template>
	<view class="container">
		<view class="header_box">
			<u-navbar
				:border-bottom="false"
				:is-fixed="true"
				:background="{
					background: '#191C3F'
				}"
				:title="title"
				title-color="#FFFFFF"
				back-icon-color="#FFFFFF"
			></u-navbar>
		</view>
		<view class="middle_box"><u-parse :html="content"></u-parse></view>
	</view>
</template>

<script>
const types = ['helpInformation','protocol', 'about', 'privacy', 'credit'];
export default {
	data() {
		return {
			content: '',
			title: '',
			type: ''
		};
	},
	onLoad: function(options) {
		let type = options.type;
		this.getContent(type);
		if(type == 'Graphic'){
			this.content = uni.getStorageSync('Graphic_info');
			uni.removeStorageSync("Graphic_info");
		}
		this.type = type;
	},
	methods: {
		getContent: async function(type) {
			var requestApi = null;
			let title = ''
			switch (type) {
				case 'helpInformation':
					{
						requestApi = this.$u.api.getHelpInformationApi();
						title = '反馈与帮助'
					}
					break;
				case 'protocol':
					{
						requestApi = this.$u.api.getProtocol();
						title = '用户协议'
					}
					break;
				case 'about':
					{
						requestApi = this.$u.api.getAboutUs();
						title = '关于我们'
					}
					break;
				case 'privacy':
					{
						requestApi = this.$u.api.getPrivacy();
						title = '隐私协议'
					}
					break;
				case 'credit':
					{
						requestApi = this.$u.api.getCredit();
						title = '信用规则'
					}
					break;
				case 'walletHelpCenter':
					{
						requestApi = this.$u.api.getWalletHelpCenterApi();
						title = '帮助中心'
					}
					break;
				case 'Graphic':
					{
						requestApi = "";
						title = '图文详情'
					}
					break;
				case 'BlindBox':
					{
						requestApi = this.$u.api.getBlindBoxRuleApi()
						title = '拆盲盒攻略'
					}
					break;
				default:
					break;
			}
			this.title = title
			if (requestApi) {
				let {code,data} = await requestApi
				if(code==0) {
					console.log(data)
					this.content = data.content;
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
	.container{
		
		.middle_box{
			padding-left: 20rpx;
			padding-right: 20rpx;
			color: #FFFFFF;
			font-size: 26rpx;
			line-height: 1.8;
		}
		
	}
</style>
