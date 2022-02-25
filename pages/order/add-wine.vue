<template>
	<view class="container">
		<u-navbar :border-bottom="false" :is-fixed="true" :background="{'background': '#191C3F'}" title="加单酒水"title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		<view class="middle_box">
			<view class="classify_box">
				<classify height="100" fontSize="28" bgColor="#191C3F" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false"
			 swiperWidth="750" inactiveColor="#B7B9D6" activeColor="#ffffff" :activeItemStyle="{'font-size': '34rpx'}"></classify>
			</view>
			<view class="drinks_content">
				<swiper :current="current" @animationfinish="animationfinish">
					<swiper-item v-for="(item,index) in list">
						<drinks-goods-list :ref="`goods-list${index}`" :i="index" :index="current" :goodsId="item.id" :clubId="clubId" @listRefresh="setSCNumOne(index)" @tapItem="tapGoDetail($event.id,$event.count)" @plus="handleCommodityPlus($event)" @minus="handleCommodityMinus($event)"></drinks-goods-list>
					</swiper-item>
				</swiper>
			</view>
			
		</view>
		<u-popup v-model="cartShow" mode="bottom" :customStyle="{height: `calc(100vh - 120rpx)`}" zIndex="100">
			<view class="cart_box">
				<view class="cart_title">
					<view class="title_box">
						<text>购物车</text>
						<view class="clear_box" @tap="tapShoppingCardEmptyApi">
							<image src="/static/imgs/common/delete_icon.png"></image>
							<text>清空购物车</text>
						</view>
					</view>
				</view>
				
				<cart type="adding" v-for="(item,index) in shopingCartList" :key="item.id" :noBorder="index+1==shopingCartList.length" :info="item" @plus="handleCommodityPlus(item.commodity)" @minus="handleCommodityMinus(item.commodity)"></cart>
			</view>
		</u-popup>
		<view class="footer_box">
			<view class="price_text">
				<text>{{allAmount}}元</text>
			</view>
			<view v-if="calcShoppingCartNum>0" class="common_item" style="position: absolute;right:  330rpx;" @tap="openShoppingCart">
				<view class="commom_item_panel" style="position: relative;">
					<view class="car_icon">
						<image src="/static/imgs/common/shopping-cart.png"></image>
						<u-badge :offset="[-20,-20]" :count="calcShoppingCartNum" bgColor="#F52DB3" type="error" class="badge"></u-badge>
					</view>
					<text>购物车</text>
				</view>
			</view>
			<view class="btn_text" :class="{active:canOrder}" @tap="$u.throttle(tapGoCreateOrder)">
				<text>加单</text>
			</view>
		</view>
	</view>
</template>

<script>
	import classify from '@/components/classify/classify.vue'
	import cart from '@/components/cart-item/cart-item.vue'
	export default {
		mixins: [],
		components: {
			classify,
			cart
		},
		data() {
			return {
				cartShow: false,
				current: 0,
				list: [],
				
				allAmount:0,
				shopingCartList:[],
				
				//传递的参数
				data:{},
				
				seatInterval:'',
				seatIntervalStop:false,
				
				closeInterval:'',
				closeTime:0,
				
				orderId:-1,
				clubId:-1,
			}
		},
		computed:{
			canOrder(){
				return this.allAmount>0
			},
			calcShoppingCartNum(){
				let num = 0
				this.shopingCartList.forEach(e=>{
					num+= e.buyNum
				})
				return num
			},
		},
		watch:{
			
		},
		onLoad(opt) {
			
			let {orderId,clubId} = opt
			this.orderId = orderId
			this.clubId = clubId
			this.load()
			
			uni.$on('refresh-add-wine',this.getShoppingCardView)
		},
		onUnload() {
			uni.$off('refresh-add-wine',this.getShoppingCardView)
		},
		onHide() {
			console.log('hide')
			this.seatIntervalStop = true
		},
		methods:{
			animationfinish({
				detail: {
					current
				}
			}) {
				this.current = current;
			},
			
			tapGoDetail(id,count){
				this.$u.route('/pages/order/add-wine-goods-detail',{id,count,orderId:this.orderId})
			},
		
			sendSeat(){
				if(this.seatIntervalStop) return 
			},
			
			tapGoCreateOrder(){
				if(!this.canOrder) return
				this.$u.route({
					type:'redirectTo',
					url:'pages/club/consumption/payPage',
					params:{
						allAmount:this.allAmount,
						orderId:this.orderId,
						type:'add-wine',
						distance:1,
					},
				})
 			},
			async tapShoppingCardEmptyApi(data){
				let {code} = await this.$u.api.addWineEmptyApi({
					orderId:this.orderId
				})
				if(code==0) {
					this.getShoppingCardView()
					this.cartShow = false
				}
				
			},
			async shoppingCardAdd(data){
				let {code} = await this.$u.api.addWineApi(data)
				if(code==0) this.getShoppingCardView()
			},
			async shoppingCardDelete(data){
				let {code} = await this.$u.api.addWineApiDeleteApi(data)
				if(code==0) this.getShoppingCardView()
			},
			handleCommodityPlus(info){
				let data = {
					orderId:this.orderId,
					commodityId:info.id
				}
				console.log(data)
				this.shoppingCardAdd(data)
			},
			handleCommodityMinus(info){
				let data = {
					orderId:this.orderId,
					commodityId:info.id
				}
				console.log(data)
				this.shoppingCardDelete(data)
			},
			setSCNum(){//将购物车中的数值设置到商品列表中
				let shopingCartList = this.$u.deepClone(this.shopingCartList)
				let vm = this
				this.list.forEach((e,i)=>{
					vm.$refs[`goods-list${i}`][0].setSCNum(shopingCartList)
				})
			},
			setSCNumOne(index){
				console.log(index)
				let shopingCartList = this.$u.deepClone(this.shopingCartList)
				this.$refs[`goods-list${index}`][0].setSCNum(shopingCartList)
			},
			openShoppingCart(){
				if(this.cartShow)  {
					this.cartShow = false
				} else {
					this.cartShow = true
					this.getShoppingCardView()
				}
				
			},
			load(){
				this.getCommodityCategoriesList()
				this.getShoppingCardView()
			},
			async getShoppingCardView(){
				let {code,data} = await this.$u.api.getAddWineShoppingCart({
					orderId:this.orderId
				})
				console.log(data)
				if(code==0) {
					this.allAmount = data.allAmount
					this.shopingCartList = data.list
					this.setSCNum()
				}
				
			},
			
			async getCommodityCategoriesList(){
				let {code,data} = await this.$u.api.getCommodityCategoriesListApi({id:this.clubId})
				if(code==0) {
					let {list} = data
					
					this.list = [...[{id:'',name:'全部'}],...list]
					console.log(this.list)
				}
				
			},
			change: function(index){
				this.current = index;
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
			.middle_box{
				flex: 1;
				min-width: 0;
				min-height: 0;
				display: flex;
				flex-direction: column;
				.club_img {
					height: 435rpx;
					width: 100%;
					background: #191C3F;
					image{
						width: 100%;
						height: 100%;
					}
					
				}
				.classify_box{
					padding: 20rpx 0rpx;
					width: 100%;
					background: $uni-title-color;
				}
				
				.drinks_content{
					flex: 1;
					min-width: 0;
					min-height: 0;
					padding: 0 30rpx;
					swiper {
						height: 100%;
						swiper-item {
							height: 100%;
						}
					}
				}
			}
			.cart_box{
				background: #2C3158;
				.cart_title{
					width: 100%;
					.title_box{
						width: calc(100% - 60rpx);
						margin-left: 30rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						position: relative;
						color: #FFFFFF;
						font-size: 30rpx;
						height: 90rpx;
						border-bottom: 1px solid #373E6E;
						.clear_box{
							display: flex;
							align-items: center;
							position: absolute;
							right: 0rpx;
							&>image{
								height: 24rpx;
								width: 23rpx;
							}
							&>text{
								color: #FFFFFF;
								font-size: 24rpx;
								margin-left: 13rpx;
							}
						}
					}
				}
			}
			.footer_tips{
				height: 70rpx;
				box-sizing: border-box;
				padding-left: 30rpx;
				font-size: 28rpx;
				color: #FFFFFF;
				width: 100%;
				line-height: 70rpx;
				background-color: #20234B;
			}
			.footer_box{
				
				z-index: 101;
				height: 120rpx;
				width: 100%;
				display: flex;
				align-items: center;
				background: $uni-title-color;
				// border-top: 1px solid #31345B;
				.price_text{
					font-size: 34rpx;
					color: #FFFFFF;
					margin-left: 30rpx;
				}
				.common_item{
					.commom_item_panel{
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						.car_icon{
							height: 34rpx;
							width: 34rpx;
							position: relative;
							&>image{
								width: 100%;
								height: 100%;
							}
						}			
						&>text{
							font-size: 22rpx;
							color: #FFFFFF;
							margin-top: 10rpx;
						}
					}
				}
				.btn_text{
					height: 80rpx;
					width: 300rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					color: #FFFFFF;
					border-radius: 48rpx;
					position: absolute;
					right: 30rpx;
					background: #82799B;
					&.active{
						background: $uni-button-color;
					}
					&>image{
						height: 30rpx;
						width: 30rpx;
						background: #FFFFFF;
						margin-right: 14rpx;
					}
				}
			}
		}
		
	}
	

</style>
