<?php
if (isset($_GET['src']) && file_exists("$_GET[src].id"))
    echo file_get_contents("$_GET[src].id");