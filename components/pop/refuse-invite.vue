<template>
	<view class="awkward_box" v-if="show">
		<common-pop :customStyle="tipsStyle" @click="close">
			<view class="awkward_info">
				<view class="title_text"> <text>拒绝理由</text> </view>
				<view class="content_text">
					<view class="reason-item" @tap="selectIndex=index" :class="{active:index==selectIndex}" v-for="item,index in list">{{item}}</view>
				</view>
				<view class="awkward_pop">
					<view class="cancel_btn" @tap="close"> <text>我再想想</text> </view>
					<view class="awkward_btn" @tap="tapSure"> <text>我要拒绝</text> </view>
				</view>
			</view>
		</common-pop>
	</view>
</template>

<script>
	import commonPop from '@/components/pop/pop.vue'
	export default{
		props:{
			
		},
		components:{
			commonPop
		},
		data() {
			return {
				tipsStyle: {
					'top': '30%'
				},
				show:false,
				selectIndex:0,
				list:['下次再约','计划有变','身体不适'],
				
				item:{},
			}
			
		},
		methods:{
			tapSure(){
				this.$emit('sure',{item:this.item,reason:this.list[this.selectIndex]})
				this.close()
			},
			open(item){
				this.item = item
				this.show = true
			},
			close(){
				this.show = false
			},
		}
		
	}
</script>

<style lang="scss" scoped>
	.awkward_info{
		width: calc(100% - 160rpx);
		margin-left: 80rpx;
		background: #FFFFFF;
		position: relative;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		.awkward_icon{
			height: 245rpx;
			width: 284rpx;
			position: absolute;
			top: -122rpx;
		}
		.title_text{
			font-size: 36rpx;
			color: #000000;
			font-weight: 500;
		}
		.content_text{
			margin-top: 56rpx;
			padding-left: 45rpx;
			padding-right: 45rpx;
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			.reason-item {
				margin-left: 15rpx;
				margin-right: 15rpx;
				margin-top: 30rpx;
				width: calc(50% - 30rpx);
				height: 60rpx;
				@include flex-center();
				border: 1px solid #979EAB;
				color: #7E848F;
				font-size: 26rpx;
				border-radius: 40rpx;
				&.active {
					background-color: #F72EB2;
					color: #FFFFFF;
					border: none;
				}
			}
		}
		.awkward_pop{
			padding-left: 30rpx;
			padding-right: 30rpx;
			width: 100%;
			margin-top: 90rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.cancel_btn{
				width: 254rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border: 1px solid #666666;
				color: #333333;
				border-radius: 40rpx;
			}
			.awkward_btn{
				width: 254rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background: $uni-button-color;
				color: #FFFFFF;
				border-radius: 40rpx;
			}
		}
	}
</style>
