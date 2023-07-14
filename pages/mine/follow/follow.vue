<template>
	<view class="container">
			<u-navbar back-icon-color="#FFFFFF" title="我的关注" title-size="36" title-color="#FFFFFF" :background="{
						'background': '#16192B'
					}" :border-bottom="false">
				
			</u-navbar>
		
		<view class="follow-person">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="person-item" v-for="item,index in pageList" :key="index">
					<view class="item-left" @tap="$u.throttle(goPersonalHomepage(item.id))">
						<image :src="item.avatar" mode=""></image>
						<text class="item-name">{{item.nickName}}</text>
					</view>
					<view class="item-right-unfollow" v-if="item.hasFollow == true">
						<button type="default" @tap="tapToggleFollow(item.hasFollow,item.id)">已关注</button>
					</view>
					<view class="item-right-follow" v-if="item.hasFollow == false">
						<button type="default" @tap="tapToggleFollow(item.hasFollow,item.id)">关 注</button>
					</view>
				</view>
			</mescroll-uni>
			
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	export default{
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data(){
			return{
				
				downOption:{
					auto:true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 20 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					
				},
				url:'/api/user/myAttentionList',
				
			}
		},
		methods:{
			async tapToggleFollow(hasFollow,id){
				let params={
					userId:id
				};
				if(hasFollow){
					await this.$toast.confirm('','确定要取消关注该用户吗？')
					let {code} = await this.$u.api.noattenchApi(params)
					if(code==0) {
						uni.$emit('personal-info-refresh')
						await this.setList('id',id,{hasFollow:false},this.pageList)
					}
					
				} else{
					let {code} = await this.$u.api.orattenchApi(params)
					if(code==0) {
						uni.$emit('personal-info-refresh')
						await this.setList('id',id,{hasFollow:true},this.pageList)
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		height: 100%;
		.container{
			height: 100%;
			display: flex;
			flex-direction: column;
			.follow-person{
				flex: 1;
				min-width: 0;
				min-height: 0;
				display: flex;
				flex-direction: column;
				padding: 0 30rpx;
					.person-item{
						display: flex;
						justify-content: space-between;
						align-items: center;
						width: 100%;
						height: 150rpx;
						.item-left{
							display: flex;
							align-items: center;
							image{
								width: 90rpx;
								height: 90rpx;
								border-radius: 45rpx;
							}
							.item-name{
								font-size: 32rpx;
								color: #FFFFFF;
								padding-left: 38rpx;
							}
						}
						.item-right-follow{
							button{
								width: 149rpx;
								height: 50rpx;
								background: #F72EB2;
								border: 1rpx solid #535389;
								border-radius: 25rpx;
								font-size: 24rpx;
								@include flex-center();
								color: #FFFFFF;
							}
						}
						.item-right-unfollow{
							button{
								width: 149rpx;
								height: 50rpx;
								background: #535389;
								border: 1rpx solid #535389;
								border-radius: 25rpx;
								font-size: 24rpx;
								@include flex-center();
								color: #FFFFFF;
							}
						}
					}
				
		
			}
		}
	}

</style>
