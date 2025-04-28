# myLib
**JavaScript/PHP/CSS** library for making ease of using OOP style in Web Development.

Supposed you will use Microsoft **VSCode** as your development IDE.<br>
**myLib** includes some settings and snippets for **VSCode** (see `.vscode` for more details).<br>
It also includes **TypeScript** declaration files (`*.d.ts`) for proper operation **IntelliSense** as well as **Python** scripts.

Please use ```example.com``` for a bit understanding how to use **myLib**.<br>
Looking for any help in creating detailed documentation.<br>
Will be glad to answer on any questions if you find **myLib** interesting.<br>

For trying example project, put all files to the server's root directory and add some code to configuration files.<br>
Some methods in **myLib** uses **ImageMagick** and **Pear** PHP extensions. Install them if missing.

### /etc/hosts
```
127.0.0.1   loc.example.com
::1         loc.example.com
```

### /etc/apache2/sites-available/default.conf
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