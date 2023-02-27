//应该不需要了
import $chat from '@/utils/chat/index.js'
/*
	尬酒 发送邀约订单
	orderInfo： 订单信息， id(订单id)  clubCover(酒吧图片) clubName(酒吧名称) date(接待时间) cardTableName(酒吧座位编号) amount(支付金额)
	friendInfo： chatToken, chatUserId, userId, name, avatar
 */
async function sendYaoyueInfo(vm, orderInfo, friendInfo, statement, callback = null) {
	let userInfo = vm.$u.deepClone(getApp().globalData.userInfo)
	let {
		code,
		data
	} = await vm.$u.api.yaoyueInviteApi({
		orderId: orderInfo.id,
		userId: friendInfo.userId
	})//创建后台尬酒邀约记录
	if (code == 0) {
		$chat.sendMsg(userInfo, friendInfo, 'single', 'yaoyue', {
			orderId: orderInfo.id,
			clubCover: orderInfo.clubCover,
			clubName: orderInfo.clubName,
			date: orderInfo.date,
			cardTableName: orderInfo.cardTableName,
			awkwardWineId: data.awkwardWineId,
			agreeStatus: 'none',
			statement: statement
		})
		if(callback){
			callback();
		}
	}
}

/*
	尬酒发送拼享订单
 */
async function sendPingInfo(vm, orderInfo, friendInfo, callback = null){
	let userInfo = vm.$u.deepClone(getApp().globalData.userInfo)
	let {
		code,
		data
	} = await vm.$u.api.pingInviteApi({
		orderId: orderInfo.id,
		userId: friendInfo.userId
	})
	if(code == 0){
		$chat.sendMsg(userInfo, friendInfo, 'single', 'ping', {
			orderId: orderInfo.id,
			clubCover: orderInfo.clubCover,
			clubName: orderInfo.clubName,
			date: orderInfo.date,
			cardTableName: orderInfo.cardTableName,
			amount: orderInfo.amount,
			agreeStatus: 'none',
		})
		// vm.$toast.text('已发送拼享请求')
		if(callback){
			callback()
		}
	}
}


module.exports = {
	sendYaoyueInfo,
	sendPingInfo
}
