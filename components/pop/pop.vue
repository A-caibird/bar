<template>
	<view class="pop_box" >
		<u-mask :show="true" @click="click" :customStyle="{
			'opacity': 0.5
		}"></u-mask>
		<view class="slot-content" :style="customStyle">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			customStyle: Object,		
		},
		methods:{
			click: function(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pop_box{
		position: fixed;
		height: 100vh;
		width: 100%;
		top: 0rpx;
		left: 0rpx;
		z-index: 1000;
		.slot-content{
			position: absolute;
			z-index: 10080;
			width: 100%;
			left: 0rpx;
		}
	}
</style>
