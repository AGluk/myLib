<?php

$scripts = ["lib/myLib.js"];
function includes_push($script, $base = null) {
    global $scripts;

    if (!in_array($script, $scripts)) {
        if ($base === null) {
            array_push($scripts, $script);
        } else {
            array_splice($scripts, array_flip($scripts)[$base], 0, $script);
        }

        foreach (getIncludes($script) as $include)
            includes_push($include, $script);
    }
}

function getIncludes($script) {
    preg_match("#(.*/).*#", $script, $path);

    $includes = [];

    if ($file = fopen($path[0], "r")) {
        while (($line = fgets($file)) && (preg_match("#// \#include </?(.*)>#i", $line, $src)))
            array_push($includes, str_replace("./", $path[1], $src[1]));

        fclose($file);
    }

    return $includes;
}

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

// Include;

foreach ($_GET['inc'] as $inc)
    includes_push("lib/" . $inc);

$styles = [];
foreach ($scripts as $script) {
    if (file_exists($style = str_replace(".js", ".css", $script)))
        array_push($styles, $style);
}

// Cache

$scripts = array_map(function ($script) {
    return preg_replace_callback("#((.*/)?.*/)?(.*)\.(.*)#", function ($path) {
        $filemtime = filemtime("$path[1]$path[3].$path[4]");

        if (!file_exists("$path[1]$path[3].embed.$path[4]") || (filemtime("$path[1]$path[3].embed.$path[4]") !== $filemtime)) {
            $buffer = file_get_contents("$path[1]$path[3].$path[4]");
            $buffer = preg_replace("#(^|[ \t]+)//.*#m", "", $buffer);
            $buffer = preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", $buffer);
            $buffer = preg_replace("#/[*][*].*?[*]/#", "", $buffer);

            $buffer = preg_replace_callback("#(['\"]){(.*?)}\\1#", function ($match) use ($path) {
                return $match[1] . getFileContents("$path[1]$match[2]") . $match[1];
            }, $buffer);

            $buffer = preg_replace("#[ \t]*([!]?[\&\|\+\-\*\/\<\=\>]+[=]?)[ \t]*#", "$1", $buffer);
            $buffer = preg_replace("#[ \t]*([():;,])[ \t]*#", "$1", $buffer);
            $buffer = preg_replace("#[ \t]+#", " ", $buffer);

            $buffer = str_replace("../", "/$path[2]", $buffer);
            $buffer = str_replace("./", "/$path[1]", $buffer);

            $buffer = preg_replace_callback("#(\.(?:href|src)=([`'\"]))/(.*?)\\2#i", function ($match) {
                if (file_exists($match[2])) {
                    return "$match[1]/$match[3]?" . filemtime($match[3]) . $match[2];
                } else {
                    return $match[0];
                }
            }, $buffer);

            $buffer = preg_replace("#([`'\"])/(.*?)\\1#", "$1$_SERVER[REQUEST_SCHEME]://$_SERVER[HTTP_HOST]/$2$1", $buffer);

            file_put_contents("$path[1]$path[3].embed.$path[4]", $buffer);
            chmod("$path[1]$path[3].embed.$path[4]", 0770);
            touch("$path[1]$path[3].embed.$path[4]", $filemtime);
        }

        return "$path[1]$path[3].embed.$path[4]?$filemtime";
    }, $script);
}, $scripts);

$styles = array_map(function ($style) {
    return preg_replace_callback("#((.*/)?.*/)?(.*)\.(.*)#", function ($path) {
        $filemtime = filemtime("$path[1]$path[3].$path[4]");

        if (!file_exists("$path[1]$path[3].embed.$path[4]") || (filemtime("$path[1]$path[3].embed.$path[4]") !== $filemtime)) {
            $buffer = preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", file_get_contents("$path[1]$path[3].$path[4]"));
            $buffer = preg_replace("#[ \t]*([\{\}\:\;\,\>])[ \t]*#", "$1", $buffer);
            $buffer = preg_replace("#[ \t]{2,}#", " ", $buffer);

            $buffer = preg_replace_callback("#(:url[(](['\"]))(.*?)(\\2[)])#i", function ($match) use ($path) {
                if (file_exists("$path[1]$match[3]")) {
                    return "$match[1]$match[3]?" . filemtime("$path[1]$match[3]") . $match[4];
                } else {
                    return $match[0];
                }
            }, $buffer);

            file_put_contents("$path[1]$path[3].embed.$path[4]", $buffer);
            chmod("$path[1]$path[3].embed.$path[4]", 0660);
            touch("$path[1]$path[3].embed.$path[4]", $filemtime);
        }

        return "$path[1]$path[3].embed.$path[4]?$filemtime";
    }, $style);
}, $styles);

$buffer = "";

foreach ($scripts as $script)
    $buffer .= ",$script";

foreach ($styles as $style)
    $buffer .= ",$style";

echo substr($buffer, 1);
