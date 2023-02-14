import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import store from "@/store/index.js"//带有全局的底部tab的消息数量和goeasy的一些方法
import storage from  '@/common/storage.js'//有用户登录token、用户信息、定位信息和支付密码的一些信息
import toast from '@/common/toast.js'//封装了uniapp中的一些简单提示框
import amapFile from '@/utils/amap-wx.js'//地图相关
import nav from '@/common/nav.js'//封装了页面跳转方法和白名单页面列表
import utils from '@/mixins/utils'//基础的一些工具方法
import cross from '@/common/cross.js'
import popShare from '@/components/pop/share.vue'
import interceptor from '@/api/http.interceptor.js'
import api from '@/api/http.api.js'
Vue.mixin(utils)
Vue.component('popShare', popShare);

Vue.prototype.$cross = cross;
Vue.prototype.$nav = nav;
Vue.prototype.$store = store;
Vue.prototype.$statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
Vue.prototype.$radio = uni.getSystemInfoSync().windowWidth / 750; // px / rpx
Vue.prototype.$storage = storage;
Vue.prototype.$toast = toast;
Vue.prototype.$map = new amapFile.AMapWX({key: '8a4e73cf664705aa278d76ffd5efd722'});

Vue.config.productionTip = false
Vue.use(uView);

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
Vue.use(interceptor, app);
Vue.use(api, app);

app.$mount()


