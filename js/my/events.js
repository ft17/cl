// статус по умолчанию - ожидается ввод
//как численного выражения,так и формулы
var DEFAULT_STATUS = 1;

// введено корректное численное выражение
var CAN_NUM_EXPR = 2;

//введена корректно формула
var CAN_FORMULA = 3;

// ожидается ввод формулы
var WAIT_FORMULA = 7;

// ожидается ввод численного выражения
var WAIT_NUM_EXPR = 8;

// ошибка ввода в терминал
var ERR_INPUT = 4;

// ошибка - переполнение открывающих скобок
var ERR_OPEN_BRT = 5;

// ошшибка - переполнение закрывающих скобок
var ERR_CLOSED_BRT = 6;

// устноавка текущего состояния ввода по умолчанию
var glCurStatus = DEFAULT_STATUS;

// регулярное выражение для встроенных констант и функций
var mathFunArr = ["sin", "cos", "ctg", "tg"];

$(document).ready(function() {

// setMathPow("2+Math.pow(2,3)^4");

// alert(zamena("2^3^4"));
// alert(Math.pow(2, Math.pow(3,Math.pow(1,1))));
// строка терминала
var glTerminalString = "";

// строка для вычисления (для функции eval)
var glStringForEval = ""

// строка, содержащая корректную форму для отображения
//(пробелы, знаки операций)
var glResultString = "";

var cloneGlString = "";

$('#expression').val("");

// установка статуса ввода
setStatus(DEFAULT_STATUS);

// обработка события keyup -
// ввода в терминал
$('#expression').keyup(function(key){

// получаем значение из терминала
glTerminalString = $('#expression').val();

// удаляем все пробелы
delSpaces();

// приводим строку glStringForEval и glResultString
// glStringForEval - точки вместо запятых, убираем пробелы
// glResultString - запятые вместо точек, добавляем пробелы
expression2corrected();

// проверка корректности выражения
var resTest = exprIsCorrect();

// установка текущего статуса
setStatus(resTest);

// если введено корректное численное выражение,
// то вычисляем
if(glCurStatus == CAN_NUM_EXPR) calc(); 
});

$('#expression').keypress(function(key){
	// автоматическое добавление закрывающей скобки
	if(key.which == 40) {
		
		//получаем текущую позицию курсора
		var curPos = window.expression.selectionStart ;
		glTerminalString = $('#expression').val();

		// если после скобки не пустой символ, то закрывающую скобку НЕ ДОБАВЛЯЕМ
		if(glTerminalString[curPos] !== undefined && glTerminalString[curPos] != " ") {
			return true;
		}

		// вставляем скобки ()
		var newStr = glTerminalString.substr(0, curPos) + "()" + glTerminalString.substring(curPos);
		$('#expression').val(newStr);

		// устанавливаем позицию курсора между скобками (|)
		setCaretToPos(document.getElementById("expression"), curPos + 1);
		key.stopPropagation();
		return false;
	}

	// при вводе буквы б(1073) вставляем запятую
	// при вводе буквы ю(1073) вставляем точку
	// alert(key.which);
	if(key.which == 1102 || key.which == 1073) {
	
		//получаем текущую позицию курсора
		var curPos = window.expression.selectionStart ;
		glTerminalString = $('#expression').val();

			var smb;
			if(key.which == 1102) smb = ".";
			if(key.which == 1073) smb = ",";
			var newStr = glTerminalString.substr(0, curPos) + smb + glTerminalString.substring(curPos);
			$('#expression').val(newStr);

			// устанавливаем курсор после точки
			setCaretToPos(document.getElementById("expression"), curPos+1);

			key.stopPropagation();
			return false;
		}
	});

// удаление всех пробелов из строки
function delSpaces() {
	var reg = /\s/g;
	glStringForEval = glTerminalString.replace(reg, "");
}

// приводим строку выражения в корректную форму
function expression2corrected() {
	var reg;

	//вставляем знак умножения
	reg = /(\)?(\d|[a-zA-Z])(([a-zA-Z]+\(?)|(\()))|(\)(\(|[a-zA-Z]|\d))/g;
	glStringForEval = glStringForEval.replace(reg, replacerMultOp);

	// для glStringForEval вместо запятых вставляем точки
	reg = /\,/g;
	glStringForEval = glStringForEval.replace(reg, replacerComma);

	// для glResultString вместо точек вставляем запятые
	reg = /\./g;
	glResultString = glStringForEval.replace(reg, replacerPoint);

	// ставим пробел ПЕРЕД знаком операции
	reg = /[^\s\(]([\+\-\*\/])/g;
	glResultString = glResultString.replace(reg, replacerLeft);

	// ставим пробел ПОСЛЕ знаком операции
	reg = /[^\(]([\+\-\*\/])[^\s]/g;
	glResultString = glResultString.replace(reg, replacerRight);
}

function exprIsCorrect() {
	// Удаление скобок
	// если после скобки стоит + или - [(+ или  (-], 
	// то его удаляем вместе со скобкой

	var stringForTest = "";
	var cntOpenBrackets = 0;
	var cntClosedBrackets = 0;
	var reg;
	var gates;
	for(var i = 0; i < glStringForEval.length; i++) {
		if(glStringForEval[i] == "(") {
			cntOpenBrackets++;
			if(glStringForEval[i+1] == "+" || glStringForEval[i+1] == "-")++i;
		}
		else if(glStringForEval[i] == ")")
				cntClosedBrackets++;
		else if(glStringForEval[i] == "^")
			stringForTest += "*";
		else stringForTest += glStringForEval[i];
	}

	if(cntOpenBrackets != cntClosedBrackets) {
		if(cntOpenBrackets > cntClosedBrackets) return ERR_CLOSED_BRT;
		else return ERR_OPEN_BRT;
	}

	// заменяем математические функции на 1*
	var rg = getRegMathFun(mathFunArr);
	var expr = new RegExp(rg, 'g');
	stringForTest = stringForTest.replace(expr, replacerFun);

	//проверка на пустую строку
	if(glTerminalString == "") return DEFAULT_STATUS;
	if(glTerminalString == "+") return DEFAULT_STATUS;
	if(glTerminalString == "-") return DEFAULT_STATUS;

	//проверка на начало ввода численного выражения
	reg = /^[\+\-]?(([1-9][0-9]*(\.[0-9]*)?|(0\.[0-9]*)|0)[\+\-\/\*]?)?$/;
	gates = reg.test(stringForTest);
	if(gates) return WAIT_NUM_EXPR;

	//проверка на начало ввода формулы типа N=+b+
	reg = /^([a-zA-Z][\=\-\+]?)$|^([a-zA-Z]\=[\+\-]?(([a-zA-Z][\+\-])|([1-9][0-9]*(\.[0-9]+)?|(0\.[0-9]+)|0)[\+\-]?)?)$|(^[\+\-][a-zA-Z][\+\-]?)$/;
	gates = reg.test(stringForTest);

	if(gates) return WAIT_FORMULA;

	// проверка на ввод вида a=b или a=-b, готовая формула
	reg = /^[a-zA-Z]\=(\+|\-)?[a-zA-Z]$/;
	gates = reg.test(stringForTest);
	if(gates) return CAN_FORMULA;

	// проверка на соответсвие ЧИСЛЕННОМУ ВЫРАЖЕНИЮ
	reg = /^[\+\-]?([1-9][0-9]*(\.[0-9]+)?|(0\.[0-9]+)|0)([\+\-\*\/]{1}([1-9]{1}[0-9]*(\.[0-9]+)?|(0\.[0-9]+)|0))+([\+\-\*\/\.]?)$/;
	gates = reg.exec(stringForTest);

	if(gates !== null) {
		var last = gates[gates.length - 1];
		if(isWaitSmb(last)) return WAIT_NUM_EXPR;
		else return CAN_NUM_EXPR;
	}

	// 2. Проверяем соответствует ли выражение виду многочлена типа a+b-23
	reg = /^([a-zA-Z]\=)?[\+\-]?([a-zA-Z]|([1-9][0-9]*(\.[0-9]+)?|(0\.[0-9]+)|0))([\+\-\*\/]{1}([a-zA-Z]|([1-9][0-9]*(\.[0-9]+)?|(0\.[0-9]+)|0)))+([\+\-\*\/]?)$/;
	gates = reg.exec(stringForTest);
	
	if(gates !== null) {
		var last = gates[gates.length - 1];
		if(isWaitSmb(last)) return WAIT_FORMULA;
		else return CAN_FORMULA;
	}
	else return ERR_INPUT;

	
	if(gates) return CAN_FORMULA;
}
	
// функция вычисления выражения
function calc() {
	var resExpress = "";

	// замена возведения в степень на функцию Math.pow(x,y)
	glStringForEval = setMathPow(glStringForEval);

	// замена тригонометрических функция на Math
	 glStringForEval = setMathFun(glStringForEval);


	var TUTU = 0;
	try {
		resExpress = eval(glStringForEval);
	} catch (err) {
		resExpress = "Произошла ошибка - " + err.message;
	}

	var res = "Результат: " + glResultString + " = " + resExpress;
	$('#result').text(res);

	var TUeTU = 1;
}

// обработка кнопки "вычислить"
$('#calcBtn').click( function() {
	calc();
});

function setTrig(str) {
	reg = /sin/g;
	str = str.replace(reg, replacerTrig);
}

// замена запятых точками
function replacerTrig(str, p1, p2, offset, s) {
	var TTT= 0;
	return '.';
}
}); // $(document).ready(function() {

// число ([1-9][0-9]*(\.[0-9]+)?|(0(\.[0-9]+)?))