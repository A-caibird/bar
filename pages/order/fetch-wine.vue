<template>
	<view class="container">
		<u-navbar back-icon-color="#FFFFFF" title="存酒记录" title-size="36" title-color="#FFFFFF" :background="{'background': '#191C3F'}"
		 :border-bottom="false"></u-navbar>
		<view class="wine-list-wrap">
			<view class="list">
				<view class="item" v-for="item in list" :key="item.id" @tap="toggleSelect(item)">
					<view class="select-block" >
							<image class="selected" src="/static/imgs/common/select.png" v-if="item.isSelect"></image>
							<image class="selected" src="/static/imgs/mine/no-select.png" v-else></image>
						
					</view>
					<view class="wine-info">
						<view class="line-wrap">
							<view class="item-wrap">
								<view class="wine-name">{{item.commodity.name}}</view>
							</view>
							<view class="item-wrap">
								<view class="date">到期时间：{{item.endDate}}</view>
							</view>
						</view>
						<view class="line-wrap">
							<view class="item-wrap">
								<view class="surplus-num">剩余可取：{{item.surplusNum}}</view>
							</view>
							<view class="item-wrap">
								<view class="withdrawals">
									<text class="withdrawals-text">取出数量：</text>
									<template v-if="item.isSelect">
										<!-- <self-number-box :max="item.surplusNum" color="#FFFFFF" size="26" inputHeight="35" inputWidth="50"  v-model="item.takeNum" :longPress="false "></self-number-box> -->
										<self-number-box :min="1" :max="item.surplusNum" color="#FFFFFF" size="26" inputHeight="35" inputWidth="50" :value="item.takeNum"  @plus="plusTakeNum(item)" @minus="minusTakeNum(item)" :longPress="false "></self-number-box>
									</template>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-btn">
			<view class="all-btn" @tap="toggleAllSelect">
				<text>{{allSelect?'取消全选':'全选'}}</text>
			</view> 
			<view class="submit-btn" @tap="tapSubmit">
				<text>取酒</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				orderId:'',
				list:[],
				allSelect:false,
			}
		},
		onLoad(opt) {
			this.orderId = opt.orderId
			this.load()
		},
		methods: {
			load(){
				this.getFetchWineList()
			},
			toggleAllSelect(){
				if(this.allSelect) {
					this.list.forEach(e=>{
						e.isSelect = false
					})
					this.allSelect = false
				} else {
					this.list.forEach(e=>{
						e.isSelect = true
					})
					this.allSelect = true
				}
				this.$forceUpdate()
			},
			loadAllSelect(){
				let index = this.list.findIndex(e=>{
					return !e.isSelect
				})
				if(index==-1&&this.list.length>0) {
					this.allSelect = true
				} else {
					this.allSelect = false
				}
			},
			toggleSelect(item){
				item.isSelect = !item.isSelect
				this.loadAllSelect()
				this.$forceUpdate()
			},
			async getFetchWineList(){
				let {code,data} = await this.$u.api.getFetchWineListApi({orderId:this.orderId})
				if(code==0) {
					data.list.forEach(e=>{
						e.takeNum = e.surplusNum
					})
					this.list = data.list
					console.log(this.list)
				}
			},
			plusTakeNum(item){
				item.takeNum++
				this.$forceUpdate()
			},
			minusTakeNum(item){
				item.takeNum--
				this.$forceUpdate()
			},
			geInfoList(){
				let list = []
				let saveWineIdList = []
				let finalList = []
				this.list.forEach(e=>{
					if(e.isSelect) {
						list.push({
							saveWineId:e.saveWineId,
							takeNum:e.takeNum,
							commodityId :e.commodity.id,
						})
						saveWineIdList.push(e.saveWineId)
					}
				})
				saveWineIdList =  Array.from(new Set(saveWineIdList))
				saveWineIdList.forEach(e1=>{
					let objList = []
					list.forEach(e2=>{
						if(e2.saveWineId==e1) {
							objList.push({
								takeNum:e2.takeNum,
								commodityId :e2.commodityId,
							})
						}
					})
					finalList.push({
						saveWineId:e1,
						objList
					})
				})
				console.log(finalList)
				return finalList
			},
			async tapSubmit(){
				let index = this.list.findIndex(e=>{
					return e.isSelect
				})
				if(index==-1) return this.$toast.text('请至少选择一个套餐！')
				
				await this.$toast.confirm('','确定要取出这些套餐吗？')
				let info = JSON.stringify(this.geInfoList())
				let params = {
					orderId:this.orderId,
					info
				}
				let {code} = await this.$u.api.fetchWineApi(params)
				if(code==0) {
					this.$toast.text('取酒成功！')
					uni.$emit('fetch-wine')
					setTimeout(()=>{
						this.$u.route({
							type:'back'
						})
					},500)
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		.container {
			height: 100%;
			
			display: flex;
			flex-direction: column;
			.wine-list-wrap {
				flex: 1;
				min-width: 0;
				min-height: 0;
				overflow-y: auto;
				.list {
					padding: 0 30rpx;
					.item {
						border-radius: 10rpx;
						background-color: #2C3158;
						padding: 20rpx;
						margin-top: 30rpx;
						@include height-center();
						height: 200rpx;
						.select-block {
							height: 100%;
							width: 80rpx;
							@include flex-center();
							.selected {
								width: 30rpx;
								height: 30rpx;
							}
						
						}
						.wine-info {
							flex: 1;
							min-width: 0;
							height: 100%;
							display: flex;
							flex-direction: column;
							.line-wrap {
								flex: 1;
								min-width: 0;
								min-height: 0;
								@include height-center();
								
								.item-wrap {
									flex: 1;
									min-width: 0;
									height: 100%;
									@include height-center();
									.wine-name {
										color: #FFFFFF;
										font-size: 28rpx;
									}
									.date {
										color: #FFFFFF;
										font-size: 28rpx;
									}
									.surplus-num {
										color: #FFFFFF;
										font-size: 28rpx;
									}
									.withdrawals {
										@include height-center();
										.withdrawals-text {
											color: #FFFFFF;
											font-size: 28rpx;
										}
									}
								}
							}
						}
					}
				}
			}
			
			.bottom-btn {
				height: 100rpx;
				@include height-center();
				justify-content: space-between;
				background-color: #191c3f;
				padding-right: 30rpx;
				border-top: 1px solid #31345B;
				.all-btn {
					padding: 0 30rpx;
					height: 100%;
					background: linear-gradient(270deg,#bb0cf9 0%, #f92faf 5%);
					@include height-center();
					text {
						color: #FFFFFF;
						font-size: 30rpx;
						margin-right: 10rpx;
					}
					.select-view {
						border: 1px solid #fff;
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
						@include flex-center();
						image {
							width: 16rpx;
							height: 12rpx;
						}
					}
				}
				.submit-btn {
					width: 170rpx;
					height: 60rpx;
					border-radius: 40rpx;
					
					background: linear-gradient(270deg,#bb0cf9 0%, #f92faf 5%);
					@include flex-center();
					text {
						color: #FFFFFF;
						font-size: 30rpx;
					}
				}
			}
		}
		
	}
	
</style>
