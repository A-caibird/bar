<template>
	<view v-if="show">
		<u-popup
			v-model="show"
			:mask="false"
			mode="bottom"
			zIndex="1000"
			bgColor= '#2c3158'
			borderRadius="20"
		>
		
			<view class="gift-wrap">
				<swiper class="gift_swiper" >
					<swiper-item v-for="(info, index) in nextList" :key="index">
						<view class="gift_select_list">
							<block>
								<view class="select_box" :class="{ active: giftId == item.id }" v-for="(item, index) in info" :key="index" @tap="tapSelectGift(item)">
									<view class="select_info">
										<image :src="item.imgUrl"></image>
										<view class="info_name">{{ item.name }}</view>
										<view class="info_price">{{ item.wineCoin }}酒币</view>
									</view>
								</view>
							</block>
						</view>
					</swiper-item>
				</swiper>
				<block v-if="quantityShow">
					<view class="choose_quantity_box" >
						<scroll-view scroll-y="ture" style="height: 100%;">
							<view class="choose_quantity_box-view">
								<view class="choose_label" :class="{ select: quantityIndex == -1 }" @tap="selectQuantity(-1)"><text>(其它数量)</text></view>
								<view class="quantity_box">
									<block v-for="(info, index) in quantityList" :key="index">
										<view class="common_quantity" :class="{ select: quantityIndex == index }" @tap="selectQuantity(index)">
											<text>{{ info.text }}</text>
										</view>
									</block>
								</view>
							</view>
						</scroll-view>
						
					</view>
				</block>
							
				<view class="pay_box">
					<view class="money_panel" @tap="quantityShow=!quantityShow">
						<image class="coin_icon" src="/static/imgs/common/coin_icon.png"></image>
						<text>{{ sendNum }}</text>
						<image class="arrow_icon" src="/static/imgs/common/arrow_up.png"></image>
					</view>
					<view class="pay_btn" @tap="tapPay"><text>赠送</text></view>
				</view>		
			</view>
				
		</u-popup>
		<block>
			<giftAnimation ref="giftAnimation"></giftAnimation>
		</block>
		<block>
			<pay ref="payRef" @pay="pay($event)"></pay>
		</block>
	</view>
</template>

<script>
	import $calc from '@/utils/calc/index.js'
	import dynamicGiftEdit from '@/components/dynamic-gift-edit/dynamic-gift-edit.vue';
	import giftAnimation from '@/components/giftAnimation/giftAnimation.vue'
	const app = getApp()
	export default {
		components: {
			dynamicGiftEdit,
			giftAnimation
		},
		data() {
			return {
				show:false,
				nextList:[],
				sendNum:1,
				gList: [],
				giftId: '',
				quantityShow: false,
				quantityIndex: 5,
				quantityList: [
					{
						text: '1314 (一生一世)',
						value: 1314
					},
					{
						text: '520 (我爱你)',
						value: 520
					},
					{
						text: '188 (要抱抱)',
						value: 188
					},
					{
						text: '30 (想你了)',
						value: 30
					},
					{
						text: '10 (十全十美)',
						value: 10
					},
					{
						text: '1 (一心一意)',
						value: 1
					}
				],
				dynamicId:-1,		
			};
		},
		watch:{
		},
		methods:{
			init(params) {
				let {dynamicId} = params
				this.dynamicId = dynamicId
				this.quantityIndex = 5
				this.sendNum = 1
				this.quantityShow = false
				this.giftId = ''
				this.getGiftList()
			},
			setSendNum(sendNum){
				this.sendNum = sendNum
			},
			open(params){
				this.init(params)
				this.show = true
			},
			close(){
				this.show = false
			},
			async getGiftList(){
				let {code,data} = await this.$u.api.getGiftListApi()
				if(code==0) {
					let {list} = data
					this.gList = list
					let nextList = []
					if (list.length > 8) {
						for (var i = 0; i < list.length; i += 8) {
							nextList.push(list.slice(i, i + 8));
						}
					} else {
						nextList.push(list)
					}
					this.nextList = nextList
					console.log(this.nextList)
				}
			},
			
			selectQuantity: function(index) {
				this.quantityIndex = index;
				if (this.quantityIndex == -1) {
					this.$emit('oepnGiftEdit')
					this.quantityShow = false;
				} else {
					this.sendNum = this.quantityList[index].value;
					//console.log(this.sendNum)
					// this.shuliang = this.quantityList[index].value;
					this.quantityShow = false;
				}
			},
			
			//选择礼物类型
			async tapSelectGift(gift) {
				let id = gift.id;
				if(this.giftId==id) {
					this.giftId = ''
				} else {
					this.giftId = id
				}
			},
			
			
			async tapPay(){
				let vm = this
				let sendNum = this.sendNum
				let giftId = this.giftId
				let index = this.gList.findIndex(e=>{
					return e.id==giftId
				})
				if(index==-1) return this.$u.toast('请先选择礼物')
				if(sendNum <=0) return this.$u.toast('请选择礼物数量');
				let allAmount = $calc.cMul(sendNum,this.gList[index].wineCoin)
				let password = getApp().globalData.payPassword ;
				if(password){
					this.pay({password});
				}else{
					this.$refs.payRef.open(allAmount);
				}
			},
			async pay(payPassword) {
				let params = {
					dynamicId: this.dynamicId,
					giftId: this.giftId,
					sendNum: this.sendNum,
					payPassword: payPassword.password,
				}
				let {code,data, msg} = await this.$u.api.sendGiftApi(params)
				if (code == 0) {
					console.log(data)
					let {giftNum} = data
					this.getItemFromList('id',params.giftId,this.gList).then(({gifUrl})=>{
						this.$emit('sendGiftSuccess',{id:this.dynamicId,giftNum:giftNum,gifUrl:gifUrl})
						this.close()
						this.$u.toast('赠送成功');
					}).catch(err=>{
						this.$emit('sendGiftSuccess',{id:this.dynamicId,giftNum:giftNum,})
						this.close()
						this.$u.toast('赠送成功');
					})
					this.$refs.payRef.close();
					this.setPayPasswordToStorage(params.payPassword)
				} else if(code==1) {
					setTimeout(()=>{
						this.$u.route({
							url:'/pages/mine/myWallet/recharge',
						})
					},500)
				} else {
					this.removePayPasswordToStorage()
					if(msg.indexOf('支付密码不正确') >= 0){
						this.$refs.payRef.subInputTimes();
					}
				}
			},
				
		}
		
	}
</script>

<style lang="scss" scoped>
	.gift-wrap {
		width: 100%;
		background: #2c3158;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		padding-top: 20rpx;
		box-sizing: border-box;
		position: relative;
		.gift_swiper {
			height: 420rpx;
			width: 100%;
			.gift_select_list {
				width: 100%;
				height: 100%;
				// align-items: center;
				.select_box {
					height: 50%;
					width: 25%;
					position: relative;
					display: inline-block;
					&.active {
						&:after {
							content: '';
							background: url('/static/imgs/common/select_icon.png');
							background-size: 100% 100%;
							position: absolute;
							height: 54rpx;
							width: 54rpx;
							top: 0rpx;
							right: 0rpx;
							z-index: 10;
						}
					}
					// .select_icon{
					// 	position: absolute;
					// 	height: 54rpx;
					// 	width: 54rpx;
					// 	top: 0rpx;
					// 	right: 0rpx;
					// 	z-index: 10;
					// }
					.select_info {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						& > image {
							height: 84rpx;
							width: 84rpx;
							//background: #007AFF;
						}
						.info_name {
							font-size: 26rpx;
							color: #ffffff;
							line-height: 36rpx;
						}
						.info_price {
							font-size: 22rpx;
							color: #bbbbff;
							line-height: 30rpx;
						}
					}
				}
			}
			
			
		}
		.choose_quantity_box {
			position: absolute;
			z-index: 100;
			width: 200rpx;
			height: 440rpx;
			left: 0rpx;
			top: 0;
			transition: all 0.6;
			border: 1px solid #46467b;
			background: #3d4374;
			.choose_quantity_box-view {
				height: 100%;
				.choose_label {
					height: 80rpx;
					line-height: 80rpx;
					width: 100%;
					text-align: center;
					font-size: 26rpx;
					color: #ffffff;
					&.select {
						color: #ffff00;
					}
				}
				.quantity_box {
					overflow-y: scroll;
				}
				.common_quantity {
					width: calc(100% - 20rpx);
					margin-left: 10rpx;
					line-height: 40rpx;
					font-size: 24rpx;
					color: #ffffff;
					text-align: left;
					margin-bottom: 20rpx;
					&.select {
						color: #ffff00;
					}
				}
						
			}
			
		}
		
		.pay_box {
			height: 100rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-top: 1px solid #46467b;
			.money_panel {
				display: flex;
				align-items: center;
				margin-left: 30rpx;
				.coin_icon {
					height: 30rpx;
					width: 30rpx;
					margin-top: 2rpx;
				}
				& > text {
					font-size: 30rpx;
					color: #ffffff;
					margin: 0 20rpx;
				}
				.arrow_icon {
					height: 14rpx;
					width: 22rpx;
				}
			}
			.pay_btn {
				height: 60rpx;
				width: 170rpx;
				text-align: center;
				line-height: 60rpx;
				background: $uni-button-color;
				color: #ffffff;
				font-size: 28rpx;
				border-radius: 30rpx;
				margin-right: 30rpx;
			}
		}
		
		
	}
	
</style>
