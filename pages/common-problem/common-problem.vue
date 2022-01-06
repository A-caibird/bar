<template>
	<view class="page-wrap">
		<u-navbar back-icon-color="#FFFFFF" title="常见问题" title-size="36" title-color="#FFFFFF" :background="{ background: '#191C3F' }"
		 :border-bottom="false"></u-navbar>
		<view class="problem-list">
			<view class="problem-wrap" v-for="item in list">
				<view class="title">
					Q: {{item.name}}
				</view>
				<view class="answer">
					<text>{{item.answer}}</text>
					
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var app = getApp();
	export default{
		data() {
			return {
				list:  [],
			}
		},
		onLoad() {
			this.load()
		},
		methods:{
			load(){
				this.getCommonProblemList()
			},
			async getCommonProblemList(){
				let {code,data} = await this.$u.api.getCommonProblemListApi({})
				if(code==0) {
					let {list} = data
					this.list = list
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.page-wrap {
			min-height: 100%;
			.problem-list {
				padding-left: 30rpx;
				.problem-wrap {
					padding: 30rpx 40rpx 20rpx 0;
					border-bottom: 1px solid #31345B;
					.title {
						font-size: 30rpx;
						color: #FFFFFF;
						font-weight: 700;
						margin-bottom: 20rpx;
					}
					.answer {
						text {
							font-size: 26rpx;
							color: #72729E;
						}
						
					}
				}
			}
		}
	}
</style>
