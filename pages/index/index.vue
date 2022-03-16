<template>
	<view class="container">
		<!-- <u-mask :show="maskShow" :custom-style="{background: '#FFFFFF'}"></u-mask> -->
		<view class="middle_box">
			<swiper v-if="contentShow" style="height: 100%;" :duration="0" :disable-touch="true" :current="current">
				<swiper-item>
					<block v-if="tabExit[0] >= 1">
						<home-page  @goGift="goGift" @goPing="goPing" @homeLoad="handleHomeLoad" ref="home"></home-page>
					</block>
				</swiper-item>
				<swiper-item>
					<block v-if="tabExit[1] >= 1">
						<findPage ref="find" @shareTap="popShareShow = true" @goClub="goClub" @goChat="goChat" @openDynamicComment="$refs.dynamicComment.open($event)" @oepnGift="$refs.dynamicGift.open($event)"></findPage>
					</block>
				</swiper-item>
				<swiper-item>
				</swiper-item>
				<swiper-item>
					<block v-if="tabExit[3] >= 1">
						<infoPage ref="info"></infoPage>
					</block>
				</swiper-item>
				<swiper-item>
					<block v-if="tabExit[4] >= 1">
						<mePage ref="me" ></mePage>
					</block>
				</swiper-item>
			</swiper>
		</view>
		<view class="loading_page" :class="{'hidden': !pageloading}">
			<view class="top_box">
				<image class="top_img" src="/static/imgs/index/loading_bg.png"></image>
				<view class="top_text">爬梯</view>
				<view class="top_text">快乐产生的的地方</view>
			</view>
			<view class="footer_box">
				<image class="footer_icon" src="/static/imgs/index/loading_icon.png"></image>
				<view class="footer_text">爬梯</view>
			</view>
		</view>
		<selfTabbar
			:border-top="false"
			inactiveColor="#998FAA"
			activeColor="#FFFFFF"
			bgColor="#10133A"
			:value="current"
			:list="list"
			:mid-button="true"
			@change="changeHandle"
		></selfTabbar>
		<add-dynamic ref="addDynamic" @goDynamic="goFind" @joinPingTap="goPing" @goClubList="goClubList" :bottomHeight="bottomHeight"></add-dynamic>
		<dynamic-comment ref="dynamicComment" @sendComment="$refs.find.handleSendComment($event)"></dynamic-comment>
		<dynamic-gift ref="dynamicGift" @refreshInputTimes="refreshInputTimes" @oepnGiftEdit="$refs.dynamicGiftEdit.open($event)" @openPay="openPayhandle" @sendGiftSuccess="$refs.find.handleSendGiftSuccess($event)"></dynamic-gift>
		<dynamic-gift-edit ref="dynamicGiftEdit" @confirm="$refs.dynamicGift.setSendNum($event)"></dynamic-gift-edit>
		<pay ref="payDynamicGift" @pay="$refs.dynamicGift.pay($event)"></pay>
		<pop-share v-model="popShareShow"></pop-share>
	</view>
</template>

<script>
import { mapState, mapMutations} from 'vuex';
import selfTabbar from '@/components/self-tabbar/self-tabbar.vue';
import homePage from '@/components/tabbarPage/home.vue';
import findPage from '@/components/tabbarPage/find.vue';
import mePage from '@/components/tabbarPage/me.vue';
import infoPage from '@/components/tabbarPage/info.vue';
import tipsPop from '@/components/pop/tips.vue';
import loginMixin from '@/mixins/loginConfirm.js'
import $chat from '@/utils/chat/index.js'
var app = getApp();
export default {
	components: {
		selfTabbar,
		homePage,
		findPage,
		infoPage,
		mePage,
		tipsPop,
	},
	mixins:[loginMixin],
	data() {
		return {
			popShareShow: false,
			current: 0,
			scrollTop:0,
			bottomHeight:50,
			maskShow:true,
			pageloading: true,
			contentShow: false,
			tabExit: [1, 0, 1, 0, 1],
			noRead: 0,
			noticeNum: 0, //系统通知
		};
	},
	computed: {
		...mapState(['list'])
	},
	watch: {
		
	},
	beforeCreate() {
		// #ifdef APP-PLUS
		plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
		// #endif
	},
	onLoad(opt) {
		if(!opt.maskShow) {
			this.maskShow = false
		}
		this.loadingAnimalHandle();
		this.getSInfo()
		
		if(app.globalData.token) {
			this.getPasswordInputTimes();
			// #ifdef APP-PLUS
			this.$u.api.setClientId({
				clientId:plus.push.getClientInfo().clientid,
			})
			// #endif
		}
		console.log(opt)
		if(opt&&opt.current=='info') {
			this.current = 3
		}else if(opt&&opt.current=='find-nearby') {
			this.current = 1
			setTimeout(() => {
				this.$refs.find.switchToNearby()
			},50);
		}else if(opt&&opt.goFind) {
			this.goFind()
			this.pageloading = false;
		}else if(opt&&opt.goShareOrderList) {
			this.goShareOrderList()
			this.pageloading = false;
		}
		else if(opt&&opt.goYaoOrderList) {
			this.goYaoOrderList()
			this.pageloading = false;
		}
		else if(opt&&opt.goWallet) {
			this.goWallet()
			this.pageloading = false;
		}else if(opt&&opt.index){
			this.pageloading = false;
		}else if(opt&&opt.goAtten){
			this.goAtten();
			this.pageloading = false;
		}else{
			this.pageloading = true;
		}
		this.$nextTick(() => {
			this.changeHandle(this.current);
		});
		uni.$on('information_listener', this.infoListenerEvent);
		uni.$on('push_listener', (e)=>{
			if(e && !e.refresh){
				this.pushListenerEvent(e.num, e.refresh);
			}else{
				this.pushListenerEvent();
			}
		});
		
		
	},
	onUnload() {
		uni.$off('information_listener');
		uni.$off('push_listener');
	},
	onShow: function() {
		// #ifdef APP-PLUS
		plus.screen.lockOrientation('portrait-primary');
		// #endif
		let vm = this;
		if(getApp().globalData.authorized){
			this.pushListenerEvent();
			setTimeout(() => {
				this.infoPageNavigate();
			}, 1000);
		}
		if(this.$refs.find) {
			this.$nextTick(function(){
				vm.$refs.find.show()
			})
		}
		if(this.$refs.info) {
			this.$nextTick(function(){
				vm.$refs.info.show()
			})
		}
		if(this.current ==4 && this.$refs.me) {
			this.$nextTick(function(){
				vm.$refs.me.load()
			})
		}
	},
	methods: {
		...mapMutations(['setInfoCount', 'setPushCount']),
		refreshInputTimes(){
			if(this.$refs.payDynamicGift){
				this.$refs.payDynamicGift.subInputTimes()
			}
		},
		// 消息页面跳转
		infoPageNavigate(){
			let globalData = getApp().globalData;
			if(globalData.msgPath){
				if(globalData.authorized){
					uni.navigateTo({
						url: globalData.msgPath,
						success() {
							app.globalData.msgPath = "";
						}
					})
				}
			}
		},
		// 消息监听
		infoListenerEvent(ignoreNotice = true){
			var chatToken = getApp().globalData.userInfo.chatToken;
			var chatUserList = $chat.getChatUserListFromStorage(chatToken) || [];
			let noRead = 0;
			chatUserList.forEach((item, index) => {
				noRead = item.notReadNum + noRead;
			})
			this.noRead = noRead;
			this.setInfoCount(noRead)
		},
		// 推送监听
		pushListenerEvent(exitNoRead = 0, refresh = true){
			if(isNaN(exitNoRead)){
				return
			}else if(!refresh){
				this.setPushCount(exitNoRead)
			}else{
				if(getApp().globalData.authorized){
					var noRead = 0;
					this.$u.api.getNoticeCountAPI().then(res => {
						noRead = noRead + (res.data.activityUnReadNum || 0) + (res.data.num || 0);
						this.setPushCount(noRead);
					}).catch(e => {
						this.setPushCount(noRead)
					})
				}
			}
		},
		goAtten(){
			this.current = 1;
			this.tabExit[this.current] = 1;
			this.$nextTick(()=>{
				setTimeout(() => {
					this.$refs.find.switchToAtt()
				},100);
			})
		},
		goInfoGift(){
			this.$nav.navigateTo({
				url: '/pages/info/gift'
			});
		},
		openPayhandle(e){
			let password = getApp().globalData.payPassword ;
			if(password){
				this.$refs.dynamicGift.pay({password});
			}else{
				this.$refs.payDynamicGift.open(e);
			}
		},
		loadingAnimalHandle: function(){
			this.contentShow = true;
			this.$nextTick(() =>{
				setTimeout(() => {
					this.pageloading = false;
				}, 2000)
			})
		},
		handleHomeLoad(){
			this.maskShow = false
		},
		async getSInfo(){
			let res = await uni.getSystemInfoSync()
			// console.log(res)
			this.bottomHeight = res.safeAreaInsets.bottom + 50
		},
		goClubList(){
			this.current = 0
			this.$refs.home.scrollToClubList()
		},
		goWallet(){
			this.current = 4
			this.tabExit[this.current] = 1;
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.me.goWallet()
				},50);
			})
		},
		goChat(e){
			let vm = this
			console.log(e)
			this.current = 3
			setTimeout(function(){
				vm.$u.route('/pages/chat/chat',e)
			},50)
			
		},
		goGift(){
			this.current = 1
			this.tabExit[this.current] = 1;
			this.$nextTick(() => {
				setTimeout(() => {
					this.$refs.find.switchToGift()
				},50);
			})
		},
		goPing(){
			this.current = 1;
			this.tabExit[this.current] = 1;
			this.$nextTick(()=>{
				setTimeout(() => {
					this.$refs.find.switchToPing()
				},50);
			})
		},
		goClub(){
			this.current = 0
		},
		goYaoOrderList(){
			this.current = 4
			setTimeout(() => {
				this.$refs.me.goYaoOrderList()
			},50);
		},
		goShareOrderList(){
			this.current = 4
			setTimeout(() => {
				this.$refs.me.goShareOrderList()
			},50);
		},
		goFind(){
			this.current = 1;
			this.tabExit[this.current] = 1;
			this.$nextTick(()=>{
				setTimeout(() => {
					this.$refs.find.switchToFind()
				},50);
			})
		},
		// 更换事件
		changeHandle: function(e) {
			this.tabExit[e] = 1;
			if(e==2) {
				if(!this.loginConfirmHandle(false)){
					return
				}
				this.$refs.addDynamic.open()
				return 
			} else {
				this.$refs.addDynamic.close()
			}
			this.current = e;
			if(e==0) {
				if(getApp().globalData.authorized){
					this.infoListenerEvent(false);
				}
			}
			if(e==1) {
				this.$nextTick(() => {
					if(this.$refs.find){
						this.$refs.find.show()
					}
				})
			}
			if(e==3){
				this.$nextTick(() => {
					this.$refs.info.show()
				})
			}
			if(e==4) {
				this.$nextTick(() => {
					this.$refs.me.load()
				})
			}
			
		},
	}
};
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		.container {
			height: 100%;
			background: $uni-title-color;
			position: relative;
			display: flex;
			flex-direction: column;
			
			.middle_box {
				flex: 1;
				min-width: 0;
				min-height: 0;
				position: relative;
			}
			.loading_page{
				position: fixed;
				top: 0rpx;
				left: 0rpx;
				z-index: 220;
				width: 100%;
				height: 100%;
				background: #191C3F;
				opacity: 1;
				transition: all 1s; 
				&.hidden{
					opacity: 0;
					z-index: -1;
				}
				.top_box{
					width: 100%;
					box-sizing: border-box;
					padding-top: 280rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.top_img{
						width: 554rpx;
						height: 692rpx;
					}
					.top_text{
						font-size: 40rpx;
						font-weight: normal;
						color: #FFFFFF;
						line-height: 60rpx;
						letter-spacing: 4rpx;
					}
				}
				.footer_box{
					position: absolute;
					bottom: 60rpx;
					left: 0rpx;
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.footer_icon{
						height: 72rpx;
						width: 72rpx;
					}
					.footer_text{
						font-size: 24rpx;
						font-weight: normal;
						color: #FFFFFF;
						line-height: 60rpx;
						letter-spacing: 2rpx;
					}
				}
			}
		}
	}

</style>
