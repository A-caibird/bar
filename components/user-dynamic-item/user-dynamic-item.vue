<template>
	<view class="club_item_box" @tap="$u.route('pages/discovery/dynamic_detail?id=' + info.id)">
		<view class="media_box">
			<view class="media_text">
				<text>{{info.content}}</text>
			</view>
			<view class=""></view>
		</view>
		<view class="club_footer">
			<view class="feature_box">
				<view style="display: flex; justify-content: flex-end; align-items: center;">
					<view class="common_item" @tap.stop="$u.throttle(toggleLike)"> <!-- @tap.stop="toggleLike" -->
						<image src="/static/imgs/mine/like-active.png" v-if="info.isLike"></image>
						<image src="/static/imgs/mine/like.png" v-else></image>
						<text>{{info.likeNum}}</text>
					</view>
					<view class="common_item" @tap.stop="$u.throttle(tapOpenGift)">
						<image src="/static/imgs/mine/gift.png"></image>
						<text>{{info.giftNum}}</text>
					</view>
					<view class="common_item" @tap.stop="$u.throttle(tapOpenComment)">
						<image src="/static/imgs/mine/comment.png"></image>
						<text>{{info.commentNum}}</text>
					</view>
					<view class="common_item" style="margin-right: 0rpx;" @tap.stop="$u.throttle(shareToWeChatHandle)"><image src="/static/imgs/mine/forward.png" mode=""></image></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import loginMixins from '@/mixins/loginConfirm.js'
	export default{
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
			showPercent:{//follow 关注的动态 nearby 附件动态
				type:Boolean,
				default:false,
			},
		},
		data() {
			return {
				praise: false,
				playUrl: '',
			}
		},
		mounted() {
			this.playUrl = this.info.videoUrl;
		},
		methods:{
			goPage(url){
				this.$nav.navigateTo({url});
			},
			shareToWeChatHandle(){
				if(!this.loginConfirmHandle(false)){
					console.log('shareToWeChatHandle')
					return ;
				}
				// this.shareToWeChat();
				// this.shareSystem();
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
				console.log(this.info)
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
					// console.log('clickEvent')
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
		.videoBox{
			position: fixed;
			left: 0rpx;
			top: 0rpx;
			z-index: -1;
			height: 100%;
			width: 100%;
			opacity: 0;
		}
		.club_intro{
			width: 100%;
			line-height: 40rpx;
			max-height: 80rpx;
			font-size: 30rpx;
			color: #FFFFFF;
			@include ellipsis(2);
		}
		.club_footer{
			width: 100%;
			padding: 30rpx;
			box-sizing: border-box;
			.feature_box{
				height: 60rpx;
				width: 100%;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				position: relative;
				margin-top: 20rpx;
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
				}
			}
		}
	}
</style>
