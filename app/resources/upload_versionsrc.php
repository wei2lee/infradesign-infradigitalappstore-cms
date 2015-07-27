<?php
    include_once 'config.php';
    include_once 'lib/util.php';

    $versionsrcname = $_POST['versionsrcname'];
    $versionsrcdir = $_POST['versionsrcdir'];
    if(!endsWith($versionsrcdir, DIRECTORY_SEPARATOR)) {
        $versionsrcdir .= DIRECTORY_SEPARATOR;
    }


    $versioncontent = $_POST['versioncontent'];
    $path = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . $versionsrcname;
    $fp = fopen($path, "w");
    $ret = fwrite($fp, $versioncontent);
    fclose($fp);

    $remote_dir = $config['app']['base_dir'] . $versionsrcdir;
    $remote_path = $remote_dir . $versionsrcname;
    $ftp_conn = ftp_connect($config['ftp']['host']);
    $login_result = ftp_login($ftp_conn, $config['ftp']['user'], $config['ftp']['pass']);

    echo $remote_dir;
    echo ftp_size ($ftp_conn, $remote_dir);
    if(!ftp_directory_exists ($ftp_conn, $remote_dir)){
	   ftp_mkdir ($ftp_conn , $remote_dir);
    }
	if (ftp_put($ftp_conn, $remote_path, $path, FTP_BINARY)) {
	} else {
	}
	ftp_close($ftp_conn);
?>
