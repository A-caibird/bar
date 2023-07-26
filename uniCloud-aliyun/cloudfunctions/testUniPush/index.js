// 简单的使用示例
'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__ABC6F0F"}) //注意这里需要传入你的应用appId
exports.main = async (event, context) => {
	return await uniPush.sendMessage({
		"push_clientid": "68d876bab8deede3cfff94c45372d719", 	//填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
		"payload": {
			"title": "赠送礼物",
			"type": "gift",
			"content": "赠送礼物测试消息",
			"gifUrl": "/static/imgs/gift/animation.gif"
		}
	})
};