<script>
	import $storage from '@/common/storage.js'
	import init from '@/utils/init/index.js'//推送、上传的一些工具函数
	// import checkLocationPermision from '@/utils/checkLocationPermision.js'
	import $store from '@/store/index.js'
	export default {
		onLaunch: async function(options) {
			console.log('App Launch')
			init(this)
			//if($storage.getLoginToken()){
				// this.requestAPI('/api/user/use', {
				// 	token: $storage.getLoginToken(),
				// })
			//}
			uni.getSystemInfo({
				success: (res) => {
					if(res.platform == 'ios'){
						this.globalData.platform = 'ios'
					}else{
						this.globalData.platform = 'android'
					}
				}
			})
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef APP-PLUS
			// checkLocationPermision()
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		onUnload() {
			console.log('App unload');
		},
		methods:{
      //看起来没在用
			// requestAPI(url ,params){
			// 	uni.request({
			// 		url: this.globalData.baseUrl + url,
			// 		header:{
			// 			"Content-Type": 'application/x-www-form-urlencoded'
			// 		},
			// 		method:"POST",
			// 		data: params,
			// 		success(res){
			// 			console.log((url + ' success'), res);
			// 		},
			// 		fail(e){
			// 			console.log((url + ' Error'),e);
			// 		}
			// 	})
			// }
		},


    //globalData.baseUrl
		globalData: {
			platform: '', // 平台
			msgPath: '', // 推送消息路径；
			passwordInputTimes: 0,
			// baseUrl: 'https://erp.patixiu.com',
			baseUrl: 'http://192.168.0.100:8080',//应该没在用了
			authorized:  $storage.getLoginToken() ? true : false, //是否登录
			// 用户识别码
			token: $storage.getLoginToken(),
			//用户信息 chatToken、userId、chatUserId、name、avatar
			userInfo: $storage.getStorageFilter($storage.getUserInfo(),{}),
			location: $storage.getStorageFilter($storage.getLocation(),{cityName: '宁波市',lng: 121.557239,lat: 29.809815}),
			payPassword: $storage.getStorageFilter($storage.getPayPassword(),''),
			locationService:false,
			locationPermission:false,
			canLocation:false,
			prizePoolId:'',//奖池id
			locationTime:0,//plus.android.requestPermissions 会弹起请求 导致触发onShow和onHide 所以在onShow调用这个方法可以弄个计时器限制它死循环
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	/* #ifdef APP-VUE || H5 */
	@import "uview-ui/index.scss";

	@import url("/iconfont/iconfont.css");
	@font-face {
		font-family: 'iconfont';
		/* project id 2349706 */
		src: url('//at.alicdn.com/t/font_2349706_qz9s7frz0ln.eot');
		src: url('//at.alicdn.com/t/font_2349706_qz9s7frz0ln.eot?#iefix') format('embedded-opentype'),
			url('//at.alicdn.com/t/font_2349706_qz9s7frz0ln.woff2') format('woff2'),
			url('//at.alicdn.com/t/font_2349706_qz9s7frz0ln.woff') format('woff'),
			url('//at.alicdn.com/t/font_2349706_qz9s7frz0ln.ttf') format('truetype'),
			url('//at.alicdn.com/t/font_2349706_qz9s7frz0ln.svg#iconfont') format('svg');
	}

	page {
		width: 100%;
		height: 100%;
		// background: $uni-title-color;
		background: #16192B;
		.container {
			min-height: 100%;
			// background: $uni-title-color;
			background: #16192B;
		}
	}

	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	.placeholder {
		color: #B4B2CF;
	}
	/* #endif */

</style>
