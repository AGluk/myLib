// #include </lib/Cookie.js>
// #include </lib/Dialog.js>
// #include </lib/FormHandler.js>
// #include </lib/Page.js>
// #include </lib/Photo.js>
// #include <./lib/myPano.js>

'use strict';

document.addEventListener('DOMContentLoaded', function () { ////////////////////////////////////////////////////////////////////////////////
    new myLib.LayersBox().appendToBody();

    let index = new myLib.Page();
    index.append().setSrc(`./index`, GET['section']);
});