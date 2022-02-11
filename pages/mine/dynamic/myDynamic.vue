<template>
	<view class="container">
		<u-navbar v-if="!navShow" back-icon-color="#FFFFFF" :background="{'background': 'rgba(0,0,0,0)'}" :border-bottom="false" :immersive="true"></u-navbar>
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
			<view class="content-title" :style="{'paddingTop': statusBarHeight + 'px'}">
				<view class="content-title-box">
					<view class="nav_box" :class="{'show': navShow}" @tap="$u.throttle($u.route({type:'back'}))">
						<u-icon name="arrow-left" color="#FFFFFF" size="44"></u-icon>
					</view>
					<view  class="content-dynamic" 
					:class="{active:currentIndex === '0' }" @tap="select('0')">动态</view>
					
					<view  class="content-dynamic"
					:class="{active:currentIndex === '1' }" @tap="select('1')">资料</view>
				</view>
				<view class="gajiu_btn" @tap.stop="tapAwkwardWine">
					<image src="/static/imgs/common/club-white.png"></image>
					<text>尬酒</text>
				</view>
			</view>
			<swiper @change="change" class="swiper-tab" :current="currentIndex" :style="{'height': swiperHeight + 'px'}">
				<swiper-item>
					<scroll-view class="dynamic-details" :style="{'height': swiperHeight + 'px'}" :scroll-y="false" @scrolltolower="reachBottom">
						<view class="dynamic-details-item" v-for="(item,index) in pageList" :key="index">
							<image @tap="$u.route('pages/discovery/dynamic_detail?id=' + item.id)" :src="item.imgList[0]" mode="aspectFill"></image>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<view class="info-details">
						<view class="info-details-item" v-for="(item,index) in list" :key="index">
							<text class="item-name">{{item.name}}</text>
							<text class="item-info">{{item.info}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		
		</view>
	</view>
</template>

<script>
	import pageable from '@/mixins/pageable.js';
	var app = getApp();
	var {windowHeight, statusBarHeight} = uni.getSystemInfoSync();
	var proportion = uni.getSystemInfoSync().windowWidth / 750;
	export default {
		mixins: [pageable],
		data() {
			return {
				statusBarHeight: statusBarHeight,
				navShow: false,
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
			}
		},
		onLoad(option) {
			this.userid = option.id
			this.params.userId = option.id
			this.otherMsg()
			this.pullRefresh()
			this.maxHeight = windowHeight - statusBarHeight - ( 150 * proportion);
			this.minHeight = windowHeight - statusBarHeight - (402 + 164 + 150 + 110) * proportion;
		},
		onPageScroll:function(){
			var vm = this;
			this.$u.getRect('.content-title').then(res => {
				let top = res.top;
				if(top <= 20){
					if(!vm.navShow){
						
						vm.navShow = true
					}
				}else{
					if(vm.navShow){
						vm.navShow = false
					}
				}
			})
		},
		onReachBottom:function(){
			this.reachBottom();
		},
		watch: {
			pageList(newValue) {
				this.swiperHeight =  this.getSwiperHeight(newValue)
			},
			currentIndex(index){
				if(index == 1){
					this.swiperHeight = this.minHeight;
				}else{
					this.swiperHeight = this.getSwiperHeight(this.pageList);
				}
			}
			
		},
		methods: {
			tapAwkwardWine:function(){
				this.$u.route('/pages/ping-yao-list/ping-yao-list',{
					dynamicInfo:encodeURIComponent(JSON.stringify(this.pageList[0]))
				})
			},
			getSwiperHeight:function(pageList){
				let pageLength = pageList.length;
				let maxHeight = this.maxHeight;
				let minHeight = this.minHeight;
				let sumLine = parseInt(pageLength / 3);
				if((pageLength % 3) > 0){
					sumLine + 1
				}
				let currentHeight = sumLine * 250 * proportion;
				console.log(maxHeight, minHeight, currentHeight);
				if(currentHeight > minHeight){
					// if(currentHeight < maxHeight){
					// 	return currentHeight; // 单位px
					// }else{
					// 	return maxHeight; // 单位px
					// }
					return currentHeight; // 单位px
				}else{
					return currentHeight; // 单位px
				}	 
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
				width: 180rpx;
				position: relative;
				z-index: 10;
				padding-top: 50rpx;
				padding-right: 30rpx;
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
				height: 120rpx;
				color: #B7B9D6;
				font-size: 30rpx;
				padding-bottom: 30rpx;
				position: sticky;
				top: 0rpx;
				left: 0rpx;
				z-index: 10;
				background: #191C3F;
				.content-title-box{
					display: flex;
					align-items: center;
				}
				.gajiu_btn{
					display: flex;
					align-items: center;
					justify-content: center;
					height: 60rpx;
					width: 170rpx;
					background: $uni-button-color;
					border-radius: 30rpx;
					margin-right: 30rpx;
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
			.swiper-tab{
				width: 100%;
				overflow: hidden;
			}
			.dynamic-details {
				display: flex;
				width: 100%;
				font-size: 0rpx;
				.dynamic-details-item {
					display: inline-block;
					vertical-align: top;
					width: 250rpx;
					height: 250rpx;
					font-size: 0rpx;
					margin: 0rpx;
					image {
						width: 250rpx;
						height: 250rpx;
					}
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
