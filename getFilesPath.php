<?php

if (isset($_GET['src'])) {
    $files = [];
    foreach (glob($_GET['src']) as $file)
        $files[] = "$file?" . filemtime($file);

    echo json_encode($files);
}