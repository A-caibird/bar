/* 
 @params(tempFilePath, size)
 tempFilePath: 图片临时路径
 size： 图片最大限制 单位Kb
 */
function compress(tempFilePath, size) { //压缩图片 图文分享要求分享图片大小不能超过20Kb
	console.log('开始压缩');
	let img = tempFilePath;
	return new Promise((res) => {
		var localPath = plus.io.convertAbsoluteFileSystem(img.replace('file://', ''));
		console.log('after' + localPath);
		// 压缩size
		plus.io.resolveLocalFileSystemURL(localPath, (entry) => {
			entry.file((file) => { // 可通过entry对象操作图片 
				console.log('getFile:' + JSON.stringify(file));
				if (file.size > size) { // 压缩后size 大于20Kb
					plus.zip.compressImage({
						src: img,
						dst: img.replace('.jpg', '2222.jpg').replace('.JPG',
							'2222.JPG'),
						width: '10%',
						height: '10%',
						quality: 1,
						overwrite: true
					}, (event) => {
						console.log('success zip****' + event.size);
						let newImg = img.replace('.jpg', '2222.jpg').replace('.JPG',
							'2222.JPG');
						res(newImg);
					}, function(error) {
						uni.showModal({
							content: '分享图片太大,需要请重新选择图片!',
							showCancel: false
						})
					});
				}
			});
		}, (e) => {
			console.log('Resolve file URL failed: ' + e.message);
			uni.showModal({
				content: '分享图片太大,需要请重新选择图片!',
				showCancel: false
			})
		});
	})
}
export {
	compress
}
