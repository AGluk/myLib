<?php

class Image {
    public $path;
    public $date;
    public $width;
    public $height;
    public $thumbnail;

    function __construct($path, $date, $width, $height, $thumbnail) {
        $this->path = $path;
        $this->date = $date;
        $this->width = $width;
        $this->height = $height;
        $this->thumbnail = $thumbnail;
    }
}

if (isset($_GET['src']) && file_exists($_GET['src'])) {
    $images = [];
    foreach (scandir($_GET['src']) as $file) {
        if (preg_match("#(.*)\.(jpg|jpeg|png)$#i", $file, $name)) {
            $path = "$_GET[src]/$file";
            $date = filemtime($path);
            list($width, $height) = getimagesize($path);

            if (!file_exists("$_GET[src]/.thumbnails.nosync"))
                mkdir("$_GET[src]/.thumbnails.nosync", 0774);

            $thumbnail = "$_GET[src]/.thumbnails.nosync/$name[1].jpg";
            if (!file_exists($thumbnail) || (filemtime($thumbnail) !== $date)) {
                $imagick = new Imagick($path);
                $imagick->thumbnailImage(100, 100, true);
                $imagick->writeImage($thumbnail);

                chmod($thumbnail, 0660);
                touch($thumbnail, $date);
            }

            $images[] = new Image($path, $date, $width, $height, $thumbnail);
        }
    }

    echo json_encode($images);
}
