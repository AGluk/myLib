// #include <./myLib.js>

'use strict';

{
    const cookie = {};

    if (document.cookie !== "") {
        for (const str of document.cookie.split(/[ \t]*;[ \t]*/)) {
            let name, value;
            [name, value] = str.split('=');
            cookie[name] = value;
        }
    }

    myLib.static({
        cookie: new Proxy(cookie, {
            get(target, property) {
                if (property === Symbol.iterator) {
                    return function* () {
                        for (const value of Object.values(target))
                            yield value;
                    };
                } else if (typeof property === "string") {
                    let i = Number(property);
                    if (isNaN(i)) {
                        return target[property];
                    } else {
                        return Object.values(target)[i];
                    }
                }
            },

            set(target, property, value) {
                if (typeof property === "string") {
                    let i = Number(property);
                    if (isNaN(i)) {
                        target[property] = value;
                        document.cookie = `${property}=${value};max-age=31536000`
                    } else {
                        target[Object.keys(target)[i]] = value;
                        document.cookie = `${Object.keys(target)[i]}=${value};max-age=31536000`
                    }

                    return true;
                } else {
                    return false;
                }
            }
        })
    });
}