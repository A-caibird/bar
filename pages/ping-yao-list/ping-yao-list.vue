<template>
	<view class="page-wrap">
		<view class="list-wrap">
			<scroll-view scroll-y="true" style="height: 100%;">
				<view style="margin-top: 30rpx;" v-for="(info, index) in list" :key="info.id">
					<yao-order-item-invite v-if="info.type=='yao'" :isSelect="selectIndex==index" :info="info" @selectOrder="selectOrder"></yao-order-item-invite>
					<ping-order-item-invite v-if="info.type=='ping'" :isSelect="selectIndex==index" :info="info" @selectOrder="selectOrder"></ping-order-item-invite>
				</view>
			</scroll-view>
		</view>
		<pop-common
			v-if="popShow"
			title='提示'
			content='您当前没有可以用来尬酒的订单！'
			confirmText='打个招呼'
			cancelText='立马下单'
			@confirm="confirmEvent"
			@cancel="cancelEvent"
			@maskTap="maskEvent"
		></pop-common>
		<view class="btn" @tap="$u.throttle(tapSubmit)" :class="{'active': selectIndex!=-1}" type="default">确认邀请</view>
	</view>
		
	
</template>

<script>
	import $chat from '@/utils/chat/index.js'
	import popCommon from '@/components/commonPop/pop.vue'
	const app = getApp()
	export default{
		components:{
			popCommon
		},
		data(){
			return {
				popShow: false,
				list:[],
				dynamicInfo:{},
				userInfo: app.globalData.userInfo,
				selectIndex:-1,
			}
		},
		methods:{
			load(){
				this.getCanOrder()
			},
			tapSubmit(){
				if(this.selectIndex==-1) return this.$toast.text('请选择订单！')
				let friendUserInfo = this.$u.deepClone(this.dynamicInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				let orderInfo = this.list[this.selectIndex]
				if(orderInfo.type=='yao') {
					this.sendYaoyue(orderInfo,friendUserInfo)
				} else {
					this.sendPing(orderInfo,friendUserInfo)
				}
			},
			async getCanOrder(){
				let {code,data} = await this.$u.api.getCanOrderApi({
					targetUserId: this.dynamicInfo.userId
				})
				console.log(data)
				if(code==0) {
					this.list = data.list
					if(this.list.length==0) {
						this.popShow = true;
					}
				}
			},
			confirmEvent(){
				let vm = this
				let friendUserInfo = this.$u.deepClone(this.dynamicInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				let infoStr = JSON.stringify(friendUserInfo)
				this.popShow = false;
				vm.$u.route({
					type:'redirect',
					url:'/pages/chat/chat',
					params:{
						userInfo:infoStr
					}
				})
			},
			cancelEvent(){
				let vm = this
				this.popShow = false;
				vm.$u.route({
					type:'redirect',
					url:'pages/club/list?mode=list'
				})
			},
			maskEvent(){
				this.popShow = false;
				uni.navigateBack({
					delta:1
				})
			},
			selectOrder({orderInfo}){
				let index = this.list.findIndex(e=>{
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
			async sendYaoyue(orderInfo, friendUserInfo) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let {
					code,
					data
				} = await this.$u.api.yaoyueInviteApi({
					orderId: orderInfo.id,
					userId: friendUserInfo.userId
				})
				if (code == 0) {
					console.log(data)
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'yaoyue', {
						orderId: orderInfo.id,
						clubCover: orderInfo.clubCover,
						clubName: orderInfo.clubName,
						date: orderInfo.date,
						cardTableName: orderInfo.cardTableName,
						awkwardWineId: data.awkwardWineId,
						agreeStatus: 'none',
					})
					this.$toast.text('已发送邀约请求')
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},500)
				}
			},
			async sendPing(orderInfo, friendUserInfo) {
				let userInfo = this.$u.deepClone(this.userInfo)
				let {
					code,
					data
				} = await this.$u.api.pingInviteApi({
					orderId: orderInfo.id,
					userId: friendUserInfo.userId
				})
				if(code == 0){
					$chat.sendMsg(userInfo, friendUserInfo, 'single', 'ping', {
						orderId: orderInfo.id,
						clubCover: orderInfo.clubCover,
						clubName: orderInfo.clubName,
						date: orderInfo.date,
						cardTableName: orderInfo.cardTableName,
						amount: orderInfo.amount,
						agreeStatus: 'none',
					})
					this.$toast.text('已发送拼享请求')
					setTimeout(()=>{
						this.$u.route({type:'back'})
					},500)
				}
			},
		},
		onLoad(opt) {
			this.dynamicInfo = JSON.parse(decodeURIComponent(opt.dynamicInfo))
			this.load()
		},
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.page-wrap {
			height: 100%;
			display: flex;
			flex-direction: column;
			.list-wrap {
				flex: 1;
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

