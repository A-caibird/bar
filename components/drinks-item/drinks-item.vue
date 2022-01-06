<template>
	<view>
		<view class="drinks_box" v-if="mode == 'cart'">
			<view class="drink_img">
				<image :src="info.cover "></image>
			</view>
			<view class="drink_name"> <text>{{info.name}}</text> </view>
			<view class="price_number_box">
				<view class="price_info">
					<text>{{info.wineCoin}}元</text>
				</view>
				<view class="num_box" v-if="mode == 'cart'">
					<self-number-box :min="0" color="#FFFFFF" size="26" inputHeight="35" inputWidth="50" :value="count" @input="handleChange" @plus="handlePlus" @minus="handleMinus" :longPress="false "></self-number-box>
				</view>
				<view  v-if="mode == 'show'" style="font-size: 20rpx;color: #FFFFFF;">
					<text>x{{buyNum}}</text> 
				</view>
			</view>
		</view>
		<view class="car_goods_box" v-if="mode == 'show'">
			<view class="goods_img_panel">
				<image class="goods_img" :src="info.cover"></image>
			</view>
			<view class="goods_info_box">
				<view class="goods_name"> <text>{{info.name}}</text></view>
				<view class="price_box">
					<view class="price_text"> <text>{{info.wineCoin}}元</text> </view>
					<view class="num_box">
						<text>x{{buyNum}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import selfNumberBox from '@/components/self-number-box/self-number-box.vue'
	export default{
		props:{
			mode:{
				type:String,
				default(){
					return 'cart' //cart：购物车模式， show：展示模式
				}
			} ,
			info:{
				type:Object,
				default(){
					return {}
				}
			},
			buyNum:{
				type:Number|String,
				default:0
			},
		},
		computed:{
			count(){
				return this.$u.test.digits(this.info.count)?this.info.count:0
			}
		},
		methods:{
			handlePlus(){
				console.log(789)
				this.$emit('plus')
				
			},
			handleMinus(){
				this.$emit('minus')
			},
			handleChange(num){
				this.$emit('input',num)
			},
		},
		components:{
			selfNumberBox
		}
	}
</script>

<style lang="scss" scoped>
	.car_goods_box{
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 20rpx;
		.goods_img_panel{
			height: 160rpx;
			width: 160rpx;
			.goods_img{
				height: 100%;
				width: 100%;
			}
		}
		.goods_info_box{
			width: calc(100% - 190rpx);
			margin-left: 30rpx;
			height: 160rpx;
			.goods_name{
				font-size: 28rpx;
				color: #FFFFFF;
				width: 100%;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			.price_box{
				margin-top: 80rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.price_text{
					color: #FFFFFF;
					font-size: 26rpx;
				}
				.num_box{
					color: #FFFFFF;
					font-size: 26rpx;
				}
			}
		}
	}
	.drinks_box{
		width: 336rpx;
		padding-bottom: 20rpx;
		.drink_img{
			width: 100%;
			height: 250rpx;
			&>image{
				height: 100%;
				width: 100%;
				border-radius: 10rpx;
			}
		}
		.drink_name{
			font-size: 30rpx;
			line-height: 40rpx;
			color: #FFFFFF;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-top: 16rpx;
		}
		.price_number_box{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;
			.price_info{
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}
	}
</style>
