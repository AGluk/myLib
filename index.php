<?php

$includes = [];
function includes_push($path, $base = null) {
    global $includes;

    if (!in_array($path, $includes)) {
        if ($base === null) {
            array_push($includes, $path);
        } else {
            array_splice($includes, array_flip($includes)[$base], 0, $path);
        }

        foreach (getIncludes($path) as $include)
            includes_push($include, $path);
    }
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

function getIncludes($path) {
    preg_match("#(.*/).*#", $path, $path);

    $includes = [];

    if ($file = fopen($path[0], "r")) {
        while (($line = fgets($file)) && (preg_match("#// \#include </?(.*)>#i", $line, $src)))
            array_push($includes, str_replace("./", $path[1], $src[1]));

        fclose($file);
    }

    return $includes;
}

// URI
if ($_SERVER['QUERY_STRING'] !== "") {
    if ("$_SERVER[REQUEST_URI]" !== "$_SERVER[SCRIPT_NAME]?$_SERVER[QUERY_STRING]") {
        header("Location: $_SERVER[REQUEST_SCHEME]://$_SERVER[HTTP_HOST]$_SERVER[SCRIPT_NAME]?$_SERVER[QUERY_STRING]");
        exit;
    }
} else if (("$_SERVER[REQUEST_URI]" !== "$_SERVER[SCRIPT_NAME]")) {
    header("Location: $_SERVER[REQUEST_SCHEME]://$_SERVER[HTTP_HOST]$_SERVER[SCRIPT_NAME]");
    exit;
}

// Index
$HTTP_HOST = preg_replace("#^www\.|^loc\.#i", "", $_SERVER['HTTP_HOST']);

if (file_exists($HTTP_HOST)) {
    $cwd = getcwd();
    chdir($HTTP_HOST);
} else {
    exit;
}

ob_start();
include "$HTTP_HOST/index.php";
$buffer = str_replace("./", "$HTTP_HOST/", preg_replace("#<!--.*?>#", "", preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", ob_get_clean())));

// Icons
$buffer = preg_replace_callback("#</head>#i", function () use ($HTTP_HOST) {
    $buffer = "";

    foreach (glob("apple-touch-icon-*.png") as $file) {
        if (preg_match("#apple-touch-icon-(\d+x\d+)\.png#i", $file, $name))
            $buffer .= "<link rel=\"apple-touch-icon\" sizes=\"$name[1]\" type=\"image/png\" href=\"$HTTP_HOST/$name[0]\">";
    }

    foreach (glob("icon-*.png") as $file) {
        if (preg_match("#icon-(\d+x\d+)\.png#i", $file, $name))
            $buffer .= "<link rel=\"icon\" sizes=\"$name[1]\" type=\"image/png\" href=\"$HTTP_HOST/$name[0]\">";
    }

    if (file_exists("manifest.json"))
        $buffer .= "<link rel=\"manifest\" href=\"$HTTP_HOST/manifest.json\">";

    return $buffer . "</head>";
}, $buffer);

chdir($cwd);

// Includes
includes_push("$HTTP_HOST/index.js");

$buffer = preg_replace_callback("#</head>#i", function () use ($includes) {
    $buffer = "";

    for ($i = 0; $i < count($includes); $i++) {
        $buffer .= "<script type=\"application/javascript\" src=\"$includes[$i]\"></script>";
        if (file_exists($style = str_replace(".js", ".css", $includes[$i])))
            $buffer .= "<link rel=\"stylesheet\" type=\"text/css\" href=\"$style\">";
    }

    return $buffer . "</head>";
}, $buffer);

// GET
$buffer = preg_replace("#</head>#i", "<script>let GET=" . (count($_GET) > 0 ? json_encode($_GET, JSON_UNESCAPED_SLASHES) : "{}") . "</script></head>", $buffer);

// Cache
$buffer = preg_replace_callback("#( (?:href|src)=(['\"]))/?(.*?)\\2#i", function ($match) {
    if (file_exists($match[3])) {
        return $match[1] . preg_replace_callback("#((.*/)?.*/)?(.*)\.(.*)#", function ($path) {
            $filemtime = filemtime("$path[1]$path[3].$path[4]");
            switch ($path[4]) {
                case "css":
                    if (!file_exists("$path[1]$path[3].cache.$path[4]") || (filemtime("$path[1]$path[3].cache.$path[4]") !== $filemtime)) {
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

                        file_put_contents("$path[1]$path[3].cache.$path[4]", $buffer);
                        chmod("$path[1]$path[3].cache.$path[4]", 0660);
                        touch("$path[1]$path[3].cache.$path[4]", $filemtime);
                    }

                    return "$path[1]$path[3].cache.$path[4]?$filemtime";
                case "js":
                    if (!file_exists("$path[1]$path[3].cache.$path[4]") || (filemtime("$path[1]$path[3].cache.$path[4]") !== $filemtime)) {
                        $buffer = file_get_contents("$path[1]$path[3].$path[4]");
                        $buffer = preg_replace("#(^|[ \t]+)//.*#m", "", $buffer);
                        $buffer = preg_replace("#^[ \t]*(.*?)[\r\n]+#m", "$1", $buffer);
                        $buffer = preg_replace("#/[*][*].*?[*]/#", "", $buffer);

                        $buffer = preg_replace_callback("#(['\"]){(.*?)}\\1#", function ($match) use ($path) {
                            return $match[1] . getFileContents("$path[1]$match[2]") . $match[1];
                        }, $buffer);

                        $buffer = preg_replace("#[ \t]*([!]?[\&\|\+\-\*\/\<\=\>]+[=]?)[ \t]*#", "$1", $buffer);
                        $buffer = preg_replace("#[ \t]*([\{\}\:\;\,])[ \t]*#", "$1", $buffer);
                        $buffer = preg_replace("#(for|function|if|switch|while)[ \t]*[(](.*?)[)][ \t]*#", "$1($2)", $buffer);
                        $buffer = preg_replace("#[ \t]+#", " ", $buffer);

                        $buffer = str_replace("../", $path[2], $buffer);
                        $buffer = str_replace("./", $path[1], $buffer);

                        $buffer = preg_replace_callback("#(\.src=([`'\"]))/?(.*?)\\2#i", function ($match) {
                            if (file_exists($match[3])) {
                                return "$match[1]$match[3]?" . filemtime($match[3]) . $match[2];
                            } else {
                                return $match[0];
                            }
                        }, $buffer);

                        file_put_contents("$path[1]$path[3].cache.$path[4]", $buffer);
                        chmod("$path[1]$path[3].cache.$path[4]", 0770);
                        touch("$path[1]$path[3].cache.$path[4]", $filemtime);
                    }

                    return "$path[1]$path[3].cache.$path[4]?$filemtime";
                default:
                    return "$path[1]$path[3].$path[4]?$filemtime";
            }
        }, $match[3]) . $match[2];
    } else {
        return $match[0];
    }
}, $buffer);

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

echo $buffer;
