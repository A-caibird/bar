
var pageAvaliable = true;
// 发起请求之前的初始化工作
function initPage(that, params) {
	let pageNumber = that.pageNumber
	// 初始化 more 标记为true
	that.more = true
	that.noResult = false

	// 当pageNumber为0,即获取第一页时,将商品列表清空
	if (pageNumber === 0) {
		that.pageList = []
		that.loading = true
	} else {
		that.pageLoading = true
	}

	pageNumber++
	let data = Object.assign({}, params, {
		pageNumber,
		pageSize: that.pageSize
	})

	return data
}

function getTotalPager(res) {
	let totalPager = res.totalPager !== undefined ? res.totalPager : res.totalPages

	if (totalPager === undefined) {
		totalPager = res.totalPage
	}

	return totalPager
}

function request(that, url, data, str, callback) {
	const pageNumber = data.pageNumber
	pageAvaliable = false;
	that.$u.api.commonRequest(url, data, 'get').then((res) => {
		// 请求结束，将loading和pageLoading改为false
		that.$nextTick(() => {
			setTimeout(() => {
				that.loading = false
				that.pageLoading = false
				pageAvaliable = true
			}, 800)
		})
		if (res.data) {
			res = res.data
		}
		// 返回的页数为0时,标记 noResult 为true
		let totalPager = getTotalPager(res)
		if (totalPager > 0) {
			that.noResult = false

			if (pageNumber === 1) {
				// 获取第一页时,将原先列表覆盖
				that.pageList = res[str]
			} else {
				// 当获取非第一页时,将新的列表项添加到原先的列表中
				let pageList = that.pageList || []
				pageList = pageList.concat(res[str])
				that.pageList = pageList
			}

			that.pageNumber = pageNumber
			that.totalPager = totalPager

			// 当新获取的数据为最后一页时,将 more 标记置为false
			if (pageNumber === totalPager) {
				that.more = false
			}
		} else {
			that.noResult = true
		}

		if (callback) {
			callback(res)
		}
	})
}

function getPageHelper(that, url, params, str, callback, delay) {
	let pageNumber = that.pageNumber

	// 当pageNumber为totalPager时,直接返回   
	if (pageNumber === that.totalPager) {
		that.loading = false;
		uni.hideLoading();
		pageAvaliable = true;
		return false
	}

	const data = initPage(that, params)

	delay = delay ? delay : 0
	setTimeout(() => {
		that.$nextTick(() => {
			request(that, url, data, str, callback)
		})
		// request(that, url, data, str, callback)
	}, delay)
	return true
}

function getPage(that, url, params, str, callback) {
	if(!pageAvaliable){
		return;
	}
	return getPageHelper(that, url, params, str, callback)
}

function getPageDelay(that, url, params, str, callback) {
	if(!pageAvaliable){
		return;
	}
	return getPageHelper(that, url, params, str, callback, 0)
}

module.exports = {
	getPage,
	getPageDelay
}
