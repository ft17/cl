<?php
class PassHash {

	// blowfish
	private static $algo = '$2a';

	// cost параметр
	private static $cost = '$10';

	// для наших нужд
	public static function unique_salt() {
		return substr(sha1(mt_rand()),0,22);
	}

	// генерация хэша
	public static function hash($password) {
		return crypt($password,
					self::$algo .
					self::$cost .
					'$' . self::unique_salt());
	}

	// сравнение пароля и хэша
	public static function check_password($hash, $password) {
		$full_salt = substr($hash, 0, 29);

		$new_hash = crypt($password, $full_salt);

		return ($hash == $new_hash);
	}
}
?>
