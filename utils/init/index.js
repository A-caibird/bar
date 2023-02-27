import uploadInit from '@/utils/upload/init.js'
// import chatInit from '@/utils/chat/init.js'
import pushInit from '@/utils/push/init.js'
import setNavBarColor from '@/utils/android-navbar/index.js'

const init = function(vm){
	uploadInit(vm)
	// chatInit(vm)
	pushInit(vm)
	setNavBarColor()
}
module.exports = init
