<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="我的酒库" title-size="36" title-color="#FFFFFF" :background="{'background': '#16192B'}"
		 :border-bottom="false">
			<view @tap="$u.throttle($u.route('pages/mine/wineCellar/wineRecord'))" class="header-box-right" slot="right">
				取酒记录
			</view>
		</u-navbar>
		<view class="tip">提示：订单确认到店后才可以取酒</view>
		<view class="order-info-box" >
			<wine-cellar ref="wineCellRef"></wine-cellar>
		</view>
	</view>
</template>

<script>
	import wineCellar from '@/components/winecellar-list/winecellar-list.vue'
	export default {
		components: {
			wineCellar
		},
		data() {
			return {
				
			}
		},
		onLoad() {
			uni.$on('refreshWineCellList',(id) => {
				this.$refs.wineCellRef.readWineCellPage(id)
			})
		},
		onUnload() {
			uni.$off('refreshWineCellList')
		},
		methods: {
			
			
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.container {
			height: 100%;
			
			display: flex;
			flex-direction: column;
			.header-box-right {
				color: #FFFFFF;
				font-size: 28rpx;
				padding-right: 30rpx;
			}
			.tip {
				padding: 30rpx;
				@include height-center();
				color: #ffffff;
				font-size: 30rpx;
				background: #16192B; // Acaibird 颜色修改
			}
			.order-info-box {
                background-color: #16192B; // Acaibird 颜色修改
				flex: 1;
				min-width: 0;
				min-height: 0;
			}
			
		
		}
		
	}
	
</style>
