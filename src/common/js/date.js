export function formateDate(date, fmt) {
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr)
	}
};