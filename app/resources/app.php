<?php

require 'vendor/autoload.php';
include_once "config.php"
 
use Parse\ParseClient;
use Parse\ParseObject;
use Parse\ParseQuery;

 
ParseClient::initialize('N59sh8HxHKoO6MLT84zWAcQ1gQL3cxiZqBSWU2Bb', 'SkCYsbN1Eu4NI0t64nZwrGTW8V9QLfuyMOux7VSw', '0o8t3RJmy0P6MUHQOFzIbmNuIveNhaGjEObe9aPE');

$appQuery = new ParseQuery("App");
$appQuery->equalTo("appid", $_REQUEST['appid']);
$appQuery->includeKey ("client");
$result = $appQuery->first();
if($result) {
    $result = array(
        "client" => ($result->get("client") ? $result->get("client")->get("name") : null),
        "platform" => $result->get("platform"),
        "internaluse" => $result->get("internaluse"),
        "requirement" => $result->get("requirement"),
        "lastupdate" => $result->get("lastupdate"),
        "logosrc" => $result->get("logosrc"),
        "versionsrc" => $result->get("versionsrc"),
        "binarysrc" => $result->get("binarysrc"),
        "plistsrc" => $result->get("plistsrc"),
        "downloadsrc" => $result->get("downloadsrc"), 
        "provisionexpire" => $result->get("provisionexpire"),
        "version" => $result->get("version"),
        "name" => $result->get("name"),
        "appid" => $result->get("appid"),
        "displayname" => $result->get("displayname"),
        "visible" => $result->get("visible")
    );   
}else{
    $result = null;   
}
header('Content-Type: application/json');
echo json_encode(array("error_exist" => !!$result, "result" => $result));

?>