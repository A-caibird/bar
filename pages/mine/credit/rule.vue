<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="规则说明" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="title">
			<view class="line"></view>
			<text>关于信用分</text>
		</view>
		<view class="content-summary">
			<text>大数据征信，指的就是个人在互联网上所申请的贷款或者分期消费行为进行信用评估，风险评测，看是否存在违约百的风险，一旦存在是会留下不良记录的。根度据个人的多项信息数据综合评估而定的评分。 通常大数据征信考察个人版的多头申请、风险行为检测、逾期情况、黑名单情况、法院失信情况等等，想看个人大数据征信评分，可以上微信：提查查，查看就可以了。大数据征信评分分数越高，就代权表个人信用越差，就该减少平时的借贷申请。</text>
		</view>
		<view class="content-detail">
			<text>大数据征信，指的就是个人在互联网上所申请的贷款或者分期消费行为进行信用评估，风险评测，看是否存在违约百的风险，一旦存在是会留下不良记录的。根度据个人的多项信息数据综合评估而定的评分。 通常大数据征信考察个人版的多头申请、风险行为检测、逾期情况、黑名单情况、法院失信情况等等，想看个人大数据征信评分，可以上微信：提查查，查看就可以了。大数据征信评分分数越高，就代权表个人信用越差，就该减少平时的借贷申请。大数据征信，指的就是个人在互联网上所申请的贷款或者分期消费行为进行信用评估，风险评测，看是否存在违约百的风险，一旦存在是会留下不良记录的。根度据个人的多项信息数据综合评估而定的评分。 通常大数据征信考察个人版的多头申请、风险行为检测、逾期情况、黑名单情况、法院失信情况等等，想看个人大数据征信评分，可以上微信：提查查，查看就可以了。大数据征信评分分数越高，就代权表个人信用越差，就该减少平时的借贷申请。</text>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{

		}
	}
</script>

<style lang="scss" scoped>
	.container {

		.header-box {
			margin-bottom: 30rpx;
		}
		.title{
			display: flex;
			align-items: center;
			width: 690rpx;
			margin: 0 30rpx;
			font-size: 30rpx;
			margin-bottom: 30rpx;
			color: #FFFFFF;
			.line{
				width: 6rpx;
				height: 26rpx;
				background: #ff59c9;
				margin-right: 15rpx;
			}
		}
		.content-summary{
			width: 100%;
			font-size: 28rpx;
			color: #A2A6D9;
			padding: 0 30rpx;
			margin-bottom: 40rpx;
		}
		.content-detail{
			width: 100%;
			font-size: 28rpx;
			color: #A2A6D9;
			padding: 0 30rpx;
		}
	}
</style>
