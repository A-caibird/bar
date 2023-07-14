<template>
	<view class="container">
		<view class="header-box">
			<u-navbar back-icon-color="#FFFFFF" title="会员权益" title-size="36" title-color="#FFFFFF"
			:background="{'background': '#16192B'}" :border-bottom="false">
			</u-navbar>
		</view>
		<view class="member-level">
			<view class="level-title">
				<view class="title-left"></view>
				<text >会员等级</text>
			</view>
			<view class="level-content">
				<view class="level-content-item" v-for="item,index in memberList" :key="item.id">
					<view class="level-content-left">
						<image :src="item.badgeUrl" mode=""></image>
						<view class="level-content-text">
							<image  src="/static/imgs/mine/class_icon.png" mode=""></image>
							<text>{{item.name}}</text>
						</view>
					</view>
					<view class="level-content-right">						
							积分 ≥ {{item.lowestScore}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				memberList:[],
			}
		},
		onLoad() {
			this.load()
		},
		methods:{
			load(){
				this.getMemberLevelList()
			},
			async getMemberLevelList(){
				let {code,data} = await this.$u.api.getMemberLevelListApi({})
				if(code==0) {
					let {list} = data
					this.memberList = list
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		padding: 0 30rpx;
		.member-level{
			.level-title{
				display: flex;
				align-items: center;
				.title-left{
					width: 6rpx;
					height: 26rpx;
					background: #ff59c9;
					margin-right: 14rpx;
				}
				text{
					font-size: 30rpx;
					 color: #FFFFFF;
				}
			}
			.level-content{
				display: flex;
				flex-direction: column;
				.level-content-item{
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 690rpx;
					height: 200rpx;
					background: #2c3158;
					border-radius: 10rpx;
					margin: 30rpx 0;
					padding: 0 30rpx;
					color: #FFFFFF;
					.level-content-left{
						display: flex;
						justify-content: center;
						align-items: center;
						image{
							width: 87rpx;
							height: 100rpx;
						}
						.level-content-text {
							padding: 0 20rpx;
							line-height: 36rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							border-radius: 18rpx;
							margin-left: 20rpx;
							background: linear-gradient(148deg, #7341B9 0%, #333EC2 100%);
						
							&>image {
								height: 16rpx;
								width: 18rpx;
							}
						
							&>text {
								font-size: 20rpx;
								color: #FFFFFF;
								font-weight: bold;
								height: 30rpx;
								line-height: 36rpx;
							}
						}
					}
					.level-content-right{
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>
