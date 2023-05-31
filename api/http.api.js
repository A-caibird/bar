// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
import uploadFile from '@/utils/upload';
const install = (Vue, vm) => {
	let upload = (filePath, dir = 'file/', load=true) => { // dir是阿里云上的目录 不传也可以
		return new Promise((resolve, reject) => {
			if(load){
				uni.showLoading({
					title: '上传中',
					mask: true,
				})
			}
			uploadFile(filePath, dir, function success(res) {
				// console.log(res)
				// console.log(filePath)
				// console.log(dir)
				resolve(res) //返回网络地址
				if(load){
					uni.hideLoading()
				}
			}, function fail(err) {
				reject(err)
				if(load){
					uni.hideLoading()
				}
			})
		})
	}

	//将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {

		//上传
		uploadFile:(filePath)=> upload(filePath,'file/'),
		uploadImg:(filePath)=> upload(filePath,'image/'),
		uploadVideo:(filePath)=> upload(filePath,'video/'),
		// 获取中奖信息
		getAwardInfoApi: () => vm.$u.get('/api/user/award'),
		// 判断接待人员状态
		judgeReceptionintStatusApi: (params) => vm.$u.get('/api/order/staffIsReset', params),
		// 盲盒
		getBlindBoxRuleApi: () => vm.$u.get('/api/lottery/helpInfo'), //拆盲盒攻略
		// 优惠券
		giveCouponApi: (id) => vm.$u.get('/api/coupon/take', {id}), //领取优惠券
		getCouponPurviewApi: (params) => vm.$u.get('/api/coupon/canOrderUseCouponCount', params),
		//通用
		getOSSUrlAPI: () => vm.$u.get('/api/OSSSign/sign'),
		commonRequest: (url, params = {}, method = 'post') => vm.$u[method](url, params), // 通用请求
		readSysNoticeAPI: () => vm.$u.post('/api/user/readAllSystemNotification'), //阅读系统消息
 		getNoticeCountAPI: () => vm.$u.get('/api/user/notReadSystemNotification'), //系统未通知消息
		registerCodeApi: (params) => vm.$u.post('/api/user/getCode', params), //获取验证码
		getMyInfo: (params) => vm.$u.get('/api/user/myInfo', params), //获取个人信息
		getHomeBannerListApi: (params) => vm.$u.get('/api/banner/list', params), //首页轮播图
		leaderBoardApi: (params) => vm.$u.get('/api/user/leaderBoard', params), //礼物排行
		otherMsgApi: (params) => vm.$u.get('/api/user/otherInfo', params), //获取他人信息
		orattenchApi: (params) => vm.$u.post('/api/user/attentionUser', params), //关注用户
		noattenchApi: (params) => vm.$u.post('/api/user/cancelAttentionUser', params), //取消关注用户
		getLowerCitys: (cityName) => vm.$u.get('/api/area/getChildrenArea', {
			cityName
		}), //获取下级城市

		//登录
		registerInfo: (params) => vm.$u.post('/api/user/registered', params), //注册
		phoneLoginApi: (params) => vm.$u.post('/api/user/phoneLogin', params), // 手机号码登录
		wxLoginApi: (params) => vm.$u.post('/api/user/wxLogin', params), // 微信登录
		wxBindPhoneApi: (params) => vm.$u.post('/api/user/bindPhone', params), // 微信绑定手机号
		verifyPhoneApi: (params) => vm.$u.get('/api/user/verifyPhone', params), //验证手机号
		forgetPasswordApi: (params) => vm.$u.post('/api/user/forgetPassword', params), //忘记登陆密码
		fillInformationApi: (params) => vm.$u.post('/api/user/fillInformation', params), //填写用户信息
		setClientId: (params) => vm.$u.post('/api/user/setClientId', params), //保证一个设备只发一条信息
		getIsAppleAuditApi: (params) => vm.$u.get('/api/information/isAppleAudit', params), //获取苹果审核状态

		//酒吧列表
		getClubTypeAPI: () => vm.$u.get('/api/club/clubTypeList'), //酒吧类型
		getCitys: () => vm.$u.post('/api/club/getOpenedCities'), //所有开通城市
		getClubDetail: (clubId) => vm.$u.post('/api/club/basicInformation', {
			clubId
		}), //酒吧简单信息
		getClubIntro: (clubId) => vm.$u.post('/api/club/view', {
			clubId
		}), //酒吧简介
		clubServiceAPI: (clubId) => vm.$u.get('/api/chatMessage/getRandomCustomStaff', {
			clubId
		}),// 酒吧客服
		clubCollect: (clubId) => vm.$u.post('/api/user/collect', {
			clubId
		}), //收藏酒吧
		clubCancelCollect: (clubId) => vm.$u.post('/api/user/cancelCollect', {
			clubId
		}), //取消收藏酒吧
		getClubEvaluationListApi: (params) => vm.$u.get('/api/club/evaluationList', params), //酒吧评价列表

		//个人/酒吧动态
		notViewApi: (params) => vm.$u.get('/api/user/notView', params), //不再看某人或酒吧动态
		dynamicDeleteApi: (id) => vm.$u.post('/api/dynamic/userDelete', {id}), //动态删除
		dynamicDetail: (id) => vm.$u.post('/api/dynamic/view', {id}), //动态详情
		dynamicLike: (id) => vm.$u.post('/api/dynamic/like', {id}), //动态点赞
		dynamicCancelLike: (id) => vm.$u.post('/api/dynamic/cancelLike', {id}), //动态取消点赞
		getYaoOrderApi: (params) => vm.$u.get('/api/order/canInviteOrder', params), //获取可以用来邀请的邀约订单列表
		getPingOrderApi: (params) => vm.$u.get('/api/order/canPingOrder', params), //获取可以用来邀请的拼享订单列表
		getCanOrderApi: (params) => vm.$u.get('/api/order/canUseOrder', params), //当前可用(邀约拼享)订单

		//酒吧招聘
		getJobDetail: (id) => vm.$u.post('/api/recruitment/view', {
			id
		}), //工作详情
		applyJob: (params) => vm.$u.post('/api/recruitment/applyFor', params), //申请工作

		//酒吧选座
		getCardTableList: (params) => vm.$u.get('/api/cardTable/list', params), //根据日期获取酒吧座位信息
		selectCardTableApi: (params) => vm.$u.post('/api/cardTable/select', params), //选择座位
		cancelSelectCardTableApi: (params) => vm.$u.post('/api/cardTable/cancelSelect', params), //取消选择座位
		extendCardTableSelectTimeApi: (params) => vm.$u.post('/api/cardTable/extendSelectTime', params), //对选择的座位延时

		//酒吧选酒水/商品加入购物车
		getCommodityCategoriesListApi: (params) => vm.$u.get('/api/commodity/categoriesList', params), //根据酒吧获取商品分类
		getCommodityDetailApi: (params) => vm.$u.get('/api/commodity/detail', params), //商品详情
		shoppingCardAddApi: (params) => vm.$u.post('/api/shoppingCard/add', params), //加入购物车
		shoppingCardDeleteApi: (params) => vm.$u.post('/api/shoppingCard/delete', params), //商品在购物车中减一
		getShoppingCardViewApi: (params) => vm.$u.get('/api/shoppingCard/view', params), //购物车详情
		shoppingCardEmptyApi: (params) => vm.$u.post('/api/shoppingCard/empty', params), //清空购物车
		addWinePayApi: (params) => vm.$u.post('/api/order/addWinePay', params), //加酒水付款

		//酒吧订单
		canChangeChekcApi: (params) =>  vm.$u.get('/api/order/canChangeDate', params), // 是否能修改订单
		changeOrderAPI: (params) => vm.$u.get('/api/order/changeOrder', params), // 修改订单
		checkUnusedDrinksAPI: (params) => vm.$u.get('/api/order/hasNotUseOrder', params), // 是否存在未使用的酒水
		creatOrderBillAPI: (params) => vm.$u.post('/api/order/bill', params), //创建订单发票
		createOrderApi: (params) => vm.$u.post('/api/order/save', params), //创建订单
		getCanOrderTimeApi: (params) => vm.$u.get('/api/canOrderTime/time', params), //获取酒吧可下单时间
		getReceptionistListApi: (params) => vm.$u.get('/api/order/getStaffList', params), //获取接待员列表
		payOrdertApi: (params) => vm.$u.post('/api/order/pay', params), //支付订单
		cancelOrderApi: (params) => vm.$u.post('/api/order/cancelOrder', params), //取消未支付的订单
		arriveOrderApi: (params) => vm.$u.post('/api/order/arrive', params), //到店
		getEvalutaionApi: (params) => vm.$u.get('/api/order/canTextComment', params), //是否允许文字评论
		commentOrderApi: (params) => vm.$u.post('/api/order/comment', params), //评价订单

		//邀约订单（就是尬酒）
		getInviteOrderView: (params) => vm.$u.get('/api/order/inviteOrderView', params), //邀约订单详情
		deleteYaoOrderApi: (params) => vm.$u.post('/api/order/deleteInviteOrder', params), //删除邀约订单
		hideYaoOrderApi: (params) => vm.$u.post('/api/order/inviteHide', params), //隐藏已完成的邀约订单
		yaoyueInviteApi: (params) => vm.$u.post('/api/order/inviteForOrderPaySuccess', params), //邀约别人
		refuseYaoyueApi: (params) => vm.$u.post('/api/order/refuseInvite', params), //拒绝邀约邀请
		agreeYaoyueApi: (params) => vm.$u.post('/api/order/agreeInvite', params), //同意邀约邀请
		refundInviteOrderApi: (params) => vm.$u.post('/api/order/orderRefund', params), //退款
		quitInviteOrderApi: (params) => vm.$u.post('/api/order/quitInviteOrder', params), //退出邀约
		getNotPayInviteOrderSizeApi: (params) => vm.$u.post('/api/order/getNotPayInviteOrderSize', params), //未付款邀约订单数

		//拼享订单
		pingInviteApi: (params) => vm.$u.post('/api/order/sendOrderPingInfo', params), //拼享单邀请别人
		refusePingInviteApi: (params) => vm.$u.post('/api/order/disAgreeOrderPingInfo', params), // 拒绝拼享单邀请
		agreePingInviteApi: (params) => vm.$u.post('/api/order/agreeApplyJoinOrder', params), // 同意拼享单邀请，只是发文字消息
		getPingOrderView: (params) => vm.$u.get('/api/order/pingOrderView', params), //拼享订单详情
		deletePingOrderApi: (params) => vm.$u.post('/api/order/deleteJoinOrder', params), //删除拼享订单
		hidePingOrderApi: (params) => vm.$u.post('/api/order/pingHide', params), //隐藏拼享订单
		endPingJoinApi: (params) => vm.$u.post('/api/order/endJoin', params), //结束拼享
		getPingUserListApi: (params) => vm.$u.get('/api/order/joinUserList', params), //查看拼团人员
		refundPingOrderApi: (params) => vm.$u.post('/api/order/refundJoinOrder', params), //加入者退款
		payPingInviteApi: (params) => vm.$u.post('/api/order/agreeInviteJoinOrder', params), //邀请的拼享订单付款 新增
		payPingJoinApi: (params) => vm.$u.post('/api/order/applyJoinOrder', params), //加入的拼享订单付款 新增
		pingJoinCancelApi: (params) => vm.$u.post('/api/order/joinerCancel', params), //取消拼享订单加入者未付款订单
		pingKickOutApi: (params) => vm.$u.post('/api/order/kickOut', params), //踢人
		agreePingJoinApi: (params) => vm.$u.post('/api/order/agreeApplyJoinOrder', params), //同意他人加入拼享订单
		refusePingJoinAPI: (params) => vm.$u.post('/api/order/disagreeApplyJoinOrder', params), //拒绝他人加入拼享订单
		getNotPayJoinOrderSizeApi: (params) => vm.$u.post('/api/order/getNotPayJoinOrderSize', params), //未付款拼享订单数

		//加单酒水
		getAddWineShoppingCart: (params) => vm.$u.get('/api/order/addWineView', params), //获取购物车
		addWineEmptyApi: (params) => vm.$u.post('/api/order/addWineEmpty', params), //清空购物车
		addWineApi: (params) => vm.$u.post('/api/order/addWine', params), //添加商品到购物车
		addWineApiDeleteApi: (params) => vm.$u.post('/api/order/addWineDelete', params), //减一商品购物车

		//取酒
		getFetchWineListApi: (params) => vm.$u.get('/api/order/fetchWineList', params), //获取当前订单酒吧可以取酒的列表
		fetchWineApi: (params) => vm.$u.post('/api/order/fetchWine', params), //取酒


		//聊天消息
		setClientIdApi: (params) => vm.$u.post('/api/user/setClientId', params), //保证一个设备只发一条信息
		sendChatPush: (params) => vm.$u.post('/api/chat/sendChatInfo', params), //发送聊天信息
		getCanChatApi: (params) => vm.$u.get('/api/user/canChat', params), //获取双方是否可以聊天

		//个人设置
		hasPingOrderAPI: () => vm.$u.post('/api/order/hasPingOrder'), //是否存在有效的拼享订单
		hasVerifyAPI: () => vm.$u.post('/api/user/hasVerified'), //是否实名认证
		replaceBackImgAPI: (params) => vm.$u.post('/api/user/changeBackground', params), //设置个人背景
		setPersonIntroAPI: (params) => vm.$u.get('/api/user/changePersonalProfile', params), //设置个人简介
		setPayPasswordApi: (params) => vm.$u.post('/api/user/setPayPassword', params), //设置支付密码
		forgetPayPasswordApi: (params) => vm.$u.post('/api/user/forgetPayPassword', params), //忘记支付密码
		changePayPasswordApi: (params) => vm.$u.post('/api/user/changePayPassword', params), //修改支付密码
		changePasswordApi: (params) => vm.$u.post('/api/user/changePassword', params), //修改用户登陆密码
		verifiedApi: (params) => vm.$u.post('/api/user/verified', params), //实名认证
		changeNickNameApi: (params) => vm.$u.post('/api/user/changeNickName', params), //修改昵称
		changeAvatarApi: (params) => vm.$u.post('/api/user/changeAvatar', params), //修改头像
		changeBirthdayApi: (params) => vm.$u.post('/api/user/changeBirthday', params), //修改出生年月
		changeAreaApi: (params) => vm.$u.post('/api/user/changeArea', params), //修改地区
		changeSignatureApi: (params) => vm.$u.post('/api/user/changeSignature', params), //修改个性签名
		getProtocol: () => vm.$u.post('/api/information/userAgreement'), // 用户协议
		getHelpInformationApi: () => vm.$u.post('/api/information/helpInformation'),  //反馈与帮助
		getPrivacy: () => vm.$u.post('/api/information/privacyAgreement'), //隐私条例
		getAccountSecurityApi: (params) => vm.$u.get('/api/user/informationCompletion',params), //账号与安全
		bindWeChatApi: (params) => vm.$u.post('/api/user/bindWeChat',params), //绑定微信
		untieWeChatApi: (params) => vm.$u.post('/api/user/untieWeChat',params), //解绑微信
		getIdentityNumberRealNameApi: (params) => vm.$u.get('/api/user/verifiedInformation',params), //获取身份证和真实姓名
		checkPayPasswordCorrectApi: (params) => vm.$u.get('/api/user/checkPayPassword',params), //检查支付密码是否正确
		getPasswordInputTimesAPI: () => vm.$u.get('/api/user/hasCanUserPayPasswordCount'), //获取用户今天密码可输入次数
		feedBackSaveApi: (params) => vm.$u.post('/api/feedBack/save',params), //反馈提交
		getCommonProblemListApi: (params) => vm.$u.get('/api/feedBack/feedBackTitleList',params), //帮助中心问题

		//商家入驻
		admissionApplicationSaveApi: (params) => vm.$u.post('/api/admissionApplication/save',params), //入驻申请



		//我的收藏
		myCollectionApi: (params) => vm.$u.get('/api/user/myCollect', params), //我的收藏

		//我的酒库
		saveWineListApi: (params) => vm.$u.get('/api/saveWine/saveWineList', params), //我的酒库
		//我的余额
		myBalanceApi: (params) => vm.$u.get('/api/user/myBalance', params), //我的余额
		balanceWithdrawAPI: (params) => vm.$u.get('/api/user/withdrawalBalance', params), //余额提现
		//我的钱包
		myDiamondApi: (params) => vm.$u.get('/api/user/myWallet', params), //我的钻石
		giftincomeApi: (params) => vm.$u.get('/api/user/giftHistoryList', params), //礼物收支列表
		myWalletApi: (params) => vm.$u.post('/api/user/myWallet', params), //我的钱包
		getWalletHelpCenterApi: (params) => vm.$u.post('/api/information/helpCenter', params), //钱包帮助中心
		getBindAliAccountInfoApi: (params) => vm.$u.get('/api/user/bindAliAccountInfo',params), //获取提现绑定信息
		bindAliAccountApi: (params) => vm.$u.post('/api/user/bindAliAccount',params), //绑定修改提现的支付宝账号
		cashOutAliPayApi: (params) => vm.$u.post('/api/user/withdrawal', params), //提现金额(钻石)
		wineCoinRechargeApi: (params) => vm.$u.post('/api/recharge/save', params), //充值 生成记录id
		getWineCoinWeChatPaymentApi: (params) => vm.$u.get('/api/payment/wechatPay', params), //获取微信支付支付信息
		getWineCoinAliPayPaymentApi: (params) => vm.$u.get('/api/payment/aliPay', params), //获取支付宝支付支付信息
		getCoinRechargeListApi: (params) => vm.$u.get('/api/user/coinRechargeList', params), //充值选项列表

		//个人动态
		getMyDynamicListApi: (params) => vm.$u.post('/api/dynamic/myPublishList', params), //个人动态
		sendGiftApi: (params) => vm.$u.post('/api/dynamic/sendGift', params), //赠送礼物 弹窗
		getGiftListApi: (params) => vm.$u.get('/api/gift/list', params), //赠送礼物 小啤酒
		shortCommentApi: (params) => vm.$u.get('/api/shortComment/list', params), //短评词列表
		sendCommentApi: (params) => vm.$u.post('/api/dynamic/comment', params), //动态评论
		otherDynamicApi: (params) => vm.$u.post('/api/dynamic/otherPublishList', params), //获取他人动态
		commentStateApi: (params) => vm.$u.post('/api/shortComment/shortCommentList', params), //查看动态评论的短拼词
		publishDynamic: (params) => vm.$u.post('/api/dynamic/save', params), // 发布动态
		activityDetail: (id) => vm.$u.post('/api/clubActivity/activityView', {
			id
		}), // 动态详情
		dynamicReport: (params) => vm.$u.post('/api/dynamic/report', params), // 动态举报

		//隐私设置
		getPushInfoAPI: () => vm.$u.post('/api/user/pushInfo'), //获取通知信息
		toggleNoticeAPI: (params) => vm.$u.post('/api/user/changeAllNotice', params), // 是否打开定制通知（所有通知）
		toggleJoinPingAPI: (params) => vm.$u.post('/api/user/changePinNotice', params), //是否打开加入拼享通知
		togglePublishDynamicAPI: (params) => vm.$u.post('/api/user/changePushDynamicNotice', params), //是否打开发布作品通知
		toggleOpenPraiseAPI: (params) => vm.$u.post('/api/user/changeLikeNotification', params), //是否打开点赞通知
		toggleOpenCommentAPI: (params) => vm.$u.post('/api/user/changeCommentNotification', params), //是否打开评论通知
		toggleOpenInviteAPI: (params) => vm.$u.post('/api/user/changeInvitationNotice', params), //是否打开邀约通知
		toggleOpenAttAPI: (params) => vm.$u.post('/api/user/changeFollowNotifications', params), //是否打开关注通知
		toggleGiftTipsAPI: (params) => vm.$u.post('/api/user/changeGiftReminder', params), //是否打开礼物提醒通知
		myOpenChooseApi: (params) => vm.$u.post('/api/user/myOpenChoose', params), // 我选择的开关的状态
		changeShowMyAttentionUserApi: (params) => vm.$u.post('/api/user/changeShowMyAttentionUser', params), // 是否显示我关注的用户，
		changeShowMyFansApi: (params) => vm.$u.post('/api/user/changeShowMyFans', params), // 是否展示我的粉丝，

		//抽奖
		awardApi: (params) => vm.$u.get('/api/lottery/view', params), //奖池详情
		awarddrawApi: (params) => vm.$u.post('/api/lottery/draw', params), //抽奖（十连或者单抽）
		awardListApi: (params) => vm.$u.post('/api/lottery/allLog', params), //近期中奖记录
		awardNumberApi: (params) => vm.$u.post('/api/lottery/myPrize', params), //大转盘礼物个数
		getFreeCountApi: (params) => vm.$u.post('/api/lottery/freetimes', params), //免费抽奖次数

		//会员中心
		getMemberLevelListApi: (params) => vm.$u.get('/api/memberLevel/list', params), //会员等级列表
		getMemberInfoApi: (params) => vm.$u.get('/api/user/memberInfo', params), //会员信息

		//酒库详情
		getSaveWineViewApi: (params) => vm.$u.get('/api/saveWine/view', params), //酒库详情

		getAboutUs: () => vm.$u.post('/api/information/aboutUs'), //关于我们
		getCredit: () => vm.$u.post('/api/information/creditRules'), //信用规则
		platformActivityDetailApi: (id) => vm.$u.post('/api/platformActivity/view', {id}), //平台活动详情


		chatMessageSend: (params) => vm.$u.post('/api/chatMessage/sendToCustomStaff', params), //给客服发送消息
		chatMessageList: (params) => vm.$u.post('/api/chatMessage/historyListByCustomStaff', params), //获取和酒吧客服的历史聊天记录
		chatFriendMessageList: (params) => vm.$u.post('/api/chatMessage/historyList', params), //获取好友的历史聊天记录
		chatFriendMessageSend: (params) => vm.$u.post('/api/chatMessage/sendToUser', params), //给好友发消息
		chatSessionList: () => vm.$u.post('/api/chatMessage/historySessionList'), //用户之前的历史会话列表
		readUserAll: (params) => vm.$u.post('/api/chatMessage/readUserAll', params) //尬酒消息已读
		// getOssInfo: (params) => vm.$u.post('/api/OSSSign/sign', params) //尬酒消息已读
	};
}

export default {
	install
}
