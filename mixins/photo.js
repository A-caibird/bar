var phoneTag = 0;
export default{
	data(){
		return{
			imgList:[],
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera']
		}
	},
	methods:{
		chooseImgs: function(){
			var vm = this;
			uni.chooseImage({
				count: this.count-this.imgList.length, //默认9
				sizeType: this.sizeType, //可以指定是原图还是压缩图，默认二者都有
				sourceType: this.sourceType, //从相册选择
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
		uploadImg:function(res){
			return new Promise((resolve,reject)=>{
				let vm =this
				//判断上传的图片数量有没有超过9张
				let len = (res.tempFilePaths).length + (vm.imgList).length
				if( len < 9){
					for (let i = 0; i < (res.tempFilePaths).length; i++) {
						const filePath = res.tempFilePaths[i]
						console.log(filePath)
						this.sCompressImg(filePath).then(rs => {
							let path = rs.tempFilePath;
							console.log('压缩成功', path);
							this.uploadEvent(path).then(() => {
								resolve()
							}).catch(() => {
								reject()
							})
						}).catch(e => {
							this.uploadEvent(filePath).then(() => {
								resolve()
							}).catch(() => {
								reject()
							})
						})
				
					}
				
				}else{
					//超过九张，判断还可以加入几张照片
					let remainLen= 9 - (vm.imgList).length
					for (let i = 0; i < remainLen; i++) {
						const filePath = res.tempFilePaths[i]
						console.log(filePath)
						this.sCompressImg(filePath).then(rs => {
							let path = res.tempFilePath;
							this.uploadEvent(path).then(() => {
								resolve()
							}).catch(() => {
								reject()
							})
						}).catch(e => {
							this.uploadEvent(filePath).then(() => {
								resolve()
							}).catch(() => {
								reject()
							})
						})
						
				// 		vm.$u.api.uploadFile(filePath).then(url => {
				// 			let obj={};
				// 			obj.avatar = url;
				// 			vm.imgList.push(obj);
				// 			console.log(vm.imgList)
				// 			resolve()
				// 		}).catch(e => {
				// 			console.log(e);
				// 			uni.hideLoading();
				// 			reject()
				// 		})
				
				
					}
				}
		
			})		
		},
		uploadEvent(filePath){
			return new Promise((resolve, reject) => {
				this.$u.api.uploadFile(filePath).then(url => {
					let obj={};
					obj.avatar = url;
					this.imgList.push(obj);
					resolve()
				}).catch(e => {
					console.log(e);
					uni.hideLoading();
					reject()
				})
			})
		},
		sCompressImg(path){
			return new Promise((resolve, reject) => {
				uni.compressImage({
					src: path,
					success(res){
						resolve(res)
					},
					fail(e) {
						reject(e);
					}
				})
			})
		},
		sCompressVideo(path){
			return new Promise((resolve, reject) => {
				uni.compressImage({
					src: path,
					success(res){
						resolve(res)
					},
					fail(e) {
						reject(e);
					}
				})
			})
		},
		
		//删除图片
		deletePhoto:function(e){
			this.imgList.splice(e,1)
		},
	}
}