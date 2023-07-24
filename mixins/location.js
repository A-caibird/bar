import $permision from "@/common/permission.js"
import $storage from '@/common/storage.js'
let location = ({
	data(){
		return {
			 locationService:getApp({allowDefault: true}).globalData.locationService,
			 locationPermission:getApp({allowDefault: true}).globalData.locationPermission,
			 canLocation:getApp({allowDefault: true}).globalData.canLocation,
			 hasLocation:getApp({allowDefault: true}).globalData.location.cityName!='未定位',
			 getLocationFail: false,//获取地址失败的标识
		}
	},
	mounted(){
		//试下暂时关闭定位，暂时
		// uni.$on('update-location-service', this.handleUpdateLocationService)
		// uni.$on('update-location', this.handleUpdateLocation)
	},
	beforeDestroy() {
		//试下暂时关闭定位，暂时
		// uni.$off('update-location-service', this.handleUpdateLocationService)
		// uni.$off('update-location', this.handleUpdateLocation)
		
	},
	methods:{
		handleUpdateLocation(){
			this.setLocation()
		},
		setLocation(callBack=()=>{}){
			this.hasLocation = true
			
			callBack()
		},
		handleUpdateLocationService(){
			this.updateLocationService()
		},
		
		/**
		 * 在home页面会被混合并被调用
		 */
		updateLocationService(callBack=()=>{}){//更新每个页面的位置权限信息
			this.locationService = getApp({allowDefault: true}).globalData.locationService
			this.locationPermission = getApp({allowDefault: true}).globalData.locationPermission
			this.canLocation = getApp({allowDefault: true}).globalData.canLocation
			callBack()
		},
		handleLocation(res){
			// console.log(res)
		},
		
		// 获取位置
		getLocation(resolve) {
			let that = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true,
					success(res) {
						console.log("定位成功===>");
						console.log(res);
						getApp().globalData.locationService = true;
						
						let {
							latitude,
							longitude,
							address
						} = res;
				
						// 由于部分手机系统定位无法获取address，所以需要进行判断，如果无法获取则调用高德api获取
						if(address) {
							console.log("有地址");
							// 将得到的位置信息存在全局对象中
							getApp({allowDefault: true}).globalData.location = {
								lng: longitude,
								lat: latitude,
								cityName: address.city
							};
							
							this.cityName = address.city;
							
							$storage.setLocation(getApp({allowDefault: true}).globalData.location);
							uni.$emit('update-location');
						} else {
							console.log("没有地址");
							// 创建地图坐标对象
							const point = new plus.maps.Point(longitude, latitude);
							
							// 调用高德地图api 反向地理编码
							plus.maps.Map.reverseGeocode(point,{},(event) => {
								let address = event.address; // 转换后的地理位置
								let point = event.coord; // 转换后的坐标信息
								let coordType = event.coordType; // 转换后的坐标系类型
								const reg = /.+?(省|市|自治区|自治州|县|区)/g;
								let addressList = address.match(reg).toString().split(",");
							    //注意 因为存在直辖市， 当所在地区为普通省市时，addressList.length == 3，city = addressList[1];当所在地区为直辖市时addressList.length == 2，city = addressList[0];
								let city = addressList.length == 4 ? addressList[1] : addressList[0];
								console.log("addressList", addressList);
								getApp({allowDefault: true}).globalData.location = {
									lng: longitude,
									lat: latitude,
									cityName: city
								};
								that.cityName = city;
								$storage.setLocation(getApp({allowDefault: true}).globalData.location);
								uni.$emit('update-location');
							},
							function(e) {
								console.log("失败回调",e);
								that.getLocationFail = true;
								getApp().globalData.locationService = false;
								getApp().globalData.isCurrentLocation = false;
								getApp().globalData.location.cityName = "宁波市";
								resolve(false)
							});
						}
						
						resolve(true)
					},
					fail(err) {
						console.log("定位失败===>")
						console.log(err)
						getApp().globalData.locationService = false;
						getApp().globalData.isCurrentLocation = false;
						getApp().globalData.location.cityName = "宁波市";
						resolve(false)
					}
				})
		},
	}
})
export default location