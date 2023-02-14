import Map from '@/js_sdk/ms-openMap/openMap.js'
import $storage from '@/common/storage.js'

function formatDateTime(timeValue) {
	var date = new Date(timeValue);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
//判断传入日期是否为昨天
function isYestday(timeValue) {
	var date = (new Date());
	//当前时间
	var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	//今天凌晨
	var yestday = new Date(today - 24 * 3600 * 1000).getTime();
	return timeValue < today && yestday <= timeValue;
};
//判断传入日期是否属于今年
function isYear(timeValue) {
	var takeNewYear = formatDateTime(new Date()).substr(0, 4);
	//当前时间的年份
	var takeTimeValue = formatDateTime(timeValue).substr(0, 4);
	//传入时间的年份
	return takeTimeValue == takeNewYear;
}

function getAfterDay(i) { //获取i天后的日期
	var dd = new Date();
	dd.setDate(dd.getDate() + i);
	return dd.getTime()
}

function orderStatus(status) {
	switch (status) {
		case 'paying':
			return '待付款'
			break;
		case 'noShop':
			return '待到店'
			break;
		case 'waitAgree':
			return '申请中'
			break;
		case 'expired':
			return '未消费'
			break;
		case 'arrived':
			return '已到店'
			break;
		case 'comment':
			return '待评价'
			break;
		case 'complete':
			return '已完成'
			break;
		case 'cancel':
			return '交易关闭'
			break;
		case 'refund':
			return '已退款'
			break;
		default:
			return '订单异常'
	}
}
//60000 1分钟 //3600000 1小时 //86400000 24小时 //对传入时间进行时间转换
function timeChange(timeValue) {
	var timeNew = Date.parse(new Date());
	// 当前时间
	var timeDiffer = timeNew - timeValue;
	//与当前时间误差
	var returnTime = '';
	if (timeDiffer <= 60000) {
		//一分钟内
		var returnTime = '刚刚';
	} else if (timeDiffer > 60000 && timeDiffer < 3600000) {
		//1小时内
		var returnTime = Math.floor(timeDiffer / 60000) + '分钟前';
	} else if (timeDiffer >= 3600000 && timeDiffer < 86400000 && isYestday(timeValue) === false) {
		//今日
		var returnTime = formatDateTime(timeValue).substr(11, 5);
	} else if (timeDiffer > 3600000 && isYestday(timeValue) === true) {
		//昨天
		var returnTime = '昨天' + formatDateTime(timeValue).substr(11, 5);
	} else if (timeDiffer > 86400000 && isYestday(timeValue) === false && isYear(timeValue) === true) {
		//今年
		var returnTime = formatDateTime(timeValue).substr(5, 11);
	} else if (timeDiffer > 86400000 && isYestday(timeValue) === false && isYear(timeValue) === false) {
		//不属于今年 var returnTime = formatDateTime(timeValue).substr(0,10);
	}
	return returnTime;
}

let utils = ({
	data() {
		return {

		}
	},
	methods: {
		//项目相关
		setPayPasswordToStorage(password) {
			getApp().globalData.payPassword = password
			$storage.setPayPassword(password)
		},
		removePayPasswordToStorage() {
			getApp().globalData.payPassword = ''
			$storage.removePayPassword()
			this.getPasswordInputTimes();
		},
		shareSystem() {
			var shareInfo = {
				type: 'web',
				title: '爬梯秀APP',
				content: '一起来狂欢尬酒呀',
				thumbs: 'https://patixiu.oss-cn-shanghai.aliyuncs.com/file/1619509070358112.png',
				href: 'https://erp.patixiu.com/sharepage/share.html'
			}
			// #ifdef APP-VUE
			plus.share.sendWithSystem(shareInfo, function() {
				console.log('分享成功');
				uni.showToast({
					title: '分享成功',
					icon: 'none'
				})
			}, function(e) {
				console.log('分享失败：' + JSON.stringify(e));
			});
			// #endif
		},
		shareToWeChat() {
			let platform = uni.getSystemInfoSync().platform
			let href = platform == 'ios' ? 'https://itunes.apple.com/cn/app/id1514743503?mt=8' :
				'https://erp.patixiu.com/resources/apk/patixiu.apk'
			uni.share({
				provider: "weixin",
				scene: "WXSceneSession",
				type: 0,
				href: href,
				title: '爬梯秀APP',
				summary: '一起来狂欢尬酒呀',
				// imageUrl: 'https://patixiu.oss-cn-shanghai.aliyuncs.com/file/161950783063070.png',
				imageUrl: 'https://patixiu.oss-cn-shanghai.aliyuncs.com/file/1619509070358112.png',
			});
		},
		openMap(lng, lat, address) { //打开导航
			uni.showModal({
				title: '',
				content: '确定要打开地图？',
				showCancel: true,
				success: (res) => {
					if (res.confirm) {
						Map.openMap(lat, lng, address, 'gcj02')
					}
				}
			})
		},
		//去个人主页
		goPersonalHomepage(id, isMy = false) { //前往个人主页
			if (isMy) {
				uni.navigateTo({
					url: '/pages/mine/personalSetting/personalSetting'
				})
			} else {
				uni.navigateTo({
					url: '/pages/mine/dynamic/myDynamic' + `?id=${id}`
				})
			}

		},
		goClubDetail(id) { //前往酒吧详情
			// #ifdef APP-PLUS
			// uni.navigateTo({
			// 	url: '/pages/club/view/index' + `?id=${id}`,
			// 	animationType: "slide-in-right",
			// })
			uni.navigateTo({
				url: '/pages/club/detail' + `?id=${id}`,
				animationType: "slide-in-right",
			})
			// #endif
			// #ifdef H5
			uni.navigateTo({
				url: '/pages/club/detail' + `?id=${id}`,
				animationType: "slide-in-right",
			})
			// #endif
		},
		goArticle(type) { //前往富文本页面
			uni.navigateTo({
				url: '/pages/article/article' + `?type=${type}`
			})
		},
		getOrderStatus(status = '') { //订单状态
			return orderStatus(status)
		},
		goPingMemberList(orderId, type) { //type 创建者 creater, 加入者 join,未加入者 notjoin
			this.$u.route('/pages/order/spellBill', {
				orderId: orderId,
				type: type
			})
		},
		analysisAreaName(e) { ///utils/amap-wx.js getPoiAround 解析poisData的地址 getInputtips 解析tips的地址 返回一个完整的地址
			let areaName = ''
			if (e.district) {
				areaName = e.district + e.address
			} else {
				areaName = e.pname + e.cityname + e.adname + e.address
			}
			return areaName
		},
		analysisProvinceName(
		e) { ///utils/amap-wx.js getPoiAround 解析poisData的地址 getInputtips 解析tips的地址 返回一个完整的地址
			let areaName = ''
			if (e.district) {
				areaName = e.district
			} else {
				areaName = e.pname + e.cityname + e.adname
			}
			return areaName
		},
		analysisFullName(e) { ///utils/amap-wx.js getPoiAround 解析poisData的地址 getInputtips 解析tips的地址 返回一个省市
			var reg = /.+?(省|市|自治区|自治州)/g;
			let fullName = ''
			if (e.district) {
				let fullNameArr = e.district.match(reg)
				fullNameArr.forEach(text => {
					fullName = fullName + text;
				})
			} else {
				fullName = e.pname + e.cityname
			}
			return fullName
		},
		judgePayCode() { //判断设置支付密码
			return new Promise((resolve, reject) => {
				this.$u.api.getAccountSecurityApi({}).then(res => {
					let {
						code,
						data
					} = res
					if (code == 0) {
						let {
							hasSetPayPassword
						} = data
						if (hasSetPayPassword) {
							resolve()
						} else {
							uni.showModal({
								title: '',
								content: '您还未设置支付密码',
								confirmText: '去设置',
								success(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/mine/setting/pay_password'
										})
									}
								},
							})
							reject()

						}
					} else {
						reject()
					}

				}).catch(err => {
					reject(err)
				})
			})
		},
		judgeVerify() { //判断实名认证 并且引导到实名认证页面
			return new Promise((resolve, reject) => {
				this.$u.api.getAccountSecurityApi({}).then(res => {
					let {
						code,
						data
					} = res
					if (code == 0) {
						let {
							hasVerified
						} = data
						if (hasVerified) {
							resolve(data)
						} else {
							uni.showModal({
								title: '',
								content: '您还未实名认证',
								confirmText: '去认证',
								success(res) {
									if (res.confirm) {
										uni.navigateTo({
											url: '/pages/mine/setting/certification' +
												`?hasVerified=unverify`
										})
									}
								},
							})
							reject()

						}
					} else {
						reject()
					}

				}).catch(err => {
					reject(err)
				})
			})
		},
		getPasswordInputTimes(){
			return new Promise((resolve, reject) => {
				this.$u.api.getPasswordInputTimesAPI().then(res => {
					let count = res.data.count ? parseInt(res.data.count) : 0;
					getApp().globalData.passwordInputTimes = count;
					resolve(count)
				}).catch(e => {
					console.log(e);
					getApp().globalData.passwordInputTimes = 0;
					reject(e)
				})
			})
		},
		//emoji
		uni16ToStr(point) { //16进制转字符串
			if (point > 0xffff) {
				var offset = point - 0x10000,
					lead = 0xd800 + (offset >> 10),
					trail = 0xdc00 + (offset & 0x3ff);
				return String.fromCharCode(lead, trail);
			} else {
				return String.fromCharCode(point)
			}
		},


		//数据操作
		getList(list = [], index = 1) { //返回数组前index个元素

			let newList = []
			for (let i = 0; i < Math.min(index, list.length); i++)
				newList.push(list[i])
			return newList
		},
		setList(key, val, obj, list) { //查询list中键值是key的某个元素的值是val并且设置obj的参数
			return new Promise((resolve, reject) => {
				let index = list.findIndex(e => {
					return e[key] == val
				})
				if (index != -1) {
					const obj1 = list[index]
					Object.keys(obj).forEach(e => {
						obj1[e] = obj[e]
					})
					this.$forceUpdate();
					resolve()
				} else {
					reject({
						msg: 'no item'
					})
				}
			})
		},
		getItemFromList(key, value, list) { //查询list中键值是key的某个元素的值是val并且设置obj的参数
			return new Promise((resolve, reject) => {
				let index = list.findIndex(e => {
					return e[key] == value
				})
				console.log(index)
				if (index != -1) {
					resolve(list[index])
				} else {
					reject({
						msg: 'noitem'
					})
				}
			})
		},
		parseFloat(val, num = 2) { //保留第num位并去0
			return parseFloat(parseFloat(val).toFixed(num))
		},
		parseInt(val) { //保留第num位并去0
			return pparseInt(val)
		},
		hideIdCard(idCard) {
			return idCard.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
		},

		//uni方法
		previewImg(logourl) { //查看大图
			if (logourl == '' || logourl == null) return;
			let imgsArray = [];
			imgsArray[0] = logourl
			uni.previewImage({
				current: 0,
				urls: imgsArray
			});

		},
		previewImgList(list, index, key = '') { //查看大图
			if (list.length == 0) return;
			let imgsArray = [];
			if (key) {
				list.forEach(e => {
					imgsArray.push(e[key])
				})
			} else {
				imgsArray = list
			}
			uni.previewImage({
				current: index,
				urls: imgsArray
			});

		},
		copyClipvoard(str = '', title = '已复制到剪切板') {
			uni.setClipboardData({
				data: str,
				success: () =>
					uni.showToast({
						title,
						icon: 'none'
					})
			})
		},

		//日期相关

		// 获取今天的时间戳
		getNowDate() {
			return new Date().getTime();
		},

		//获取今日在内的7天的日期列表 时间戳
		getTWeekList() {
			let arr = []
			for (let i = 0; i < 7; i++) {
				arr.push(getAfterDay(i))
			}
			return arr
		},

		//根据i返回周几
		getWeekStr(i) {
			let arr = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
			return arr[i]
		},

		//返回从今天开始
		getWeekDate(i = 0) {
			var now = new Date();
			var day = now.getDay();
			return (day + i + 6) % 7;
		},

		timeChange(timeValue) {
			return timeChange(timeValue)
		},
		getClubFrontImg(bannerList){
			var footerImgUrl = '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast';
			let clubImg = "";
			if(bannerList.length <= 0){
				clubImg = "";
			}else{
				let firstBanner = this.clubInfo.bannerObjList[0]
				clubImg = firstBanner.videoUrl ? (firstBanner.videoUrl + footerImgUrl) : firstBanner.file;
			}
			return clubImg;
		}
	},

})
export default utils
