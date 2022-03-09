<template>
    <view class="container">
        <!-- <u-mask :show="maskShow" :custom-style="{background: '#191C3F'}">
            <image
                style="position: absolute;left: 50%; top:50%;transform: translate(-50%,-50%); width: 100rpx; height 100rpx;"
                mode="aspectFit" src="/static/imgs/loading.gif">
            </image>
        </u-mask> -->
        <view class="title-item">
            <view class="first-item" @tap="$u.throttle($u.route({type:'back'}))">
                <!-- <image src="/static/imgs/common/append.png" mode=""></image>
				<text>返回</text> -->
                <image src="../../static/imgs/award/ic_fanhui.png" mode=""></image>
            </view>
            <view class="first-part">
                <view class="left"><text></text></view>
                <view class="second-item">
                    <image src="../../static/imgs/award/ic_biaoti.png" mode=""></image>
                </view>
                <view class="right"><text></text></view>
            </view>
            <view class="third_item">
                <view class="one" @tap="$u.throttle(tapGoRecord)">
                    <image src="../../static/imgs/award/ic_jingp.png" mode=""></image>
                    <text>{{ awardNumber }}</text>
                </view>
                <view class="one">
                    <image src="../../static/imgs/award/ic_jinbi_2.png" mode=""></image>
                    <text>{{ wineNumber }}</text>
                </view>
            </view>
        </view>
        <view class="content1">
            <view v-if="prizeList.length >= 1" class="a" :class="{ active: selectIndex == 0 }">
                <image :src="prizeList[0].imgUrl" mode=""></image>
                <text>{{ prizeList[0].name }}</text>
            </view>
            <view v-if="prizeList.length >= 2" class="a" :class="{ active: selectIndex == 1 }">
                <image :src="prizeList[1].imgUrl" mode=""></image>
                <text>{{ prizeList[1].name }}</text>
            </view>
            <view v-if="prizeList.length >= 3" class="a" :class="{ active: selectIndex == 2 }">
                <image :src="prizeList[2].imgUrl" mode=""></image>
                <text>{{ prizeList[2].name }}</text>
            </view>
            <view v-if="prizeList.length >= 4" class="a" :class="{ active: selectIndex == 3 }">
                <image :src="prizeList[3].imgUrl" mode=""></image>
                <text>{{ prizeList[3].name }}</text>
            </view>
            <view v-if="prizeList.length >= 5" class="a" :class="{ active: selectIndex == 4 }">
                <image :src="prizeList[4].imgUrl" mode=""></image>
                <text>{{ prizeList[4].name }}</text>
            </view>
        </view>
        <view class="content2">
            <view class="c">
                <view v-if="prizeList.length >= 14" class="e" :class="{ active: selectIndex == 13 }">
                    <image :src="prizeList[13].imgUrl" mode=""></image>
                    <text>{{ prizeList[13].name }}</text>
                </view>
                <view v-if="prizeList.length >= 13" class="e" :class="{ active: selectIndex == 12 }">
                    <image :src="prizeList[12].imgUrl" mode=""></image>
                    <text>{{ prizeList[12].name }}</text>
                </view>
            </view>
            <view class="d">
                <text>中奖名单</text>
                <view style="height: 95rpx; overflow: auto;">
                    <tony-scroll v-if="awardList.length > 0" :list="awardList"></tony-scroll>
                </view>
                
                <!-- <scroll-view scroll-y="true" >
                    <view class="lin1" v-for="(item, index) in awardList" :key="index">
                        <view class="inner_text">
                            <text>{{ item.username }}</text>
                        </view>
                        <view class="inner_text"><text>抽中</text></view>
                        <view class="inner_text">
                            <text>{{ item.prize }}酒币</text>
                        </view>
                    </view>
                </scroll-view> -->
                <view class="award-btn">
                    <button @tap="$u.throttle(starten_btn, 4500)" type="default">十连抽 {{unitPrice*10}} 酒币/次</button>
                    <button @tap="$u.throttle(start_btn, 3500)" type="default">单次抽 {{unitPrice}} 酒币/次</button>
                </view>
            </view>
            <view class="c">
                <view v-if="prizeList.length >= 6" class="e" :class="{ active: selectIndex == 5 }">
                    <image :src="prizeList[5].imgUrl" mode=""></image>
                    <text>{{ prizeList[5].name }}</text>
                </view>
                <view v-if="prizeList.length >= 7" class="e" :class="{ active: selectIndex == 6 }">
                    <image :src="prizeList[6].imgUrl" mode=""></image>
                    <text>{{ prizeList[6].name }}</text>
                </view>
            </view>
        </view>
        <view class="content1">
            <view v-if="prizeList.length >= 12" class="a" :class="{ active: selectIndex == 11 }">
                <image :src="prizeList[11].imgUrl" mode=""></image>
                <text>{{ prizeList[11].name }}</text>
            </view>
            <view v-if="prizeList.length >= 11" class="a" :class="{ active: selectIndex == 10 }">
                <image :src="prizeList[10].imgUrl" mode=""></image>
                <text>{{ prizeList[10].name }}</text>
            </view>
            <view v-if="prizeList.length >= 10" class="a" :class="{ active: selectIndex == 9 }">
                <image :src="prizeList[9].imgUrl" mode=""></image>
                <text>{{ prizeList[9].name }}</text>
            </view>
            <view v-if="prizeList.length >= 9" class="a" :class="{ active: selectIndex == 8 }">
                <image :src="prizeList[8].imgUrl" mode=""></image>
                <text>{{ prizeList[8].name }}</text>
            </view>
            <view v-if="prizeList.length >= 8" class="a" :class="{ active: selectIndex == 7 }">
                <image :src="prizeList[7].imgUrl" mode=""></image>
                <text>{{ prizeList[7].name }}</text>
            </view>
        </view>
        <view class="popmask" v-if="flag==true">
            <view class="pop">
                <view class="first-line" @tap="close()">
                    <text>包裹</text>
                    <image src="/static/imgs/award/snatch-guanbi.png" mode=""></image>
                </view>
                <view class="content3">
                    <view class="f-wrap" v-for="(item,index) in tenList" :key="index">
                        <view class="f">
                            <image :src="item.imgPath" mode=""></image>
                            <text>{{ item.lotteryPrize }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    var intervalID = null;
    var app = getApp();
    export default {
        data() {
            return {
                maskShow: true,
                selectIndex: -1,
                prizeList: [],
                awardList: [],
                awardNumber: '',
                wineNumber: '',
                // tenList: [{
                // 	"id": 52016,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "谢谢参与",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140332011_000222121-20210107134046924.jpg",
                // 	"prize": 0,
                // 	"itemId": 47687,
                // 	"new": false
                // }, {
                // 	"id": 52017,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币400个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140011_0002221-20210107133906689.jpg",
                // 	"prize": 400,
                // 	"itemId": 47682,
                // 	"new": false
                // }, {
                // 	"id": 52018,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币400个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/201811228_155140011_0002221-20210107134013167.jpg",
                // 	"prize": 400,
                // 	"itemId": 47685,
                // 	"new": false
                // }, {
                // 	"id": 52019,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币400个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140011_0002221-20210107133906689.jpg",
                // 	"prize": 400,
                // 	"itemId": 47682,
                // 	"new": false
                // }, {
                // 	"id": 52020,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "谢谢参与",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140011_0002221-20210107134104109.jpg",
                // 	"prize": 0,
                // 	"itemId": 47688,
                // 	"new": false
                // }, {
                // 	"id": 52021,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币200个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140332011_000222121-20210107133841230.jpg",
                // 	"prize": 200,
                // 	"itemId": 47681,
                // 	"new": false
                // }, {
                // 	"id": 52022,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币200个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/201811228_155140011_0002221-20210107134128473.jpg",
                // 	"prize": 200,
                // 	"itemId": 47690,
                // 	"new": false
                // }, {
                // 	"id": 52023,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币400个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/201811228_155140011_0002221-20210107134013167.jpg",
                // 	"prize": 400,
                // 	"itemId": 47685,
                // 	"new": false
                // }, {
                // 	"id": 52024,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "酒币200个",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140332011_000222121-20210107133841230.jpg",
                // 	"prize": 200,
                // 	"itemId": 47681,
                // 	"new": false
                // }, {
                // 	"id": 52025,
                // 	"version": 0,
                // 	"createDate": "2021-04-10 17:16:49",
                // 	"modifyDate": "2021-04-10 17:16:49",
                // 	"valid": null,
                // 	"userId": 47270,
                // 	"username": "测试1",
                // 	"lotteryPrize": "谢谢参与",
                // 	"lotteryId": 46271,
                // 	"imgPath": "https://vverp1.oss-cn-shanghai.aliyuncs.com/202101/20210107/20181128_155140332011_000222121-20210107134046924.jpg",
                // 	"prize": 0,
                // 	"itemId": 47687,
                // 	"new": false
                // }],
                unitPrice: 20,
                flag: false
            };
        },
        onReady() {
            plus.navigator.setFullscreen(true);
            // plus.screen.lockOrientation('landscape-primary');
        },
        onBackPress(options) {
            uni.redirectTo({
                url: '/pages/snatch-back/snatch-back'
            })
            return true;
        },
        onLoad: function() {
            setTimeout(() => {
                plus.screen.lockOrientation('landscape-primary');
                setTimeout(() => {
                    this.maskShow = false
                }, 1000)
            }, 500)
            this.$u.api.awardApi().then(res => {
                console.log(res)
                if (res.code == 0) {
                    let id = res.data.lottery.id;
					app.globalData.prizePoolId = id
                    this.id = id;
                    let list = res.data.lottery.lotteryItemList;
                    console.log(res.data.lottery)
                    this.unitPrice = res.data.lottery.unitPrice;
                    this.creatPrizeList(list);
                    this.showAwardList();
                    this.showNumber();
                }

            });
        },
        onUnload() {
            plus.navigator.setFullscreen(false);
            plus.screen.lockOrientation('portrait-primary'); //锁死屏幕方向为竖屏
        },
        methods: {
			tapGoRecord(){
				this.$u.route('/pages/snatch-record-before/snatch-record-before')
			},
            //初始化礼物数量以及酒币个数
            showNumber: function() {
                let params = {
                    id: this.id
                };
                this.$u.api.awardNumberApi(params).then(res => {
                    if (res.code == 0) {
                        this.awardNumber = res.data.count;
                    }
                    //console.log(this.awardNumber)
                });
                this.$u.api.myWalletApi().then(res => {
                    if (res.code == 0) {
                        this.wineNumber = res.data.wineCoin;
                    }
                    //console.log(this.wineNumber)
                });
            },
            //关闭奖品提示弹窗
            close: function() {
                this.flag = false;
            },
            //中奖名单
            async showAwardList() {
                let params = {
                    maxNumber: 30,
                    id: this.id
                };
				let {code,data} = await this.$u.api.awardListApi(params)
				if(code==0){
					let {list} = data
					this.awardList = list
				}
               
            },

            // 创建奖品列表
            creatPrizeList: function(list = []) {
                //console.log(list);
                var sumListLength = 14;
                var needInitLength = 14 - list.length;
                var prizeList = [];
                // 存在奖品的设置
                for (var i = 0; i < list.length; i++) {
                    let prizeInfo = {
                        imgUrl: list[i].imgPath,
                        name: list[i].name,
                        show: false,
                        giftId: list[i].id,
                        prize: list[i].prize
                    };
                    prizeList.push(prizeInfo);
                }
                // 需要初始化奖品
                for (var i = 0; i < needInitLength; i++) {
                    let prizeInfo = {
                        imgUrl: '',
                        name: '',
                        show: false,
                        giftId: '',
                        prize: ''
                    };
                    prizeList.push(prizeInfo);
                }
                this.prizeList = prizeList;
                //console.log(this.prizeList);
            },
            //单抽
            start_btn: function() {
                var i = 0;
                //this.intervalHandle(i);
                intervalID = setInterval(() => {
                    this.selectIndex = i;
                    if (i % 14 == i) {
                        i++;
                    } else {
                        i = 0;
                    }
                }, 100);

                //this.selectIndex=-1;
                //console.log(112)
                let params = {
                    //token:this.app.globalData.token,
                    id: this.id,
                    type: 'single'
                };
                //console.log(params)
                this.$u.api.awarddrawApi(params).then(res => {
                    // console.log(res);
                    if (res.code == 0) {
                        this.tenList = res.data.prizeList;
                        setTimeout(() => {
                            clearInterval(intervalID);
							let index = this.prizeList.findIndex(e=>{
								return e.giftId==res.data.prizeList[0].itemId
							})
                           if(index!=-1) {
							   this.jumpToIndex(index)
						   }
                         
                        }, 3000);
                    }

                });
            },
            // intervalHandle: function(index) {
            // 	setTimeout(() => {
            // 		this.selectIndex = index;
            // 	}, index * 100);
            // },
            //十连
            starten_btn: function() {
                var i = 0;
                //this.intervalHandle(i);
                intervalID = setInterval(() => {
                    this.selectIndex = i;
                    if (i % 14 == i) {
                        i++;
                    } else {
                        i = 0;
                    }
                }, 100);
                //this.selectIndex = -1;
                let params = {
                    //token:app.globalData.token,
                    id: this.id,
                    type: 'ten'
                };
                //console.log(params)
                console.log("抽奖索引：", this.selectIndex)
                this.$u.api.awarddrawApi(params).then(res => {
                    if (res.code == 0) {
                        this.tenList = res.data.prizeList;
                        // console.log(tenList);
                        setTimeout(() => {
                            clearInterval(intervalID);
							let index = this.prizeList.findIndex(e=>{
								return e.giftId==res.data.prizeList[0].itemId
							})
                            if(index!=-1) {
							   this.jumpToIndex(index)
                            }
                        }, 4000);
                    }

                });
            },
			jumpToIndex(index){
				let ans = 0
				let i = this.selectIndex
				intervalID = setInterval(() => {
				    this.selectIndex = i;
					if(ans==100) {
						clearInterval(intervalID);
						return 
					}
					if(i==index) {
						clearInterval(intervalID);
						this.showNumber();
						this.flag = true;
					}
				    if (i % 14 == i) {
				        i++;
				    } else {
				        i = 0;
				    }
					ans++
				}, 100);
				
			},
        
			
		}
    };
</script>

<style lang="scss">
    .container {
        //position: relative;
        width: 100vw;
        height: 100vh;
        background: #0f2e61;
    }

    .title-item {
        width: 100%;
        height: 8.5%;
        //background-color: #6fa8e7;
        background: linear-gradient(257deg, #416a98, #204170);
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0rpx 4rpx 15rpx 0rpx #6fa8e7;
        margin-bottom: 30rpx;
    }

    .first-item {
        width: 15.2%;
        height: 100%;
        display: flex;
        align-items: center;
        //padding-left: 26rpx;
        //background: linear-gradient(270deg, #3a6ba2, #4696bc);
        //box-shadow: 0rpx 0rpx 12rpx 0rpx #1a3861;

        &>image {
            width: 100%;
            height: 100%;
        }

        // & > text {
        // 	font-size: 26rpx;
        // 	color: #ffffff;
        // 	padding-left: 19rpx;
        // }
    }

    .first-part {
        width: 65.9%;
        height: 100%;
        display: flex;
        align-items: center;

        //justify-content: space-between;
        // box-shadow: 0rpx 4rpx 15rpx 0rpx #6fa8e7;
    }

    .left {
        width: 140rpx;
        height: 4rpx;
        margin-left: 211rpx;
        margin-right: 15rpx;
        background: linear-gradient(90deg, rgba(132, 177, 217, 0), #4d79b2);
        border-radius: 2rpx;
    }

    .second-item {
        &>image {
            width: 198rpx;
            height: 38rpx;
        }
    }

    .right {
        width: 140rpx;
        height: 4rpx;
        margin-right: 15rpx;
        background: linear-gradient(90deg, rgba(132, 177, 217, 0), #4d79b2);
        border-radius: 2rpx;
    }

    .third_item {
        display: flex;
        justify-content: space-between;
    }

    .one {
        display: flex;
        align-items: center;
        justify-content: space-around;
        min-width: 106rpx;
        height: 41rpx;
        margin-right: 20rpx;
        background: #1e5086;
        border-radius: 25rpx;

        &>image {
            width: 25rpx;
            height: 25rpx;
            padding-left: 10rpx;
        }

        &>text {
            font-size: 22rpx;
            color: #ffffff;
            padding: 0 10rpx;
        }
    }

    .content1 {
        width: 100%;
        height: 19.6%;
        margin-top: 16rpx;
        display: flex;
        justify-content: space-around;
        padding: 0 20rpx;
    }

    .a {
        width: 19.2%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(179deg, #3a6ba2, #4696bc);
        border-radius: 8rpx;

        &>image {
            //margin-top: 20rpx;
            margin: auto;
            width: 60rpx;
            height: 60rpx;
        }

        &>text {
            margin: auto;
            //margin-top: 17rpx;
            font-size: 24rpx;
            color: #ffffff;
        }

        &.active {
            background: #f0ad2c;
        }
    }

    .content2 {
        width: 100%;
        height: 40.5%;
        margin-top: 16rpx;
        display: flex;
        justify-content: space-around;
        padding: 0 18rpx;
    }

    .c {
        width: 19.3%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
    }

    .d {
        //height: 47.5%;
        width: 58%;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        &>text {
            color: #ffffff;
        }
    }

    .e {
        width: 100%;
        height: 48%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(179deg, #3a6ba2, #4696bc);
        border-radius: 8rpx;

        &>image {
            //margin-top: 20rpx;
            margin: auto;
            width: 60rpx;
            height: 60rpx;
        }

        &>text {
            margin: auto;
            //margin-top: 17rpx;
            font-size: 24rpx;
            color: #ffffff;
        }

        &.active {
            background: #f0ad2c;
        }
    }

    .lin1 {
        display: flex;
        margin-top: 10rpx;
        justify-content: space-around;
        color: #ffffff;

        .inner_text {
            flex: 1;
        }
    }

    .award-btn {
        display: flex;
        justify-content: space-around;

        &>button {
            //margin-left: 29rpx;
            width: 330rpx;
            height: 67rpx;
            //border: 1rpx solid #dfba81;
            line-height: 67rpx;
            font-size: 27rpx;
            color: #ffffff;
            //background: #dfba81;
            //background: linear-gradient(180deg,#a07b45, #d7a25b);
            background: url(../../static/imgs/award/ic_button.png);
            background-size: 100% 100%;
        }
    }

    .popmask {
        position: fixed;
        z-index: 99;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
    }

    .pop {
        position: fixed;
        z-index: 999;
        // width: 100%;
        // height: 100%;
        width: 986rpx;
        height: 617rpx;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(257deg, #416a98, #204170);


        .first-line {
            width: 100%;
            height: 11.7%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0rpx 4rpx 15rpx 0rpx #6fa8e7;

            &>text {
                color: #FFFFFF;
                font-size: 34rpx;
                margin-left: 366rpx;
            }

            &>image {
                width: 203rpx;
                height: 66rpx;
                margin-right: 0rpx;

            }
        }



        .content3 {
            width: 100%;
            height: 76.2%;
            margin-top: 30rpx;
            // display: flex;

            // flex-wrap: wrap;
            display: grid;
            grid-template-rows: repeat(2, 50%);
            grid-template-columns: repeat(5, 20%);
        }

        .f-wrap {
            // background-color: red;
            padding: 17rpx;

            .f {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: linear-gradient(179deg, #3a6ba2, #4696bc);
                border-radius: 8rpx;

                &>image {
                    //margin-top: 20rpx;
                    margin: auto;
                    width: 70rpx;
                    height: 70rpx;
                }

                &>text {
                    margin: auto;
                    //margin-top: 17rpx;
                    font-size: 24rpx;
                    color: #ffffff;
                }

                &.active {
                    background: #f0ad2c;
                }
            }

        }



    }
</style>
