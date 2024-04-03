# myLib
JavaScript/PHP/CSS library for ease of use OOP in Web Development

Please use 'example.com' for a bit understanding how to use my library.<br>
Will be appreciated for any help in creating detailed documentation.<br>
Will be glad to answer on any questions if you find myLib good enough for you.<br>

## hosts
```
127.0.0.1   loc.example.com
::1         loc.example.com
```

## httpd-vhosts.conf
```
<VirtualHost *:80>
    ServerName example.com
    ServerAlias loc.example.com
    DocumentRoot "/var/www/html"

    <FilesMatch "\.(cgi|shtml|phtml|php)$">
        SSLOptions +StdEnvVars
    </FilesMatch>
</VirtualHost>
```