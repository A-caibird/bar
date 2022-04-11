export default {
	data() {
		return {
			days: '00',
			hours: '00',
			minutes: '00',
			seconds: '00'
		}
	},
	methods: {
		timeIntervalEnd(){return;},
		countdown(before) {
			var before = new Date(before);
			var today = new Date();
			var totalSeconds = 0;
			if ((today - before) <= 0) {
				totalSeconds = (before - today) / 1000;
			} else {
				totalSeconds = (today - before) / 1000;
				this.timeIntervalEnd();
				return; // 时间超出，不做倒计时
			}

			totalSeconds = parseInt(totalSeconds);
			var seconds, minutes, hours, days, temp;
			var count;

			days = totalSeconds / (60 * 60 * 24);
			days = parseInt(days);

			temp = totalSeconds - days * (60 * 60 * 24)
			hours = temp / (60 * 60);
			hours = parseInt(hours);

			temp = temp - hours * (60 * 60);
			minutes = temp / 60;
			minutes = parseInt(minutes);

			seconds = temp - minutes * 60;
			// count = this.formatNum(days) + ':' + this.formatNum(hours) + ":" + this.formatNum(minutes) + ":" + this.formatNum(seconds);
			// return {
			// 	days: this.formatNum(days),
			// 	hours: this.formatNum(hours),
			// 	minutes: this.formatNum(minutes),
			// 	seconds: this.formatNum(seconds),
			// 	totalSeconds: totalSeconds,
			// }
			this.days = this.formatNum(days);
			this.hours = this.formatNum(hours);
			this.minutes = this.formatNum(minutes);
			this.seconds = this.formatNum(seconds);
		},
		// 格式化数字
		formatNum(num) {
			if (parseInt(num) < 10) {
				return ('0' + num);
			} else {
				return (num + '');
			}
		}
	},
}
