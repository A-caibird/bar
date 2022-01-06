const db_name = "db_chat_service"; //数据库名称
/*
	打开数据库
	name: String 数据库名
*/
function openDB(name) {
	return new Promise((resolve, reject) => {
		// 确保_doc/h.db文件存在
		plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function(fs){  
		    fs.root.getFile('s.db', {create:true}, function(fileEntry){  
		        // console.log('ensure h.db file!');  
				// 打开数据库 若数据库不存在会新建数据库
				if(plus.sqlite.isOpenDatabase({
					name,
					path: '_doc/s.db',
				})){
					// 判断数据是否有打开 true 表示打开
					closeDB(name).then(() => {
						plus.sqlite.openDatabase({
						    // name: 'chat_record',  
							name,
						    path: '_doc/s.db',
						    success: function(e){  
						        console.log('数据库打开');  
								resolve(e)
						    },
						    fail: function(e){  
						        console.log(`数据库打开失败：${e.message}`);  
								reject(e)
						    }  
						});
					}).catch(e => {
						console.log(`openDB closeDB异常 ${e.message}`);
					})
				}else{
					plus.sqlite.openDatabase({
					    // name: 'chat_record',  
						name,
					    path: '_doc/s.db',
					    success: function(e){  
					        console.log('数据库打开');  
							resolve(e)
					    },  
					    fail: function(e){  
					        console.log(`数据库打开失败：${e.message}`);  
							reject(e)
					    }  
					});
				}
				 
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
				// console.log('sql执行成功');
				resolve()
			},
			fail: (e) => {
				console.log(`sql执行失败：${e.message}`);
				console.log(sql);
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
				console.log('sql查询成功: '+JSON.stringify(res));
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

/* 
	数据库增删改查操作封装
	mode r 读 cud 增删改
	table 表 执行语句的表
	sql sqlite查询语句
 */
function actionDB(mode, table, sql) {
	return new Promise((resolve, reject) => {
		let result;
		// console.log(db_name)
		// 打开数据库
		openDB(db_name)
		.then(() => {
			// console.log('创建表')
			// console.log(table);
			// 创建表
			return executeSql(db_name, table)
		})
		.then(() => {
			// 执行语句
			// console.log('执行语句')
			// console.log(sql);
			if(mode !== 'r') {
				return executeSql(db_name, sql)
			} else {
				return selectSql(db_name, sql)
			}
		})
		.then((ret) => {
			result = ret
			// 关闭连接
			return closeDB(db_name)
		})
		.then(() => {
			// 回调
			resolve(result)
		})
		.catch((e) => {
			reject(e)
			console.log(e);
			console.log(e.message);
		})
	})
}
export default{
	openDB,
	executeSql,
	closeDB,
	selectSql,
	actionDB
}