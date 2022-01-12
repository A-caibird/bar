<template>
	<view class="container">
		<view class="dynamic-box">
			<view @tap="$u.throttle($u.route('/pages/discovery/dynamic_detail',{id:item.id}))" class="dynamic-item" v-for="(item, index) in pageList" :key="index">
				<view class="item-head">
					<image class="avatar" :src="item.avatar" mode=""></image>
					<view class="item-head-right">
						<view class="item-head-name">
							<text class="text-name">{{item.nickName}}</text>
							<view class="text-location">
								<image src="/static/imgs/common/location.png" mode=""></image>
								{{item.distance}}
							</view>
						</view>
						<view class="text-time">
							<text>{{item.time}}</text>
						</view>
					</view>
				</view>
				<!-- 个人动态 -->
				<view class="item-personal-content">
					<view class="content-msg">
						<view class="text-msg"><text>{{item.content}}</text></view>
						<view class="dynamic-image" v-if=" (item.videoUrl && item.imgList.length >= 1) || item.imgList.length > 1">
							<swiper class="swiper_box" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF">
								<swiper-item v-if="item.videoUrl">
									<u-image width="100%" height="100%" class="dy_img" :src="item.videoCover" @click="$u.route('/pages/discovery/dynamic_detail?id=' + item.id)"></u-image>
									<image class="play_icon" src="/static/imgs/common/play_icon.png" @click="$u.route('/pages/discovery/dynamic_detail?id=' + item.id)"></image>
								</swiper-item>
								<block v-for="(item, index) in item.imgList" :key="index">
									<swiper-item>
										<u-image width="100%" height="100%" class="dy_img" :src="item" @click="$u.route('/pages/discovery/dynamic_detail?id=' + item.id)"></u-image>
									</swiper-item>
								</block>
							</swiper>
							<!-- <u-swiper bg-color="#191C3F" height="390" :list="item.imgList" @click="$u.route('pages/discovery/dynamic_detail',{id:item.id})"></u-swiper> -->
						</view>
						<view class="dynamic-image" @tap.stop="" v-if="item.imgList.length == 1 && !item.videoUrl">
							<u-image width="100%" height="100%" :src="item.imgList[0]" @click="$u.route('/pages/discovery/dynamic_detail?id=' + item.id)"></u-image>
						</view>
						<view class="dynamic-image" @tap.stop="$u.route('/pages/discovery/dynamic_detail?id=' + item.id)" v-if="item.videoUrl && item.imgList.length <= 0">
							<u-image class="dy_img" width="100%" height="100%" :src="item.videoCover"></u-image>
							<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
						</view>
					</view>
					<view class="content-icon">
						<view class="icon-like"  @tap.stop="$u.throttle(toggleLike(item))">
							<image src="/static/imgs/mine/like-active.png" v-if="item.isLike"></image>
							<image src="/static/imgs/mine/like.png" v-else></image>
							<text>{{item.likeNum}}</text>
						</view>

						<view class="icon-gift" @tap.stop="$u.throttle(tapOpenGift(item))" v-if="showPercent">
							<image src="/static/imgs/mine/gift.png" mode=""></image>
							<text>{{item.giftNum}}</text>
						</view>

						<view class="icon-comment" @tap.stop="$u.throttle(tapOpenComment(item))">
							<image src="/static/imgs/mine/comment.png" mode=""></image>
							<text>{{item.commentNum}}</text>
						</view>
						<view class="icon-forward" @tap.stop="$u.throttle(shareTap)"><image src="/static/imgs/mine/forward.png" mode=""></image></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import loginMixins from '@/mixins/loginConfirm.js'
	export default {
		props: {
			pageList: {
				type:Array,
				default:[]
			},
			showPercent:{
				type:Boolean,
				default:false,
			}
		},
		mixins:[loginMixins],
		data() {
			return {
				
			};
		},
		methods:{
			shareTap(){
				this.$emit('shareTap');
			},
			tapOpenGift(info){
				if(!this.loginConfirmHandle(false)){
					console.log('tapOpenGift')
					return ;
				}
				this.$emit('oepnGift',{dynamicId:info.id})
			},
			tapOpenComment(info){
				if(!this.loginConfirmHandle(false)){
					console.log('tapOpenComment')
					return ;
				}
				this.$emit('oepnComment',{id:info.id})
			},
			async toggleLike(info){
				console.log(info)
				if(!this.loginConfirmHandle(false)){
					console.log('toggleLike')
					return ;
				}
				if(info.isLike){
					let {code} = await this.$u.api.dynamicCancelLike(info.id)
					if(code==0) {
						info.isLike = false
						info.likeNum --
						this.$forceUpdate()
						this.refreshDynamic();
					}
				}else{
					let {code} = await this.$u.api.dynamicLike(info.id)
					if(code==0) {
						info.isLike = true
						info.likeNum ++
						this.$forceUpdate()
						this.refreshDynamic();
					}
				}
			},
			refreshDynamic(){
				uni.$emit('dynamic-refresh',{msg:'myDynamic'})
				uni.$emit('dynamic-refresh-follow',{msg:'myDynamic'})
			}
		}
		
	};
</script>

<style lang="scss" scoped>
.container {
	background-color: #20234b;

	.dynamic-box {
		display: flex;
		flex-direction: column;
		width: 100%;

		.dynamic-item {
			display: flex;
			flex-direction: column;
			margin-bottom: 10rpx;
			background-color: $uni-title-color;

			.item-head {
				display: flex;
				padding: 30rpx;
				.avatar {
					width: 74rpx;
					height: 74rpx;
					border-radius: 50%;
				}

				.item-head-right {
					color: #ffffff;
					width: calc(100% - 90rpx);
					margin-left: 15rpx;

					.item-head-name {
						display: flex;
						justify-content: space-between;
						align-items: center;

						.text-name {
							font-size: 30rpx;
						}

						.text-location {
							display: flex;
							font-size: 24rpx;
							align-items: center;
							// line-height: 20rpx;

							& > image {
								width: 21rpx;
								height: 25rpx;
								padding-right: 9rpx;
							}
						}
					}

					.text-time {
						display: flex;
						justify-content: space-between;
						font: 22rpx;
						color: #a2a6d9;

						.share {
							color: #ffffff;
						}
					}
				}
			}

			.item-personal-content {
				display: flex;
				flex-direction: column;

				.content-msg {
					font-size: 30rpx;
					color: #ffffff;

					.text-msg {
						padding: 0 30rpx;
					}

					.dynamic-image {
						width: 100%;
						height: 468.75rpx;
						//background-color: blue;
						margin-top: 25rpx;
						&>image{
							width: 100%;
							height: 100%;
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
				}

				.content-icon {
					position: relative;
					display: flex;
					padding: 45rpx 30rpx;

					.icon-like {
						display: flex;
						align-items: center;
						width: 60rpx;
						height: 30rpx;
						margin-right: 40rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.icon-gift {
						display: flex;
						align-items: center;
						width: 60rpx;
						height: 30rpx;
						margin-right: 40rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.icon-comment {
						display: flex;
						align-items: center;
						width: 60rpx;
						height: 30rpx;
						margin-right: 40rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.icon-forward {
						display: flex;
						align-items: center;
						height: 30rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}
				}
			}

			.item-others-content {
				display: flex;
				flex-direction: column;

				.content-msg {
					font-size: 30rpx;
					color: #ffffff;

					.text-msg {
						padding: 25rpx 30rpx;
					}

					swiper {
						width: 100%;
						height: 390rpx;
						image {
							width: 100%;
							height: 100%;
						}
					}
				}

				.content-icon {
					position: relative;
					display: flex;
					padding: 45rpx 30rpx;

					.icon-like {
						display: flex;
						align-items: center;
						width: 60rpx;
						height: 30rpx;
						margin-right: 40rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.icon-gift {
						display: flex;
						align-items: center;
						width: 60rpx;
						height: 30rpx;
						margin-right: 40rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.icon-comment {
						display: flex;
						align-items: center;
						width: 60rpx;
						height: 30rpx;
						margin-right: 40rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.icon-forward {
						display: flex;
						align-items: center;
						height: 30rpx;
						font-size: 22rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 10rpx;
						}
					}

					.happy-state {
						position: absolute;
						display: flex;
						justify-content: center;
						align-items: center;
						right: 30rpx;
						top: 30rpx;
						width: 170rpx;
						height: 60rpx;
						background: #2c3158;
						border-radius: 30rpx;
						font-size: 28rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 9rpx;
						}
					}
					.invite-state {
						position: absolute;
						display: flex;
						justify-content: center;
						align-items: center;
						right: 30rpx;
						top: 30rpx;
						width: 170rpx;
						height: 60rpx;
						background: linear-gradient(270deg, #bb0cf9 -109%, #f92faf 5%);
						border-radius: 30rpx;
						font-size: 28rpx;
						color: #ffffff;

						image {
							width: 30rpx;
							height: 30rpx;
							padding-right: 9rpx;
						}
					}
				}
			}
		}
	}
}
</style>
