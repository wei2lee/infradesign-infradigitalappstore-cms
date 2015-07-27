<?php
//error_reporting(0);
error_reporting(E_ALL);

$isDev = false;



$actual_link = "http://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
if (strpos($actual_link, '127.0.0.1') !== false) $isDev = true;
if (strpos($actual_link, 'localhost') !== false) $isDev = true;
if (strpos($actual_link, 'staging') !== false) $isDev = true;

$config = array(
    "ftp" => array(
        "user" => "infradigital",
        "pass" => "indigi#2015",
        "host" => "103.9.149.57",
        "port" => 21
    ),
    "app" => array(
        "base_dir" => "/infradesign/appstore/"
    ),
    "isDev" => $isDev
);

?>