var getOssInfoUrl = '/api/OSSSign/sign'
// import $storage from '@/common/storage.js'
const init =  async function(vm){//获取signature、id、policy、baseUrl
	let {code,data} = await vm.$u.get(getOssInfoUrl) 
	if(code==0) {
		uni.setStorageSync('aliyun-sign', JSON.stringify(data.sign))
	}else{
		console.log('未获取OSS 参数');
	}
}
module.exports = init