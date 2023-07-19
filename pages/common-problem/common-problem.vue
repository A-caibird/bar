<template>
	<view class="page-wrap">
		<u-navbar back-icon-color="#FFFFFF" title="常见问题" title-size="36" title-color="#FFFFFF"
			:background="{ background: '#16192B' }" :border-bottom="false"></u-navbar>
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
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad() {
			this.load()
		},
		methods: {
			load() {
				this.getCommonProblemList()
			},
			async getCommonProblemList() {
				let {
					code,
					data
				} = await this.$u.api.getCommonProblemListApi({})
				if (code == 0) {
					let {
						list
					} = data
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
					padding: 20rpx 20rpx 20rpx 20rpx;
                    background: rgba(255,255,255,0.05);
					border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16rpx;
					margin-bottom: 35rpx;
					.title {
						font-size: 30rpx;
						color: #FFFFFF;
						line-height: 42rpx;
						font-weight: 400;
						margin-bottom: 20rpx;
					}

					.answer {
						text {
							font-size: 28rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #979797;
							line-height: 40rpx;
						}

					}
				}
			}
		}
	}
</style>