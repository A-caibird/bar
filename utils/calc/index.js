
// 加法
function cAdd(num1, num2) {
    var r1,r2;
    try{ r1 = num1.toString().split('.')[1].length; }catch(e){ r1 = 0; }
    try{ r2 = num2.toString().split(".")[1].length; }catch(e){ r2 = 0; }
    var m = Math.pow(10, Math.max(r1,r2));
    return Math.round(num1*m + num2*m) / m;
}
// 减法
function cSub(num1, num2) {
    var r1,r2;
    try{ r1 = num1.toString().split('.')[1].length; }catch(e){ r1 = 0; }
    try{ r2 = num2.toString().split(".")[1].length; }catch(e){ r2 = 0; }
    var m = Math.pow(10, Math.max(r1,r2));
    var n = (r1 >= r2) ? r1 : r2;
    return (Math.round(num1*m - num2*m)/m).toFixed(n);
}
// 乘法
function cMul(num1, num2){
    var r = 0;
    try{ r += num1.toString().split(".")[1].length; }catch(e){};
    try{ r += num2.toString().split(".")[1].length; }catch(e){};
    var n1 = Number(num1.toString().replace(".",""));
    var n2 = Number(num2.toString().replace(".",""));
    return n1 * n2 / Math.pow(10, r);
}
// 除法
function cDiv(num1, num2){
    var r1,r2;
    try{ r1 = num1.toString().split('.')[1].length; }catch(e){ r1 = 0; }
    try{ r2 = num2.toString().split(".")[1].length; }catch(e){ r2 = 0; }
    var n1 = Number(num1.toString().replace(".",""));
    var n2 = Number(num2.toString().replace(".",""));
    return (n1/n2) * Math.pow(10, r2-r1);
}
module.exports={
    cAdd,
	cSub,
	cMul,
	cDiv
}
