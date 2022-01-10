<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="通知设置" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }" :border-bottom="false"></u-navbar>
		</view>
		<view class="notify-box">
			<view class="notify-item" v-for="(item, index) in list" :key="index">
				<text>{{ item.content }}</text>
				<u-switch :value="item.checked" @change="changeHandle($event, index)" size="46" active-color="#F32CB7" inactive-color="#3A3F6B"></u-switch>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					content: '点赞通知',
					checked: false,
					way: 'toggleOpenPraiseAPI'
				},
				{
					content: '评论通知',
					checked: false,
					way: 'toggleOpenCommentAPI'
				},
				{
					content: '邀约通知',
					checked: false,
					way: 'toggleOpenInviteAPI'
				},
				{
					content: '关注我的',
					checked: false,
					way: 'toggleOpenAttAPI'
				},
				{
					content: '礼物提醒',
					checked: false,
					way: 'toggleGiftTipsAPI'
				},
				{
					content: '加入拼享',
					checked: false,
					way: 'toggleJoinPingAPI'
				},
				{
					content: '发布动态 ',
					checked: false,
					way: 'togglePublishDynamicAPI'
				}
			]
		};
	},
	onLoad() {
		this.show();
	},
	methods: {
		getPushInfo(){
			this.$u.api.getPushInfoAPI().then((res) => {
				let pushInfo = res.data.pushInfo;
				this.list[0].checked = pushInfo.likeNotification || false;
				this.list[1].checked = pushInfo.commentNotification || false;
				this.list[2].checked = pushInfo.invitationNotice || false;
				this.list[3].checked = pushInfo.followNotifications || false;
				this.list[4].checked = pushInfo.giftReminder || false;
				this.list[5].checked = pushInfo.pingNotice || false;
				this.list[6].checked = pushInfo.pushDynamicNotice || false;
			}).catch(e => {
				console.log(e);
			})
		},
		// switch打开或者关闭时触发，值为true或者false
		// 即使不监听此事件，this.checked此时也会相应的变成true或者false
		changeHandle: function(e, index) {
			let key = this.list[index].way;
			if (this.list[index].checked == true) {
				this.$u.api[key]({
					open: !e
				}).then(res=>{
					if (parseInt(res.code) == 0) {
						this.list[index].checked = false;
					}
				})
			} else {
				this.$u.api[key]({
					open: !e
				}).then(res => {
						if (parseInt(res.code) == 0) {
							this.list[index].checked = true;
						}
					})
					.catch(e => {
						console.log(e);
					});
			}
		},
		show:function(){
	         this.getPushInfo();
		}
	}

};
</script>

<style lang="scss" scoped>
.container {
	padding: 0 30rpx;

	.notify-box {
		display: flex;
		flex-direction: column;

		.notify-item {
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			color: #ffffff;
			padding: 30rpx 0;
		}
	}
}
</style>
