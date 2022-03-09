<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{'background': '#191C3F'}" title="动态详情" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="media_box" v-if="info.imgList.length > 1 || (info.imgList.length == 1 && info.videoUrl)">
			<swiper class="swiper_box" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF">
				<swiper-item v-if="info.videoUrl">
					<u-image width="100%" height="100%" class="dy_img" :src="info.videoCover" @click="$u.throttle(videoPlayTap)"></u-image>
					<image class="play_icon" src="/static/imgs/common/play_icon.png" @click="$u.throttle(videoPlayTap)"></image>
				</swiper-item>
				<block v-for="(item, index) in info.imgList" :key="index">
					<swiper-item>
						<u-image width="100%" height="100%" class="dy_img" :src="item" @click="$u.throttle(previewImgList(info.imgList,$event,key=''))"></u-image>
					</swiper-item>
				</block>
			</swiper>
			<!-- <u-swiper height="468.75" :list="info.imgList" bgColor="#191C3F" @click="$u.throttle(previewImgList(info.imgList,$event,key=''))"></u-swiper> -->
		</view>
		<view class="media_box" v-if="info.imgList.length == 1 && !info.videoUrl" @click="$u.throttle(previewImg(info.imgList[0]))">
			<u-image class="dy_img" width="100%" height="100%" :src="info.imgList[0]"></u-image>
		</view>
		<view class="media_box" @tap.stop="$u.throttle(videoPlayTap)" v-if="info.videoUrl && info.imgList.length <= 0">
			<u-image class="dy_img" width="100%" height="100%" :src="info.videoCover"></u-image>
			<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
		</view>
		<video @fullscreenchange="fullScreenChange" class="videoBox" id="videoId" v-if="playUrl" :src="playUrl"></video>
		<view class="middle_box">
			<view class="activity_info">
				<view class="activity_name"> <text>{{info.title}}</text> </view>
				<view class="second_line">
					<view class="act_location"> <text @tap="tapGoDetail">{{info.clubName}}</text> </view>
					<view class="act_time"> <text>{{info.time}}</text> </view>
				</view>
			</view>
			<view class="act_detail">
				<!-- <text>{{info.content}}</text> -->
				<u-parse :html="info.content"></u-parse>
			</view>
		</view>
		<view class="footer_box">
			<view class="common_item" @tap="toggleLike">
				<image src="/static/imgs/mine/like-active.png" v-if="info.isLike"></image>
				<image src="/static/imgs/mine/like.png" v-else></image>
				<text>点赞</text>
			</view>
			<view class="common_item" @tap="$u.throttle(shareToWeChatHandle)">
				<image src="/static/imgs/mine/forward.png"></image>
				<text>分享</text>
			</view>
			<view class="btn_text" v-if="btnShow" @tap="tapGoDetail">
				<text>进入酒吧</text>
			</view>
		</view>
		<pop-share v-model="shareShow"></pop-share>
	</view>
</template>

<script>
	import loginMixins from '@/mixins/loginConfirm.js'
	export default {
		data(){
			return {
				id:-1,
				info:{
					imgList:[],
				},
				btnShow:false,
				playUrl:'',
				shareShow: false,
			}
		},
		mixins:[loginMixins],
		methods:{
			fullScreenChange(e){
				if(!e.detail.fullScreen){
					var videoContext = uni.createVideoContext("videoId", this);
					videoContext.stop()
					this.playUrl = "";
				}
			},
			videoPlayTap(index){
				this.playUrl = this.info.videoUrl;
				var vm = this;
				this.$nextTick(function(){
					var videoContext = uni.createVideoContext("videoId", vm);
					videoContext.requestFullScreen({
						// direction: 0
					});
					videoContext.play()
				})
			},
			tapGoDetail() {
				if(this.btnShow) {
					this.goClubDetail(this.info.clubId)
				}
				
			},
			async load(){
				let {code,data} = await this.$u.api.dynamicDetail(this.id)
				if(code==0) {
					this.info = data.info
					console.log(this.info)
				}
			},
			shareToWeChatHandle: function(){
				if(!this.loginConfirmHandle(false)){
					console.log('shareToWeChatHandle')
					return
				}
				this.shareShow = !this.shareShow;
			},
			async toggleLike(){
				if(!this.loginConfirmHandle(false)){
					console.log('toggleLike')
					return
				}
				if(this.info.isLike){
					let {code} = await this.$u.api.dynamicCancelLike(this.id)
					if(code==0) {
						this.info.isLike = false
						this.refreshDynamic();
					}
				}else{
					let {code} = await this.$u.api.dynamicLike(this.id)
					if(code==0) {
						this.info.isLike = true
						this.refreshDynamic();
					}
				}
			},
			refreshDynamic(){
				uni.$emit('dynamic-refresh',{msg:''})
				uni.$emit('dynamic-refresh-follow',{msg:''})
			}
		},
		onLoad(opt) {
			console.log(opt)
			this.id = opt.id
			if(opt&&opt.btnShow) {
				this.btnShow=true
			}
			this.load()
		},
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		padding-bottom: 120rpx;
		box-sizing: border-box;
		position: relative;
		.videoBox{
			position: fixed;
			left: 0rpx;
			top: 0rpx;
			z-index: -1;
			height: 100%;
			width: 100%;
			opacity: 0;
		}
		.media_box{
			width: 100%;
			height: 468rpx;
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
		.middle_box{
			width: 100%;
			padding: 30rpx 0rpx;
			.activity_info{
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				.activity_name{
					font-size: 40rpx;
					color: #FFFFFF;
					font-weight: 500;
				}
				.second_line{
					display: flex;
					align-items: center;
					line-height: 60rpx;
					.act_location{
						font-size: 26rpx;
						color: #FFFFFF;
					}
					.act_time{
						font-size: 24rpx;
						color: #A8A8CE;
						margin-left: 20rpx;
					}
				}
			}
			.act_detail {
				color: #FFFFFF;
				width: 100%;
				padding: 0 30rpx;
				text {
					color: #FFFFFF;
					font-size: 28rpx;
				}
			}
		}
		.footer_box{
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			z-index: 100;
			
			height: 120rpx;
			width: 100%;
			display: flex;
			align-items: center;
			background: $uni-title-color;
			border-top: 1px solid #31345B;
			
			.common_item{
				height: 100%;
				width: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				&>image{
					height: 32rpx;
					width: 32rpx;
				}
				&>text{
					font-size: 22rpx;
					color: #FFFFFF;
					margin-top: 10rpx;
				}
			}
			.btn_text{
				height: 80rpx;
				width: 300rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: $uni-button-color;
				font-size: 28rpx;
				color: #FFFFFF;
				border-radius: 48rpx;
				position: absolute;
				right: 30rpx;
				&>image{
					height: 30rpx;
					width: 30rpx;
					background: #FFFFFF;
					margin-right: 14rpx;
				}
			}
		}
	}
</style>
