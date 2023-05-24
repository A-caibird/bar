import $permision from "@/common/permission.js"
import $storage from '@/common/storage.js'
let location = ({
	data(){
		return {
			 locationService:getApp({allowDefault: true}).globalData.locationService,
			 locationPermission:getApp({allowDefault: true}).globalData.locationPermission,
			 canLocation:getApp({allowDefault: true}).globalData.canLocation,
			 hasLocation:getApp({allowDefault: true}).globalData.location.cityName!='未定位',
			 getLocationFail:false,//获取地址失败的标识
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
		
		
		getLocation(){//获取定位
			let vm = this
			console.log("获取定位");
			return new Promise((resolve,reject)=>{
				uni.getLocation({
					type:'gcj02',
					geocode:true,
					success(res){
						// console.log(res)
						let {latitude,longitude,address} = res
						let location = {
							lng:longitude,
							lat:latitude,
							cityName:address.city
						}
						vm.handleLocation(res)
						getApp({allowDefault: true}).globalData.location = location
						$storage.setLocation(location)
						uni.$emit('update-location')
						resolve(true)
					},
					fail(err){
						vm.getLocationFail = true
						console.log(err)
						resolve(false)
					}
				})
			})
			
			
		},
	}
})
export default location