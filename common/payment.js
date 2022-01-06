// 唤起支付
function initPay(obj) {
	// #ifdef MP-WEIXIN
	const params = obj.wx
	const data = {
		timeStamp: params.timeStamp,
		nonceStr: params.nonceStr,
		package: params.packageValue,
		signType: 'MD5',
		paySign: params.paySign,
	}
	// #endif

	// #ifdef APP-PLUS
	let data
	if (obj.provider === 'wxpay') {
		const params = obj.orderInfo
		data = {
			provider: obj.provider,
			orderInfo: {
				appid: params.appId,
				noncestr: params.nonceStr,
				package: params.packageValue,
				partnerid: params.partnerId,
				prepayid: params.prepayId,
				timestamp: params.timeStamp,
				sign: params.sign
			}
		}
	} else {
		data = {
			provider: obj.provider,
			orderInfo: obj.orderInfo
		}
	}
	// #endif
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			...data,
			success: () => {
				resolve()
			},
			fail: (res) => {
				console.log(res)
				reject(res)
			}
		})
	})
}

// 获取支付方式
function getPayMethod(balanceHide) {
	let arr = [
		{
			label: '微信支付',
			value: "WechatPay"
		},
		{
			label: '支付宝支付',
			value: "AliPay"
		}
	]
	
	if (!balanceHide) {
		arr.push({
			label: '余额支付',
			value: 'balance'
		})
	}
	
	return arr
}

module.exports = {
	initPay,
	getPayMethod
}
