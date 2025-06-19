'use strict';

const myLib = function () { };
Object.defineProperty(myLib.prototype, 'constructor', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: myLib
});

Object.defineProperty(myLib, 'defineClass', { ////////////////////////////////////////////////////////////////////////////// defineClass ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(...args) {
        let constructor;
        switch (typeof args[0]) {
            case 'function':
                constructor = args[0];

                if (this.hasOwnProperty(constructor.name)) {
                    throw new Error(this.prototype.constructor.name + " already has property: " + constructor.name);
                } else {
                    Object.defineProperty(this, constructor.name, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: constructor
                    });
                }

                Object.defineProperty(constructor, 'defineClass', Object.getOwnPropertyDescriptor(myLib, 'defineClass'));
                Object.defineProperty(constructor, 'proto', Object.getOwnPropertyDescriptor(myLib, 'proto'));
                Object.defineProperty(constructor, 'static', Object.getOwnPropertyDescriptor(myLib, 'static'));

                let i;
                switch (typeof args[1]) {
                    case 'function':
                        constructor.prototype = Object.create(args[1].prototype);

                        i = 2;
                        break;
                    case 'object':
                        for (const key in args[1]) {
                            if (key.startsWith('$')) {
                                Object.defineProperty(constructor, key.slice(1), {
                                    configurable: false,
                                    enumerable: false,
                                    writable: true,
                                    value: args[1][key]
                                });
                            } else {
                                Object.defineProperty(constructor, key, {
                                    configurable: false,
                                    enumerable: false,
                                    writable: false,
                                    value: args[1][key]
                                });
                            }
                        }

                        constructor.prototype = Object.create(args[2].prototype);

                        i = 3;
                        break;
                }

                Object.defineProperty(constructor.prototype, 'constructor', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: constructor
                });

                for (i; i < args.length; i++) {
                    switch (typeof args[i]) {
                        case 'function':
                            for (const key of Object.keys(args[i].prototype)) {
                                Object.defineProperty(constructor.prototype, key, {
                                    configurable: true,
                                    enumerable: true,
                                    writable: true,
                                    value: args[i].prototype[key]
                                })
                            }

                            for (const sym of Object.getOwnPropertySymbols(args[i].prototype)) {
                                Object.defineProperty(constructor.prototype, sym, {
                                    configurable: true,
                                    enumerable: true,
                                    writable: true,
                                    value: args[i].prototype[sym]
                                })
                            }

                            break;
                        case 'object':
                            for (const key of Object.keys(args[i])) {
                                switch (typeof args[i][key]) {
                                    case 'function':
                                        Object.defineProperty(constructor.prototype, key, {
                                            configurable: true,
                                            enumerable: true,
                                            writable: true,
                                            value: args[i][key]
                                        });

                                        break;
                                    case 'object':
                                        Object.defineProperty(constructor.prototype, key, {
                                            configurable: true,
                                            enumerable: true,
                                            get: args[i][key].get,
                                            set: args[i][key].set
                                        });

                                        break;
                                }
                            }

                            for (const sym of Object.getOwnPropertySymbols(args[i])) {
                                switch (typeof args[i][sym]) {
                                    case 'function':
                                        Object.defineProperty(constructor.prototype, sym, {
                                            configurable: true,
                                            enumerable: true,
                                            writable: true,
                                            value: args[i][sym]
                                        });

                                        break;
                                    case 'object':
                                        Object.defineProperty(constructor.prototype, sym, {
                                            configurable: true,
                                            enumerable: true,
                                            get: args[i][sym].get,
                                            set: args[i][sym].set
                                        });

                                        break;
                                }
                            }

                            break;
                        default:
                            throw new Error("Incorrect parameter type!");
                    }
                }

                for (const key of Object.keys(constructor.prototype)) {
                    Object.defineProperty(constructor.prototype, key, {
                        configurable: false
                    });
                }

                for (const sym of Object.getOwnPropertySymbols(constructor.prototype)) {
                    Object.defineProperty(constructor.prototype, sym, {
                        configurable: false
                    });
                }

                return constructor;
            case 'string':
                constructor = function () {
                    throw new Error("Attempting to create an instance of an abstract class!");
                };

                Object.defineProperty(constructor, 'name', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: args[0]
                });

                if (this.hasOwnProperty(constructor.name)) {
                    throw new Error(this.prototype.constructor.name + " already has property: " + constructor.name);
                } else {
                    Object.defineProperty(this, constructor.name, {
                        configurable: false,
                        enumerable: false,
                        writable: false,
                        value: constructor
                    });
                }

                Object.defineProperty(constructor, 'defineClass', Object.getOwnPropertyDescriptor(myLib, 'defineClass'));
                Object.defineProperty(constructor, 'proto', Object.getOwnPropertyDescriptor(myLib, 'proto'));
                Object.defineProperty(constructor, 'static', Object.getOwnPropertyDescriptor(myLib, 'static'));

                constructor.prototype = Object.create(myLib);
                Object.defineProperty(constructor.prototype, 'constructor', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: constructor
                });

                for (let i = 1; i < args.length; i++) {
                    for (const key of Object.keys(args[i])) {
                        Object.defineProperty(constructor, key, {
                            configurable: false,
                            enumerable: false,
                            writable: false,
                            value: args[i][key]
                        });
                    }

                    for (const sym of Object.getOwnPropertySymbols(args[i])) {
                        Object.defineProperty(constructor, sym, {
                            configurable: false,
                            enumerable: false,
                            writable: false,
                            value: args[i][sym]
                        });
                    }
                }

                return constructor;
            default:
                throw new Error("Incorrect parameter type!");
        }
    }
});

Object.defineProperty(myLib, 'proto', { ////////////////////////////////////////////////////////////////////////////////////////// proto ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(name) {
        let prototype = this.prototype;
        do {
            if (prototype.hasOwnProperty(name))
                return new myLib.StaticPropertyDescriptor(Object.getOwnPropertyDescriptor(prototype, name));
        } while (prototype = Object.getPrototypeOf(prototype))
    }
});

Object.defineProperty(myLib, 'static', { //////////////////////////////////////////////////////////////////////////////////////// static ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(properties, writable = false) {
        for (const key of Object.keys(properties)) {
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: false,
                writable: writable,
                value: properties[key]
            });
        }

        return this;
    }
});

Object.defineProperty(myLib.prototype, 'defineAccessor', { ////////////////////////////////////////////////////////////// defineAccessor ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(name, get, set) {
        if (this.hasOwnProperty(name))
            throw new Error(this.constructor.name + " already has accessor: " + name);

        Object.defineProperty(this, name, {
            configurable: false,
            enumerable: false,
            get: get,
            set: set
        });

        return this;
    }
});

Object.defineProperty(myLib.prototype, 'defineProperty', { ////////////////////////////////////////////////////////////// defineProperty ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(name, value, writable = true) {
        if (this.hasOwnProperty(name))
            throw new Error(this.constructor.name + " already has property: " + name);

        Object.defineProperty(this, name, {
            configurable: false,
            enumerable: false,
            writable: writable,
            value: value
        });

        return value;
    }
});

Object.defineProperty(myLib.prototype, 'defineProperties', { ////////////////////////////////////////////////////////// defineProperties ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(properties, writable = true) {
        for (const key of Object.keys(properties)) {
            if (this.hasOwnProperty(key))
                throw new Error(this.constructor.name + " already has property: " + key);

            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: false,
                writable: writable,
                value: properties[key]
            });
        }

        return this;
    }
});

Object.defineProperty(myLib.prototype, 'extends', { //////////////////////////////////////////////////////////////////////////// extends ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(constructor, args) {
        constructor.apply(this, args);
        return new myLib.ExtendsReturn(this);
    }
});

Object.defineProperty(myLib.prototype, 'implements', { ////////////////////////////////////////////////////////////////////// implements ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(constructor, ...args) {
        for (const key of Object.keys(constructor.prototype))
            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: true,
                writable: true,
                value: constructor.prototype[key]
            });

        constructor.apply(this, args);
        return this;
    }
});

Object.defineProperty(myLib.prototype, 'proto', { //////////////////////////////////////////////////////////////////////////////// proto ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(name) {
        let prototype = this;
        while (prototype = Object.getPrototypeOf(prototype)) {
            if (prototype.hasOwnProperty(name))
                return new myLib.PropertyDescriptor(Object.getOwnPropertyDescriptor(prototype, name), this);
        }
    }
});

myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////// ExtendsReturn ///
    /** @this {myLib.ExtendsReturn} */
    function ExtendsReturn(target) {
        myLib.call(this);

        // Methods

        this.defineProperty('mixin', function (constructor, args) {
            constructor.apply(target, args);
            return new myLib.ExtendsReturn(target)
        });
    },

    // Extends
    myLib
);

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// Object ///
    /** @this {myLib.Object} */
    function Object(properties) {
        myLib.call(this);

        // Initialization

        for (const key of window.Object.keys(properties))
            this[key] = properties[key];
    },

    // Extends
    myLib
);

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// PropertyDescriptor ///
    /** @this {myLib.PropertyDescriptor} */
    function PropertyDescriptor(descriptor, target) {
        myLib.call(this);

        // Methods

        this.defineProperty('get', function () {
            return descriptor.get.call(target);
        }, false);

        this.defineProperty('set', function (value) {
            return descriptor.set.call(target, value);
        }, false);

        this.defineProperty('apply', function (args) {
            return descriptor.value.apply(target, args);
        }, false);

        this.defineProperty('call', function (...args) {
            return descriptor.value.apply(target, args);
        }, false);
    },

    // Extends
    myLib
);

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////// StaticPropertyDescriptor ///
    /** @this {myLib.StaticPropertyDescriptor} */
    function StaticPropertyDescriptor(descriptor) {
        myLib.call(this);

        // Methods

        this.defineProperty('get', function (target) {
            return descriptor.get.call(target);
        }, false);

        this.defineProperty('set', function (target, value) {
            return descriptor.set.call(target, value);
        }, false);

        this.defineProperty('apply', function (target, args) {
            return descriptor.value.apply(target, args);
        }, false);

        this.defineProperty('call', function (target, ...args) {
            return descriptor.value.apply(target, args);
        }, false);
    },

    // Extends
    myLib
);