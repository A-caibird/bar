<template style="background: #16192B;">
	<view class="container" style="background: #16192B;">
		<block>
			<u-navbar :border-bottom="false" :is-fixed="true" :title-color="`rgba(255,255,255,${navOpacity})`"
				:background="{
					background: `rgba(22,25,43,${navOpacity})`
				}" :title="clubInfo.name" :immersive=true back-icon-color="#FFFFFF"></u-navbar>
		</block>
		<view class="middle_box">
			<view class="club_info">
				<bannerList ref="commonBanner" :height="435" :bannerList="clubInfo.bannerObjList" imgKey="file" mode="normal"
					:showVideo="true" videoKey="videoUrl"></bannerList>
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
						<view class="loca_intro1"> <text>{{clubInfo.address}}</text></view>
						<view class="loca_intro2" @tap="tapOpenMap">
							<image src="/static/imgs/common/location.png" style="width: 24rpx; height: 24rpx;vertical-align: middle; margin-right: 8rpx;"></image>
							<text>{{clubInfo.areaName}}</text>
						</view>
						
						<view class="call_box" @tap="callPhone">
							<image src="/static/imgs/common/phone_icon.png" style="width: 40rpx; height: 40rpx;"></image>
							<text>电话</text>
						</view>
					</view>
				</view>
			</view>
			<view class="classify_box" :class="{'paddingTop': stickyStatus}">
				<view class="classify_panel">
					<block v-for="(info, index) in infoType" :key="index">
						<view class="common_classify" :class="{'select': selectIndex == index}"
							@tap="selectType(index)">
							<text>{{info.title}}</text>
							<view class="select_icon" v-if="selectIndex == index"></view>
						</view>
					</block>
				</view>
			</view>
			<view class="club_detail">
				<swiper class="classify_info" :current="selectIndex" @change="swiperChange">
					<swiper-item v-for="(info, index) in infoType" :key="index">
						<!-- 简介 -->
						<scroll-view scroll-top="0" :scroll-y="stickyStatus" :style="{height:swiperHeight}"
							v-if="info.type == 'introduction'" @scrolltoupper="scrolltoupper" :upper-threshold="upperThreshold">
							<view style="color: #FFFFFF;padding: 30rpx;">
								<u-parse :html="clubContent"></u-parse>
							</view>
						</scroll-view>
						<!-- 动态 -->
						<block v-if="info.type == 'dynamic'">
							<ping-dynamic-list :index="infoType[selectIndex].type == 'dynamic' ? 1 : -1" :i="1"
								:clubId="clubId" :canScroll="stickyStatus" :height="swiperHeight"
								:upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-dynamic-list>
						</block>
						<!-- 活动 -->
						<block v-if="info.type == 'activity'">
							<ping-activity-list :index="infoType[selectIndex].type == 'activity' ? 2 : -1" :i="2"
								:clubId="clubId" :canScroll="stickyStatus" :height="swiperHeight"
								:upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-activity-list>
						</block>
						<!-- 招聘 -->
						<block v-if="info.type == 'job'">
							<ping-recruitment-list :index="infoType[selectIndex].type == 'job' ? 3 : -1" :i="3"
								:clubId="clubId" :canScroll="stickyStatus" :height="swiperHeight"
								:upperThreshold="upperThreshold" @scrolltoupper="scrolltoupper"></ping-recruitment-list>
						</block>
						
						<!-- 评论 -->
						<scroll-view :scroll-y="stickyStatus" scroll-top="0" :style="{height:swiperHeight}"
							v-if="info.type == 'evaluate'" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower" :upper-threshold="upperThreshold">
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
						<!-- </view> -->
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="footer_box">
			<club-footer :isAppleAudit="isAppleAudit" @clickTap="clickEvent" :collect="collect"></club-footer>
		</view>
		<pop-share v-model="shareShow"></pop-share>
		<!-- <certPop></certPop> -->
	</view>
</template>

<script>
	import evaluate from '@/components/evaluate-item/evaluate-item.vue'//整一个评价item组件
	import clubFooter from '@/components/club-footer/club-footer.vue'//最底部的一行
	import selfRate from '@/components/self-rate/self-rate.vue'//评价的星星
	import certPop from '@/components/pop/certification.vue'//实名认证的提示
	import pingDynamicList from '@/components/ping-dynamic-list/ping-dynamic-list.vue'//动态列表item组件
	import pingActivityList from '@/components/ping-activity-list/ping-activity-list.vue'//活动列表item组件
	import pingRecruitmentList from '@/components/ping-recruitment-list/ping-recruitment-list.vue'//招聘
	import appleAudit from '@/mixins/apple-audit.js'
	import loginMixins from '@/mixins/loginConfirm.js'
	import bannerList from '@/components/common-banner/common-banner.vue'//带有视频和图片的轮播组件
	var app = getApp();
	export default {
		mixins: [appleAudit, loginMixins],
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
					type: 'introduction',
					url: '',
				}],
				scoreList: [{
						text: '服务',
						score: 5
					},
					{
						text: '氛围',
						score: 5
					},
					{
						text: '环境',
						score: 5
					},
					{
						text: '曲风',
						score: 5
					},
					{
						text: '快乐',
						score: 5
					}
				],
				clubId: '',
				collect: false,
				selectIndex: 0,
				stickyStatus: false,
				clubInfo: {
					bannerObjList: [],
				},
				clubContent: '',
				lat: 39.9091591069,
				lng: 116.3974783161,
				navOpacity: 0,
				commentList: [],
				upperThreshold: 10,
				statusBarHeight: 0,
				chatFriendInfo: '',
				swiperHeight: '',
				pageNumber:1,
				totalPages: 1,
				scrollTop: 0,
			}
		},
		computed: {
			labelName() {
				let index = this.selectIndex;
				let label = this.infoType[index].label;
				return label
			}
		},
		onPageScroll: function() {
			let vm = this;
			this.$u.getRect('.classify_box').then(res => {
				let top = res.top;
				if (top <= this.statusBarHeight + 44) {
					vm.stickyStatus = true;
				} else {
					vm.stickyStatus = false;
				}
			})
			this.$u.getRect('.club_info_second').then(res => {
				let top = res.top;
				if (top <= 50 && top >= 0) {
					vm.navOpacity = parseFloat((50 - top) / 50).toFixed(1)
				} else if (top < 0) {
					vm.navOpacity = 1
				} else if (top > 50) {
					vm.navOpacity = 0
				}
			})
		},
		created() {
			let {statusBarHeight, windowHeight} = uni.getSystemInfoSync();
			this.statusBarHeight = statusBarHeight
			this.swiperHeight = `calc(${windowHeight - statusBarHeight}px - ${(110 + 120)}rpx)`
		},
		onLoad: function(options) {
			let id = options.id;
			this.clubId = id;
			let chatFriendInfo = options.chatFriendInfo || ""
			if (chatFriendInfo) {
				this.chatFriendInfo = chatFriendInfo;
			}
			uni.showLoading({
				title: '加载中'
			})
			this.getClubDetail();
		},
		onShow: function() {

		},
		onHide() {
			this.hideEvent();
		},
		onUnload() {

		},
		methods: {
			// 页面隐藏事件
			hideEvent(){
				if(this.$refs.commonBanner && this.$refs.commonBanner.playVideoUrl){
					this.$refs.commonBanner.colseVideo();
				}
			},
			// 选择介绍类别
			selectType: function(index) {
				if (index != this.selectIndex) {
					this.selectIndex = index;
					// let type = this.infoType[this.selectIndex].type;
					// this.getTypeContent(type);
				}
			},
			swiperChange(e) {
				if (e.detail.current != this.selectIndex) {
					this.selectIndex = e.detail.current;
				}
				let type = this.infoType[this.selectIndex].type;
				this.getTypeContent(type);
			},
			refreshPage() {
				this.getClubDetail();
			},
			navigateAll() {
				let index = this.selectIndex;
				let path = this.infoType[index].path;
				if (path) {
					this.$u.route(path, {
						clubId: this.clubId
					})
				}
			},
			scrolltoupper(e){
				let platform = uni.getSystemInfoSync().platform
				if(platform=='ios') {
					this.stickyStatus = false
				}
			},
			scrolltolower(){
				this.pageNumber = this.pageNumber + 1;
				this.getCommentList(null, this.pageNumber);
			},
			tapOpenMap() {
				this.openMap(this.lng, this.lat, this.clubInfo.address)
			},
			//获取评论列表
			getCommentList: function(callback = null, pageNumber = 1) {
				let params = {
					"clubId": this.clubId,
					"pageNumber": pageNumber,
					"pageSize": 10,
				}
				if(params.pageNumber > this.totalPages){
					return;
				}
				this.$u.api.getClubEvaluationListApi(params).then(res => {
					if (parseInt(res.code) == 0) {
						this.totalPages = res.data.totalPage;
						let commentList = [];
						if(pageNumber <= 1){
							commentList = res.data.list;
						}else{
							commentList = this.commentList;
							commentList = commentList.concat(res.data.list);
						}
						this.commentList = commentList
						if (callback) {
							callback();
						}
					} else {
						this.commentList = [];
						console.log("获取评价列表失败")
					}
				})
			},
			goActivity: function(info) {
				this.$u.route('/pages/club/activity/detail', {
					id: info.id,
					activityName: info.title,
					activityTime: info.publishTime,
					clubName: this.clubInfo.name
				})
			},
			// 点击事件
			async clickEvent(e) {
				let vm = this
				let type = e.type;
				if (!this.loginConfirmHandle(false)) {
					// console.log('clickEvent')
					return;
				}
				var clubImg = this.getClubFrontImg(this.clubInfo.bannerObjList)
				switch (type) {
					case 'collect':
						this.toggleCollect();
						break;
					case 'book': { // 订座
						this.$storage.setStorageSync('clubImg', clubImg);
						this.$u.route('/pages/club/consumption/seat', {//开始跳到订座页面
							clubId: this.clubId,
							clubName: this.clubInfo.name,
							clubSubTitle: this.clubInfo.subtitle,
							orderType: 'book',
							chatTag: this.chatFriendInfo ? true : false,
							chatFriendInfo: this.chatFriendInfo || ""

						});
					};
					break;
				case 'fight': { //拼享
					this.$storage.setStorageSync('clubImg', clubImg);
					this.$u.route('/pages/club/consumption/seat', {
						clubId: this.clubId,
						clubName: this.clubInfo.name,
						clubSubTitle: this.clubInfo.subtitle,
						orderType: 'fight',
						chatTag: this.chatFriendInfo ? true : false,
						chatFriendInfo: this.chatFriendInfo || "",
					});
				};
				break;
				case 'service': {
					uni.showLoading({
						title: '进入中'
					})
					this.$u.api.clubServiceAPI(this.clubId).then(res => {
						if (res.data.hasStaff) {
							this.$u.route('/pages/customerRoom/index', {
								id: res.data.id,
								avatar: res.data.avatar,
								nickname: res.data.nickname,
								clubId:this.clubId
							});
							uni.hideLoading();
						} else {
							uni.showToast({
								title: '暂无客服人员',
								icon: 'none'
							})
						}

					}).catch(e => {
						console.log(e);
					})

				};
				break;
				case 'share': {
					this.shareShow = true;
				};
				break;
				default:
					break;
				}
			},
			toggleCollect: function() {
				let collect = this.collect;
				if (collect) {
					this.$u.api.clubCancelCollect(this.clubId).then(res => {
						if (parseInt(res.code) == 0) {
							this.collect = !collect
							this.$u.toast('取消收藏')
						} else {
							this.$u.toast('取消失败')
						}
					})
				} else {
					this.$u.api.clubCollect(this.clubId).then(res => {
						if (parseInt(res.code) == 0) {
							this.collect = !collect
							this.$u.toast('收藏成功')
						} else {
							this.$u.toast('收藏失败')
						}
					})
				}
			},
			// 拨打电话
			callPhone: function() {
				uni.makePhoneCall({
					phoneNumber: this.clubInfo.phone
				})
			},
			// 获取酒吧简介
			getClubIntro: async function(callback = null) {
				let {
					code,
					data
				} = await this.$u.api.getClubIntro(this.clubId)
				if (code == 0) {
					this.clubContent = data.view;
					this.lng = data.lng
					this.lat = data.lat
					if (callback) {
						callback();
					}
				}
			},
			// 获取酒吧详情
			getClubDetail: async function() {
				let {
					code,
					data
				} = await this.$u.api.getClubDetail(this.clubId)
				if (code == 0) {
					this.clubInfo = data.info;
					let info = data.info;
					this.collect = info.hasCollect;
					this.scoreList[0].score = info.serviceAvgScore
					this.scoreList[1].score = info.atmosphereAvgScore
					this.scoreList[2].score = info.surroundingsAvgScore
					this.scoreList[3].score = info.genreAvgScore
					this.scoreList[4].score = info.happyAvgScore
					this.getInfoType(info);
				}
				this.selectIndex = 0;
				let type = this.infoType[0].type;
				this.getTypeContent(type);
			},
			getInfoType(info) {
				let infoType = [
					{
						label: '',
						title: '简介',
						type: 'introduction',
						url: ''
					}
				]
				if (info.showDynamic) {
					infoType.push({
						label: '动态',
						title: '动态',
						type: 'dynamic',
						path: '/pages/club/dynamic/list',
					});
				}
				if (info.showActivity) {
					infoType.push({
						label: '活动',
						title: '活动',
						type: 'activity',
						path: '/pages/club/activity/list',
					});
				}
				if (info.showRecruitment) {
					infoType.push({
						label: '招聘',
						title: '招聘',
						type: 'job',
						path: '/pages/club/job/list',
					});
				}
				if (info.canEvaluationContent) {
					infoType.push({
						label: '评论',
						title: '评论',
						type: 'evaluate',
						path: '/pages/evaluate/list',
					});
				}
				this.infoType = infoType;
			},
			// 获取分类页面内容
			getTypeContent(type) {
				let currentIndex = this.infoType.findIndex((item) => {
					return item.type == type
				})
				var vm = this;
				switch (type) {
					case 'introduction': {
						vm.getClubIntro(() => {});
					};
					break;
				case 'evaluate': {
					vm.getCommentList();
				};
				break;
				default:
					break;
				}
			},

			goBack: function() {
				uni.navigateBack({
					delta: 1,
				})
			}
		}
	}
</script>

<style lang="scss">
	page {}

	.container {
		width: 100%;
		padding-bottom: 120rpx;

		.parse_box {
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
						margin-bottom: 8rpx;
					}

					.info_intro {
						line-height: 40rpx;
						color: #FFFFFF;
						font-size: 28rpx;
						margin-bottom: 24rpx;
					}

					.info_eva {
						display: flex;
						align-items: center;
						color: #F72EB2;
						font-size: 26rpx;
						padding-bottom: 24rpx;
						border-bottom: 2rpx solid rgba(255,255,255,0.08);
						border-radius: 1rpx;
						margin-bottom: 24rpx;

						&>text {
							margin-left: 14rpx;
							color: #9633FF;
						}
					}

					.info_open_time {
						display: flex;
						align-items: center;
						font-size: 28rpx;
						color: rgba(255,255,255,0.5);

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
						margin: 14rpx 0 40rpx;
						flex-wrap: wrap;

						.common_label {
							height: 40rpx;
							@include flex-center();
							font-size: 20rpx;
							color: #FFF;
							padding: 0 10rpx;
							border-radius: 8rpx;
							background: rgba(255, 255, 255, 0.1);
							margin-right: 16rpx;
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
							color: rgba(255,255,255,0.5);
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
								font-size: 24rpx;
								color: rgba(255,255,255,0.5);
							}
						}
					}
				}
			}

			.classify_box {
				width: 100%;
				padding-left: 30rpx;
				display: flex;
				align-items: center;
				position: sticky;
				top: 88rpx;
				z-index: 100;
				background: #16192B;
				border-bottom: 2rpx solid rgba(255,255,255,0.08);
				transition: all, 0.1s;
				&.paddingTop {
					padding-top: var(--status-bar-height);
				}
				.nav_box {
					margin-right: 0rpx;
					width: 0rpx;
					height: 0rpx;
					transform: all 0.3;
					display: none;
					padding-top: 0rpx;

					&.animalStart {
						margin-right: 30rpx;
						width: auto;
						height: auto;
						display: block;
					}
				}

				.classify_panel {
					justify-content: center;
					width: 100%;
					height: 110rpx;
					display: flex;
					align-items: center;

					.common_classify {
						position: relative;
						color: #979797;
						font-size: 30rpx;
						display: flex;
						align-items: center;
						flex-direction: column;
						margin-right: 52rpx;

						&.select {
							color: #FFFFFF;
							&::after {
								position: absolute;
								top: 0;
								bottom: 0;
								left: 0;
								right: 0;
								content: '';
								z-index: -999;
								background: #832DFF;
								filter: blur(10rpx);
								transform: translateZ(0);
								border-radius: 100%;
							}
						}

						.select_icon {
							position: absolute;
							bottom: -10rpx;
							height: 4rpx;
							width: 34rpx;
							background: #FFF;
							border-radius: 2rpx;
							opacity: 0.2;
						}
					}
				}
			}

			.club_detail {
				width: 100%;

				.classify_info {
					width: 100%;
					height: calc(100vh  - 230rpx - 88rpx);
					box-sizing: border-box;

					.common_label {
						height: 100rpx;
						width: 100%;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.label_left {
							display: flex;
							align-items: center;
							font-size: 34rpx;
							color: #FFFFFF;
							font-weight: 500;

							.line {
								height: 32rpx;
								width: 6rpx;
								background: #FF59C9;
								margin-right: 14rpx;
							}
						}

						.label_right {
							display: flex;
							align-items: center;
							font-size: 26rpx;
							color: #BDC0DA;

							&>image {
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

				.evaluate_box {
					width: 100%;
					padding: 30rpx;

					.complex_rate {
						padding: 30rpx 0rpx;
						border-bottom: 1px solid #31345B;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.complex_left {
							display: flex;
							flex-direction: column;

							.label {
								font-size: 36rpx;
								color: #FFFFFF;
								font-weight: 500;
							}

							.label_rate {
								display: flex;
								align-items: center;

								.score {
									font-size: 58rpx;
									color: #FFFFFF;
									margin-right: 32rpx;
								}
							}
						}

						.complex_right {
							display: flex;
							flex-direction: column;

							.common_rate {
								display: flex;
								align-items: center;

								.score_label {
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
