<?php
if (isset($_GET['src']) && file_exists("$_GET[src]/index.php")) {
    $cwd = getcwd();
    chdir($_GET['src']);

    ob_start();
    include "index.php";
    $buffer = preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", ob_get_clean());

    chdir($cwd);

    $HTTP_HOST = preg_replace("#^www\.|^loc\.#i", "", $_SERVER['HTTP_HOST']);
    $buffer = str_replace("~/", "$HTTP_HOST/", $buffer);

    if (preg_match("#(.*/).*/#", "$_GET[src]/", $src)) {
        $buffer = str_replace("../", $src[1], $buffer);
        $buffer = str_replace("./", $src[0], $buffer);
    }

    $buffer = preg_replace("#(<a [^>]*)#", '$1 ondragstart="return false"', $buffer);
    $buffer = preg_replace("#(<img [^>]*)#", '$1 ondragstart="return false"', $buffer);

    $buffer = preg_replace_callback("#( (?:href|src)=(['\"]))/?(.*?)\\2#i", function ($match) {
        if (file_exists($match[2])) {
            return "$match[1]$match[3]?" . filemtime($match[3]) . $match[2];
        } else {
            return $match[0];
        }
    }, $buffer);

    echo $buffer;
}
