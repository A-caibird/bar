<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" title="套餐详情"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="swiper_box" v-if="detail.imgList.length > 1">
				<u-swiper :list="detail.imgList" height="350" bgColor="#191C3F" @click="$u.throttle(previewImgList(detail.imgList,$event,key=''))"></u-swiper>
			</view>
			<view class="swiper_box" v-if="detail.imgList.length ==1">
				<image :src="detail.imgList[0]" mode="aspectFill" @click="$u.throttle(previewImg(detail.imgList[0]))"></image>
			</view>
			<view class="package_info">
				<view class="package_name">{{detail.name}}</view>
				<view class="package_support">{{detail.clubName}}</view>
				<view class="rate_num">
					<view class="rate_box">
						{{detail.wineCoin}}元
					</view>
					<view class="num_box">
						<self-number-box :min="0" color="#FFFFFF" size="26" inputHeight="35" inputWidth="50" :value="count"  @plus="handleCommodityPlus" @minus="handleCommodityMinus" :longPress="false "></self-number-box>
					</view>
				</view>
			</view>
			<u-gap bgColor="#20234B" height="20"></u-gap>
			<view class="package_intro">
				<view class="intro_label">
					<view class="label_left">
						<view class="line"></view>
						<text>商品详情</text>
					</view>
					
				</view>
				
				<view class="intro_content">
					<u-parse :html="detail.content"></u-parse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import selfNumberBox from '@/components/self-number-box/self-number-box.vue'
	export default {
		components: {
			selfNumberBox,
		},


		data() {
			return {
				content: '',
				id: -1,
				seatId:-1,
				date:'',
				selectId:-1,
				count:0,
				detail: {
					imgList: [],
				},
				
				seatInterval:'',
				seatIntervalStop:false,
				
				closeInterval:'',
				closeTime:0,
			}
		},
		onLoad(opt) {
			console.log(opt)
			this.id = opt.id
			this.selectId = opt.selectId
			this.date = opt.date
			this.seatId = opt.seatId
			this.count = this.$u.test.digits(opt.count)?opt.count:0
			this.load()
			this.clearInterval = setInterval(this.jusgeEndExtend,60*1000)
		},
		onUnload() {
			clearInterval(this.seatInterval)
			clearInterval(this.clearInterval)
		},
		onShow() {
			console.log('show')
			this.seatIntervalStop = false
			clearInterval(this.seatInterval)
			this.seatInterval = setInterval(this.extendCardTableSelectTime,120*1000)
		},
		onHide() {
			console.log('hide')
			this.seatIntervalStop = true
		},
		methods: {
			async getShoppingCardView(){
				let {code,data} = await this.$u.api.getShoppingCardViewApi({
					cardTableId : this.seatId,
					date : this.date,
				})
				console.log(data)
				if(code==0) {
					this.setSCNum(data.list)
				}
				
			},
			setSCNum(list){//将购物车中的数值设置到商品列表中
				let vm = this
				let index = list.findIndex(e2=>{
					return vm.id==e2.commodity.id
				})
				if(index!=-1) {
					this.count = list[index].buyNum
				} else {
					this.count = 0
				}
			
					
			},
			async shoppingCardAdd(data){
				let {code} = await this.$u.api.shoppingCardAddApi(data)
				if(code==0) {
					uni.$emit('refresh-drinks-detail')
					this.getShoppingCardView()
				}
			},
			async shoppingCardDelete(data){
				let {code} = await this.$u.api.shoppingCardDeleteApi(data)
				if(code==0) {
					uni.$emit('refresh-drinks-detail')
					this.getShoppingCardView()
				}
			},
			handleCommodityPlus(){
				let data = {
					cardTableId : this.seatId,
					date : this.date,
					commodityId:this.id
				}
				// console.log(data)
				this.shoppingCardAdd(data)
			},
			handleCommodityMinus(){
				let data = {
					cardTableId : this.seatId,
					date : this.date,
					commodityId:this.id
				}
				console.log(data)
				this.shoppingCardDelete(data)
			},
			
			jusgeEndExtend(){
				console.log(this.closeTime)
				if(this.seatIntervalStop) {
					this.closeTime++
				} else {
					this.closeTime = 0
				} 
				if(this.closeTime>=10) {
					this.closeTime = 0
					clearInterval(this.seatInterval)
				}
			},
			async extendCardTableSelectTime(){
				console.log(this.seatIntervalStop)
				if(this.seatIntervalStop) return
				let {code} = await this.$u.api.extendCardTableSelectTimeApi({selectId:this.selectId})	
				
			},
			load() {
				this.getCommodityDetail()
			},
			async getCommodityDetail() {
				let {code,data} = await this.$u.api.getCommodityDetailApi({
					id: this.id
				})
				console.log(data)
				if(code==0) {
					this.detail = data.detail
				}
			},
			

		},
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;

		.middle_box {
			width: 100%;

			.swiper_box {
				width: 100%;
				height: 350rpx;
				background: #191C3F;
				image{
					height: 100%;
					width: 100%;
				}
			}

			.package_info {
				width: 100%;
				box-sizing: border-box;
				padding: 30rpx;

				.package_name {
					font-size: 40rpx;
					color: #FFFFFF;
				}

				.package_support {
					font-size: 28rpx;
					color: #FFFFFF;
					margin-top: 20rpx;
				}

				.rate_num {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 20rpx;

					.rate_box {
						font-size: 35rpx;
						color: #FFFFFF;
						font-weight: 700;
						
					}
				}
			}

			.package_intro {
				width: 100%;

				.intro_label {
					height: 100rpx;
					width: calc(100% - 60rpx);
					margin-left: 30rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;

					.label_left {
						display: flex;
						align-items: center;
						font-size: 34rpx;
						color: #FFFFFF;
						font-weight: 500;

						.line {
							height: 32rpx;
							width: 6rpx;
							background: #FF59C9;
							margin-right: 14rpx;
						}
					}

					.label_right {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #BDC0DA;

						&>image {
							height: 22rpx;
							width: 14rpx;
							margin-left: 16rpx;
						}
					}
				}

				.intro_tips {
					width: calc(100% - 60rpx);
					margin-left: 30rpx;
					box-sizing: border-box;
					color: #FFFFFF;
					font-size: 26rpx;
					padding-bottom: 40rpx;
				}

				.intro_content {
					padding-left: 20rpx;
					padding-right: 20rpx;
					width: 100%;
				}
			}
		}
	}
</style>
