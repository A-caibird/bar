<template>
	<view class="mycollection-wrap">
		<view @tap="$u.throttle(goClubDetail(item.id))" class="order-info-item" v-for="(item, index) in pageList" :key="index">
			<view class="item-top">
				<view class="item-title">{{ item.name }}</view>
				<view class="item-location" @tap.stop="$u.throttle(openMap(item.lng,item.lat,item.address))">
				<!-- <view class="item-location"> -->
					<image src="/static/imgs/common/location.png"></image>
					<text>{{ item.distance }}</text>
				</view>
			</view>
			<view class="cover">
				<image :src="item.cover" mode="aspectFill"></image>
			</view>
			
			<view class="item-bottom">
				<text class="item-bottom-title">{{ item.subtitle }}</text>
				<view class="item-bottom-link">
					<view class="bottom-label">
						<view v-for="(item1, index) in item.labelList" :key="index">{{ item1 }}</view>
					</view>
					<view class="bottom-link-right" @tap.stop="tapCancelCollect(item)">
						<!-- <u-icon color="#FF59C9" size="38" name="star-fill"></u-icon> -->
						<image src="/static/imgs/common/star_icon.png" style="width: 40rpx; height: 40rpx;"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			pageList: Array
		},
		data() {
			return {
				
			};
		},
		mounted() {
			// let params = {
			// 	pageNumbe: 1,
			//  	pageSize: 20,
			// 	lng: 121.44905, //经度
			//  	lat: 29.85821 //纬度
			//  };
			// this.$u.api.myCollectionApi(params).then(res => {
			//  	//console.log(res);
			//  	this.list = res.data.list;
			//  });
		},
		methods:{
			//取消收藏酒吧
			tapCancelCollect:async function(item){
				let clubId = item.id
				await this.$toast.confirm('','确定取消收藏该酒吧？')

				await this.$u.api.clubCancelCollect(clubId).then(res => {
					
					let {code} = res
					if(code == 0){
						this.$emit('refresh')
						this.$u.toast('取消收藏酒吧成功')
					}
				 });
			},
		}
	};

</script>

<style lang="scss" scoped>
	.mycollection-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 32rpx;
		background-color: #16192B;

		.order-info-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			background:  rgba(255,255,255,0.05);;
			border-radius: 10px;
			margin-bottom: 25rpx;
			padding: 24rpx;

			.item-top {
				width: 690rpx;
				display: flex;
				justify-content: space-between;
				padding: 0 24rpx;
				margin-bottom: 16rpx;

				.item-title {
					font-size: 34rpx;
					color: #ffffff;
				}

				.item-location {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: rgba(255,255,255,0.5);

					& > image {
						width: 24rpx;
						height: 24rpx;
						padding-right: 9rpx;
					}
				}
			}

			.cover {
				width: 100%;
				height: 280rpx;
				margin-bottom: 18rpx;
				&>image{
					height: 100%;
					width: 100%;
				}
			}
			

			.item-bottom {
				width: 100%;
				.item-bottom-title {
					font-size: 30rpx;
					color: #ffffff;
				}

				.item-bottom-link {
					display: flex;
					
					padding-top: 20rpx;
					.bottom-label {
						flex: 1;
						min-width: 0;
						display: flex;
						flex-wrap: wrap;
						view {
							height: 32rpx;
							@include flex-center();
							font-size: 20rpx;
							color: #FFF;
							padding: 2rpx 10rpx;
							border-radius: 8rpx;
							margin-right: 16rpx;
							margin-bottom: 12rpx;
							background: rgba(255, 255, 255, 0.1);
						}
					}
					.bottom-link-right {
						
					}
				}
			}
		}
	}

</style>
