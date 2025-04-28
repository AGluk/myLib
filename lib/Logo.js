// #include <./AJAX.js>
// #include <./Element.js>

'use strict';

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Logo ///
    /** @this {myLib.Logo} */
    function Logo(src) {
        myLib.Element.HTML.Image.call(this, 'logo');

        // Initialization

        myLib.AJAX.get(`getFilePath.php?src=${src}`, AJAX => {
            this.src = AJAX.responseText;
        });
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