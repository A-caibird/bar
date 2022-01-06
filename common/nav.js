
// 白名单
const whitelist = [
	'/pages/index/index',
	'/pages/article/article',
	'/pages/club/detail',
	'/pages/club/activity/detail'
]

function navigateTo(obj) {
	if (judge(obj)) {
		uni.navigateTo(obj)
	}
}

function redirectTo(obj) {
	if (judge(obj)) {
		uni.redirectTo(obj)
	}
}

function switchTab(obj) {
	if (judge(obj)) {
		uni.switchTab(obj)
	}
}
function judge(obj) {
	const app = getApp()
	const url = obj.url
	const baseUrl = getBaseUrl(url)
	let index = whitelist.findIndex((value) => {
		return value === baseUrl
	})
	if (index >= 0) {
		return true
	}

	if (app.globalData.token) {
		return true
	}
	initLogin({
		from: 'nav',
		nav: obj
	})

	return false
}
function initLogin(obj) {
	if (!obj) {
		obj = {}
	}
	const data = encodeURIComponent(JSON.stringify(obj))
	uni.navigateTo({
		url: '/pages/login/login?data=' + data
	})
}

function getBaseUrl(url) {
	let index = url.indexOf('?')
	if (index === -1) {
		return url
	}
	return url.substring(0, index)
}

function bannberNav(bannber){
	let type = bannber.type;
	let url = "";
	switch(type){
		case "Graphic": {
			navigateTo({
				url: '/pages/article/article?type=Graphic'
			})
			uni.setStorageSync('Graphic_info', bannber.content);
		};break;
		case 'Club': {
			navigateTo({
				url: '/pages/club/detail?id=' + bannber.clubId
			})
		};break;
		case 'ClubActive': {
			navigateTo({
				url: '/pages/club/activity/detail?id=' + bannber.activityId
			})
		};break;
		default:break;
	}
}

module.exports = {
	navigateTo,
	redirectTo,
	switchTab,
	bannberNav
}