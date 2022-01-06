<template>
	<view class="page-wrap">
		<view class="list-wrap">
			<view class="list">
				<block v-for="item in list" :key="item.id">
					<view class="item" @tap="tapSelect(item)">
						<view class="left-wrap">
							<image :src="item.avatar" @tap.stop="$u.throttle(previewImg(item.avatar))"></image>
						</view>
						<view class="right-wrap">
							<view class="name">{{item.name}}</view>
							<view class="gender">{{item.sex}}</view>
						</view>
						<template v-if="receptionistId==item.id">
							<view class="select-wrap">
								<image src="/static/imgs/discovery/tick.png" mode=""></image>
							</view>
						</template>
					
					</view>
				</block>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				clubId:'',
				date:'2021-04-07',
				list:[
					// {
					// 	"id": 48415,
					// 	"name": "111 撒时间的卢卡斯几点啦技术的拉升阶段卢卡斯几点啦手机丢了就爱上了大家爱上了空间的卢卡斯基督教埃里克圣诞节",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113164523409.png",
					// 	gender: '男'
					// }, {
					// 	"id": 48421,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484212,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484213,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484214,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484215,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484216,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484217,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484218,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484219,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }, {
					// 	"id": 484210,
					// 	"name": "接待员一号",
					// 	"avatar": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210113/AP-20210113165247339.png",
					// 	gender: '女'
					// }
				],
			}
		},
		onLoad(opt) {
			let {clubId,receptionistId,date} = opt
			this.clubId = clubId
			this.date = date
			this.receptionistId = receptionistId
			this.load()
		},
		methods: {
			load(){
				this.getStaffList()
			},
			async getStaffList(){
				let {code,data} = await this.$u.api.getReceptionistListApi({clubId:this.clubId,date:this.date})
				if(code==0) this.list = data.list
			},
			tapSelect(e){
				uni.$emit('select-receptionist',e)
				this.$u.route({
					type:'back'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		.page-wrap {
			min-height: 100vh;
			background: $uni-title-color;
			.list-wrap {
				padding: 0 15rpx;
				.list {
					.item  {
						border-bottom: 1px solid #31345B;
						padding: 20rpx;
						@include height-center();
						&:last-child {
							border-bottom: none;
						}
						.left-wrap {
							padding: 20rpx;
							image {
								width: 90rpx;
								height: 90rpx;
								border-radius: 50%;
							}
						}
						.right-wrap {
							flex: 1;
							min-width: 0;
							height: 90rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.name {
								@include ellipsis();
								width: 100%;
								color: #FFFFFF;
								font-size: 32rpx;
							}
							.gender {
								color: #FFFFFF;
								font-size: 26rpx;
							}
						}
						.select-wrap {
							padding-left: 50rpx;
							height: 90rpx;
							@include height-center();
							image {
								width: 32rpx;
								height: 24rpx;
							}
						}
					}
				}
			}
		}
	}
		
</style>
