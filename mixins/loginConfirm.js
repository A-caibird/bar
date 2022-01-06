export default{
	data(){
		return{
			authorized: getApp().globalData.authorized,
		}
	},
	onShow: function(){
		this.authorized = getApp().globalData.authorized;
	},
	methods: {
		loginConfirmHandle:function(onlyShow = true){
			let app = getApp();
			if(!app.globalData.authorized){
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				if(!onlyShow){
					setTimeout(() => {
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}, 1000)
				}
				return false; //未登录
			}else{
				return true; //已登录
			}
		}
	}
}