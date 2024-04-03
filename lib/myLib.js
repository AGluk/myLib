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

                constructor.prototype = Object.create(args[1].prototype);
                Object.defineProperty(constructor.prototype, 'constructor', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: constructor
                });

                for (let i = 2; i < args.length; i++) {
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

                return constructor;
            case 'string':
                constructor = function () {
                    throw new Error("Attempting to create an instance of an abstract class!");
                };

                Object.defineProperty(constructor, 'name', {
                    configurable: true,
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
                }

                return;
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
    }
});

Object.defineProperty(myLib.prototype, 'defineProperty', { ////////////////////////////////////////////////////////////// defineProperty ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(name, value) {
        if (this.hasOwnProperty(name))
            throw new Error(this.constructor.name + " already has property: " + name);

        Object.defineProperty(this, name, {
            configurable: false,
            enumerable: false,
            writable: true,
            value: value
        });

        return value;
    }
});

Object.defineProperty(myLib.prototype, 'defineProperties', { ////////////////////////////////////////////////////////// defineProperties ///
    configurable: false,
    enumerable: false,
    writable: false,

    value(properties) {
        for (const key of Object.keys(properties)) {
            if (this.hasOwnProperty(key))
                throw new Error(this.constructor.name + " already has property: " + key);

            Object.defineProperty(this, key, {
                configurable: false,
                enumerable: false,
                writable: true,
                value: properties[key]
            });
        }

        return this;
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
        let prototype = this.constructor.prototype;
        do {
            if (prototype.hasOwnProperty(name))
                return new myLib.PropertyDescriptor(Object.getOwnPropertyDescriptor(prototype, name), this);
        } while (prototype = Object.getPrototypeOf(prototype))
    }
});

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

        this.get = () => { return descriptor.get.call(target) };
        this.set = (value) => { return descriptor.set.call(target, value) };
        this.apply = (args) => { return descriptor.value.apply(target, args) };
        this.call = (...args) => { return descriptor.value.apply(target, args) };
    },

    // Extends
    myLib
);

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////// StaticPropertyDescriptor ///
    /** @this {myLib.StaticPropertyDescriptor} */
    function StaticPropertyDescriptor(descriptor) {
        myLib.call(this);

        // Methods

        this.get = (target) => { return descriptor.get.call(target) };
        this.set = (target, value) => { return descriptor.set.call(target, value) };
        this.apply = (target, args) => { return descriptor.value.apply(target, args) };
        this.call = (target, ...args) => { return descriptor.value.apply(target, args) };
    },

    // Extends
    myLib
);