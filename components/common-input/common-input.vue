<template>
	<view class="common_form_item">
		<view class="item_left">
			<view class="item_label"> <text>{{label}}</text> </view>
		</view>
		<view class="item_right" @tap="selectTap">
			<view class="input_box"> 
				<input :type="type" :value="value" @input.stop="change" :disabled="disabled || isArrow" placeholder-class="placeholder" :placeholder="placeholder" />
			</view>
			<view class="arrow" v-if="isArrow">
				<u-icon name="arrow-right" color="#777CBF" height="20"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			value: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: '',
			},
			placeholder: {
				type: String,
				default: ''
			},
			isArrow: {
				type: Boolean,
				default: false
			},
			disabled:{
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: 'text'
			}
		},
		methods:{
			// 修改值
			change: function(e){
				let value = e.detail.value;
				this.$emit('input', value);
			},
			selectTap: function(){
				if(!this.isArrow){
					return
				}else{
					this.$emit('select');
				}			
			} 
			
		}
		
	}
</script>

<style lang="scss" scoped>
	.common_form_item{
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.item_left{
			.item_label{
				// font-size: 28rpx;
				// color: #FFFFFF;
				font-size: 26rpx;
				color: #959AAA;
			}
		}
		.item_right{
			display: flex;
			align-items: center;
			.input_box{
				// height: 80rpx;
				width: 300rpx;
				&>input{
					width: 100%;
					height: 80rpx;
					text-align: right;
					font-size: 26rpx;
					// color: #B4B2CF;
					color: #FFFFFF;
				}
			}
			.arrow{
				margin-left: 30rpx;
			}
		}
	}
</style>
