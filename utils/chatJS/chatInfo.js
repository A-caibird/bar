/*
	type 消息类型 0: 表示文字 1:表示图片(多媒体) 
*/
function ChatInfo(token, userInfo, channel, toUserInfo, type, mode = 'single') {
	this.id = ""; //消息id
	this.message = ""; //消息体
	this.token = token || ""; // 用户Id
	this.userInfo = userInfo || ""; //用户名
	this.channel = channel || ""; //聊天主题
	this.type = type; //消息类型 文字 多媒体
	this.creatDate = ""; // 时间
	this.toUserInfo = toUserInfo //被发送方用户信息
	this.mode = mode; // 群聊还是单聊  group, single
	this.self = 0; // 0, 1 表示 false true
}
ChatInfo.prototype.setSelf = function(bool) {
	if(bool){
		this.self = 1;
	}else{
		this.self = 0;
	}
};
ChatInfo.prototype.setMessage = function(message) {
	this.message = message;
};
ChatInfo.prototype.getMessage = function() {
	return this.message;
};
ChatInfo.prototype.setCreatDate = function(date) {
	this.creatDate = new Date(date).getTime();
};
ChatInfo.prototype.getCreatDate = function() {
	return this.creatDate;
}
ChatInfo.prototype.setId = function(id) {
	this.id = id;
};
ChatInfo.prototype.getChannel = function() {
	return this.channel;
}
ChatInfo.prototype.setType = function(type) {
	if (!isNaN(type)) {
		this.type = type;
	} else {
		this.type = changeType(type);
	}
}
ChatInfo.prototype.getType = function() {
	return switchType(this.type);
}
ChatInfo.prototype.getToUserInfo = function() {
	return this.toUserInfo;
}
ChatInfo.prototype.changeType = changeType;

function switchType(type) {
	let changedType = '';
	switch (type) {
		case 0: {
			changedType = 'text';
		};
		break
		case 1: {
			changedType = 'image';
		};
		break;
		case 2: {
			changedType = 'file';
		};
		break;
		default:{
			changedType = 'text';
		};
		break;
	}
	return changedType;
}

function changeType(str) {
	let type = '';
	switch (str) {
		case 'text': {
			type = 0;
		};
		break
		case 'image': {
			type = 1;
		};
		break;
		case 'file': {
			type = 2;
		};
		break;
		default:{
			type = 0;
		};
		break;
	}
	return type;
}

module.exports = ChatInfo;
