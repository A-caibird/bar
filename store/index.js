import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import GoEasy from '@/js_sdk/goeasy-2.0.13.min.js'
import goEasyUtils from '@/utils/chatJS/goEasyUtils.js'
import ChatInfo from '@/utils/chatJS/chatInfo.js'
const store = new Vuex.Store({
	state: {
		'list': [{
				'text': 'Club',
				'customIcon': false,
			},
			{
				'text': '发现',
				'customIcon': false,
			},
			{
				'iconPath': "/static/imgs/common/publish.png",
				'selectedIconPath': "/static/imgs/common/publish.png",
				'text': '',
				'midButton': true,
				'customIcon': false,
			},
			{
				'text': '消息',
				'customIcon': false,
			},
			{
				'text': '我的',
				'customIcon': false,
			},
		],
		// goEasy 对象
		goEasy: '',
		// 发送者消息
		userInfo: {},
	},
	mutations: {

		// goEasy 初始化
		initGoEasy(state, info) {
			console.log(info);
			info = JSON.parse(info);
			var chatId = info.chatToken;
			state.userInfo = {
				nickName: info.name,
				avatar: info.avatar
			}
			state.goEasy = GoEasy.getInstance({
				host: "hangzhou.goeasy.io", //若是新加坡区域：singapore.goeasy.io
				appkey: "BC-025546bc12d04071b9113d33a63bbaca",
				modules: ['pubsub', 'im'] //根据需要，传入‘pubsub’或'im’，或数组方式同时传入
			});
			goEasyUtils.connect(state.goEasy, chatId, state.userInfo, function(){
				goEasyUtils.receiveMessage(state.goEasy.im, (msg) => {
					console.log(msg);
					var msgInfo = msg.payload.payloadString;
					console.log(msgInfo);
					goEasyUtils.markPrivateMessageAsRead(state.goEasy.im, msg.senderId);
					// 触发全局事件
					uni.$emit('mqtt-arrived-msg', {
						payload: msgInfo
					})
				});
			});
		},
		// goEasy 连接
		connetGoEasy(state, chatId){
			console.log("chatId: ", chatId);
			goEasyUtils.connect(state.goEasy, chatId, state.userInfo);
		},
		
		// goEasy 断开连接
		disconnectGoEasy(state){
			goEasyUtils.disconnect(state.goEasy);
		},

		sendMsg(state, {
			msg,
			chatId
		}) {
			let info = JSON.parse(msg);
			console.log(info);
			console.log('chatId', chatId);
			var userInfo = {
				id: state.userInfo.chatId,
				nickname: state.userInfo.nickName,
				avatar: state.userInfo.avatar
			}
			var toUserInfo = {
				id: chatId,
				nickname: info.toName,
				avatar: info.toAvatar,
			}
			var chatInfo = new ChatInfo(chatId, userInfo, chatId, toUserInfo, 2);;
			var msgInfo = {
				payloadString: msg,
				destinationName: chatId
			};
			var callback = null;
			goEasyUtils.sendMessage(state.goEasy.im, chatInfo, msgInfo, callback);
		}
	},
	actions: {

	}
})
module.exports = store
