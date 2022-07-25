<template>
	<u-popup
		v-model="show"
		mode="bottom"
		zIndex="1000"
		:bgColor="'transparent'"
		:caOverflow="true"
	>
		<view class="comment-wrap">
			<view class="eva_swiper">
				<view class="eva_select_list">
					<block v-for="(info, index) in commentList" :key="index">
						<view class="select_item" :class="{ active: info.isComment || info.isSelect }" @tap="$u.throttle(chose_comment(info))">
							<text>{{ info.name }} {{ info.num>0?info.num:'' }}</text>
						</view>
					</block>
				</view>
			</view>
			<view class="eva_btn">
				<view class="btn" @tap="$u.throttle(sendComment)"><text>确认标签</text></view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	var btnActive = true;
	export default {
		data() {
			return {
				show:false,
				id:-1,
				commentList:[],
				initInfo: {},
				hasSelectNum: 0,
			};
		},
		methods:{
			init(params){
				this.id = params.id
				this.initInfo = params;
				this.getCommentList()
			},
			open(params={}){
				this.init(params)
				this.show = true
			},
			close(){
				this.show = false
			},
			//查看短评词状态
			async getCommentList() {
				let params = {
					id: this.id
				};
				let {code,data} = await this.$u.api.commentStateApi(params)
				if(code==0) {
					let {list} = data;
					let commentList = [];
					let hasSelectNum = 0;
					list.forEach(e => {
						let info = {
							id: e.id,
							isComment: e.isComment,
							name: e.name,
							num: e.num || 0,
							isSelect: e.isComment
						}
						if(info.isSelect){
							hasSelectNum = hasSelectNum + 1;
						}
						commentList.push(info);
					})
					this.hasSelectNum = hasSelectNum;
					this.commentList = commentList;
				}
			},
			//评论
			async sendComment() {
				if(!btnActive){
					return this.$u.toast('请勿重复点击');
				}
				let idList = [];
				this.commentList.forEach((e, i) => {
					if (e.isSelect) {
						idList.push(e.id);
					}
				});
				if (idList.length == 0) {
					return this.$u.toast('请先选择评词');
				} 
				let params = {
					id: this.id, 
					idList: JSON.stringify(idList).replace(/\[|]/g, ''),
				}
				uni.showLoading({
					title: '评论中'
				})
				btnActive = false;
				let {code,data, msg} = await this.$u.api.sendCommentApi(params)
				setTimeout(() => {
					uni.hideLoading();
				}, 1200)
				if (code == 0) {
					let {commentNum} = data
					this.$u.toast('评论成功');
					this.$emit('sendComment',{id:this.id,commentNum:commentNum, mode: this.initInfo.mode})
					this.close()
				}else{
					if(msg){
						this.$u.toast('msg');
					}
				}
				btnActive = true;
			},
			//选择短评词
			chose_comment(info) {
				let hasSelectNum = this.hasSelectNum;
				if(info.isComment){
					return
				}else{
					if(this.hasSelectNum >= 4){
						if(info.isSelect){
							this.hasSelectNum = hasSelectNum - 1;
							info.isSelect = false;
						}else{
							this.$u.toast('评论已达上限')
						}
						
					}else{
						info.isSelect=!info.isSelect
						if(info.isSelect){
							this.hasSelectNum = hasSelectNum + 1;
 						}else{
							this.hasSelectNum = hasSelectNum - 1;
						}
					}
					//强制刷新
					this.$forceUpdate();
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-wrap {
		width: 100%;
		background: #2c3158;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		padding-top: 20rpx;
		box-sizing: border-box;
		position: relative;
		.eva_swiper {
			min-height: 300rpx;
			max-height: 600rpx;
			overflow-y: auto!important;
			width: 100%;
			.eva_select_list {
		
				display: flex;
				flex-wrap: wrap;
				padding: 0 30rpx 20rpx;
				.select_item {
					height: 60rpx;
					line-height: 60rpx;
					border-radius: 30rpx;
					padding: 0 30rpx;
					margin-left: 24rpx;
					margin-top: 24rpx;
					color: #ffffff;
					font-size: 24rpx;
					background: #535389;
	
					&.active {
						background: $uni-button-color;
					}
				}
			}
		
		}
		.eva_btn {
			width: 100%;
			height: 130rpx;
			padding: 20rpx 0rpx;
			border-top: 1px solid #46467b;
			.btn {
				width: calc(100% - 60rpx);
				margin-left: 30rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background: $uni-button-color;
				color: #ffffff;
				border-radius: 46rpx;
			}
		}
		
	}
	
</style>
