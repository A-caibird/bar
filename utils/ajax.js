
//应该不需要了
import toast from '@/common/toast.js'


const ajax = (_url, data = {}, method = 'GET') => {
	const app = getApp()
	// let BASE_URL = 'https://erp.patixiu.com'
	let BASE_URL = 'http://192.168.0.100:8080'
	let url = BASE_URL + _url
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


module.exports = {
	ajax,

}
