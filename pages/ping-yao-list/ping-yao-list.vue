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
		<u-popup v-model="statementShow" mode="bottom">
			<view class="statement">
				<view class="statement_title">常用语</view>
				<scroll-view class="statement_box" :scroll-y="true">
					<block v-for="(item, index) in statementList" :key="index">
						<view class="statement_item" @tap="statementIndex = index">
							<view class="statement_item_text">{{item}}</view>
							<view class="statement_item_select">
								<image class="select_icon" src="/static/imgs/common/select.png" v-if="statementIndex == index"></image>
								<image src="/static/imgs/common/no-select.png" v-else></image>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="statement_btn" @tap="$u.throttle(sendYaoyueStatement)">发送</view>
			</view>
		</u-popup>
		<view class="btn" @tap="$u.throttle(tapSubmit)" :class="{'active': selectIndex!=-1}" type="default">确认邀请</view>
	</view>
		
	
</template>

<script>
	import $chat from '@/utils/chat/index.js'
	import popCommon from '@/components/commonPop/pop.vue'
	import { yaoyueStatement } from '@/common/select.js'
	const app = getApp()
	export default{
		components:{
			popCommon
		},
		data(){
			return {
				statementList: yaoyueStatement,
				statementIndex: -1,
				statementShow: false,
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
					// this.sendYaoyue(orderInfo,friendUserInfo)
					this.statementShow = true;
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
			sendYaoyueStatement(){
				if(this.statementIndex==-1) return this.$toast.text('请选择常用句！')
				if(this.selectIndex==-1) return this.$toast.text('请选择订单！')
				let friendUserInfo = this.$u.deepClone(this.dynamicInfo)
				friendUserInfo.name = friendUserInfo.nickName
				friendUserInfo.hasSave = false
				let orderInfo = this.list[this.selectIndex]
				this.sendYaoyue(orderInfo,friendUserInfo)
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
						statement: this.statementList[this.statementIndex]
					})
					this.$toast.text('已发送邀约请求')
					this.statementShow = false;
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
		.statement{
			width: 100%;
			background: #2c3158;
			// @include saveDistanceBottom();
			padding-bottom: 60rpx;
			box-sizing: border-box;
			&_title{
				line-height: 100rpx;
				width: 100%;
				text-align: center;
				font-size: 30rpx;
				color: #FFFFFF;
			}
			&_box{
				box-sizing: border-box;
				padding: 0 20rpx;
				width: 100%;
				height: 400rpx;
				overflow: hidden;
				white-space: nowrap;
				margin-bottom: 20rpx;
				.statement_item{
					width: 100%;
					height: 100rpx;
					line-height: 100rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					&_text{
						font-size: 28rpx;
						color: #FFFFFF;
					}
					&_select{
						height: 40rpx;
						width: 40rpx;
						&>image{
							height: 100%;
							width: 100%;
							vertical-align: top;
						}
					}
				}
			}
			&_btn{
				width: calc(100% - 40rpx);
				margin-left: 20rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 50rpx;
				background: linear-gradient(270deg, #BB0CF9, #F92FAF);
				color: #FFFFFF;
			}
		}
	}
	
</style>

