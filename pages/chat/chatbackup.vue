<template>
	<view class="container">
		<scroll-view :scroll-y="true" :scroll-into-view="scrollBottom" class="chat-content" id="scrollview"
			@touchstart="closeAllPop" @scrolltoupper="loadMoreChatList"
			:style="{height:chatType=='greet'||chatType=='reply'?'calc(100vh - 340rpx)':'calc(100vh - 140rpx)'}">
			<view v-if="loadPage" class="page-load">加载中...</view>
			<view class="chat-item" v-for="(item,index) in chatList" :key="index" :id="`chat${index}`">
				<view class="time-content" v-if="item.timeStr">
					<view class="time">
						{{item.timeStr}}
					</view>
				</view>
        <!--看起来是普通消息的显示-->
				<view class="msg-warp" :class="[item.fromId==friendUserInfo.chatToken ? 'left' : 'right']">
					<view class="avatar"
						@tap="$u.throttle(goPersonalHomepage(item.fromId==friendUserInfo.chatToken?friendUserInfo.userId:userInfo.userId,item.fromId!=friendUserInfo.chatToken))">
						<image
							:src="item.fromId==friendUserInfo.chatToken?friendUserInfo.localAvatar:(userInfo.hasSave?userInfo.localAvatar:userInfo.avatar)" />
					</view>
					<view style="flex:1;display: flex;flex-direction: column;">
						<view class="msg-title">
							{{item.fromId==friendUserInfo.chatToken?friendUserInfo.name:userInfo.name}}
						</view>
						<view class="msg-content">
							<view class="content" v-if="item.type==0"><!--看起来0是普通消息-->
								{{item.content}}
							</view>
							<view class="image" v-else-if="item.type==1"><!--看起来1是图片消息-->
								<image @tap="$u.throttle(previewImg(`file://${item.src}`))" mode="widthFix"
									:src="`file://${item.src}`"></image>
							</view>
							<view class="content" v-else-if="item.type==2"><!--看起来？？？？-->
								{{ item.statement ? item.statement : '我想和你喝杯酒可以么？'}}
							</view>
							<view class="content" v-else-if="item.type==3">
								我想和你拼单可以么？
							</view>
							<view class="content" v-else-if="item.type==4">
								我想加入你的拼单可以么？
							</view>
							<view class="content" v-else-if="item.type==5">
								{{item.content}}
							</view>
							<view class="content" v-else-if="item.type==6">
								{{item.content}}
							</view>
						</view>
					</view>
				</view>

        <!--类型2-->
				<view class="yaoyue-wrap" v-if="item.type==2">
					<view class="yaoyue" @tap="tapGoYaodDetail(item.orderId)"><!--邀约尬酒订单消息中需要订单号-->
						<view class="club-cover">
							<image :src="item.clubCover" />
						</view>
						<view class="order-info">
							<view class="club-name">
								{{item.clubName}}
							</view>
							<view class="date-card">
								<view class="date">邀约时间：{{item.date}}</view>
								<!-- <view class="card">台位：{{item.cardTableName}}</view> -->
							</view>
							<block v-if="item.fromId==friendUserInfo.chatToken"><!--如果消息是别人发送给我的，这个消息需要有同意状态-->
								<view class="yaoyue-btn" v-if="item.agreeStatus=='agree'">
									<view class="btn agreed">已同意</view>
								</view>
								<view class="yaoyue-btn" v-else-if="item.agreeStatus=='refuse'">
									<view class="btn agreed">已拒绝</view>
								</view>
								<view class="yaoyue-btn" v-else>
									<view class="btn cancel" @tap.stop="tapRefuseYaoyue(item)">拒绝</view>
									<view class="btn agree" @tap.stop="tapAgreeYaoyue(item)">同意</view>
								</view>
							</block>
						</view>
					</view>
				</view>

        <!--类型3 表示是邀请别人加入我的拼享订单 发送消息-->
				<view class="yaoyue-wrap" v-if="item.type==3">
					<view class="yaoyue" @tap="tapGoPingDetail(item.orderId)">
						<view class="club-cover">
							<image :src="item.clubCover" />
						</view>
						<view class="order-info">
							<view class="club-name">
								{{item.clubName}}
							</view>
							<view class="date-card">
								<view class="date">邀约时间：{{item.date}}</view>
								<!-- <view class="card">台位：{{item.cardTableName}}</view> -->
							</view>
							<block v-if="item.fromId==friendUserInfo.chatToken">
								<view class="yaoyue-btn" v-if="item.agreeStatus=='agree'">
									<view class="btn agreed">已同意</view>
								</view>
								<view class="yaoyue-btn" v-else-if="item.agreeStatus=='refuse'">
									<view class="btn agreed">已拒绝</view>
								</view>
								<view class="yaoyue-btn" v-else>
									<view class="btn cancel" @tap.stop="tapRefusePing(item)">拒绝</view>
									<view class="btn agree" @tap.stop="tapAgreePing(item)">同意</view>
								</view>
							</block>

						</view>
					</view>
				</view>
        <!--类型4 表示是用户加入我的拼享订单 发送消息-->
				<view class="yaoyue-wrap" v-if="item.type==4">
					<view class="yaoyue" @tap="tapGoPingDetail(item.orderId)">
						<view class="club-cover">
							<image :src="item.clubCover" />
						</view>
						<view class="order-info">
							<view class="club-name">
								{{item.clubName}}
							</view>
							<view class="date-card">
								<view class="date">邀约时间：{{item.date}}</view>
								<view class="card">台位：{{item.cardTableName}}</view>
							</view>
							<block v-if="item.fromId==friendUserInfo.chatToken">
								<view class="yaoyue-btn" v-if="item.agreeStatus=='agree'">
									<view class="btn agreed">已同意</view>
								</view>
								<view class="yaoyue-btn" v-else-if="item.agreeStatus=='refuse'">
									<view class="btn agreed">已拒绝</view>
								</view>
								<view class="yaoyue-btn" v-else>
									<view class="btn cancel" @tap.stop="tapRefuseJoinPing(item)">拒绝</view>
									<view class="btn agree" @tap.stop="tapAgreeJoinPing(item)">同意</view>
								</view>
							</block>

						</view>
					</view>
				</view>

			</view>
			<view style="height: 20rpx;"></view>
			<view style="height: 250rpx;" v-if="addFLag||emojiFLag"></view>
		</scroll-view>

		<view class="fun_box" :class="{'safe': !focus}" v-if="chatType=='all'">
			<view class="chat-input-content" :style="`bottom:${(addFLag||emojiFLag?'250rpx':'0')};`">
				<view class="input-content">
					<view class="input">
						<input type="text" v-model="message" confirm-type="send" @confirm="sendMessage" :focus="focus" @focus="inputFocusHandle" @blur="inputBlurHandle" />
					</view>
				</view>
				<view class="emoticon" @tap="showEmoji">
					<text class="iconfont iconemoticon"></text>
				</view>
				<view class="add" @tap="showAdd">
					<text class="iconfont iconadd"></text>
				</view>
				<view class="send-btn" v-if="message!=''" @tap="sendMessage">发送</view>
			</view>
			<view class="add-content" v-show="addFLag">
				<view class="add-list">
					<view class="add-item" @tap="chooseAlbum">
						<view class="icon">
							<image src="/static/imgs/chat/album.png"></image>
						</view>
						<view class="add-name">
							照片
						</view>
					</view>
					<view class="add-item" @tap="chooseCamera">
						<view class="icon">
							<image src="/static/imgs/chat/photograph.png"></image>
						</view>
						<view class="add-name">
							拍摄
						</view>
					</view>
				</view>
			</view>
			<view class="emoji-content" v-show="emojiFLag">

				<view class="list">
					<view class="item" v-for="item in emojiList[0]" @tap="tapEmoji(uni16ToStr(item))">
						{{uni16ToStr(item)}}
					</view>
				</view>
				<view class="list">
					<view class="item" v-for="item in emojiList[1]" @tap="tapEmoji(uni16ToStr(item))">
						{{uni16ToStr(item)}}
					</view>
				</view>
				<view class="list">
					<view class="item" v-for="item in emojiList[2]" @tap="tapEmoji(uni16ToStr(item))">
						{{uni16ToStr(item)}}
					</view>
				</view>
				<view class="list">
					<view class="item" v-for="item in emojiList[3]" @tap="tapEmoji(uni16ToStr(item))">
						{{uni16ToStr(item)}}
					</view>

					<view class="item" @tap="tapDeleteEmoji">
						<image src="/static/imgs/chat/tuige.png"></image>
					</view>
				</view>

			</view>
		</view>

		<template v-if="chatType=='wait'">、
			<view class="wait-reply-tips" @tap='$u.route("/pages/club/list?mode=list")'>
				<view class="left_text">对方同意后才可进行对话哦</view>
				<view class="right_btn">{{waitBtnText}}</view>
			</view>
			<view class="wait-reply-wrap">
				<text>等待回复</text>
			</view>
		</template>

		<template v-if="chatType=='greet'">
			<view class="greet-list-wrap">
				<view class="list">
					<block v-for="item in greetList">
						<view class="item" @tap="tapSendGreet(item)">
							<text>{{item}}</text>
						</view>
					</block>
				</view>
			</view>
		</template>

		<template v-if="chatType=='reply'">
			<view class="reply-list-wrap">
				<view class="list">
					<block v-for="item in replyList">
						<view class="item" @tap="tapSendReply(item)">
							<text>{{item}}</text>
						</view>
					</block>
				</view>
			</view>
		</template>


		<refuse-invite ref="refuseYaoyue" @sure="refuseYaoyue"></refuse-invite>
		<refuse-invite ref="refusePing"></refuse-invite>
	</view>


</template>

<script>
	/*
	 消息类型区分
	 type = 2: 表示用户邀请别人加入邀约（尬酒）订单 发送消息
	 type = 3; 表示是邀请别人加入我的拼享订单 发送消息
	 type = 4: 表示是用户加入我的拼享订单 发送消息

	 */
	import $chat from '@/utils/chat/index.js'
	import GraphemeSplitter from 'grapheme-splitter'
	import refuseInvite from '@/components/pop/refuse-invite.vue'
	const app = getApp()
	export default {
		components: {
			refuseInvite
		},
		data() {
			return {
				addFLag: false,
				emojiFLag: false,

				loadPage: false,
				pageMore: true,

				scrollBottom: '',

				greetList: ['你好，可以共同狂欢吗？', '今晚，我们一起狂欢', '来不及解释了，一起来狂欢吧！'],
				replyList: ['可以，这就来', '可以，晚点见', '不好意思哦，改天约'],
				chatList: [],

				userInfo: app.globalData.userInfo,
				friendUserInfo: {},

				message: '',

				keyBoardHeight: 0,

				pageNumber: 1,

				canChat: false,
				chatType: 'wait',

				focus: false,
				emojiList: [
					[0x1F601, 0x1F602, 0x1F603, 0x1F604, 0x1F605, 0x1F606],
					[0x1F607, 0x1F608, 0x1F609, 0x1F60A, 0x1F60B, 0x1F60C],
					[0x1F60D, 0x1F60E, 0x1F60F, 0x1F610, 0x1F611, 0x1F612],
					[0x1F613, 0x1F614, 0x1F615, 0x1F616, 0x1F617],
				],
			}
		},
		onLoad(options) {

			this.friendUserInfo = JSON.parse(options.userInfo)
			uni.setNavigationBarTitle({
				title: this.friendUserInfo.name
			})
			this.load()
			uni.$on('chat-msg-push', this.msgPush)//goeasy收到消息后，数据库消息插入，然后更新聊天界面
			// uni.onKeyboardHeightChange(res => { //监听键盘高度
			// 	if(res.height){
			// 		this.keyBoardHeight = res.height
			// 		this.pageScrollToBottom(200);
			// 	}else{
			// 		this.keyBoardHeight = 0
			// 		this.scrollBottom = ""
			// 	}
			// })
		},
		computed: {
			waitBtnText() {
				if(this.chatList.length > 0){
					return this.chatList[this.chatList.length - 1].type == 2 ? '已邀约' : '去下单'
				}else{
					return "去下单"
				}
			}
		},
		onUnload() {
			uni.$off('chat-msg-push', this.msgPush)
			$chat.saveChatList(this.userInfo.chatToken, this.friendUserInfo.chatToken)
		},
		methods: {

			tapSendReply(msg) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'reply', {
					content: msg,
				})
			},

      /**
       * 发送打招呼消息
       * @param msg
       */
			tapSendGreet(msg) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'greet', {
					content: msg,
				})
			},
			// 同意别人加入拼享订单
			async tapAgreeJoinPing(item) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
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
					joinTogetherId: item.joinTogetherId,
				})
				if (code == 0) {
					item.agreeStatus = 'agree'
					this.updateChatListByTimeType(item.time, item.type, item)
					$chat.upadteChatByTimeType(userInfo.chatToken, friendUserInfo.chatToken, item.time, item.type,
						item)
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
						content: '同意加入',
					})
				}
			},

			// 拒绝别人加人拼享订单
			async tapRefuseJoinPing(item) {
				console.log(item);
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				await this.$toast.confirm('', '确定要拒绝邀请吗？')
				let {
					code,
					data
				} = await this.$u.api.refusePingJoinAPI({
					joinTogetherId: item.joinTogetherId,
				})
				if (code == 0) {
					item.agreeStatus = 'refuse'
					this.updateChatListByTimeType(item.time, item.type, item)
					$chat.upadteChatByTimeType(this.userInfo.chatToken, this.friendUserInfo.chatToken, item.time, item
						.type, item)
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
						content: '拒绝加入',
					})
				}
			},

			chatTimeStamp(arr, ele) {
				let lastTime = '';
				let timeStamp = ele.time
				// 消息时间
				let infoTime = new Date(timeStamp)
				let infoMonth = infoTime.getMonth()
				let infoDate = infoTime.getDate()
				let infoDay = infoTime.getDay()
				let hour = infoTime.getHours()
				let minute = infoTime.getMinutes()
				let time = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute)
				// 当前系统时间
				let nowTimeStamp = (new Date()).getTime()
				let now = new Date(nowTimeStamp)
				let nowDate = now.getDate()
				if (arr.length > 0) {
					let timeInterval = timeStamp - arr[arr.length - 1].time
					if (timeInterval > 300000) {
						let now = new Date(nowTimeStamp)
						let last = new Date(timeStamp)
						let interval = now.getDate() - last.getDate()
						if (interval > 0 && interval < 7) {
							if (interval === 1) {
								lastTime = '昨天'
								ele['timeStr'] = lastTime + ' ' + time
							} else if (interval > 1) {
								lastTime = this.getDay(infoDay)
								ele['timeStr'] = lastTime + ' ' + time
							}
						} else if (interval >= 7) {
							lastTime = infoMonth + '月' + infoDay + '日'
							ele['timeStr'] = lastTime + ' ' + time
						} else if (interval === 0) {
							ele['timeStr'] = time
						} else {
							ele['timeStr'] = time
						}
					} else {
						ele['timeStr'] = ''
					}
				} else {
					let interval = nowDate - infoDate
					if (interval > 0 && interval < 7) {
						if (interval === 1) {
							lastTime = '昨天'
							ele['timeStr'] = lastTime + ' ' + time
						} else if (interval > 1) {
							lastTime = this.getDay(infoDay)
							ele['timeStr'] = lastTime + ' ' + time
						}
					} else if (interval >= 7) {
						lastTime = infoMonth + '月' + infoDay + '日'
						ele['timeStr'] = lastTime + ' ' + time
					} else {
						ele['timeStr'] = time
					}
				}
				return ele
			},
			getDay(day) {
				switch (day) {
					case 0:
						return '星期日';
					case 1:
						return '星期一';
					case 2:
						return '星期二';
					case 3:
						return '星期三';
					case 4:
						return '星期四';
					case 5:
						return '星期五';
					case 6:
						return '星期六';
					default:
						return ''
				}
			},
			chatListTimeStamp(arr) {
				// 记录上一条时间戳  当时间戳与上一条天数间隔为0时使用
				let lastShowTimeStamp = ''
				let lastTime = '';
				let list = this.$u.deepClone(arr)
				list.forEach(ele => {
					// console.log(ele)
					let timeStamp = ele.time
					// 消息时间
					let infoTime = new Date(timeStamp)
					let infoMonth = infoTime.getMonth()
					let infoDate = infoTime.getDate()
					let infoDay = infoTime.getDay()
					let hour = infoTime.getHours()
					let minute = infoTime.getMinutes()
					let time = (hour < 10 ? ('0' + hour) : hour) + ':' + (minute < 10 ? ('0' + minute) : minute)
					// 当前系统时间
					let nowTimeStamp = (new Date()).getTime()
					let now = new Date(nowTimeStamp)
					let nowDate = now.getDate()
					// 获取第一条消息的接收时间，然后将这个时间戳插入到界面并记录下来
					if (!lastShowTimeStamp) {
						lastShowTimeStamp = timeStamp
						// 时间间隔 天
						let interval = nowDate - infoDate
						if (interval > 0 && interval < 7) {
							if (interval === 1) {
								lastTime = '昨天'
								ele['timeStr'] = lastTime + ' ' + time
							} else if (interval > 1) {
								lastTime = this.getDay(infoDay)
								ele['timeStr'] = lastTime + ' ' + time
							}
						} else if (interval >= 7) {
							lastTime = infoMonth + '月' + infoDay + '日'
							console.log(time)
							ele['timeStr'] = lastTime + ' ' + time
							console.log(ele)
						} else {
							ele['timeStr'] = time
						}
					} else {
						let timeInterval = timeStamp - lastShowTimeStamp
						if (timeInterval > 300000) {
							let now = new Date(nowTimeStamp)
							let last = new Date(timeStamp)
							let interval = now.getDate() - last.getDate()
							lastShowTimeStamp = timeStamp
							if (interval > 0 && interval < 7) {
								if (interval === 1) {
									lastTime = '昨天'
									ele['timeStr'] = lastTime + ' ' + time
								} else if (interval > 1) {
									lastTime = this.getDay(infoDay)
									ele['timeStr'] = lastTime + ' ' + time
								}
							} else if (interval >= 7) {
								lastTime = infoMonth + '月' + infoDay + '日'
								ele['timeStr'] = lastTime + ' ' + time
							} else if (interval === 0) {
								ele['timeStr'] = time
							} else {
								ele['timeStr'] = time
							}
						} else {
							ele['timeStr'] = ''
						}
						// console.log(ele)
					}
				})

				return list
			},

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
			// 同意我邀请别人加入我的邀请订单
			async tapAgreePing(item) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
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
				uni.$on('agreePingSuccess', () => {
					this.agreePingSuccess(userInfo, friendUserInfo, item);
					uni.$off('agreePingSuccess');
				})
				this.$u.route('/pages/club/consumption/payPage', {
					allAmount: item.amount,
					orderId: item.orderId,
					type: 'ping-join-order-invite'
				})

			},
			// 同意加入接口
			agreePingSuccess(userInfo, friendUserInfo, item){
				item.agreeStatus = 'agree'
				$chat.upadteChatByTimeType(this.userInfo.chatToken, this.friendUserInfo.chatToken, item.time, item
					.type, item)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
					content: '同意邀请',
				})
				this.$forceUpdate()
			},
			// 拒绝我邀请别人加入我的邀请订单
			async tapRefusePing(item) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				await this.$toast.confirm('', '确定要拒绝邀请吗？')
				let {
					code
				} = await this.$u.api.refusePingInviteApi({
					orderId: item.orderId,
				})
				if(code == 0){
					item.agreeStatus = 'refuse'
					this.updateChatListByTimeType(item.time, item.type, item)
					$chat.upadteChatByTimeType(this.userInfo.chatToken, this.friendUserInfo.chatToken, item.time, item
						.type, item)
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
						content: '拒绝邀请',
					})
				}
			},
      /**
       * 拒绝尬酒邀约
       * @param e
       * @returns {Promise<void>}
       */
			async refuseYaoyue(e) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				console.log(e)
				let {
					item,
					reason
				} = e
				let {
					code
				} = await this.$u.api.refuseYaoyueApi({
					awkwardWineId: item.awkwardWineId,
					rejectionReason: reason,
				})
				if (code == 0) {
					item.agreeStatus = 'refuse'
					this.updateChatListByTimeType(item.time, item.type, item)
					$chat.upadteChatByTimeType(this.userInfo.chatToken, this.friendUserInfo.chatToken, item.time, item
						.type, item)
					// $chat.sendMsg(userInfo,friendUserInfo,'single','text',{content: '拒绝邀请',})
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
						content: e.reason,
					})
				}
			},
			updateChatListByTimeType(time, type, item) {
				let index = this.chatList.findIndex(e => {
					return e.time == time && e.type == type
				})
				if (index != -1) {
					this.chatList[index] = item
				}
			},
      /**
       * 显示拒绝邀约原因弹框
       * @param item
       * @returns {Promise<void>}
       */
			async tapRefuseYaoyue(item) {
				this.$refs.refuseYaoyue.open(item)
			},
			async tapAgreeYaoyue(item) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
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
					awkwardWineId: item.awkwardWineId,
				})
				if (code == 0) {
					item.agreeStatus = 'agree'
					$chat.upadteChatByTimeType(this.userInfo.chatToken, this.friendUserInfo.chatToken, item.time, item
						.type, item)
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
						content: '同意邀请',
					})
					this.$forceUpdate()
				} else {
					console.log(code);
				}
			},
			load() {
				this.getOtherUserInfo()
				this.getChatList()
			},
			getChatList() {
				let chatToken = this.userInfo.chatToken
				let friendChatToken = this.friendUserInfo.chatToken
				$chat.getChatList(chatToken, friendChatToken).then(res => {
					let chatList = this.chatListTimeStamp(res)
					console.log('chatList', chatList);
					this.chatList = chatList
					this.pageScrollToBottom(200, chatList.length - 2)
					uni.$emit('read-chat', {
						chatToken: chatToken,
						friendChatToken: friendChatToken
					})
					this.getCanChat()
				})
			},
			async getCanChat() {
				let chatToken = this.userInfo.chatToken
				let friendChatToken = this.friendUserInfo.chatToken
				// this.canChat = $chat.getCanChat(chatToken,friendChatToken)
				let {
					code,
					data
				} = await this.$u.api.getCanChatApi({
					userId: this.friendUserInfo.userId
				})
				console.log('getCanChatApi', data);
				if (code == 0) {
					let {
						canChat
					} = data
					this.canChat = canChat
				}
				let chatType = 'wait'
				if (this.canChat) {
					chatType = 'all'
				} else {
					if (this.chatList.length == 0) {
						chatType = 'greet'
					} else {
						let chatItem = this.chatList[this.chatList.length - 1]
						if (chatItem.type == 5 && chatItem.fromId == friendChatToken) {
							chatType = 'reply'
						}
						if (chatItem.type == 5 && chatItem.fromId != friendChatToken) {
							chatType = 'wait'
						}
						if (chatItem.type == 6 && chatItem.fromId == friendChatToken) {
							chatType = 'greet'
						}
						if (chatItem.type == 6 && chatItem.fromId != friendChatToken) {
							chatType = 'wait'
						}
					}
				}
				this.chatType = chatType

			},
			async getOtherUserInfo() {
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				let {
					code,
					data
				} = await this.$u.api.otherMsgApi({
					userId: friendUserInfo.userId
				})
				if (code == 0) {
					// console.log(data)
					this.friendUserInfo.name = data.info.nickName
					//下载头像 以及同步昵称、头像
					this.friendUserInfo.localAvatar = await $chat.setChatUserListNameAvatarFromStorageByUserId(this
						.userInfo.chatToken, friendUserInfo.userId, data.info.nickName, data.info.avatar)
					this.$forceUpdate()
				}
			},
			deleteLastChar(str) { //删除最后一个emoji
				var splitter = new GraphemeSplitter();
				var graphemes = splitter.splitGraphemes(str); //将含有表情的字符串分割成数组
				graphemes.pop(); //删除数组中最后一个元素
				return graphemes.join(''); //将数组还原成字符串
			},
			tapDeleteEmoji() {
				this.message = this.deleteLastChar(this.message)
			},
			tapEmoji(str) {
				this.message += str
			},

			closeAllPop() {
				if(this.addFLag){
					this.addFLag = false
				}
				if(this.focus){
					this.focus = false
				}
			},
			async loadMoreChatList() {
				if (!this.pageMore || this.loadPage) return;
				console.log('下拉加载！')
				this.loadPage = true
				let list = await $chat.getChatList(this.userInfo.chatToken, this.friendUserInfo.chatToken, this
					.pageNumber)
				let length = this.chatList.length
				if (list.length) {
					setTimeout(() => {
						// 时间戳计算
						this.pageNumber++
						list = this.chatListTimeStamp(list)
						this.chatList = list.concat(this.chatList)
						this.loadPage = false
					}, 1000)
				} else {
					this.pageMore = false
					this.loadPage = false
				}

			},
			chooseAlbum() {
				let vm = this
				uni.chooseImage({
					sourceType: ['album'],
					count: 1,
					success: function(res) {
						console.log(res)
						let tempPath = res.tempFilePaths[0]
						vm.sendFile('image', tempPath)
					},
					complete: function() {
						vm.addFLag = false
					}
				});
			},
			chooseCamera() {
				let vm = this
				uni.chooseImage({
					sourceType: ['camera'],
					count: 1,
					success: function(res) {
						let tempPath = res.tempFilePaths[0]
						vm.sendFile('image', tempPath)
					},
					complete: function() {
						vm.addFLag = false
					}
				});
			},

      //收到消息后的处理
			msgPush(e) {
				let chatToken = this.userInfo.chatToken
				let friendChatToken = this.friendUserInfo.chatToken
				if ((chatToken == e.toId && e.fromId == friendChatToken) || (e.toId == friendChatToken && e.fromId ==
						chatToken)) {
					let chatItem = this.chatTimeStamp(this.chatList, e)
					this.chatList.push(chatItem)
					uni.$emit('read-chat', {
						chatToken: chatToken,
						friendChatToken: friendChatToken
					})
					this.pageScrollToBottom(200, this.chatList.length - 3)
					this.getCanChat()
				}
			},
			pageScrollToBottom(timeout = 0, location = (this.chatList.length - 1)) {
				this.$nextTick(() => {
					setTimeout(() => {
						this.scrollBottom = `chat${location}`
					}, timeout)
				})
			},
			sendMessage() {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'text', {
					content: this.message,
				})
				// 将消息推入聊天列表
				// this.chatList.push(msg)
				// this.pageScrollToBottom()
				this.message = ''
			},
			sendFile(fileType, tempPath) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = this.$u.deepClone(this.friendUserInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', fileType, {
					tempPath: tempPath,
				})

			},
			inputConfirm() {
				if (this.message == '') return
				this.sendMessage()
			},
			inputFocusHandle(e){
				this.addFLag = false;
				this.emojiFLag = false;
				this.focus = true;
				this.pageScrollToBottom(200)
			},
			inputBlurHandle(){
				this.focus = false;
			},
			showAdd() {
				this.addFLag = !this.addFLag
				this.emojiFLag = false
				this.scrollBottom = ''
				this.pageScrollToBottom()
			},
			showEmoji() {
				this.emojiFLag = !this.emojiFLag
				this.addFLag = false
				this.scrollBottom = ''
				this.pageScrollToBottom()
			},
		},

		onNavigationBarButtonTap(e) {
			if (e.text == '举报') {
				this.$u.route('/pages/discovery/report2');
			} else {
				this.goPersonalHomepage(this.friendUserInfo.userId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #F5F5F5;
		min-height: 100vh;
		position: relative;
		overflow-y: hidden;

		.page-load {
			line-height: 80rpx;
			font-size: 26rpx;
			text-align: center;
		}

		.chat-content {
			box-sizing: border-box;
			@include saveDistanceBottom();
			.chat-item {
				padding-top: 20rpx;

				.time-content {
					@include flex-center();

					.time {
						background-color: #9C9EB0;
						border-radius: 4upx;
						padding: 5upx 16upx;
						font-size: 22upx;
					}

				}

				.msg-warp {
					width: 100%;
					display: flex;
					align-items: flex-start;

					&.left {
						padding: 20upx 134upx 0 30upx;
					}

					&.right {
						padding: 20upx 30upx 0 134upx;
						flex-direction: row-reverse;

						.avatar {
							padding-left: 25upx;
						}

						.msg-title {
							flex-direction: row-reverse;
						}

						.msg-content {
							flex-direction: row-reverse;
						}
					}

					.avatar {
						width: 105rpx;

						image {
							width: 90rpx;
							height: 90rpx;
							border-radius: 50%;
						}
					}

					.msg-title {
						display: flex;
						color: #333333;
						font-size: 24rpx;
						margin-bottom: 9rpx;
					}

					.msg-content {
						display: flex;

						.content {
							// background-color: #16192B;
							// color: #FFFFFF;
							background-color: #FFFFFF;
							color: #000000;
							padding: 15upx 10upx;
							border-radius: 6upx;
							font-size: 30upx;
						}

						.image {
							width: 200rpx;

							image {
								width: 100%;
							}
						}

					}

				}

				.yaoyue-wrap {
					padding: 50rpx 30rpx 0;

					.yaoyue {
						.club-cover {
							width: 100%;
							height: 341rpx;

							image {
								width: 100%;
								height: 100%;
								border-top-left-radius: 10rpx;
								border-top-right-radius: 10rpx;
							}
						}

						.order-info {
							background-color: #FFFFFF;
							border-bottom-left-radius: 10rpx;
							border-bottom-right-radius: 10rpx;
							padding: 30rpx;

							.club-name {
								width: 100%;
								@include ellipsis();
								font-size: 34rpx;
								color: #16192B;
							}

							.date-card {
								margin-top: 7rpx;
								display: flex;

								.date {
									flex: 1;
									color: #666666;
									font-size: 24rpx;
								}

								.card {
									flex: 1;
									color: #666666;
									font-size: 24rpx;
								}
							}

							.yaoyue-btn {
								margin-top: 28rpx;
								display: flex;
								justify-content: space-between;

								.btn {
									border-radius: 35rpx;
									width: 300rpx;
									height: 70rpx;
									@include flex-center();
									font-size: 28rpx;

									&.cancel {
										border: 1rpx solid #666666;
										color: #333333;
									}

									&.agreed {
										border: 1rpx solid #666666;
										color: #333333;
										width: 100%;
									}

									&.agree {
										background-color: #F72EB2;
										color: #FFFFFF;
									}


								}
							}
						}
					}

				}
			
			
			}

		}
		.fun_box{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0rpx;
			&.safe{
				@include saveDistanceBottom();
			}
		}
		.chat-input-content {
			padding: 30rpx 0rpx;
			width: 100%;
			@include height-center();
			border-top: 2rpx solid #E6E6E6;
			background-color: #F5F5F5;
			.input-content {
				flex: 1;
				height: 100%;
				@include height-center();
				padding-left: 20upx;
				.input {
					height: 65upx;
					width: 100%;
					input {
						background-color: #FFFFFF;
						border-radius: 10upx;
						padding-left: 24rpx;
						padding-right: 5rpx;
						width: 100%;
						height: 100%;
						font-size: 26upx;
						color: #000000;
					}
				}
			}

			.emoticon {
				width: 73upx;
				height: 100%;
				@include height-center();
				padding-left: 38upx;

				text {
					color: #000000;
					font-size: 44upx;
				}
			}

			.add {
				width: 95upx;
				height: 100%;
				@include height-center();
				padding-left: 27upx;

				text {
					color: #000000;
					font-size: 44upx;
				}
			}

			.send-btn {
				width: 120rpx;
				height: 55rpx;
				background-color: #16192B;
				border-radius: 27rpx;
				@include flex-center();
				color: #FFFFFF;
				font-size: 26rpx;
				margin-right: 20rpx;
			}

		}

		.wait-reply-tips {
			width: 100%;
			text-align: center;
			position: fixed;
			@include flex-center();
			left: 0;
			right: 0;
			bottom: 100rpx;
			color: rgba($color: gray, $alpha: 0.5);
			font-size: 26rpx;
			font-weight: 700;
			height: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 0rpx 40rpx;
			background: #FFFFFF;

			.right_btn {
				line-height: 60rpx;
				box-sizing: border-box;
				padding: 0 20rpx;
				color: #FFFFFF;
				border-radius: 20rpx;
				background: $uni-button-color;
			}
		}

		.wait-reply-wrap {
			position: fixed;
			height: 100upx;
			width: 100%;
			@include flex-center();
			left: 0;
			right: 0;
			bottom: 0;
			border-top: 2rpx solid #E6E6E6;
			background-color: #FFFFFF;

			text {
				color: rgba($color: gray, $alpha: 0.5);
				font-size: 34rpx;
				font-weight: 700;
			}
		}

		.greet-list-wrap {
			position: fixed;
			width: 100%;
			left: 0;
			right: 0;
			bottom: 0;

			.list {
				padding: 30rpx;

				.item {
					height: 80rpx;
					background-color: #fff;
					border-radius: 5rpx;
					@include flex-center();
					margin-bottom: 20rpx;

					&:last-child {
						margin-bottom: 0;
					}

					text {
						color: #000;
						font-size: 30rpx;
					}
				}
			}

		}

		.reply-list-wrap {
			position: fixed;
			width: 100%;
			left: 0;
			right: 0;
			bottom: 0;

			.list {
				padding: 30rpx;

				.item {
					height: 80rpx;
					background-color: #fff;
					border-radius: 5rpx;
					@include flex-center();
					margin-bottom: 20rpx;

					&:last-child {
						margin-bottom: 0;
					}

					text {
						color: #000;
						font-size: 30rpx;
					}
				}
			}

		}

		.add-content {
			height: 250upx;
			width: 100%;
			display: flex;
			padding-left: 30upx;
			@include height-center();

			background-color: #F5F5F5;
			border-top: 2rpx solid #E6E6E6;

			.add-list {
				display: flex;

				.add-item {
					width: 120upx;
					margin-right: 60upx;
					display: flex;
					flex-direction: column;

					.icon {
						width: 120upx;
						height: 120upx;
						margin-bottom: 18upx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.add-name {
						@include flex-center();
						font-size: 24upx;
						color: #333333;
					}
				}
			}
		}

		.emoji-content {
			width: 100%;
			height: 250upx;
			padding: 30upx;
			background-color: #F5F5F5;
			border-top: 2rpx solid #E6E6E6;

			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.list {
				flex: 1;
				@include height-center();
				justify-content: space-between;

				.item {
					flex: 1;
					@include flex-center();

					image {
						width: 40upx;
						height: 40upx;
					}
				}

			}

		}
	}
</style>
