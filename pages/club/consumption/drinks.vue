<template>
	<view class="container">
		<u-navbar :border-bottom="false" :is-fixed="true" :background="{'background': '#191C3F'}" :title="data.clubName" title-color="#FFFFFF" back-icon-color="#FFFFFF"></u-navbar>
		<view class="middle_box">
			<view class="classify_box">
				<classify height="100" fontSize="28" bgColor="#191C3F" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false"
			 swiperWidth="750" inactiveColor="#B7B9D6" activeColor="#ffffff" :activeItemStyle="{'font-size': '34rpx'}"></classify>
			</view>
			<view class="drinks_content">
				<swiper :current="current" @animationfinish="animationfinish">
					<swiper-item v-for="(item,index) in list">
						<drinks-goods-list :ref="`goods-list${index}`" :i="index" :index="current" :goodsId="item.id" :clubId="data.clubId" @listRefresh="setSCNumOne(index)" @tapItem="tapGoDetail($event.id,$event.count)" @plus="handleCommodityPlus($event)" @minus="handleCommodityMinus($event)"></drinks-goods-list>
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
				
					
				<cart v-for="(item,index) in shopingCartList" :key="item.id" :noBorder="index+1==shopingCartList.length" :info="item" @plus="handleCommodityPlus(item.commodity)" @minus="handleCommodityMinus(item.commodity)"></cart>
			</view>
		</u-popup>
		<view class="footer_tips"> 
			<text>您当前{{data.seat.sn}}座位需要消费最低</text> 
			<text style="color: #FF76DF;">{{data.seat.count}}元</text>
		</view>
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
				<text>下单</text>
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
				
				bannerList:[],
				
				
				//传递的参数
				data:{},
				
				seatInterval:'',
				seatIntervalStop:false,
				
				closeInterval:'',
				closeTime:0,
			}
		},
		computed:{
			canOrder(){
				return this.data.seat.count<=this.allAmount
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
			this.data = this.$u.deepMerge(this.data,JSON.parse(opt.data))
			this.load()
			
			this.clearInterval = setInterval(this.jusgeEndExtend,60*1000)
			uni.$on('refresh-drinks',this.handleRefreshDrinks)
			uni.$on('refresh-drinks-detail',this.getShoppingCardView)
		},
		onUnload() {
			clearInterval(this.seatInterval)
			clearInterval(this.clearInterval)
			uni.$off('refresh-drinks',this.handleRefreshDrinks)
			uni.$off('refresh-drinks-detail',this.getShoppingCardView)
		},
		onShow() {
			this.seatIntervalStop = false
			clearInterval(this.seatInterval)
			this.seatInterval = setInterval(this.extendCardTableSelectTime,120*1000)
		},
		onHide() {
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
			jusgeEndExtend(){
				if(this.seatIntervalStop) {
					this.closeTime++
				} else {
					this.closeTime = 0
				} 
				if(this.closeTime>=10) {
					this.closeTime = 0
					clearInterval(this.seatInterval)
				}
			},
			async extendCardTableSelectTime(){
				if(this.seatIntervalStop) return
				let {code} = await this.$u.api.extendCardTableSelectTimeApi({selectId:this.data.seat.selectId})	
				
			},
			tapGoDetail(id,count){
				this.$u.route('/pages/club/consumption/detail',{id:id,selectId:this.data.seat.selectId,seatId:this.data.seat.id,date:this.data.date,count:count})
			},
			sendSeat(){
				if(this.seatIntervalStop) return 
			},
			handleRefreshDrinks(e){
				this.data = this.$u.deepMerge(this.data,JSON.parse(e.data))
				this.load()
			},
			tapGoCreateOrder(){
				if(!this.canOrder) return uni.showToast({
					title:'您选择的酒水不满足该座位的最低消费',
					icon:'none'
				})
				clearInterval(this.seatInterval)
				let params = {data:JSON.stringify(this.$u.deepMerge(this.data,{allAmount:this.allAmount}))}
				this.$u.route('pages/club/consumption/create_order',params)
			},
			async tapShoppingCardEmptyApi(data){
				let {code} = await this.$u.api.shoppingCardEmptyApi({
					cardTableId : this.data.seat.id,
					date : this.data.date,
				})
				if(code==0) {
					this.getShoppingCardView()
					this.cartShow = false
				}
				
			},
			async shoppingCardAdd(data){
				let {code} = await this.$u.api.shoppingCardAddApi(data)
				if(code==0) this.getShoppingCardView()
			},
			async shoppingCardDelete(data){
				uni.showLoading({
					title: '修改中'
				})
				let {code} = await this.$u.api.shoppingCardDeleteApi(data)
				uni.hideLoading();
				if(code==0) this.getShoppingCardView()
			},
			handleCommodityPlus(info){
				let data = {
					cardTableId : this.data.seat.id,
					date : this.data.date,
					commodityId:info.id
				}
				this.shoppingCardAdd(data)
			},
			handleCommodityMinus(info){
				let data = {
					cardTableId : this.data.seat.id,
					date : this.data.date,
					commodityId:info.id
				}
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
				let {code,data} = await this.$u.api.getShoppingCardViewApi({
					cardTableId : this.data.seat.id,
					date : this.data.date,
				})
				if(code==0) {
					this.allAmount = data.allAmount
					this.shopingCartList = data.list
					this.setSCNum()
				}
				
			},
			
			async getCommodityCategoriesList(){
				let {code,data} = await this.$u.api.getCommodityCategoriesListApi({id:this.data.clubId})
				if(code==0) {
					let {list} = data
					
					this.list = [...[{id:'',name:'全部'}],...list]
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
