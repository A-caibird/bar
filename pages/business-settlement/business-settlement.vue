<template>
    <view class="page-wrap">

        <view class="info-item">
            <view class="title">酒吧名称</view>
            <view class="input-wrap">
                <input v-model="clubName" type="text" placeholder="请输入酒吧名称" placeholder-class="placeholder-class">
            </view>
        </view>
        <view class="info-item">
            <view class="title">省市区</view>
           <view class="input-wrap">
                <input v-model="locInfo.areaName" type="text" placeholder="请输入地区全称" placeholder-class="placeholder-class">
            </view>
           <!-- <view class="location-box" @tap="$u.route('pages/discovery/location')" v-if="hasLocation">
                <view class="location-text">
                    <text v-if="!locInfo.areaName">所在位置</text>
                    <text v-else>{{locInfo.areaName}}</text>
                </view>
                <view class="location-arrow">
                    <image style="width: 15rpx; height: 20rpx;" src="/static/imgs/common/right.png" mode=""></image>
                </view>
            </view> -->
        </view>
        <view class="info-item">
			<view class="title">酒吧详细地址</view>
			<view class="input-wrap">
				<input v-model="address" type="text" placeholder="请输入酒吧详细地址" placeholder-class="placeholder-class">
			</view>
		</view>

        <view class="info-item">
            <view class="title">联系人</view>
            <view class="input-wrap">
                <input v-model="linkPerson" type="text" placeholder="请输入联系人" placeholder-class="placeholder-class">
            </view>
        </view>
        <view class="info-item">
            <view class="title">联系电话</view>
            <view class="input-wrap">
                <input v-model="linkPhone" type="number" placeholder="请输入联系电话" placeholder-class="placeholder-class">
            </view>
        </view>
        <view class="photo-box">
            <view class="photo-text">
                <text class="text-left">营业执照</text>
				<text class="text-right">(必填)</text>
            </view>
            <view class="photo-area">
                <view class="photo-area-item" v-if="businessLicense">
                    <image @tap="businessLicense=''" class="delete_icon" src="/static/imgs/common/cancel.png" mode="">
                    </image>
                    <image :src="businessLicense" @tap="$u.throttle(previewImg(businessLicense))"></image>
                </view>
                <view v-else class="photo-area-select" @tap="selectBusinessLicense">
                    <image src="/static/imgs/discovery/photo_select.png"></image>
                </view>
            </view>
        </view>
        <view class="photo-box">
            <view class="photo-text">
                <text class="text-left">门头照</text>
                <text class="text-right">(必填)</text>
            </view>
            <view class="photo-area">
                <view class="photo-area-item" v-if="doorHeadPhoto">
                    <image @tap="doorHeadPhoto=''" class="delete_icon" src="/static/imgs/common/cancel.png" mode="">
                    </image>
                    <image :src="doorHeadPhoto" @tap="$u.throttle(previewImg(doorHeadPhoto))"></image>
                </view>
                <view v-else class="photo-area-select" @tap="selectDoorHeadPhoto">
                    <image src="/static/imgs/discovery/photo_select.png"></image>
                </view>
            </view>
        </view>
        <view class="photo-box">
            <view class="photo-text">
                <text class="text-left">环境照片</text>
                <text class="text-right">(必填，最多提交9张图片)</text>
            </view>
            <view class="photo-area">
                <view class="photo-area-item" v-for="(item, index) in environmentPhotos" :key="index">
                    <image @tap="deletePhoto(index)" class="delete_icon" src="/static/imgs/common/cancel.png" mode="">
                    </image>
                    <image :src="item.avatar" @tap="$u.throttle(previewImgList(environmentPhotos,index,'avatar'))">
                    </image>
                </view>
                <view class="photo-area-select" @tap="select_photo" v-if="environmentPhotos.length<9">
                    <image src="/static/imgs/discovery/photo_select.png" mode=""></image>
                </view>
            </view>
        </view>
        <view class="submit_btn-wrap">
            <view class="submit_btn" @tap="$u.throttle(tapSubmit)"> <text>提交</text> </view>
        </view>
    </view>
</template>

<script>
	import {businessIdentifyHandle} from '@/utils/identifyJS.js'
	import { pathToBase64, base64ToPath } from 'image-tools'
    import location from '@/mixins/location.js';
	import photo from '@/mixins/photo.js'
    export default {
        mixins: [location, photo], // 使用mixin (在main.js注册全局组件)
        data() {
            return {
                clubName: '',
                areaName: '',
                address: '',
                linkPerson: '',
                businessLicense: '',
                linkPhone: '',
                businessLicense: '',
                doorHeadPhoto: '',
                environmentPhotos: [],
                locInfo: {
                    areaName: '',
                    // lng: '',
                    // lat: '',
                    // address: '',
                    // fullName: '',
                },
            }
        },
        onLoad: function() {
        	this.load()
        	// uni.$on('updataLocation', this.handelUpdataLocation)
        },
        onUnload: function() {
        	// uni.$off('updataLocation', this.handelUpdataLocation)
        },
        methods: {
            // 地理位置相关
            async load() {
                this.hasLocation = await this.getLocation()
            },
            handleLocation(res) {
                if (this.locInfo.areaName != '') return
                let {
                    // latitude,
                    // longitude,
                    address
                } = res
                let areaName =
                    `${address.province}${address.city}${address.district}`
                // let addressS = address.poiName
                // this.locInfo.lng = longitude
                // this.locInfo.lat = latitude
                this.locInfo.areaName = areaName
                // this.locInfo.address = address
                // this.locInfo.fullName = `${address.province}${address.city}`
            },
            handleUpdateLocationService() {
                this.updateLocationService(() => {
                    if (this.canLocation) {
                        this.getLocation()
                    }
                })
            },
            // handelUpdataLocation(e){
            // 	console.log(e)
            // 	let locationStr = e.location;
            // 	// this.locInfo.lng = locationStr.split(',')[0] || 0;
            // 	// this.locInfo.lat = locationStr.split(',')[1] || 0;
            // 	this.locInfo.areaName = this.analysisProvinceName(e)
            // 	// this.locInfo.fullName = this.analysisFullName(e)
            // 	// this.locInfo.address = e.name;
            // },
            // 地理位置相关

            selectDoorHeadPhoto() {
                let vm = this
                uni.chooseImage({
                    count: 1, //默认9
                    success: function(res) {
                        // console.log(res.tempFilePaths)
                        uni.showLoading({
                            title: '上传中'
                        })

                        vm.upDoorHeadPhoto(res)

                    }
                });
            },
            async upDoorHeadPhoto(res) {
                await this.uploadDoorHeadPhoto(res);
                uni.hideLoading()
            },
            uploadDoorHeadPhoto(res) {
                let vm = this
                return new Promise((resolve, reject) => {
                    vm.$u.api.uploadFile(res.tempFilePaths[0]).then(url => {
                        vm.doorHeadPhoto = url;
                        resolve()
                    }).catch(e => {
                        console.log(e);
                        uni.hideLoading();
                        reject()
                    })

                })


            },
            selectBusinessLicense() {
                let vm = this
                uni.chooseImage({
                    count: 1, //默认9
                    success: function(res) {
                        // console.log(res.tempFilePaths)
                        uni.showLoading({
                            title: '上传中'
                        })
                        // vm.upBusinessLicense(res)
						let tempFilePath = res.tempFilePaths[0];
						let tempFiles = res.tempFiles[0];
						vm.sCompressImg(tempFilePath).then(rs => {
							let path = rs.tempFilePath;
							vm.identifyHandle(res, path);
						}).catch(e => {
							console.log(e);
							vm.identifyHandle(res, tempFilePath)
						})	
                    }
                });
            },
			identifyHandle(res, path){
				pathToBase64(path).then(baseRes => {
					businessIdentifyHandle(baseRes).then(result => {
						console.log(result);
						if(result){
							this.upBusinessLicense(res)
						}else{
							uni.hideLoading();
						}
					}).catch(e => {
						console.log(e)
						uni.hideLoading();
					});
				}).catch(e => {
					this.$u.toast('图片异常');
					console.log(e);
					uni.hideLoading();
				})
			},
            async upBusinessLicense(res) {
                await this.uploadBusinessLicense(res);
                uni.hideLoading()
            },
            uploadBusinessLicense(res) {
                let vm = this
                return new Promise((resolve, reject) => {
                    vm.$u.api.uploadFile(res.tempFilePaths[0]).then(url => {
						vm.businessLicense = url;
                        resolve()
                    }).catch(e => {
                        console.log(e);
                        uni.hideLoading();
                        reject()
                    })

                })


            },
            async tapSubmit() {
                if (this.clubName == '') {
                    return this.$toast.text('请输入酒吧名称！')
                }
                if (this.address == '') {
                    return this.$toast.text('请输入详细地址！')
                }
                if (this.locInfo.areaName == '') {
                    return this.$toast.text('请输入省市区！')
                }
                if (this.linkPerson == '') {
                    return this.$toast.text('请输入联系人姓名！')
                }
                if (this.linkPhone == '') {
                    return this.$toast.text('请输入联系电话！')
                }
                if (!this.$u.test.mobile(this.linkPhone)) {
                    return this.$toast.text('请输入正确的联系电话！')
                }
                if (this.businessLicense == '') {
                    return this.$toast.text('请上传营业执照！')
                }
                if (this.doorHeadPhoto == '') {
                    return this.$toast.text('请上传门头照！')
                }
                if (this.environmentPhotos.length == 0) {
                    return this.$toast.text('请至少上传一张环境照片！')
                }
                await this.$toast.confirm('', '确定要提交入驻申请？')
                let params = {
                    clubName: this.clubName,
                    areaName: this.locInfo.areaName,
                    address: this.address,
                    linkPerson: this.linkPerson,
                    linkPhone: this.linkPhone,
                    businessLicense: this.businessLicense,
                    doorHeadPhoto: this.doorHeadPhoto,
                }
                let environmentPhotos = this.$u.deepClone(this.environmentPhotos);
                environmentPhotos.forEach((item, index) => {
                    let key = `environmentPhotos[${index}]`;
                    params[key] = item.avatar;
                })
                console.log(params)
                let {
                    code
                } = await this.$u.api.admissionApplicationSaveApi(params)
                if (code == 0) {
                    this.$toast.text('提交成功！')
                    setTimeout(() => {
                        this.$u.route({
                            type: 'back'
                        })
                    }, 500)
                }

            },
            //选择图片
            select_photo: function(e) {
                // console.log(e)
                let vm = this
                uni.chooseImage({
                    count: 9 - (vm.environmentPhotos).length, //默认9
                    success: function(res) {
                        // console.log(res.tempFilePaths)
                        uni.showLoading({
                            title: '上传中'
                        })

                        vm.upImg(res)

                    }
                });
            },
            //执行完上传，隐藏提示
            async upImg(res) {
                await this.uploadImg(res);
                uni.hideLoading()
            },
            //上传图片
            uploadImg: function(res) {
                return new Promise((resolve, reject) => {
                    let vm = this
                    //判断上传的图片数量有没有超过9张
                    let len = (res.tempFilePaths).length + (vm.environmentPhotos).length
                    if (len < 9) {
                        for (let i = 0; i < (res.tempFilePaths).length; i++) {
                            const filePath = res.tempFilePaths[i]
                            console.log(filePath)
                            vm.$u.api.uploadFile(filePath).then(url => {

                                let obj = {};
                                obj.avatar = url;
                                vm.environmentPhotos.push(obj);
                                console.log(vm.environmentPhotos)
                                resolve()
                            }).catch(e => {
                                console.log(e);
                                uni.hideLoading();
                                reject()
                            })

                        }

                    } else {
                        //超过九张，判断还可以加入几张照片
                        let remainLen = 9 - (vm.environmentPhotos).length
                        for (let i = 0; i < remainLen; i++) {
                            const filePath = res.tempFilePaths[i]
                            console.log(filePath)
                            vm.$u.api.uploadFile(filePath).then(url => {
                                let obj = {};
                                obj.avatar = url;
                                vm.environmentPhotos.push(obj);
                                console.log(vm.environmentPhotos)
                                resolve()
                            }).catch(e => {
                                console.log(e);
                                uni.hideLoading();
                                reject()
                            })

                        }
                    }

                })


            },

            //删除图片
            deletePhoto: function(e) {
                console.log(e)
                this.environmentPhotos.splice(e, 1)
            },
        }
    }
</script>

<style lang="scss">
    page {
        height: 100%;

        .page-wrap {
            min-height: 100%;

            .info-item {
                padding: 20rpx 30rpx;
                border-bottom: 1px solid #31345B;

                .location-box {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 60rpx;

                    .location-text {
                        font-size: 28rpx;
                        color: #FFFFFF;
                    }

                    .location-arrow {
                        image {
                            width: 15rpx;
                            height: 20rpx;
                        }
                    }
                }

                .title {
                    font-size: 32rpx;
                    color: #FFFFFF;
                    margin-bottom: 20rpx;
                }

                .input-wrap {
                    height: 80rpx;
                    border-radius: 4rpx;
                    background-color: #2C3158;
                    padding-left: 20rpx;
                    padding-right: 20rpx;

                    input {
                        font-size: 28rpx;
                        width: 100%;
                        height: 100%;
                        color: #fff;
                    }

                    .placeholder-class {
                        color: #B2B7DD;
                    }
                }
            }

            .photo-box {
                display: flex;
                flex-direction: column;
                padding: 0 30rpx;
                border-bottom: 1px solid #31345B;

                &:last-child {
                    border-bottom: none;
                }

                .photo-text {
                    padding: 30rpx 0;

                    .text-left {
                        font-size: 32rpx;
                        color: #FFFFFF;
                    }

                    .text-right {
                        font-size: 28rpx;
                        color: #72729E;
                    }
                }

                .photo-area {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 15rpx 0;

                    .photo-area-item {
                        position: relative;
                        padding-right: 30rpx;
                        padding-bottom: 30rpx;

                        &:nth-child(3n) {
                            padding-right: 0;
                        }

                        .delete_icon {
                            position: absolute;
                            z-index: 2;
                            top: -20rpx;
                            transform: translateX(190rpx);
                            width: 40rpx;
                            height: 40rpx;
                        }

                        image {
                            width: 210rpx;
                            height: 210rpx;
                        }
                    }

                    .photo-area-select {
                        image {
                            width: 210rpx;
                            height: 210rpx;
                        }
                    }
                }
            }

            .submit_btn-wrap {
                padding: 0 30rpx;

                .submit_btn {

                    height: 90rpx;
                    @include flex-center();
                    margin-top: 40rpx;
                    border-radius: 46rpx;
                    background: $uni-button-color;
                    color: #FFFFFF;
                }
            }

        }
    }
</style>
