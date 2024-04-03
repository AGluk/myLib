// #include <./myLib.js>

'use strict';

myLib.defineClass('AJAX', { /////////////////////////////////////////////////////////////////////////////////////////////////////// AJAX ///
    get(url, onLoaded) {
        let AJAX = new XMLHttpRequest();

        AJAX.onreadystatechange = function () {
            if ((AJAX.readyState === 4) && (AJAX.status === 200))
                onLoaded(AJAX);
        };

        AJAX.open('GET', url, true);
        AJAX.send(null);

        return AJAX;
    },

    post(url, onLoaded, data = "") {
        let AJAX = new XMLHttpRequest();

        AJAX.onreadystatechange = function () {
            if ((AJAX.readyState === 4) && (AJAX.status === 200))
                onLoaded(AJAX);
        };

        AJAX.open('POST', url, true);
        AJAX.send(data);

        return AJAX;
    }
});