// функции установки статуса ввода
function setStatus(status) {
	var tStat;
	switch(status) {
		case DEFAULT_STATUS: tStat = "Ожидается ввод числового выражения или формулы"; break;

		case ERR_INPUT: tStat = "Ошибка ввода"; break;
		case ERR_OPEN_BRT: tStat = "Не хватает открывающих скобок"; break;
		case ERR_CLOSED_BRT: tStat = "Не хватает закрывающих скобок"; break;

		case WAIT_FORMULA: tStat = "Ожидается ввод формулы"; break;
		case WAIT_NUM_EXPR: tStat = "Ожидается ввод числового выражения"; break;

		case CAN_NUM_EXPR: tStat = "Готов вычислить числовое выражение"; break;
		case CAN_FORMULA: tStat = "Готов вычислять формулу"; break;
		
		default: alert("Ошибка статуса");
	}
	glCurStatus = status;
	$('#status').text(tStat);
}

// функция установки позиции курсора в терминале
function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}
	else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

// функция вызова для установки позиции курсора в терминале
function setCaretToPos (input, pos) {
	setSelectionRange(input, pos, pos);
}

function replacerMultOp(str, p1, p2, offset, s) {
	var isMath = isMathFun(str);
	var len = 0;
	if (isMath !== null) len = isMath.length - 1;
	
	var newStr = "";
	for(var i = 0; i < str.length- 1 - len; i++) {
		newStr += str[i] + "*";
	}

	var TT = 0;

	if(isMath !== null) return newStr + isMath;
	return newStr + str[str.length-1];
}

//ищем встроенную функцию в строке
function isMathFun(str) {
	var scmpr;
	var reg;
	var corSmb;
	var gates;
	for(var i = 0; i < mathFunArr.length; i++) {
		scmpr = mathFunArr[i] + "(";
		lastChars = str.slice(str.length - scmpr.length, str.length);
		if(lastChars == scmpr) {
			var _RRR = 0;
			if(scmpr.length == str.length) return lastChars;
			
			reg = /[\d\(\)]/g;
			corSmb = str[str.length-scmpr.length-1];
			gates = reg.test(corSmb);

			var RRR = 0;

			if(gates) return lastChars;
			else return null;
		}
		
	}
	return null;
}

// функция для установки пробела ПЕРЕД знаком операции
function replacerLeft(str, p1, p2, offset, s) {
	return str[0] + " " + p1 + " ";
}

// функция для установки пробела ПОСЛЕ знаком операции
function replacerRight(str, p1, p2, offset, s) {
	return p1 + " " + str[1];
}

// замена запятых точками
function replacerComma(str, p1, p2, offset, s) {
	return '.';
}

// замена точек запятыми
function replacerPoint(str, p1, p2, offset, s) {
	return ',';
}

// проверка - "предназначен" ли символ для ожидания
function isWaitSmb(sign) {
	if (sign == "+" || sign == "-" || sign == "*" || sign == "/" || sign == ".")
		return true;
	return false;
}

// проверка - является ли символ знаком операции
function isSignSmb(sign) {
	if (sign == "+" || sign == "-" || sign == "*" || sign == "/")
		return true;
	return false;
}

// замена мат. функций
function replacerFun(str, p1, p2, offset, s) {
	return "1*";
}

// замена мат. функций объектом Math
function replacerFunForMath(str, p1, p2, offset, s) {
	return "Math." + str;
}

// функция для замены ^ на Math.pow
function setMathPow(str) {
	var _str = str;
	var newString = "";
	var leftSubstr, rightSubstr;
	var leftArg, rightArg;
	var mathStr;
	var lstr, rstr;
	var fl = true;
	for(var i = 0;; i++) {
		// ищем "^"
		if(_str[i] == "^") {
			//получаем подстроку до ^ и после 
			leftSubstr = _str.substr(0, i);
			rightSubstr = _str.substr(i + 1);
			
			// получаем аргументы для функции Math.pow
			leftArg = reverseStr(getArgForPow(reverseStr(leftSubstr), ')'));
			rightArg = getArgForPow(rightSubstr, '(');
			mathStr ="Math.pow(" + setMathPow(leftArg) + "," + setMathPow(rightArg) + ")";
			lstr = _str.substr(0, i - leftArg.length);
			rstr = _str.substr(i + rightArg.length + 1);

			newString = lstr + mathStr;
			_str = lstr + mathStr + rstr;
			i = newString.length - 1;
			if(!(i < _str.length)) break;
		}
		else newString += _str[i];
		if(!(i < _str.length-1)) break;
	}
	return newString;
}

// получение аргумента для Math.pow(x, y)
function getArgForPow(argstr, brk) {
	var arg = "";
	var strBr;
	for(var i = 0; i < argstr.length; i++) {
		if (argstr[i] == brk) {
			strBr = getExprInBrk(argstr.substr(i, argstr.length), brk);
			arg += strBr;
			i += strBr.length-1;
		}
		else if(argstr[i] == revBrk(brk)) return arg;
		else if(!isSignSmb(argstr[i])) { arg += argstr[i];
		}
		else return arg;
	}
	return arg;
}

function revBrk(bracket) {
	if (bracket == ')') return '(';
	else return ')';
}

// получить выражение в скобках (expr)
function getExprInBrk(str, brk) {
	var k = 0;
	var retStr = "";
	for(var i = 0; i < str.length; i++) {
		retStr += str[i];
		if(str[i] == brk) {
			k++;
		} 
		if(str[i] == revBrk(brk)) {
			--k;
			if(k == 0) return retStr;
		}
	}
	return retStr;
}

// переворачивание строки
function reverseStr(str) {
	var newStr = '', i;
	for (i = str.length - 1; i >= 0; i--) {
		newStr += str.charAt(i);
	}
	return newStr;
}

function getRegMathFun(mathFunArr) {
	var reg = "";
	var len = mathFunArr.length;
	for (i = 0; i < len - 1; i++) {
		reg += mathFunArr[i] + "|";
	}
	var f =  reg + mathFunArr[len-1];
	return f;
}

function setMathFun(str) {
	// заменяем математические функции на 1*
	var rg = getRegMathFun(mathFunArr);
	var expr = new RegExp(rg, 'g');
	return str.replace(expr, replacerFunForMath);
}

///2+3^2+1

// у меня основных пока 6 состояний:
// ожидается ввод и формулы и числового выражения: пустая строка, + или -
// ожидается ввод числового выражения: 1, +1, +1+, +1+1*, 1. , 2+67/45-0.34*0.56+
// ожидается ввод формулы: a, a=, a=b+, a=+b+, М=a+b+
// готов к вычислению числового выражения: 1+2, +1+2, 2+3(4-34) и тд
// готов к вычислению формулы: a=b, a=-b, B = abc+df, a+b, -(c-d)(d+0.2ad)
// ошибка ввода: =, 2++3, /, 2-$ и тд

// + еще если закрытые и открытые скобки не совпадают, тож говорит


