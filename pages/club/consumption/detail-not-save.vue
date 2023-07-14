<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#16192B'
			}" title="套餐详情"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="swiper_box" v-if="detail.imgList.length>1">
				<u-swiper :list="detail.imgList" height="350" bgColor="#16192B" @click="$u.throttle(previewImgList(detail.imgList,$event))"></u-swiper>
			</view>
			<view class="swiper_box" v-if="detail.imgList.length == 1">
				<image :src="detail.imgList[0]"  mode="aspectFill" @click="$u.throttle(previewImg(detail.imgList[0]))"></image>
			</view>
			<view class="package_info">
				<view class="package_name">{{detail.name}}</view>
				<view class="package_support">{{detail.clubName}}</view>
				<view class="rate_num">
					<view class="rate_box">
						{{detail.wineCoin}}元
					</view>
					<!-- <view class="num_box">
						<self-number-box :min="0" color="#FFFFFF" size="26" inputHeight="35" inputWidth="50" :value="count"  @plus="handleCommodityPlus" @minus="handleCommodityMinus" :longPress="false "></self-number-box>
					</view> -->
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
				count:0,
				orderId:-1,
				detail: {
					imgList: [],
				},
			}
		},
		onLoad(opt) {
			console.log(opt)
			this.id = opt.id
			// this.orderId = opt.orderId
			// this.count = this.$u.test.digits(opt.count)?opt.count:0
			this.load()
		},
		methods: {
			async getShoppingCardView(){
				let {code,data} = await this.$u.api.getAddWineShoppingCart({
					orderId:this.orderId
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
				let {code} = await this.$u.api.addWineApi(data)
				if(code==0) {
					uni.$emit('refresh-add-wine')
					this.getShoppingCardView()
				}
			},
			async shoppingCardDelete(data){
				let {code} = await this.$u.api.addWineApiDeleteApi(data)
				if(code==0) {
					uni.$emit('refresh-add-wine')
					this.getShoppingCardView()
				}
			},
			handleCommodityPlus(){
				let data = {
					orderId:this.orderId,
					commodityId:this.id
				}
				// console.log(data)
				this.shoppingCardAdd(data)
			},
			handleCommodityMinus(){
				let data = {
					orderId:this.orderId,
					commodityId:this.id
				}
				console.log(data)
				this.shoppingCardDelete(data)
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
				background: #16192B;
				image{
					width: 100%;
					height: 100%;
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
