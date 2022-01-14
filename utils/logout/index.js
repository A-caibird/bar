import $store from '@/store/index.js'
import $storage from '@/common/storage.js'
import {ajax} from '@/utils/ajax.js'
// app推送 
const logout = function (out = true) {
	if(out){
		ajax('/api/user/setClientId',{clientId:''},'POST')
	}
	$storage.removeLoginToken()
	$storage.removeUserInfo()
	$storage.removeLocation()
	$storage.removePayPassword()
	getApp().globalData.token = ""
	getApp().globalData.passwordInputTimes = 0;
	getApp().globalData.authorized = false
	getApp().globalData.userInfo = {}
	getApp().globalData.location = {cityName: '宁波',lng: 121.557239,lat: 29.809815}
	getApp().globalData.payPassword = ''
	$store.commit('disconnectGoEasy',{callback: null});
	uni.navigateTo({
		url: '/pages/login/login'
	})
}
module.exports = logout


