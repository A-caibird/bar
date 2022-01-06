<template>
	<view class="mycollection-wrap">
		<view @tap="$u.throttle(goClubDetail(item.id))" class="order-info-item" v-for="(item, index) in pageList" :key="index">
			<view class="item-top">
				<view class="item-title">{{ item.name }}</view>
				<view class="item-location" @tap.stop="$u.throttle(openMap(item.lng,item.lat,item.address))">
				<!-- <view class="item-location"> -->
					<image src="/static/imgs/common/location.png" mode=""></image>
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
						<u-icon color="#FF59C9" size="38" name="star-fill"></u-icon>
						<!-- <u-icon name="more-dot-fill" color="#ffffff" size="40"></u-icon> -->
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
		background-color: #20234b;

		.order-info-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 100%;
			// height: 590rpx;
			background-color: #191c3f;
			border-radius: 10px;
			margin-bottom: 25rpx;

			.item-top {
				width: 690rpx;
				display: flex;
				justify-content: space-between;
				padding: 30rpx 0;

				.item-title {
					font-size: 34rpx;
					color: #ffffff;
				}

				.item-location {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #ffffff;

					& > image {
						width: 21rpx;
						height: 25rpx;
						padding-right: 9rpx;
					}
				}
			}

			.cover {
				width: 100%;
				height: 468.75rpx;
				&>image{
					height: 100%;
					width: 100%;
				}
			}
			

			.item-bottom {
				width: 100%;
				
				padding: 30rpx;
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
							height: 40rpx;
							@include flex-center();
							font-size: 20rpx;
							color: #b3baef;
							border: 1px solid #565b86;
							padding: 0 10rpx;
							border-radius: 2rpx;
							margin-right: 12rpx;
							margin-bottom: 12rpx;
						}
					}
					.bottom-link-right {
						
					}
				}
			}
		}
	}

</style>
