<?php
if (isset($_GET['src']) && file_exists($_GET['src']))
    echo "$_GET[src]?", filemtime($_GET['src']);