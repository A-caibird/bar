import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

// import GoEasy from '@/js_sdk/goeasy-2.0.13.min.js'
// import goEasyUtils from '@/utils/chatJS/goEasyUtils.js'
// import ChatInfo from '@/utils/chatJS/chatInfo.js'
const store = new Vuex.Store({
	state: {
		'list': [{
				'text': 'Club',
				'customIcon': false,
				"count": 0,
			},
			{
				'text': '发现',
				'customIcon': false,
				"count": 0,
			},
			{
				'iconPath': "/static/imgs/common/publish.png",
				'selectedIconPath': "/static/imgs/common/publish.png",
				'text': '',
				'midButton': true,
				'customIcon': false,
			},
			{
				'text': '消息',
				'customIcon': false,
				"count": 0,
				// "badge": {
				// 	isDot: true
				// }
			},
			{
				'text': '我的',
				'customIcon': false,
				"count": 0,
			},
		],
		// pushCount: 0,// 推送未读数量
		// infoCount: 0,// 消息未读数量
		//countFlag:false

	},
	mutations: {
		// 清除消息
		clearInfoCount(state, count) {
			console.log('清除消息');
			console.log(count);
			try {
				console.log(state.list[3]);
				state.list[3].count = count;
			} catch (e) {
				//TODO handle the exception
				console.log(e);
			}
			console.log('清除消息后', state.list[3]);
		},
		setCount(state, count) {
			state.countFlag = count;
		}
		// // 设置通知消息
		// setPushCount(state, count){
		// 	// console.log('更新push', count, state.infoCount)
		// 	state.pushCount = count;
		// 	state.list[3].count = count + state.infoCount;
		// },
		// // 设置消息已读未读
		// setInfoCount(state, count){
		// 	// console.log('更新info', count, state.pushCount)
		// 	state.infoCount = count;
		// 	state.list[3].count = count + state.pushCount;
		// },

	}

})
module.exports = store