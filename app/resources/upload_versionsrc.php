<?php
    include_once 'config.php';
    $versionsrcname = $_POST['versionsrcname'];
    $versionsrcdir = $_POST['versionsrcdir'];
    $versioncontent = $_POST['versioncontent'];
    $path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . $versionsrcname;
    $fp = fopen($path, "w");
    $ret = fwrite($fp, $versioncontent);
    fclose($fp);

    $remoate_dir = $config['app']['base_dir'] . $versionsrcdir;
    $remote_path = $remoate_dir . DIRECTORY_SEPARATOR . $versionsrcname;
    $ftp_conn = ftp_connect($config['ftp']['host']);
    $login_result = ftp_login($ftp_conn, $config['ftp']['user'], $config['ftp']['pass']);
	ftp_mkdir ($ftp_conn , $remoate_dir);
	if (ftp_put($ftp_conn, $remote_path, $path, FTP_BINARY)) {
	} else {
	}
	ftp_close($ftp_conn);
?>
