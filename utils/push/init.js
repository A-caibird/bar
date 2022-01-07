import logout from '@/utils/logout/index.js';
function handlePushReceive(msg) {
	console.log(msg)
	//todo
	let payload = Object.prototype.toString.call(msg.payload) === '[object Object]' ? msg.payload : JSON.parse(msg.payload)
	console.log(payload)
	if (msg.aps) { // Apple APNS message  
		//APNS下发的消息，应用在前台  
		console.log('APNS下发的消息，应用在前台  ')
	} else if ('LocalMSG' == payload.msgLocal) { // 特殊payload标识本地创建的消息  
		//本地创建的消息，通常不需要处理  
		//注意：不要在这种情况下再此调用plus.push.createMessage，从而引起循环创建本地消息 
		 console.log('本地创建的消息，通常不需要处理')
	} else if (!getApp().globalData.token) {
		console.log('未知用户');
	} 
	// else if (getApp().globalData.userInfo.chatToken != payload.identifier) {
	// } 
	else {
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		let route = '/'+page.route
		let vm = page.$vm
		//接收到在线透传消息
		let option = {
			icon: '',
			cover: true,
			title: '',
		}
		let content = ''
		let type = payload.type
		payload.msgLocal = 'LocalMSG' //ios用于区分自己创建的消息还是发送过来的透传消息
		
		if(type=='gift'&&route!='/pages/gift-animation/gift-animation') {//发布的动态被人赠送礼物
			if(route=='/pages/info/gift') {
				vm.reLoad()
			}
			option.title = payload.title
			content = payload.content
			let {gifUrl,sendInfo} = payload
			if(gifUrl) {
				uni.navigateTo({
					url:'/pages/gift-animation/gift-animation'+`?sendInfo=${sendInfo}`+ `&gifUrl=${gifUrl}`
				})
			}
			
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		
		if (payload.type == 'loginOtherDevice') {//离线通知不用创建消息
			logout()
		}
		if (type == 'msg') {//聊天消息
			console.log('聊天消息')
			if(route=='/pages/chat/chat') {
				if(vm.userInfo.chatToken==payload.identifier&&vm.friendUserInfo.chatToken==payload.sendUserId) {
					return 
				}
			}
			// console.log(payload)
			option.title = payload.nickName
			option.icon = payload.avatar
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'attention') {//某人关注我
			// console.log(payload)
			console.log('关注我')
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'orderInviteSuccess') {//被邀请者同意加入了我的邀约订单
			// console.log(payload)
			console.log('同意邀约')
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'quitInviteOrder') {//被邀请者退出了我的邀约订单
			// console.log(payload)
			console.log('退出邀约')
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'quitJoinOrder') {//拼享者退出了我的拼享订单
			// console.log(payload)
			console.log('退出拼享')
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'kickOut') {//我作为拼享者被爬梯主（拼享订单发起者）踢掉
			// console.log(payload)
			console.log('踢掉')
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'endOrder') {//清台
			console.log('清台')
			// console.log(payload)
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
		if (type == 'comment') {//某人评论了我的动态
			// console.log(payload)
			console.log('某人评论了我的动态')
			option.title = payload.title
			content = payload.content
			plus.push.createMessage(content,  JSON.stringify(payload), option);
		}
	}
}
function handlePushClick(msg) {
	//处理点击消息的业务逻辑代码  
	console.log(msg)
	let payload = Object.prototype.toString.call(msg.payload) === '[object Object]' ? msg.payload : JSON.parse(msg.payload)
	console.log(payload)
	if (payload.msgLocal == 'LocalMSG') {
		let pages = getCurrentPages();
		let page = pages[pages.length - 1];
		let route = '/'+page.route
		let vm = page.$vm
		let type = payload.type
		if (type == 'msg') {
			let {chatUserId,sendUserId,nickName,avatar,identifier,userId} = payload
			let info = {
					userId:userId,
					chatUserId:chatUserId,
					chatToken:sendUserId,
					name:nickName,
					avatar:avatar,
					hasSave:false,
				}
			let infoStr = JSON.stringify(info)
			if(route=='/pages/index/index') {
				vm.goChat({
					userInfo:infoStr
				})
			}  else if(route=='/pages/chat/chat') {
				if(vm.userInfo.chatToken==payload.identifier&&vm.friendUserInfo.chatToken!=payload.sendUserId) {
					uni.redirectTo({
						url:'/pages/chat/chat'+`?userInfo=${infoStr}`
					})
				}
			} else {
				uni.reLaunch({
					url: '/pages/index/index'+`?current=info`,
					success:function(){
						uni.navigateTo({
							url:'/pages/chat/chat'+`?userInfo=${infoStr}`
						})
					}
				})
			}
		}
		if(type=='gift') {
			if(route=='/pages/index/index') {
				console.log(1)
				vm.goInfoGift()
			} else if(route=='/pages/info/gift') {
				return
			} else if(route=='/pages/gift-animation/gift-animation') {
				vm.hide()
				handlePushClick(msg)
			} else {
				console.log(3)
				uni.reLaunch({
					url: '/pages/index/index'+`?current=info`,
					success:function(){
						uni.navigateTo({
							url:'/pages/info/gift'
						})
					}
				})
			}
			
		}
		if(type=='attention') {
			let {userId} =  payload
			vm.goPersonalHomepage(userId)
		}
		if(type=='orderInviteSuccess') {
			console.log(payload)
			let {orderId,inviteOrder} =  payload
			uni.navigateTo({
				url:'/pages/order/yao-create-detail'+`?orderId=${orderId}`
			})
		}
		if(type=='quitInviteOrder') {
			console.log(payload)
			let {orderId} =  payload
			uni.navigateTo({
				url:'/pages/order/yao-create-detail'+`?orderId=${orderId}`
			})
		}
		if(type=='quitJoinOrder') {
			console.log(payload)
			let {orderId} =  payload
			uni.navigateTo({
				url:'/pages/order/ping-create-detail'+`?orderId=${orderId}`
			})
		}
		if(type=='kickOut') {
			//无操作
		}
		if(type=='endOrder') {
			console.log(payload)
			let {orderId,inviteOrder} =  payload
			if(inviteOrder) {
				uni.navigateTo({
					url:'/pages/order/yao-create-detail'+`?orderId=${orderId}`
				})
			} else {
				uni.navigateTo({
					url:'/pages/order/ping-create-detail'+`?orderId=${orderId}`
				})
			}
			
		}
		if(type=='comment') {
			console.log(payload)
			let {id} =  payload
			uni.navigateTo({
				url:'/pages/info/comment'+`?mode=jump`+`&commentId=${id}`
			})
		}
	}else{
		openAPPMsg(payload);
	}
}

function openAPPMsg(payload){ //APP 处于关闭状态下 点击消息跳转页面
	let pages = getCurrentPages();
	let page = pages[pages.length - 1];
	let route = '/'+page.route
	let vm = page.$vm
	let type = payload.type
	if (type == 'msg') {
		let {chatUserId,sendUserId,nickName,avatar,identifier,userId} = payload
		let info = {
				userId:userId,
				chatUserId:chatUserId,
				chatToken:sendUserId,
				name:nickName,
				avatar:avatar,
				hasSave:false,
			}
		let infoStr = JSON.stringify(info)
		slientHandle(() => {
			console.log('聊天')
			vm.goChat({
				userInfo:infoStr
			})
		})
	}
	if(type=='gift') {
		console.log('礼物')
		slientHandle(() => {
			vm.goInfoGift()
		})	
	}
	if(type=='attention') {
		console.log('关注')
		let {userId} =  payload
		slientHandle(() => {
			vm.goPersonalHomepage(userId)
		})	
	}
	if(type=='orderInviteSuccess') {
		console.log(payload)
		console.log("同意邀请")
		let {orderId,inviteOrder} =  payload
		slientHandle(() => {
			uni.navigateTo({
				url:'/pages/order/yao-create-detail'+`?orderId=${orderId}`
			})
		})	
	}
	if(type=='quitInviteOrder') {
		console.log(payload)
		let {orderId} =  payload
		console.log("退出邀约")
		slientHandle(() => {
			uni.navigateTo({
				url:'/pages/order/yao-create-detail'+`?orderId=${orderId}`
			})
		})
	}
	if(type=='quitJoinOrder') {
		console.log(payload)
		let {orderId} =  payload
		console.log("退出拼享")
		slientHandle(() => {
			uni.navigateTo({
				url:'/pages/order/ping-create-detail'+`?orderId=${orderId}`
			})
		})
	}
	if(type=='kickOut') {
		//无操作
	}
	if(type=='endOrder') {
		console.log(payload)
		let {orderId,inviteOrder} =  payload
		console.log('结束订单')
		if(inviteOrder) {
			slientHandle(() => {
				uni.navigateTo({
					url:'/pages/order/yao-create-detail'+`?orderId=${orderId}`
				})
			})
		} else {
			slientHandle(() => {
				uni.navigateTo({
					url:'/pages/order/ping-create-detail'+`?orderId=${orderId}`
				})
			})
		}
		
	}
	if(type=='comment') {
		console.log(payload)
		let {id} =  payload
		console.log('评论');
		slientHandle(() => {
			uni.navigateTo({
				url:'/pages/info/comment'+`?mode=jump`+`&commentId=${id}`
			})
		})
	}
}

function slientHandle(callback,time = 2000){
	setTimeout(() => {
		callback();
	}, time)
}

const init = function(vm){
	// #ifdef APP-PLUS
	// 接受消息
	plus.push.addEventListener("receive", handlePushReceive, false);
	//点击消息
	plus.push.addEventListener('click', handlePushClick, false);
	// #endif
	
	
}
module.exports = init