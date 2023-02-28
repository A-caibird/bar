//这个文件好像没被调用

/*
 *上传文件到阿里云oss
 *@param - filePath :图片的本地资源路径
 *@param - dir:表示要传到哪个目录下
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
var loop_times = 0;
const uploadFile = function(filePath, dir, successc, failc) {
	getOssInfo().then(res => {
		// console.log(res);
		let {code, data} = res.data;
		if(parseInt(code) == 0){
			uploadFileAPI(filePath, dir, successc, failc, data.sign)
		}else{
			failc(res.data);
		}
	}).catch(e => {
		console.log(e);
		failc(e);
	})
}
const uploadFileAPI = function(filePath, dir, successc, failc, aliyunSign) {
	if (!filePath || filePath.length < 9) {
		uni.showModal({
			title: '文件错误',
			content: '请重试',
			showCancel: false,
		})
		return;
	}
	if(!aliyunSign.baseUrl){
		uni.showModal({
			title: 'OSS参数错误',
			content: '请重试',
			showCancel: false,
		})
		return
	}
	//图片名字 可以自行定义，     这里是采用当前的时间戳 + 150内的随机数来给图片命名的
	const aliyunFileKey = dir + new Date().getTime() + Math.floor(Math.random() * 150) + getFileType(filePath);

	const aliyunServerURL = aliyunSign.baseUrl; //OSS地址，需要https
	const accessid = aliyunSign.accessId;
	const policyBase64 = aliyunSign.encodedPolicy;
	const signature = aliyunSign.postSignature; //获取签名
	uni.uploadFile({
		url: aliyunServerURL, //开发者服务器 url
		filePath: filePath, //要上传文件资源的路径
		name: 'file', //必须填file
		formData: {
			'key': aliyunFileKey,
			'policy': policyBase64,
			'OSSAccessKeyId': accessid,
			'signature': signature,
			'success_action_status': '200',
		},
		success: function(res) {
			if (res.statusCode != 200) {
				failc(new Error('上传错误:' + JSON.stringify(res)))
				console.log( JSON.stringify(res) + ', ' + filePath + ', ' + JSON.stringify({
						'key': aliyunFileKey,
						'policy': policyBase64,
						'OSSAccessKeyId': accessid,
						'signature': signature,
						'success_action_status': '200'
					}))
				// uni.showModal({
				// 	content: JSON.stringify(err) + ', ' + filePath + ', ' + JSON.stringify({
				// 		'key': aliyunFileKey,
				// 		'policy': policyBase64,
				// 		'OSSAccessKeyId': accessid,
				// 		'signature': signature,
				// 		'success_action_status': '200'
				// 	}),
				// 	showCancel:false
				// })
				return;
			}
			successc(aliyunServerURL + aliyunFileKey);
		},
		fail: function(err) {
			err.wxaddinfo = aliyunServerURL;
			failc(err);
			console.log( JSON.stringify(err) + ', ' + filePath + ', ' + JSON.stringify({
					'key': aliyunFileKey,
					'policy': policyBase64,
					'OSSAccessKeyId': accessid,
					'signature': signature,
					'success_action_status': '200'
				}))
			// uni.showModal({
			// 	content: JSON.stringify(err) + ', ' + filePath + ', ' + JSON.stringify({
			// 		'key': aliyunFileKey,
			// 		'policy': policyBase64,
			// 		'OSSAccessKeyId': accessid,
			// 		'signature': signature,
			// 		'success_action_status': '200'
			// 	}),
			// 	showCancel:false
			// })
		},
	})
}


//应该不需要了
function getOssInfo(){
	let baseUrl = getApp().globalData.baseUrl;
	return new Promise(function(resolve, reject){
		uni.request({
			url: baseUrl + '/api/OSSSign/sign',
			success(res) {
				resolve(res);
			},
			fail(e){
				console.log(e);
				reject(e);
			}
		})
	})
}



const getFileType = function(filePath) {
	let arr = filePath.split('.')
	let fileType = arr[arr.length - 1]
	return '.' + fileType
}

module.exports = uploadFile;
