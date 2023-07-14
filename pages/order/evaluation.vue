<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="我要评价" title-size="36" title-color="#FFFFFF" :background="{
						'background': '#16192B'
					}" :border-bottom="false">
			</u-navbar>
		</view>
		<view class="middle_box">
			<view class="club_info">
				<view class="club_img" v-if="info.bannerList.length > 1"> 
					<u-swiper :list="info.bannerList" height="350" bgColor="#16192B" @click="$u.throttle(previewImgList(info.bannerList,$event,key=''))"></u-swiper>
				</view>
				<view class="club_img" v-if="info.bannerList.length == 1">
					<image :src="info.bannerList[0]"  mode="aspectFill" @click="$u.throttle(previewImg(info.bannerList[0]))"></image>
				</view>
				<view class="info_box">
					<view class="first_line">
						<view class="line_left">
							<view class="club_name"> <text>{{info.name}}</text> </view>
							<view class="club_intro"> <text>{{info.subtitle}}</text> </view>
						</view>
					</view>
					<!-- <view class="info_eva">
						<view class="rate_box">
							<selfRate :score="info.avgScore" size="24"></selfRate>
						</view>
						<text>{{info.avgScore}} 评分</text>
					</view>
					<view class="info_open_time">
						<text>营业时间</text>
						<view class="line"></view>
						<text>{{info.businessHours?info.businessHours:'暂未填写'}}</text>
					</view>
					<view class="info_label">
						<block v-for="(item, index) in info.labelList" :key="index">
							<view class="common_label"> <text>{{item}}</text> </view>
						</block>
					</view> -->
				</view>
				<u-gap height="20" bgColor="#20234B"></u-gap>
			</view>
			<view class="textarea_box" v-if="canTextComment">
				<textarea v-model="data.content" placeholder="请输入您要评价的内容" placeholder-class="placeholder"></textarea>
			</view>
			<view class="eva_form">
				<view class="label_line">
					<text>您对酒吧还满意么</text>
					<view class="eva_box" @tap="data.hasAnonymous=!data.hasAnonymous">
						<image src="/static/imgs/common/select.png" v-if="data.hasAnonymous"></image>
						<image src="/static/imgs/common/no-select.png" v-else></image>
						<text>匿名评价</text>
					</view>
				</view>
				<view class="eva_score_item">
					<view class="label"> <text>服务</text> </view>
					<view class="score_com">
						<u-rate v-model="data.serviceScore" size="32" inactive-icon="star-fill" active-icon="star-fill" active-color="#F72EB2" inactive-color="#9597B6"></u-rate>
					</view>
				</view>
				<view class="eva_score_item">
					<view class="label"> <text>环境</text> </view>
					<view class="score_com">
						<u-rate v-model="data.surroundingsScore" size="32" inactive-icon="star-fill" active-icon="star-fill" active-color="#F72EB2" inactive-color="#9597B6"></u-rate>
					</view>
				</view>
				<view class="eva_score_item">
					<view class="label"> <text>曲风</text> </view>
					<view class="score_com">
						<u-rate v-model="data.genreScore" size="32" inactive-icon="star-fill" active-icon="star-fill" active-color="#F72EB2" inactive-color="#9597B6"></u-rate>
					</view>
				</view>
				<view class="eva_score_item">
					<view class="label"> <text>快乐</text> </view>
					<view class="score_com">
						<u-rate v-model="data.happyScore" size="32" inactive-icon="star-fill" active-icon="star-fill" active-color="#F72EB2" inactive-color="#9597B6"></u-rate>
					</view>
				</view>
				<view class="eva_score_item">
					<view class="label"> <text>氛围</text> </view>
					<view class="score_com">
						<u-rate v-model="data.atmosphereScore" size="32" inactive-icon="star-fill" active-icon="star-fill" active-color="#F72EB2" inactive-color="#9597B6"></u-rate>
					</view>
				</view>
				
			</view>
		</view>
		<view class="footer_box">
			<view class="footer_btn" @tap="tapSure"><text>提交</text></view>
		</view>
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	export default{
		components:{
			selfRate
		},
		data() {
			return {
				orderId:-1,
				
				
				
				canTextComment:false,
				info:{
					bannerList:[]
				},
				data:{
					orderId:-1,
					content:'',
					serviceScore:5,
					atmosphereScore:5,
					surroundingsScore:5,
					genreScore:5,
					happyScore:5,
					hasAnonymous:false,
				},
			}
		},
		onLoad(opt) {
			console.log(opt)
			this.orderId = opt.orderId
			this.data.orderId = opt.orderId
			this.load()
		},
		methods:{
			async tapSure(){
				console.log(this.data)
				if(this.data.serviceScore==0) return this.$toast.text('请为酒吧的服务打分！')
				if(this.data.surroundingsScore==0) return this.$toast.text('请为酒吧的环境打分！')
				if(this.data.genreScore==0) return this.$toast.text('请为酒吧的曲风打分！')
				if(this.data.happyScore==0) return this.$toast.text('请为酒吧的快乐打分！')
				if(this.data.atmosphereScore==0) return this.$toast.text('请为酒吧的氛围打分！')
				await this.$toast.confirm('','确定要提交评价吗？')
				this.commentOrder()
			},
			async commentOrder(){
				await this.$u.api.commentOrderApi(this.data)
				uni.$emit('yao-order-detail-refresh')
				uni.$emit('ping-order-detail-refresh')
				uni.$emit('order-list-refresh')
				this.$toast.text('评价成功！')
				this.$u.route({type:'back'})
			},
			load(){
				this.getEvalutaion()
			},
			async getEvalutaion(){
				let {code,data} = await this.$u.api.getEvalutaionApi({
					orderId:this.orderId
				})
				if(code==0) {
					console.log(data)
					this.canTextComment = data.canTextComment
					this.info = data.info
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		min-height: 100%;
	}
	.container{
		min-height: 100%;
		display: flex;
		flex-direction: column;
	}
	.middle_box{
		flex: 1;
		min-width: 0;
		min-height: 0;
	
		.club_info {
			width: 100%;
		
			.club_img {
				width: 100%;
				height: 350rpx;
				background: #16192B;
				image{
					width: 100%;
					height: 100%;
				}
			}
		
			.info_box {
				width: 100%;
				box-sizing: border-box;
				padding: 30rpx;
		
				.first_line {
					display: flex;
					align-items: center;
					justify-content: space-between;
		
					.line_left {
						.club_name {
							font-size: 40rpx;
							color: #FFFFFF;
							font-weight: 500;
						}
		
						.club_intro {
							font-size: 28rpx;
							color: #FFFFFF;
							line-height: 40rpx;
						}
					}
		
				}
		
				.info_eva {
					height: 80rpx;
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
					flex-wrap: wrap;
					align-items: center;
					margin: 16rpx 0rpx;
				
					.common_label {
						border-radius: 2rpx;
						padding: 0 14rpx;
						border: 1px solid #565B86;
						color: #B3BAEF;
						font-size: 20rpx;
						margin-right: 10rpx;
						margin-top: 10rpx;
					}
				}
			}		
		}
		.textarea_box{
			height: 250rpx;
			width: 100%;
			padding: 30rpx;
			// border-bottom: 2rpx solid #16192B;
			&>textarea{
				width: 100%;
				height: 100%;
				font-size: 28rpx;
				color: #FFFFFF;
			}
		}
		.eva_form{
			
			box-sizing: border-box;
			padding: 30rpx;
			.label_line{
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				&>text{
					font-size: 32rpx;
					color: #FFFFFF;
					font-weight: 500;
				}
				.eva_box{
					display: flex;
					align-items: center;
					&>image{
						height: 30rpx;
						width: 30rpx;
					}
					&>text{
						font-synthesis: 26rpx;
						color: #FFFFFF;
						margin-left: 12rpx;
					}
				}
			}
			.eva_score_item{
				width: 100%;
				display: flex;
				align-items: center;
				margin-top: 30rpx;
				.label{
					font-size: 28rpx;
					color: #FFFFFF;
				}
				.score_com{
					margin-left: 20rpx;
					height: 40rpx;
					flex: 1;
				}
			}
		}
		
	}
	.footer_box{
		// position: fixed;
		// bottom: 0rpx;
		// left: 0rpx;
		height: 120rpx;
		width: 100%;
		border-top: 1px solid #242854;
		display: flex;
		align-items: center;
		.footer_btn{
			flex: 1;
			margin: 0 30rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			text-align: center;
			color: #FFFFFF;
			background: $uni-button-color;
		}
	}
</style>
