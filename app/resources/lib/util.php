<?php
function startsWith($haystack, $needle)
{
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }

    return (substr($haystack, -$length) === $needle);
}

function ftp_directory_exists($ftp, $dir) 
{ 
    // Get the current working directory 
    $origin = ftp_pwd($ftp); 

    // Attempt to change directory, suppress errors 
    if (@ftp_chdir($ftp, $dir)) 
    { 
        // If the directory exists, set back to origin 
        ftp_chdir($ftp, $origin);    
        return true; 
    } 

    // Directory does not exist 
    return false; 
} 

?>