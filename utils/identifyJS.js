const Client_Id = "BPaHUew9jjsihZnXsQyMpDcm"; //应用的API Key；
const Client_Secret = "L9Hy3lVP5COhM9KfDMDGqhSLOlGeDsso"; //应用的Secret Key；
import toast from '@/common/toast.js'


const ajax = (_url, data = {}, method = 'GET') => {
	const app = getApp()
	let url = _url
	let token = app.globalData.token
	if (token && !data.token) data.token = token
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			method,
			data,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success(res) {
				// console.log(res)
				const {
					errorCode,
					errorInfo,
					data
				} = res.data
				// 返回类型非   {"errorCode":"0","errorInfo":"","data":{}} 直接resolve
				if (errorCode === undefined || errorInfo === undefined || data === undefined) {
					// toast.confirm('',JSON.stringify(res.data))
					return resolve(res.data)
				}
				if (errorCode == 0) {
					if (data === null) {
						resolve()
					} else {
						
						resolve(data)
					}
				}
				else {
					if (errorInfo === '未知错误') {

					} else {
						toast.text(errorInfo)
						// toast.confirm('',msg)
					}
					// toast.confirm('',JSON.stringify(res.data))
					reject(res)
				}
			},
			fail(error) {
				toast.text('网络错误!')
				console.log(error)
				reject(error)
			},

		})
	})
}

// 获取百度 Access Token
function getAccessToken(){
	return new Promise((resolve, reject) => {
		ajax('https://aip.baidubce.com/oauth/2.0/token',{
			grant_type: "client_credentials",
			client_id: Client_Id,
			client_secret: Client_Secret
		},"POST").then(res => {
			resolve(res);
		}).catch(e => {
			reject(e);
		})	
	})
}

// 营业执照 识别API
/* 
 @params(token, url)
 token: 百度授权获取的权限 access_token
 url: 图片网络链接
 */
function businessIdentifyAPI(token, image){
	return new Promise((resolve, reject) => {
		ajax('https://aip.baidubce.com/rest/2.0/ocr/v1/business_license',{
			access_token: token,
			image,
		},"POST").then(res => {
			resolve(res);
		}).catch(e => {
			reject(e);
		})	
	})
}

// 营业执照识别逻辑处理
function businessIdentifyHandle(image){
	return new Promise((resolve, reject) => {
		getAccessToken().then(accessRes => {
			let token = accessRes.access_token;
			if(!token){
				reject(accessRes)
			}else{
				businessIdentifyAPI(token, image).then((res) => {
					let code = res.words_result['社会信用代码'].words;
					let name = res.words_result['单位名称'].words;
					let type = res.words_result['单位名称'].words;
					if(code !="无" && name !="无" && type !="无"){
						resolve(true);
					}else{
						resolve(false);
						toast.text("请上传正确的营业执照");
					}
				}).catch(e => {
					toast.text("请上传正确的营业执照");
					reject(e);
				})
			}
		}).catch(accessE => {
			toast.text("授权失败，请重新授权");
			reject(accessE)
		})
	})
}

export {
	businessIdentifyHandle
}