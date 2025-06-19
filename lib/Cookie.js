// #include <./myLib.js>

'use strict';

{
    const cookie = {};

    if (document.cookie !== '') {
        for (const cookie_str of document.cookie.split(/\s*;\s*/)) {
            let cookie_obj = cookie_str.split('=');
            if (cookie_obj[0].startsWith('my-cookie-'))
                cookie[cookie_obj[0].slice(10)] = cookie_obj[1];
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
                } else if (typeof property === 'string') {
                    let i = Number(property);
                    if (isNaN(i)) {
                        return target[property];
                    } else {
                        return Object.values(target)[i];
                    }
                }
            },

            set(target, property, value) {
                if (typeof property === 'string') {
                    let i = Number(property);
                    if (isNaN(i)) {
                        if (property.startsWith('@')) {
                            target[property.slice(1)] = value;
                            document.cookie = `my-cookie-${property.slice(1)}=${value}`
                        } else {
                            target[property] = value;
                            document.cookie = `my-cookie-${property}=${value};max-age=31536000`
                        }
                    } else {
                        target[Object.keys(target)[i]] = value;
                        document.cookie = `my-cookie-${Object.keys(target)[i]}=${value};max-age=31536000`
                    }

                    return true;
                } else {
                    return false;
                }
            }
        })
    });
}