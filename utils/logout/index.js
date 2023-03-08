import $store from '@/store/index.js'
import $storage from '@/common/storage.js'
// import {ajax} from '@/utils/ajax.js'
// app推送
const logout = function (out = true) {
	if(out){
		// ajax('/api/user/setClientId',{clientId:''},'POST')
		// this.$u.api.setClientId({clientId:''});
	}
	console.log('设备登出');
	$storage.removeLoginToken()
	$storage.removeUserInfo()
	$storage.removeLocation()
	$storage.removePayPassword()
	var app = getApp();
	// $store.commit('disconnectGoEasy',{callback: null});
	// $store.commit('clearInfoCount', 0);
	app.globalData.token = "";
	app.globalData.passwordInputTimes = 0;
	app.globalData.authorized = false;
	app.globalData.userInfo = {}
	app.globalData.location = {cityName: '宁波',lng: 121.557239,lat: 29.809815}
	app.globalData.payPassword = ''
	uni.navigateTo({
		// url: '/pages/login/login?register=1'
		url: '/pages/login/login'
	})
}
module.exports = logout


