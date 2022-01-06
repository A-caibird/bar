<template>
	<view class="empty-container" >
		<view class="empty-content">
			<image :src="imgSrc" :style="`width:${imgWidth}rpx;`+`height:${imgHeight}rpx;`+`margin-bottom: ${imgTextDistance}rpx;`"></image>
			<view :style="`color:${fontColor};`+`font-size: ${textFont}rpx;`">{{content}}</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		props: {
			
			fontColor: {
				type: String,
				default () {
					return '#FFFFFF'
				}
			},
			imgSrc: {
				type: String,
				default () {
					return '/static/imgs/common/empty-icon.png'
				}
			},
			textFont: {
				type: Number,
				default () {
					return 30
				}
			},
			imgTextDistance: {
				type: Number,
				default () {
					return 48
				}
			},
			imgWidth: {
				type: Number,
				default () {
					return 150
				}
			},
			imgHeight: {
				type: Number,
				default () {
					return 150
				}
			},
			content: {
				type: String,
				default () {
					return '暂无内容'
				}
			},
			
		},

		data() {
			return {
				
			}
		},
		methods: {
		},
		

	}
</script>

<style lang="scss" scoped>
	.empty-container {
		width: 100%;
		height: 100%;
		@include flex-center();
		.empty-content {
			
			image {
				
			}
			view {
				@include flex-center();
			}
		}
	}

	
	
</style>
