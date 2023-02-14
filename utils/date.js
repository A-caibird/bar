function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

function formatTime(number, format) {
	if (!format) {
		format = 'Y-M-D h:m:s'
	}

	var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	var returnArr = [];

	var date = new Date(number);
	returnArr.push(date.getFullYear());
	returnArr.push(formatNumber(date.getMonth() + 1));
	returnArr.push(formatNumber(date.getDate()));

	returnArr.push(formatNumber(date.getHours()));
	returnArr.push(formatNumber(date.getMinutes()));
	returnArr.push(formatNumber(date.getSeconds()));

	if(format){
		for (var i = 0; i < returnArr.length; i++) {
			format = format.replace(formateArr[i], returnArr[i]);
		}
	}
	return format;
}
function compareDate(firstDate, secDate) {
	try {
		if (!firstDate) {
			return 1;
		}
		if (!secDate) {
			return -1;
		}
		let firstDateNum = new Date(firstDate).getTime();
		let secDateNum = new Date(secDate).getTime();
		let subNum = firstDateNum - secDateNum;
		if (subNum > 0) {
			return 1;
		} else if (subNum == 0) {
			return 0;
		} else {
			return -1;
		}
	} catch (e) {
		console.log("compareDate 异常");
		console.log(e);
	}
}


module.exports = {
	formatTime: formatTime,
	compareDate: compareDate,
}
