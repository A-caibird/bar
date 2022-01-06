import {actionDB} from '../sql'
/* 	
	数据库聊天记录表结构
	id：主键 自增长 int
	time: 时间戳 bigInt (必填)
	type: 消息类型 int（0 文本，1 图片，2 邀约消息）  （必填）
	chat_type: 聊天类型 int 单聊0 群聊1（TODO) （必填）
	content： 消息内容 text (type为3时，content内容为地址名)
	src： 本地地址 varchar （图片类型、地址类型、语音类型、视频类型必填）
	lng： 经度 double
	lat： 纬度 double
	fromId: 发送者id varchar （必填）
	toId: 接受者id varchar （必填）
	account: 账号拥有者 varchar （必填）
	duration：时长 int （语音必填）
	status: 消息状态 （0 初始状态）（1发送中）（2 发送成功）（3 发送失败）
	read: 消息是否已读（目前用于语音）1 已读  0 未读
	coustom: 自定义字段 varchar (自定义消息 用来判断自定义的消息类型)
	orderId: 订单id varchar(type=2,3时必填)
	clubCover: 酒吧封面 varchar(type=2,3时必填)
	clubName: 酒吧名称 varchar(type=2,3时必填)
	date:预定时间 varchar(type=2,3时必填)
	cardTableName:卡台名称 varchar(type=2,3时必填)
	awkwardWineId:邀约订单的邀约id varchar(type=2时必填)
	agreeStatus:同意拒绝状态 agree refuse none varchar(type=2,3时必填)
 */
// 视频下载表sql
const table = 'table_chat_list'
const table_sql = `create table if not exists table_chat_list("id" INTEGER PRIMARY KEY AUTOINCREMENT,"type" INT,"time" BIGINT,"chat_type" INT,"content" VARCHAR,"src" VARCHAR,"lng" DOUBLE,"lat" DOUBLE,"fromId" VARCHAR,"toId" VARCHAR,"account" VARCHAR,"duration" INT,"status" INT,"read" INT,"coustom" VARCHAR,"orderId" VARCHAR,"clubCover" VARCHAR,"clubName" VARCHAR,"date" VARCHAR,"cardTableName" VARCHAR,"awkwardWineId" VARCHAR,"agreeStatus" VARCHAR)`

module.exports =  {
	getChatListFromDB:(account,friendId,pageNumber=1)=>{
		return new Promise((resolve, reject) => {
			const pageStart = 15 * (pageNumber - 1)
			const sql = `select * from ${table} where account="${account}" and (toId="${friendId}" or fromId="${friendId}") order by time desc limit 15 offset ${pageStart}`
			actionDB('r', table_sql, sql)
			 .then(res => resolve(res.reverse()))
		})
	},
	setChatListToDB:(chatList)=>{
		return new Promise((resolve, reject) => {
			let sqlList = []
			chatList.forEach(ele => {
				let key = '',
					val = '';
				for(let i in ele) {
					// varchar类型 字符串字段 需要加上引号
					if(i === 'account' || i === 'content' || i === 'src' || i === 'coustom' || i === 'toId' || i === 'fromId'|| i === 'orderId'|| i === 'clubCover'|| i === 'clubName'|| i === 'date'|| i === 'cardTableName'|| i === 'awkwardWineId'|| i === 'agreeStatus') {
						key += (i + ',')
						val += ('"' + ele[i] + '",')
					} else if(i === 'time' ||i === 'type' || i === 'chat_type'|| i === 'duration'|| i === 'status'|| i === 'read') {
						key += (i + ',')
						val += (ele[i] + ',')
					}
				}
				key = key.substring(0, key.length-1)
				val = val.substring(0, val.length-1)
				sqlList.push(
					`insert into ${table}(${key}) values(${val})`
				)
			})
			actionDB('cud', table_sql, sqlList)
			.then(() => {
				resolve()
			})
		})
	},
	setChatListAgreeStatusToDBByTimeType:(account,friendId,time,type,agreeStatus)=>{
		return new Promise((resolve, reject) => {
			const sql = `update ${table} set agreeStatus="${agreeStatus}" where account="${account}" and (toId="${friendId}" or fromId="${friendId}") and time="${time}" and type="${type}"`
			actionDB('cud', table_sql, sql)
			.then(()=> {
				console.log('修改成功');
			})
		})
	},
	delChatListToDB:(account,friendId)=>{
		return new Promise((resolve, reject) => {
			console.log(2)
			const sql = `delete from ${table} where account="${account}" and (toId="${friendId}" or fromId="${friendId}")`
			actionDB('cud', table_sql, sql)
			.then(()=> {
				console.log('删除成功');
			})
		})
	},
	selectAll:()=>{
		return new Promise((resolve, reject) => {
			const sql = `select * from ${table}`
			actionDB('r', table_sql, sql)
			 .then(res => resolve(res))
		})
		
	},
	dropTable:()=>{
		return new Promise((resolve, reject) => {
			const sql = `drop table ${table}`
			actionDB('cud', table_sql, sql).then(res=>{
				resolve(res)
			}).catch(err=>{
				reject(err)
			})
		})
	},
	

}
