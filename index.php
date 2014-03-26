<?php
// echo phpinfo();
header("Content-type: text/html; charset=utf-8");


if ($_SERVER["REQUEST_METHOD"] == "POST") {
	// Форма передавала информацию
	// $login = strip_tags($_POST["name"]);
	// $password = $_POST["age"] * 1;
	// $email = clearEmail
	
	// // Сохранение в cookie на сутки
	// setcookie("userName", $name);
	// setcookie("userAge", $age);
	
	// // Обработка формы
	// // ... 
	
	// // перезапрос формы методом GET
	// header("Location: " . $_SERVER["PHP_SELF"]);
	// exit;
}

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<script src="js/lib/jquery.js"></script>
	<script src="js/lib/less.js"></script>
	<script src="js/my/events.js"></script> 
	<script src="js/my/service.lib.js"></script>

	<link href="css/reset.css" rel="stylesheet">
	<link href="css/mainsizes.less" rel="stylesheet">
	<link href="css/header.less" rel="stylesheet">
	<!-- <link href="css/centraldiv.less" rel="stylesheet"> -->
	<!-- <link href="css/footer.less" rel="stylesheet"> -->



	<title>Кальклуятор</title>
</head>
<body>
<div id="mainDiv">
	<div id="header">
		<p>Шапка сайта</p>
	</div>
<!-- 	<div id="centraldiv">
		<form action="<?=$_SERVER['PHP_SELF']?>" method="post" name="registration">
			<p>Придумайте логин:<input type="text" name="login" size="50"></p>
			<p>Придумайте пароль:<input type="text" name="password" size="50"></p>
			<p>Введите ваш email:<input type="text" name="email" size="50"></p>
			<p><input type="submit" value="Зарегистрироваться"></p>
		</form>

		<p id="status"></p>
		<p>Введите выражение:<input type="text" name="expression" size="50" id="expression"></p>
		<p><input type="submit" value="Вычислить" id="calcBtn"></p>
		<p id="result">Результат: </p>
	</div>
	<div id="footer">
		<p>Это подвал сайта</p>
	</div>
</div> -->


</body>
</html>