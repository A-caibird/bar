// 数据库名 
// 聊天记录
const db_name = 'db_jiyan';


function openDB(name) {
	return new Promise((resolve, reject) => {
		// 确保_doc/a.db文件存在
		plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function(fs){  
		    fs.root.getFile('a.db', {create:true}, function(fileEntry){  
		        console.log('ensure a.db file!');  
				// 打开数据库
				plus.sqlite.openDatabase({  
				    // name: 'chat_record',  
					name,
				    path: '_doc/a.db',
				    success: function(e){  
				        console.log('数据库打开');  
						resolve(e)
				    },  
				    fail: function(e){  
				        console.log(`数据库打开失败：${e.message}`);  
						reject(e)
				    }  
				}); 
		    });  
		}); 
	})
}

/* 
	执行增删改操作的SQL语句
	在执行sql前 需要先确认表创建成功
	name: String 数据库名
	sql: Array[ String ] | String  需要执行的SQL语句
 */
function executeSql(name, sql) {
	return new Promise((resolve, reject) => {
		plus.sqlite.executeSql({
			name,
			sql,
			success: (res) => {
				console.log('sql执行成功');
				resolve()
			},
			fail: (e) => {
				console.log(`sql执行失败：${e.message}`);
				reject(e)
			}
		})
	})
}

/* 
	执行查询操作
	name: String 数据库名
	sql: Array[ String ] | String  需要执行的SQL语句
 */
function selectSql(name, sql) {
	return new Promise((resolve, reject) => {
		plus.sqlite.selectSql({
			name,
			sql,
			success: (res) => {
				console.log('sql查询成功');
				resolve(res)
			},
			fail: (e) => {
				console.log(`sql查询失败：${e.message}`);
				reject(e)
			}
		})
	})
}

/* 
	关闭数据库
	name: String 数据库名
 */
function closeDB(name) {
	return new Promise((resolve, reject) => {
		plus.sqlite.closeDatabase({
			name,
			success: (res) => {
				console.log('数据库关闭成功！');
				resolve()
			},
			fail: (e) => {
				console.log(`数据库关闭失败: ${e.message}`);
				reject(e)
			}
		})
	})
}


module.exports = {
	/*
		数据库增删改查操作封装
		mode r 读 cud 增删改
		table 表 执行语句的表
		sql sqlite查询语句
	 */
	actionDB:(mode, table, sql)=>{
		return new Promise((resolve, reject) => {
			var result;
			// 打开数据库
			openDB(db_name)
			.then(() => {
				// 创建表
				return executeSql(db_name, table)
			})
			.then(() => {
				// 执行语句
				if(mode !== 'r') {
					return executeSql(db_name, sql)
				} else {
					return selectSql(db_name, sql)
				}
			})
			.then(res => {
				console.log('关闭连接')
				result = res
				// 关闭连接
				return closeDB(db_name)
			})
			.then(res => {
				// result = res
				// 回调
				resolve(result)
			})
			.catch((err) => {
				closeDB(db_name)
				reject(err)
			})
		})
	},
}
