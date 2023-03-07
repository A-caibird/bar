import $store from '@/store/index.js'
import $storage from '@/common/storage.js'
import $cross from '@/common/cross.js'
// import {ajax} from '@/utils/ajax.js'

const login = function (data, register = false) {
	let {token,fillInformation,info} = data

	if(fillInformation){
		getApp().globalData.authorized=true;
		getApp().globalData.token = token
		getApp().globalData.userInfo = info
		$storage.setLoginToken(token)
		$storage.setUserInfo(info)

		//修改去掉了ajax.js
		//2023暂时去掉
		// this.$u.api.getPasswordInputTimesAPI().then(function (res){
		// 	let count = res.data.count || 0;
		// 	console.log("count: " + count);
		// 	getApp().globalData.passwordInputTimes = count;
		// }).catch(function (e){
		// 	console.log(e);
		// 	getApp().globalData.passwordInputTimes = 0;
		// });

		// ajax('/api/user/hasCanUserPayPasswordCount',{},'GET').then(res => {
		// 	let count = res.data.count || 0;
		// 	console.log("count: " + count);
		// 	getApp().globalData.passwordInputTimes = count;
		// }).catch(e => {
		// 	console.log(e);
		// 	getApp().globalData.passwordInputTimes = 0;
		// })
		// #ifdef APP-PLUS
		// $store.commit('initMQTT',info.chatToken)
		// #endif
		uni.$emit('information_listener')//触发事件，目前发现是在首页来监听的
		uni.$emit('push_listener')//触发事件，目前发现是在首页来监听的
		//$store.commit('initGoEasy', JSON.stringify(info))//目前应该不需要goeasy了，这个去掉后，消息收不到
		if(register){
			uni.reLaunch({
				url: '/pages/index/index'
			})
		}else{
			if (data.options && data.options.from === 'nav') {
				uni.redirectTo(data.options.nav)
			} else {
				let pages = getCurrentPages();
				if(pages.length >= 2){
					let beforePage = pages[pages.length - 2];
					if(beforePage){
						$cross.applyPageMethod(beforePage, 'refreshPage');
					}
				}

				uni.navigateBack()
			}
		}
	}
	else{
		uni.navigateTo({
			url:'/pages/register/information' + `?token=${token}`
		})
	}
}
module.exports = login


