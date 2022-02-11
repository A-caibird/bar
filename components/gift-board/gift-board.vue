<template>
	<mescroll-uni :ref="'mescrollRef'+i" :canShowTop="false" :fixed="true" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<view class="page_box">
			<view class="top_rank">
				<view class="list_classify">
					<block v-for="(info, index) in giftFilter.gift.array" :key="index">
						<view class="list_classify_item" @tap="giftFilterHandle(index)" :class="{ selectStatus: giftFilter.gift.selectIndex == index }">
							<text>{{ info.name }}</text>
							<view class="selected" v-if="giftFilter.gift.selectIndex == index"></view>
						</view>
					</block>
				</view>
				<view class="award_intro" v-if="giftFilter.gift.selectIndex == 0 && resultInfo.award.introduce">
					<text>{{resultInfo.award.introduce}}</text>
				</view>
				<view class="time_classify" v-if="resultInfo.award">
					<block>
						<view class="time_classify_item selectStatus">
							<text>{{typeName}}</text>
						</view>
					</block>
				</view>
				<!-- <view class="time_classify">
					<block v-for="(info, index) in giftFilter.time.array" :key="index">
						<view class="time_classify_item" @tap="timeFilterHandle(index)" :class="{ selectStatus: giftFilter.time.selectIndex == index }">
							<text>{{ info.name }}</text>
						</view>
					</block>
				</view> -->
				<view class="rank_location_box">
					<view v-if="pageList.length >= 2" class="location_item">
						<view class="common_rank" @tap="dynamicTap(pageList[1].id)">
							<view class="member_icon">
								<image :src="pageList[1].avatar"></image>
								<view class="rank_text"><text>2</text></view>
							</view>
							<view class="member_name">{{ pageList[1].nickName }}</view>
							<view class="member_num">{{ pageList[1].data }}</view>
						</view>
					</view>
					<view v-if="pageList.length >= 1" class="location_item first">
						<view class="common_rank" @tap="dynamicTap(pageList[0].id)">
							<view class="member_icon">
								<image :src="pageList[0].avatar"></image>
								<view class="rank_text"><text>1</text></view>
								<image class="champion_icon" src="/static/imgs/discovery/champion_icon.png"></image>
							</view>
							<view class="member_name">{{ pageList[0].nickName }}</view>
							<view class="member_num">{{ pageList[0].data }}</view>
						</view>
					</view>
					<view v-if="pageList.length >= 3" class="location_item">
						<view class="common_rank" @tap="dynamicTap(pageList[2].id)">
							<view class="member_icon">
								<image :src="pageList[2].avatar"></image>
								<view class="rank_text"><text>3</text></view>
							</view>
							<view class="member_name">{{ pageList[2].nickName }}</view>
							<view class="member_num">{{ pageList[2].data }}</view>
						</view>
					</view>
				</view>
			</view>
			
			
			<view class="other_rank">
				<view class="rank_box">
					<block v-for="(info, index) in pageList" :key="index">
						<view class="rank_line" v-if="!(index==0||index==1||index==2)" @tap="dynamicTap(info.id)">
							<view class="line_left">
								<view class="rank_num">
									<text>{{ index + 1 }}</text>
								</view>
								<view class="rank_person">
									<image :src="info.avatar"></image>
									<text>{{ info.nickName }}</text>
								</view>
							</view>
							<view class="line_right">
								<view class="label_content">
									<text>
										{{giftFilter.gift.valArray[giftFilter.gift.selectIndex].name}}：
										<text style="color: #FFFF00;">{{ info.data }}</text>
									</text>
								</view>
							</view>
						</view>
					</block>
				</view>
			</view>
	
		
		
		</view>
						
	</mescroll-uni>
	
</template>

<script>
	var app = getApp();
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	
	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'
	
	export default{
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components:{
			MescrollUni,
		},
		props:{
			
		},
		data(){
			return {
				downOption:{
					auto:false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					
				},
				
				url:'/api/user/leaderBoard',
				params:{
					type: 'week', //默认为周榜，月榜month
					isCharm: true //魅力榜（true/null） 土豪榜（false）
				},
				
				giftFilter: {
					gift: {
						array: [
							{
								value: '',
								name: '魅力榜'
							},
							{
								value: '',
								name: '土豪榜'
							}
						],
						valArray: [
							{
								value: '',
								name: '魅力值'
							},
							{
								value: '',
								name: '豪气值'
							}
						],
						
						selectIndex: 0
					},
					time: {
						array: [
							{
								value: '',
								name: '周榜'
							},
							{
								value: '',
								name: '月榜'
							}
						],
						selectIndex: 0
					}
				},
				resultInfo:{
					award:{}
				}
				
			}
		},
		computed:{
			typeName(){
				let type = this.resultInfo.award.type;
				if(type == 'day'){
					return '日榜'
				}else{
					return '周榜'
				}
			}
		},
		methods:{
			toTopClick(){
				let mescrollRef = 'mescrollRef' + this.i;
				return this.$refs[mescrollRef] ? this.$refs[mescrollRef].toTopClick() : "" 
			},
			// 动态点击
			dynamicTap(id){
				let isMy = false;
				if(id == getApp().globalData.userInfo.userId){
					isMy = true;
				}
				if(isMy) {
					uni.navigateTo({
						url:'/pages/mine/dynamic/personalDynamic'
					})
				} else {
					uni.navigateTo({
						url:'/pages/mine/dynamic/myDynamic' + `?id=${id}`
					})
				}
			},
			// 周，年选择
			async timeFilterHandle(index) {
				this.giftFilter.time.selectIndex = index;
				if (index == 0) {
					this.giftFilter.time.array.value = 'week';
				} else {
					this.giftFilter.time.array.value = 'month';
				}
				this.params.type = this.giftFilter.time.array.value
				this.params.isCharm = this.giftFilter.gift.array.value
				this.mescroll.resetUpScroll()
			},
			// 魅力,土豪选择
			async giftFilterHandle(index) {
				this.giftFilter.gift.selectIndex = index;
				if (index == 0) {
					this.giftFilter.gift.array.value = true; 
				} else {
					this.giftFilter.gift.array.value = false;
				}
				this.params.type = this.giftFilter.time.array.value
				this.params.isCharm = this.giftFilter.gift.array.value
				this.mescroll.resetUpScroll()
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	$topRankImg: '/static/imgs/discovery/top_rank_backImg.png';
	$otherRankImg: '/static/imgs/discovery/other_rank_backImg.png';
	.page_box {
		.top_rank {
			width: 100%;
			height: 782rpx;
			position: relative;
			z-index: 5;
			position: relative;
			background-image: url($topRankImg);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			background-origin: content-box;
			.award_intro{
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				line-height: 40rpx;
				font-size: 26rpx;
				color: #FFFFFF;
				margin-bottom: 10rpx;
			}
			.list_classify {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100rpx;
	
				.list_classify_item {
					font-size: 30rpx;
					color: #b7b9d6;
					display: flex;
					align-items: center;
					flex-direction: column;
					justify-content: center;
	
					&:last-child {
						margin-left: 90rpx;
					}
	
					&.selectStatus {
						color: #ffffff;
						font-weight: 500;
						font-size: 34rpx;
					}
	
					.selected {
						width: 34rpx;
						height: 4rpx;
						background: #ff59c9;
						border-radius: 2rpx;
					}
				}
			}
	
			.time_classify {
				width: 130rpx;
				margin-left: calc(50% - 75rpx);
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #ffffff;
				border-radius: 6rpx;
	
				.time_classify_item {
					width: 130rpx;
					text-align: center;
					line-height: 50rpx;
					color: #ffffff;
					font-size: 26rpx;
	
					&.selectStatus {
						background: #ffffff;
						font-size: 28rpx;
						color: #191c3f;
						font-weight: 500;
					}
				}
			}
	
			.rank_location_box {
				width: 100%;
				height: 200rpx;
				margin-top: 80rpx;
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
	
				.location_item {
					display: flex;
					align-items: center;
					flex-direction: column;
	
					.common_rank {
						.member_icon {
							height: 110rpx;
							width: 110rpx;
							box-sizing: border-box;
							border: 4rpx solid #ffffff;
							border-radius: 50%;
							position: relative;
							z-index: 10;
	
							& > image {
								height: 100%;
								width: 100%;
								border-radius: 50%;
							}
	
							.rank_text {
								height: 30rpx;
								width: 30rpx;
								box-sizing: border-box;
								border: 4rpx solid #ffffff;
								border-radius: 50%;
								line-height: 24rpx;
								text-align: center;
								position: absolute;
								left: calc(50% - 16rpx);
								bottom: -14rpx;
								background: #f0ad4e;
								color: #ffffff;
								font-size: 20rpx;
							}
						}
	
						.member_name {
							text-align: center;
							font-size: 28rpx;
							color: #ffffff;
							line-height: 40rpx;
							width: 110rpx;
							margin-top: 10rpx;
							@include simpleOmit;
						}
	
						.member_num {
							color: #ffffff;
							font-size: 30rpx;
							// line-height: 40rpx;
							text-align: center;
							font-weight: 500;
							width: 110rpx;
							@include simpleOmit;
						}
					}
	
					&:nth-child(2) {
						margin: 0 70rpx;
						position: relative;
						top: -30rpx;
	
						.member_icon {
							height: 120rpx;
							width: 120rpx;
							z-index: 10;
	
							.rank_text {
								height: 40rpx;
								width: 40rpx;
								line-height: 34rpx;
								left: calc(50% - 20rpx);
								bottom: -20rpx;
							}
	
							.champion_icon {
								height: 64rpx;
								width: 64rpx;
								position: absolute;
								top: -24rpx;
								right: -24rpx;
								background: transparent;
								z-index: -1;
							}
						}
					}
				}
			}
		}
	
		.other_rank {
			width: 100%;
			position: relative;
			top: -100rpx;
			z-index: 10;
			background-image: url($otherRankImg);
			background-repeat: no-repeat;
			background-size: 100% 132rpx;
			background-origin: content-box;
	
			.rank_box {
				padding-top: 60rpx;
				box-sizing: border-box;
	
				.rank_line {
					height: 120rpx;
					width: 100%;
					padding: 0 30rpx;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #242853;
	
					.line_left {
						display: flex;
						align-items: center;
	
						.rank_num {
							font-size: 30rpx;
							color: #ffffff;
						}
	
						.rank_person {
							display: flex;
							align-items: center;
							margin-left: 40rpx;
	
							& > image {
								height: 74rpx;
								width: 74rpx;
								border-radius: 50%;
							}
	
							& > text {
								font-size: 28rpx;
								color: #ffffff;
								margin-left: 20rpx;
							}
						}
					}
	
					.line_right {
						font-size: 28rpx;
						color: #ffffff;
					}
				}
			}
		}
	}
</style>

