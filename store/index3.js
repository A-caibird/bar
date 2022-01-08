import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import CryptoJS from '@/utils/mqtt/crypto-js.js'
var $mqtt = require("@/utils/mqtt/mqtt.js");

var instanceId = 'post-cn-6ja20o4fp05'; //实例 ID，购买后从控制台获取
var host = "post-cn-6ja20o4fp05.mqtt.aliyuncs.com";
var port = 80;
var groupId = 'GID_patixiu_single'; //MQTT GroupID,创建实例后从 MQTT 控制台创建
var _clientId; //GroupId@@@DeviceId，由控制台创建的 Group ID 和自己指定的 Device ID 组合构成
var accessKey = 'LTAI4G7rLfcuv3kNeHJCxV5c'; //账号的 AccessKey，在阿里云控制台查看
var secretKey = 'EItCMM6e8CICNJsVOON2qa4s09mMx9'; //账号的的 SecretKey，在阿里云控制台查看
// 接受离线消息
var cleanSession = false
var topic = 'patixiu';

const store = new Vuex.Store({
	state:{
		'list': [{
				'text': 'Club',
				'customIcon': false,
				
			},
			{
				'text': '发现',
				'customIcon': false,
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
			},
			{			
				'text': '我的',
				'customIcon': false,
			},
		],
		// mqtt 对象
		mqtt: '',
	},
	mutations:{
		// mqtt 初始化
		initMQTT(state, account) {
			console.log(" mqtt 初始化")
			console.log(account)
			_clientId = groupId + '@@@' + account
			//username和 Password 签名模式下的设置方法，参考文档 https://help.aliyun.com/document_detail/48271.html?spm=a2c4g.11186623.6.553.217831c3BSFry7
			var username = 'Signature|' + accessKey + '|' + instanceId;
			var password = CryptoJS.HmacSHA1(_clientId, secretKey).toString(CryptoJS.enc.Base64);
			const mqttOptions = {
				qos: 2,
			    keepalive: 30,
			    clean: false, 
			    connectTimeout: 5000, // Timeout
			    clientId: _clientId,
			    username,
			    password,
			}
			
			const connectUrl = `${host}:${port}/mqtt`;
			if(state.mqtt){
				state.mqtt.end();
			}
			// #ifdef H5
			state.mqtt = $mqtt.connect('ws://' + connectUrl, mqttOptions);
			// #endif
			
			// #ifdef MP-WEIXIN||APP-PLUS
			state.mqtt = $mqtt.connect('wxs://' + connectUrl, mqttOptions);
			// #endif
			
			state.mqtt.on('connect', () => {
			    console.log('connect: ' + topic);
				// 这里写死订阅主题
				state.mqtt.subscribe(topic, (err) => {
				    if (!err) {
				        console.log(`${topic} 订阅完成`);
				    }
				})
			});
			// 自动重连
			state.mqtt.on('reconnect', (msg) => {
			    console.log('mqtt reconnect', msg)
			});
			// 错误
			state.mqtt.on('error', () => {
			    console.log('mqtt error')
			});
			// 断开
			state.mqtt.on('end', () => {
			    console.log('mqtt end')
			});
			// 掉线
			state.mqtt.on('offline', (msg) => {
			    console.log('mqtt offline',msg)
			});
			// 收到消息
			state.mqtt.on('message', (topic, message) => {
				console.log(message)
				message = JSON.parse(message).payloadString
				// 触发全局事件
				uni.$emit('mqtt-arrived-msg', {
					payload: message
				})
				
			})
		},
		
		sendMsg(state, {msg,chatId}) {
			//发送 P2P 消息，topic 设置方式参考https://help.aliyun.com/document_detail/96176.html?spm=a2c4g.11186623.6.586.694f7cb4oookL7
			let mqttTopic = topic + "/p2p/" + groupId + '@@@' + chatId 
			let message = {
				payloadString: msg,
				destinationName: mqttTopic
			}
			msg = JSON.parse(msg)
			console.log(message)
			state.mqtt.publish(mqttTopic, JSON.stringify(message))
			// 删除好友消息不推送
			
			// console.log('发送消息');
			
		},
		// 关闭 mqtt
		closeMqtt(state) {
			state.mqtt.end();
		},
		openMqtt(state){
			state.mqtt.reconnect();
		},
		// 订阅消息
		subscribe(state, payload) {
			state.mqtt.subscribe(payload.topic, (err) => {
			    if (!err) {
			        console.log(`${payload.topic} 订阅完成`);
			    }
			})
		}
	},
	actions:{
		
	}
})
module.exports = store