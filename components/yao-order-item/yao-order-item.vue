<template>
	<view class="order_box" @tap="$u.throttle(tapGoDetail(info))">
		<view class="order_info">
			<view class="info_first_line">
				<view class="info_code"> <text style="color: #B4B2CF;">订单号：</text> <text>{{info.sn}}</text> </view>
				<view class="info_status"> <text>{{getOrderStatus(info.status)}}</text> </view>
			</view>
			<view class="info_img">
				<image :src="info.clubCover"></image>
			</view>
			<view class="info_box">
				<view class="name_price">
					<view class="info_name"> <text>{{info.clubName}}</text> </view>
					<view class="info_price"> <text>{{info.originalWineCoin}}元</text> </view>
				</view>
				<view class="item_info">
					<view class="item_info_label" style="color: #B3B3DD;">预约时间：</view>
					<view class="item_info_text">{{info.date}}</view>
				</view>
				<view class="item_info" v-if="info.canUseEndTime">
					<view class="item_info_label" style="color: #B3B3DD;">到期时间：</view>
					<view class="item_info_text">{{info.canUseEndTime}}</view>
				</view>
				<view class="item_info">
					<view class="item_info_label" style="color: #B3B3DD;">台位位置：</view>
					<view class="item_info_text">{{info.cardTableName}} 卡台</view>
				</view>
				<view class="item_info">
					<view class="item_info_label" style="color: #B3B3DD;">参与人数：</view>
					<view class="item_info_text">{{info.joinPersonNumber}}人</view>
				</view>
			</view>
			<view class="order_btn" v-if="deleteShow || goPayShow||cancelOrderShow||commentShow||arriveShow||yaoyueShow||addWineShow||quiteOrderShow||fetchWineShow || rescheduleShow">
				<view class="common_btn" v-if="fetchWineShow" @tap.stop="$u.throttle(tapFetchWine)"> <text>取酒</text> </view>
				<view class="common_btn" v-if="rescheduleShow" @tap.stop="$u.throttle(rescheduleHandle)"> <text>改期</text> </view>
				<block v-if="goPayShow">
					<view class="common_btn color" v-if="chatTag"  @tap.stop="$u.throttle(statementPopShowTap)">去付款</view>
					<view class="common_btn color" v-else @tap.stop="$u.throttle(goPay)">去付款</view>
				</block>
				<view class="common_btn" v-if="deleteShow" @tap.stop="$u.throttle(tapGoDelete)"> <text>删除</text> </view>
				<view class="common_btn" v-if="cancelOrderShow" @tap.stop="tapCancel"> <text>取消订单</text> </view>
				<view class="common_btn" v-if="commentShow" @tap.stop="$u.throttle($u.route('/pages/order/evaluation',{orderId:info.id}))"> <text>我要评价</text> </view>
				<view class="common_btn" v-if="arriveShow" @tap.stop="tapArrive"> <text>确认到店</text> </view>
				<view class="common_btn" v-if="yaoyueShow" @tap.stop="$u.throttle(tapGoYaoyue)"> <text>去邀约</text> </view>
				<view class="common_btn" v-if="addWineShow" @tap.stop="$u.throttle(tapGoAddWine)"> <text>加单酒水</text> </view>
				<view class="common_btn" v-if="quiteOrderShow" @tap.stop="$u.throttle(tapQuitYao)"> <text>退出邀约</text> </view>
				<!-- <view class="common_btn" v-if="canRefund" @tap.stop="$u.throttle(tapRefundOrder)"> <text>退款</text> </view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import orderUtils from '@/common/orderUtils.js'
	export default {
		props: {
			info: {
				type: Object,
				default: {},
			},
		},
		computed: {
			rescheduleShow(){ // 是否能改期
				return (this.info.status=='expired' && this.info.isCreator)
			},
			chatTag(){ // 是否存在聊天
				return (this.info.saveInviteUser && this.info.isCreator)
			},
			canRefund(){ //退款
				return this.info.canRefund
			},
			fetchWineShow(){//取酒
				return (this.info.status=='arrived')&&(this.info.canFetch)&&this.info.isCreator
			},
			quiteOrderShow(){//退出邀约按钮
				return (this.info.status=='noShop'||this.info.status=='arrived')&&!this.info.isCreator
			},
			addWineShow(){//添加酒水按钮
				return this.info.status=='arrived'
			},
			yaoyueShow(){//邀约按钮
				return (this.info.status=='noShop'||this.info.status=='arrived')&&this.info.isCreator
			},
			deleteShow() { //删除按钮 非创造者
				return ( this.info.status=='complete' || this.info.status == 'comment')
			},
			goPayShow() { //去付款按钮
				return (this.info.status == 'paying')&&this.info.isCreator
			},
			cancelOrderShow() { //取消订单按钮
				return (this.info.status == 'paying')&&this.info.isCreator
			},
			commentShow() { //评价按钮
				return this.info.status == 'comment'
			},
			arriveShow() { //到店按钮
				return (this.info.status == 'noShop')&&this.info.isCreator
			},
		},
		methods: {
			rescheduleHandle(){ // 改期逻辑
				this.$u.route('/pages/order/reschedule/seat',{
					orderId:this.info.id,
					orderType: 'yaoyue',
					clubId: this.info.clubId
				})
			},
			statementPopShowTap(){
				this.$emit('statementPopShowTap', this.info);
			},
			goPay(){
				orderUtils.goPay(this, 'yaoyue', this.info);
			},
			async tapFetchWine(){
				this.$u.route('/pages/order/fetch-wine',{
					orderId:this.info.id,
				})
			},
			async tapRefundOrder() {
				await this.$toast.confirm('','确定要退款吗？')
				let {code} = await this.$u.api.refundInviteOrderApi({
					id:this.info.id
				})
				if(code==0) {
					this.$toast.text('退款成功！具体退款时间请以实际情况为准')
					uni.$emit('order-list-refresh')
				}
			},
			async tapQuitYao(){
				await this.$toast.confirm('','确定要退出邀约？')
				let {code} = await this.$u.api.quitInviteOrderApi({
					inviteId:this.info.inviteId
				})
				if(code==0) {
					this.$toast.text('退出成功！')
					uni.$emit('order-list-refresh')
				}
			},
			tapGoAddWine(){
				this.$u.route('/pages/order/add-wine',{
					orderId:this.info.id,
					clubId:this.info.clubId,
				})
			},
			tapGoYaoyue(){
				this.$u.route({
					type:'reLaunch',
					url:'/pages/index/index',
					params:{
						goFind:true
					}
				})
			},
			async tapArrive(){
				await this.$toast.confirm('','确定已经到店？')
				this.arriveOrder()
			},
			async arriveOrder(){
				let {code} = await this.$u.api.arriveOrderApi({
					orderId:this.info.id,
				})
				if(code==0) {
					this.$toast.text('到店成功！')
					uni.$emit('order-list-refresh')
				}
			
			},
			async tapCancel(){
				await this.$toast.confirm('','确定要取消该订单？')
				this.cancelOrder()
			},
			async cancelOrder(){
				let {code} = await this.$u.api.cancelOrderApi({
					orderId:this.info.id,
				})
				if(code==0) {
					uni.$emit('pay-order-refresh')
					uni.$emit('order-list-refresh')
					this.$toast.text('取消成功！')
				}
			
			},
			// 隐藏
			async tapGoDelete(){
				await this.$toast.confirm('','确定要删除该订单？')
				let {code} = await this.$u.api.hideYaoOrderApi({
					inviteId:this.info.inviteId
				})
				if(code==0) {
					uni.$emit('order-list-refresh')
					this.$toast.text('删除成功！')	
				}
			},
			// 删除
			async tapDelete(){
				await this.$toast.confirm('','确定要删除该订单？')
				this.deleteYaoOrder()
			},
			async deleteYaoOrder(){
				let {code} = await this.$u.api.deleteYaoOrderApi({
					inviteId:this.info.inviteId
				})
				if(code==0) {
					uni.$emit('order-list-refresh')
					this.$toast.text('删除成功！')	
				}
			},
			tapGoDetail(info) {
				if(info.isCreator) {
					this.$u.route('/pages/order/yao-create-detail', {
						orderId: info.id,
						// inviteId: info.inviteId,
					})
				} else {
					this.$u.route('/pages/order/yao-invited-detail', {
						orderId: info.id,
						// inviteId: info.inviteId,
					})
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	.order_box {
		width: 100%;

		.order_info {
			width: calc(100% - 60rpx);
			margin-left: 30rpx;
			border-radius: 10rpx;
			background: #2C3158;
			box-sizing: border-box;
			padding: 26rpx 30rpx;
			position: relative;
			.info_first_line {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 26rpx;
				color: #FFFFFF;
			}

			.info_img {
				width: 100%;
				height: 313rpx;
				margin-top: 30rpx;
				border-radius: 6rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
			.info_box {
				margin-top: 26rpx;
				width: 100%;

				.name_price {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 34rpx;
					color: #FFFFFF;
					font-weight: 500;
				}

				.item_info {
					display: flex;
					align-items: center;
					height: 40rpx;
					font-size: 26rpx;
					color: #FFFFFF;
				}
			}

			.order_btn {
				margin-top: 24rpx;
				border-top: 1px solid #3C4176;
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				padding-top: 25rpx;

				.common_btn {
					height: 60rpx;
					width: 160rpx;
					text-align: center;
					line-height: 54rpx;
					border-radius: 30rpx;
					border: 1px solid #585889;
					color: #FFFFFF;
					font-size: 26rpx;
					margin-left: 40rpx;

					&.color {
						background: $uni-button-color;
						color: #FFFFFF;
						border: 0rpx;
						line-height: 60rpx;
					}
				}
			}
		}
	}
</style>
