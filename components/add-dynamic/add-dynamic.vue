<template>
	<view class="add_box" v-if="show" @tap.stop="close" :style="`bottom:${bottomHeight}px;`">
		<view class="cancel">
			<view class="icon_box" @tap.stop="close">
				<u-icon name="close" color="#FFFFFF" size="40"></u-icon>
			</view>
		</view>
		<view class="btns">
			<view class="common_btn" @tap.stop="$u.throttle(tapGoAddNew)">
				<image src="/static/imgs/index/add_new.png"></image>
				<text>新增动态</text>
			</view>
			<view class="common_btn" @tap.stop="$u.throttle(tapGoClub)">
				<image src="/static/imgs/index/add_share.png"></image>
				<text>我要拼享</text>
			</view>
		</view>
		<pop
			v-if="popShow"
			title="拼享提醒" 
			content="您当前没有订单，请先在酒吧下单后邀约人一起拼享订单吧" 
			cancelText="等等再下单" confirmText="去下订单"
			:isMask="true"
			@cancel="popCancelTap"
			@confirm="popConfirmTap"
		></pop>
	</view>
</template>

<script>
	import pop from '@/components/commonPop/pop.vue'
	export default{
		components:{
			pop
		},
		props:{
			bottomHeight:{
				type:Number,
				default:50,
			}
			
		},
		data(){
			return {
				show:false,
				popShow: false,
			}
		},
		methods:{
			popCancelTap(){
				this.close();
			},
			popConfirmTap(){
				this.close();
				uni.navigateTo({
					url: '/pages/club/list?mode=list'
				})
			},
			tapGoAddNew(){
				this.$u.route('/pages/discovery/addDynamic')
				this.show = false
			},
			tapGoClub(){
				// this.show = false
				// this.$emit('goClubList')
				this.popShow = true;
			},
			open(){
				this.show = true
			},
			close(){
				this.show = false
				this.popShow = false
			},
			
		},
		
	}
</script>

<style lang="scss" scoped>
	.add_box{
		position: fixed;
		top:0;
		right: 0;
		left: 0;
		
		z-index: 996;
		background: $uni-title-color;
		// background: red;
		width: 100%;
		display: flex;
		flex-direction: column-reverse;
		.btns{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			.common_btn{
				display: flex;
				align-items: center;
				flex-direction: column;
				&>image{
					width: 120rpx;
					height: 120rpx;
				}
				&>text{
					font-size: 30rpx;
					color: #FFFFFF;
					margin-top: 30rpx;
				}
			}
		}
		.cancel{
			height: 200rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
