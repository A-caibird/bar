function commonShare (provider, scene, callback=null) {
	uni.showLoading({
		title: '分享中'
	})
	if(provider == 'weixin'){
		let imageUrl = 'https://patixiu.oss-cn-shanghai.aliyuncs.com/202201/20220107/1080x1080-20211221132005936-20220107100441756.png'
		shareHandle(provider, scene, imageUrl, callback)
	}else{
		let imageUrl = 'https://patixiu.oss-cn-shanghai.aliyuncs.com/202201/20220107/1080x1080-2-20220107101454498.png'
		downloadFile(imageUrl).then(res => {
			console.log(res);
			let tempFilePath = res.tempFilePath;
			shareHandle(provider, scene, tempFilePath, callback)
		}).catch(e => {
			console.log(e);
			shareHandle(provider, scene, '', callback);
		})
	}
	
}
function shareHandle(provider, scene, imageUrl = "", callback=null){
	let href = "https://erp.patixiu.com/sharepage/share.html";
	uni.hideLoading();
	if(callback){
		setTimeout(() => {
			callback();
		}, 600)
	}
	console.log((provider + ', ' + scene + ', ' + imageUrl));
	uni.share({
	    provider,
	    scene,
	    type: 0,
	    href: href,
		title: '爬梯秀APP',
		summary: '一起来狂欢尬酒呀',
		imageUrl: imageUrl,
		success(res) {
			console.log(res);
			uni.showToast({
				title: '分享成功',
				icon: 'none'
			})
		},
		fail(e){
			console.log(e);
		}
	});
}
async function downloadFile(fileUrl){
	return new Promise(function(resolve,reject){
		uni.downloadFile({
			url: fileUrl,
			success(res){
				resolve(res);
			},
			fail(e){
				reject(e)
			}
		})
	})
}
function shareWeChat(scene, callback = null){
	commonShare("weixin", scene, callback)
}
function shareQQ(callback = null){
	commonShare("qq", "", callback)
}
function shareWeiBo(callback = null){
	commonShare("sinaweibo", "", callback)
}
module.exports = {
	shareWeChat,
	shareQQ,
	shareWeiBo,
	commonShare
}