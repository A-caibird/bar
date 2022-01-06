function setNavBarColor(){
	// #ifdef APP-PLUS
	if(plus.os.name != 'iOS') {
		//切换安卓虚拟按键颜色
		var color = plus.android.newObject("android.graphics.Color")  
		var ac = plus.android.runtimeMainActivity();  
		var bgc = plus.android.invoke(color, "parseColor", "#10133A");  
		var win = plus.android.invoke(ac, "getWindow");
		plus.android.invoke(win, "setNavigationBarColor", bgc);
	}
	// #endif
	
}
//设置安卓虚拟按键颜色
module.exports = setNavBarColor
