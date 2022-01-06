const reportList = [{
		value: '色情言语、图片',
		select: false
	},
	{
		value: '违法违禁品',
		select: false
	},
	{
		value: '赌博',
		select: false
	},
	{
		value: '政治谣言',
		select: false
	},
	{
		value: '恐怖血腥',
		select: false
	},
	{
		value: '其它',
		select: false
	}
]
const orderStatus = [{
		"name": '全部',
		'value': '',
	},
	{
		"name": '待付款',
		'value': 'paying',	
	},
	{
		"name": '待到店',
		'value': 'noShop',
	},
	{
		"name": '待评价',
		'value': 'comment',
	},
	{
		"name": '已完成',
		'value': 'complete',
	}
]
const sexList = [
	{
		label: '男',
		value: '男'
	},
	{
		label: '女',
		value: '女'
	}
]
const billTypeList = [
	{
		label: '增值税普通发票',
		value: 'normal'
	},
	{
		label: '增值税专用发票',
		value: 'professional'
	}
]

module.exports = {
	reportList,
	orderStatus,
	sexList,
	billTypeList
}
