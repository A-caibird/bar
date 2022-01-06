<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#ffffff" title="我的钻石" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false">
				<view class="header_box_right" slot="right" style="color: #FFFFFF; font-size: 30rpx; padding-right: 30rpx;" @tap="$u.throttle(goArticle('walletHelpCenter'))">帮助中心</view>
			</u-navbar>
		</view>
		<view class="icon"><image src="/static/imgs/mine/zuanshi.png" mode=""></image></view>
		<view class="number"><text>钻石数量</text></view>
		<view class="number2"><text >{{mydiamondNumber}}</text></view>
		<view class="btn"><button type="default" @tap="$u.throttle(tapGoDeposit)">我要提现</button></view>
		<view class="lin1"></view>

		<view class="gift" @tap="$u.route('pages/mine/mydiamond/gift_income')">
			<view class="gift_1">
				<image src="/static/imgs/mine/gift.png" mode=""></image>
					<text>礼物</text>
			</view>
				<image src="/static/imgs/mine/common_right.png" mode=""></image>
		</view>
		<view class="lin2"></view>
		<view class="deposit" @tap="$u.route('pages/mine/mydiamond/record')">
			<view class="deposit_1">
				<image src="/static/imgs/mine/deposit.png" mode=""></image>
				<text>提现记录</text>
			</view>
			<image src="/static/imgs/mine/common_right.png" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			mydiamondNumber:''
		};
	},
	onLoad() {
		this.load();
		uni.$on('update-diamond',this.load)
	},
	onUnload() {
		uni.$off('update-diamond',this.load)
	},
	methods: {
		load(){
			this.$u.api.myDiamondApi().then(res=>{
				//console.log(res);
				if(res.code==0){
					this.mydiamondNumber = res.data.diamond;
				}
			})
		},
		async tapGoDeposit(){
			await this.judgeVerify()
			this.$u.route('/pages/mine/mydiamond/deposit')
		},
	}
};
</script>

<style lang="scss">
.icon {
	margin: 67rpx 309rpx 29rpx 288rpx;

	& > image {
		width: 153rpx;
		height: 148rpx;
	}
}

.number {
	text-align: center;

	& > text {
		color: #ffffff;
		font-size: 36rpx;
	}
}

.number2 {
	height: 84rpx;
	text-align: center;
	margin-top: 22rpx;
	& > text {
		color: #ffffff;
		font-size: 60rpx;
	}
}

.btn {
	margin-top: 43rpx;

	& > button {
		width: 410rpx;
		height: 90rpx;
		background: linear-gradient(270deg, #bb0cf9, #f92faf);
		border-radius: 45rpx;
		color: #ffffff;
		font-size: 30rpx;
		line-height: 90rpx;
	}
}

.lin1 {
	margin-top: 83rpx;
	width: 750rpx;
	height: 20rpx;
	background-color: #20234b;
}

.gift {
	margin: 34rpx 30rpx 34rpx 31rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	& > image {
		width: 14rpx;
		height: 22rpx;
		
	}

	
	.gift_1 {
		
		display: flex;
		align-items: center;
		justify-content: space-between;

		

		& > text {
			margin-left: 19rpx;
			font-size: 30rpx;
			color: #ffffff;
		}
		
		& > image {
			width: 32rpx;
			height: 32rpx;
			
		}
	}
}

.lin2 {
	margin-top: 34rpx;
	width: 750rpx;
	height: 1rxpx;
	border: 1rpx solid #31345b;
}

.deposit {
	margin: 32rpx 30rpx 34rpx 31rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	.deposit_1{
		display: flex;
		align-items: center;
		
		& > image {
			width: 32rpx;
			height: 32rpx;
			
		}
		
		& > text {
			margin-left: 20rpx;
			font-size: 30rpx;
			color: #ffffff;
		}
	}

	

	& > image {
		width: 14rpx;
		height: 22rpx;
		
	}

	
}
</style>
