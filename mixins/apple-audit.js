
const appleAudit = ({
	data(){
		return {
			isAppleAudit:true,
			isOppoAudit:true,
		}
	},
	mounted() {
		this.getIsAppleAudit()
	},
	methods:{
		async getIsAppleAudit(){
			let platform = uni.getSystemInfoSync().platform
			// OPPO版本
			let {code,data} = await this.$u.api.getIsAppleAuditApi({})
			// console.log("***************")
			// console.log('审核');
			// console.log(data)
			// console.log("***************")
			if(code==0) {
				this.isAppleAudit = data.isAppleAudit
				// this.isOppoAudit = false;
			}
		},
	}
})
export default appleAudit