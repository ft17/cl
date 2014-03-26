<?php
class DbConn {
	const DB_HOST = "localhost";
	const DB_USER = "root";
	const DB_PASSWORD = "vertrigo";
	const DB_NAME = "cp";
	
	private $_db;
	static private $_instance = null;
	private function __construct() {
		$this->_db = new mysqli(self::DB_HOST, self::DB_USER, self::DB_PASSWORD, self::DB_NAME);
		if ($this->_db->connect_error) {
			die('Ошибка подключения (' . $this->_db->connect_errno . ') '
			. $this->_db->connect_error);
		}
	}

	private function __clone(){}
	static function getInstance() {
		if(self::$_instance == null) {
			self::$_instance = new DbConn();
		}
		return self::$_instance;
	}
	public function getDb() {
		return $this->_db;
	}
}

// конвертируем данные в массив
function db2Array($data) {
	$arr = array();
	while($row = $data->fetch_assoc()) {
		$arr[] = $row;
	}
	return $arr;
}

$con = DbConn::getInstance()->getDb();
$sql = "SELECT id, login, email FROM user";

$result = $con->query($sql);
$result = db2Array($result);

var_dump($result);

// if (!$mysqli->query("DROP TABLE IF EXISTS test") ||
// 	!$mysqli->query("CREATE TABLE test(id INT)") ||
// 	!$mysqli->query("INSERT INTO test(id) VALUES (1)")) {
// 	echo "Не удалось создать таблицу: (" . $mysqli->errno . ") " . $mysqli->error;
// }
?>