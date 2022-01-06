<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" title="岗位详情" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="club_info">
				<view class="club_info_second">
					<view class="info_name"> <text>{{clubInfo.name}}</text> </view>
					<view class="info_intro"> <text>{{clubInfo.subTitle}}</text> </view>
					<view class="info_eva">
						<view class="rate_box">
							<selfRate :score="clubInfo.avgScore" size="24"></selfRate>
						</view>
						<text>{{clubInfo.avgScore}} 评分</text>
					</view>
					<view class="info_loaction">
						<view class="left">
							<view class="loca_intro1"> <text>{{clubInfo.address}}</text> </view>
							<view class="loca_intro2" @tap="tapOpenMap"> <text>{{clubInfo.area}}</text>  <u-icon name="map" size="32"></u-icon></view>
						</view>
						<view class="right">
							<view class="call_box" @tap="callPhone">
								<u-icon size="40" name="phone" color="#FFFFFF"></u-icon>
								<text>电话</text>
							</view>
						</view>
					</view>
				</view>
				<u-gap height="20" bgColor="#20234B"></u-gap>
			</view>
			<view class="recruitment_info">
				<view class="common_line">
					<view class="line_left first">
						<text>{{jobInfo.name}}</text>
					</view>
					<view class="line_right first">
						<text>{{jobInfo.monthlySalary}}</text>
					</view>
				</view>
				<view class="common_line" style="margin-top: 14rpx;">
					<view class="line_right second">
						<text>招聘 {{jobInfo.recruitsNumber}}人</text>
					</view>
					
					<view class="line_left second">
						<text>{{jobInfo.salaryComposition}}</text>
					</view>
					
				</view>
			</view>
			<view class="job_label">
				<view class="label_left">
					<view class="line"></view>
					<text>职位描述</text>
				</view>
			</view>
			<view class="job_descripe">
				<view>
					<u-parse :html="jobInfo.jobDescription"></u-parse>
				</view>
			</view>
			<view class="apply_btn" @tap="goPage('/pages/club/job/apply?id='+id)"> <text>我要应聘</text> </view>
		</view>
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	import loginMixins from '@/mixins/loginConfirm.js'
	export default{
		mixins:[loginMixins],
		components:{
			selfRate
		},
		data() {
			return {
				id: '',
				clubInfo: {},
				jobInfo:{},
			}
		},
		onLoad:function(options){
			console.log(options);
			let id = options.id;
			this.id = id;
			this.getDetail();
		},
		methods:{
			goPage(url){
				this.$nav.navigateTo({
					url,
				})
			},
			tapOpenMap(){
				this.openMap(this.clubInfo.lng, this.clubInfo.lat, this.clubInfo.address)
			},
			getDetail: async function(){
				uni.showLoading({
					title: '记载中'
				})
				let {code,data} = await this.$u.api.getJobDetail(this.id)
				if(code==0) {
					this.clubInfo = data.club;
					this.jobInfo = data.recruitment
					console.log(this.clubInfo)
				}
				uni.hideLoading();
			},
			callPhone: function(){
				if(!this.loginConfirmHandle()){
					return
				}
				uni.makePhoneCall({
					phoneNumber: this.clubInfo.phone
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		padding-bottom: 100rpx;
		box-sizing: border-box;
		.middle_box{
			width: 100%;
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
			
					.info_loaction {
						width: 100%;
						@include height-center();
						justify-content: space-between;
						.left {
							.loca_intro1 {
								font-size: 30rpx;
								color: #FFFFFF;
							}
										
							.loca_intro2 {
								font-size: 26rpx;
								color: #B4B2CF;
								margin-top: 15rpx;
							}
						}
						.right {
							.call_box {
								display: flex;
								align-items: center;
								flex-direction: column;
								padding-right: 30rpx;
										
								&>text {
									font-size: 22rpx;
									color: #FFFFFF;
								}
							}
						}
			
						
					}
				}
			}
			.recruitment_info{
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				padding: 30rpx 0rpx;
				box-sizing: border-box;
				border-bottom: 1px solid #31345B;
				.common_line{
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.line_left{
						&.first{
							font-size: 36rpx;
							color: #FFFFFF;
						}
						&.second{
							font-size: 26rpx;
							color: #A8A8CE;
						}
					}
					.line_right{
						&.first{
							font-size: 30rpx;
							color: #FFFFFF;
						}
						&.second{
							font-size: 26rpx;
							color: #FFFFFF;
						}
					}
				}
			}
			.job_label{
				height: 120rpx;
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				border-bottom: 1px solid #31345B;
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
			}
			.job_descripe{
				width: 100%;
				padding: 30rpx;
				box-sizing: border-box;
				color: #FFFFFF;
			}
			.apply_btn{
				position: fixed;
				bottom: 0rpx;
				z-index: 100;
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 30rpx;
				background: $uni-button-color;
			}
		}
	}
</style>
