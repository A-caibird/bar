'use strict';
const uniPush = uniCloud.getPushManager({appId:"__UNI__ABC6F0F"});

exports.main = async(event) => {
	let body = event.body;
	let obj = {};
	
	if(body) {
		obj = JSON.parse(body);
	} else {
		return {
			"code":-1,
			"msg":"请使用post请求data传参",
			"event":JSON.stringify(event)
		}
	}
	
	const res = await uniPush.sendMessage({
		// 设备id,支持多个
		"push_clientid": obj.cids,
		"payload": obj.data
	})
	
	return res;
}

