import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import store from "@/store/index.js"
import storage from  '@/common/storage.js'
import toast from '@/common/toast.js'
import amapFile from '@/utils/amap-wx.js'
import nav from '@/common/nav.js'
import utils from '@/mixins/utils'
import cross from '@/common/cross.js'
import GoEasy from '@/js_sdk/goeasy-2.0.13.min.js'
import popShare from '@/components/pop/share.vue'
Vue.mixin(utils)
Vue.component('popShare', popShare);

Vue.prototype.$cross = cross;
Vue.prototype.$nav = nav;
Vue.prototype.$store = store;
Vue.prototype.$statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
Vue.prototype.$radio = uni.getSystemInfoSync().windowWidth / 750; // px / rpx
Vue.prototype.$storage = storage;
Vue.prototype.$toast = toast;
Vue.prototype.$map = new amapFile.AMapWX({key: '4637fe30d42c25fd130d33912b63df70'});
Vue.prototype.goeasy = GoEasy.getInstance({
    host:"hangzhou.goeasy.io",  //若是新加坡区域：singapore.goeasy.io
    appkey:"BC-025546bc12d04071b9113d33a63bbaca",
    modules:['pubsub', 'im']//根据需要，传入‘pubsub’或'im’，或数组方式同时传入
});


Vue.config.productionTip = false
Vue.use(uView);

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})

import interceptor from '@/api/http.interceptor.js'
Vue.use(interceptor, app);

app.$mount()


import api from '@/api/http.api.js'
Vue.use(api, app);
