<template>
	<view class="container">
<!-- 		<view class="header_box">
			<view class="startBar_box"></view>
			<view class="custom_nav" v-if="!stickyStatus" @tap="goBack">
				<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
			</view>
		</view> -->
		<block v-if="!stickyStatus">
			<u-navbar
				:border-bottom="false"
				:is-fixed="true"
				:title-color="`rgba(255,255,255,${navOpacity})`"
				:background="{
					background: `rgba(25,28,63,${navOpacity})`
				}"
				:title="clubInfo.name"
				:immersive=true
				back-icon-color="#FFFFFF"
			></u-navbar>
		</block>
		<view class="middle_box">
			<view class="club_info">
				<view class="swiper_box" v-if="clubInfo.bannerList.length > 1">
					<u-swiper :list="clubInfo.bannerList" height="435" bgColor="#191C3F" @click="$u.throttle(previewImgList(clubInfo.bannerList,$event))"></u-swiper>
				</view>
				<view class="swiper_box" v-if="clubInfo.bannerList.length == 1">
					<image :src="clubInfo.bannerList[0]"  mode="aspectFill" @click="$u.throttle(previewImg(clubInfo.bannerList[0]))"></image>
				</view>
				<view class="club_info_second">
					<view class="info_name"> <text>{{clubInfo.name}}</text> </view>
					<view class="info_address">
						<text>{{clubInfo.address}}</text>
					</view>
					<view class="info_intro" @tap="tapOpenMap">
						<text>{{clubInfo.areaName}}</text>
						<u-icon name="map" size="32"></u-icon>
					</view>
					<view class="label_captain">
						<view class="captain-left" @tap="$u.throttle(goPersonalHomepage(pingOrderInfo.sponsorId))">
							<image :src="pingOrderInfo.sponsorAvatar" mode=""></image>
							<view class="captain_content">
								<view class="captian_name"><text>{{pingOrderInfo.name}}</text> <text class="label">(爬梯主)</text></view>
								<!-- <view class="captian_slogan"><text>{{pingOrderInfo.shareRequirements}}</text></view> -->
							</view>
						</view>

						<view class="captian_unfollow" v-if="hasAttention==false">
							<button plain="true" type="default" @tap="$u.throttle(attenBtn())">
								<u-icon name="heart" color="#FFFFFF" size="28"></u-icon>
								<text>未关注</text>
							</button>
						</view>
						<view class="captian_follow" v-if="hasAttention==true">
							<button plain="true" type="default" @tap="$u.throttle(attenBtn())">
								<u-icon name="heart-fill" color="#FFFFFF" size="28"></u-icon>
								<text>已关注</text>
							</button>
						</view>
					</view>
					<view class="activity_detail">
						<view class="activity_title">
							<view class="line"></view>
							<text>拼享详情</text>
						</view>
						<view class="detail_item">
							<text class="left">到店时间:</text><text class="right">{{pingOrderInfo.orderTime}}</text>
						</view>
						<view class="common_info_item" >
							<view class="item_left"> 
								<text style="color: #9292BA;">拼享方式：</text> 
							</view>
							<view class="item_right" v-if="pingOrderInfo.type=='AA'">
								<text style="color: #FFFFFF; ">AA</text>
							</view>
							<view class="item_right" v-if="pingOrderInfo.type=='customize'">
								<text style="color: #FFFFFF; ">自定义</text>

							</view>
							<view class="item_right" v-if="pingOrderInfo.type=='treat'">
								<text style="color: #FFFFFF; ">发起人买单</text>
							</view>
						</view>
						<view class="common_info_item" style="align-items: flex-start;">
							<view class="item_left">
								<text style="color: #9292BA;">拼享方式：</text> 
							</view>
							<view class="item_right" style="flex-direction: column; align-items: flex-start;"  v-if="pingOrderInfo.type=='AA'">
								<view v-if="pingOrderInfo.shareWay.menNumber>0">
									<text style="color: #FFFFFF; margin-right: 14rpx;">男：{{pingOrderInfo.shareWay.menNumber}}人 {{pingOrderInfo.shareWay.avgWineCoin}}元</text>
								</view>
								<view v-if="pingOrderInfo.shareWay.womenNumber>0">
									<text style="color: #FFFFFF; ">女：{{pingOrderInfo.shareWay.womenNumber}}人 {{pingOrderInfo.shareWay.avgWineCoin}}元</text>			
								</view>
							</view>
							<view class="item_right" style="flex-direction: column; align-items: flex-start;"  v-if="pingOrderInfo.type=='customize'">
								<view v-if="pingOrderInfo.shareWay.menNumber>0">
									<text style="color: #FFFFFF; margin-right: 14rpx;" v-if="pingOrderInfo.shareWay.menWineCoin">男：{{pingOrderInfo.shareWay.menNumber}}人 {{pingOrderInfo.shareWay.menWineCoin}}元</text>
									<text style="color: #FFFFFF; margin-right: 14rpx;" v-else>男：{{pingOrderInfo.shareWay.menNumber}}人 免费</text>
								</view>
								<view v-if="pingOrderInfo.shareWay.womenNumber>0">
									<text style="color: #FFFFFF; " v-if="pingOrderInfo.shareWay.womenWineCoin">女：{{pingOrderInfo.shareWay.womenNumber}}人 {{pingOrderInfo.shareWay.womenWineCoin}}元</text>
									<text style="color: #FFFFFF; " v-else>女：{{pingOrderInfo.shareWay.womenNumber}}人 免费</text>
								</view>
							</view>
							<view class="item_right" style="flex-direction: column; align-items: flex-start;"  v-if="pingOrderInfo.type=='treat'">
								<view v-if="pingOrderInfo.shareWay.menNumber>0">
									<text style="color: #FFFFFF; margin-right: 14rpx;">男：{{pingOrderInfo.shareWay.menNumber}}人 免费</text>
								</view>
								<view v-if="pingOrderInfo.shareWay.womenNumber>0">
									<text style="color: #FFFFFF; ">女：{{pingOrderInfo.shareWay.womenNumber}}人 免费</text>
								</view>
							</view>
						</view>
					<!-- 	<view class="detail_item">
							<text class="left">备注：</text><text class="right">{{pingOrderInfo.demo}}</text>
						</view> -->
					</view>
					<view class="apply_detail">
						<view class="apply_title">
							<view class="title_left">
								<view class="line">	</view>
								<text>报名情况</text>
							</view>
							<view class="title_right" @tap="$u.throttle(goPingMemberList(orderId,pingOrderInfo.isJoin?'join':'notjoin'))">
								<text>查看全部拼团</text>
								<image src="/static/imgs/common/right.png" mode=""></image>
							</view>
						</view>
						<view class="apply_content">
							<image :src="item.avatar" mode="" v-for="item,index in pingUserList" :key="index"></image>

							<text >{{pingUserData.hasJoinPersonNum}}人参与</text>
						</view>
						<view class="warm_tip">
							<view class="warm_tip_title">
								<view class="line"></view>
								<text>拼享要求</text>
							</view>
							<view class="warm_tip_content">
								<text>{{pingOrderInfo.shareRequirements}}</text>
							</view>
						</view>
					</view>
				</view>
				<u-gap height="20" bgColor="#20234B"></u-gap>
			</view>
			<view class="club_detail">
				<view class="classify_box">
					<view class="nav_box" :class="{'animalStart': stickyStatus}" @tap="$u.route({type:'back'})">
						<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
					</view>
					<view class="classify_panel">
						<block v-for="(info, index) in infoType" :key="index">
							<view class="common_classify" :class="{'select': selectIndex == index}" @tap="selectType(index)">
								<text>{{info}}</text>
								<view class="select_icon" v-if="selectIndex == index"></view>
							</view>
						</block>
					</view>
				</view>
				<view class="classify_info">
					<swiper style="height: 100%;" :duration="0" :current="selectIndex" @change="selectIndex=$event.detail.current">
						<swiper-item>
							<scroll-view :scroll-y="stickyStatus" :style="{height:swiperHeight}" @scrolltoupper="scrolltoupper" :upper-threshold="upperThreshold">
								<view style="color: #FFFFFF;padding: 30rpx;">
									<u-parse :html="clubContent"></u-parse>
								</view>
							</scroll-view>
						
						</swiper-item>
						<swiper-item>

							<ping-dynamic-list :i="1" :index="selectIndex" :clubId="clubId"  :canScroll="stickyStatus" :height="swiperHeight" :upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-dynamic-list>
							
						</swiper-item>
						<swiper-item>

							<ping-activity-list :i="2" :index="selectIndex" :clubId="clubId" :canScroll="stickyStatus" :height="swiperHeight" :upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-activity-list>
						</swiper-item>
						<swiper-item>

							<ping-recruitment-list :i="3" :index="selectIndex" :clubId="clubId" :canScroll="stickyStatus" :height="swiperHeight" :upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-recruitment-list>
						</swiper-item>
						<swiper-item>
							<scroll-view :scroll-y="stickyStatus" :style="{height:swiperHeight}" @scrolltoupper="scrolltoupper" :upper-threshold="upperThreshold">
								<view class="evaluate_box">
									<view class="complex_rate">
										<view class="complex_left">
											<view class="label"> <text>评分总数</text> </view>
											<view class="label_rate">
												<view class="score">{{clubInfo.avgScore}}</view>
												<view class="score_rate">
													<selfRate :score="clubInfo.avgScore" size="26"></selfRate>
												</view>
											</view>
										</view>
										<view class="complex_right">
											<block v-for="(info, index) in scoreList" :key="index">
												<view class="common_rate">
													<view class="score_rate">
														<selfRate :score="info.score" size="26"></selfRate>
													</view>
													<view class="score_label">{{info.text}}</view>
												</view>
											</block>					
										</view>
									</view>
									<view class="eva_label">
										<view class="label_left">
											<view class="line"></view>
											<text>用户评价</text>
										</view>
										<view class="label_right" @tap="$u.route('pages/evaluate/list',{clubId:clubId})">
											<text>查看全部</text>
											<image src="/static/imgs/common/right.png"></image>
										</view>
									</view>
									<template v-if="commentList.length>0">
										<view class="eva_list">
											<block v-for="(info, index) in commentList" :key="index">
												<view class="classify_item">
													<evaluate :info="info" :isLast="index==commentList.length-1"></evaluate>
												</view>
											</block>
										</view>
									</template>
									<template v-else>
										<view style="height: 750rpx;">
											<empty content="暂无评价"></empty>
										</view>
									</template>
								</view>  
						
							</scroll-view>
						</swiper-item>
						
					</swiper>
			
				
						
				</view>
			</view>
		</view>
		<view class="club_footer">
			<view class="footer_box">
				<view class="common_item" @tap="$u.throttle(clickEvent('service'), 800)">
					<view class="common_icon">
						<image src="/static/imgs/common/kefu.png"></image>
					</view>		
					<text>客服</text>
				</view>
				<view class="common_item" @tap="$u.throttle(clickEvent('collect'), 800)">
					<!-- <image src="/static/imgs/common/collect_pre.png"></image> -->
					<view class="common_icon">
						<u-icon color="#ffffff" size="38" name="star" v-if="!collect"></u-icon>
						<u-icon color="#FF59C9" size="38" name="star-fill" v-else></u-icon>
					</view>
					<text>收藏</text>
				</view>
				<view class="common_item" @tap="$u.throttle(clickEvent('share'), 800)">
					<view class="common_icon">
						<image src="/static/imgs/mine/forward.png"></image>
					</view>
					<text>分享</text>
				</view>
				<view class="btn_text" @tap="$u.throttle(clickEvent('ping'), 800)" v-if="pingStatus=='canPing'">
					<block>
						<image src="/static/imgs/common/seat_icon.png"></image>
						<text>拼享</text>
					</block>
				</view>
				<view class="btn_text end" v-if="pingStatus=='hasJoin'">
					<block>
						<text>已加入</text>
					</block>
				</view>
				<view class="btn_text end" v-if="pingStatus=='complete'">
					<block>
						<text>拼享结束</text>
					</block>
				</view>
			</view>
		</view>
		<pop-share v-model="shareShow"></pop-share>
		<!-- <view class="footer_box">
			<club-footer @clickTap="clickEvent" :collect="collect" :isPing="true" :isJoin="pingOrderInfo.isJoin"></club-footer>
		</view> -->
	</view>
</template>

<script>
	import evaluate from '@/components/evaluate-item/evaluate-item.vue'
	import clubFooter from '@/components/club-footer/club-footer.vue'
	import selfRate from '@/components/self-rate/self-rate.vue'
	import certPop from '@/components/pop/certification.vue'
	import pingDynamicList from '@/components/ping-dynamic-list/ping-dynamic-list.vue'
	import pingActivityList from '@/components/ping-activity-list/ping-activity-list.vue'
	import pingRecruitmentList from '@/components/ping-recruitment-list/ping-recruitment-list.vue'
	import $chat from '@/utils/chat/index.js'
	const app = getApp()
	export default {
		components: {
			clubFooter,
			evaluate,
			selfRate,
			certPop,
			pingDynamicList,
			pingActivityList,
			pingRecruitmentList
		},
		data() {
			return {
				infoType: ['简介', '动态', '活动', '招聘', '评价'],
				urls:[
					'',
					'/api/club/dynamicList',
					'/api/clubActivity/activityList',
					'/api/recruitment/list',
					'/api/club/evaluationList'
				],
				scoreList: [{
						text: '服务',
						score: 5
					},
					{
						text: '氛围',
						score: 3
					},
					{
						text: '环境',
						score: 3
					},
					{
						text: '曲风',
						score: 2
					},
					{
						text: '快乐',
						score: 1
					}
				],
				clubId:'',
				clubInfo:{
					bannerList:[],
				},
				pingOrderInfo:{
					isJoin:false,
					shareWay:{},
				},
				orderId:'',
				clubContent:'',
				collect: false,
				lat:39.9091591069,
				lng:116.3974783161,
				selectIndex: 4,
				stickyStatus: false,
				navOpacity:0,
				pingUserData:{},
				pingUserList:[],				//部分信息，前五人头像
				commentList:[],
				hasAttention:false,
				upperThreshold:10,
				statusBarHeight: 0,
				userInfo:app.globalData.userInfo,
				shareShow: false,
				pingStatus: '',
			}
		},
		computed:{
			swiperHeight(){
				return `calc(100vh - ${this.statusBarHeight}px - 110rpx - 120rpx)`
			}
			
		},
		watch: {
			"selectIndex"(newValue) {
				if(newValue == 4){
					if(this.commentList.length <= 0){
						this.getCommentList();
					}
				}
			}
		},
		onLoad:function(options){
			let id = options.id;
			this.clubId = id;
			this.orderId = options.orderId
			this.pingStatus = options.pingStatus
			this.getClubDetail();
			this.getClubIntro();
			// this.getCommentList();
			this.getPingOderInfo()
			this.getPingUserList()
			this.selectIndex = 0;
		},
		onPageScroll: function() {
			let vm = this;
			this.$u.getRect('.classify_box').then(res => {
				let top = res.top;
				if (top == 0) {
					vm.stickyStatus = true;
				} else {
					vm.stickyStatus = false;
				}
			})
			this.$u.getRect('.club_info_second').then(res => {
				let top = res.top;
				if(top<=50&&top>=0) {
					vm.navOpacity = parseFloat((50-top)/50).toFixed(1)
				} else if(top<0) {
					vm.navOpacity = 1
				} else if(top>50) {
					vm.navOpacity = 0
				}
			})
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
		},
		methods: {
			scrolltoupper(e){
				let platform = uni.getSystemInfoSync().platform
				if(platform=='ios') {
					this.stickyStatus = false
				}
				
			},
			tapOpenMap(){
				this.openMap(this.lng, this.lat, this.clubInfo.address)
			},
			goBack: function() {
				uni.navigateBack({
					delta: 1,
				})
			},
			//获取评论列表
			getCommentList:function(){
				let params = {
					  "clubId": this.clubId,
					  "pageNumber": 1,
					  "pageSize": 5,
				}
				this.$u.api.getClubEvaluationListApi(params).then(res => {
					if(parseInt(res.code) == 0){
						this.commentList = res.data.list
					}else {
						console.log("获取评价列表失败")
					}
				})
			},
			//获取拼享订单详情
			getPingOderInfo:function(){
				let params = {
					orderId:this.orderId
				}
				this.$u.api.getPingOrderView(params).then(res => {
					if(parseInt(res.code) == 0){
						this.pingOrderInfo = res.data.pingOrderViewVo
						this.hasAttention = res.data.pingOrderViewVo.hasAttentionSponsor
						console.log(res)
					}else {
						console.log("获取品享订单失败")
					}
				})
			},
			//查看拼团人员
			getPingUserList:function(){
				let params = {
					orderId:this.orderId
				}
				this.$u.api.getPingUserListApi(params).then(res => {
					if(parseInt(res.code) == 0){
						this.pingUserData = res.data
						this.pingUserList = this.getList(res.data.list,5)
						console.log(res)
					}else {
						console.log("获取拼团人员失败")
					}
				})
			},
			//关注团长
				attenBtn: async function(){
				//this.flag=!this.flag;
				if(this.hasAttention){
					await this.$toast.confirm('','确定要取消关注该用户吗？')
					let params={
						userId:this.pingOrderInfo.sponsorId
					};
					this.$u.api.noattenchApi(params).then(res=>{
						console.log(res)
						if(res.code==0){
							uni.$emit('personal-info-refresh')
							this.hasAttention=false;
							this.$u.toast('取消关注成功')
						}
					})

				}else{
					let params={
						userId:this.pingOrderInfo.sponsorId
					};
					this.$u.api.orattenchApi(params).then(res=>{
						console.log(res)
						if(res.code==0){
							uni.$emit('personal-info-refresh')
							this.hasAttention=true;
							this.$u.toast('关注成功')
						}
					})
				}
				
			},
			
			// 预定事件
			bookEvent: function() {
				this.$u.route('pages/club/consumption/seat');
			},
			// 选择介绍类别
			selectType: function(index) {
				if (index != this.selectIndex) {
					this.selectIndex = index;
				}
			},
			// 获取酒吧详情
			getClubDetail: async function(){
				let {code,data} = await this.$u.api.getClubDetail(this.clubId)
				if(code==0) {
					console.log(data)
					this.clubInfo = data.info;
					let info = data.info;
					this.collect = info.hasCollect;
					this.scoreList[0].score = info.serviceAvgScore
					this.scoreList[1].score = info.atmosphereAvgScore
					this.scoreList[2].score = info.surroundingsAvgScore
					this.scoreList[3].score = info.genreAvgScore
					this.scoreList[4].score = info.happyAvgScore
				}

			},
			// 获取酒吧简介
			getClubIntro: async function(){
				let {code,data} = await this.$u.api.getClubIntro(this.clubId)
				if(code==0) {
					console.log(data)
					this.clubContent = data.view;
					this.lng = data.lng
					this.lat = data.lat
				}
			},
			async joinPing(){
				await this.$toast.confirm('','确定要发起加入请求吗？')
				console.log(13)
				let {sponsorId,sponsorChatId,sponsorChatToken,name,sponsorAvatar,} = this.pingOrderInfo
				let {id,clubSimpleInfoVo,arriveTime,cardTableName} = this.pingOrderInfo
				let userInfo = this.$u.deepClone(this.userInfo)
				let friendUserInfo = {
					userId:sponsorId,
					chatUserId:sponsorChatId,
					chatToken:sponsorChatToken,
					name:name,
					avatar:sponsorAvatar,
					hasSave:false,
				}
				console.log(userInfo)
				console.log(friendUserInfo)
				let msgInfo = {
					orderId: id,
					clubCover: clubSimpleInfoVo.clubCover,
					clubName: clubSimpleInfoVo.name,
					date: arriveTime,
					cardTableName: cardTableName,
					agreeStatus: 'none',
				}
				console.log(msgInfo)
				$chat.sendMsg(userInfo, friendUserInfo, 'single', 'pingJoin', msgInfo)
				this.$toast.text('已发送拼享加入请求')
			},
			// 点击事件
			clickEvent: function(e){
				let type = e;
				switch(type){
					case 'collect': this.toggleCollect(); break; 
					case 'ping':this.tapPingTap();break; 
					case 'service': {
						this.$u.api.clubServiceAPI(this.clubId).then(res => {
							console.log(res);
							if(res.data.hasStaff){
								this.$u.route('/pages/customerRoom/index',{
									id: res.data.id,
									avatar: res.data.avatar,
									nickname: res.data.nickname
								});
							}else{
								uni.showToast({
									title: '暂无客服人员',
									icon: 'none'
								})
							}
							
						}).catch(e => {
							console.log(e);
						})
					};break;
					case 'share': {this.shareShow = true;};break;
					default: break;
				}
			},
			async tapPingTap(){
				this.judgeVerify().then(res => {
					console.log(res);
					if(res.hasAdult){
						this.joinPing();
					}else{
						this.$u.toast("未成年人员禁止拼享");
					}
				}).catch(e => {
					console.log(e);
				})
			},
			toggleCollect: function(){
				let collect = this.collect;
				if(collect){
					this.$u.api.clubCancelCollect(this.clubId).then(res => {
						if(parseInt(res.code) == 0){
							this.collect = !collect
						}
						else{
							this.$u.toast('取消失败')
						}
					})
				}else{
					this.$u.api.clubCollect(this.clubId).then(res => {
						if(parseInt(res.code) == 0){
							this.collect = !collect
						}else {
							this.$u.toast('收藏失败')
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.club_footer{
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		z-index: 100;
		width: 100%;
		.footer_box{
			height: 120rpx;
			width: 100%;
			display: flex;
			align-items: center;
			background: $uni-title-color;
			border-top: 1px solid #31345B;
			position: relative;
			.common_item{
				height: 100%;
				width: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.common_icon {
					width: 50rpx;
					height: 50rpx;
					@include flex-center();
					image{
						height: 32rpx;
						width: 32rpx;
					}
				}
				&>text{
					font-size: 22rpx;
					color: #FFFFFF;
					margin-top: 10rpx;
				}
			}
			.btn_text{
				height: 80rpx;
				width: 200rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background: $uni-button-color;
				font-size: 28rpx;
				color: #FFFFFF;
				border-radius: 48rpx;
				position: absolute;
				right: 30rpx;
				&.share_btn{
					right: 260rpx;
				}
				&.end {
					background: #585E8D;
				}
				&>image{
					height: 30rpx;
					width: 30rpx;
					margin-right: 14rpx;
				}
			}
		}
	}
	.container {
		width: 100%;
		padding-bottom: 120rpx;

		.header_box {
			width: 100%;
			position: fixed;
			z-index: 100;
			top: 0rpx;
			left: 0rpx;
			background-color: transparent;

			.startBar_box {
				width: 100%;
				height: var(--status-bar-height); //状态栏高度			
			}

			.custom_nav {
				height: 44px;
				width: 100%;
				display: flex;
				align-items: center;
				box-sizing: border-box;
				padding: 0 30rpx;
			}
		}

		.middle_box {
			.club_info {
				.swiper_box {
					width: 100%;
					height: 435rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}

				.club_info_second {
					width: 100%;
					padding: 30rpx;
					box-sizing: border-box;

					.info_name {
						width: 80%;
						font-size: 40rpx;
						color: #FFFFFF;
						font-weight: 500;
						@include ellipsis();
					}
					// .item_right{
					// 	display: flex;
					// 	align-items: center;
					// 	font-size: 26rpx;
					// 	margin-right: 30rpx;
					// }
					.info_intro {
						display: flex;
						align-items: center;
						padding-bottom: 10rpx;
						width: 80%;
						text{
							@include ellipsis();
							font-size: 26rpx;
							color: #B4B2CF;
						}
						image {
							min-width: 20rpx;
							width: 20rpx;
							height: 25rpx;
							padding-left: 15rpx;
						}
					}

					.info_address {
						width: 80%;
						font-size: 30rpx;
						color: #FFFFFF;
						padding-bottom: 10rpx;
						@include ellipsis();
					}

					.info_time {
						font-size: 26rpx;
						color: #FFFFFF;
						padding-bottom: 10rpx;
					}

					.label_captain {
						display: flex;
						align-items: center;
						width: 100%;
						height: 170rpx;
						background-color: #2C3158;
						border-radius: 10rpx;
						margin: 30rpx 0;
						padding: 0 30rpx;
						font-size: 26rpx;
						margin-bottom: 30rpx;
						color: #FFFFFF;
						.captain-left{
							display: flex;
							flex: 1;
							min-width: 0rpx;
							image {
								width: 100rpx;
								height: 100rpx;
								border-radius: 50%;
							}
							.captain_content {
								padding-left: 30rpx;
								flex: 1;
								min-width: 0rpx;
								height: 100rpx;
								// background-color: red;
								@include height-center();
								.captian_name {
									font-size: 32rpx;
									color: #F9F9F9;
									
									.label {
										font-size: 24rpx;
										color: #FFFFFF;
										padding-left: 10rpx;
									}
								}
							
								.captian_slogan {
									font-size: 26rpx;
									color: #B3B3DD;
									padding-top: 10rpx;
									text{
										@include ellipsis();
									}
								}
							}
						}




						.captian_unfollow {
							
							display: flex;
							justify-content: center;
							align-items: center;
							line-height: 50rpx;
							margin-left: 30rpx;
							width: 150rpx;
							height: 50rpx;
							border: 1rpx solid #7b7e9d;
							border-radius: 49rpx;
							font-size: 26rpx;
							color: #FFFFFF;

							button {
								padding: 0;
								width: 150rpx;
								height: 50rpx;
								color: #FFFFFF;
								background: null;
								font-size: 26rpx;
								border-radius: 49rpx;
								line-height: 50rpx;
								border: 1px solid #ffffff;
								&>text{
									margin-left: 8rpx;
								}
							}
						}
						.captian_follow {
							
							display: flex;
							justify-content: center;
							align-items: center;
							line-height: 50rpx;
							width: 150rpx;
							height: 50rpx;
							border: 1rpx solid #7b7e9d;
							border-radius: 49rpx;
							font-size: 26rpx;
							color: #FFFFFF;
						
							button {
								padding: 0;
								width: 150rpx;
								height: 50rpx;
								color: #FFFFFF;
								background: null;
								font-size: 26rpx;
								border-radius: 49rpx;
								line-height: 50rpx;
								border: 1px solid #ffffff;
								background-color:#F72EB2 ;
								&>text{
									margin-left: 8rpx;
								}
							}
						}
					}

					.activity_detail {
							padding-bottom: 40rpx;
						.activity_title {
							display: flex;
							align-items: center;
							font-size: 34rpx;
							color: #FFFFFF;
							padding-bottom: 10rpx;

							.line {
								width: 6rpx;
								height: 32rpx;
								background: #ff59c9;
								margin-right: 15rpx;
							}
						}
						.common_info_item{
							width: 100%;
							display: flex;
							align-items: center;
							margin-bottom: 10rpx;
							.item_left{
								display: flex;
								align-items: center;
								font-size: 26rpx;
							}
							.item_right{
								display: flex;
								align-items: center;
								font-size: 26rpx;
							}
						}

						.detail_item {
							display: flex;
							font-size: 26rpx;
							margin-top: 10rpx;
							margin-bottom: 10rpx;
							width: 100%;
							.left {
								color: #B3B3DD;
								padding-right: 10rpx;
							}

							.right {
								flex: 1;
								min-width: 0;
								color: #F9F9F9;
								
							}
						}
					}
					.apply_detail{
						margin-bottom: 30rpx;
						.apply_title {
							display: flex;
							justify-content: space-between;
							.title_left{
								display: flex;
								align-items: center;
								font-size: 34rpx;
								color: #FFFFFF;
								.line{
									width: 6rpx;
									height: 32rpx;
									background: #ff59c9;
									margin-right: 10rpx;
								}
							}
							.title_right{
								display: flex;
								align-items: center;
								font-size: 26rpx;
								color: #FFFFFF;
								image{
									width: 14rpx;
									height: 22rpx;
									padding-left: 15rpx;
								}
							}
							
						}
						.apply_content{
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: #FFFFFF;
							padding: 30rpx 0rpx;
							image{
								width: 70rpx;
								height: 70rpx;
								margin-right: 20rpx;
								border-radius: 50%;
							}
							.person_detail{
								width: 70rpx;
								height: 70rpx;
								border-radius: 45rpx;
								background: #2c3158;
								margin-right: 20rpx;
							}
						}
					}
					.warm_tip{
						.warm_tip_title{
							display: flex;
							align-items: center;
							font-size: 34rpx;
							margin-bottom: 20rpx;
							color: #FFFFFF;
								.line{
									width: 6rpx;
									height: 32rpx;
									background: #ff59c9;
									margin-right: 10rpx;
								}
						}
						.warm_tip_content{
							display: flex;
							flex-direction: column;
							text{
								font-size: 26rpx;
								color: #B3B3DD;
								padding-bottom: 15rpx;
							}
						}
						
					}
				}
			}

			.club_detail {
				width: 100%;

				.classify_box {
					width: 100%;
					padding-top: var(--status-bar-height);
					padding-left: 30rpx;
					display: flex;
					align-items: center;
					position: sticky;
					top: 0;
					z-index: 100;
					background: #191C3F;
					border-bottom: 1px solid #31345B;

					.nav_box {
						margin-right: 0rpx;
						width: 0rpx;
						height: 0rpx;
						transform: all 0.3;
						display: none;
						&.animalStart{
							margin-right: 30rpx;
							width: auto;
							height: auto;
							display: block;
						}
					}

					.classify_panel {
						width: 100%;
						height: 110rpx;
						display: flex;
						align-items: center;

						.common_classify {
							position: relative;
							color: #B7B9D6;
							font-size: 28rpx;
							display: flex;
							align-items: center;
							flex-direction: column;
							margin-right: 52rpx;

							&.select {
								font-size: 34rpx;
								color: #FFFFFF;
							}

							.select_icon {
								position: absolute;
								bottom: -20rpx;
								height: 4rpx;
								width: 34rpx;
								background: #FF59C9;
								border-radius: 2rpx;
							}
						}
					}

				}

				.classify_info {
					width: 100%;
					box-sizing: border-box;
					height: calc(100vh - var(--status-bar-height) - 110rpx - 120rpx);
					.classify_item {
						margin-bottom: 20rpx;
					}
				}
				.evaluate_box{
					width: 100%;
					padding: 30rpx;
					.complex_rate{
						padding: 30rpx 0rpx;
						border-bottom: 1px solid #31345B;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.complex_left{
							display: flex;
							flex-direction: column;
							.label{
								font-size: 36rpx;
								color: #FFFFFF;
								font-weight: 500;
							}
							.label_rate{
								display: flex;
								align-items: center;
								.score{
									font-size: 58rpx;
									color: #FFFFFF;
									margin-right: 32rpx;
								}
							}
						}
						.complex_right{
							display: flex;
							flex-direction: column;
							.common_rate{
								display: flex;
								align-items: center;
								.score_label{
									font-size: 20rpx;
									color: #FFFFFF;
								}
							}
						}
					}
					.eva_label{
						height: 100rpx;
						width: 100%;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.label_left{
							display: flex;
							align-items: center;
							font-size: 34rpx;
							color: #FFFFFF;
							font-weight: 500;
							.line{
								height: 32rpx;
								width: 6rpx;
								background: #FF59C9;
								margin-right: 14rpx;
							}
						}
						.label_right{
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: #BDC0DA;
							&>image{
								height: 22rpx;
								width: 14rpx;
								margin-left: 16rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
