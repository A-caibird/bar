<template>
	<view class="container">
		<u-navbar v-if="!navShow" back-icon-color="#FFFFFF" :background="{'background': 'rgba(0,0,0,0)'}" :border-bottom="false" :immersive="true"></u-navbar>
		<view class="header_img">
			<image class="bg_img" :src=" userInfo.background || '/static/imgs/personalDynamic/dynamic_bgimg.png'"></image>
		</view>
		<view class="myinfo">
			<image class="avatar" :src="userInfo.avatar"  @tap.stop="previewTap"></image>
			<view class="myinfo-details">
				<view class="myinfo-details-head">
					<text class="text-name">{{userInfo.nickName}}</text>
					<image v-if="userInfo.sex == '男'" src="/static/imgs/register/male_icon.png"></image>
					<image v-else src="/static/imgs/register/female_icon.png"></image>
				</view>
				<view class="myinfo-details-body">
					<text>动态：{{userInfo.dynamicNumber}}</text>
					<text @tap="tapAttentionList">关注：{{userInfo.attentionNumber}}</text>
					<text @tap="tapFansList">粉丝：{{userInfo.fanNumber}}</text>
				</view>
			</view>
		</view>
		<view class="content-box">
			<view class="intro_box" v-if="userInfo.personalProfile">
				{{userInfo.personalProfile}}
			</view>
			<view class="content-title">
				<view class="content-title-box">
					<view class="nav_box" :class="{'show': navShow}" @tap="$u.throttle($u.route({type:'back'}))">
						<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
					</view>
					<view  class="content-dynamic" 
					:class="{active:currentIndex === '0' }" @tap="select('0')">动态</view>
					
					<view  class="content-dynamic"
					:class="{active:currentIndex === '1' }" @tap="select('1')">资料</view>
				</view>
				<view class="gajiu_btn" @tap="$u.route('pages/discovery/addDynamic')">
					<image src="/static/imgs/common/club-white.png"></image>
					<text>发布</text>
				</view>
			</view>
			<view class="">
				<view v-if="currentIndex == 0" class="dynamic-details" >
					<block v-if="hasLocation">
					<!-- kind值为personal时 个人动态组件 -->
						<personalDynamic @deleteTap="deleteHandle" :pageList="pageList" @videoPlayTap="videoPlayHandle" @shareTap="popShareShow = true" @oepnComment="$refs.dynamicComment.open($event)" @oepnGift="$refs.dynamicGift.open($event)" :showPercent="!isAppleAudit"></personalDynamic>
					</block>
					<block v-else>
						<location-btn></location-btn>
					</block>
				</view>
				<view class="info-details" v-if="currentIndex == 1">
					<view class="info-details-item" v-for="(item,index) in list" :key="index">
						<text class="item-name">{{item.name}}</text>
						<text class="item-info">{{item.info}}</text>
					</view>
				</view>
			</view>
		</view>
		<videoBox ref="videoBox"></videoBox>
		<dynamic-comment ref="dynamicComment" @sendComment="setCommentNum($event)"></dynamic-comment>
		<dynamic-gift ref="dynamicGift" @oepnGiftEdit="$refs.dynamicGiftEdit.open($event)" @sendGiftSuccess="handleSendGiftSuccess($event)"></dynamic-gift>
		<dynamic-gift-edit ref="dynamicGiftEdit" @confirm="$refs.dynamicGift.setSendNum($event)"></dynamic-gift-edit>
		<giftAnimation ref="giftAnimation"></giftAnimation>
		<popShare v-model="popShareShow"></popShare>
	</view>
</template>

<script>
	var app = getApp();
	import pageable from '@/mixins/pageable.js';
	import personalDynamic from '@/components/personalDynamic-item/personalDynamic-item.vue';
	import location from '@/mixins/location.js';
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	import appleAudit from '@/mixins/apple-audit.js'
	import videoBox from '@/components/common-video/video.vue'
	var {windowHeight, statusBarHeight} = uni.getSystemInfoSync();
	export default {
		mixins: [pageable, location,appleAudit], // 使用mixin (在main.js注册全局组件)
		components: {
			personalDynamic,
			giftAnimation,
			videoBox
		},
		data() {
			return {
				popShareShow: false,
				currentIndex: '0',
				userInfo:{},
				statusBarHeight: statusBarHeight,
				navShow: false,
				navOriginTop: 0,
				url:'/api/dynamic/myPublishList',
				params : {
					lng: app.globalData.location.lng, //经度
					lat: app.globalData.location.lat//纬度
				},
				showMyFans: true,
				showMyAttentionUser: true,
				list: [{
						name: '地区',
						info: ''
					},
					{
						name: '性别',
						info: ''
					},
					{
						name: '出生年月',
						info: ''
					},
					{
						name: '个性签名',
						info: ''
					}
				],
			};
		},
		onPageScroll:function(e){
			var vm = this;
			let scrollTop = e.scrollTop;
			let subDistance = this.navOriginTop - scrollTop;
			if(subDistance <= 20){
				if(!vm.navShow){
					vm.navShow = true
				}
			}else{
				if(vm.navShow){
					vm.navShow = false
				}
			}
		},
		onReachBottom:function(){
			this.reachBottom();
		},
		onLoad() {
			this.load();
			uni.$on('dynamic-refresh',this.handleDynamicRefresh)
			this.getMyInfo();
			this.pullRefresh();
			this.$nextTick(() => {
				setTimeout(() => {
					this.$u.getRect('.content-title').then(res => {
						this.navOriginTop = res.top;
					})
				},200)
			})
		},
		beforeDestroy() {
			uni.$off('dynamic-refresh',this.handleDynamicRefresh)
		},
		methods: {
			previewTap:function(){
				let urls = [this.userInfo.avatar];
				uni.previewImage({
					urls:urls,
					current: 0
				})
			},
			tapAttentionList:function(){
				if(this.showMyAttentionUser == false){
					this.$u.toast('不可以查看该用户的关注信息')
					 return 
				}
				this.$u.route('/pages/mine/follow/follow')
			},
			tapFansList:function(){
				if(this.showMyFans == false){
					this.$u.toast('不可以查看该用户的粉丝信息')
					 return 
				}
				this.$u.route('pages/info/fans')
			},
			select: function(e) {
				this.currentIndex=e
			},
			reachBottom:function(){
				this.reachBottomLoad()
			},
			// 获取个人数据
			getMyInfo: async function() {
				let {
					code,
					data
				} = await this.$u.api.getMyInfo({})
				if (code == 0) {
					this.userInfo = data.info
					this.list[0].info=this.userInfo.areaName;
					this.list[1].info=this.userInfo.sex;
					this.list[2].info=this.userInfo.birthday;
					this.list[3].info=this.userInfo.signature;
					this.showMyAttentionUser = this.userInfo.showMyAttentionUser
					this.showMyFans = this.userInfo.showMyFans
				}
			},
			deleteHandle(e){
				let id = e.dynamicId
				var vm = this;
				uni.showModal({
					title: '提示',
					content: '是否删除该动态',
					success(res){
						if(res.confirm){
							vm.$u.api.dynamicDeleteApi(id).then(res => {
								if(parseInt(res.code) == 0){
									vm.$u.toast('成功删除');
									uni.$emit('dynamic-refresh',{msg:'dynamic-detail'})
									uni.$emit('dynamic-refresh-follow',{msg:'dynamic-detail'})
								}
							}).catch(e => {
								console.log(e);
							})
						}
					}
				})
			},
			videoPlayHandle(e){
				this.$refs.videoBox.videoPlayTap(e.src);
			},
			
			handleDynamicRefresh(e){
				if(e.msg!='myDynamic') {
					console.log('刷新我的动态列表')
					this.pullRefresh();
				}
			},
			setGifttNum(data){
				let {id,giftNum} = data
				this.setList('id',id,{giftNum:giftNum},this.pageList)
				uni.$emit('dynamic-refresh',{msg:'myDynamic'})
			},
			handleSendGiftSuccess(e){
				this.setGifttNum(e)
				if(e.gifUrl) {
					this.$refs.giftAnimation.show(e.gifUrl)
				}
				
			},
			setCommentNum(data){
				let {id,commentNum} = data
				this.setList('id',id,{commentNum:commentNum},this.pageList)
				uni.$emit('dynamic-refresh',{msg:'myDynamic'})
			},
			judgeLoad(){
				return this.hasLocation
			},
			handleUpdateLocation(){
				this.setLocation(()=>{
					let {cityName,lng,lat} = app.globalData.location
					this.params.lng = lng
					this.params.lat = lat
					this.downCallback();
				})
			},
			handleUpdateLocationService(){
				this.updateLocationService(()=>{
					if(this.canLocation&&!this.hasLocation) {
						this.getLocation()
					}
				})
			},
			load(){
				this.downRefresh()
			},
			async downRefresh(){
				if(!this.hasLocation&&this.canLocation) {
					this.getLocation()
				} 
			}
			
		},
		
	};
	
</script>

<style lang="scss" scoped>
	.divider{
		height: 10rpx;
		width: 100%;
		background: #2C3158;
	}
	.container {
		.header_img{
			width: 100%;
			height: 402rpx;
			.bg_img{
				width: 100%;
				height: 402rpx;
				z-index: 1;
			}
		}
		.myinfo {
			display: flex;
			align-items: center;
			color: #FFFFFF;
			position: relative;
			box-sizing: border-box;
			padding: 30rpx;
			.avatar {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				position: relative;
				z-index: 10;
			}
	
			.myinfo-details {
				flex: 1;
				min-width: 0;
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				position: relative;
				z-index: 10;
				.myinfo-details-head{
					.text-name{
						padding: 0rpx;
						font-size: 42rpx;
					}
					image{
						width: 30rpx;
						height: 30rpx;
						padding-left: 20rpx;
					}
				}
				.myinfo-details-body {
					@include height-center();
					justify-content: space-between;
					padding-right: 30rpx;
					text {
						font-size: 28rpx;
					}
				}
			}
		}
	
		.content-box {
			display: flex;
			flex-direction: column;
			.intro_box{
				width: 100%;
				box-sizing: border-box;
				padding: 0rpx 30rpx;
				color: #FFFFFF;
				max-height: 110rpx;
				white-space: pre-wrap;
				word-break: break-word;
				line-height: 40rpx;
				overflow: hidden;
				@include multipleOmit(2);
			}
			.content-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 100%;
				color: #B7B9D6;
				font-size: 30rpx;
				min-height: 140rpx;
				padding-top: var(--status-bar-height);
				padding-bottom: 30rpx;
				position: sticky;
				top: 0rpx;
				left: 0rpx;
				z-index: 120;
				background: #191C3F;
				.content-title-box{
					display: flex;
					align-items: center;
				}
				.gajiu_btn{
					display: flex;
					align-items: center;
					justify-content: center;
					height: 56rpx;
					width: 156rpx;
					background: $uni-button-color;
					border-radius: 30rpx;
					margin-right: 24rpx;
					&>image{
						height: 28rpx;
						width: 22rpx;
						margin-right: 10rpx;
					}
					&>text{
						font-size: 28rpx;
						color: #FFFFFF;
					}
				}
				.nav_box{
					display: none;
					opacity: 0;
					transition: all 0.3s;
					padding-left: 24rpx;
					&.show{
						display: block;
						opacity: 1;
					}
				}
				.content-dynamic{
					position: relative;
					margin: 0 30rpx;
					&.active{
						font-size: 34rpx;
						color: #FFFFFF;
					&:after{
							content: "";
							position: absolute;
							bottom: -10rpx;
							left: 10rpx;
							width: 50rpx; 
							height: 6rpx;
							background: #FF59C9;
							border-radius: 3rpx;
					}
						
					}
	
				}
			}
			.dynamic-details {
				width: 100%;
			}
			.info-details {
				padding: 0 30rpx;
			
				.info-details-item {
					display: flex;
					justify-content: space-between;
					font-size: 28rpx;
					padding-bottom: 50rpx;
			
					.item-name {
						color: #9292BA;
					}
			
					.item-info {
						display: flex;
						justify-content: flex-end;
						color: #FFFFFF;
						width: 50%;
					}
				}
			}
			
			.btn{
				margin-top: 605rpx;
				margin-bottom: 30rpx;
				
				
				&>button{
					line-height: 90rpx;
					color: #FFFFFF;
					font-size: 30rpx;
					width: 690rpx;
					height: 90rpx;
					background: linear-gradient(270deg,#bb0cf9, #f92faf);
					border-radius: 49rpx;
				}
				
			}
		
		}
	}
</style>
