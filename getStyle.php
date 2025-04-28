<?php

function getFileContents($path) {
    if (file_exists($path)) {
        preg_match("#(.*/)?(.*)#", $path, $path);
        return preg_replace_callback("#/[*]{(.*?)}[*]/#", function ($match) use ($path) {
            return getFileContents("$path[1]$match[1]");
        }, preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", file_get_contents($path[0])));
    } else {
        return "";
    }
}

if (isset($_GET['src']) && file_exists("$_GET[src]/index.css")) {
    if (!file_exists("$_GET[src]/index.cache.css") || (filemtime("$_GET[src]/index.cache.css") !== filemtime("$_GET[src]/index.css"))) {
        $buffer = preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", file_get_contents("$_GET[src]/index.css"));
        $buffer = preg_replace("#[ \t]*([\{\}\:\;\,\>])[ \t]*#", "$1", $buffer);
        $buffer = preg_replace("#[ \t]{2,}#", " ", $buffer);

        $buffer = preg_replace_callback("#(:url[(](['\"]))(.*?)(\\2[)])#i", function ($match) {
            if (file_exists("$_GET[src]/$match[3]")) {
                return "$match[1]$match[3]?" . filemtime("$_GET[src]/$match[3]") . $match[4];
            } else {
                return $match[0];
            }
        }, $buffer);

        file_put_contents("$_GET[src]/index.cache.css", $buffer);
        chmod("$_GET[src]/index.cache.css", 0660);
        touch("$_GET[src]/index.cache.css", filemtime("$_GET[src]/index.css"));

        echo $buffer;
    } else {
        echo file_get_contents("$_GET[src]/index.cache.css");
    }
}