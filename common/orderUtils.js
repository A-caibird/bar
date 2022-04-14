// 去付款
function goPay(vm, type, orderInfo) {
	let chatParams = "";
	let chatTag = false
	if(orderInfo.saveInviteUser && orderInfo.isCreator){
		chatTag = true;
		chatParams = {
			type: type == 'ping' ? 'ping' : 'yaoyue',
			friendInfo: {
				chatToken: orderInfo.saveInviteUser.chatToken,
				name: orderInfo.saveInviteUser.nickName,
				avatar: orderInfo.saveInviteUser.avatar,
				userId: orderInfo.saveInviteUser.id,
				chatUserId: orderInfo.saveInviteUser.chatUserId
			},
			orderInfo: {
				id: orderInfo.id,
				clubCover: orderInfo.clubCover,
				clubName: orderInfo.clubName,
				date: orderInfo.date,
				cardTableName: orderInfo.cardTableName
			}
		}
	}
	let params = {
		allAmount:orderInfo.originalWineCoin,
		orderId:orderInfo.id,
		type: type == 'ping' ? 'ping-order' : 'yao-order',
		chatTag: false,
	}
	if(chatTag){
		chatParams['statement'] = orderInfo.statementStr || "";
		params.chatTag = true;
		params['chatParams'] = encodeURIComponent(JSON.stringify(chatParams));
	}
	vm.$u.route('/pages/club/consumption/payPage', params)
}
module.exports = {
	goPay
}
