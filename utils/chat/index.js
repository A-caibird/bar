import $storage from '@/common/storage.js'//只是一些用户信息和登录令牌啥的
import $store from '@/store/index.js'//vuex goeasy相关
import $chatList from '@/utils/sqllite/chat-list/index.js'//数据库聊天相关的信息
import uploadFile from '@/utils/upload';

async function downloadAvatar(url) {
	return new Promise((resolve, reject) => {
		uni.downloadFile({
		    url,
		    success: (res) => {
		        if (res.statusCode === 200) {
					uni.saveFile({
						tempFilePath:res.tempFilePath,
						success: (ret) => {
						  console.log('下载成功');
						  console.log(ret.savedFilePath)
						  resolve(ret.savedFilePath)
						},
						fail: () => {
							reject(res)
						}
					})
		        } else {
					reject(res)
				}
		    },
			fail(err) {
				reject(err)
			},
		})
	})
}


/*
	获取整个聊天对象列表 chatUserList
	account 用户
 */
function getChatUserListFromStorage(account) {
	let list = $storage.getStorageSync(`chatUserList_${account}`) || []
	return list
}

/*
	获取整个聊天对象列表 未读数
	account 用户
 */
function getChatUserNotReadNum(account) {
	let list = $storage.getStorageSync(`chatUserList_${account}`) || []
	let num = 0
	list.forEach(e=>{
		num+=e.notReadNum
	})
	return num
}

/*
	获取canChat
*/
function getCanChat(account,friendId) {
	let canChat = false
	let list = $storage.getStorageSync(`chatUserList_${account}`) || []
	let index = list.findIndex(e=>{
		return e.friendId==friendId
	})
	if(index!=-1) {
		if(list[index].canChat) {
			canChat = true
		}
	}
	return canChat
}


/*
	添加聊天对象列表
 */
function addChatUserListFromStorage(account,item) {
	let canChat = false

	let list = $storage.getStorageSync(`chatUserList_${account}`) || []
	let friendId = ''
	let friendName = ''
	let friendAvatar = ''
	let chatUserId = -1
	let userId = -1
	let type = 'send'
	if(item.type==1) {
		item.content = '[图片]'
	}
	if(item.type==2) {
		item.content = '[邀约邀请消息]'
		canChat = true
	}
	if(item.type==3) {
		item.content = '[拼享邀请消息]'
		canChat = true
	}
	if(item.type==4) {
		item.content = '[拼享加入申请]'
		canChat = true
	}
	if(account==item.fromId) {//我发送的消息
		chatUserId = item.chatUserId
		userId = item.toUserId
		friendId = item.toId
		friendName = item.toName
		friendAvatar = item.toAvatar
	} else if(account==item.toId) {//我接收的消息
		chatUserId = item.myChatUserId
		userId = item.fromUserId
		friendId = item.fromId
		friendName = item.fromName
		friendAvatar = item.fromAvatar
		type = 'received'
	}
	if(friendId=='') return
	item.friendId = friendId
	item.friendName = friendName
	item.avatar = friendAvatar
	item.account = account
	item.chatUserId = chatUserId
	item.userId = userId
	item.hasSave = false
	// console.log(item)
	let index = list.findIndex(e=>{
		return e.friendId==friendId
	})
	if(index!=-1) {
		if(list[index].canChat) {
			canChat = true
		}
	}
	item.canChat = canChat
	if(type == 'send') {
		if(index!=-1) {
			item.notReadNum = 0
			list.splice(index,1)
			list.unshift(item)
		} else {
			item.notReadNum = 0
			list.unshift(item)
		}
	} else {
		if(index!=-1) {
			item.notReadNum = list[index].notReadNum + 1
			list.splice(index,1)
			list.unshift(item)
		} else {
			item.notReadNum = 1
			list.unshift(item)
		}
	}
	$storage.setStorageSync(`chatUserList_${account}`, list)
	// console.log(list)
	return list
}

/*
	添加聊天对象列表
 */
function setChatUserListFromStorage(account,list) {
	$storage.setStorageSync(`chatUserList_${account}`,list)
}

/*
	根据userId修改聊天对象的昵称和头像
	根据hasSave来判断头像是否保存下来
 */
function setChatUserListNameAvatarFromStorageByUserId(account,userId,name,avatar) {
	return new Promise((resolve, reject) => {
		let list = $storage.getStorageSync(`chatUserList_${account}`) || []
		let index = list.findIndex(e=>{
			return e.userId==userId
		})
		if(index!=-1) {
			let user = JSON.parse(JSON.stringify(list[index]))
			// console.log(avatar)
			// console.log(user.avatar)
			if(avatar==user.avatar) {//相同
				if(user.hasSave) {//已保存文件
					plus.io.getImageInfo({
						src:user.localAvatar,
						success:function(res){
							if(user.friendName!=name) {
								user.friendName=name
								list[index] = user
								setChatUserListFromStorage(account,list)
								uni.$emit('chat-user-list-refresh',list)
							}
							resolve(user.localAvatar)
						},
						fail:function(err){
							downloadAvatar(avatar).then(res=>{
								user.localAvatar = res
								user.friendName=name
								user.hasSave = true
								console.log(user)
								list[index] = user
								setChatUserListFromStorage(account,list)
								uni.$emit('chat-user-list-refresh',list)
								resolve(localAvatar)
							}).catch(err=>{
								if(user.friendName!=name) {
									user.friendName=name
									list[index] = user
									setChatUserListFromStorage(account,list)
									uni.$emit('chat-user-list-refresh',list)
								}
								resolve(avatar)
							})
						}
					})
				} else {
					//下载头像
					downloadAvatar(avatar).then(res=>{
						user.localAvatar = res
						user.friendName=name
						user.hasSave = true
						// console.log(user)
						list[index] = user
						setChatUserListFromStorage(account,list)
						uni.$emit('chat-user-list-refresh',list)
						resolve(localAvatar)
					}).catch(err=>{
						if(user.friendName!=name) {
							user.friendName=name
							list[index] = user
							setChatUserListFromStorage(account,list)
							uni.$emit('chat-user-list-refresh',list)
						}
						resolve(avatar)
					})

				}
			} else {//不相同
				user.avatar = avatar
				//下载头像
				downloadAvatar(avatar).then(res=>{
					user.localAvatar = res
					user.friendName=name
					user.hasSave = true
					console.log(user)
					list[index] = user
					setChatUserListFromStorage(account,list)
					uni.$emit('chat-user-list-refresh',list)
					resolve(localAvatar)
				}).catch(err=>{
					if(user.friendName!=name) {
						user.friendName=name
						list[index] = user
						setChatUserListFromStorage(account,list)
						uni.$emit('chat-user-list-refresh',list)
					}
					resolve(avatar)
				})
			}

		} else {
			resolve(avatar)
		}


	})

}

/*
	更新聊天记录
	list 聊天记录列表
 */
function delChatUserItem(account,friendId) {
	let list = $storage.getStorageSync(`chatUserList_${account}`) || []
	let index = list.findIndex(e=>{
		return e.friendId==friendId
	})
	if(index!=-1) {
		list.splice(index,1)
		$storage.setStorageSync(`chatList_${account}_${friendId}`, list)
	}
}

/*
	根据 time和type 分别更新数据库和缓存中的聊天记录
 */
function upadteChatByTimeType(account,friendId,time,type,item) {
	let list = getChatListFromStorage(account,friendId)
	let index = list.findIndex(e=>{
		return e.time==time&&e.type==type
	})
	if(index!=-1) {
		list[index] = item
		$storage.setStorageSync(`chatList_${account}_${friendId}`, list)
	}
	$chatList.setChatListAgreeStatusToDBByTimeType(account,friendId,time,type,item.agreeStatus)
}
/*
	获取整个聊天列表 chatList
 */
function getChatListFromStorage(account,friendId) {
	let list = $storage.getStorageSync(`chatList_${account}_${friendId}`) || []
	return list
}
/*
	获取整个聊天列表 chatList
 */
function removeChatListFromStorage(account,friendId) {
	$storage.removeStorageSync(`chatList_${account}_${friendId}`)
	console.log(getChatListFromStorage(account,friendId))
}

/*
	添加聊天列表
 */
function setChatListFromStorage(account,item) {
	let friendId = -1
	let type = 'send'
	if(account==item.fromId) {
		friendId = item.toId
	} else if(account==item.toId) {
		friendId = item.fromId
		type = 'received'
	}
	if(friendId==-1) return
	item.account = account
	let list = $storage.getStorageSync(`chatList_${account}_${friendId}`) || []
	list.push(item)
	// console.log(list);
	$storage.setStorageSync(`chatList_${account}_${friendId}`, list)
	return item
}

/*
	更新聊天记录
	list 聊天记录列表
 */
function updateChatList(account,friendId,list) {
	$storage.setStorageSync(`chatList_${account}_${friendId}`, list)
}



/*
	获取聊天列表
	先从storage中查找记录，若无记录，再从数据库中查找数据 15条一页
 */
async function getChatList(account,friendId,pageNum, pageSize = 15) {
	// console.log('pageNum:'+pageNum);
	// pageNum为空时 则从storage从取记录，若无数据再从数据库取
	if(!pageNum) {
		let chatList = getChatListFromStorage(account, friendId)
		// console.log(chatList);
		if(!chatList.length) {
			// 从数据库取
			console.log(account)
			console.log(friendId)
			return await $chatList.getChatListFromDB(account,friendId,1)
		} else {
			// console.log(account)
			// console.log(friendId)
			return chatList
		}
	} else {
		// 从数据库取
		return await $chatList.getChatListFromDB(account,friendId,pageNum)
	}
}


async function saveChatList(account,friendId){
	let storageChatlist = getChatListFromStorage(account,friendId)
	if(storageChatlist.length&&storageChatlist.length>15) {
		let chatList = storageChatlist.slice(0,storageChatlist.length-15)
		console.log(chatList)
		await $chatList.setChatListToDB(chatList)
		let newChatList = storageChatlist.slice(storageChatlist.length-15)
		console.log(newChatList)
		updateChatList(account,friendId,newChatList)

	}
}

async function delChatList(account,friendId){
	removeChatListFromStorage(account,friendId)
	console.log(account)
	console.log(friendId)
	await $chatList.delChatListToDB(account,friendId)
}

/*
	发送数据之前 先需要保存数据到本地【实际有在用，之前goeasy模式下】
	type: string (text文本，image图片，voice语音，address地址)
	success, fail 成功，失败回调

	$chat.sendMsg(userInfo, friendUserInfo, 'single', 'greet', {
					content: msg,
				})


 */
function sendMsg(userInfo,friendUserInfo,chat_type,type, data, success, fail) {
	let params = JSON.parse(JSON.stringify(data))
	// console.log(params)
	params.time = (new Date()).getTime();
	params.chat_type = chat_type === 'single'?0:1;
	params.account = userInfo.chatToken
	params.fromId = userInfo.chatToken
	params.fromName = userInfo.name
	params.fromAvatar = userInfo.avatar
	params.myChatUserId = userInfo.chatUserId
	params.fromUserId = userInfo.userId
	params.toId = friendUserInfo.chatToken
	params.toName = friendUserInfo.name
	params.toAvatar = friendUserInfo.avatar
	params.toUserId = friendUserInfo.userId
	params.chatUserId = friendUserInfo.chatUserId
	params.status = 0
	params.read = 0
	// console.log(params.chatUserId)
	// 文本消息
	if(type === 'text') {
		// 文本保存完之后直接发送
		params.type = 0;
		// 同步阻塞存贮

		params.status = 2
		// console.log(params)
		uni.$emit('mqtt-delivered-msg', params)
		$store.commit('sendMsg', {
			msg: JSON.stringify(params),
			chatId:friendUserInfo.chatToken
		})
	}

	else if(type === 'image') {
		// 删除一些不需要的字段
		// 本地资源临时url
		if(params.tempPath) {
			delete params.tempPath;
		}
		params.type = 1;
		uploadFile(data.tempPath, 'image/', function success(res) {
			params.src = res
			let localStr = JSON.parse(JSON.stringify(params))
			// console.log('发送消息');
			// console.log(localStr)
			uni.$emit('mqtt-delivered-msg', localStr)
			// 文件网络地址 发送给对方

			$store.commit('sendMsg', {
				msg: JSON.stringify(params),
				chatId:friendUserInfo.chatToken
			})
		}, function fail(err) {
			params.status = 3
		})

	} else if(type === 'yaoyue') {
		// 文本保存完之后直接发送
		params.type = 2;
		// 同步阻塞存贮

		params.status = 2
		// console.log(params)
		uni.$emit('mqtt-delivered-msg', params)
		$store.commit('sendMsg', {
			msg: JSON.stringify(params),
			chatId:friendUserInfo.chatToken
		})
	} else if(type === 'ping') {
		// 文本保存完之后直接发送
		params.type = 3;
		// 同步阻塞存贮

		params.status = 2
		// console.log(params)
		uni.$emit('mqtt-delivered-msg', params)
		$store.commit('sendMsg', {
			msg: JSON.stringify(params),
			chatId:friendUserInfo.chatToken
		})
	} else if(type === 'pingJoin') {
		// 文本保存完之后直接发送
		params.type = 4;
		// 同步阻塞存贮

		params.status = 2
		// console.log(params)
		uni.$emit('mqtt-delivered-msg', params)
		$store.commit('sendMsg', {
			msg: JSON.stringify(params),
			chatId:friendUserInfo.chatToken
		})
	} else if(type === 'greet') {
		// 文本保存完之后直接发送
		params.type = 5
		// 同步阻塞存贮

		params.status = 2
		// console.log(params)
		uni.$emit('mqtt-delivered-msg', params)
		$store.commit('sendMsg', {//通过goeasy正式发出去
			msg: JSON.stringify(params),
			chatId:friendUserInfo.chatToken
		})
	} else if(type === 'reply') {
		// 文本保存完之后直接发送
		params.type = 6
		// 同步阻塞存贮

		params.status = 2
		// console.log(params)
		uni.$emit('mqtt-delivered-msg', params)
		$store.commit('sendMsg', {
			msg: JSON.stringify(params),
			chatId:friendUserInfo.chatToken
		})
	}
}


/*
	保存临时文件为本地文件
	path: string, 临时文件url
 */
function saveTempFileToLocal(path,account, type, success, error) {
	// console.log(path);
	// 获取文件对象entry
	plus.io.resolveLocalFileSystemURL( path, function( entry ) {
		// console.log(entry.name);
		// 获取目录对象rootDir
		plus.io.resolveLocalFileSystemURL('_doc/', function(rootDir) {
			// 打开用户目录，不存在则创建目录
			// account 用户账号
			rootDir.getDirectory(account, {create: true}, function(userDir) {
				// 根据type类型进入或创建相应的文件夹
				// vioce文件夹放音频 image文件夹放图片和地址的图片
				let dirName = '';
				switch (type){
					case 1:
					case 5:
						dirName = 'image'
						break;
					case 2:
						dirName = 'voice'
						break;
					case 4:
						dirName = 'video'
						break;
					default:
						console.error(`文件夹类型错误，暂不支持该类型：${type}`);
						break;
				}
				userDir.getDirectory(dirName, {create: true}, function(typeDir) {
					console.log(typeDir.fullPath);
					// 保存文件
					saveAction(entry, typeDir, success, error)
				}, function(err) {
					console.log('创建类型目录失败----'+JSON.stringify(err))
				})
			}, function(err) {
				console.log('创建用户根目录失败----'+JSON.stringify(err))
			})
		}, function(err) {
			console.log(JSON.stringify(err));
		})
	}, function ( e ) {
		console.log( "Resolve file URL failed: " + e.message );
	} );
}

// 获取到目录之后，进行保存文件操作
function saveAction(entry, dir, success) {
	console.log(entry.name);
	let arr = entry.name.split('.')
	let fileType = arr[arr.length-1]
	console.log(fileType)
	let date = new Date()
	let fileName = date + '.' + fileType
	// 可通过entry对象操作文件
	entry.copyTo(dir, fileName, function(res) {
		// 保存成功之后,先将数据存入缓存
		success({
			path: dir.fullPath,
			name: fileName
		})
	}, function(err) {
		console.log(err);
	})
}



module.exports={

	// 获取未读记录
	getChatUserNotReadNum,
	// 删除与某人的聊天记录
	delChatList,
	// 将缓存中的聊天记录存到数据库中
	saveChatList,
	// 获取聊天记录列表
	getChatList,
	// 保存临时文件
	saveTempFileToLocal,
	// 获取聊天对象存列表
	getChatUserListFromStorage,
	// 发送消息
	sendMsg,
	// 聊天对象存入storage
	addChatUserListFromStorage,
	// 设置聊天对象存入storage
	setChatUserListFromStorage,
	// 根据userId修改聊天对象的昵称和头像
	setChatUserListNameAvatarFromStorageByUserId,
	// 聊天记录存入storage
	setChatListFromStorage,
	// 更新storage聊天记录
	updateChatList,
	upadteChatByTimeType,
	getCanChat,

}
