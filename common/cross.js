// 跨平台通用方法集合

// 执行Vue对象的方法
function applyPageMethod(page, method, params = "") {
	// #ifdef H5
	if(page[method]){
		page[method](params)
	}
	// #endif

	// #ifndef H5
	if(page.$vm[method]){
		page.$vm[method](params)
	}
	
	// #endif
}

// Vue对象设置属性
function setPageData(page, obj) {
	for (let k in obj) {
		page.$vm[k] = obj[k]
	}
}

// 获取上一页的Vue对象
function beforePage() {
	const pages = getCurrentPages()
	return pages[pages.length - 2]
}

// App.vue于onLaunch方法中获取globalData
function globalDataInApp(app) {
	// #ifdef H5
	return app.globalData
	// #endif
	// #ifndef H5
	console.log(app.globalData);
	return app.globalData
	// return app.$mp.app.globalData
	// #endif
}

// 只在App中执行
function appAction(fun) {
	// #ifdef APP-PLUS
	fun()
	// #endif
}

module.exports = {
	applyPageMethod,
	setPageData,
	beforePage,
	globalDataInApp,
	appAction
}
