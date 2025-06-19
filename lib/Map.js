// #include <./myLib.js>

'use strict';

{
    myLib.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////////// Map ///
        /** @this {myLib.Map} */
        function Map() {
            this.extends(myLib);

            // Initialization

            return new Proxy(this, {
                get(target, property) {
                    if (property === Symbol.iterator) {
                        return function* () {
                            for (const value of Object.values(target))
                                yield value;
                        };
                    } else {
                        let i = Number(property);
                        if (isNaN(i)) {
                            return target[property];
                        } else {
                            return Object.values(target)[i];
                        }
                    }
                }
            });
        },

        // Extends
        myLib
    )
}