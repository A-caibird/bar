
import $store from '@/store/index.js'
import $storage from '@/common/storage.js'
import $chat from './index.js'
import {ajax} from '@/utils/ajax.js';
var vmm = ''
async function pushMessage(msg){
	console.log(msg)
	let message = msg.content

	let type='text'
	if(msg.type == 1) {
		message = '[图片]'
		type = 'img'
	}

	// if(msg.type == 2) {
	// 	return
	// }
	let {code} = await vmm.$u.api.sendChatPush({
		chatUserId:msg.chatUserId,
		type:type,
		message:message,
	})
	console.log(code)
}

/**
 * goeasy全局的消息到达后抛出mqtt-arrived-msg后再触发
 * 根据不同的消息类型做不同处理，重要重要重要
 * @param res
 */
function msgArrived(res){
	console.log(res)
	let chatToken = $storage.getUserInfo().chatToken
	let chatUserList = []
	let msg = JSON.parse(res.payload)
	if(msg.type === 0 ) {
		msg.status = 2
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)//这两个各自做啥的？？？
		msg = $chat.setChatListFromStorage(chatToken,msg)//这两个各自做啥的？？？
		uni.$emit('chat-user-list-refresh',chatUserList) //首页的消息那边的列表数据更新
		uni.$emit('chat-msg-push',msg) //聊天记录的刷新
		uni.$emit('information_listener')
	} else if(msg.type === 1) {
		msg.status = 1
		uni.downloadFile({
			url: msg.src,
			success: (res) => {
				if (res.statusCode === 200) {
					console.log(res.tempFilePath)
					$chat.saveTempFileToLocal(res.tempFilePath,chatToken, msg.type, e => {
						// console.log(e)
						let localPath = e.path + e.name
						msg.src = localPath
						msg.status = 2
						chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
						uni.$emit('chat-user-list-refresh',chatUserList)
						msg = $chat.setChatListFromStorage(chatToken,msg)
						uni.$emit('chat-msg-push',msg)
						uni.$emit('information_listener')
					}, err => {
						msg.src = ''
						msg.status = 3
						chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
						uni.$emit('chat-user-list-refresh',chatUserList)
						uni.$emit('chat-msg-push',msg)
						uni.$emit('information_listener')
					})
				}
			},
			fail: (err) => {
				msg.src = ''
				msg.status = 3
				chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
				uni.$emit('chat-user-list-refresh',chatUserList)
				msg = $chat.setChatListFromStorage(chatToken,msg)
				uni.$emit('chat-msg-push',msg)
				uni.$emit('information_listener')
			}
		});

	} else if(msg.type === 2 ) {
		msg.status = 2
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
		uni.$emit('chat-user-list-refresh',chatUserList) //聊天列表的刷新
		msg = $chat.setChatListFromStorage(chatToken,msg)
		uni.$emit('chat-msg-push',msg) //聊天记录的刷新
		uni.$emit('information_listener')
	} else if(msg.type === 3 ) {
		msg.status = 2
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
		uni.$emit('chat-user-list-refresh',chatUserList) //聊天列表的刷新
		msg = $chat.setChatListFromStorage(chatToken,msg)
		uni.$emit('chat-msg-push',msg) //聊天记录的刷新
		uni.$emit('information_listener')
	} else if(msg.type === 4 ) {
		msg.status = 2
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
		uni.$emit('chat-user-list-refresh',chatUserList) //聊天列表的刷新
		msg = $chat.setChatListFromStorage(chatToken,msg)
		uni.$emit('chat-msg-push',msg) //聊天记录的刷新
		uni.$emit('information_listener')
	} else if(msg.type === 5 ) {
		msg.status = 2
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
		uni.$emit('chat-user-list-refresh',chatUserList) //聊天列表的刷新
		msg = $chat.setChatListFromStorage(chatToken,msg)
		uni.$emit('chat-msg-push',msg) //聊天记录的刷新
		uni.$emit('information_listener')
	} else if(msg.type === 6 ) {
		msg.status = 2
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
		uni.$emit('chat-user-list-refresh',chatUserList) //聊天列表的刷新
		msg = $chat.setChatListFromStorage(chatToken,msg)
		uni.$emit('chat-msg-push',msg) //聊天记录的刷新
		uni.$emit('information_listener')
	}
}

/**
 * 消息投递出去
 * @param res
 */
function msgDelivered(res){
	let chatToken = $storage.getUserInfo().chatToken
	let msg = JSON.parse(JSON.stringify(res))
	let chatUserList = []
	if(msg.type === 1) {
		msg.status = 1
		uni.downloadFile({
			url: msg.src,
			success: (res) => {
				if (res.statusCode === 200) {
					console.log(res.tempFilePath)
					$chat.saveTempFileToLocal(res.tempFilePath,chatToken, msg.type, e => {
						// console.log(e)
						let localPath = e.path + e.name
						msg.src = localPath
						msg.status = 2
						chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
						uni.$emit('chat-user-list-refresh',chatUserList)
						msg = $chat.setChatListFromStorage(chatToken,msg)
						pushMessage(msg)
						uni.$emit('chat-msg-push',msg)
					}, err => {
						msg.src = ''
						msg.status = 3
						chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
						uni.$emit('chat-user-list-refresh',chatUserList)
						uni.$emit('chat-msg-push',msg)
					})
				}
			},
			fail: (err) => {
				msg.src = ''
				msg.status = 3
				chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
				uni.$emit('chat-user-list-refresh',chatUserList)
				msg = $chat.setChatListFromStorage(chatToken,msg)
				uni.$emit('chat-msg-push',msg)
			}
		});

	} else {
		chatUserList = $chat.addChatUserListFromStorage(chatToken,msg)
		uni.$emit('chat-user-list-refresh',chatUserList) //聊天列表的刷新

		msg = $chat.setChatListFromStorage($storage.getUserInfo().chatToken,msg)

		pushMessage(msg) //调取发送推送的接口
		uni.$emit('chat-msg-push',msg)
		if(msg.type==2||msg.type==3||msg.type==4) {
			ajax('/api/user/setCanChat',{userId:msg.toUserId},'POST')
		}
	}
	console.log('发送消息: msgDelivered', msg);

}


const init = function(vm){
	vmm = vm
	uni.$off('mqtt-arrived-msg',msgArrived)
	uni.$off('mqtt-delivered-msg',msgDelivered)

	uni.$on('mqtt-arrived-msg',msgArrived)//goeasy监听消息到达，到了以后，抛出这个mqtt-arrived-msg，重要重要
	uni.$on('mqtt-delivered-msg',msgDelivered)

	if($storage.getLoginToken()) {
		// $store.commit('initMQTT',$storage.getUserInfo().chatToken)

		$store.commit('initGoEasy',JSON.stringify($storage.getUserInfo()));
	}

}
module.exports = init
