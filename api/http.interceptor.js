import logout from '@/utils/logout/index.js'
// 这里的Vue为Vue对象(非创建出来的实例)，vm为main.js中“Vue.use(httpInterceptor, app)”这一句的第二个参数，
// 为一个Vue的实例，也即每个页面的"this"
// 如果需要了解这个install方法是什么，请移步：https://uviewui.com/components/vueUse.html
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	console.log('拦截器');
	Vue.prototype.$u.http.setConfig({
		//正式域名
		baseUrl: 'https://erp.patixiu.com',
		
		// baseUrl: 'http://192.168.0.112:9090',
		loadingText: '努力加载中~',
		showLoading: false,
		loadingMask: false,
		loadingTime: 0, //单位ms
		originalData: true,
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		}
		// 设置自定义头部content-type
		// header: {
		// 	'content-type': 'xxx'
		// }
		// ......
	});
	// 拦截请求
	Vue.prototype.$u.http.interceptor.request = (config) => {
		let url = config.url;
		if(url != '/api/user/phoneLogin'&&vm.globalData.token){
			config.data = Object.assign(config.data, {
				token: vm.globalData.token || ""
			})
		}
		// console.log(config.url);
		// console.log(config.data);
		return config
	}
	// 相应拦截
	Vue.prototype.$u.http.interceptor.response = (res) => {
		if(res.statusCode == 200){
			let code = res.data.code;
			// console.log(res)
			if(parseInt(code) != 0){
				// console.log(res)
				if(res.data.msg && res.data.msg != 'success' && res.data.msg != '未知错误'){
					uni.showToast({
						title: res.data.msg,
						icon: 'none'
					})
				}
				if(code==-2) {
					logout(false)
				}
			}
			return res.data;
		}else{
			// console.log(res.data)
			uni.hideLoading();
			console.log('请求异常');
			uni.showToast({
				title: '网络异常，请确认在网络良好状态下使用',
				icon: 'none'
			})
		}
	}
}


export default {
	install
}
