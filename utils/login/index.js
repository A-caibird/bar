import $store from '@/store/index.js'
import $storage from '@/common/storage.js'
import $cross from '@/common/cross.js'
import {ajax} from '@/utils/ajax.js'

const login = function (data, register = false) {
	let {token,fillInformation,info} = data
	
	if(fillInformation){
		console.log(data)
		getApp().globalData.authorized=true;
		getApp().globalData.token = token
		getApp().globalData.userInfo = info
		$storage.setLoginToken(token)
		$storage.setUserInfo(info)
		
		ajax('/api/user/hasCanUserPayPasswordCount',{},'GET').then(res => {
			let count = res.data.count || 0;
			getApp().globalData.passwordInputTimes = count;
		}).catch(e => {
			console.log(e);
			getApp().globalData.passwordInputTimes = 0;
		})
		// #ifdef APP-PLUS
		// $store.commit('initMQTT',info.chatToken)
		// #endif
		uni.$emit('refresh_chat');
		$store.commit('initGoEasy', JSON.stringify(info))
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


