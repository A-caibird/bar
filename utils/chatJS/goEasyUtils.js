import GoEasy from '@/js_sdk/goeasy-2.0.13.min.js'

// GoEasy
function connect(goeasy, id = null, userInfo = null, callback = null) { //id 相当于主题
	let avatar = userInfo ? userInfo.avatar : '';
	let nickname = userInfo ? userInfo.nickname : '';
	// goeasy.connect({
	// 	id: id,
	// 	data: {
	// 		"avatar": avatar,
	// 		'nickname': nickname
	// 	},
	// 	onSuccess: function() { //连接成功
	// 		if (callback) {
	// 			callback();
	// 		}
	// 		console.log(id + ", GoEasy connect successfully.") //连接成功
	// 	},
	// 	onFailed: function(error) { //连接失败
	// 		if (error.code == 408) {
	// 			disconnect(goeasy);
	// 			setTimeout(() => {
	// 				connect(goeasy, id, userInfo, callback);
	// 			}, 200);
	// 		} else {
	// 			uni.hideLoading();
	// 		}
	// 		console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
	// 	},
	// 	onProgress: function(attempts) { //连接或自动重连中
	// 		console.log("GoEasy is connecting", attempts);
	// 	}
	// })
}

function disconnect(goeasy, callback = null) { //断开连接
	// goeasy.disconnect({
	// 	onSuccess: function() {
	// 		console.log("GoEasy disconnect successfully.")
	// 		if (callback) {
	// 			callback();
	// 		}
	// 	},
	// 	onFailed: function(error) {
	// 		console.log("Failed to disconnect GoEasy, code:" + error.code + ",error:" + error.content);
	// 	}
	// });
}

function subscribe(pubsub, channel, callback = null) { // pubsub模式 订阅信息
	// pubsub.subscribe({
	// 	channel: channel, //替换为您自己的channel
	// 	onMessage: function(message) {
	// 		if (callback) {
	// 			callback(message); //获取发送的消息
	// 		}
	// 		console.log("Channel:" + message.channel + " content:" + message.content);
	// 	},
	// 	onSuccess: function() {
	// 		console.log("Channel订阅成功。");
	// 	},
	// 	onFailed: function(error) {
	// 		console.log("Channel订阅失败, 错误编码：" + error.code + " 错误信息：" + error.content)
	// 	}
	// });
}

function publish(pubsub, textContent, channel, callback = null) { // pubsub模式下 发布消息
	// pubsub.publish({
	// 	channel: channel, //替换为您自己的channel
	// 	message: textContent, //替换为您想要发送的消息内容
	// 	onSuccess: function(message) {
	// 		console.log("消息发布成功。");
	// 		console.log("Channel:" + message.channel + " content:" + message.content);
	// 		if (callback) {
	// 			callback(message)
	// 		}
	// 	},
	// 	onFailed: function(error) {
	// 		console.log("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content);
	// 		uni.showToast({
	// 			title: ("消息发送失败，错误编码：" + error.code + " 错误信息：" + error.content),
	// 			icon: 'none'
	// 		})
	// 	}
	// });
}

function creatMessage(im, chatInfo, sendMsg) { // 生成 Message 对象
	var message = "";
	let type = chatInfo.type;
	var toUserInfo = chatInfo.toUserInfo
	let id = toUserInfo.id;
	let avatar = toUserInfo.avatar;
	let nickname = toUserInfo.nickname;
	let chatType = "";
	if (chatInfo.mode == 'group') {
		chatType = GoEasy.IM_SCENE.GROUP; // 群聊 
	} else {
		chatType = GoEasy.IM_SCENE.PRIVATE; //单聊
	}
	switch (type) {
		case 0: {
			message = im.createTextMessage({ // 文字类型
				text: sendMsg,
				to: {
					type: chatType, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
					id: id,
					data: {
						"avatar": avatar,
						"nickname": nickname
					} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
				}
			});
		};
		break;
	case 1: {
		message = im.createImageMessage({ // 图片类型
			file: sendMsg,
			to: {
				type: chatType, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
				id: id,
				data: {
					"avatar": avatar,
					"nickname": nickname
				} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
			}
		});
	};break;
	case 2: {
		message = im.createCustomMessage({ // 自定义类型类型
			type: 'chat',
			payload: sendMsg,
			to: {
				type: chatType, //私聊还是群聊，群聊为GoEasy.IM_SCENE.GROUP
				id: id,
				data: {
					"avatar": avatar,
					"nickname": nickname
				} //好友扩展数据, 任意格式的字符串或者对象，用于更新会话列表conversation.data
			}
		});
	};break;
	default:
		break;
	}
	return message;
}

function sendMessage(im, chatInfo, msgInfo, callback = null) {
	//发送消息
	let textMessage = creatMessage(im, chatInfo, msgInfo);
	im.sendMessage({
		message: textMessage,
		onSuccess: function(message) { //发送成功
			console.log("Private message sent successfully.", message);
			chatInfo.setId(message.messageId);
			chatInfo.setCreatDate(message.timestamp);
			chatInfo.setMessage(message.payload);
			chatInfo.setType(message.type);
			if (callback) {
				callback(chatInfo, message);
			}
		},
		onFailed: function(error) { //发送失败
			console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
		}
	});
}

function receiveMessage(im, callback = null) {
	var onPrivateMessageReceived = function(message) {
		//文字消息
		// {
		//     "messageId": "8f0e27a0c7e111eab347b726da4416bd",
		//     "timestamp": 1594958217087,
		//     "type": "text",
		//     "senderId": "3bb179af-bcc5-4fe0-9dac-c05688484649",
		//     "payload": {
		//         "text": "Hello, GoEasyIM"
		//     },
		//     "receiverId": "fdee46b0-4b01-4590-bdba-6586d7617f95"
		// }
		if (callback) {
			callback(message);
		}
		// console.log("received private message:" + JSON.stringify(message));
	};
	//监听和接收单聊消息
	im.on(GoEasy.IM_EVENT.PRIVATE_MESSAGE_RECEIVED, onPrivateMessageReceived);
}

function markPrivateMessageAsRead(im, userId) { //userId： 发送者的Id
	// console.log('userId', userId);
	im.markPrivateMessageAsRead({
		userId: userId,
		onSuccess: function() { //标记成功
			console.log("Marked as read successfully.")
		},
		onFailed: function(error) { //标记失败
			console.log("Failed to mark as read, code:" + error.code + " content:" + error.content);
		}
	});
}

module.exports = {
	connect,
	disconnect,
	subscribe,
	publish,
	sendMessage,
	receiveMessage,
	markPrivateMessageAsRead
}
