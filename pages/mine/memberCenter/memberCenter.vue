<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="会员中心" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="member-box">
			<view class="member-box-img">
				<image :src="memberInfo.avatar" mode=""></image>
			</view>
			<view class="member-info">
				<view class="member-info-text">
					<text>{{memberInfo.nickName}}</text>
					<!-- <view class="member-info-right" @tap="$u.route('pages/mine/memberRight/memberRight')">
						<text>查看会员权益</text>
						<image src="/static/imgs/common/right.png" mode=""></image>
					</view> -->
				</view>
				<view class="member-info-icon">
					<view class="member-medal">
						<image src="/static/imgs/mine/class_icon.png" mode=""></image>
						<text>{{memberInfo.membershipLevel}}</text>
					</view>
					<view class="member-credit" @tap="$u.throttle(tapGoPointsDetail)">
						<image src="/static/imgs/mine/score.png" mode=""></image>
						<text style="padding-left: 4rpx;">我的积分</text>
						<text>{{parseInt(memberInfo.memberPoints)}}分</text>
					</view>
				</view>
			</view>
		</view>
		<view class="single-member-wrap">
			<block>
				<view class="swiper-item">
					<view class="member-level">
						<view class="current_level_point">
							<text>积分 ≥ {{currentLevel.lowestScore}}</text>
						</view>
						<view class="member-level-info">
							<text class="member-name" style="font-size: 40rpx; margin-top: 104rpx;">{{memberInfo.membershipLevel}}级会员</text>
							<view class="member-name-text">
								<text style="margin-right: 10rpx;">您的当前等级是</text>
								<view class="member-medal">
									<image src="/static/imgs/mine/class_icon.png" mode=""></image>
									<text>{{memberInfo.membershipLevel}}</text>
								</view>
							</view>
							<!-- <template>
								<u-line-progress active-color="#FFFFFF" :show-percent="false" inactive-color="#787878" height="12" :percent="calcPercent(memberInfo.memberPoints,currentLevel.lowestScore)" ></u-line-progress>
							</template> -->
							<view style="margin-top: 42rpx;">
								<text style="font-size: 24rpx;" >{{subPointText}}</text>
							</view>
						</view>
						<view class="badge-icon">
							<image :src="currentLevel.badgeUrl"></image>
						</view>
					</view>
				</view>			
			</block>
		</view>
		<view class="member-rule">
			<text style=" padding-bottom: 10rpx;">1.消费：平台内每消费1元积1分，无上限</text>
			<text>2.评价：评价酒吧发布者获得1积分，无上限</text>
		</view>

	</view>
</template>

<script>
	export default{
		data(){
			return{
				originalMemberList:[],
				memberList:[],
				memberInfo:{
					// "membershipLevel": "钻石会员",
					// "nickName": "测试7",
					// "avatar": "https://patixiu.oss-cn-shanghai.aliyuncs.com/image/161490853834322.png",
					// "memberPoints": 8500.00,
				},
				current:0,
				currentLevel: '',
				nextLevel: '',
			}
		},
		onLoad() {
			this.load()
		},
		computed: {
			subPointText(){
				if(this.nextLevel && this.currentLevel){
					let subPoint = this.nextLevel - this.memberInfo.memberPoints;
					return `距离下一个等级还需要${subPoint}积分值`
				}else{
					return "当前等级为最高等级"
				}
				
			}
		},
		methods:{
			initMemberList(list,points){
				let memberList = []
				let length = list.length
				let selectIndex = -1;
				let nextIndex = -1;
				for(let i=0;i<list.length; i++){
					if(list[i].lowestScore <= points){
						selectIndex = i;
					}else{
						nextIndex = i;
						break;
					}
				}
				if(selectIndex >= 0){
					this.currentLevel = list[selectIndex]
				}
				if(nextIndex >= 0){
					this.nextLevel = list[nextIndex];
				}
			},
			tapGoPointsDetail(){
				this.$u.route('/pages/mine/points-detail/points-detail')
			},
			calcPercent(a,b){
				return parseInt(a*100/b)
			},
			load(){
				this.getMemberInfo()
			},
			async getMemberLevelList(){
				let {code,data} = await this.$u.api.getMemberLevelListApi({})
				if(code==0) {
					let {list} = data
					console.log(list)
					this.originalMemberList = list
					if(this.memberInfo) {
						this.initMemberList(list,this.memberInfo.memberPoints)
					}
				}
			},
			async getMemberInfo(){
				let {code,data} = await this.$u.api.getMemberInfoApi({})
				if(code==0) {
					console.log(data)
					this.memberInfo = data
					this.getMemberLevelList();
					// if(this.memberList.length>0) {
					// 	this.initMemberList(this.originalMemberList,data.memberPoints)
					// }
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.container {
		.member-medal {
			padding: 0 20rpx;
			line-height: 36rpx;
			height: 36rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 18rpx;
			margin-right: 20rpx;
			background: linear-gradient(148deg, #7341B9 0%, #333EC2 100%);
		
			&>image {
				height: 16rpx;
				width: 18rpx;
			}
		
			&>text {
				font-size: 20rpx;
				color: #FFFFFF;
				font-weight: bold;
				height: 30rpx;
				line-height: 36rpx;
			}
		}
		.header-box {
			padding-bottom: 30rpx;
		}
		.member-box {
			display: flex;
			width: 100%;
			height: 100rpx;
			margin-bottom: 45rpx;
			padding: 0 30rpx;
			.member-box-img {
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
				}
			}
			

			.member-info {
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 100%;
				padding-left: 35rpx;

				.member-info-text {
					display: flex;
					justify-content: space-between;
					padding-bottom: 8rpx;

					text {
						font-size: 38rpx;
						color: #FFFFFF;
					}

					.member-info-right {
						display: flex;
						justify-content: center;
						align-items: center;

						text {
							font-size: 24rpx;
							color: #B4B2CF;
							padding-right: 15rpx;
						}

						image {
							width: 11rpx;
							height: 20rpx;
						}
					}
				}

				.member-info-icon {
					display: flex;
					.member-credit {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 36rpx;
						background: linear-gradient(306deg, #4997ff 5%, #006dff 88%);
						border-radius: 21rpx;
						font-size: 20rpx;
						color: #FFFFFF;
						box-sizing: border-box;
						padding: 0 10rpx;
						&>image {
							width: 20rpx;
							height: 20rpx;
							padding: 0 2rpx;
						}
					}
				}
			}
		}
		.single-member-wrap {
			padding: 0 20rpx;
			.swiper-item {
				height: 320rpx;
				display: flex;
				.member-level {
					width: 100%;
					height: 100%;
					border-radius: 25rpx;
					background-size: 100% 100%;
					@include height-center();
					padding: 0rpx 30rpx;
					background-image: url('/static/imgs/mine/member_right_icon.png');
					position: relative;
					.current_level_point{
						position: absolute;
						top: 24rpx;
						right: 30rpx;
						z-index: 10;
						line-height: 40rpx;
						color: #4A4E61;
						font-size: 22rpx;
					}
					.member-level-info {
						flex: 1;
						min-width: 0;
						display: flex;
						flex-direction: column;
						color: #FFFFFF;
						height: 100%;
						.member-name-text{
							height: 36rpx;
							font-size: 24rpx;
							margin-top: 30rpx;
							display: flex;
							align-items: center;
						}
					}
					.badge-icon {
						padding-left: 30rpx;
						image {
							width: 150rpx;
							height: 180rpx;
						}
					}
				}
				
			}
			
		}
		
		.member-rule {
			display: flex;
			flex-direction: column;
			padding: 0 30rpx;
			margin-top: 30rpx;
			font-size: 28rpx;
			color: #FFFFFF;

		}
	}
</style>
