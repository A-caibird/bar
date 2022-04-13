<template>
	<view class="dynamic_item_box" @tap="$u.throttle(tapGoDetail)">
		<view class="club_header">
			<view class="header_left"  @tap.stop="$u.throttle(tapGoClubDetail)">
				<image :src="info.clubLogo"></image>
			</view>
			<view class="header_right">
				<view class="first_line">
					<view class="user_name"  @tap.stop="$u.throttle(tapGoClubDetail)">
						<text>{{ info ? info.clubName : ""}}</text>
					</view>
					<view class="find_location">
						<image src="/static/imgs/common/location.png"></image>
						<text>{{info ? info.distance : ""}}</text>
					</view>
				</view>
				<view class="second_line">
					<view class="time_text"  @tap.stop="$u.throttle(tapGoClubDetail)"> <text>{{info.time}}</text> </view>
					<view class="icon_box" @tap.stop="goPage('/pages/discovery/report2?id=' + info.id)">
						<u-icon name="more-dot-fill" color="#ffffff" size="40"></u-icon>
					</view>
				</view>
				
			</view>
		</view>
		<view class="dynamic_img" v-if="info.imgList.length>1 || (info.imgList.length >= 1 && info.videoUrl)">
			<swiper class="swiper_box" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF">
				<swiper-item v-if="info.videoUrl">
					<u-image width="100%" height="100%" class="dy_img" :src="info.videoCover" @click="$u.throttle(tapGoDetail)"></u-image>
					<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
				</swiper-item>
				<block v-for="(item, index) in info.imgList" :key="index">
					<swiper-item>
						<u-image width="100%" height="100%" class="dy_img" :src="item" @click="$u.throttle(tapGoDetail)"></u-image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<view class="dynamic_img" :style="`height:${swiperHeight}rpx;`" v-if="info.imgList.length == 1 && !info.videoCover">
			<u-image class="dy_img" width="100%" height="100%" :src="info.imgList[0]" @click="$u.throttle(tapGoDetail)"></u-image>
		</view>
		<view class="dynamic_img" @tap.stop="" v-if="info.videoUrl && info.imgList.length <= 0">
			<u-image class="dy_img" width="100%" height="100%" :src="info.videoCover" @click="$u.throttle(tapGoDetail)"></u-image>
			<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
		</view>
		<view class="dynamic_footer">
			<view class="left">
				<view class="dynamic_intro">
					<text>{{info.title}}</text>
				</view>
				<!-- <view class="dynamic_intro2">
					<text>{{info.content}}</text>
				</view> -->
				<!-- <view class="dynamic_date"> <text>{{info.time}}</text> </view> -->
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
			}
		},
		methods: {
			goPage(url){
				this.$nav.navigateTo({url});
			},
			async tapGoClubDetail(){
				this.goClubDetail(this.info.clubId)
				
			},
			tapGoDetail() {
				if(this.info.type == 'club'){
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
				}else{
					this.$u.route( 'pages/club/activity/detail',{
						id : this.info.activityId,
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.dynamic_item_box {
		width: 100%;
		.club_header{
			width: 100%;
			height: 120rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.header_left{
				&>image{
					height: 74rpx;
					width: 74rpx;
					border-radius: 50%;
				}
			}
			.header_right{
				flex:1;
				min-width: 0;
				margin-left: 26rpx;
				.first_line{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.user_name{
						display: flex;
						align-items: center;
						&>text{
							font-size: 30rpx;
							color: #FFFFFF;
						}
						&>image{
							height: 30rpx;
							width: 30rpx;
							margin-left: 14rpx;
						}
					}
					.find_location{
						display: flex;
						align-items: center;
						&>image{
							height: 26rpx;
							width: 22rpx;
						}
						&>text{
							font-size: 24rpx;
							color: #FFFFFF;
							margin-left: 4rpx;
						}
					}
				}
				.second_line{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.time_text{
						font-size: 22rpx;
						color: #A2A6D9;
					}
					.icon_box {
						padding: 5rpx;
					} 
				}
			}
		}
		
		.dynamic_img {
			width: 100%;
			image{
				width: 100%;
				height: 468.75rpx;
			}
			position: relative;
			.swiper_box{
				width: 100%;
				height: 460rpx;
				border-radius: 20rpx;
				overflow: hidden;
				position: relative;
			}
			.dy_img{
				border-radius: 20rpx;
				height: 100%;
				width: 100%;
			}
			.play_icon{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				height: 120rpx;
				width: 120rpx;
			}
		}
		.dynamic_footer {
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			background: #2C3158;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.left {
				.dynamic_intro {
					min-width: 0;
					@include ellipsis();
					font-size: 30rpx;
					color: #FFFFFF;
					max-width: 500rpx;
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
