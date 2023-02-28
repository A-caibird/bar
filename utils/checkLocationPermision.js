import $permision from "@/common/permission.js"

async function checkPermission() {
	let status = $permision.isIOS ? await $permision.requestIOS('location') :
	await $permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION');
	return status;
}

//app每次打开的时候都会被调用
const checkLocationPermision = async function() {
	if(getApp({allowDefault: true}).globalData.locationTime==3) {
		getApp({allowDefault: true}).globalData.locationTime = 0
		return
	}
	let status = await checkPermission();
	if (status === 1) {
		getApp({allowDefault: true}).globalData.canLocation = true
		getApp({allowDefault: true}).globalData.locationService = true
		getApp({allowDefault: true}).globalData.locationPermission = true
	} else {
		getApp({allowDefault: true}).globalData.canLocation = false
		getApp({allowDefault: true}).globalData.locationTime++
		if(status===2) {
			getApp({allowDefault: true}).globalData.locationService = false
		} else {
			getApp({allowDefault: true}).globalData.locationService  = true
			getApp({allowDefault: true}).globalData.locationPermission = false
		}

	}
	// console.log(getApp({allowDefault: true}).globalData.canLocation)
	// console.log(getApp({allowDefault: true}).globalData.locationService)
	// console.log(getApp({allowDefault: true}).globalData.locationPermission)
	uni.$emit('update-location-service')
}
module.exports = checkLocationPermision
