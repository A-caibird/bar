<template>
	<view class="dynamic_item_box" @tap="$u.throttle(tapGoDetail)">
		<!-- <view class="dynamic_img" :style="`height:${swiperHeight}rpx;`" v-if="info.imgList.length>1">
			<u-swiper :height="swiperHeight" :list="info.imgList" bgColor="#191C3F"  :autoplay="false" @click="$u.throttle(tapGoDetail)"></u-swiper>
		</view> -->
		<view class="dynamic_img" :style="`height:${swiperHeight}rpx;`" v-if="info.imgList.length >= 1">
			<image :src="info.imgList[0]" mode="aspectFill"></image>
		</view>
		<view class="dynamic_footer">
			<view class="left">
				<view class="dynamic_intro">
					<text>{{info.title}}</text>
				</view>
				<!-- <view class="dynamic_intro2">
					<text>{{info.content}}</text>
				</view> -->
				<view class="dynamic_date"> <text>{{info.time}}</text> </view>
			</view>
			<view class="right" v-if="btnShow">
				<view class="btn_text" @tap.stop="$u.throttle(tapGoClubDetail)">
					<image src="/static/imgs/common/seat_icon.png"></image>
					<text>订座</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default: {}
			},
			btnShow:{
				type:Boolean,
				default:false
			},
			swiperHeight:{
				type:Number|String,
				default:340
			},
			
		},
		methods: {
			async tapGoClubDetail(){
				this.goClubDetail(this.info.clubId)
			
			},
			tapGoDetail() {
				if(this.btnShow) {
					this.$u.route( 'pages/club/dynamic/detail',{
						id : this.info.id,
						btnShow:true
					})
				} else {
					this.$u.route( 'pages/club/dynamic/detail',{
						id : this.info.id,
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dynamic_item_box {
		width: 100%;
		margin-bottom: 20rpx;
		.dynamic_img {
			width: 100%;
			height: 340rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.dynamic_footer {
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			background: #2C3158;
			display: flex;
			.left {
				min-width: 0;
				flex: 1;
				.dynamic_intro {
					min-width: 0;
					@include ellipsis();
					font-size: 30rpx;
					color: #FFFFFF;
				}
				
				.dynamic_intro2 {
					min-width: 0;
					@include ellipsis(2);
					font-size: 28rpx;
					color: #A8A8CE;
					margin-top: 10rpx;
				}
				
				.dynamic_date {
					min-width: 0;
					color: #A8A8CE;
					font-size: 22rpx;
					margin-top: 14rpx;
				}
			}
			.right {
				display: flex;
				padding-left: 30rpx;
				flex-direction: column-reverse;
				.btn_text{
					height: 60rpx;
					width: 150rpx;
					display: flex;
					@include flex-center();
					background: $uni-button-color;
					font-size: 28rpx;
					color: #FFFFFF;
					border-radius: 45rpx;
					
					&>image{
						height: 30rpx;
						width: 30rpx;
						margin-right: 14rpx;
					}
				}
			}
		}
	}
</style>
