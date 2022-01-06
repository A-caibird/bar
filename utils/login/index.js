import $store from '@/store/index.js'
import $storage from '@/common/storage.js'

const login = function (data, register = false) {
	let {token,fillInformation,info} = data
	
	if(fillInformation){
		// console.log(data)
		getApp().globalData.authorized=true;
		getApp().globalData.token = token
		getApp().globalData.userInfo = info
		$storage.setLoginToken(token)
		$storage.setUserInfo(info)
		
		// #ifdef APP-PLUS
		$store.commit('initMQTT',info.chatToken)
		// #endif
		// $store.commit('initMQTT',info.chatToken)
		// uni.reLaunch({
		// 	url: '/pages/index/index'
		// })
		if(register){
			uni.reLaunch({
				url: '/pages/index/index'
			})
		}else{
			if (data.options && data.options.from === 'nav') {
				uni.redirectTo(data.options.nav)
			} else {
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


