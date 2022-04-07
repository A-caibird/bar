<template>
	<view class="container">
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
					
				</view>
				<u-gap height="20" bgColor="#20234B"></u-gap>
			</view>
			<view class="wine_detail">
				<view class="wine_title">
					<view class="line"></view>
					<text class="title_text">存酒数量</text>
				</view>
				<view class="wine_kind">
					<view class="kind_item" v-for="item,index in wineInfo.itemList" :key="index">
						<image :src="item.commodity.cover" mode="aspectFill" @tap="$u.throttle(previewImg(item.commodity.cover))"></image>
						<text class="wine_name">{{item.commodity.name}}</text>
						<view class="remain_num">
							<text class="text">剩余数量:</text>
							<text class="text_num">{{item.surplusNum}}</text>
						</view>
					</view>
				</view>
			</view>
			<u-gap height="20" bgColor="#20234B"></u-gap>
		</view>
		<view class="footer_box">
			<!-- 基本信息 -->
			<view class="basic_info">
				<view class="info_title">
					<view class="info_line"></view>
					<text class="info_text">基本资料</text>
				</view>
				<view class="info_content">
					<view class="info_item">
						<view class="info_item_name">酒吧名称</view>
						<text class="info_item_content">{{clubInfo.name}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">预约时间</view>
						<text class="info_item_content">{{wineInfo.bookDate}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">存酒时间</view>
						<text class="info_item_content">{{wineInfo.saveWineTime}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">到期时间</view>
						<text class="info_item_content">{{wineInfo.endDate}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">台位位置</view>
						<text class="info_item_content">{{wineInfo.cardSn}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">存酒人</view>
						<text class="info_item_content">{{wineInfo.saveWineName}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">接待人</view>
						<text class="info_item_content">{{wineInfo.receptionistName}}</text>
					</view>
					<view class="info_item">
						<view class="info_item_name">备注要求</view>
						<text class="info_item_content">{{wineInfo.demo}}</text>
						<!-- <text class="info_item_content">备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求备注要求</text> -->
					</view>
				</view>
			</view>
			<view class="gap" style="width: 750rpx; padding: 0 30rpx;">
				<u-gap height="1" bgColor="#31345B"></u-gap>
			</view>
			<!-- 订单信息 -->
			<view class="order_info">
				<view class="order_title">
					<view class="order_line"></view>
					<text class="order_text">订单信息</text>
				</view>
				<view class="order_content">
					<view class="order_item">
						<view class="order_item_name">订单编号</view>
						<view class="order_item_content">
							<text class="left">{{wineInfo.sn}}</text>
							<text class="right" @tap="copyClipvoard(wineInfo.sn)">复制</text>
						</view>
					</view>
					<view class="order_item">
						<view class="order_item_name">下单时间</view>
						<view class="order_item_content"><text class="left">{{wineInfo.orderDate}}</text></view>
					</view>
					<view class="order_item">
						<view class="order_item_name">联系人</view>
						<view class="order_item_content"><text class="left">{{wineInfo.linkPerson}}</text></view>
					</view>
					<view class="order_item">
						<view class="order_item_name">联系电话</view>
						<view class="order_item_content"><text class="left">{{wineInfo.linkPhone}}</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import selfRate from '@/components/self-rate/self-rate.vue'
	import bannerList from '@/components/common-banner/common-banner.vue'
	export default {
		components: {
			selfRate,
			bannerList
		},
		data() {
			return {
				clubId:'',
				id:'',
				stickyStatus: false,
				clubInfo:{
					bannerObjList:[],
				},
				navOpacity:0,
				wineInfo:{
					itemList:[],
				},
			}
		},
		onPageScroll: function() {
			let vm = this
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
		onLoad(opt) {
			let {clubId,id} = opt
			this.clubId = clubId
			this.id = id
			this.load()
		},
		methods:{
			load(){
				this.getClubDetail();
				this.getSaveWineView();
			},
			// 获取酒吧详情
			async getClubDetail(){
				let {code,data} = await this.$u.api.getClubDetail(this.clubId)
				if(code==0) {
					console.log(data)
					this.clubInfo = data.info;
				}
			},
			async getSaveWineView(){
				let {code,data} = await this.$u.api.getSaveWineViewApi({id:this.id})
				if(code==0) {
					console.log(data)
					uni.$emit('personal-info-refresh');
					uni.$emit('refreshWineCellList', this.id);
					this.wineInfo = data
					
				}
			},
			
		}
	}
</script>

<style lang="scss" scoped>
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
					background: #191C3F;
					image {
						width: 100%;
						height: 100%;
					}
				}
			
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
						align-items: center;
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
			
			.wine_detail {
				.wine_title {
					display: flex;
					padding: 30rpx;
					align-items: center;

					.line {
						width: 6rpx;
						height: 26rpx;
						background: #ff59c9;
						margin-right: 15rpx;
					}

					.title_text {
						font-size: 30rpx;
						color: #FFFFFF;
					}
				}

				.wine_kind {
					display: flex;
					flex-wrap: wrap;
					width: 100%;
					padding: 0 30rpx;

					.kind_item {
						display: flex;
						flex-direction: column;
						color: #FFFFFF;
						padding-bottom: 40rpx;

						&:nth-child(2n) {
							padding-left: 18rpx;
						}

						image {
							width: 336rpx;
							height: 250rpx;
						}

						.wine_name {
							font-size: 30rpx;
							padding: 10rpx 0;
						}

						.remain_num {
							.text {
								color: #9292BA;
								font-size: 26rpx;
								padding-right: 8rpx;
							}

							.text_num {
								font-size: 26rpx;
							}
						}
					}
				}

			}
		}

		.footer_box {
			.basic_info {
				padding-bottom: 10rpx;

				.info_title {
					display: flex;
					padding: 30rpx;
					align-items: center;

					.info_line {
						width: 6rpx;
						height: 26rpx;
						background: #ff59c9;
						margin-right: 15rpx;
					}

					.info_text {
						font-size: 30rpx;
						color: #FFFFFF;
					}
				}

				.info_content {
					display: flex;
					flex-direction: column;
					padding: 0 30rpx;

					.info_item {
						display: flex;
						padding-bottom: 15rpx;

						.info_item_name {
							width: 170rpx;
							font-size: 26rpx;
							color: #9292BA;
						}

						.info_item_content {
							flex: 1;
							min-width: 0;
							font-size: 26rpx;
							color: #FFFFFF;
						}
					}
				}
			}

			.order_info {
				padding-bottom: 10rpx;

				.order_title {
					display: flex;
					padding: 30rpx;
					align-items: center;

					.order_line {
						width: 6rpx;
						height: 26rpx;
						background: #ff59c9;
						margin-right: 15rpx;
					}

					.order_text {
						font-size: 30rpx;
						color: #FFFFFF;
					}
				}

				.order_content {
					position: relative;
					display: flex;
					flex-direction: column;
					padding: 0 30rpx;
					
					.order_item {
						display: flex;
						padding-bottom: 15rpx;
						.order_item_name {
							width: 170rpx;
							font-size: 26rpx;
							color: #9292BA;
						}

						.order_item_content {
							flex: 1;
							min-width: 0;
							@include height-center();
							justify-content: space-between;
							.left {
								font-size: 26rpx;
								color: #FFFFFF;
							}
							.right {
								font-size:22rpx;
								color: #FFFFFF;
							}
							
						}
					}
				}
			}
		}
	}
</style>
