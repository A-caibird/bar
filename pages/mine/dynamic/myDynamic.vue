<template>
	<view class="container">
		<u-navbar v-if="!navShow" back-icon-color="#FFFFFF" :background="{'background': 'rgba(0,0,0,0)'}" :border-bottom="false" :immersive="true">
			<view slot="right" style="margin-right: 24rpx;" @tap="reportTap">
				<u-icon name="more-dot-fill" color="#ffffff" size="44"></u-icon>
			</view>
		</u-navbar>
		<view class="header_img">
			<image class="bg_img" :src=" otherList.background || '/static/imgs/personalDynamic/dynamic_bgimg.png'"></image>
		</view>
		<view class="myinfo">
			<image class="avatar" :src="otherList.avatar"  @tap.stop="previewTap"></image>
			<view class="myinfo-details">
				<view class="myinfo-details-head">
					<text class="text-name">{{otherList.nickName}}</text>
					<image v-if="otherList.sex == '男'" src="/static/imgs/register/male_icon.png"></image>
					<image v-else src="/static/imgs/register/female_icon.png"></image>
				</view>
				<view class="myinfo-details-body">
					<text>动态：{{otherList.dynamicNumber}}</text>
					<text @tap="tapAttentionList">关注：{{otherList.attentionNumber}}</text>
					<text @tap="tapFansList">粉丝：{{otherList.fanNumber}}</text>
				</view>
			</view>
			<view class="attention-btn">
				<view v-if="flag==true" class="btn-attench0" >
					<button plain="true" type="default" @tap="atten_btn()">
						<u-icon name="heart" color="#FFFFFF" size="28"></u-icon>
						<text>未关注</text>
					</button>
				</view>
				<view v-if="flag==false" class="btn-attench1" >
					<button plain="true" type="default" @tap="atten_btn()">
						<u-icon name="heart-fill" color="#FFFFFF" size="28"></u-icon>
						<text>已关注</text>
					</button>
				</view>
			</view>
		</view>
		<view class="content-box">
			<view class="intro_box" v-if="otherList.personalProfile">
				{{otherList.personalProfile}}
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
				<view class="gajiu_btn" @tap.stop="tapAwkwardWine" v-if="!isSelf">
					<image src="/static/imgs/common/club-white.png"></image>
					<text>尬酒</text>
				</view>
			</view>
			<view class="">
				<view v-if="currentIndex == 0" class="dynamic-details" >
					<view class="dynamic-details-item" v-for="(item,index) in pageList" :key="index">
						<!-- <image @tap="$u.route('pages/discovery/dynamic_detail?id=' + item.id)" :src="item.imgList[0]" mode="aspectFill"></image> -->
						<find-item 
							@videoPlayTap="videoPlayHandle"
							@shareTap="popShareShow = true"
							@oepnComment="openDynamicComment"
							@oepnGift="openGift"
							:showPercent="true" 
							:personType="true" 
							:userShow="false" :info="item"></find-item>
						<view class="divider"></view>
					</view>
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
		<dynamic-comment ref="dynamicComment" @sendComment="handleSendComment"></dynamic-comment>
		<dynamic-gift ref="dynamicGift" @oepnGiftEdit="$refs.dynamicGiftEdit.open($event)" @sendGiftSuccess="handleSendGiftSuccess($event)"></dynamic-gift>
		<dynamic-gift-edit ref="dynamicGiftEdit" @confirm="$refs.dynamicGift.setSendNum($event)"></dynamic-gift-edit>
		<pop-share v-model="popShareShow"></pop-share>
		<giftAnimation ref="giftAnimation"></giftAnimation>
		<reportPop ref="reportPop" @notViewTap="notViewHandle"></reportPop>
	</view>
</template>

<script>
	import pageable from '@/mixins/pageable.js';
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	var app = getApp();
	var {windowHeight, statusBarHeight} = uni.getSystemInfoSync();
	var proportion = uni.getSystemInfoSync().windowWidth / 750;
	import videoBox from '@/components/common-video/video.vue'
	import reportPop from '@/components/pop/report.vue'
	export default {
		mixins: [pageable],
		components:{
			giftAnimation,
			videoBox,
			reportPop
		},
		data() {
			return {
				popShareShow: false,
				statusBarHeight: statusBarHeight,
				navShow: false,
				navOriginTop: 0,
				currentIndex: '0',
				otherList:{},
				flag:'',
				showMyAttentionUser:'',
				showMyFans:'',
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
				params:{
					userId:-1,
					lng:121.557239,//不需要用到但,必须传
					lat: 29.809815,//接口不需要传
				},
				pageSize: 20,
				url:'/api/dynamic/otherPublishList',
				maxHeight: 0, // swiper 最大高度
				minHeight: 0, // swiper 最小高度
				swiperHeight: 0, // swiper 当前高度
				mode: 'personType',
				isSelf: false,
			}
		},
		onLoad(option) {
			this.userid = option.id
			this.params.userId = option.id
			if(app.globalData.userInfo.userId == option.id){
				this.isSelf = true;
			}else{
				this.isSelf = false;
			}
			this.otherMsg()
			this.pullRefresh()
			// this.maxHeight = windowHeight - statusBarHeight - ( 150 * proportion);
			// this.minHeight = windowHeight - statusBarHeight - (402 + 164 + 150 + 110) * proportion;
			this.$nextTick(() => {
				setTimeout(() => {
					this.$u.getRect('.content-title').then(res => {
						this.navOriginTop = res.top;
					})
				},200)
			})
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
		watch: {
			
		},
		methods: {
			notViewHandle(){
				uni.navigateBack({
					delta:1
				})
			},
			reportTap(){
				this.$refs.reportPop.show({
					type: 'people',
					userId: this.userid
				});
			},
			videoPlayHandle(e){
				this.$refs.videoBox.videoPlayTap(e.src);
			},
			handleSendComment(e) {
				this.setCommentNum(e)
			},
			handleSendGiftSuccess(e){
				if (e.gifUrl) {
					this.$refs.giftAnimation.show(e.gifUrl)
				}
				this.setGifttNum(e);
			},
			setGifttNum(data){
				let {id,giftNum} = data
				this.setList('id',id,{giftNum:giftNum},this.pageList).then(res => {
					uni.$emit('dynamic-refresh',{msg: this.mode})
					uni.$emit('dynamic-refresh-follow',{msg:this.mode})	
				}).catch(e => {
					console.log(e);
				})
			},
			setCommentNum(data){
				let {id,commentNum} = data
				this.setList('id',id,{commentNum:commentNum},this.pageList).then(res => {
					uni.$emit('dynamic-refresh',{msg: this.mode})
					uni.$emit('dynamic-refresh-follow',{msg: this.mode})
				}).catch(e => {
					console.log(e);
				})
			},
			openDynamicComment:function(e){
				console.log(e);
				let info = Object.assign(e, {mode: this.mode});
				this.$refs.dynamicComment.open(info)
			},
			openGift:function(e){
				let info = Object.assign(e, {mode: this.mode});
				this.$refs.dynamicGift.open(info)
			},
			tapAwkwardWine:function(){
				let info = {
					chatToken: '',
					nickName: '',
					avatar: '',
					userId: '',
					chatUserId: '',
				}
				if(this.pageList.length > 0){
					let dynamicInfo = this.pageList[0];
					info.chatToken = dynamicInfo.chatToken
					info.nickName = dynamicInfo.nickName
					info.avatar = dynamicInfo.avatar
					info.userId = dynamicInfo.userId
					info.chatUserId = dynamicInfo.chatUserId
				}else{
					let personInfo = this.otherList;
					info.chatToken = personInfo.chatToken
					info.nickName = personInfo.nickName
					info.avatar = personInfo.avatar
					info.userId = this.userid
					info.chatUserId = personInfo.chatUserId
				}
				this.$u.route('/pages/ping-yao-list/ping-yao-list',{
					dynamicInfo:encodeURIComponent(JSON.stringify(info))
				})
			},
			previewTap:function(){
				let urls = [this.otherList.avatar];
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
				this.$u.route('/pages/others/othersFollow',{
					userId:this.userid
				})
			},
			tapFansList:function(){
				if(this.showMyFans == false){
					this.$u.toast('不可以查看该用户的粉丝信息')
					 return 
				}
				this.$u.route('/pages/others/fans',{
					userId:this.userid
				})
			},
			select: function(e) {
				this.currentIndex=e
			},
			change(e){
				const{current} = e.detail
				this.currentIndex = ''+current
			},
			reachBottom:function(){
				this.reachBottomLoad()
			},
			
			//获取他人信息
			otherMsg:async function(){
				let params={
					userId:this.userid
				};
				let {code,data} = await this.$u.api.otherMsgApi(params)
				if(code==0) {
					console.log(data)
					this.otherList=data.info;
					this.list[0].info=this.otherList.areaName;
					this.list[1].info=this.otherList.sex;
					this.list[2].info=this.otherList.birthday;
					this.list[3].info=this.otherList.signature;
					this.showMyAttentionUser = this.otherList.showMyAttentionUser
					this.showMyFans = this.otherList.showMyFans
					if(this.otherList.hasAttention==true){
						this.flag=false;
					}else{
						this.flag=true;
					}
				}
			},
			//获取他人动态
			
			atten_btn: function(){
				//this.flag=!this.flag;
				if(this.flag==true){
					let params={
						userId:this.userid
					};
					this.$u.api.orattenchApi(params).then(res=>{
						console.log(res)
						if(res.code==0){
							this.flag=false;
							this.otherMsg()
							uni.$emit('personal-info-refresh')
							this.$u.toast('关注成功')
						}
					})
					
				}else{
					let params={
						userId:this.userid
					};
					this.$u.api.noattenchApi(params).then(res=>{
						console.log(res)
						if(res.code==0){
							this.flag=true;
							this.otherMsg()
							uni.$emit('personal-info-refresh')
							this.$u.toast('取消关注成功')
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.divider{
		height: 10rpx;
		width: 100%;
		background: #16192B; // Acaibird #16192B
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
			.attention-btn {
				// width: 180rpx;
				position: relative;
				z-index: 10;
				padding-top: 50rpx;
				justify-self: flex-end;
				.btn-attench0{
					width: 150rpx;
					height: 50rpx;
					border-radius: 49rpx;
					color: #FFFFFF;
					font-size: 28rpx;
					button {
						padding: 0;
						width: 150rpx;
						height: 50rpx;
						color: #FFFFFF;
						background: null;
						font-size: 26rpx;
						border-radius: 49rpx;
						@include flex-center();
						box-sizing: content-box;
						border: 1px solid #ffffff;
						&>text{
							margin-left: 8rpx;
						}
					}
				}
				
				.btn-attench1{
					width: 150rpx;
					height: 50rpx;
					border-radius: 49rpx;
					color: #FFFFFF;
					font-size: 28rpx;
					button {
						padding: 0;
						width: 150rpx;
						height: 50rpx;
						color: #FFFFFF;
						background: null;
						font-size: 26rpx;
						border-radius: 49rpx;
						@include flex-center();
						box-sizing: content-box;
						background-color:#F72EB2 ;
						&>text{
							margin-left: 8rpx;
						}
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
				background: #191C3F; // Acaibird #191C3F
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
				.dynamic-details-item {
					width: 100%;
				}
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
