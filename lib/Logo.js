// #include <./AJAX.js>
// #include <./Element.js>

'use strict';

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Logo ///
    /** @this {myLib.Logo} */
    function Logo(src, ...args) {
        this.extends(myLib.Element.HTML.Image, args);

        // Initialization

        src = src.match(/^(https?:\/\/.*?\/)?(.*)/i).map(match => match || '');

        myLib.AJAX.get(`${src[1]}getFilePath.php?src=${src[2]}`, AJAX => {
            this.src = AJAX.responseText;
        });
    },

    // Static
    {
        className: 'my-logo'
    },

    // Extends
    myLib.Element.HTML.Image,
    {
        /** @this {myLib.Logo.prototype} */
        onResize() {
            this.style.marginTop = -this.offsetWidth / 2;
            this.style.marginLeft = -this.offsetHeight / 2;
        }
    },

    // Methods
    {
        /** @this {myLib.Logo.prototype} */
        setSize(size) {
            this.style.width = size;
            this.style.height = size;

            return this;
        }
    }
);