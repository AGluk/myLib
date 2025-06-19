// #include <./myLib.js>

'use strict';

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////////////// List ///
    /** @this {myLib.List} */
    function List(array = []) {
        this.extends(myLib);

        // Initialization

        this.defineProperty('current', null);
        this.defineProperty('first', null);
        this.defineProperty('last', null);
        this.defineProperty('length', null);

        for (const target of array)
            this.add(target);
    },

    // Extends
    myLib,

    // Accessors
    {
        /** @this {myLib.List.prototype} */
        *[Symbol.iterator]() {
            this.current = this.first;
            for (let i = 0; i < this.length; i++) {
                yield this.current.target;
                this.current = this.current.next;
            }
        },
    },

    // Methods
    {
        /** @this {myLib.List.prototype} */
        add(target, index) {
            if (this.last === null) {
                if (index === undefined)
                    index = 0;

                this.current = this.first = this.last = new myLib.List.Node(target, index, null, null);
            } else {
                if (index === undefined) {
                    this.current = this.last = this.last.next = new myLib.List.Node(target, this.last.index + 1, this.last, null);
                } else {
                    for (this.current = this.last; this.current; this.current = this.current.prev) {
                        if (this.current.index <= index) {
                            this.current = this.current.next = new myLib.List.Node(target, index, this.current, this.current.next);

                            if (this.current.next !== null) {
                                this.current.next.prev = this.current;
                            } else {
                                this.last = this.current;
                            }

                            this.length++;
                            return target;
                        }
                    }

                    this.current = this.first = this.first.prev = new myLib.List.Node(target, index, null, this.first);
                }
            }

            this.length++;
            return target;
        },

        /** @this {myLib.List.prototype} */
        break() {
            if ((this.first !== null) && (this.last !== null)) {
                this.first.prev = null;
                this.last.next = null;
            }

            let target = this;
            this[Symbol.iterator] = function* () {
                for (target.current = target.first; target.current; target.current = target.current.next)
                    yield target.current.target;
            };

            return this;
        },

        /** @this {myLib.List.prototype} */
        clear() {
            this.current = null;
            this.first = null;
            this.last = null;

            this.length = 0;
            return this;
        },

        /** @this {myLib.List.prototype} */
        forEach(callback) {
            this.current = this.first;
            for (let i = 0; i < this.length; i++) {
                callback(this.current.target);
                this.current = this.current.next;
            }

            return this;
        },

        /** @this {myLib.List.prototype} */
        inserAfter(target, ref_target) {
            for (this.current = this.first; this.current; this.current = this.current.next) {
                if (this.current.target === ref_target) {
                    this.current = this.current.next = new myLib.List.Node(target, this.current.index, this.current, this.current.next);

                    if (this.current.next !== null) {
                        this.current.next.prev = this.current;
                    } else {
                        this.last = this.current;
                    }

                    this.length++;
                    return true;
                }
            }

            return false;
        },

        /** @this {myLib.List.prototype} */
        insertBefore(target, ref_target) {
            for (this.current = this.last; this.current; this.current = this.current.prev) {
                if (this.current.target === ref_target) {
                    this.current = this.current.prev = new myLib.List.Node(target, this.current.index, this.current.prev, this.current);

                    if (this.current.prev !== null) {
                        this.current.prev.next = this.current;
                    } else {
                        this.first = this.current;
                    }

                    this.length++;
                    return true;
                }
            }

            return false;
        },

        /** @this {myLib.List.prototype} */
        loop() {
            if ((this.first !== null) && (this.last !== null)) {
                this.last.next = this.first;
                this.first.prev = this.last;
            }

            return this;
        },

        /** @this {myLib.List.prototype} */
        pop(target) {
            this.current = this.first;
            if (target === undefined) {
                if (this.current) {
                    this.first = this.current.next;

                    if (this.current.next !== null) {
                        this.current.next.prev = null;
                    } else {
                        this.last = null;
                    }

                    this.length--;
                    return this.current.target;
                } else {
                    return null;
                }
            } else {
                for (this.current = this.first; this.current; this.current = this.current.next) {
                    if (this.current.target === target) {
                        if (this.current.prev !== null) {
                            this.current.prev.next = this.current.next;
                        } else {
                            this.first = this.current.next;
                        }

                        if (this.current.next !== null) {
                            this.current.next.prev = this.current.prev;
                        } else {
                            this.last = this.current.prev;
                        }

                        this.length--;
                        return this.current.target;
                    }
                }

                return null;
            }
        },

        /** @this {myLib.List.prototype} */
        push(target, index) {
            if (this.first === null) {
                if (index === undefined)
                    index = 0;

                this.current = this.last = this.first = new myLib.List.Node(target, index, null, null);
            } else {
                if (index === undefined) {
                    this.current = this.first = this.first.prev = new myLib.List.Node(target, this.first.index - 1, null, this.first);
                } else {
                    for (this.current = this.first; this.current; this.current = this.current.next) {
                        if (this.current.index >= index) {
                            this.current = this.current.prev = new myLib.List.Node(target, index, this.current.prev, this.current);

                            if (this.current.prev !== null) {
                                this.current.prev.next = this.current;
                            } else {
                                this.first = this.current;
                            }

                            this.length++;
                            return target;
                        }
                    }

                    this.current = this.last = this.last.next = new myLib.List.Node(target, index, this.last, null);
                }
            }

            this.length++;
            return target;
        },

        /** @this {myLib.List.prototype} */
        remove(target) {
            this.current = this.last;
            if (target === undefined) {
                if (this.current) {
                    this.last = this.current.prev;

                    if (this.current.prev !== null) {
                        this.current.prev.next = null;
                    } else {
                        this.first = null;
                    }

                    this.length--;
                    return this.current.target;
                } else {
                    return null;
                }
            } else {
                for (this.current = this.last; this.current; this.current = this.current.prev) {
                    if (this.current.target === target) {
                        if (this.current.next !== null) {
                            this.current.next.prev = this.current.prev;
                        } else {
                            this.last = this.current.prev;
                        }

                        if (this.current.prev !== null) {
                            this.current.prev.next = this.current.next;
                        } else {
                            this.first = this.current.next;
                        }

                        this.length--;
                        return this.current.target;
                    }
                }

                return null;
            }
        },

        /** @this {myLib.List.prototype} */
        removeNode(node = this.current) {
            let changed = false;

            if (node.next !== null) {
                if (node.next.prev !== node.prev) {
                    node.next.prev = node.prev;
                    changed = true;
                }
            } else {
                if (this.last !== node.prev) {
                    this.last = node.prev;
                    changed = true;
                }
            }

            if (node.prev !== null) {
                if (node.prev.next !== node.next) {
                    node.prev.next = node.next;
                    changed = true;
                }
            } else {
                if (this.first !== node.next) {
                    this.first = node.next;
                    changed = true;
                }
            }

            if (changed) {
                this.length--;
                return node.target;
            } else {
                return null;
            }
        },

        /** @this {myLib.List.prototype} */
        replace(target, ref_target) {
            for (this.current = this.first; this.current; this.current = this.current.next) {
                if (this.current.target === ref_target) {
                    this.current.target = target;
                    return true;
                }
            }

            return false;
        }
    }
);

myLib.List.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Node ///
    /** @this {myLib.List.Node} */
    function Node(target, index, prev, next) {
        this.extends(myLib);

        // Initialization

        this.defineProperty('target', target);
        this.defineProperty('index', index);

        this.defineProperty('prev', prev);
        this.defineProperty('next', next);
    },

    // Extends
    myLib
);