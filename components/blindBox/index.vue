<template>
	<view class="blind_box">
		<image class="bg_img" :class="{'show': show}" src="/static/imgs/blindBox/liwu_bg.png"></image>
		<view class="liwu_item_one" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view> 
		<view class="liwu_item_two" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view>
		<view class="liwu_item_third" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view>
		<view class="liwu_item_four" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view>
		<view class="liwu_item_five" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view> 
		<view class="liwu_item_six" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view>
		<view class="liwu_item_seven" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view>
		<view class="liwu_item_eight" :class="{'show': show}"> <image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> </view>
		<view class="liwu_item_nine" :class="{'show': show, 'select': selected}" @tap="selected = !selected"> 
			<image class="liwu_icon" src="/static/imgs/blindBox/liwu_icon.png"></image> 
		</view>
	</view>
</template>

<script>
	let proportion = uni.getSystemInfoSync().windowWidth / 750;
	export default {
		data() {
			return {
				show: false,
				selected: false,
				prizeDom:[
					{
						'selected': false,
						// 'style': {
						// 	top: ,
						// 	left: ,
						// },
						
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					},
					{
						'selected': false,
					}
				]
				
			}
		},
		mounted() {
			
		},
		methods:{
			showEvent(){
				this.show = true;
			},
			selectAnimation(){
				
				
			}
		}
	}
</script>

<style lang="scss">
	@mixin animationName($top, $left) {
		@keyframes selectAnimation{
			from {
				top: $top;
				left: $left;
			}
			to {
				top: 31rpx;
				left: 291rpx;
			}
		}
	}
	.blind_box{
		width: 100%;
		height: 395rpx;
		position: relative;
		z-index: 5;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		.bg_img{
			width: 594rpx;
			height: 395rpx;
			position: absolute;
			left: 103rpx;
			top: 0rpx;
			z-index: 10;
			opacity: 0;
			transition: all 1s ease-in-out;
			&.show{
				opacity: 1;
			}
		}
		
		.liwu_item_one{
			position: absolute;
			z-index: 11;
			left: 286rpx;
			// top: -65rpx;
			top: -343rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: -65rpx;
				opacity: 1;
			}
			&>image{
				width: 151rpx;
				height: 178rpx;
			}
		}
		.liwu_item_two{
			position: absolute;
			z-index: 12;
			left: 179rpx;
			// top: 0rpx;
			top: -196rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: 0rpx;
				opacity: 1;
			}
			&>image{
				width: 167rpx;
				height: 196rpx;
			}
		}
		.liwu_item_third{
			position: absolute;
			z-index: 13;
			left: 401rpx;
			// top: -40rpx;
			top: -225rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: -40rpx;
				opacity: 1;
			}
			&>image{
				width: 157rpx;
				height: 185rpx;
			}
		}
		.liwu_item_four{
			position: absolute;
			z-index: 14;
			left: 67rpx;
			// top: 80rpx;
			top: -129rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: 80rpx;
				opacity: 1;
			}
			&>image{
				width: 178rpx;
				height: 209rpx;
			}
		}
		.liwu_item_five{
			position: absolute;
			z-index: 15;
			left: 291rpx;
			// top: 31rpx;
			top: -178rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: 31rpx;
				opacity: 1;
			}
			&>image{
				width: 178rpx;
				height: 209rpx;
			}
		}
		.liwu_item_six{
			position: absolute;
			z-index: 16;
			left: 517rpx;
			// top: -16rpx;
			top: -216;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: -16rpx;
				opacity: 1;
			}
			&>image{
				width: 170rpx;
				height: 200rpx;
			}
		}
		.liwu_item_seven{
			position: absolute;
			z-index: 17;
			left: 179rpx;
			// top: 124rpx;
			top: -93rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: 124rpx;
				opacity: 1;
			}
			&>image{
				width: 185rpx;
				height: 217rpx;
			}
		}
		.liwu_item_eight{
			position: absolute;
			z-index: 18;
			left: 417rpx;
			top: -157rpx;
			// top: 63rpx;
			transition: all 1s ease-in-out;
			opacity: 0;
			&.show{
				top: 63rpx;
				opacity: 1;
			}
			&>image{
				width: 185rpx;
				height: 217rpx;
			}
		}
		.liwu_item_nine{
			position: absolute; 
			z-index: 19;
			left: 302rpx;
			// top: 144rpx;
			top: -88rpx;
			transition: all 1s ease-in-out;
			transform: scale(1);
			opacity: 0;
			&.show{
				top: 144rpx;
				opacity: 1;
			}
			&>image{
				width: 197rpx;
				height: 232rpx;
			}
		}
	}
</style>
