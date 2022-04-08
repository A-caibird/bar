<template>
	<view>
		<u-popup v-model="statementShow" mode="bottom">
			<view class="statement">
				<view class="statement_title">常用语</view>
				<scroll-view class="statement_box" :scroll-y="true">
					<block v-for="(item, index) in statementList" :key="index">
						<view class="statement_item" @tap="statementIndex = index">
							<view class="statement_item_text">{{item}}</view>
							<view class="statement_item_select">
								<image class="select_icon" src="/static/imgs/common/select.png" v-if="statementIndex == index"></image>
								<image src="/static/imgs/common/no-select.png" v-else></image>
							</view>
						</view>
					</block>
				</scroll-view>
				<view class="statement_btn" @tap="$u.throttle(btnTap)">{{btnText}}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {yaoyueStatement} from '@/common/selector.js'
	export default {
		props:{
			btnText: {
				type: String,
				default: '发送'
			},
		},
		data() {
			return {
				statementList: yaoyueStatement,
				statementIndex: -1,
				statementShow: false,
			}
		},
		methods:{
			show(){
				this.statementShow = true;
			},
			close(){
				this.statementShow = false;
			},
			btnTap(){
				if(this.statementIndex==-1){
					return this.$toast.text('请选择常用句！')
				}else {
					let statement = this.statementList[this.statementIndex];
					this.$emit('btnTap', statement)
					this.close();
				}
			}
		}
	}
</script>

<style lang="scss">
	.statement{
		width: 100%;
		background: #2c3158;
		// @include saveDistanceBottom();
		padding-bottom: 60rpx;
		box-sizing: border-box;
		&_title{
			line-height: 100rpx;
			width: 100%;
			text-align: center;
			font-size: 30rpx;
			color: #FFFFFF;
		}
		&_box{
			box-sizing: border-box;
			padding: 0 20rpx;
			width: 100%;
			height: 400rpx;
			overflow: hidden;
			white-space: nowrap;
			margin-bottom: 20rpx;
			.statement_item{
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				&_text{
					font-size: 28rpx;
					color: #FFFFFF;
				}
				&_select{
					height: 40rpx;
					width: 40rpx;
					&>image{
						height: 100%;
						width: 100%;
						vertical-align: top;
					}
				}
			}
		}
		&_btn{
			width: calc(100% - 40rpx);
			margin-left: 20rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 50rpx;
			background: linear-gradient(270deg, #BB0CF9, #F92FAF);
			color: #FFFFFF;
		}
	}
</style>
