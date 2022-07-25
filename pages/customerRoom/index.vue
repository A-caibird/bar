<template>
	<view class="wrapper" :style="{'paddingBottom': (0 + 'px')}">
		<u-navbar :title="title" :customBack="customBackEvent"></u-navbar>
		<view :style="{height: (swiperHeight) + 'px'}">
			<scroll-view class="scroll_view" :scroll-y="true"
				:style="{height: (scrollHeightCal)+'px', 'overflow-anchor': 'auto',}" 
				@scrolltoupper="loadMoreChatList"
				@scrolltolower="reachBottom" 
				:scroll-into-view="scrollIntoView"
				:refresher-threshold="50"
				@scroll="scrollIntoView = ''"
				>
				<view v-if="loadPage" class="page-load">加载中...</view>
				<view :id="'chat'+ index" v-for="(item,index) in pageList" :key="item.messageId">
					<view class="chat_item">
						<chatItem 
							:lastDate="index > 0 ? pageList[index - 1].timestamp : -1"
							:userInfo="userData"
							:toUserInfo="toUserInfo"
							:msg="item"
							@videoTap="videoTap"
						></chatItem>
					</view>
				</view>
			</scroll-view>
			<view class="bottom-wrapper keyboard">
				<view class="bottom-container">
					<view class="input-container">
						<template>
							<input type="text" @focus="inputFocus" class="input" confirm-type="send" v-model="message" @confirm="judgePullback"/>
						</template>
					</view>
					<view class="bottom_add" @tap="emojiShow = !emojiShow; popShow = false;">
						<image class="bottom_icon" src="/static/imgs/chat/emoji.png"></image>
					</view>
					<view class="bottom_add" style="height: 58rpx; width: 58rpx;" @tap="popShow = !popShow; emojiShow = false;">
						<image class="bottom_icon" src="/static/imgs/chat/add.png"></image>
					</view>
					<view class="bottom-btn" hover-class="hover-class" hover-stay-time="300"
						@touchend.prevent="judgePullback">发送</view>
				</view>
				<view class="pop_box upload" :class="{'hidden': !popShow}" v-if="popShow">
					<view class="upload_type_list">
						<view class="upload_item" @tap.stop="sendPhoto('photo')">
							<image src="/static/imgs/chat/album.png"></image>
							<text>图片</text>
						</view>
						<view class="upload_item marginLeft" @tap.stop="sendPhoto('camera')">
							<image src="/static/imgs/chat/photograph.png"></image>
							<text>拍照</text>
						</view>
					</view>
				</view>
				<view class="pop_box emoji" :class="{'hidden': !emojiShow}">
					<scroll-view class="emoji_list" :scroll-y="true">
						<view class="emoji_box">
							<block v-for="(item, index) in emojiList" :key="index">
								<view class="emoji_item" @tap.stop="emojiTap(index)">
									<text style="font-size: 50rpx;" class="emoji_text">{{item.emoji}}</text>
								</view>
							</block>
						</view>
					</scroll-view>
					<view class="emoji_btn" v-if="emojiShow">
						<view class="btn_item" @tap.stop="subTextHandle">
							<image src="/static/imgs/chat/tuige.png"></image>
						</view>
						<view class="btn_item" style="margin-left: 20rpx;" @tap="$u.debounce(judgePullback, 300, true)">
							<text>发送</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<video :direction="0" @fullscreenchange="fullScreenChange" class="videoBox" id="videoId" v-if="playUrl" :src="playUrl"></video>
	</view>
</template>

<script>
	const app = getApp()
	import chatItem from '@/components/chatInfo/chatInfo.vue'
	import $storage from '@/common/storage.js'
	import chatUtils from '@/utils/chatJS/chat.js'
	import {emojiList} from '@/utils/chatJS/emoji.js'
	import $store from '@/store/index.js'
	export default {
		data() {
			return {
				playUrl: '',
				chatConnect: false,
				emojiList: emojiList,
				loadPage: false,
				popShow: false,
				emojiShow: false,
				swiperHeight: '',
				scrollIntoView: '',
				scrollHeight: '',
				keyBoardHeight: 0,
				tabbarTop: '',
				message: '',
				channel: '',
				userData: '',
				newChatList: [],
				toUserInfo: "",
				title: '客服',
				// 分页数据
				loading:false,
				more: true,
				pageNumber: 0,
				pageSize: 20,
				totalPages: 1,
				pageList:[],
			};
		},
		components: {
			chatItem
		},
		watch: {
			// "scrollIntoView"(newValue, oldValue) {
				
			// }
		},
		computed:{
			scrollHeightCal:function(){
				this.scrollToBottom();
				if(this.keyBoardHeight > 0){
					return (this.scrollHeight - this.keyBoardHeight);
				}
				if(this.popShow){
					return (this.scrollHeight - uni.upx2px(340));
				}
				if(this.emojiShow){
					return (this.scrollHeight - uni.upx2px(340));
				}
				return this.scrollHeight;
			}
		},
		onLoad(options) {
			let {
				windowHeight,
				statusBarHeight,
				screenHeight,
				safeArea,
			} = uni.getSystemInfoSync()
			// console.log(screenHeight);
			// console.log(safeArea);
			this.statusBarHeight = statusBarHeight
			this.windowHeight = windowHeight
			this.swiperHeight = safeArea.bottom - statusBarHeight - uni.upx2px(88);
			this.scrollHeight = safeArea.bottom - statusBarHeight - uni.upx2px(188)
			this.tabbarTop = statusBarHeight + uni.upx2px(88)
			uni.onKeyboardHeightChange(res => { //监听键盘高度
				this.keyBoardHeight = res.height
				if(res.height > 0){
					this.scrollIntoView = "chat" + (this.pageList.length - 1);
					this.$nextTick(() => {
						this.scrollIntoView = "";
					})
				}
			})
			this.toUserInfo = options;
			this.title = options.nickname || '暂无客服';
			$store.commit('disconnectGoEasy', {
				callback: () => {
					if(options.id){
						this.$nextTick(() => {
							this.getUserInfo();
						})
					}
				}
			});
		},
		onShow() {

		},
		onHide() {

		},
		onUnload() {
			
		},
		methods: {
			customBackEvent(){
				if(this.chatConnect){
					this.disconnect(() => {
						setTimeout(() => {
							let userInfo = $storage.getUserInfo();
							let info = {
								chatId: userInfo.chatToken,
								callback:function(){
								}
							}
							$store.commit('connetGoEasy',info);
						}, 500)
					});
					uni.navigateBack({
						delta:1
					})
				}
			},
			fullScreenChange(e){
				if(!e.detail.fullScreen){
					this.playUrl = "";
				}
			},
			videoTap(e){
				this.playUrl = e.url;
				var vm = this;
				this.$nextTick(function(){
					var videoContext = uni.createVideoContext("videoId", vm);
					videoContext.requestFullScreen({
						direction: 0
					});
					videoContext.play()
				})
			},
			scrollToBottom: function(){
				this.scrollIntoView = "";
				this.$nextTick(() => {
					this.scrollIntoView = "chat" + (this.pageList.length - 1)
				})
			},
			subTextHandle: function(){
				var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
				let lastStr = this.message.substr(this.message.length-2, 2);
				if(regRule.test(lastStr)){
					this.message = this.message.substr(0, (this.message.length - 2));
				}else{
					this.message = this.message.substr(0, (this.message.length - 1));
				}
			},
			inputFocus: function(){
				this.emojiShow = false;
				this.popShow = false;
			},
			emojiTap: function(index){
				this.message = this.message + emojiList[index].emoji;
			},
			// 获取个人信息
			getUserInfo: function() {
				this.$u.api.getMyInfo({}).then((res)=>{
					if(parseInt(res.code) == 0) {
						this.userData = res.data.info;
						this.channel = res.data.info.id;
						this.$nextTick(() => {
							this.initChatInfo();
						})
					}
				}).catch(err=>{
					console.log('获取用户异常')
					console.log(err);
				})
			},
			reachBottom: function(){
				// console.log("上拉刷新");
				// this.pageNumber = this.pageNumber + 1;
				// this.$nextTick(() => {
				// 	this.getChatList();
				// })
			},
			loadMoreChatList: function() {
				console.log('下拉加载');
				this.loadPage = true;
				this.pageNumber = this.pageNumber + 1;
				setTimeout(() => {
					this.loadPage = false;
				}, 1200)
			},
			// 初始化 chatInfo
			initChatInfo: function() {
				let userInfo = this.userData;
				let toUserInfo = this.toUserInfo;
				let info = {
					token: app.globalData.token,
					userInfo: {
						id: userInfo.id,
						nickname: userInfo.nickName,
						avatar: userInfo.avatar,
					},
					toUserInfo: { // 被发送人信息
						id: toUserInfo.id,
						avatar: toUserInfo.avatar,
						nickname: toUserInfo.nickname
					}
				};
				chatUtils.initChat(this.goeasy, info.token, info.userInfo, this.channel, info.toUserInfo);
				this.getChatList(() => {
					this.connect();
				});
			},
			// 获取聊天列表
			async getChatList(callback = null) {
				let url = '/api/chatMessage/historyList';
				let pageNumber = this.pageNumber;
				let pageSize = this.pageSize;
				let totalPages = this.totalPages;
				if (url) {
					
					if (pageNumber > totalPages) {
						this.more = false;
						if(callback){
							callback();
						}
						return console.log('最后一页')
					}
					let params = {
						chatUserId: this.toUserInfo.id,
						myUserId: this.userData.id,
						pageNumber,
						pageSize,
					}
					if(pageNumber >= 2){
						params['timestamp'] = this.pageList[this.pageList.length - 1].timestamp;
					}
					this.loading = true;
					let {code,data} = await this.$u.api.commonRequest(url, params)
					if(code==0) {
						let pageList = this.pageList
						let chatList = data.list;
						chatList = chatList.reverse();
						if (pageNumber <= 1) {
							pageList = chatList
						} else {
							pageList = pageList.concat(chatList);
						}
						this.pageList = pageList;
						this.totalPages = data.totalPage;
						this.scrollToBottom();
					}
					this.$nextTick(() => {
						this.loading = false;
					})
					if(callback){
						callback();
					}
				}
			},
			// 获取消息
			receiveMsg: function() {
				chatUtils.receiveMessage((chatInfo, msg) => {
					if(msg.type == 'endThisChat'){
						uni.showModal({
							title: '提示',
							content: '本次服务已结束，感谢您的配合',
							showCancel: false,
							success(res) {
								if(res.confirm){
									uni.navigateBack({
										delta:1
									})
								}
							}
						})
						return;
					}
					let pageList = this.pageList;
					let canJoin = true;
					pageList.forEach((item, index) => {
						if(item.messageId == msg.messageId){
							canJoin = false;
						}
					})
					if(canJoin){
						pageList.push(msg);
					}
					// let pageList = this.pageList;
					// pageList.push(msg);
					this.pageList = pageList;
					this.$nextTick(() => {
						this.scrollIntoView = "chat" + (pageList.length - 1)
					})		
				});
			},
			// 连接客服
			connect: function() {
				uni.showLoading({
					title: '连接中'
				})
				chatUtils.connectChat(() => {
					console.log('链接成功');
					this.receiveMsg();
					this.chatConnect = true;
					setTimeout(() => {
						uni.hideLoading();
					}, 400)
				});
			},
			disconnect: function(callback = null) {
				chatUtils.disconnectChat(callback);
			},
			// 发送文字
			judgePullback: function() {
				let message = this.message;
				this.sendMsg(message);
				this.message = "";
				this.emojiShow = false
			},
			// 发送图片
			sendPhoto: function(type){
				let  chooseType = "";
				if(type == 'photo'){
					chooseType = ['album'];
				}else{
					chooseType = ['camera'];
				}
				uni.chooseImage({
					sourceType: chooseType,
					success: (res) => {
						this.sendMsg(res, 1);
						this.popShow = false;
					},
					fail: (e) => {
						console.log(e);
						console.log('图片获取失败');
					}
				})
			},
			sendMsg: function(message, type=0) {
				chatUtils.sendMsg(message, (chatInfo, msg) => {
					let pageList = this.pageList;
					pageList.push(msg);
					this.pageList = pageList;
					this.scrollToBottom();
				},type);

			}
		},

	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #FAFAFA;
	}
	$base-color: '#191C3F';
	.scroll_view {
		width: 100%;
		background-color: #F5F5F5;
		overflow: hidden;
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
	.bottom-wrapper {
		position: relative;
		width: 100%;
		transition: all, 0.3s;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		&.keyboard {
			position: fixed;
			left: 0rpx;
			z-index: 100;
			bottom: 0rpx;
		}
	}
	.pop_box{
		width: 100%;
		height: 340rpx;
		background: #F5F5F5;
		box-sizing: border-box;
		padding: 50rpx 30rpx;
		display: flex;
		// align-items: center;
		flex-wrap: wrap;
		position: relative;
		&.emoji{
			padding: 30rpx 24rpx;
		}
		&.upload{
			padding: 30rpx;
		}
		.upload_type_list{
			height: 100%;
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			.upload_item{
				height: 140rpx;
				width: 140rpx;
				display: flex;
				align-items: center;
				flex-direction: column;
				position: relative;
				&.marginLeft{
					margin-left: 40rpx;
				}
				margin-bottom: 20rpx;
				&>image{
					height: 90rpx;
					width: 90rpx;
				}
				&>text{
					// position: absolute;
					// bottom: 0rpx;
					// left: 0rpx;
					// z-index: 10;
					line-height: 40rpx;
					text-align: center;
					width: 100%;
					margin-top: 10rpx;
				}
			}
		}
		.emoji_list{
			height: 100%;
			width: 100%;
			overflow: hidden;
			white-space: nowrap;
			.emoji_box{
				width: 100%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				box-sizing: border-box;
				padding-bottom: 80rpx;
			}
			.emoji_item{
				height: 60rpx;
				width: 60rpx;
				line-height: 60rpx;
				text-align: center;
				margin: 20rpx;
			}
		}
		.emoji_btn{
			height: 70rpx;
			width: 240rpx;
			position: absolute;
			right: 0rpx;
			bottom: 30rpx;
			display: flex;
			align-items: center;
			background: #F5F5F5;
			.btn_item{
				width: 100rpx;
				height: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #FFFFFF;
				border-radius: 6rpx;
				&>image{
					height: 40rpx;
					width: 40rpx;
				}
			}
		}
		.close_img{
			height: 40rpx;
			width: 40rpx;
			position: absolute;
			right: 30rpx;
			top: 10rpx;
		}
		&.hidden{
			height: 0rpx;
			padding: 0rpx;
		}
		transition: all 0.3s;
		.pop_item{
			height: 100rpx;
			width: 100rpx;
			margin: 0 30rpx;
			border-radius: 10rpx;
			overflow: hidden;
			white-space: nowrap;
			.pop_icon{
				height: 100%;
				width: 100%;
			}
		}
	}
	.bottom-container {
		width: 100%;
		height: 110rpx;
		background-color: #fff;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.iconicon-location,
	.icon-keyboard {
		width: 50rpx;
		height: 50rpx;
		line-height: 60rpx;
		text-align: center;
		font-size: 40rpx;
		margin-left: 20rpx;
		flex-shrink: 0;
		color: #9b9b9b;
		border-radius: 100%;

		&.hover-class {
			color: #d3d3d3;
		}
	}

	.input-container {
		width: 440rpx;
		position: relative;
		flex-shrink: 0;
		border-radius: 30rpx;
		border: 2rpx solid #E5E3E5;
		background-color: #fff;
		margin-left: 8rpx;
		.input{
			width: calc(100% - 40rpx);
			margin-left: 20rpx;
			height: 64rpx;
			font-size: 28rpx;
			color: #4A4A4A;
			text-indent: 0rpx;
			white-space: pre-wrap;
			overflow: hidden;
		}
	}
	.bottom_add{
		height: 60rpx;
		width: 60rpx;
		margin-left: 24rpx;
		.bottom_icon{
			height: 100%;
			width: 100%;
		}
	}

	.input-voice {
		width: 100%;
		line-height: 64rpx;
		font-size: 28rpx;
		color: #999999;
		text-align: center;
		border-radius: 30rpx;

		&.on {
			background-color: #f3f3f3;
		}
	}

	.input-icon {
		width: 64rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		border-radius: 100%;
		font-size: 40rpx;
		position: absolute;
		right: 0;
		top: 0;
		color: #9b9b9b;

		&.hover-class {
			color: #d3d3d3;
		}

		&.active {
			color: $base-color;
		}
	}

	.bottom-btn {
		font-size: 28rpx;
		color: #646364;
		padding: 10rpx 20rpx;
		margin-left: 10rpx;
		box-sizing: border-box;
		flex-shrink: 0;
		font-weight: bold;

		&.hover-class {
			color: #d3d3d3;
		}
	}

	.tabbar {
		width: 100%;
		height: 120rpx;
		position: relative;
		background-color: #fff;
		position: fixed;
		left: 0;
		z-index: 100;
	}

	.tabbar-box {
		width: calc(100% - 60rpx);
		height: 118rpx;
		margin: 0 30rpx;
		display: flex;
		justify-content: center;
		border-bottom: 2rpx solid #E5E3E5;
	}

	.tabbar-item {
		width: 250rpx;
		line-height: 118rpx;
		text-align: center;
		font-size: 28rpx;
		color: #9B9B9B;
		font-weight: bold;

		&.active {
			color: $base-color;
		}
	}

	.tabbar-line {
		width: 128rpx;
		height: 4rpx;
		position: absolute;
		bottom: 0;
		background-color: $base-color;
		transition: all ease-in-out 0.3s;
	}

	.wrapper {
		background-color: #FAFAFA;
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		z-index: 100;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
	}

	.iconicon-more {
		font-size: 48rpx;

		&.hover-class {
			color: #999999;
		}
	}

	.chat-swiper {
		overflow-anchor: auto;
	}

	.talk-list {
		padding-bottom: 20rpx;
		font-size: 28rpx;

		.item-time {
			font-size: 24rpx;
			color: #9B9B9B;
			padding-top: 80rpx;
			text-align: center;
		}

		/* 消息项，基础类 */
		.item {
			padding: 30rpx 20rpx 0 20rpx;
			align-items: flex-start;
			align-content: flex-start;
			color: #333;
			// position: relative;

			.pic {
				width: 84rpx;
				height: 84rpx;
				border-radius: 50%;
				border: #fff solid 1px;
			}

			.content {
				padding: 20rpx;
				border-radius: 8px;
				max-width: 435rpx;
				word-break: break-all;
				line-height: 52rpx;
			}

			.msg-address {
				width: 475rpx;
				height: 270rpx;
				border-radius: 8px;
				overflow: hidden;
				background-color: #fff;
				position: relative;
				box-shadow: 0px 2px 20px 0px rgba(97, 56, 203, 0.04);

				.msg-address-mask {
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					z-index: 10;

					&.hover-class {
						background-color: rgba(0, 0, 0, 0.3);
					}
				}

				.msg-address-wrapper {
					width: 475rpx;
					height: 100rpx;
					background-color: #fff;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.msg-address-name {
						padding: 0 20rpx;
						font-size: 28rpx;
						color: #323232;
						font-weight: bold;
						line-height: 1.4;
						@include ellipsis;
						padding-bottom: 10rpx;
					}

					.msg-address-address {
						padding: 0 20rpx;
						font-size: 26rpx;
						color: #999;
						line-height: 1.2;
						@include ellipsis;
					}
				}

				.msg-address-pic {
					width: 475rpx;
					height: 170rpx;
				}
			}

			/* 收到的消息 */
			&.pull {
				.msg-address {
					margin-left: 32rpx;
				}

				.content {
					margin-left: 32rpx;
					background-color: #F3D5CE;
					color: #4A4A4A;
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;
					position: relative;

					&.unread::before {
						content: '';
						width: 16rpx;
						height: 16rpx;
						flex-shrink: 0;
						border-radius: 100%;
						background-color: $base-color;
						position: absolute;
						right: -30rpx;
						top: 50%;
						transform: translateY(-50%);
					}

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-left: 20rpx solid #F3D5CE;
						position: absolute;
						bottom: -16rpx;
						left: 0;
					}
				}
			}

			/* 发出的消息 */
			&.push {
				/* 主轴为水平方向，起点在右端。使不修改DOM结构，也能改变元素排列顺序 */
				flex-direction: row-reverse;

				.msg-address {
					margin-right: 32rpx;
				}

				.content {
					margin-right: 32rpx;
					background-color: $base-color;
					color: #fff;
					display: flex;
					align-items: center;
					margin-bottom: 16rpx;
					position: relative;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 16rpx solid transparent;
						border-bottom: 16rpx solid transparent;
						border-right: 20rpx solid $base-color;
						border-radius: 2rpx;
						position: absolute;
						bottom: -16rpx;
						right: 0;
					}
				}
			}
		}

		.flex_col {
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: flex-start;
			align-items: flex-end;
			align-content: flex-end;
		}
	}

	.loading {
		font-size: 26rpx;
		color: #999999;
		text-align: center;
		position: absolute;
		bottom: 50%;
		left: 50%;
		transform: translate(-50%, 50%);
	}

	.page-load {
		line-height: 80rpx;
		font-size: 26rpx;
		color: #999999;
		text-align: center;
	}

	.chat-coustom-pic {
		width: 475rpx;
		// height: 120rpx;
		border-radius: 16rpx;
		box-shadow: 0px 2px 20px 0px rgba(97, 56, 203, 0.04);
		margin-left: 140rpx;
		margin-bottom: -60rpx;
		margin-top: 20rpx;
	}

	.chat-coustom-card {
		width: 470rpx;
		border-radius: 16rpx;
		background-color: #fff;
		box-shadow: 0px 2px 20px 0px rgba(97, 56, 203, 0.04);
		margin-left: 145rpx;
		margin-bottom: -60rpx;
		margin-top: 20rpx;

		.chat-coustom-card-title {
			font-size: 24rpx;
			color: #646364;
			padding: 80rpx 40rpx 28rpx 40rpx;
		}

		.chat-coustom-card-content {
			font-family: siyuan;
			font-size: 40rpx;
			color: #000000;
			padding: 0rpx 40rpx 114rpx 40rpx;
		}
	}
</style>
