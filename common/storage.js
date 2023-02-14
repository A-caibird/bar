// 本地缓存相关操作
const LOGIN_TOKEN_KEY = 'jiuba_login_token'// 设置登录token
// const ChatToken = 'chatToken' //聊天标识
const UserInfo = 'userInfo' //用户信息
const Location = 'location' //地址信息
const PayPassword = 'payPassword' //支付密码



module.exports = {
	setLoginToken:(token)=>uni.setStorageSync(LOGIN_TOKEN_KEY, token),
	getLoginToken:()=>uni.getStorageSync(LOGIN_TOKEN_KEY),
	removeLoginToken:()=> uni.removeStorageSync(LOGIN_TOKEN_KEY),

	setLocation:(location)=>uni.setStorageSync(Location, location),
	getLocation:()=>uni.getStorageSync(Location),
	removeLocation:()=> uni.removeStorageSync(Location),

	setUserInfo:(userInfo)=>uni.setStorageSync(UserInfo, userInfo),
	getUserInfo:()=>uni.getStorageSync(UserInfo),
	removeUserInfo:()=> uni.removeStorageSync(UserInfo),

	setPayPassword:(payPassword)=>uni.setStorageSync(PayPassword, payPassword),
	getPayPassword:()=>uni.getStorageSync(PayPassword),
	removePayPassword:()=> uni.removeStorageSync(PayPassword),

	getStorageFilter:(storage,defaultVal)=>{return ((storage == '' || storage == null || storage == undefined) ? defaultVal  : storage) },

	// 同步存储,失败则进行异步存储
	setStorageSync:(key,value)=>{
		try {
		    uni.setStorageSync(key, value);
		} catch (e) {
			setStorage(key, value);
		}
	},

	// 同步读取缓存
	getStorageSync:(key)=>{
		try {
		    const value = uni.getStorageSync(key);
		    if (value) {
		        return value
		    }
		} catch (e) {
			console.log(e);
			getStorage(key);
		}
	},

	// 同步移除某一键值对
	removeStorageSync:(key)=>{
		try {
			uni.removeStorageSync(key);
			console.log("缓存删除成功");
		} catch (e) {
		    removeStorage(key);
		}
	},

	clearStorage:()=>uni.clearStorageSync(),
}
