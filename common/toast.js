
export default {
    //纯文字提示
    text:(title='') => uni.showToast({title,icon:'none'}),
    //成功提示
    success:(title='成功') => uni.showToast({title,icon:'success'}),
    //加载提示
    loading:(title='') => uni.showToast({title,icon:'loading'}),
    //确认提示框
	confirm: (title='',content='',showCancel=true) =>{
		return new Promise((resolve,reject)=>{
		    uni.showModal({
		        title,
		        content,
				showCancel,
		        success: (res)=> {
		            if (res.confirm){
		                resolve(res)
		            }
		        },
				fail: (e) => {
					reject(e)
				}
		    })
		})
	}
    
}
