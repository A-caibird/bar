<template>
	<view class="container">
		<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				background: '#191C3F'
			}" title="详情" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		<view class="middle_box">
			<view class="dynamic_text">
				<text>{{ dynamicInfo.content }}</text>
			</view>
			<view class="date_text">{{ dynamicInfo.time }}</view>
		</view>
		<view class="dynamic-img" v-if="dynamicInfo.imgList.length==1 && !dynamicInfo.videoUrl">
			<u-image width="100%" height="100%" :src="dynamicInfo.imgList[0]" @click="$u.throttle(previewImgList(dynamicInfo.imgList, 0))"></u-image>
		</view>
		<view class="dynamic-img" v-if="dynamicInfo.imgList.length <= 0 && dynamicInfo.videoUrl" @tap="videoPlayTap">
			<image mode="aspectFill" :src="dynamicInfo.videoCover"></image>
			<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
			<video @fullscreenchange="fullScreenChange" class="videoBox" id="videoId" :src="playUrl"></video>
		</view>
		<view class="dynamic-details" v-if="(dynamicInfo.imgList.length > 1) || (dynamicInfo.imgList.length == 1 && dynamicInfo.videoUrl)">
			<view class="dynamic-details-item" v-if="dynamicInfo.videoCover" @tap="videoPlayTap">
				<image mode="aspectFill" :src="dynamicInfo.videoCover"></image>
				<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
				<video @fullscreenchange="fullScreenChange" class="videoBox" id="videoId" :src="playUrl"></video>
			</view>
			<view class="dynamic-details-item" v-for="item,index in dynamicInfo.imgList" :key="index">
				<image :src="item" mode="aspectFill" @tap="$u.throttle(previewImgList(dynamicInfo.imgList,index))">
				</image>
			</view>
		</view>
		<view class="eva_select_list">
			<block v-for="(info, index) in commentList" :key="index">
				<view class="select_item" :class="{ active: info.isComment }">
					<text>{{ info.name }} {{ info.num>0?info.num:'' }}</text>
				</view>
			</block>
		</view>
		<view class="footer_box">
			<view class="common_item" @tap="$u.throttle(toggleLike)">
				<image src="/static/imgs/mine/like-active.png" v-if="dynamicInfo.isLike"></image>
				<image src="/static/imgs/mine/like.png" v-else></image>
				<text>{{ dynamicInfo.likeNum }}</text>
			</view>
			<view class="common_item" @tap="$u.throttle(tapOpenGift)" v-if="!isAppleAudit">
				<image src="/static/imgs/mine/gift.png"></image>
				<text>{{ dynamicInfo.giftNum }}</text>
			</view>
			<view class="common_item" @tap="$u.throttle(tapOpenComment)">
				<image src="/static/imgs/mine/comment.png" style="height: 26rpx; width: 30rpx;"></image>
				<text>{{ dynamicInfo.commentNum }}</text>
			</view>
			<view class="common_item" @tap="$u.throttle(deleteTap)" v-if="dynamicInfo.myself">
				<image src="/static/imgs/common/delete_icon.png" style="height: 32rpx; width: 32rpx;"></image>
			</view>
			<view class="common_item" @tap="$u.throttle(shareToWeChatHandle)">
				<image src="/static/imgs/mine/forward.png" style="height: 32rpx; width: 32rpx;"></image>
			</view>
		</view>
		<dynamic-comment ref="dynamicComment" @sendComment="handleSendComment"></dynamic-comment>
		<dynamic-gift ref="dynamicGift" @oepnGiftEdit="$refs.dynamicGiftEdit.open($event)"
			@openPay="openPayhandle" @sendGiftSuccess="handleSendGiftSuccess"></dynamic-gift>
		<dynamic-gift-edit ref="dynamicGiftEdit" @confirm="$refs.dynamicGift.setSendNum($event)"></dynamic-gift-edit>
		<pay ref="pay" @pay="$refs.dynamicGift.pay($event)"></pay>
		<giftAnimation ref="giftAnimation"></giftAnimation>
		<pop-share v-model="popShareShow"></pop-share>
	</view>
</template>

<script>
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	import appleAudit from '@/mixins/apple-audit.js'
	import loginMixins from '@/mixins/loginConfirm.js'
	export default {
		mixins:[appleAudit,loginMixins],
		data() {
			return {
				id: -1,
				dynamicInfo: {
					imgList: [],
				},
				commentList:[],
				playUrl:"",
				popShareShow: false,
			};
		},
		components:{
			giftAnimation
		},
		onLoad: function(options) {
			let id = options.id;
			this.id = options.id;
			this.load()
		},
		onShow:function(){
			this.getCommentList();
		},
		onUnload() {
		},
		methods: {
			openPayhandle(e){
				let password = getApp().globalData.payPassword;
				if(password){
					this.$refs.dynamicGift.pay({password});
				}else{
					this.$refs.pay.open(e);
				}
			},
			fullScreenChange(e){
				if(!e.detail.fullScreen){
					this.playUrl = "";
				}
			},
			videoPlayTap(index){
				this.playUrl = this.dynamicInfo.videoUrl;
				console.log(this.playUrl);
				var vm = this;
				this.$nextTick(() => {
					var videoContext = uni.createVideoContext("videoId", this);
					console.log(videoContext)
					videoContext.requestFullScreen({
						direction:0
					});
					videoContext.play()
				})
			},
			deleteTap(){
				var vm = this;
				uni.showModal({
					title: '提示',
					content: '是否删除该动态',
					success(res){
						if(res.confirm){
							vm.$u.api.dynamicDeleteApi(vm.id).then(res => {
								// console.log(res)
								if(parseInt(res.code) == 0){
									vm.$u.toast('成功删除');
									uni.$emit('dynamic-refresh',{msg:'dynamic-detail'})
									uni.$emit('dynamic-refresh-follow',{msg:'dynamic-detail'})
									setTimeout(() => {
										uni.navigateBack({
											delta:1
										})
									}, 900)
								}
							}).catch(e => {
								console.log(e);
							})
						}
					}
				})
			},
			shareToWeChatHandle(){
				if(!this.loginConfirmHandle(false)){
					return ;
				}
				// this.shareSystem();
				this.popShareShow = true;
			},
			async getCommentList() {
				if(!this.authorized){
					return ; 
				}
				let params = {
					id: this.id
				};
				let {code,data} = await this.$u.api.commentStateApi(params)
				if(code==0) {
					let {list} = data;
					let commentList = []
					list.forEach(e=>{
						if(e.isComment||e.num>0) {
							commentList.push(e)
						}
					})
					this.commentList = commentList;
				}
			},
			handleSendComment() {
				uni.$emit('dynamic-refresh',{msg:'dynamic-detail'})
				uni.$emit('dynamic-refresh-follow',{msg:'dynamic-detail'})
				this.refreshDynamic();
			},
			handleSendGiftSuccess(e) {
				if(e.gifUrl) {
					this.$refs.giftAnimation.show(e.gifUrl)
				}
				this.handleSendComment();
			},
			load() {
				this.getDynamicDetail();
			},
			async tapOpenGift() {
				if(!this.loginConfirmHandle(false)){
					console.log('tapOpenGift')
					return ;
				}
				this.$refs.dynamicGift.open({
					dynamicId: this.id
				})
			},
			tapOpenComment() {
				if(!this.loginConfirmHandle(false)){
					console.log('tapOpenComment')
					return ;
				}
				this.$refs.dynamicComment.open({
					id: this.id
				})
			},
			refreshDynamic(e) {
				this.getDynamicDetail();
				this.getCommentList();
			},
			async toggleLike() {
				if(!this.loginConfirmHandle(false)){
					return ;
				}
				if (this.dynamicInfo.isLike) {
					let {
						code
					} = await this.$u.api.dynamicCancelLike(this.id)
					if (code == 0) {
						this.handleSendComment();
					}
				} else {
					let {
						code
					} = await this.$u.api.dynamicLike(this.id)
					if (code == 0) {
						this.handleSendComment();
					}
				}
			},

			// 动态详情
			async getDynamicDetail() {
				let {
					code,
					data
				} = await this.$u.api.dynamicDetail(this.id)
				if (code == 0) {
					this.dynamicInfo = data.info;
					this.$forceUpdate()
				}
			},


		}
	};
</script>

<style lang="scss">
	.u-drawer-bottom {
		background: transparent !important;
	}

	.container {
		width: 100%;
		padding-bottom: 120rpx;
		box-sizing: border-box;

		.dynamic-img {
			width: 100%;
			height: 468rpx;
			image {
				width: 100%;
			}
			position: relative;
			.play_icon{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				height: 120rpx;
				width: 120rpx;
			}
		}
		.dynamic-details {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			.dynamic-details-item {
				width: 250rpx;
				height: 250rpx;
				padding: 2rpx;
				position: relative;
				image {
					width: 100%;
					height: 100%;
				}
				.play_icon{
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					height: 80rpx;
					width: 80rpx !important;
				}
			}
		}
		.videoBox{
			position: absolute;
			left: 0rpx;
			top: 0rpx;
			z-index: -1;
			height: 0rpx;
			width: 0rpx;
			opacity: 0;
		}

		.swiper_box {
			width: 100%;
			height: 340rpx;
		}

		.middle_box {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			padding: 30rpx 0rpx;

			.dynamic_text {
				font-size: 30rpx;
				color: #ffffff;
				line-height: 42rpx;
			}

			.date_text {
				font-size: 22rpx;
				color: #a2a6d9;
				margin-top: 20rpx;
			}
		}
		.eva_select_list {
				
			display: flex;
			flex-wrap: wrap;
			padding: 20rpx  6rpx 20rpx 30rpx;
			.select_item {
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 30rpx;
				padding: 0 30rpx;
				margin-right: 24rpx;
				margin-top: 24rpx;
				color: #ffffff;
				font-size: 24rpx;
				background: #535389;
			
				&.active {
					background: $uni-button-color;
				}
			}
		}
				
		.footer_box {
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			z-index: 100;
			background: #10133a;
			height: 90rpx;
			width: 100%;
			display: flex;
			align-items: center;
			// background: $uni-title-color;
			// border-top: 1px solid #31345B;
			// padding: 0 30rpx;
			box-sizing: border-box;

			.common_item {
				height: 100%;
				margin-left: 30rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				&>image {
					height: 32rpx;
					width: 32rpx;
				}

				&>text {
					font-size: 22rpx;
					color: #ffffff;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>
