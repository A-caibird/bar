export default {
	data() {
		return {
			url: '',
			pageList: [],
			pageNumber: 1,
			pageSize: 5,
			totalPages: 1,
			params: {},
			more: true, //是否存在更多， 默认是true
			loading: false,			
		}
	},
	methods: {
		// 下拉刷新
		pullRefresh(callback = null) {
			this.pageNumber = 1;
			this.totalPages = 1;
			this.pageList = [];
			this.getPageContent(callback);
		},
		// 上拉加载
		reachBottomLoad() {
			this.pageNumber = this.pageNumber + 1;
			this.getPageContent();
		},
		// 获取某个页面数据
		async getPageContent(callback = null) {
			let url = this.url;
			let pageNumber = this.pageNumber;
			let totalPages = this.totalPages;
			if (url) {
				if (pageNumber > totalPages) {
					this.more = false;
					return console.log('最后一页')
				}
				let params = Object.assign(this.params, {
					pageNumber,
					pageSize: this.pageSize
				})
				// console.log(params);
				this.loading = true;
				let {code,data} = await this.$u.api.commonRequest(url, params)
				if(code==0) {
					let pageList = this.pageList
					if (pageNumber <= 1) {
						pageList = data.list;
					} else {
						pageList = pageList.concat(data.list);
					}
					this.pageList = pageList;
					this.totalPages = data.totalPage;
					this.$nextTick(() => {
						this.loading = false;
					})
				}
				if(callback){
					callback(data)
				}
			}
		}
	}
}
