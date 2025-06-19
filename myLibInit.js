'use strict';

function myLibInit(...includes) {
    return new Promise((resolve) => {
        let query = includes.map(inc => `inc[]=${encodeURIComponent(inc)}`).join('&');
        fetch(`https://agluk.me/getIncludes.php?${query}`)
            .then(response => {
                return response.text();
            })
            .then(includes => {
                includes = includes.split(',');
                let count = includes.length;

                for (const include of includes) {
                    if (/.js\?\d+$/.test(include)) {
                        let script = document.createElement('script');
                        script.async = false;
                        script.defer = true;
                        script.type = 'application/javascript';

                        script.onload = () => {
                            if (--count === 0) resolve();
                        };

                        document.head.appendChild(script);
                        script.src = `https://agluk.me/${include}`;
                    } else {
                        let style = document.createElement('link');
                        style.rel = 'stylesheet';
                        style.type = 'text/css';

                        style.onload = () => {
                            if (--count === 0) resolve();
                        };

                        document.head.appendChild(style);
                        style.href = `https://agluk.me/${include}`;
                    }
                }
            });
    });
};