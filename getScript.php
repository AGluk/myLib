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

if (isset($_GET['src']) && file_exists("$_GET[src]/index.js")) {
    if (!file_exists("$_GET[src]/index.cache.js") || (filemtime("$_GET[src]/index.cache.js") !== filemtime("$_GET[src]/index.js"))) {
        $buffer = file_get_contents("$_GET[src]/index.js");
        $buffer = preg_replace("#(^|[ \t]+)//.*#m", "", $buffer);
        $buffer = preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", $buffer);
        $buffer = preg_replace("#/[*][*].*?[*]/#", "", $buffer);

        $buffer = preg_replace_callback("#(['\"]){(.*?)}\\1#", function ($match) {
            return getFileContents("$_GET[src]$match[1]");
        }, $buffer);

        $buffer = preg_replace("#[ \t]*([!]?[\&\|\+\-\*\/\<\=\>]+[=]?)[ \t]*#", "$1", $buffer);
        $buffer = preg_replace("#[ \t]*([\{\}\:\;\,])[ \t]*#", "$1", $buffer);
        $buffer = preg_replace("#(for|function|if|switch|while)[ \t]*[(](.*?)[)][ \t]*#", "$1($2)", $buffer);
        $buffer = preg_replace("#[ \t]+#", " ", $buffer);

        if (preg_match("#(.*/).*/#", "$_GET[src]/", $src)) {
            $buffer = str_replace("../", $src[1], $buffer);
            $buffer = str_replace("./", $src[0], $buffer);
        }

        $buffer = preg_replace_callback("#(\.src=([`'\"]))/?(.*?)\\2#i", function ($match) {
            if (file_exists($match[2])) {
                return "$match[1]$match[3]?" . filemtime($match[3]) . $match[2];
            } else {
                return $match[0];
            }
        }, $buffer);

        file_put_contents("$_GET[src]/index.cache.js", $buffer);
        chmod("$_GET[src]/index.cache.js", 0770);
        touch("$_GET[src]/index.cache.js", filemtime("$_GET[src]/index.js"));

        echo $buffer;
    } else {
        echo file_get_contents("$_GET[src]/index.cache.js");
    }
}
