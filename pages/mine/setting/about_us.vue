<template>
	<view class="all_box">
		<view class="header-box">
			<u-navbar back-icon-color="#ffffff" title="关于我们" title-size="36" title-color="#FFFFFF" :background="{ background: '#16192B' }" :border-bottom="false"></u-navbar>
		</view>
		<view class="content">
			<view class="first_content">
				<textarea
					value="大数据征信，指的就是个人在互联网上所申请的贷款或者分期消费行为进行信用评估，风险评测，看是否存在违约百的风险，一旦存在是会留下不良记录的。根度据个人的多项信息数据综合评估而定的评分。
通常大数据征信考察个人版的多头申请、风险行为检测、逾期情况、黑名单情况、法院失信情况等等，想看个人大数据征信评分，可以上微信：提查查，查看就可以了。大数据征信评分分数越高，就代权表个人信用越差，就该减少平时的借贷申请。"
					placeholder=""
				/>
			</view>
			<view class="second_content">
				<textarea
					value="大数据征信，指的就是个人在互联网上所申请的贷款或者分期消费行为进行信用评估，风险评测，看是否存在违约百的风险，一旦存在是会留下不良记录的。根度据个人的多项信息数据综合评估而定的评分。 
通常大数据征信考察个人版的多头申请、风险行为检测、逾期情况、黑名单情况、法院失信情况等等，想看个人大数据征信评分，可以上微信：提查查，查看就可以了。大数据征信评分分数越高，就代权表个人信用越差，就该减少平时的借贷申请。大数据征信，指的就是个人在互联网上所申请的贷款或者分期消费行为进行信用评估，风险评测，看是否存在违约百的风险，一旦存在是会留下不良记录的。根度据个人的多项信息数据综合评估而定的评分。 
通常大数据征信考察个人版的多头申请、风险行为检测、逾期情况、黑名单情况、法院失信情况等等，想看个人大数据征信评分，可以上微信：提查查，查看就可以了。大数据征信评分分数越高，就代权表个人信用越差，就该减少平时的借贷申请。"
					placeholder=""
				/>
			</view>
		</view>
		<view class="footer_box">
			
			
		</view>
	</view>
</template>

<script></script>

<style lang="scss" scoped>
.all_box {
	width: 100%;
	height: 110%;
	background: #16192B ;
	
}
.content{
	margin: 9rpx 29rpx 47rpx 29rpx;
}

.first_content {
	& > textarea {
		width: 692rpx;
		height: 396rpx;
		font-size: 28rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		text-align: left;
		color: #a2a6d9;
		line-height: 44rpx;
	}
}

.second_content {
	margin-top: 47rpx;
	& > textarea {
		width: 692rpx;
		height: 754rpx;
		font-size: 28rpx;
		font-family: PingFangSC, PingFangSC-Regular;
		text-align: left;
		color: #a2a6d9;
		line-height: 44rpx;
	}
}
</style>
