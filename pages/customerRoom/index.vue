<template>
	<view>
		<u-navbar :border-bottom="false" :is-fixed="true" :background="{
    		background: '#191C3F'
    	}" title="客服" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view class="msg-list" scroll-y="true" :scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop" :scroll-into-view="scrollToView" @scrolltoupper="loadHistory"
				upper-threshold="50">
				<!-- 加载历史数据waitingUI -->
				<view class="loading" v-if="isHistoryLoading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row, index) in msgList" :key="index" :id="'msg' + row.id">

					<!-- 用户消息 -->
					<block>
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.senderId.startsWith('user')">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble">
									<rich-text :nodes="row.payload.text || ''"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'image'" class="bubble img" @tap="showPic(row.content)">
									<image :src="row.content"> </image>
								</view>
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.senderAvatar"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.senderId.startsWith('admin')">
							<!-- 左-头像 -->
							<view class="left">
								<image :src="row.senderAvatar"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{ row.senderNickname }}</view>
									<view class="time">{{ parseDate(row.createDate) }}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble">
									<rich-text :nodes="row.payload.text || ''"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'image'" class="bubble img" @tap="showPic(row.content)">
									<image :src="row.content"> </image>
								</view>
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{ hidden: hideEmoji }" indicator-dots="true" duration="150">
				<swiper-item v-for="(page, pid) in emojiList" :key="pid">
					<view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)">
						<text>{{ em.emoji }}</text>
					</view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照 -->
			<view class="more-layer" :class="{ hidden: hideMore }">
				<view class="list">
					<view class="box" @tap="chooseImage">
						<view class="icon tupian2"></view>
					</view>
					<view class="box" @tap="camera">
						<view class="icon paizhao"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<view class="more" @tap="showMore">
				<view class="icon add"></view>
			</view>
			<view class="textbox">
				<view class="text-mode">
					<view class="box">
						<textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" />
					</view>
					<view class="em" @tap="chooseEmoji">
						<view class="icon biaoqing"></view>
					</view>
				</view>
			</view>
			<view class="send" @tap="sendText">
				<view class="btn">发送</view>
			</view>
		</view>
		<!-- 录音UI效果 -->
	</view>
</template>
<script>
	import config from "./config";
	import $date from "@/utils/date.js";
	import wsRequest from "@/common/websocket.js";
	var btnAvaliable = true;
	    var websocketObj = null;
	    var waitSendMsg = []; //待发送图片
	    var waitSendVideoMsg = []; //待发送视频

	export default {
		data() {
			return {
				pageNumber: 1,
				pageSize: 20,
				nomore: false,
				//文字消息
				textMsg: "",
				//消息列表
				isHistoryLoading: false,
				scrollAnimation: false,
				scrollTop: 0,
				scrollToView: "",
				msgList: [],
				msgImgList: [],
				// 抽屉参数
				popupLayerClass: "",
				// more参数
				hideMore: true,
				//表情定义
				hideEmoji: true,
				emojiList: config.emojiList,
				socketTask: "",
				kefuId: "", //客服id
				avatar: "", //客服头像
				nickname: "", //客服昵称
				clubId: "" //酒吧id
			};
		},

		onUnload() {
			this.scrollToView = "";
			uni.closeSocket();
			uni.$off('reconnectWebSocket');
			// waitSendMsg = []; //清空待发送图片
			// waitSendVideoMsg = []; //清空待发送视频
		},
		onLoad(options) {
			this.kefuId = options.id || ''
			this.clubId = options.clubId;

			this.getMsgList(() => {
				// 滚动到底部
				this.$nextTick(function() {
					//进入页面滚动到底部
					this.scrollTop = 9999;
					this.$nextTick(function() {
						this.scrollAnimation = true;
					});
				});
			});


			this.openConnection();
			uni.onSocketMessage((res) => {
				console.log("on message", res.data);
                let data = JSON.parse(res.data);
                this.screenMsg(data);


			});
			waitSendMsg = [];
			waitSendVideoMsg = [];
			uni.$on('reconnectWebSocket', () => {
				uni.showLoading({
					title: '连线中'
				})
				setTimeout(() => {
					websocketObj.reconnect(() => {
						uni.hideLoading();
						if (waitSendMsg.length > 0) {
							waitSendMsg.forEach(item => {
								this.sendMsg(item, "image")
							})
							setTimeout(() => {
								uni.hideLoading();
							}, 1000);
						}
						if (waitSendVideoMsg.length > 0) {
							waitSendVideoMsg.forEach(item => {
								this.sendMsg(item, "video");
							})
							setTimeout(() => {
								uni.hideLoading();
							}, 1000);
						}
					})
				}, 500)
			})
		},
		onShow() {
			this.scrollTop = 9999999;
		},
		methods: {

			// 连接webSocket
			openConnection() {
				var s = Date.parse(new Date());
				var t = getApp().globalData.token;
				var url = "ws://192.168.0.109:8080/websocket/messageHandler?username=user@"+t+"@" + s;
				console.log(url)
				uni.showLoading({
					title: '连接中'
				})
				websocketObj = new wsRequest(
					url,
					0, () => {
						uni.hideLoading();
					}
				);
			},
			parseDate(date) {
				let time = "";
				let ymd = $date.formatTime(date, "Y-M-D");
				let todayYmd = $date.formatTime(new Date(), "Y-M-D");
				if (ymd === todayYmd) {
					time = $date.formatTime(date, "h:m");
				} else {
					time = $date.formatTime(date, "M-D h:m");
				}
				return time;
			},
			// 接受消息(筛选处理)
			screenMsg(msg) {
				// console.log("收到消息了")
				// console.log(msg)
				uni.vibrateLong();
				// 用户消息
				switch (msg.type) {
					case "text":
						this.addTextMsg(msg);
						break;
					case "image":
						this.addImgMsg(msg);
						break;
				}


				this.$nextTick(function() {
					// 滚动到底
					this.scrollToView = "msg" + msg.id;
				});
			},
			//触发滑动到顶部(加载历史信息记录)
			loadHistory() {
				if (this.nomore) {
					return;
				}
				if (this.isHistoryLoading) {
					return;
				}
				this.pageNumber = this.pageNumber + 1;
				this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
				this.scrollAnimation = false; //关闭滑动动画
				let Viewid = this.msgList[0].id; //记住第一个信息ID
				setTimeout(() => {
					this.getMsgList(() => {
						//这段代码很重要，不然每次加载历史数据都会跳到顶部
						this.$nextTick(function() {
							this.scrollToView = "msg" + Viewid; //跳转上次的第一行信息位置
							this.$nextTick(function() {
								this.scrollAnimation = true; //恢复滚动动画
							});
						});
						this.isHistoryLoading = false;
					});
				}, 1000);
			},
			// 加载初始页面消息
			getMsgList(callback) {
				var s = Date.parse(new Date());
				this.$u.api.chatMessageList({
						pageNumber: this.pageNumber,
						pageSize: this.pageSize,
						clubId: this.clubId || '',
						timestamp: s
					})
					.then((res) => {
						// console.log("拉历史记录")
						// console.log(res)
						// if (this.pageNumber >= res.data.totalPages) {
						// 	this.nomore = true;
						// }
						this.isHistoryLoading = false;
						let list = res.data.list;
						for (let item of list) {
							this.msgList.unshift(item);
						}
						// 获取消息中的图片,并处理显示尺寸
						for (let item of list) {
							if (item.type === "image" && item.content) {
								this.msgImgList.push(item.content);
							}
						}
						if (callback) {
							callback();
						}
					});
				return;
			},
			//更多功能(点击+弹出)
			showMore() {
				this.hideEmoji = true;
				if (this.hideMore) {
					this.hideMore = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			// 打开抽屉
			openDrawer() {
				this.popupLayerClass = "showLayer";
			},
			// 隐藏抽屉
			hideDrawer() {
				this.popupLayerClass = "";
				setTimeout(() => {
					this.hideMore = true;
					this.hideEmoji = true;
				}, 150);
			},
			// 选择图片发送
			chooseImage() {
				this.getImage("album");
			},
			//拍照发送
			camera() {
				this.getImage("camera");
			},
			//选照片 or 拍照
			getImage(type) {
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							this.$api.uploadFile(res.tempFilePaths[i]).then((e) => {
								this.sendMsg(JSON.parse(e).url, "image");
							});
						}
					},
				});
			},
			// 选择表情
			chooseEmoji() {
				this.hideMore = true;
				if (this.hideEmoji) {
					this.hideEmoji = false;
					this.openDrawer();
				} else {
					this.hideDrawer();
				}
			},
			//添加表情
			addEmoji(em) {
				this.textMsg += em.emoji;
			},
			//获取焦点，如果不是选表情ing,则关闭抽屉
			textareaFocus() {
				if (this.popupLayerClass == "showLayer" && this.hideMore == false) {
					this.hideDrawer();
				}
			},
			// 发送文字消息
			sendText() {
				this.hideDrawer(); //隐藏抽屉
				if (!this.textMsg) {
					return;
				}
				let content = this.textMsg;
				this.sendMsg(content, "text");
				this.textMsg = ""; //清空输入框
			},
			// 发送消息
			sendMsg(content, type) {
				var payloadStr = "";
				if (type == "text") {
					payloadStr = "{'text':'" + content + "'}"
				}

				let params = {
					type: type,
					payloadStr: payloadStr,
					staffId: this.kefuId,
				};
				this.$u.api.chatMessageSend(params).then((res) => {
					this.screenMsg(res.data);
				});
			},
			// 添加文字消息到列表
			addTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 添加图片消息到列表
			addImgMsg(msg) {
				this.msgImgList.push(msg.content);
				this.msgList.push(msg);
			},
			// 添加系统文字消息到列表
			addSystemTextMsg(msg) {
				this.msgList.push(msg);
			},
			// 预览图片
			showPic(msg) {
				uni.previewImage({
					indicator: "none",
					current: msg,
					urls: this.msgImgList,
				});
			},
			discard() {
				return;
			},
		},
	};
</script>
<style lang="scss">
	@import "@/static/HM-chat/css/style.scss";
</style>
