<template>
<view class="container" style="padding-bottom: 0rpx;">
 <view class="coupon-pop">
  <view class="coupon-icon">
    <image class="icon-img" src="/static/imgs/coupon/coupon-pop.png"></image>
  </view>
  <view class="getInfo">
	  
    <label class="title" v-if="mode == 'normal'">恭喜您，领取成功</label>
	<label class="title" v-if="mode == 'point'">恭喜您，兑换成功</label>
    <label class="text">优惠券已经放入您的账户，快去使用吧</label>
  </view>
  <!-- <view class="surebtn" @tap="sure">
    <label class="text">确定</label>
  </view> -->
  <view class="surebtn" @tap="goCoupon">
    <label class="text">查看</label>
  </view>
 </view>
</view>
</template>
<script>

export default {
  data() {
    return {
		
	};
  },

  components: {},
  props: {
	  mode:{
		  type: String,
		  default: 'normal'
	  }
  },
  methods: {
    sure: function () {
      this.$emit('getcoupons')
    },
	goCoupon: function(){
		this.sure();
		setTimeout(() => {
			this.$nav.navigateTo({
				url: "/pages/coupon/coupon"
			})
		}, 300)
	}
  },
  computed: {},
  watch: {}
};
</script>
<style>
.coupon-pop{
  position: relative;
  height: 600upx;
  width: 524upx;
  background-color: #FFFFFF;
}
.coupon-icon{
position: absolute;
top: 60upx;
display: flex;
justify-content: center;
align-items: center;
width: 100%;
}
.icon-img{
  height: 135upx;
  width: 176upx;
}
.getInfo{
  position: absolute;
  width: 100%;
  top: 256upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.getInfo .title{
  font-size: 36upx;
  color: #333333;
}
.getInfo .text{
  font-size: 20upx;
  color: #ACACAC;
  margin-top: 20upx;
}
.surebtn{
  position: absolute;
  height: 80upx;
  width: 274upx;
  top: 446upx;
  left: 124upx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F67F79;
}
.surebtn .text{
  font-size: 30upx;
  color: #FFFFFF;
}
</style>