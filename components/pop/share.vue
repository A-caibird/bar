<template>
	<view class="pop_box" :class="{'show': popShow}">
		<view class="mask_box" @tap.stop="noneEvent" v-if="isMask"></view>
		<view class="pop_panel" :class="{'show': popShow}">
			<view class="pop_content">
				<view class="title">分享至</view>
				<view class="share_box">
					<view class="share_item" @tap.stop="shareTap('wechat')">
						<view class="share_icon">
							<image src="/static/imgs/share/wechat.png"></image>
						</view>
						<view class="share_text">微信</view>
					</view>
					<view class="share_item" @tap.stop="shareTap('circle')">
						<view class="share_icon">
							<image src="/static/imgs/share/wechat-circle.png"></image>
						</view>
						<view class="share_text">朋友圈</view>
					</view>
					<view class="share_item" @tap.stop="shareTap('QQ')">
						<view class="share_icon">
							<image src="/static/imgs/share/QQ.png"></image>
						</view>
						<view class="share_text">QQ</view>
					</view>
					<view class="share_item" @tap.stop="shareTap('weibo')">
						<view class="share_icon">
							<image src="/static/imgs/share/weibo.png"></image>
						</view>
						<view class="share_text">微博</view>
					</view>
				</view>
				<view class="btn_box">
					<view class="common_btn" @tap="hide">取消</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import shareJS from '@/utils/share.js'
	export default {
		model:{
			prop: "popShow",
			event: 'showChange'
		},
		props: {
			isMask:{
				type:Boolean,
				default: true
			},
			popShow: {
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				
			}
		},
		methods:{
			shareTap(type){
				this.$u.throttle(() => {
					var vm = this;
					let callback = function(){
						vm.hide();
					};
					console.log(type);
					switch(type){
						case 'wechat': {
							shareJS.shareWeChat('WXSceneSession', callback)
						};break;
						case 'circle': {
							shareJS.shareWeChat('WXSceneTimeline', callback)
						};break;
						case 'QQ': {
							shareJS.shareQQ(callback)
						};break;
						case 'weibo': {
							shareJS.shareWeiBo(callback)
						};break;
						default:console.log(type);break;
					}
				})
			},
			show(){
				let popShow = true;
				this.$emit('showChange', popShow);
			},
			hide(){
				let popShow = false;
				this.$emit('showChange', popShow);
			},
			noneEvent(){
				this.hide();
			}
		}
	}
</script>

<style lang="scss">
	.pop_box{
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		height: 100%;
		width: 100%;
		z-index: -1;
		opacity: 0;
		transition: all 0.3s;
		&.show{
			opacity: 1;
			z-index: 210;
		}
		.mask_box{
			height: 100%;
			width: 100%;
			background: rgba(11, 13, 34, 0.6);
			position: relative;
			z-index: 5;
		}
		.pop_panel{
			position: absolute;
			left: 0rpx;
			bottom: -406rpx;
			z-index: 10;
			width: 100%;
			opacity: 0;
			transition: all 0.3s;
			&.show{
				bottom: 0rpx;
				opacity: 1;
			}
			.pop_content{
				background: #161821;
				box-sizing: border-box;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
				box-sizing: content-box;
				.title{
					text-align: center;
					font-size: 30rpx;
					color: #666666;
					padding: 40rpx 0rpx;
				}
				.share_box{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-around;
					.share_item{
						display: flex;
						align-items: center;
						flex-direction: column;
						justify-content: center;
						.share_text{
							font-size: 26rpx;
							color: #666666;
							margin-top: 6rpx;
						}
						.share_icon{
							height: 100rpx;
							width: 100rpx;
							border: 1px solid #666666;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							&>image{
								height: 50rpx;
								width: 50rpx;
							}
						}
					}
					
				}
				.btn_box{
					width: 100%;
					margin-top: 40rpx;
					border-top: 1px solid #666666;
					.common_btn{
						height: 100rpx;
						line-height: 100rpx;
						text-align: center;
						color: #666666;
					}
				}
			}
		}
		
	}
</style>
