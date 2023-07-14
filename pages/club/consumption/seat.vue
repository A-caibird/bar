<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#16192B'
			}" :title="clubName" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<view class="select_day_box">
				<scroll-view scroll-x class="scroll_box">
					<block v-for="(item, index) in weekList" :key="index">
						<view class="common_day" @tap="switchDateSelectIndex(index)">
							<view class="day_panel" :class="{select:dateSelectIndex==index}">
								<view class="week_text"> <text>{{getWeekStr(getWeekDate(index))}}</text> </view>
								<view class="day_text">{{$u.timeFormat(item,'mm-dd')}}</view>
								<image src="/static/imgs/common/select_icon_pink.png" class="select_icon" v-if="dateSelectIndex==index" />
							</view>
						</view>
					</block>
				</scroll-view>
			</view>
			<view class="seat-select">
				<view class="seat_box">
					<view class="select_box">
						<seat  ref="seat"  :date="$u.timeFormat(this.weekList[this.dateSelectIndex],'yyyy-mm-dd')" :boxWidth="boxWidth" :singleSelect="true" @select="seat=$event" @unselect="seat={}" @refresh="handleRefreshSeat"></seat>
					</view>
					<view class="tips_box">
						<view class="seat_tips">
							<image src="/static/imgs/seat/seat-unselected.png"></image>
							<text>未开放</text>
						</view>
						<view class="seat_tips">
							<image src="/static/imgs/seat/seat-bought.png"></image>
							<text>可预订</text>
						</view>
						<view class="seat_tips">
							<image src="/static/imgs/seat/seat-selected.png"></image>
							<text>已预订</text>
						</view>
						<view class="seat_tips">
							<image src="/static/imgs/seat/seat-selecting.png"></image>
							<text>预定中</text>
						</view>
					</view>
				</view>
				
				<view class="seat_detail">
					<view class="seat_label">
						<view class="line"></view>
						<view class="label_text"> 台位详情 </view>
					</view>
					<view class="seat_info">
						<view class="seat_info_label">
							<text class="left">{{canSubmit?seat.sn:'未选定'}}卡台</text>
							<text class="right">可预约时间：{{`${startDate}~${endDate}`}}</text>
						</view>
						<view class="seat_info_item">
							<text class="tips1">最低消费：</text>
							<text class="tips2" :class="{active:canSubmit}">{{canSubmit?seat.count+'元':'未选定'}}</text>
						</view>
						<view class="seat_info_item">
							<text class="tips1">容纳人数：</text>
							<text class="tips2" :class="{active:canSubmit}">{{canSubmit?seat.num+'人':'未选定'}}</text>
						</view>
						<!-- <view class="seat_info_item">
							<text class="tips1">保留时间：</text>
							<text class="tips2 active">21:30</text>
						</view> -->
					</view>
				</view>
				
						
			</view>
			
		</view>
		<view style="height: 120rpx;"></view>
		<view class="footer_box">
			<view class="price_text">
				<text>{{canSubmit?seat.count+'元':''}}</text>
			</view>
			<!-- <view class="common_item" style="position: absolute;right:  330rpx;">
				<image src="/static/imgs/common/kefu.png"></image>
				<text>客服</text>
			</view> -->
			<view class="btn_text" :class="{active:canSubmit}" @tap="$u.throttle(tapGoDrinks)">
				<!-- <image></image> -->
				<text>确认座位</text>
			</view>
		</view>
		<pop-common
			title="提示"
			content="当前有未使用的存酒,是否使用"
			confirmText="使用"
			cancelText="继续下单"
			v-if="popShow"
			@cancel="popCancelTap"
			@confirm="popConfirmTap"
			@maskTap="popShow = false"
		></pop-common>
	</view>
</template>

<script>
	import {
		seatData
	} from '@/common/seat-data.js'
	import popCommon from '@/components/commonPop/pop.vue'
	export default {
		data(){
			return {
				popShow: false,
				dateSelectIndex: 0,
				cardTableList:[],
				clubTable:{
					table_width:0,
					table_height:0,
					top:0,
					left:0,
				},
				
				//传递的参数
				clubId:-1,
				clubName:'',
				orderType:'',
				clubSubTitle: '',
				chatTag: false,
				seat:{},
				chatFriendInfo:"",
				boxWidth:325,
				
				startDate:'00:01',
				endDate:'23:59',
			}
		},
		computed:{
			weekList(){
				return this.getTWeekList()
			},
			canSubmit(){
				return this.seat.type==1
			},
		},
		components:{
			popCommon
		},
		onLoad(opt) {
			let vm = this
			this.chatFriendInfo = opt.chatFriendInfo
			this.chatTag = opt.chatTag 
			this.clubId = opt.clubId
			this.clubName = opt.clubName
			this.orderType = opt.orderType
			this.clubSubTitle = opt.clubSubTitle
			this.load()
			
			uni.$on('refresh-seat',this.handleRefreshSeat)
		},
		onUnload() {
			uni.$off('refresh-seat',this.handleRefreshSeat)
		},
		methods:{
			async popCancelTap(){
				this.goDrinkSelect();
				this.popShow = false;
			},
			popConfirmTap(){
				let data = {
					chatTag: this.chatTag,
					chatFriendInfo: this.chatFriendInfo,
					seat:this.seat,
					clubId:this.clubId,
					clubName:this.clubName,
					orderType: this.orderType,
					clubSubTitle: this.clubSubTitle,
					date: this.$u.timeFormat(this.weekList[this.dateSelectIndex],'yyyy-mm-dd')
				}
				this.$u.route('pages/club/consumption/wineCellar/wineCellar',{
					data:JSON.stringify(data)
				})
				this.popShow = false;
			},
			async getCanOrderTime(){
				let {code,data} = await this.$u.api.getCanOrderTimeApi({
					id:this.clubId,
				})
				if(code==0) {
					let {time} = data
					this.startDate = time.startDate
					this.endDate = time.endDate
				}
			},
			init(){
				this.seat = {}
				this.cardTableList=[],
				this.clubTable = {
					table_width:0,
					table_height:0,
					top:0,
					left:0,
				}
			},
			handleRefreshSeat(){
				this.init()
				this.load()
			},
			async tapGoDrinks(){
				if(!this.canSubmit) return
				uni.showLoading({
					title: '加载中'
				})
				let {code} = await this.$u.api.extendCardTableSelectTimeApi({selectId:this.seat.selectId})
				if(code!=0) {
					return this.handleRefreshSeat()
				}
				let selectDate = this.$u.timeFormat(this.weekList[this.dateSelectIndex],'yyyy-mm-dd');
				let res = await this.$u.api.checkUnusedDrinksAPI({
					cardTableId: this.seat.id,
					date: selectDate,
					isInvite: this.orderType == 'book' ? true : false
				})
				uni.hideLoading();
				let hasOrder = res.data.hasOrder;
				if(hasOrder){
					this.popShow = true;
				}else{
					this.goDrinkSelect();
				}
			},
			async goDrinkSelect(){
				if(this.orderType == "fight"){
					let {
						creditScore
					} = await this.judgeVerify();
					if (creditScore) {
						this.$u.toast('当前信用分较低，无法拼享');
						return
					}
				}
				let data = {
					chatTag: this.chatTag,
					chatFriendInfo: this.chatFriendInfo,
					seat:this.seat,
					clubId:this.clubId,
					clubName:this.clubName,
					orderType: this.orderType,
					clubSubTitle: this.clubSubTitle,
					date: this.$u.timeFormat(this.weekList[this.dateSelectIndex],'yyyy-mm-dd')
				}
				this.$u.route('pages/club/consumption/drinks',{
					data:JSON.stringify(data)
				})
			},
			async load(){
				let sInfo = await uni.getSystemInfoSync()
				this.boxWidth = sInfo.screenWidth - 50
				this.getCardTableList()
				this.getCanOrderTime()
			},
			switchDateSelectIndex(index){
				this.dateSelectIndex = index
				this.seat = {}
				this.getCardTableList()
			},
			async getCardTableList(){
				
				let {code,data} = await this.$u.api.getCardTableList({
					clubId: this.clubId,
					date: this.$u.timeFormat(this.weekList[this.dateSelectIndex],'yyyy-mm-dd')
				})
				if(code==0) {
					this.cardTableList = data.cardTableList
					this.clubTable = data.clubTable
					this.$nextTick(function(){
						this.$refs.seat.initData(this.clubTable.table_height,this.clubTable.table_width,this.cardTableList,this.clubTable)
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		.middle_box{
			width: 100%;
			.select_day_box{
				width: 100%;
				padding: 30rpx 0rpx;
				.scroll_box{
					height: 110rpx;
					width: 100%;
					padding-left: 30rpx;
					box-sizing: border-box;
					overflow: hidden;
					white-space: nowrap;
					.common_day{
						height: 100rpx;
						width: 100rpx;
						display: inline-block;
					
						margin-right: 30rpx;
						.day_panel{
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							border: 1px solid #A8A8CE;
							border-radius: 2rpx;
							color: #9292BA;
							height: 100%;
							width: 100%;
							position: relative;
							&.select{
								color: #FFFFFF;
								background-color: #2C3158;
								border: none;
							}
							.week_text{
								font-size: 30rpx;
							}
							.day_text{			
								font-size: 28rpx;
							}
							.select_icon{
								position: absolute;
								top: 0rpx;
								right: 0rpx;
								width: 30rpx;
								height: 30rpx;
							}
						}				
					}
				}
			}
			.seat-select {
				padding: 15px;
				.seat_box{
					background: #20234B;
					.select_box {
						padding: 10px;
					}
					.tips_box{
						width: 100%;
						display: flex;
						align-items: center;
						padding: 0 20rpx 20rpx;
						box-sizing: border-box;
						justify-content: space-between;
						.seat_tips{
							display: flex;
							align-items: center;
							&>image{
								height: 24rpx;
								width: 24rpx;
							}
							&>text{
								font-size: 22rpx;
								color: #FFFFFF;
								margin-left: 12rpx;
							}
						}
					}
				}
				
			}
			
			.seat_detail{
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				padding: 20rpx 0rpx;
				.seat_label{
					height: 100rpx;
					width: 100%;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #31345B;
					.line{
						height: 26rpx;
						width: 6rpx;
						background: #FF59C9;
					}
					.label_text{
						font-size: 30rpx;
						color: #FFFFFF;
						margin-left: 16rpx;
					}
				}
				.seat_info{
					width: 100%;
					.seat_info_label{
						height: 70rpx;
						@include height-center();
						.left {
							flex: 1;
							min-width: 0;
							color: #FFFFFF;
							font-size: 28rpx;
						}
						.right {
							color: #FFFFFF;
							font-size: 28rpx;
						}
					}
					.seat_info_item{
						display: flex;
						align-items: center;
						line-height: 40rpx;
						.tips1{
							font-size: 26rpx;
							color: #9292BA;
						}
						.tips2{
							font-size: 26rpx;
							color: #B294FE;
							&.active{
								color: #FFFFFF;
							}
						}
					}
				}
			}
		}
		.footer_box{
			position: fixed;
			bottom: 0rpx;
			left: 0rpx;
			z-index: 100;
			
			height: 120rpx;
			width: 100%;
			display: flex;
			align-items: center;
			background: $uni-title-color;
			border-top: 1px solid #31345B;
			.price_text{
				font-size: 34rpx;
				color: #FFFFFF;
				margin-left: 30rpx;
			}
			.common_item{
				height: 100%;
				width: 100rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				&>image{
					height: 32rpx;
					width: 32rpx;
				}
				&>text{
					font-size: 22rpx;
					color: #FFFFFF;
					margin-top: 10rpx;
				}
			}
			.btn_text{
				height: 80rpx;
				width: 300rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #FFFFFF;
				border-radius: 48rpx;
				position: absolute;
				right: 30rpx;
				background: #82799B;
				&.active{
					background: $uni-button-color;
				}
				&>image{
					height: 30rpx;
					width: 30rpx;
					background: #FFFFFF;
					margin-right: 14rpx;
				}
			}
		}
	}
</style>
