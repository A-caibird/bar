export default{
	methods:{
		lookDetail(id){
			this.$u.route('/pages/order/detail', {
				id
			});
		}
	}
}