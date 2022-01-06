<template>
	<view class="loading">
		<!-- <image class="icon" src="/static/imgs/common/loading.gif"></image> -->
		<!-- <view class="title">{{ text }}</view> -->
		<image class="icon" src="/static/imgs/common/home-loading.gif"></image>
	</view>
</template>
<script>
	export default {
		data() {
			return {};
		},
		components: {},
		props: {
			text: {
				type: String,
				default: "拼命加载中"
			}
		},
		methods: {},
		computed: {},
		watch: {}
	};
</script>
<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 200upx;
		height: 210upx;
		border-radius: 10upx;
		/* background: rgba(0, 0, 0, 0.5); */
	}

	.loading .icon {
		/* width: 64upx;
		height: 64upx; */
		width: 108upx;
		height: 108upx;
	}
	.load_icon{
		
	}

	.loading .title {
		margin-top: 20upx;
		font-size: 26upx;
		color: #fff;
	}
</style>
