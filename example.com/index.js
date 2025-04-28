// #include </lib/Cookie.js>
// #include </lib/Page.js>
// #include </lib/Dialog.js>
// #include </lib/Form.js>
// #include </lib/Photo.js>
// #include <./lib/myPano.js>

'use strict';

document.addEventListener('DOMContentLoaded', function () {
    let index = new myLib.Page("INDEX");
    index.append().setSrc(`./index`, GET['section']);
}, { passive: true });