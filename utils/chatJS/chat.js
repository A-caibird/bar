
import storageUtil from './storage.js';
import ChatInfo from './chatInfo.js'
import goEasyUtils from './goEasyUtils.js'

var baseInfo = {
	// message: "",
	token: "",
	userInfo: '',
	channel: "",
	toUserInfo: "",
	mode: 'single',
}
var goeasy = null;

// 初始化 chat
function initChat(goeasyObject, token, userInfo, channel, toUserInfo, mode='single') {
	baseInfo.token = token; //发送人Id
	baseInfo.userInfo = userInfo;
	baseInfo.channel = channel;
	baseInfo.toUserInfo = toUserInfo;
	baseInfo.mode = mode;
	goeasy = goeasyObject;
}
// 链接聊天
function connectChat(callback = null) {
	let userInfo = {
		avatar: baseInfo.userInfo.avatar,
		nickname: baseInfo.userInfo.nickname,
	}
	goEasyUtils.connect(goeasy, baseInfo.channel, userInfo, callback);
}
// 断开链接
function disconnectChat(callback = null) {
	goEasyUtils.disconnect(goeasy, callback);
}
//发消息
function sendMsg(message, callback = null, type = 0, mode = 'single') {

	let chatInfo = new ChatInfo(baseInfo.token, baseInfo.userInfo, baseInfo.channel, baseInfo.toUserInfo, type, mode);
	goEasyUtils.sendMessage(goeasy.im, chatInfo, message, callback);
}
// 接收消息
function receiveMessage(callback = null, mode = 'single') {
	goEasyUtils.receiveMessage(goeasy.im, (msg) => {
		console.log('接收消息', msg);
		let chatInfo = new ChatInfo(baseInfo.token, baseInfo.userInfo, baseInfo.channel, baseInfo.toUserInfo, 0, mode);
		chatInfo.setId(msg.id);
		chatInfo.setCreatDate(msg.timestamp);
		chatInfo.setType(msg.type);
		chatInfo.setMessage(msg.payload);
		if(callback){
			callback(chatInfo, msg);
		}
		goEasyUtils.markPrivateMessageAsRead(goeasy.im, msg.senderId);
	});
}

// 保存聊天
function saveChat(chatList) {
	storageUtil.setChatStorage(chatList, baseInfo.channel);
}

// 获取聊天内容
function getChatList(pageNumber, pageSize, channel) {
	let page = {
		total: 0,
		totalPages: 0,
		list: [],
	}
	let chatAllList = storageUtil.getChatStorage(channel) || [];
	let total = chatAllList.length; //总数量
	page.total = total;
	let totalPages = total / pageSize; // 总页面
	if ((totalPages * pageSize) - total < 0) {
		totalPages = totalPages + 1;
	}
	page.totalPages = totalPages;

	let startPoint = (pageNumber - 1) * pageSize;
	let endPoint = pageNumber * pageSize;
	if (startPoint >= total) {
		page.list = [];
		return page;
	} else if (endPoint > total) {
		page.list = chatAllList.slice(startPoint, total);
	} else {
		page.list = chatAllList.slice(startPoint, endPoint);
	}
	return page;
}

function clearChat() {

}

module.exports = {
	initChat,
	connectChat,
	disconnectChat,
	sendMsg,
	receiveMessage,
	saveChat,
	getChatList,
	clearChat,
}
