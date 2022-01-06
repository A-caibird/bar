<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="全部拼单" title-size="36" title-color="#FFFFFF" :background="{
						'background': '#191C3F'
					}"
			 :border-bottom="false">
			</u-navbar>
		</view>
		<view class="follow-person" >
			<view class="person-item" v-for="item,index in list" :key="item.id"  @longpress="pressDelete(item)">
				<view class="item-captain" v-if="item.hasSponsor">
					<image :src="item.avatar" mode=""  @tap="$u.throttle(goPersonalHomepage(item.id))"></image>
					<text class="item-name">{{item.nickName}}</text>
					<view class="label-captain"> <text>爬梯主</text></view>
				</view>
				<view class="item-member" v-else>
					<image :src="item.avatar" :class="{filter:type=='notjoin'}" @tap="$u.throttle(tapMember(item.id))"></image>
					<text class="item-name">{{item.nickName}}</text>
					<template v-if="item.hasPay">
						<view class="label-captain"> <text>已支付</text></view>
					</template>
					<template v-else>
						<view class="label-nopay"> <text>未支付</text></view>
					</template>
				</view>
				<view class="item-right">
					<text>{{item.joinTime}}</text>
				</view>
			</view>
		</view>
	<!-- 	<view class="blank-image" v-else>
			<image src="/static/imgs/common/nothing.png" mode=""></image>
			<text>暂无拼团</text>
		</view> -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBlank: true, //true 显示订单   false 显示暂无拼团
				list: [],
				orderId:-1,
				type:'notjoin',
			}
		},
		onLoad(opt) {
			console.log(opt)
			let {type,orderId} = opt
			this.orderId = orderId
			this.type = type
			this.load()
			
		},
		methods:{
			tapMember(id){
				if(this.type!='notjoin') {
					this.goPersonalHomepage(id)
				}
			},
			async pressDelete(item){
				if(item.hasSponsor||this.type!='creater') return 
				await this.$toast.confirm('','确定要踢出该成员？')
				let {code} = await this.$u.api.pingKickOutApi({
					joinTogetherId:item.joinTogetherId,
					userId:item.id
				})
				if(code==0) {
					this.load()
					uni.$emit('ping-order-detail-refresh')
					uni.$emit('order-list-refresh')
				}
				
			},
			
			load(){
				this.getPingUserList()
			},
			async getPingUserList(){
				let {code,data} = await this.$u.api.getPingUserListApi({
					orderId:this.orderId
				})
				if(code==0) {
					console.log(data)
					this.list = data.list
				}
			},
		}
		
	}
</script>

<style lang="scss" scoped>
	.container {
		position: relative;

		.header-box {
			padding-bottom: 21rpx;
		}

		.person-situation {
			display: flex;
			align-items: center;
			width: 100%;
			height: 80rpx;
			background: #2c3158;
			font-size: 26rpx;
			color: #FFFFFF;
			padding: 0 30rpx;
			margin-bottom: 30rpx;
		}

		.follow-person {
			display: flex;
			flex-direction: column;
			padding: 0 30rpx;

			.person-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				height: 150rpx;

				.item-captain {
					display: flex;
					align-items: center;

					image {
						width: 90rpx;
						height: 90rpx;
						border-radius: 45rpx;
					}

					.item-name {
						font-size: 32rpx;
						color: #FFFFFF;
						padding: 0 35rpx;
					}

					.label-captain {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 109rpx;
						height: 50rpx;
						background: #f82fb0;
						border: 1rpx solid #733cff;
						border-radius: 25rpx;
						font-size: 24rpx;
						color: #FFFFFF;
					}
					
				}

				.item-member {
					display: flex;
					align-items: center;

					image {
						width: 90rpx;
						height: 90rpx;
						border-radius: 45rpx;
						&.filter {
							filter: blur(8px);
						}
					}	
					

					.item-name {
						font-size: 32rpx;
						color: #FFFFFF;
						padding: 0 35rpx;
					}
					.label-captain {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 109rpx;
						height: 50rpx;
						background: #f82fb0;
						border: 1rpx solid #733cff;
						border-radius: 25rpx;
						font-size: 24rpx;
						color: #FFFFFF;
					}
					.label-nopay {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 109rpx;
						height: 50rpx;
						border: 1px solid #565B86;
						border-radius: 25rpx;
						font-size: 24rpx;
						color: #B3BAEF;
					}
				}

				.item-right {
					font-size: 24rpx;
					color: #B3B3DD;
				}
			}
		}

		.blank-image {
			position: absolute;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 30rpx;
			color: #FFFFFF;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			image {
				width: 150rpx;
				height: 150rpx;
				padding-bottom: 45rpx;
			}
		}
	}
</style>
