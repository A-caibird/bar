<template>
	<view>
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
						<!-- 自己发出的消息  -->

						<view class="my" v-if="row.senderId == selfId">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble">
									<rich-text :nodes="row.payload.text || ''"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'image'" class="bubble img" @tap="showPic(row.payload.url)">
									<image :src="row.payload.url" mode="widthFix"> </image>
								</view>
								<!-- 普通订单尬酒消息 -->
								<view v-if="row.type == 'chat'" class="yaoyue"
									@tap="tapGoYaodDetail(row.payload.orderId)">
									<view class="title">{{row.payload.statement}}</view>
									<view class="club-cover">
										<image :src="row.payload.clubCover" />
									</view>
									<view class="order-info">
										<view class="club-name">
											{{row.payload.clubName}}
										</view>
										<view class="date-card">
											<view class="date">邀约时间：{{row.createDate}}</view>
										</view>
									</view>
								</view>
								<!-- 邀请别人加入到我的拼享 -->
								<view v-if="row.type == 'inviteJoinOrder'" class="yaoyue"
									@tap="tapGoPingDetail(row.payload.orderId)">
									<view class="title">
										{{row.payload.text}}
									</view>
									<view class="club-cover">
										<image :src="row.payload.clubCover" />
									</view>
									<view class="order-info">
										<view class="club-name">
											{{row.payload.clubName}}
										</view>
										<view class="date-card">
											<view class="date">邀约时间：{{row.timestamp}}</view>
										</view>
										<!-- <view class="yaoyue-btn" v-if="row.payload.agreeStatus=='agreed'">
											<view class="btn agreed">已同意</view>
										</view>
										<view class="yaoyue-btn" v-else-if="row.payload.agreeStatus=='refuse'">
											<view class="btn agreed">已拒绝</view>
										</view>
										<view class="yaoyue-btn" v-else>
											<view class="btn cancel" @tap.stop="tapRefusePing(row.payload)">拒绝</view>
											<view class="btn agree" @tap.stop="tapAgreePing(row.payload)">同意</view>
										</view> -->
									</view>
								</view>
								<!-- 别人想加入到我的拼享 -->
								<view v-if="row.type == 'applyJoinOrder'" class="yaoyue"
									@tap="tapGoPingDetail(row.payload.orderId)">
									<view class="club-cover">
										<image :src="row.payload.clubCover" />
									</view>
									<view class="order-info">
										<view class="club-name">
											{{row.payload.clubName}}
										</view>
										<view class="date-card">
											<view class="date">邀约时间：{{row.timestamp}}</view>
										</view>
										<!-- <view class="yaoyue-btn" v-if="row.payload.agreeStatus=='agree'">
											<view class="btn agreed">已同意</view>
										</view>
										<view class="yaoyue-btn" v-else-if="row.payload.agreeStatus=='refuse'">
											<view class="btn agreed">已拒绝</view>
										</view>
										<view class="yaoyue-btn" v-else>
											<view class="btn cancel" @tap.stop="tapRefuseJoinPing(row.payload)">拒绝
											</view>
											<view class="btn agree" @tap.stop="tapAgreeJoinPing(row.payload)">同意</view>
										</view> -->
									</view>
								</view>
								<!-- 别人想加入到我的拼享受 -->
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="row.senderAvatar"></image>
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="row.senderId != selfId">
							<!-- 左-头像 -->
							<view class="left">
								<image :src="row.senderAvatar"></image>
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view class="name">{{ row.senderNickname }}</view>
									<view class="time">{{ row.createDate }}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble">
									<rich-text :nodes="row.payload.text || ''"></rich-text>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'image'" class="bubble img" @tap="showPic(row.payload.url)">
									<image :src="row.payload.url" mode="widthFix"> </image>
								</view>
								<!-- 普通订单的尬酒消息 -->
								<view v-if="row.type == 'chat'">
									<view class="yaoyue" @tap="tapGoYaodDetail(row.payload.orderId)">
										<view class="title">{{row.payload.text}}</view>
										<view class="club-cover">
											<image :src="row.payload.clubCover" />
										</view>
										<view class="order-info">
											<view class="club-name">
												{{row.payload.clubName}}
											</view>
											<view class="date-card">
												<view class="date">邀约时间：{{row.timestamp}}</view>
											</view>
											<view class="yaoyue-btn" v-if="row.payload.agreeStatus=='agreed'">
												<view class="btn agreed">已同意</view>
											</view>
											<view class="yaoyue-btn" v-else-if="row.payload.agreeStatus=='refuse'">
												<view class="btn agreed">已拒绝</view>
											</view>
											<view class="yaoyue-btn" v-else>
												<view class="btn cancel" @tap.stop="tapRefuseYaoyue(row)">拒绝
												</view>
												<view class="btn agree" @tap.stop="tapAgreeYaoyue(row)">同意
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 邀请别人加入到我的拼享 -->
								<view v-if="row.type == 'inviteJoinOrder'">
									<view class="yaoyue" @tap="tapGoPingDetail(row.payload.orderId)">
										<view class="club-cover">
											<image :src="row.payload.clubCover" />
										</view>
										<view class="order-info">
											<view class="club-name">
												{{row.payload.clubName}}
											</view>
											<view class="date-card">
												<view class="date">邀约时间：{{row.timestamp}}</view>
											</view>
											<view class="yaoyue-btn" v-if="row.payload.agreeStatus=='agreed'">
												<view class="btn agreed">已同意</view>
											</view>
											<view class="yaoyue-btn" v-else-if="row.payload.agreeStatus=='refuse'">
												<view class="btn agreed">已拒绝</view>
											</view>
											<view class="yaoyue-btn" v-else>
												<view class="btn cancel" @tap.stop="tapRefusePing(row)">拒绝
												</view>
												<view class="btn agree" @tap.stop="tapAgreePing(row)">同意</view>
											</view>
										</view>
									</view>
								</view>

								<!-- 别人想加入到我的拼享受 -->
								<view v-if="row.type == 'applyJoinOrder'" class="yaoyue"
									@tap="tapGoPingDetail(row.payload.orderId)">
									<view class="title">
										{{row.payload.statement}}
									</view>
									<view class="club-cover">
										<image :src="row.payload.clubCover" />
									</view>
									<view class="order-info">
										<view class="club-name">
											{{row.payload.clubName}}
										</view>
										<view class="date-card">
											<view class="date">邀约时间：{{row.timestamp}}</view>
										</view>
										<view class="yaoyue-btn" v-if="row.payload.agreeStatus=='agreed'">
											<view class="btn agreed">已同意</view>
										</view>
										<view class="yaoyue-btn" v-else-if="row.payload.agreeStatus=='refuse'">
											<view class="btn agreed">已拒绝</view>
										</view>
										<view class="yaoyue-btn" v-else>
											<view class="btn cancel" @tap.stop="tapRefuseJoinPing(row)">拒绝
											</view>
											<view class="btn agree" @tap.stop="tapAgreeJoinPing(row)">同意</view>
										</view>
									</view>
								</view>
								<!-- 别人想加入到我的拼享受 -->
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
		<u-action-sheet :list="greetList" v-model="isGreet" @click="clickGreet"></u-action-sheet>
		<refuse-invite ref="refuseYaoyue" @sure="refuseYaoyue"></refuse-invite>
	</view>
</template>
<script>
	import config from "./config";
	import $date from "@/utils/date.js";
	import wsRequest from "@/common/websocket.js";
	import refuseInvite from '@/components/pop/refuse-invite.vue'
	var btnAvaliable = true;
	var websocketObj = null;
	var waitSendMsg = []; //待发送图片
	var waitSendVideoMsg = []; //待发送视频

	export default {
		data() {
			return {
				selfId: '',
				pageNumber: 1,
				pageSize: 20,
				nomore: false,
				textMsg: "", //底部输入框中的文字
				isHistoryLoading: false, //默认不加载历史消息
				scrollAnimation: false, //scrollView组件的内置属性，是否需要滚动动画，scroll-with-animation
				scrollTop: 0, //设置竖向滚动条位置
				scrollToView: "", //值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素，是scrollView组件的默认属性
				msgList: [], //需要显示在界面上的消息列表
				msgImgList: [], //需要图片一张张多张的预览，所以需要一个数组
				popupLayerClass: "", // 抽屉参数
				hideMore: true, // more参数
				hideEmoji: true, //表情定义
				emojiList: config.emojiList, //表情列表
				friendId: "", //客服id
				friendAvatar: "", //客服头像
				friendNickname: "", //客服昵称
				isGreet: false,
				greetList: [{
					text: '你好，可以共同狂欢吗？',
					color: 'blue',
					fontSize: 28
				}, {
					text: '今晚，我们一起狂欢'
				}, {
					text: '来不及解释了，一起来狂欢吧！'
				}],

			};
		},

		onUnload() {
			this.scrollToView = "";
			uni.closeSocket();
			uni.$off('reconnectWebSocket');
			waitSendMsg = []; //清空待发送图片
			waitSendVideoMsg = []; //清空待发送视频
		},
		onLoad(options) {
			this.selfId = getApp().globalData.userInfo.chatUid;
			console.log(this.selfId)
	
			this.friendUserInfo = JSON.parse(options.userInfo) //原先的逻辑
			console.log(this.friendUserInfo)
			if (options.isGreet) {
				// this.isGreet = options.isGreet;
				if (options.isGreet == "1") {
					this.isGreet = true
				}
			}
			uni.setNavigationBarTitle({
				title: this.friendUserInfo.name
			})

			if (this.friendUserInfo.friendId) {
				this.friendId = this.friendUserInfo.friendId
			} else {
				this.friendId = "user@" + this.friendUserInfo.userId + "@"
			}

			this.$u.api.readUserAll({
				"userId": this.friendId
			}).then((res) => {
				console.log("消息全部已读")
			});


			this.getMsgList(() => {

				this.$nextTick(function() {
					setTimeout(() => {
						this.scrollTop = 999999;
						this.$nextTick(function() {
							this.scrollAnimation = true;
						});

					}, 100)
				});
			});


			this.openConnection();
			uni.onSocketMessage((res) => {
				// console.log("on message", res.data);
				let data = JSON.parse(res.data);
				this.screenMsg(data);
				
				///待确认，还在想
				this.$u.api.readUserAll({
					"userId": this.friendId
				}).then((res) => {
					console.log("消息全部已读")
				});


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
			console.log("onShow===>")
			this.scrollTop = 9999999;


		},
		// onHide() {
		// 	this.scrollToView = "";
		// 	uni.closeSocket();
		// 	uni.$off('reconnectWebSocket');
		// 	waitSendMsg = []; //清空待发送图片
		// 	waitSendVideoMsg = []; //清空待发送视频
		// },
		methods: {
			tapGoPingDetail(orderId) {
				this.$u.route('/pages/order/ping-create-detail', {
					orderId
				})
			},
			tapGoYaodDetail(orderId) {
				this.$u.route('pages/order/yao-create-detail', {
					orderId
				})
			},


			clickGreet(index) {
				// console.log(`点击了第${index + 1}项，内容为：${this.greetList[index].text}`)
				this.isGreet = false
				var textMsg = this.greetList[index].text;
				console.log(textMsg)
				if (!textMsg) {
					return;
				}

				this.sendMsg(textMsg, "text");

			},


			// 连接webSocket
			openConnection() {
				var s = Date.parse(new Date());
				var t = getApp().globalData.token;
				// var url = "ws://erp.patixiu.com/websocket/messageHandler?username=user@" + t + "@" + s;
				var url = "ws://192.168.0.102:8080/websocket/messageHandler?username=user@" + t + "@" + s;

				uni.showLoading({
					title: '连接中'
				})
				websocketObj = new wsRequest(
					url, 0, () => {
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

				uni.vibrateLong(); //震动一下
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
			//触发滑动到顶部(加载历史信息记录)，scroll-view自带的功能
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
				this.$u.api.chatFriendMessageList({
						pageNumber: this.pageNumber,
						pageSize: this.pageSize,
						chatUserId: this.friendId || '',
						timestamp: Date.parse(new Date())
					})
					.then((res) => {
						console.log("获取到好友的聊天记录")
						console.log(res)
						this.isHistoryLoading = false;
						let list = res.data.list;
						for (let item of list) {
							this.msgList.unshift(item);
						}

						// 获取消息中的图片,并处理显示尺寸
						for (let i = 0; i < list.length; i++) {
							console.log(list[i])
							if (list[i].type == 'image') {
								list[i].payload.url = this.setPicSize(list[i].payload.url);
								this.msgImgList.push(list[i].payload.url);
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
				var that = this;
				this.hideDrawer();
				uni.chooseImage({
					sourceType: [type],
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					success: (res) => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							this.$u.api.uploadFile(res.tempFilePaths[i]).then((e) => {
								console.log("图片上传成功")
								console.log(e)
								// console.log()
								that.sendMsg(e, "image");
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
			// 发送文字消息
			sendMsg(content, type) {
				console.log("发送消息类型" + type)
				var payloadStr = "";
				if (type == "text") {
					payloadStr = "{'text':'" + content + "'}"
				}
				if (type == "image") {
					console.log("发送图片")
					payloadStr = "{'url':'" + content + "'}"
				}

				let params = {
					type: type,
					payloadStr: payloadStr,
					receiverId: this.friendId,
				};
				this.$u.api.chatFriendMessageSend(params).then((res) => {
					//this.screenMsg(res.data);
					console.log("发送成功")
				});
			},
			// 添加文字消息到列表
			addTextMsg(msg) {
				this.msgList.push(msg);
			},

			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
				let maxH = uni.upx2px(350); //350是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},

			// 添加图片消息到列表
			addImgMsg(msg) {

				msg.payload.url = this.setPicSize(msg.payload.url);
				this.msgImgList.push(msg.payload.url);
				this.msgList.push(msg);
			},

			// 预览图片
			showPic(url) {
				uni.previewImage({
					indicator: "none",
					current: url,
					urls: this.msgImgList,
				});
			},
			discard() {
				return;
			},

			//拒绝普通尬酒订单的邀请
			tapRefuseYaoyue(item) {
				this.$refs.refuseYaoyue.open(item)
			},
			//拒绝普通尬酒订单的邀请按钮确认
			refuseYaoyue(e) {
				console.log(e)

				this.$u.api.refuseYaoyueApi({
					awkwardWineId: e.item.awkwardWineId,
					rejectionReason: e.reason,
				}).then(function() {
					var index = this.msgList.findIndex(function(x){
						return x.id == item.id
					})
					var s = this.msgList[index].payload.agreeStatus ='refuse';
				})

			},
			//同意普通尬酒订单的邀请
			async tapAgreeYaoyue(item) {
				console.log("点击同意")
				console.log(item)
				let res = await this.$u.api.hasVerifyAPI();
				let hasVerified = res.data.hasVerified;
				let hasAdult = res.data.hasAdult;
				if (!hasVerified) {
					this.$u.toast('请先实名');
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/mine/setting/certification' +
								`?hasVerified=unverify`
						})
					}, 500);
					return
				}
				await this.$toast.confirm('', '确定要同意邀请吗？')
				let {
					code
				} = await this.$u.api.agreeYaoyueApi({
					awkwardWineId: item.payload.awkwardWineId,
					chatMessageId:item.id
				})
				if (code == 0) {
					console.log("同意的回调")
					var index = this.msgList.findIndex(function(x){
						return x.id == item.id
					})
					var s = this.msgList[index].payload.agreeStatus ='agreed';
					this.$forceUpdate()
				} else {
					console.log(code);
				}
			},

			// 拒绝别人加人拼享订单【自己是审核人】
			async tapRefuseJoinPing(item) {
				console.log("点击了拒绝别人");
				console.log(item);
			
				await this.$toast.confirm('', '确定要拒绝邀请吗？')
				let {
					code,
					data
				} = await this.$u.api.refusePingJoinAPI({
					joinTogetherId: item.payload.joinTogetherId,
					chatMessageId:item.id
				})
				if (code == 0) {
					console.log("拒绝成功")
					var index = this.msgList.findIndex(function(x){
						return x.id == item.id
					})
					var s = this.msgList[index].payload.agreeStatus ='refuse';
				}
			},
			// 同意别人加入拼享订单【自己是审核人】
			async tapAgreeJoinPing(item) {
				console.log("点击了同意===》")
				console.log(item)
				// var that = this;
	
				let res = await this.$u.api.hasVerifyAPI();
				let hasVerified = res.data.hasVerified;
				let hasAdult = res.data.hasAdult;
				if (!hasVerified) {
					this.$u.toast('请先实名');
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/mine/setting/certification?hasVerified=unverify'
						})
					}, 500);
					return
				}
				await this.$toast.confirm('', '确定要同意邀请吗？')
				let {
					code,
					data
				} = await this.$u.api.agreePingJoinApi({
					joinTogetherId: item.payload.joinTogetherId,
					chatMessageId:item.id
				})
				if (code == 0) {
					
					var index = this.msgList.findIndex(function(x){
						return x.id == item.id
					})
					var s = this.msgList[index].payload.agreeStatus ='agreed';
					
	
				}
			},

			// 别人拒绝和我一起拼享【我发出的邀请】
			///api/order/disAgreeOrderPingInfo
			async tapRefusePing(item) {
				console.log("拒绝拼享")
				console.log(item)
				
				
				await this.$toast.confirm('', '确定要拒绝邀请吗？')
				let {
					code
				} = await this.$u.api.refusePingInviteApi({
					orderId: item.payload.orderId,
					chatMessageId: item.id
				})
				if (code == 0) {
					var index = this.msgList.findIndex(function(x){
						return x.id == item.id
					})
					var s = this.msgList[index].payload.agreeStatus ='refuse';
					
				}
			},


			// 别人同意和我一起拼享【我发出的邀请】
			async tapAgreePing(item) {
				console.log("同意拼享")
				console.log(item)
			
				let res = await this.$u.api.hasVerifyAPI();
				let hasVerified = res.data.hasVerified;
				let hasAdult = res.data.hasAdult;
				if (!hasVerified) {
					this.$u.toast('请先实名');
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/mine/setting/certification' +
								`?hasVerified=unverify`
						})
					}, 500);
					return
				}
				await this.$toast.confirm('', '确定要同意邀请吗？')
				
				
				let {
					code
				} = await this.$u.api.agreePingInviteApi({
					joinTogetherId: item.payload.orderPingHistoryId,
					chatMessageId: item.id
				})
				if (code == 0) {
					console.log("同意成功")
					var index = this.msgList.findIndex(function(x){
						return x.id == item.id
					})
					var s = this.msgList[index].payload.agreeStatus ='agreed';
				}
				
				this.$u.route('/pages/club/consumption/payPage', {
					allAmount: item.payload.amount,
					orderId: item.payload.orderId,
					type: 'ping-join-order-invite'
				})

			}

		}
	};
</script>
<style lang="scss" scoped>
	@import "@/static/HM-chat/css/style.scss";

	.my {
		.yaoyue {
			width: 526rpx;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 16rpx;

			.title {
				margin-top: 24rpx;
				font-size: 30rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				// line-height: 44rpx;
				margin-left: 24rpx;
			}


			.club-cover {
				margin-top: 24rpx;
				margin-left: 24rpx;
				height: 234rpx;

				image {
					width: 478rpx;
					height: 234rpx;
				}
			}

			.order-info {

				margin-top: 30rpx;
				margin-bottom: 30rpx;

				.club-name {
					width: 100%;
					// @include ellipsis();
					font-size: 34rpx;
					color: #FFFFFF;
				}

				.date-card {
					margin-top: 7rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #7E7E7E;
					// line-height: 40rpx;
				}

				// .card {
				// 	flex: 1;
				// 	color: #666666;
				// 	font-size: 24rpx;
				// }
			}

			.yaoyue-btn {
				margin-top: 28rpx;
				display: flex;
				justify-content: space-between;

				.btn {
					border-radius: 35rpx;
					width: 214rpx;
					height: 70rpx;
					@include flex-center();
					font-size: 28rpx;

					&.cancel {
						border: 1rpx solid rgba(255, 255, 255, 0.5);
						color: rgba(255, 255, 255, 0.5);
					}

					&.agreed {
						border: 1rpx solid #666666;
						color: #333333;
						width: 100%;
					}

					&.agree {
						// background-color: #F72EB2;
						// color: #FFFFFF;
						// background-color: #F72EB2;
						background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
						color: #FFFFFF;
					}


				}
			}
		}
	}

	.other {
		.yaoyue {
			width: 526rpx;
			padding:0 24rpx;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 16rpx;

			.title {
				margin-top: 24rpx;
				font-size: 30rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #fff;
				margin-left: 24rpx;
			}


			.club-cover {
				margin-top: 24rpx;
				// margin-left: 24rpx;
				height: 234rpx;

				image {
					width: 478rpx;
					height: 234rpx;
				}
			}

			.order-info {

				margin-top: 30rpx;
				margin-bottom: 30rpx;

				.club-name {
					width: 100%;
					// @include ellipsis();
					font-size: 34rpx;
					color: #FFFFFF;
				}

				.date-card {
					margin-top: 7rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #7E7E7E;
					// line-height: 40rpx;
				}

			}

			.yaoyue-btn {
				margin-top: 28rpx;
				display: flex;
				justify-content: space-between;

				.btn {
					border-radius: 35rpx;
					width: 214rpx;
					height: 70rpx;
					@include flex-center();
					font-size: 28rpx;

					&.cancel {
						border: 1rpx solid rgba(255, 255, 255, 0.5);
						color: rgba(255, 255, 255, 0.5);
					}

					&.agreed {
						border: 1rpx solid #666666;
						color: #333333;
						width: 100%;
					}

					&.agree {

						background: linear-gradient(134deg, #B73FFF 0%, #5A1FFF 100%);
						color: #FFFFFF;
					}


				}
			}
		}
	}
</style>
