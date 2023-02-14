<template>
	<view class="pop_box" :class="{'show': popShow}">
		<view class="mask_box" @tap.stop="noneEvent" v-if="isMask"></view>
		<view class="pop_panel" :class="{'show': popShow}">
			<view class="pop_content">
				<view class="report_box">
					<view class="report_item borderBottom" @tap.stop="notViewTap">不再看他(她)</view>
					<view class="report_item borderBottom" @tap.stop="reportHandle">举报</view>
				</view>
				<view class="btn_box">
					<view class="common_btn" @tap="hide">取消</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			isMask:{
				type:Boolean,
				default: true
			}
		},
		data() {
			return {
				popShow: false,
				reportInfo: '',
			}
		},
		methods:{
			notViewTap(){
				let info = this.reportInfo;
				if(!info){
					return
				}
				let params = {
					targetId: '',
					isClub: ''
				}
				if(info.type == 'user'){
					params.targetId = info.userId || "";
					params.isClub = false;
				}else if(info.type == 'people'){
					params.targetId = info.userId || "";
					params.isClub = false;
				} else{
					params.targetId = info.clubId || "";
					params.isClub = true;
				}
				this.$u.api.notViewApi(params).then(res => {
					uni.$emit('dynamic-refresh',{msg:'dynamic-detail'})
					uni.$emit('dynamic-refresh-follow',{msg:'dynamic-detail'})
					this.$emit('notViewTap');
					this.hide();
				}).catch(e => {
					console.log('notViewApi', e);
					this.hide();
				})
			},
			reportHandle(){
				let info = this.reportInfo;
				let url = "";
				if(info.type == 'user'){
					url = `/pages/discovery/report?id=${info.id}`
				}else{
					url = `/pages/discovery/report2?id=${info.id}`
				}
				this.hide();
				this.$nav.navigateTo({url});
			},
			show(info = ""){
				if(info){
					this.reportInfo = info;
				}else{
					this.reportInfo = "";
				}
				console.log('reportShow', info);
				this.popShow = true;
			},
			hide(){
				this.popShow = false;
			},
			noneEvent(){
				this.hide();
			}
		}
	}
</script>

<style lang="scss">
	.pop_box{
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		height: 100%;
		width: 100%;
		z-index: -1;
		opacity: 0;
		transition: all 0.3s;
		&.show{
			opacity: 1;
			z-index: 210;
		}
		.mask_box{
			height: 100%;
			width: 100%;
			background: rgba(11, 13, 34, 0.6);
			position: relative;
			z-index: 5;
		}
		.pop_panel{
			position: absolute;
			left: 0rpx;
			bottom: -406rpx;
			z-index: 10;
			width: 100%;
			opacity: 0;
			transition: all 0.3s;
			&.show{
				bottom: 0rpx;
				opacity: 1;
			}
			.pop_content{
				background: $uni-title-color;
				box-sizing: border-box;
				padding-bottom: constant(safe-area-inset-bottom);
				padding-bottom: env(safe-area-inset-bottom);
				box-sizing: content-box;
				.report_box{
					width: 100%;
					box-sizing: border-box;
					padding-top: 20rpx;
					.report_item{
						height: 100rpx;
						line-height: 100rpx;
						box-sizing: border-box;
						padding: 0rpx 30rpx;
						color: #FFFFFF;
						&.borderBottom{
							border-bottom: 1px solid #e1e1e1;
						}
					}
				}
				.btn_box{
					width: 100%;
					margin-top: 40rpx;
					.common_btn{
						height: 90rpx;
						line-height: 90rpx;
						width: calc(100% - 60rpx);
						margin-left: 30rpx;
						border-radius: 50rpx;
						text-align: center;
						color: #FFFFFF;
						background: $uni-button-color;
					}
				}
			}
		}

	}
</style>
