<template>
	<view class="rate_box">
		<view class="rate_imgs">
			<block v-for="(img, index) in imgsList" :key="index">
				<image :src="`/static/imgs/eva/${img}.png`" :style="{
					'height': size + 'rpx',
					'width': size + 'rpx',
					'marginRight': (size/3) + 'rpx',
				}"></image>
			</block>
		</view>
	</view>
</template>

<script>
	const Empty = 'empty';
	const EmptyHalf = 'empty_half';
	const Half = 'half';
	const HalfHalf = 'half_half';
	const Full = 'full';
	export default{
		props:{
			count: {
				type: [String, Number],
				default: 5
			},
			score: {
				type:[String, Number],
				default: 5
			},
			size: {
				type:[String, Number],
				default: 30, //单位是rpx
			}
		},
		mounted:function(){
			this.$nextTick(() => {
				let score = this.score || 0;
				this.imgsListFactory(score);
			})
		},
		data() {
			return {
				imgsList:[],
			}
		},
		methods:{
			imgsListFactory: function(score){
				let scoreTemp = score;
				let count = this.count;
				let imgs = [];
				let imgItem = "";
				if(score<= 0 || score >= count ){
					if(score <= 0) imgItem = Empty;
					if(score >= count) imgItem = Full;
					for(let i=0;i<count;i++){
						imgs.push(imgItem);
					}
				}else{
					
					let integer = parseInt(score);
					let remainder = score*10 - integer*10 ; //扩大10后
					// console.log(score);console.log(integer);console.log(remainder);
					for(let i=0;i<count;i++){
						if(i < integer){
							imgItem = Full;
						} else if(i == integer){
							// 判断整数后一位余数大小
							imgItem = this.remainderImg(remainder);
						} else{
							imgItem = Empty;
						}
						imgs.push(imgItem);
					}	
				}
				this.imgsList = imgs
			},
			remainderImg: function(remainder){
				let item = "";
				if(remainder == 0){
					item = Empty;
				}else if(remainder< 5 & remainder > 0){
					item = EmptyHalf;
				}else if(remainder == 5){
					item = Half;
				} else{
					item = HalfHalf;
				}
				return item;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.rate_box{
		width: 100%;
		.rate_imgs{
			width: 100%;
			display: flex;
			&>image{
				height: 30rpx;
				width: 30rpx;
				margin-right: 15rpx;
			}
		}
	}
</style>
