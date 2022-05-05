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
// 苹果支付
/* 
	@params goodsArray 数组类型
	goodsArray: 平台申请拿到的内购商品的id数组
 */
function iphonePay(goodsArray) {
	return
	uni.showLoading({
		title: '检测支付环境...',
		mask: true
	})
	return new Promise((resolve, reject) => {
		plus.payment.getChannels((channels) => {
			var iapChannel = "";
			for (var i in channels) {
				// 判断是否苹果支付
				if (channels[i].id === 'appleiap') {
					iapChannel = channels[i]
				}
			}
			if(iapChannel){
				iapChannel.restoreComplateRequest(); // 清除上次未购买的订单数据
				iapChannel.requestOrder(goodsArray, function(event) { // goodsArray 是平台申请拿到的内购商品的id 
					uni.hideLoading()
					console.log(event)
					for (var index in event) {
						var OrderItem = event[index]
						console.log(OrderItem)
						uni.showLoading({
							title: '充值中请勿离开',
							mask: true
						})
						uni.requestPayment({
							provider: 'appleiap',
							orderInfo: {
								productid: OrderItem.productid
							},
							success: (res => {
								uni.hideLoading()
								const transactionIdentifier = res.transactionIdentifier //交易id
								const transactionReceipt = res.transactionReceipt //校验体
								resolve({
									transactionIdentifier,
									transactionReceipt
								})
							}),
							fail: (e) => {
								uni.hideLoading()
								uni.showModal({
									content: "支付失败",
									showCancel: false
								})
								reject(e);
							},
				
						})
					}
				}, function(erroemsg) {
					uni.hideLoading()
					uni.showToast({
						title: "获取支付通道失败：" + errormsg.message,
						icon: 'none'
					})
					reject({
						msg: errormsg.message
					})
				})
				
			}else{
				//未发现苹果支付通过
				uni.hideLoading();
				reject({
					msg: '暂不支持苹果支付'
				})
			}
		})
	})
}


// 获取支付方式
function getPayMethod(balanceHide) {
	let arr = [{
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
