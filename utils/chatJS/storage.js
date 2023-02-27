const storage_chat_name = "service_chat_file";

function setChatStorage(chatList, channel){
	let serviceInfo = uni.getStorageSync(storage_chat_name) || {};
	let currentInfo = serviceInfo[channel] || [];
	if(currentInfo){
		currentInfo = currentInfo.concat(chatList);
	}
	serviceInfo[channel] = currentInfo;
	uni.setStorageSync(storage_chat_name, serviceInfo)
}

function getChatStorage(channel) {
	let serviceInfo = uni.getStorageSync(storage_chat_name);
	let currentInfo = serviceInfo[channel];
	return currentInfo;
}

module.exports = {
	setChatStorage,
	getChatStorage,
}