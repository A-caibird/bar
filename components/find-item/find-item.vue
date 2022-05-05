<template>
	<view class="club_item_box">
		<view class="user_header" v-if="userShow">
			<view class="header_left"  @tap.stop="$u.throttle(goPersonalHomepageHandle(info.userId,info.myself))">
				<image :src="info.avatar"></image>
			</view>
			<view class="header_right">
				<view class="first_line">
					<view class="user_name"  @tap.stop="$u.throttle(goPersonalHomepageHandle(info.userId,info.myself))">
						<text>{{ info ? info.nickName : ""}}</text>
						<block v-if="info.sex">
							<image v-if="info.sex == '女'" src="/static/imgs/register/female_icon.png" mode=""></image>
							<image v-else src="/static/imgs/register/male_icon.png" mode=""></image>
						</block>
						<view class="class_panel">
							<image src="/static/imgs/mine/class_icon2.png"></image>
							<text>{{info.userRank}}</text>
						</view>
					</view>
					<view class="find_location">
						<image src="/static/imgs/common/location.png"></image>
						<text>{{info ? info.distance : ""}}</text>
					</view>
				</view>
				<view class="second_line">
					<view class="time_text" @tap.stop="$u.throttle(goPersonalHomepageHandle(info.userId,info.myself))"> <text>{{info.time}}</text> </view>
					<view class="icon_box" @tap.stop="reportTap(info)">
						<u-icon name="more-dot-fill" color="#ffffff" size="40"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="media_box" :class="{'personType': personType}">
			<view class="media_text">
				<text>{{info.content}}</text>
			</view>
			<view class="media_content">
				<view class="single_video_box" v-if="info.videoUrl">
					<commonVideo @videoPlayTap="videoPlayTap" :src="info.videoUrl"></commonVideo>
				</view>
				<block v-else>
					<view class="multi_img_box" v-if="info.imgList.length > 1">
						<block v-for="(item, index) in info.imgList" :key="index">
							<view class="multi_img_panel" :class="{'marginTop': index > 2, 'marginRight': (index + 1) % 3 != 0 }" v-if="index < 9">
								<u-image mode="aspectFill" width="100%" height="100%" :src="item" @click="previewTap(item)"></u-image>
							</view>
						</block>
					</view>
					<view class="single_img_box" v-if="info.imgList.length == 1">
						<image mode="heightFix":src="info.imgList[0]" @tap="previewTap(info.imgList[0])"></image>
					</view>
				</block>
			</view>
		</view>
		<!-- <view class="club_img" @tap.stop="" v-if=" (info.videoUrl && info.imgList.length >= 1) || info.imgList.length > 1">
			<swiper class="swiper_box" :indicator-dots="true" indicator-color="#CCCCCC" indicator-active-color="#FFFFFF">
				<swiper-item v-if="info.videoUrl">
					<u-image width="100%" height="100%" class="dy_img" :src="info.videoCover" @click="$u.route('/pages/discovery/dynamic_detail?id=' + info.id)"></u-image>
					<image class="play_icon" src="/static/imgs/common/play_icon.png" @click="$u.route('/pages/discovery/dynamic_detail?id=' + info.id)"></image>
				</swiper-item>
				<block v-for="(item, index) in info.imgList" :key="index">
					<swiper-item>
						<u-image width="100%" height="100%" class="dy_img" :src="item" @click="$u.route('/pages/discovery/dynamic_detail?id=' + info.id)"></u-image>
					</swiper-item>
				</block>
			</swiper>
		</view>
		<view class="club_img" @tap.stop="" v-if="info.imgList.length == 1 && !info.videoUrl">
			<u-image width="100%" height="100%" :src="info.imgList[0]" @click="$u.route('/pages/discovery/dynamic_detail?id=' + info.id)"></u-image>
		</view>
		<view class="club_img" @tap.stop="$u.route('/pages/discovery/dynamic_detail?id=' + info.id)" v-if="info.videoUrl && info.imgList.length <= 0">
			<u-image class="dy_img" width="100%" height="100%" :src="info.videoCover"></u-image>
			<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
		</view> -->
		<view class="club_footer" :class="{'personType': personType}">
			<view class="club_labels" v-if="info.labelList.length > 0">
				<block v-for="(item, index) in info.labelList" :key="index">
					<view class="commom_label"> <text>{{item}}</text> </view>
				</block>	
			</view>
			<view class="feature_box" :class="{'right': personType}">
				<view style="display: flex;">
					<view class="common_item" @tap.stop="$u.throttle(toggleLike)"> <!-- @tap.stop="toggleLike" -->
						<image src="/static/imgs/mine/like-active.png" v-if="info.isLike"></image>
						<image src="/static/imgs/mine/like.png" v-else></image>
						<text>{{info.likeNum}}</text>
					</view>
					<view class="common_item" @tap.stop="$u.throttle(tapOpenGift)" v-if="showPercent">
						<image src="/static/imgs/mine/gift.png"></image>
						<text>{{info.giftNum}}</text>
					</view>
					<view class="common_item" @tap.stop="$u.throttle(tapOpenComment)">
						<image src="/static/imgs/mine/comment.png"></image>
						<text>{{info.commentNum}}</text>
					</view>
					<view class="common_item hideMarginRight" @tap.stop="$u.throttle(shareToWeChatHandle)"><image src="/static/imgs/mine/forward.png" mode=""></image></view>
				</view>
				
				<!-- <view style="display: flex;" v-if="!info.myself&&showPercent">
					<view class="feature_btn" style="margin-right: 38rpx;" @tap.stop="showYaoyue">
						<image src="/static/imgs/common/club-white.png"></image>
						<text>尬酒</text>
					</view>
					<view class="feature_btn" @tap.stop="showPing">
						<image src="/static/imgs/common/club_share.png"></image>
						<text>拼享</text>
					</view>
				</view> -->
				<view style="display: flex;" v-if="!info.myself && showPercent && !personType">
					<view class="feature_btn" @tap.stop="$u.throttle(tapAwkwardWine)">
						<image src="/static/imgs/common/club-white.png"></image>
						<text>尬酒</text>
					</view>
				</view>
			
			</view>
		</view>
	</view>
</template>

<script>
	import loginMixins from '@/mixins/loginConfirm.js'
	import commonVideo from '@/components/common-video/common-video.vue'
	export default {
		components:{
			commonVideo
		},
		mixins:[loginMixins],
		props:{
			info: {
				type: Object,
				default: null
			},
			mode:{//follow 关注的动态 nearby 附件动态
				type:String,
				default:'follow',
			},
			showPercent:{
				type:Boolean,
				default:false,
			},
			userShow:{
				type: Boolean,
				default: true
			},
			personType: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				praise: false,
			}
		},
		mounted() {
		},
		methods:{
			reportTap(info){
				this.$emit('reportTap', info);
				// this.goPage('/pages/discovery/report?id=' + info.id)
			},
			videoPlayTap(e){
				this.$emit('videoPlayTap', e);
			},
			previewTap(img){
				uni.previewImage({
					urls: this.info.imgList,
					current: img
				})
			},
			goPage(url){
				this.$nav.navigateTo({url});
			},
			goPersonalHomepageHandle(url){
				if(!this.loginConfirmHandle(false)){
					console.log('goPersonalHomepageHandle')
					return ;
				}
				this.goPersonalHomepage(url);
			},
			shareToWeChatHandle(){
				if(!this.loginConfirmHandle(false)){
					console.log('shareToWeChatHandle')
					return ;
				}
				this.$emit('shareTap');
			},
			tapOpenGift(){
				if(!this.loginConfirmHandle(false)){
					console.log('tapOpenGift')
					return ;
				}
				this.$emit('oepnGift',{dynamicId:this.info.id})
			},
			tapOpenComment(){
				if(!this.loginConfirmHandle(false)){
					console.log('tapOpenComment')
					return ;
				}
				this.$emit('oepnComment',{id:this.info.id})
			},
			async toggleLike(){
				if(!this.loginConfirmHandle(false)){
					console.log('toggleLike')
					return ;
				}
				if(this.info.isLike){
					let {code} = await this.$u.api.dynamicCancelLike(this.info.id)
					if(code==0) {
						this.info.isLike = false
						this.info.likeNum --
						this.$forceUpdate()
						this.refreshDynamic();
					}
				}else{
					let {code} = await this.$u.api.dynamicLike(this.info.id)
					if(code==0) {
						this.info.isLike = true
						this.info.likeNum ++
						this.$forceUpdate()
						this.refreshDynamic();
					}
				}
			},
			refreshDynamic(){
				uni.$emit('dynamic-refresh',{msg:this.mode})
				uni.$emit('dynamic-refresh-follow',{msg:this.mode})
			},
			tapGoDetail(){
				this.$u.route('/pages/discovery/dynamic_detail?id='+this.info.id)
			},
			tapAwkwardWine(){
				if(!this.loginConfirmHandle(false)){
					return ;
				}
				this.$u.route('/pages/ping-yao-list/ping-yao-list',{
					dynamicInfo:encodeURIComponent(JSON.stringify(this.info))
				})
			},
			showYaoyue(){
				this.$emit('showYaoyue',this.info)
			},
			showPing(){
				this.$emit('showPing',this.info)
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.club_item_box{
		width: 100%;
		.user_header{
			width: 100%;
			padding: 30rpx 30rpx 0rpx 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			.class_panel {
				padding: 0 20rpx;
				line-height: 36rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 18rpx;
				margin-left: 20rpx;
				background: linear-gradient(148deg, #7341B9 0%, #333EC2 100%);
			
				&>image {
					height: 16rpx;
					width: 18rpx;
				}
			
				&>text {
					font-size: 20rpx;
					color: #FFFFFF;
					font-weight: bold;
					height: 30rpx;
					line-height: 36rpx;
				}
			}
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
							max-width: 160rpx;
							@include simpleOmit();
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
		.club_header{
			width: 100%;
			height: 120rpx;
			padding: 0 30rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header_left{
				display: flex;
				align-items: center;
				.club_name{
					font-size: 34rpx;
					color: #FFFFFF;
				}
			}
			.header_right{
				.club_location{
					display: flex;
					align-items: center;
					&>image{
						height: 24rpx;
						width: 24rpx;
						background: #FFFFFF;
					}
					&>text{
						font-size: 24rpx;
						color: #FFFFFF;
						margin-left: 4rpx;
					}
				}
			}
		}
		.media_box{
			width: 100%;
			box-sizing: border-box;
			padding: 0 30rpx;
			&.personType{
				padding-top: 20rpx;
			}
			.media_text{
				width: 100%;
				line-height: 40rpx;
				max-height: 80rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				@include ellipsis(2);
				margin-bottom: 20rpx;
			}
			.media_content{
				width: 100%;
				.multi_img_box{
					width: 100%;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					.multi_img_panel{
						height: 216rpx;
						width: 216rpx;
						&.marginTop{
							margin-top: 20rpx;
						}
						&.marginRight{
							margin-right: 20rpx;
						}
					}
				}
				.single_img_box{
					height: 600rpx;
					width: 100%;
					&>image{
						height: 100%;
						width: 100%;
					}
				}
				.single_video_box{
					height: 600rpx;
					width: 100%;
					border-radius: 10rpx;
					overflow: hidden;
				}
			}
		}
		.club_img{
			width: 100%;
			height: 468.75rpx;
			&>image{
				height: 100%;
				width: 100%;
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
		.club_footer{
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			&.personType{
				padding: 30rpx 30rpx 20rpx 30rpx;
			}
			.club_labels{
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 26rpx;
				margin-bottom: 20rpx;
				.commom_label{
					height: 40rpx;
					@include flex-center();
					border: 1px solid #565B86;
					font-size: 20rpx;
					color: #B3BAEF;
					padding: 0 10rpx;
					border-radius: 2rpx;
					margin-right: 10rpx;
					margin-bottom: 10rpx;
				}
			}
			.feature_box{
				height: 60rpx;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				&.right{
					justify-content: flex-end;
				}
				.common_item{
					display: flex;
					align-items: center;
					margin-right: 38rpx;
					&>image{
						height: 30rpx;
						width: 30rpx;
					}
					&>text{
						font-size: 22rpx;
						color: #FFFFFF;
						margin-left: 10rpx;
					}
					&.hideMarginRight{
						margin-right: 0rpx;
					}
				}
				.feature_btn{
					display: flex;
					align-items: center;
					justify-content: center;
					height: 60rpx;
					width: 170rpx;
					// position: absolute;
					// right: 0rpx;
					background: $uni-button-color;
					border-radius: 30rpx;
					&>image{
						height: 28rpx;
						width: 22rpx;
						margin-right: 10rpx;
					}
					&>text{
						font-size: 28rpx;
						color: #FFFFFF;
					}
				}
			}
		}
	}
</style>
