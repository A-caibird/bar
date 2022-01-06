<template>
	<view>
		<block v-if="msgType == 2">
			<view class="currentDate_text">本次服务已结束</view>
		</block>
		<block v-else>
			<view class="currentDate_text" v-if="currentDate">{{currentDate}}</view>
			<view class="chat_info_box" :class="{'reverse': isSelf}">
				<view class="chat_info_left">
					<image class="chat_person_avatar" :src="userInfo.avatar" v-if="isSelf"></image>
					<image class="chat_person_avatar" :src="toUserInfo.avatar" v-else></image>
				</view>
				<view class="chat_info_right" :class="{'reverse': isSelf}">
					<!-- <block>
						<view class="chat_info_peron_name reverse" v-if="isSelf"> <text>{{userInfo.nickName}}</text> </view>
						<view class="chat_info_peron_name" v-else> <text>{{toUserInfo.nickname}}</text> </view>
					</block> -->
					<view class="chat_info_content">
						<block v-if="msgType == 0">
							<block>
								<view class="chat_icon right" v-if="isSelf" ></view>
								<view class="chat_icon left" v-else></view>
							</block>
							<view class="chat_text"> <text>{{msg.payload.text}}</text> </view>
						</block>
						<view class="chat_img" v-if="msgType == 1" >
							<image class="img" mode="widthFix" :src="msg.payload.url" @tap="lookTap(msg.payload.url)"></image>
						</view>
						<view class="chat_img" v-if="msgType == 3" >
							<!-- <video class="video_panel" :src="msg.payload.url"></video> -->
							<view class="video_img_view" @tap="$u.throttle(videoTap)">
								<image class="play_icon" src="/static/imgs/common/play_icon.png"></image>
								<image class="video_img" mode="widthFix" :src="msg.payload.url + '?x-oss-process=video/snapshot,t_0,f_jpg,w_0,h_0,m_fast'" ></image>
							</view>
							
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatInfo: Object,
			}
		},
		props:{
			lastDate: Number,
			msg: Object,
			userInfo: Object,
			toUserInfo: Object
		},
		computed:{
			currentDate: function(){
				let currentDate = '';
				let lastDate = this.lastDate;
				let nowDate = new Date().getTime();
				let nowSub = nowDate - this.msg.timestamp;
				let HoursSeconds12 = 12 * 60 * 60 * 1000;
				let MintusSeconds2 = 2 * 60 * 1000;
				if(nowSub > HoursSeconds12){
					currentDate = this.$u.timeFormat(this.msg.timestamp, 'yyyy-mm-dd hh:MM')
				}else if (nowSub > MintusSeconds2){
					if(parseInt(lastDate) > 0){
						let lastSub = this.msg.timestamp - lastDate;
						if(lastSub > MintusSeconds2){
							currentDate = this.$u.timeFormat(this.msg.timestamp, 'hh:MM')
						}else{
							currentDate = "";
						}
					}else{
						currentDate = this.$u.timeFormat(this.msg.timestamp, 'hh:MM')
					}
				}else{
					currentDate = ""
				}
				
				return currentDate;
			},
			isSelf: function(){
				if(this.msg.senderId == this.userInfo.id){
					return true;
				}else{
					return false;
				}
			},
			msgType: function(){
				let type = "";
				switch(this.msg.type){
					case 'text':{
						return 0; // 文字类型
					};break;
					case 'image': {
						return 1; //图片类型;
					};break;
					case 'file':{
						let contentType = this.msg.payload.contentType;
						if(contentType.indexOf('image') >= 0){
							return 1; //图片类型;
						}
						if(contentType.indexOf('video') >= 0){
							return 3; //视频类型
						}
					};break;
					case 'endThisChat': {
						return 2; //结束服务
					};break;
					default: {
						return 0;
					};break;
				}
			}
		},
		methods:{
			videoTap(){
				this.$emit('videoTap', {
					url: this.msg.payload.url
				})
			},
			lookTap: function(url){
				let urls = [url];
				uni.previewImage({
					urls:urls,
					current: 0
				})
			}
		}
	}
</script>

<style lang="scss">
	.currentDate_text{
		width: 100%;
		text-align: center;
		line-height: 80rpx;
		font-size: 26rpx;
		color: #999999;
	}
	.chat_info_box{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		flex-direction: row;
		&.reverse{
			flex-direction: row-reverse;
		}
		.chat_info_left{
			.chat_person_avatar{
				height: 80rpx;
				width: 80rpx;
				border-radius: 50%;
			}
		}
		.chat_info_right{
			margin-left: 30rpx;
			padding-top: 10rpx;
			&.reverse{
				margin-right: 30rpx;
				margin-left: 0rpx;
			}
			.chat_info_peron_name{
				font-size: 26rpx;
				color: #999999;
				margin-bottom: 20rpx;
				&.reverse{
					text-align: right;
				}
			}
			.chat_info_content{
				max-width: 500rpx;
				position: relative;
				.chat_icon{
					position: absolute;
					top: 20rpx;
					height: 10px;
					width: 10px;
					z-index: 10;
					background-repeat: no-repeat;
					background-size: 100% 100%;
					background-origin: content-box;
					&.right{
						background-image: url('https://patixiu.oss-cn-shanghai.aliyuncs.com/202108/20210831/0210719152335257-20210831155918173.png');
						right: -9px;
					}
					&.left{
						background-image: url('https://patixiu.oss-cn-shanghai.aliyuncs.com/202107/20210719/左箭头实心-20210719152335257.png');
						left: -9px;
					}		
				}
				.chat_text{
					background: #FFFFFF;
					line-height: 36rpx;
					font-size: 28rpx;
					opacity: #000000;
					box-sizing: border-box;
					letter-spacing: 2rpx;
					padding: 16rpx;
					border-radius: 6rpx;
				}
				.chat_img{
					max-width: 500rpx;
					min-width: 120rpx;
					position: relative;
					.img{
						height: 100%;
						width: 100%;
					}
					.video_img_view{
						width: 500rpx;
						height: 300rpx;
						position: relative;
						.video_img{
							width: 500rpx;
							height: 300rpx;
						}
						.play_icon{
							position: absolute;
							z-index: 10;
							height: 100rpx;
							width: 100rpx;
							left: 50%;
							top: 50%;
							transform: translate(-50%, -50%);
						}
					}
				}
			}
		}
	}
</style>
