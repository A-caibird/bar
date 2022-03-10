<template style="background: #191C3F;">
	<view class="container" style="background: #191C3F;">
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
				<bannerList :height="435" :bannerList="clubInfo.bannerObjList" imgKey="file" mode="normal" :showVideo="true" videoKey="videoUrl"></bannerList>
				<view class="club_info_second">
					<view class="info_name"> <text>{{clubInfo.name}}</text> </view>
					<view class="info_intro"> <text>{{clubInfo.subtitle}}</text> </view>
					<view class="info_eva">
						<view class="rate_box">
							<selfRate :score="clubInfo.avgScore" size="24"></selfRate>
						</view>
						<text>{{clubInfo.avgScore}} 评分</text>
					</view>
					<view class="info_open_time">
						<text>营业时间</text>
						<view class="line"></view>
						<text>{{clubInfo.businessHours?clubInfo.businessHours:'暂未填写'}}</text>
					</view>
					<view class="info_label">
						<block v-for="(info, index) in clubInfo.labelList" :key="index">
							<view class="common_label"> <text>{{info}}</text> </view>
						</block>
					</view>
					<view class="info_loaction">
						<view class="loca_intro1"> <text>{{clubInfo.address}}</text> </view>
						<view class="loca_intro2" @tap="tapOpenMap"> <text>{{clubInfo.areaName}}</text> <u-icon name="map" size="32"></u-icon></view>
						<view class="call_box" @tap="callPhone">
							<u-icon size="40" name="phone" color="#FFFFFF"></u-icon>
							<text>电话</text>
						</view>
					</view>
				</view>
			</view>
			<view class="classify_box" :class="{'paddingTop': stickyStatus}">
				<view class="nav_box" :class="{'animalStart': stickyStatus}" @tap="$u.throttle($u.route({type:'back'}))">
					<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
				</view>
				<view class="classify_panel">
					<block v-for="(info, index) in infoType" :key="index">
						<view class="common_classify" v-if="info.show" :class="{'select': selectIndex == index}" @tap="selectType(index)">
							<text>{{info.title}}</text>
							<view class="select_icon" v-if="selectIndex == index"></view>
						</view>
					</block>
				</view>
			</view>
			<view class="club_detail">
				<view class="classify_info" v-if="classifyShow">
					<view style="box-sizing: border-box; padding: 0rpx 30rpx;" v-if="labelName">
						<view class="common_label">
							<view class="label_left">
								<view class="line"></view>
								<text>{{labelName}}</text>
							</view>
							<view class="label_right" @tap="navigateAll">
								<text>查看全部</text>
								<image src="/static/imgs/common/right.png"></image>
							</view>
						</view>
					</view>
					<view v-show="infoType[0].show && selectIndex == 0">
						<view class="parse_box">
							<u-parse :html="clubContent"></u-parse>
						</view>
					</view>
					<view v-show="infoType[1].show && selectIndex == 1">
						<ping-dynamic-list :i="1" :index="selectIndex" :clubId="clubId"  :canScroll="false" :height="swiperHeight" :upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-dynamic-list>
					</view>
					<view v-show="infoType[2].show && selectIndex == 2">
						<ping-activity-list :i="2" :index="selectIndex" :clubId="clubId" :canScroll="false" :height="swiperHeight" :upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-activity-list>
					</view>
					<view v-show="infoType[3].show && selectIndex == 3">
						<ping-recruitment-list :i="3" :index="selectIndex" :clubId="clubId" :canScroll="false" :height="swiperHeight" :upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-recruitment-list>
					</view>
					<view v-show="infoType[4].show && selectIndex == 4">
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
							<!-- <view class="common_label">
								<view class="label_left">
									<view class="line"></view>
									<text>用户评价</text>
								</view>
								<view class="label_right" @tap="$u.route('pages/evaluate/list',{clubId:clubId})">
									<text>查看全部</text>
									<image src="/static/imgs/common/right.png"></image>
								</view>
							</view> -->
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
					</view>		
				</view>
			</view>
		</view>
		<view class="footer_box">
			<club-footer :isAppleAudit="isAppleAudit" @clickTap="clickEvent" :collect="collect" :showSetSeat="!isAppleAudit"></club-footer>
		</view>
		<pop-share v-model="shareShow"></pop-share>
		<!-- <certPop></certPop> -->
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
	import appleAudit from '@/mixins/apple-audit.js'
	import loginMixins from '@/mixins/loginConfirm.js'
	import bannerList from '@/components/common-banner/common-banner.vue'
	var app = getApp();
	export default {
		mixins:[appleAudit,loginMixins],
		components: {
			clubFooter,
			evaluate,
			selfRate,
			certPop,
			pingDynamicList,
			pingActivityList,
			pingRecruitmentList,
			bannerList
		},
		data() {
			return {
				shareShow: false,
				// '简介', '动态', '活动', '招聘', '评价'
				infoType: [{
					label: '',
					title: '简介',
					show: true,
					url:'',
				},{
					label: '动态',
					title: '动态',
					show: true,
					path:'/pages/club/dynamic/list',
				},{
					label: '活动',
					title: '活动',
					show: true,
					path:'/pages/club/activity/list',
				},{
					label: '招聘',
					title: '招聘',
					show: true,
					path:'/pages/club/job/list',
				},{
					label: '评论',
					title: '评论',
					show: true,
					path:'/pages/evaluate/list',
				}],
				// urls:[
				// 	'',
				// 	'/api/club/dynamicList',
				// 	'/api/clubActivity/activityList',
				// 	'/api/recruitment/list',
				// 	'/api/club/evaluationList'
				// ],
				scoreList:[
					{
						text:'服务',
						score: 5
					},
					{
						text:'氛围',
						score: 5
					},
					{
						text:'环境',
						score: 5
					},
					{
						text:'曲风',
						score: 5
					},
					{
						text:'快乐',
						score: 5
					}
				],
				clubId:'',
				collect: false,
				selectIndex: 4,
				stickyStatus: false,
				clubInfo:{
					bannerObjList:[],
				},
				clubContent:'',
				lat:39.9091591069,
				lng:116.3974783161,
				navOpacity:0,
				commentList:[],
				upperThreshold:10,
				statusBarHeight: 0,
				classifyShow: false,
			}
		},
		computed:{
			swiperHeight(){
				return `calc(100vh - ${this.statusBarHeight}px - 110rpx - 120rpx)`
			},
			labelName(){
				let index = this.selectIndex;
				let label = this.infoType[index].label;
				return label
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
		onPageScroll: function() {
			let vm = this;
			this.$u.getRect('.classify_box').then(res => {
				let top = res.top;
				if(top <= this.statusBarHeight){
					vm.stickyStatus = true;
				}
				else{
					vm.stickyStatus = false;
				}
			})
			this.$u.getRect('.club_info_second').then(res => {
				let top = res.top;
				if(top<=40&&top>=0) {
					vm.navOpacity = parseFloat((50-top)/50).toFixed(1)
				} else if(top<0) {
					vm.navOpacity = 1
				} else if(top>40) {
					vm.navOpacity = 0
				}
			})
		},
		created() {
			this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
		},
		onLoad:function(options){
			let id = options.id;
			this.clubId = id;
			this.$nextTick(() => {
				uni.showLoading({
					title: '加载中'
				})
				this.getClubDetail();
				// this.getClubIntro();
				// this.selectIndex = 0;
			})
		},
		onShow:function(){
			
		},
		methods: {
			refreshPage(){
				this.getClubDetail();
			},
			navigateAll(){
				let index = this.selectIndex;
				let path = this.infoType[index].path;
				if(path){
					this.$u.route(path,{clubId: this.clubId})
				}
			},
			scrolltoupper(e){
				let platform = uni.getSystemInfoSync().platform
				if(platform=='ios') {
					this.stickyStatus = false
				}
			},
			tapOpenMap(){
				this.openMap(this.lng, this.lat, this.clubInfo.address)
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
						this.commentList = [];
						console.log("获取评价列表失败")
					}
				})
			},
			goActivity: function(info){
				this.$u.route('/pages/club/activity/detail',{
					id: info.id,
					activityName: info.title,
					activityTime: info.publishTime,
					clubName: this.clubInfo.name
				})
			},
			// 点击事件
			async clickEvent(e){
				let vm = this
				let type = e.type;
				console.log(type);
				if(!this.loginConfirmHandle(false)){
					// console.log('clickEvent')
					return ;
				}
				var clubImg = this.getClubFrontImg(this.clubInfo.bannerObjList)
				switch(type){
					case 'collect': this.toggleCollect(); break; 
					case 'book': { // 订座
						this.$storage.setStorageSync('clubImg',clubImg);
						await this.judgeVerify()
						this.$u.route('/pages/club/consumption/seat',{
							clubId:this.clubId,
							clubName: this.clubInfo.name,
							clubSubTitle: this.clubInfo.subtitle,
							orderType: 'book'
						});
					};break;
					case 'fight': { //拼享
						this.$storage.setStorageSync('clubImg', clubImg);
						let {creditScore} = await this.judgeVerify();
						if(!creditScore){
							this.$u.route('/pages/club/consumption/seat',{
								clubId:this.clubId,
								clubName: this.clubInfo.name,
								clubSubTitle: this.clubInfo.subtitle,
								orderType: 'fight'
							});
						}else{
							this.$u.toast('当前信用分较低，无法拼享');
						}
					};break;
					case 'service':{
						uni.showLoading({
							title: '进入中'
						})
						this.$u.api.clubServiceAPI(this.clubId).then(res => {
							console.log(res);
							if(res.data.hasStaff){
								this.$u.route('/pages/customerRoom/index',{
									id: res.data.id,
									avatar: res.data.avatar,
									nickname: res.data.nickname
								});
								uni.hideLoading();
							}else{
								uni.showToast({
									title: '暂无客服人员',
									icon: 'none'
								})
							}
							
						}).catch(e => {
							console.log(e);
						})
						
					}; break;
					case 'share':{
						this.shareShow = true;
					}; break;
					default: break;
				}
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
			// 拨打电话
			callPhone: function(){
				uni.makePhoneCall({
					phoneNumber: this.clubInfo.phone
				})
			},
			// 获取酒吧简介
			getClubIntro: async function(){
				let {code,data} = await this.$u.api.getClubIntro(this.clubId)
				if(code==0) {
					this.clubContent = data.view;
					this.lng = data.lng
					this.lat = data.lat
				}
			},
			// 获取酒吧详情
			getClubDetail: async function(){
				let {code,data} = await this.$u.api.getClubDetail(this.clubId)
				if(code==0) {
					this.clubInfo = data.info;
					let info = data.info;
					this.collect = info.hasCollect;
					this.scoreList[0].score = info.serviceAvgScore
					this.scoreList[1].score = info.atmosphereAvgScore
					this.scoreList[2].score = info.surroundingsAvgScore
					this.scoreList[3].score = info.genreAvgScore
					this.scoreList[4].score = info.happyAvgScore
					if(!data.info.canEvaluationContent) this.infoType[4].show = false
					if(!data.info.showActivity) this.infoType[2].show = false
					if(!data.info.showDynamic) this.infoType[1].show = false
					if(!data.info.showRecruitment) this.infoType[3].show = false
				}
				this.$nextTick(() => {
					setTimeout(() => {
						uni.hideLoading();
					},800);
				})
				this.classifyShow = true;
				this.getClubIntro();
				// this.getCommentList();
				this.selectIndex = 0;
			},
			
			goBack:function(){
				uni.navigateBack({
					delta:1,
				})
			},
			// 选择介绍类别
			selectType: function(index) {
				if (index != this.selectIndex) {
					this.selectIndex = index;
				}
			}
		}
	}
</script>

<style lang="scss">
	page{
		
	}
	.container {
		width: 100%;
		padding-bottom: 120rpx;
		.parse_box{
			width: 100%;
			color: #FFFFFF;
			padding: 30rpx;
		}
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
				.club_info_second {
					width: 100%;
					padding: 30rpx;
					box-sizing: border-box;

					.info_name {
						width: 100%;
						font-size: 40rpx;
						color: #FFFFFF;
						font-weight: 500;
					}

					.info_intro {
						line-height: 40rpx;
						color: #FFFFFF;
						font-size: 28rpx;
					}

					.info_eva {
						height: 110rpx;
						display: flex;
						align-items: center;
						color: #F72EB2;
						font-size: 26rpx;

						&>text {
							margin-left: 14rpx;
						}
					}

					.info_open_time {
						display: flex;
						align-items: center;
						font-size: 26rpx;
						color: #FFFFFF;

						.line {
							height: 20rpx;
							width: 1px;
							background: #575B85;
							margin: 0 14rpx;
						}
					}

					.info_label {
						width: 100%;
						display: flex;
						margin: 16rpx 0rpx;
						flex-wrap: wrap;
						.common_label {
							height: 40rpx;
							@include flex-center();
							border: 1px solid #565B86;
							font-size: 20rpx;
							color: #B3BAEF;
							padding: 0 10rpx;
							border-radius: 2rpx;
							margin-right: 12rpx;
							margin-bottom: 12rpx;
						}
					}

					.info_loaction {
						width: 100%;
						position: relative;

						.loca_intro1 {
							font-size: 30rpx;
							color: #FFFFFF;
						}

						.loca_intro2 {
							font-size: 26rpx;
							color: #B4B2CF;
							margin-top: 15rpx;
						}

						.call_box {
							display: flex;
							align-items: center;
							flex-direction: column;
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 30rpx;

							&>text {
								font-size: 22rpx;
								color: #FFFFFF;
							}
						}
					}
				}
			}
			.classify_box {
				width: 100%;
				padding-top: 0rpx;
				padding-left: 30rpx;
				display: flex;
				align-items: center;
				position: sticky;
				top: 0;
				z-index: 100;
				background: #191C3F;
				border-bottom: 1px solid #31345B;
				transition: all 0.3s; 
				&.paddingTop{
					padding-top: var(--status-bar-height);
				}
				.nav_box {
					margin-right: 0rpx;
					width: 0rpx;
					height: 0rpx;
					transform: all 0.3;
					display: none;
					padding-top: 0rpx;
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
			.club_detail {
				width: 100%;
		
				.classify_info {
					width: 100%;
					box-sizing: border-box;
					// height: calc(100vh - var(--status-bar-height) - 110rpx - 120rpx);
					.common_label{
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
				}
			}
		}
	}
</style>
