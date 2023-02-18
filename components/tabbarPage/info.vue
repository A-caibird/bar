<template>
	<view class="info-box">
		<view class="header-box">
			<u-navbar :is-fixed="true" :isBack="false" :background="{
				'background': '#191C3F'
			}" :titleColor="'#FFFFFF'" title="消息" :borderBottom="false">
			</u-navbar>
		</view>
		<view class="middle_box">
			<view class="info_classify">
				<block v-for="(info, index) in classifyList" :key="index">
					<view class="common_classify_item" @tap="goPage(info.url)">
						<image :src="info.icon"></image>
						<text>{{info.name}}</text>
						<view class="badge" v-if="info.name == '通知'">
							<u-badge :absolute="false" type="error" :count="noticeNum"></u-badge>
						</view>
						<view class="badge" v-if="info.name == '活动'">
							<u-badge :absolute="false" type="error" :count="activityNum"></u-badge>
						</view>
					</view>
				</block>
			</view>
			<view class="line"></view>
		</view>
		<view class="info_list">
			<scroll-view scroll-y="true" style="height: 100%;">
				<empty content="暂无消息" v-if="chatUserList.length==0"></empty>
				<uni-swipe-action  v-else>
					<uni-swipe-action-item v-for="(item,index) in chatUserList" :right-options="rightOptions" :key="item.chatUserId" @change="swipeChange($event, index)" @click="swipeClick($event, index)">
						<view class="common_info" @tap="tapGoChat(item.userId,item.chatUserId,item.friendId,item.friendName,item.avatar,item.hasSave,item.localAvatar)">
							<view class="person_img">
								<image :src="item.hasSave?item.localAvatar:item.avatar"></image>
								<u-badge :absolute="true" :offset="[-10, -10]"  :count="item.notReadNum" bgColor="#733CFF" color="#ffffff" :showZero="false"></u-badge>
							</view>
							<view class="person_info">
								<view class="first_line">
									<view class="line_left"> <text>{{item.friendName}}</text> </view>
									<view class="line_right">{{timeChange(item.time)}}</view>
								</view>
								<view class="second_line">{{item.content}}</view>
							</view>
						</view>

					</uni-swipe-action-item>

				</uni-swipe-action>

			</scroll-view>


		</view>

	</view>
</template>

<script>
	const app = getApp()
  // import $chat from '@/utils/chat/index.js'
	import empty from '@/components/empty/empty.vue'
	import appleAudit from '@/mixins/apple-audit.js'
	export default{
		mixins:[appleAudit],
		components:{
			empty
		},
		data() {
			return {
				chatUserList:[],//实际的消息的数据列表
				noticeNum: 0,//上面通知的数量
				activityNum: 0,//上面活动的数量
				rightOptions: [//右侧的按钮item
					{
						text: '标记为已读',
						style: {
							backgroundColor: 'rgb(254,156,1)'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: 'rgb(255,58,49)'
						}
					}
				],
			}
		},

		created() {
			// this.$u.api.chatSessionList().then(res => {
			// 	console.log("获取到的聊天数据")
			// 	console.log(res)
			// }).catch(e => {
			// 	console.log(e);
			// })
		},

		computed:{
			classifyList(){
				return this.isAppleAudit?[
					{
						icon: '/static/imgs/information/notice.png',
						value: '',
						name: '通知',
						url:'/pages/info/systemNotification'
					},
					{
						icon: '/static/imgs/information/fans.png',
						value: '',
						name: '粉丝',
						url:'/pages/info/fans'
					},
					{
						icon: '/static/imgs/information/evaluation.png',
						value: '',
						name: '评论',
						url:'/pages/info/comment'
					},

				]:[
					{
						icon: '/static/imgs/information/notice.png',
						value: '',
						name: '通知',
						url:'/pages/info/systemNotification'
					},
					{
						icon: '/static/imgs/information/activity.png',
						value: '',
						name: '活动',
						url:'/pages/info/activity/index'
					},
					{
						icon: '/static/imgs/information/fans.png',
						value: '',
						name: '粉丝',
						url:'/pages/info/fans'
					},
					{
						icon: '/static/imgs/information/gift.png',
						value: '',
						name: '礼物',
						url:'/pages/info/gift'
					},
					{
						icon: '/static/imgs/information/evaluation.png',
						value: '',
						name: '评论',
						url:'/pages/info/comment'
					},

				]
			},
		},


		methods:{
			show(){
				console.log('info show');
				if(getApp().globalData.authorized){
					this.getNoticeCount();
					//uni.$emit('information_listener');//感觉这个也不需要
				}else{
					this.chatUserList = [];
					if(this.noticeNum){
						this.noticeNum = 0;
					}
					if(this.activityNum){
						this.activityNum = 0;
					}
				}
			},
			getNoticeCount(){
				this.$u.api.getNoticeCountAPI().then(res => {
					this.noticeNum = res.data.num || 0;
					this.activityNum = res.data.activityUnReadNum || 0
					// uni.$emit('push_listener', {//感觉这样也不太需要
					// 	num: (this.noticeNum + this.activityNum),
					// 	refresh: false
					// })
				}).catch(e => {
					console.log(e);
				})
			},
			goPage: function(url){
				this.$nav.navigateTo({url});
			},
			swipeChange(e, index) {
				console.log('返回：', e);
				console.log('当前索引：', index);
			},
			async swipeClick(e, index) {
				let {
					content
				} = e;
				if (content.text === '删除') {
				// 	console.log('删除')
				// 	await this.$toast.confirm('','删除后，将清空该聊天的消息记录')
				// 	let msg = this.chatUserList[index]
				// 	$chat.delChatList(msg.account,msg.friendId)
				// 	this.chatUserList.splice(index,1)
				// 	$chat.setChatUserListFromStorage(this.chatToken,this.chatUserList)
				// } else if (content.text === '标记为已读') {
				// 	console.log('标记为已读')
				// 	this.chatUserList[index].notReadNum = 0
				// 	$chat.setChatUserListFromStorage(this.chatToken,this.chatUserList)
				}
			},
			// tapGoChat(userId,chatUserId,chatToken,name,avatar,hasSave,localAvatar){
			// 	let info = {
			// 			userId,
			// 			chatUserId,
			// 			chatToken,
			// 			name,
			// 			avatar,
			// 			hasSave,
			// 			localAvatar
			// 		}
			// 	this.$u.route('/pages/chat/chat',{
			// 		userInfo : JSON.stringify(info)
			// 	})
      //
			// },
			chatUserListRefresh(chatUserList){
				this.chatUserList = chatUserList
			},
			readChat(res){
				// console.log('readChat');
				// let {chatToken,friendChatToken} = res
				// let index = this.chatUserList.findIndex(e=>{
				// 	return e.friendId==friendChatToken
				// })
				// if(index!=-1) {
				// 	this.chatUserList[index].notReadNum = 0
				// 	$chat.setChatUserListFromStorage(chatToken,this.chatUserList)
				// }
				// this.$nextTick(() => {
				// 	uni.$emit('information_listener')
				// })
			},
		}
	}
</script>

<style lang="scss" scoped>

	.info-box {
		height: 100%;
		display: flex!important;
		flex-direction: column!important;
		.middle_box{
			.line{
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				height: 1px;
				background-color: #292C57;
				margin-top: 20rpx;
			}
			.info_classify{
				width: 100%;
				display: flex;
				align-items: center;
				// justify-content: space-between;
				padding: 20rpx 30rpx;
				box-sizing: border-box;

				.common_classify_item{
					flex: 1;
					display: flex;
					align-items: center;
					flex-direction: column;
					position: relative;
					.badge{
						position: absolute;
						top: -16rpx;
						right: 10rpx;
						z-index: 10;
					}
					&>image{
						height: 90rpx;
						width: 90rpx;
					}
					&>text{
						font-size: 24rpx;
						color: #FFFFFF;
						margin-top: 16rpx;
					}
				}
			}

		}
		.info_list{
			flex: 1;
			min-width: 0;
			min-height: 0;

			// background-color: red;
			// width: 100%;
			padding: 20rpx 0rpx;

			.common_info{
				width: 100%;
				padding: 30rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.person_img{
					height: 90rpx;
					width: 90rpx;
					position: relative;
					&>image{
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.person_info{
					height: 90rpx;
					width: calc(100% - 120rpx);
					.first_line{
						display: flex;
						align-items: center;
						justify-content: space-between;
						line-height: 45rpx;
						.line_left{
							font-size: 32rpx;
							color: #FFFFFF;
						}
						.line_right{
							font-size: 24rpx;
							color: #9497B5;
						}
					}
					.second_line{
						width: 100%;
						font-size: 26rpx;
						color: #9497B5;
						line-height: 45rpx;
						@include ellipsis();
					}
				}
			}


		}

	}


</style>
