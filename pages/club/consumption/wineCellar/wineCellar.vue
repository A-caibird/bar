<template>
	<view class="container">
		<view class="header_box">
			<u-navbar :border-bottom="false" :is-fixed="true" :background="{
				'background': '#191C3F'
			}" :title="`选择订单`"
			 title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		</view>
		<view class="middle_box">
			<mescroll-uni :ref="'mescrollRef'+i" :fixed="false" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption"
			 @up="upCallback">
			 <view style="padding: 30rpx 0rpx; position: relative;">
				 <block v-for="(info, index) in pageList" :key="index">
					 <view style="margin-bottom: 20rpx;">
						 <wineCellarItem :isSelect="selectIndex==index" :info="info" @selectOrder="selectOrder"></wineCellarItem>
					 </view>
				 </block>
				 <view class="btn" @tap="$u.throttle(tapSubmit)" :class="{'active': selectIndex!=-1}" type="default">确认</view>
			 </view>
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	//混入
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";

	//组件
	import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue'

	import wineCellarItem from '@/components/wineCellar-item/wineCellar-item.vue'
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			MescrollUni,
			wineCellarItem
		},
		data() {
			return {
				clubId: '',
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5

				},

				url: '/api/order/hasNotUseOrderList',
				params: {
					cardTableId: "",
					date: '',
					isInvite: false
				},
				selectIndex:-1,
				info:{},
			}
		},
		onLoad(opt) {
			let info = this.$u.deepMerge({}, JSON.parse(opt.data))
			this.info = info
			this.params.cardTableId = info.seat.id;
			this.params.date = info.date;
			this.params.isInvite = info.orderType == 'book' ? true : false;
			this.$nextTick(function() {
				this.downCallback()
			})
		},
		methods: {
			selectOrder({orderInfo}){
				let index = this.pageList.findIndex(e=>{
					return e.id == orderInfo.id
				})
				if(index!=-1) {
					if(this.selectIndex==index) {
						this.selectIndex = -1
					} else {
						this.selectIndex = index
					}
				}
			},
			tapSubmit(){
				if(this.selectIndex==-1) return this.$toast.text('请选择订单！')
				let orderInfo = this.pageList[this.selectIndex];
				let data = {
					seatId: this.info.seat.id,
					date: this.info.date,
					cludId: this.info,
					orderType: this.info.orderType == 'fight' ? 'share' : 'fullAmount',
					orderId: orderInfo.id
				}
				this.$u.route('pages/club/consumption/wineCellar/orderChange',{
					data:JSON.stringify(data)
				})
			}
		}

	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	
		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
	
			.middle_box {
				flex: 1;
				min-width: 0;
				min-height: 0;
			}
			.btn {
				width: calc(100% - 60rpx);
				margin: 30rpx;
				height: 90rpx;
				text-align: center;
				line-height: 90rpx;
				border-radius: 45rpx;
				background: #82799B;
				color: #FFFFFF;
				&.active {
					background: $uni-button-color;
				}
			}
		}
	}
</style>
