 function request(url, data, method = 'GET'){
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://erp.patixiu.com' + url,
			data,
			method,
			success: res => {
				resolve(res.data);
			},
			fail: e => {
				reject(e);
			}
			
		})
	})
}
exports.request = request;