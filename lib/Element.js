// #include <./myLib.js>

'use strict';

myLib.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////////// Element ///
    /** @this {myLib.Element} */
    function Element(target, className = '', id) {
        myLib.call(this);

        // Properties

        this.defineProperty('target', target);
        this.defineProperty('parent', null);
        this.defineProperty('children', []);

        this.defineProperty('classList_origin', new myLib.Element.ClassListOrigin());
        this.defineProperty('classList_extensions', new myLib.Element.ClassListExtensions());
        this.defineProperty('classList_custom', []);

        // Initialization

        Object.defineProperty(target, 'my_class', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: this
        });

        if (this.target.hasAttribute('class')) {
            className = `${this.target.getAttribute('class').trimEnd()} ${className.trimStart()}`.trim();
        } else {
            className = className.trim();
        }

        if (className !== '') {
            className.split(/\s+/).forEach(className => {
                if (className.startsWith('#')) {
                    this.classList_origin.push(className.slice(1));
                } else {
                    this.classList_custom.push(className);
                }
            });
        }

        let prototype = this;
        while ((prototype = Object.getPrototypeOf(prototype)) !== myLib.Element.prototype) {
            if (prototype.constructor.className !== undefined)
                this.classList_origin.push(prototype.constructor.className);
        }

        this.className = this.className;

        if (id !== undefined) {
            if (this.target.hasAttribute('id')) {
                throw new Error("Target element already has 'id' attribute!");
            } else {
                this.id = id;
            }
        }
    },

    // Extends
    myLib,

    // Events
    {
        onAppend() { },
        onRemove() { }
    },

    // Accessors
    {
        classList: {
            /** @this {myLib.Element.prototype} */
            get() {
                return this.target.classList;
            }
        },

        className: {
            /** @this {myLib.Element.prototype} */
            get() {
                return this.classList_custom.join(' ');
            },

            /** @this {myLib.Element.prototype} */
            set(className) {
                if ((className = className.trim()) !== '') {
                    this.classList_custom = className.split(/\s+/);
                } else {
                    this.classList_custom = [];
                }

                let classList = [
                    ...this.classList_origin,
                    ...this.classList_extensions.map(extension =>
                        this.classList_origin.map(className => `${className}-${extension}`).join(' ')),
                    ...this.classList_custom
                ];

                if (classList.length > 0) {
                    this.target.setAttribute('class', classList.join(' '));
                } else {
                    this.target.removeAttribute('class');
                }
            }
        },

        className_origin: {
            /** @this {myLib.Element.prototype} */
            get() {
                return this.constructor.className || '';
            }
        },

        clientHeight: {
            /** @this {myLib.Element.prototype} */
            get() {
                return this.target.clientHeight;
            }
        },

        clientWidth: {
            /** @this {myLib.Element.prototype} */
            get() {
                return this.target.clientWidth;
            }
        },

        id: {
            /** @this {myLib.Element.prototype} */
            get() {
                if (this.target.hasAttribute('id')) {
                    return this.target.getAttribute('id');
                } else {
                    return '';
                }
            },

            /** @this {myLib.Element.prototype} */
            set(id) {
                if ((id = id.trim()) !== '') {
                    this.target.setAttribute('id', id);
                } else {
                    this.target.removeAttribute('id');
                }
            }
        },

        innerHTML: {
            /** @this {myLib.Element.prototype} */
            get() {
                return this.target.innerHTML;
            },

            /** @this {myLib.Element.prototype} */
            set(innerHTML) {
                this.target.innerHTML = innerHTML;
            }
        }
    },

    // Events
    {
        onResize(capture) { }
    },

    // Methods
    {
        /** @this {myLib.Element.prototype} */
        addEventListener(type, listener, options) {
            this.target.addEventListener(type, listener, options);
            return this;
        },

        /** @this {myLib.Element.prototype} */
        addExtendedClassNames(extension) {
            this.classList_extensions.add(extension);

            for (const child of this.children)
                child.addExtendedClassNames(extension);

            this.className = this.className;
            return this;
        },

        /** @this {myLib.Element.prototype} */
        remExtendedClassNames(extension) {
            if (extension !== undefined) {
                this.classList_extensions.del(extension);
            } else {
                this.classList_extensions.clear();
            }

            for (const child of this.children)
                child.remExtendedClassNames(extension);

            this.className = this.className;
            return this;
        },

        /** @this {myLib.Element.prototype} */
        appendChild(child) {
            if (child.parent !== null)
                child.parent.removeChild(child);

            this.target.appendChild(child.target);

            this.children.push(child);
            child.parent = this;

            child.onAppend();
            return child;
        },

        /** @this {myLib.Element.prototype} */
        appendChildren(...children) {
            for (const child of children)
                this.appendChild(child);

            return this;
        },

        /** @this {myLib.Element.prototype} */
        defineChild(name, child) {
            this.defineProperty(name, child, false);

            if (child.parent !== null) {
                child.parent.removeChild(child);
            } else if (child.target.parentElement !== this.target) {
                this.target.appendChild(child.target);
            }

            this.children.push(child);
            child.parent = this;

            const iterate_classLists = (/** @type {myLib.Element} */target) => {
                let target_classList_origin = new myLib.Element.ClassListOrigin();
                target.classList_origin.forEach((target_className, inherited) => {
                    if (target_className.startsWith('my-')) {
                        target_classList_origin.add(target_className, inherited);
                    } else {
                        this.classList_origin.forEachInherited(this_className => {
                            target_classList_origin.add(`${this_className}-${target_className}`, inherited);
                        });
                    }
                });

                target.classList_origin = target_classList_origin;
                target.classList_extensions.from(this.classList_extensions);

                target.className = target.className;

                for (const child of target.children)
                    iterate_classLists(child);
            }; iterate_classLists(child);

            child.onAppend();
            return child;
        },

        /** @this {myLib.Element.prototype} */
        removeChild(child, ...args) {
            let index = this.children.indexOf(child);
            if (index >= 0) {
                child.onRemove(...args);

                this.target.removeChild(child.target);
                this.children.splice(index, 1);
                child.parent = null;
            }

            return index;
        },

        /** @this {myLib.Element.prototype} */
        removeChildren(...args) {
            for (const child of this.children) {
                child.onRemove(...args);

                this.target.removeChild(child.target);
                child.parent = null;
            }

            this.children = [];
            return this;
        },

        /** @this {myLib.Element.prototype} */
        insertBefore(child, ref_child) {
            let index = this.children.indexOf(ref_child);
            if (index >= 0) {
                if (child.parent !== null)
                    child.parent.removeChild(child);

                this.target.insertBefore(child.target, ref_child.target);
                this.children.splice(index, 0, child);
                child.parent = this;

                child.onAppend();
            }

            return child;
        },

        /** @this {myLib.Element.prototype} */
        replaceChild(child, ref_child) {
            let index = this.children.indexOf(ref_child);
            if (index >= 0) {
                if (child.parent !== null)
                    child.parent.removeChild(child);

                this.target.replaceChild(child.target, ref_child.target);
                this.children.splice(index, 1, child);

                child.parent = this;
                ref_child.parent = null;

                child.onAppend();
            }

            return child;
        },

        /** @this {myLib.Element.prototype} */
        extends(constructor, args) {
            constructor.apply(this, args);
            if (constructor.className !== undefined) {
                const iterate_classList = (/** @type {myLib.Element} */target) => {
                    target.classList_origin.setInheritance(
                        className => (className !== constructor.className) && !className.startsWith(`${constructor.className}-`)
                    );

                    for (const child of target.children)
                        iterate_classList(child);
                }; iterate_classList(this);
            }

            return new myLib.ExtendsReturn(this);
        },

        /** @this {myLib.Element.prototype} */
        getAttribute(name) {
            return this.target.getAttribute(name);
        },

        /** @this {myLib.Element.prototype} */
        getAttributeNS(namespace, localname) {
            return this.target.getAttributeNS(namespace, localname);
        },

        /** @this {myLib.Element.prototype} */
        getBoundingClientRect() {
            return this.target.getBoundingClientRect();
        },

        /** @this {myLib.Element.prototype} */
        getComputedStyle() {
            return getComputedStyle(this.target);
        },

        /** @this {myLib.Element.prototype} */
        hasAttribute(name) {
            return this.target.hasAttribute(name);
        },

        /** @this {myLib.Element.prototype} */
        hasAttributeNS(namespace, localname) {
            return this.target.hasAttributeNS(namespace, localname);
        },

        /** @this {myLib.Element.prototype} */
        iterateDOM(callback, element = this.target) {
            let child = element.firstElementChild;
            while (child !== null) {
                if (callback(child))
                    this.iterateDOM(callback, child);

                child = child.nextElementSibling;
            }
        },

        /** @this {myLib.Element.prototype} */
        requestFullscreen() {
            if (this.target.requestFullscreen)
                this.target.requestFullscreen();

            return this;
        },

        /** @this {myLib.Element.prototype} */
        resize() {
            if (this.onResize(true)) {
                for (const child of this.children)
                    child.resize();

                this.onResize(false);
            } else {
                for (const child of this.children)
                    child.resize();
            }

            return this;
        },

        /** @this {myLib.Element.prototype} */
        setAttribute(name, value) {
            this.target.setAttribute(name, value);
            return this;
        },

        /** @this {myLib.Element.prototype} */
        remAttribute(name) {
            this.target.removeAttribute(name);
            return this;
        },

        /** @this {myLib.Element.prototype} */
        remAttributes() {
            for (const attr of this.target.attributes)
                this.target.removeAttributeNode(attr);

            return this;
        },

        /** @this {myLib.Element.prototype} */
        setAttributeNS(namespace, name, value) {
            this.target.setAttributeNS(namespace, name, value);
            return this;
        },

        /** @this {myLib.Element.prototype} */
        remAttributeNS(namespace, name) {
            this.target.removeAttributeNS(namespace, name);
            return this;
        }
    }
);

myLib.Element.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////// ClassListOrigin ///
    /** @this {myLib.Element.ClassListOrigin} */
    function ClassListOrigin(classList = []) {
        myLib.call(this);

        // Properties

        this.defineProperty('target', Array.from(classList, v => ({ className: v, inherited: true })));
    },

    // Extends
    myLib,

    // Accessors
    {
        /** @this {myLib.Element.ClassListOrigin.prototype} */
        *[Symbol.iterator]() {
            for (const classNode of this.target)
                yield classNode.className;
        },

        inherited: {
            /** @this {myLib.Element.ClassListOrigin.prototype} */
            get() {
                return this.target.filter(classNode => classNode.inherited).map(classNode => classNode.className);
            }
        },

        length: {
            /** @this {myLib.Element.ClassListOrigin.prototype} */
            get() {
                return this.target.length;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.ClassListOrigin.prototype} */
        add(className, inherited = true) {
            this.target = [...this.target, { className, inherited }];
            return this;
        },

        /** @this {myLib.Element.ClassListOrigin.prototype} */
        push(className, inherited = true) {
            this.target = [{ className, inherited }, ...this.target];
            return this;
        },

        /** @this {myLib.Element.ClassListOrigin.prototype} */
        forEach(callback) {
            for (const classNode of this.target)
                callback(classNode.className, classNode.inherited);

            return this;
        },

        /** @this {myLib.Element.ClassListOrigin.prototype} */
        forEachInherited(callback) {
            for (const classNode of this.target)
                classNode.inherited && callback(classNode.className);

            return this;
        },

        /** @this {myLib.Element.ClassListOrigin.prototype} */
        map(callback) {
            return this.target.map(classNode => classNode.className).map(callback);
        },

        /** @this {myLib.Element.ClassListOrigin.prototype} */
        setInheritance(callback) {
            for (const classNode of this.target) {
                if (classNode.inherited)
                    classNode.inherited = callback(classNode.className);
            }
        }
    }
);

myLib.Element.defineClass( ///////////////////////////////////////////////////////////////////////////////////////// ClassListExtensions ///
    /** @this {myLib.Element.ClassListExtensions} */
    function ClassListExtensions(extensions = []) {
        myLib.call(this);

        // Properties

        this.defineProperty('target', extensions);
    },

    // Extends
    myLib,

    // Accessors
    {
        /** @this {myLib.Element.ClassListExtensions.prototype} */
        [Symbol.iterator]() {
            return this.target[Symbol.iterator]();
        },

        length: {
            /** @this {myLib.Element.ClassListExtensions.prototype} */
            get() {
                return this.target.length;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.ClassListExtensions.prototype} */
        add(extension) {
            !this.target.includes(extension) && this.target.push(extension);
            return this;
        },

        /** @this {myLib.Element.ClassListExtensions.prototype} */
        del(extension) {
            let index = this.target.indexOf(extension);
            if (index >= 0)
                this.target.splice(index, 1);

            return this;
        },

        /** @this {myLib.Element.ClassListExtensions.prototype} */
        clear() {
            this.target = [];
        },

        /** @this {myLib.Element.ClassListExtensions.prototype} */
        from(extensions) {
            this.target = [...extensions.target, ...this.target];
        },

        /** @this {myLib.Element.ClassListExtensions.prototype} */
        forEach(callback) {
            this.target.forEach(callback);
        },

        /** @this {myLib.Element.ClassListExtensions.prototype} */
        map(callback) {
            return this.target.map(callback);
        }
    }
);

myLib.Element.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////// HTML ///
    /** @this {myLib.Element.HTML} */
    function HTML(...args) {
        myLib.Element.apply(this, args);

        // Initialization

        let prototype = this.constructor.prototype;
        do {
            if (prototype.constructor.hasOwnProperty('CSSStyle')) {
                this.defineProperty('style', new prototype.constructor.CSSStyle(this));
                break;
            }
        } while (prototype = Object.getPrototypeOf(prototype))
    },

    // Extends
    myLib.Element,

    // Accessors
    {
        offsetTop: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.offsetTop;
            }
        },

        offsetLeft: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.offsetLeft;
            }
        },

        offsetWidth: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.offsetWidth;
            }
        },

        offsetHeight: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.offsetHeight;
            }
        },

        scrollTop: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.scrollTop;
            },

            /** @this {myLib.Element.HTML.prototype} */
            set(scrollTop) {
                this.target.scrollTop = scrollTop;
            }
        },

        scrollLeft: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.scrollLeft;
            },

            /** @this {myLib.Element.HTML.prototype} */
            set(scrollLeft) {
                this.target.scrollLeft = scrollLeft;
            }
        },

        scrollWidth: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.scrollWidth;
            }
        },

        scrollHeight: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.scrollHeight;
            }
        },

        tabIndex: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.tabIndex;
            },

            /** @this {myLib.Element.HTML.prototype} */
            set(tabIndex) {
                this.target.tabIndex = tabIndex;
            }
        },

        title: {
            /** @this {myLib.Element.HTML.prototype} */
            get() {
                return this.target.title;
            },

            /** @this {myLib.Element.HTML.prototype} */
            set(title) {
                this.target.title = title;
            }
        },
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.prototype} */
        append() {
            this.target.style.removeProperty('display');
            return this;
        },

        /** @this {myLib.Element.HTML.prototype} */
        focus(preventScroll = false) {
            let elem = this;
            while (elem) {
                if (elem.hasAttribute('tabindex')) {
                    elem.target.focus({ preventScroll });
                    return this;
                }

                elem = elem.parent;
            }

            return this;
        },

        /** @this {myLib.Element.HTML.prototype} */
        hide() {
            this.target.style.opacity = '0';
            return this;
        },

        /** @this {myLib.Element.HTML.prototype} */
        remove() {
            this.target.style.display = 'none';
            return this;
        },

        /** @this {myLib.Element.HTML.prototype} */
        show() {
            this.target.style.removeProperty('opacity');
            return this;
        }
    }
);

myLib.Element.HTML.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Canvas ///
    /** @this {myLib.Element.HTML.Canvas} */
    function Canvas(...args) {
        if (args[0] instanceof HTMLCanvasElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('canvas'), ...args);
        }
    },

    // Extends
    myLib.Element.HTML,
    {
        /** @this {myLib.Element.HTML.Canvas.prototype} */
        onResize() {
            this.target.width = this.target.clientWidth;
            this.target.height = this.target.clientHeight;
        }
    },

    // Accessors
    {
        width: {
            /** @this {myLib.Element.HTML.Canvas.prototype} */
            get() {
                return this.target.width;
            },

            /** @this {myLib.Element.HTML.Canvas.prototype} */
            set(width) {
                this.target.width = width;
                this.target.style.width = width.toString() + 'px';
            }
        },

        height: {
            /** @this {myLib.Element.HTML.Canvas.prototype} */
            get() {
                return this.target.height;
            },

            /** @this {myLib.Element.HTML.Canvas.prototype} */
            set(height) {
                this.target.height = height;
                this.target.style.height = height.toString() + 'px';
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.Canvas.prototype} */
        getContext2D(contextAttributes) {
            return this.target.getContext('2d', contextAttributes);
        },

        /** @this {myLib.Element.HTML.Canvas.prototype} */
        getContext3D(contextAttributes) {
            return this.target.getContext('webgl', contextAttributes);
        }
    }
);

myLib.Element.HTML.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Div ///
    /** @this {myLib.Element.HTML.Div} */
    function Div(...args) {
        if (args[0] instanceof HTMLDivElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('div'), ...args);
        }
    },

    // Extends
    myLib.Element.HTML
);

myLib.Element.HTML.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Form ///
    /** @this {myLib.Element.HTML.Form} */
    function Form(...args) {
        if (args[0] instanceof HTMLFormElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('form'), ...args);
        }
    },

    // Extends
    myLib.Element.HTML,

    // Accessors
    {
        name: {
            /** @this {myLib.Element.HTML.Form.prototype} */
            get() {
                return this.target.name;
            },

            /** @this {myLib.Element.HTML.Form.prototype} */
            set(name) {
                this.target.name = name;
            }
        }
    }
);

myLib.Element.HTML.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// IFrame ///
    /** @this {myLib.Element.HTML.IFrame} */
    function IFrame(...args) {
        if (args[0] instanceof HTMLIFrameElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('iframe'), ...args);
        }

        // Initialization

        this.target.addEventListener('load', () => {
            this.onLoaded();
        });
    },

    // Extends
    myLib.Element.HTML,

    // Events
    {
        onLoaded() { }
    },

    // Accessors
    {
        contentWindow: {
            /** @this {myLib.Element.HTML.IFrame.prototype} */
            get() {
                return this.target.contentWindow;
            }
        },

        src: {
            /** @this {myLib.Element.HTML.IFrame.prototype} */
            get() {
                return this.target.src;
            },

            /** @this {myLib.Element.HTML.IFrame.prototype} */
            set(src) {
                this.target.src = src;
                this.show();
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.IFrame.prototype} */
        postMessage(data) {
            this.target.contentWindow.postMessage(data, '*');
            return this;
        }
    }
);

myLib.Element.HTML.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Image ///
    /** @this {myLib.Element.HTML.Image} */
    function Image(...args) {
        if (args[0] instanceof HTMLImageElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('img'), ...args);
        }

        // Initialization

        this.target.addEventListener('load', () => {
            this.onLoaded();
        });

        this.hide();
    },

    // Extends
    myLib.Element.HTML,

    // Events
    {
        onLoaded() { }
    },

    // Accessors
    {
        alt: {
            /** @this {myLib.Element.HTML.Image.prototype} */
            get() {
                return this.target.alt;
            },

            /** @this {myLib.Element.HTML.Image.prototype} */
            set(alt) {
                this.target.alt = alt;
            }
        },

        crossOrigin: {
            /** @this {myLib.Element.HTML.Image.prototype} */
            get() {
                return this.target.crossOrigin;
            },

            /** @this {myLib.Element.HTML.Image.prototype} */
            set(crossOrigin) {
                this.target.crossOrigin = crossOrigin;
            }
        },

        src: {
            /** @this {myLib.Element.HTML.Image.prototype} */
            get() {
                return this.target.src;
            },

            /** @this {myLib.Element.HTML.Image.prototype} */
            set(src) {
                this.target.src = src;
                this.show();
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.Image.prototype} */
        clear() {
            this.target.removeAttribute('src');
            this.hide();
            return this;
        },

        /** @this {myLib.Element.HTML.Image.prototype} */
        setSrc(src) {
            this.target.src = src;
            this.show();
            return this;
        }
    }
);

myLib.Element.HTML.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Input ///
    /** @this {myLib.Element.HTML.Input} */
    function Input(...args) {
        if (args[0] instanceof HTMLInputElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('imput'), ...args);
        }
    },

    // Extends
    myLib.Element.HTML,

    // Accessors
    {
        autocomplete: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.autocomplete;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(autocomplete) {
                this.target.autocomplete = autocomplete;
            }
        },

        checked: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.checked;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(checked) {
                this.target.checked = checked;
            }
        },

        disabled: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.disabled;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(disabled) {
                this.target.disabled = disabled;
            }
        },

        name: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.name;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(name) {
                this.target.name = name;
            }
        },

        selectionEnd: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.selectionEnd;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(selectionEnd) {
                this.target.selectionEnd = selectionEnd;
            }
        },

        selectionStart: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.selectionStart;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(selectionStart) {
                this.target.selectionStart = selectionStart;
            }
        },

        type: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.type;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(type) {
                this.target.type = type;
            }
        },

        value: {
            /** @this {myLib.Element.HTML.Input.prototype} */
            get() {
                return this.target.value;
            },

            /** @this {myLib.Element.HTML.Input.prototype} */
            set(value) {
                this.target.value = value;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.Input.prototype} */
        enable() {
            this.target.disabled = false;
            return this;
        },

        /** @this {myLib.Element.HTML.Input.prototype} */
        disable() {
            this.target.disabled = true;
            return this;
        },

        /** @this {myLib.Element.HTML.Input.prototype} */
        setSelectionRange(start, end, direction) {
            this.target.setSelectionRange(start, end, direction);
            return this;
        }
    }
);

myLib.Element.HTML.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Link ///
    /** @this {myLib.Element.HTML.Link} */
    function Link(...args) {
        if (args[0] instanceof HTMLLinkElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('link'), ...args);
        }

        // Initialization

        this.target.addEventListener('load', () => {
            this.onLoaded();
        });

    },

    // Extends
    myLib.Element.HTML,

    // Events
    {
        onLoaded() { }
    },

    // Accessors
    {
        href: {
            /** @this {myLib.Element.HTML.Link.prototype} */
            get() {
                return this.target.href;
            },

            /** @this {myLib.Element.HTML.Link.prototype} */
            set(href) {
                this.target.href = href;
            }
        },

        rel: {
            /** @this {myLib.Element.HTML.Link.prototype} */
            get() {
                return this.target.rel;
            },

            /** @this {myLib.Element.HTML.Link.prototype} */
            set(rel) {
                this.target.rel = rel;
            }
        }
    }
);

myLib.Element.HTML.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Script ///
    /** @this {myLib.Element.HTML.Script} */
    function Script(innerHTML = '') {
        myLib.Element.HTML.call(this, document.createElement('script'));

        // Initialization

        this.target.addEventListener('load', () => {
            this.onLoaded();
        });

        this.target.innerHTML = innerHTML;
    },

    // Extends
    myLib.Element.HTML,

    // Events
    {
        onLoaded() { }
    },

    // Accessors
    {
        src: {
            /** @this {myLib.Element.HTML.Script.prototype} */
            get() {
                return this.target.src;
            },

            /** @this {myLib.Element.HTML.Script.prototype} */
            set(src) {
                this.target.src = src;
                this.show();
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.Script.prototype} */
        append() {
            if (this.target.parentElement !== document.head)
                document.head.appendChild(this.target);

            return this;
        },

        /** @this {myLib.Element.HTML.Script.prototype} */
        remove() {
            if (this.target.parentElement === document.head)
                document.head.removeChild(this.target);

            return this;
        },

        /** @this {myLib.Element.HTML.Script.prototype} */
        setSrc(src) {
            this.target.src = src;
            return this;
        }
    }
);

myLib.Element.HTML.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Style ///
    /** @this {myLib.Element.HTML.Style} */
    function Style(innerHTML = '') {
        myLib.Element.HTML.call(this, document.createElement('style'));

        // Initialization

        this.target.innerHTML = innerHTML;
    },

    // Extends
    myLib.Element.HTML,

    // Methods
    {
        /** @this {myLib.Element.HTML.Style.prototype} */
        append() {
            if (this.target.parentElement !== document.head)
                document.head.appendChild(this.target);

            return this;
        },

        /** @this {myLib.Element.HTML.Style.prototype} */
        remove() {
            if (this.target.parentElement === document.head)
                document.head.removeChild(this.target);

            return this;
        }
    }
);

myLib.Element.HTML.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Table ///
    /** @this {myLib.Element.HTML.Table} */
    function Table(...args) {
        if (args[0] instanceof HTMLTableElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('table'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.HTML
);

myLib.Element.HTML.Table.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////// Body ///
    /** @this {myLib.Element.HTML.Table.Body} */
    function Body(...args) {
        if (args[0] instanceof HTMLTableSectionElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('tbody'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.HTML
);

myLib.Element.HTML.Table.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////// Cell ///
    /** @this {myLib.Element.HTML.Table.Cell} */
    function Cell(...args) {
        if (args[0] instanceof HTMLTableCellElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('td'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.HTML
);

myLib.Element.HTML.Table.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////// Col ///
    /** @this {myLib.Element.HTML.Table.Col} */
    function Col(...args) {
        if (args[0] instanceof HTMLTableColElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('col'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.HTML
);

myLib.Element.HTML.Table.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////// Row ///
    /** @this {myLib.Element.HTML.Table.Row} */
    function Row(...args) {
        if (args[0] instanceof HTMLTableRowElement) {
            myLib.Element.HTML.apply(this, args);
        } else {
            myLib.Element.HTML.call(this, document.createElement('tr'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.HTML
);

myLib.Element.HTML.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.Element.HTML.CSSStyle} */
    function CSSStyle(target) {
        myLib.call(this);

        // Initialization

        this.defineProperty('target', target);
        this.defineProperty('target_get', getComputedStyle(target.target));
        this.defineProperty('target_set', target.target.style);
    },

    // Extends
    myLib,

    // Accessors
    {
        top: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.top);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(top) {
                if (typeof top === 'number') {
                    this.target_set.top = top.toString() + 'px';
                } else {
                    this.target_set.top = top;
                }
            }
        },

        left: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.left);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(left) {
                if (typeof left === 'number') {
                    this.target_set.left = left.toString() + 'px';
                } else {
                    this.target_set.left = left;
                }
            }
        },

        right: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.right);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(right) {
                if (typeof right === 'number') {
                    this.target_set.right = right.toString() + 'px';
                } else {
                    this.target_set.right = right;
                }
            }
        },

        bottom: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.bottom);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(bottom) {
                if (typeof bottom === 'number') {
                    this.target_set.bottom = bottom.toString() + 'px';
                } else {
                    this.target_set.bottom = bottom;
                }
            }
        },

        inset: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return [
                    parseFloat(this.target_get.top),
                    parseFloat(this.target_get.right),
                    parseFloat(this.target_get.bottom),
                    parseFloat(this.target_get.left)
                ];
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(inset) {
                if (typeof inset === 'string') {
                    this.target_set.inset = inset;
                } else {
                    this.target_set.inset = inset.map(x => x.toString() + 'px').join(' ');
                }
            }
        },

        width: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.width);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(width) {
                if (typeof width === 'number') {
                    this.target_set.width = width.toString() + 'px';
                } else {
                    this.target_set.width = width;
                }
            }
        },

        maxWidth: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.maxWidth);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(maxWidth) {
                if (typeof maxWidth === 'number') {
                    this.target_set.maxWidth = maxWidth.toString() + 'px';
                } else {
                    this.target_set.maxWidth = maxWidth;
                }
            }
        },

        height: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.height);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(height) {
                if (typeof height === 'number') {
                    this.target_set.height = height.toString() + 'px';
                } else {
                    this.target_set.height = height;
                }
            }
        },

        maxHeight: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.maxHeight);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(maxHeight) {
                if (typeof maxHeight === 'number') {
                    this.target_set.maxHeight = maxHeight.toString() + 'px';
                } else {
                    this.target_set.maxHeight = maxHeight;
                }
            }
        },

        background: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.background;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(background) {
                this.target_set.background = background;
            }
        },

        backgroundColor: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.backgroundColor;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(backgroundColor) {
                this.target_set.backgroundColor = backgroundColor;
            }
        },

        backgroundImage: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.backgroundImage;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(backgroundImage) {
                this.target_set.backgroundImage = backgroundImage;
            }
        },

        borderRadius: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.borderRadius);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(borderRadius) {
                if (typeof borderRadius === 'number') {
                    this.target_set.borderRadius = borderRadius.toString() + 'px';
                } else {
                    this.target_set.borderRadius = borderRadius;
                }
            }
        },

        cursor: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.cursor;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(cursor) {
                this.target_set.cursor = cursor;
            }
        },

        display: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.display;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(display) {
                this.target_set.display = display;
            }
        },

        margin: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return [
                    parseFloat(this.target_get.marginTop),
                    parseFloat(this.target_get.marginRight),
                    parseFloat(this.target_get.marginBottom),
                    parseFloat(this.target_get.marginLeft)
                ];
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(margin) {
                if (typeof margin === 'string') {
                    this.target_set.margin = margin;
                } else {
                    this.target_set.margin = margin.map(x => x.toString() + 'px').join(' ');
                }
            }
        },

        marginTop: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginTop);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginTop) {
                if (typeof marginTop === 'number') {
                    this.target_set.marginTop = marginTop.toString() + 'px';
                } else {
                    this.target_set.marginTop = marginTop;
                }
            }
        },

        marginLeft: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginLeft);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginLeft) {
                if (typeof marginLeft === 'number') {
                    this.target_set.marginLeft = marginLeft.toString() + 'px';
                } else {
                    this.target_set.marginLeft = marginLeft;
                }
            }
        },

        marginRight: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginRight);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginRight) {
                if (typeof marginRight === 'number') {
                    this.target_set.marginRight = marginRight.toString() + 'px';
                } else {
                    this.target_set.marginRight = marginRight;
                }
            }
        },

        marginBottom: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginBottom);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginBottom) {
                if (typeof marginBottom === 'number') {
                    this.target_set.marginBottom = marginBottom.toString() + 'px';
                } else {
                    this.target_set.marginBottom = marginBottom;
                }
            }
        },

        opacity: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return Number(this.target_get.opacity);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(opacity) {
                this.target_set.opacity = opacity.toString();
            }
        },

        padding: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return [
                    parseFloat(this.target_get.paddingTop),
                    parseFloat(this.target_get.paddingRight),
                    parseFloat(this.target_get.paddingBottom),
                    parseFloat(this.target_get.paddingLeft)
                ];
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(padding) {
                if (typeof padding === 'string') {
                    this.target_set.padding = padding;
                } else {
                    this.target_set.padding = padding.map(x => x.toString() + 'px').join(' ');
                }
            }
        },

        paddingTop: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingTop);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingTop) {
                if (typeof paddingTop === 'number') {
                    this.target_set.paddingTop = paddingTop.toString() + 'px';
                } else {
                    this.target_set.paddingTop = paddingTop;
                }
            }
        },

        paddingLeft: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingLeft);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingLeft) {
                if (typeof paddingLeft === 'number') {
                    this.target_set.paddingLeft = paddingLeft.toString() + 'px';
                } else {
                    this.target_set.paddingLeft = paddingLeft;
                }
            }
        },

        paddingRight: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingRight);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingRight) {
                if (typeof paddingRight === 'number') {
                    this.target_set.paddingRight = paddingRight.toString() + 'px';
                } else {
                    this.target_set.paddingRight = paddingRight;
                }
            }
        },

        paddingBottom: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingBottom);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingBottom) {
                if (typeof paddingBottom === 'number') {
                    this.target_set.paddingBottom = paddingBottom.toString() + 'px';
                } else {
                    this.target_set.paddingBottom = paddingBottom;
                }
            }
        },

        perspective: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.perspective);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(perspective) {
                this.target_set.perspective = perspective.toString() + 'px';
            }
        },

        pointerEvents: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.pointerEvents;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(pointerEvents) {
                this.target_set.pointerEvents = pointerEvents;
            }
        },

        position: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.position;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(position) {
                this.target_set.position = position;
            }
        },

        transform: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.transform;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(transform) {
                this.target_set.transform = transform;
            }
        },

        transformOrigin: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.transformOrigin;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(transformOrigin) {
                this.target_set.transformOrigin = transformOrigin;
            }
        },

        transformStyle: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.transformStyle;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(transformStyle) {
                this.target_set.transformStyle = transformStyle;
            }
        },

        transition: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return this.target_get.transition;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(transition) {
                this.target_set.transition = transition;
            }
        },

        zIndex: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return Number(this.target_get.zIndex);
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(zIndex) {
                this.target_set.zIndex = zIndex.toString();
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.CSSStyle.prototype} */
        removeProperty(property) {
            this.target_set.removeProperty(property);
            return this;
        }
    }
);

myLib.Element.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// SVG ///
    /** @this {myLib.Element.SVG} */
    function SVG(...args) {
        myLib.Element.apply(this, args);

        // Initialization

        let prototype = this.constructor.prototype;
        do {
            if (prototype.constructor.hasOwnProperty('CSSStyle')) {
                this.defineProperty('style', new prototype.constructor.CSSStyle(this));
                break;
            }
        } while (prototype = Object.getPrototypeOf(prototype))

        this.defineProperty('transform', []);
    },

    // Extends
    myLib.Element,

    // Methods
    {
        /** @this {myLib.Element.SVG.prototype} */
        append() {
            this.target.style.removeProperty('display');
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        focus(preventScroll = false) {
            let elem = this;
            while (elem) {
                if (elem.hasAttribute('tabindex')) {
                    elem.target.focus({ preventScroll });
                    return this;
                }

                elem = elem.parent;
            }

            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        getBBox(options) {
            return this.target.getBBox(options);
        },

        /** @this {myLib.Element.SVG.prototype} */
        hide() {
            this.target.style.opacity = '0';
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        matrix(M) {
            this.target.setAttribute('transform', `matrix(${M.join(' ')})`);
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        position(x, y) {
            this.target.setAttribute('x', x.toString());
            this.target.setAttribute('y', y.toString());

            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        remove() {
            this.target.style.display = 'none';
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        reset() {
            this.transform = [];
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        rotate(a, x = 0, y = 0) {
            this.transform.push(`rotate(${a.toString()} ${x.toString()} ${y.toString()})`);
            this.target.setAttribute('transform', this.transform.join(' '));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        scale(x, y) {
            this.transform.push(`scale(${x.toString()} ${y.toString()})`);
            this.target.setAttribute('transform', this.transform.join(' '));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        skewX(a) {
            this.transform.push(`skewX(${a.toString()})`);
            this.target.setAttribute('transform', this.transform.join(' '));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        skewY(a) {
            this.transform.push(`skewY(${a.toString()})`);
            this.target.setAttribute('transform', this.transform.join(' '));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        show() {
            this.target.style.removeProperty('opacity');
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        transformOrigin(x, y) {
            this.target.setAttribute('transform-origin', `${x.toString()} ${y.toString()}`);
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        translate(x, y) {
            this.transform.push(`translate(${x.toString()} ${y.toString()})`);
            this.target.setAttribute('transform', this.transform.join(' '));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        update() {
            this.target.setAttribute('transform', this.transform.join(' '));
            return this;
        }
    }
);

myLib.Element.SVG.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Circle ///
    /** @this {myLib.Element.SVG.Circle} */
    function Circle(...args) {
        if (args[0] instanceof SVGCircleElement) {
            myLib.Element.SVG.apply(this, args);
        } else {
            myLib.Element.SVG.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'circle'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.SVG,

    // Accessors
    {
        cx: {
            /** @this {myLib.Element.SVG.Circle.prototype} */
            get() {
                return Number(this.target.getAttribute('cx')) || 0;
            },

            /** @this {myLib.Element.SVG.Circle.prototype} */
            set(cx) {
                this.target.setAttribute('cx', cx.toString());
            }
        },

        cy: {
            /** @this {myLib.Element.SVG.Circle.prototype} */
            get() {
                return Number(this.target.getAttribute('cy')) || 0;
            },

            /** @this {myLib.Element.SVG.Circle.prototype} */
            set(cy) {
                this.target.setAttribute('cy', cy.toString());
            }
        },

        r: {
            /** @this {myLib.Element.SVG.Circle.prototype} */
            get() {
                return Number(this.target.getAttribute('r')) || 0;
            },

            /** @this {myLib.Element.SVG.Circle.prototype} */
            set(r) {
                this.target.setAttribute('r', r.toString());
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.SVG.Circle.prototype} */
        set(cx, cy, r) {
            this.cx = cx;
            this.cy = cy;
            this.r = r;

            return this;
        }
    }
);

myLib.Element.SVG.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Ellipse ///
    /** @this {myLib.Element.SVG.Ellipse} */
    function Ellipse(...args) {
        if ((args[0] instanceof SVGEllipseElement) || (args[0] instanceof SVGCircleElement)) {
            myLib.Element.SVG.apply(this, args);
        } else {
            myLib.Element.SVG.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'ellipse'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.SVG,

    // Accessors
    {
        cx: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                return Number(this.target.getAttribute('cx')) || 0;
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(cx) {
                this.target.setAttribute('cx', cx.toString());
            }
        },

        cy: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                return Number(this.target.getAttribute('cy')) || 0;
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(cy) {
                this.target.setAttribute('cy', cy.toString());
            }
        },

        r: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                if (this.target instanceof SVGEllipseElement) {
                    let rx = Number(this.target.getAttribute('rx')) || 0,
                        ry = Number(this.target.getAttribute('ry')) || 0;

                    return (rx + ry) / 2;
                } else {
                    return Number(this.target.getAttribute('r')) || 0;
                }
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(r) {
                if (this.target instanceof SVGEllipseElement) {
                    this.target.setAttribute('rx', r.toString());
                    this.target.setAttribute('ry', r.toString());
                } else {
                    this.target.setAttribute('r', r.toString());
                }
            }
        },

        rx: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                return Number(this.target.getAttribute('rx')) || 0;
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(rx) {
                this.target.setAttribute('rx', rx.toString());
            }
        },

        ry: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                return Number(this.target.getAttribute('ry')) || 0;
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(ry) {
                this.target.setAttribute('ry', ry.toString());
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.SVG.Ellipse.prototype} */
        set(cx, cy, rx, ry) {
            this.cx = cx;
            this.cy = cy;
            this.rx = rx;
            this.ry = ry;

            return this;
        }
    }
);

myLib.Element.SVG.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////// Geometry ///
    /** @this {myLib.Element.SVG.Path} */
    function Geometry(...args) {
        myLib.Element.SVG.apply(this, args);
    },

    // Extends
    myLib.Element.SVG
);

myLib.Element.SVG.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Group ///
    /** @this {myLib.Element.SVG.Group} */
    function Group(...args) {
        if (args[0] instanceof SVGGElement) {
            myLib.Element.SVG.apply(this, args);
        } else {
            myLib.Element.SVG.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'g'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.SVG
);

myLib.Element.SVG.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Path ///
    /** @this {myLib.Element.SVG.Path} */
    function Path(...args) {
        if (args[0] instanceof SVGPathElement) {
            myLib.Element.SVG.apply(this, args);
        } else {
            myLib.Element.SVG.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'path'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.SVG,

    // Accessors
    {
        d: {
            /** @this {myLib.Element.SVG.Path.prototype} */
            get() {
                return this.target.getAttribute('d');
            },

            /** @this {myLib.Element.SVG.Path.prototype} */
            set(d) {
                this.target.setAttribute('d', d);
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.SVG.Path.prototype} */
        set(d) {
            this.d = d;
            return this;
        }
    }
);

myLib.Element.SVG.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Rect ///
    /** @this {myLib.Element.SVG.Rect} */
    function Rect(...args) {
        if (args[0] instanceof SVGRectElement) {
            myLib.Element.SVG.apply(this, args);
        } else {
            myLib.Element.SVG.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'rect'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.SVG,

    // Accessors
    {
        x: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return Number(this.target.getAttribute('x')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(x) {
                this.target.setAttribute('x', x.toString());
            }
        },

        y: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return Number(this.target.getAttribute('y')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(y) {
                this.target.setAttribute('y', y.toString());
            }
        },

        width: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return Number(this.target.getAttribute('width')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(width) {
                this.target.setAttribute('width', width.toString());
            }
        },

        height: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return Number(this.target.getAttribute('height')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(height) {
                this.target.setAttribute('height', height.toString());
            }
        },

        rx: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return Number(this.target.getAttribute('rx')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(rx) {
                this.target.setAttribute('rx', rx.toString());
            }
        },

        ry: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return Number(this.target.getAttribute('ry')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(ry) {
                this.target.setAttribute('ry', ry.toString());
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.SVG.Rect.prototype} */
        set(x, y, width, height, rx = 0, ry = 0) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.rx = rx;
            this.ry = ry;

            return this;
        }
    }
);

myLib.Element.SVG.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////// SVG ///
    /** @this {myLib.Element.SVG.SVG} */
    function SVG(...args) {
        if (args[0] instanceof SVGSVGElement) {
            myLib.Element.SVG.apply(this, args);
        } else {
            myLib.Element.SVG.call(this, document.createElementNS('http://www.w3.org/2000/svg', 'svg'), args[0], args[1]);

            this.target.setAttribute('version', '1.1');
            this.target.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }
    },

    // Extends
    myLib.Element.SVG,
    {
        /** @this {myLib.Element.SVG.SVG.prototype} */
        removeAttributes() {
            for (const attr of this.target.attributes)
                this.target.removeAttributeNode(attr);

            this.target.setAttribute('version', '1.1');
            this.target.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            return this;
        }
    },

    // Accessors
    {
        x: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return Number(this.target.getAttribute('x')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(x) {
                this.target.setAttribute('x', x.toString());
            }
        },

        y: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return Number(this.target.getAttribute('y')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(y) {
                this.target.setAttribute('y', y.toString());
            }
        },

        width: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return Number(this.target.getAttribute('width')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(width) {
                this.target.setAttribute('width', width.toString());
            }
        },

        height: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return Number(this.target.getAttribute('height')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(height) {
                this.target.setAttribute('height', height.toString());
            }
        },

        viewBox: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                if (this.target.hasAttribute('viewBox')) {
                    return this.target.getAttribute('viewBox').split(' ').map(value => Number(value));
                } else {
                    return [0, 0, 0, 0];
                }
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(viewBox) {
                this.target.setAttribute('viewBox', viewBox.join(' '));
            }
        }
    }
);

myLib.Element.SVG.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.Element.SVG.CSSStyle} */
    function CSSStyle(target) {
        myLib.Element.HTML.CSSStyle.call(this, target);
    },

    // Extends
    myLib.Element.HTML.CSSStyle,

    // Accessors
    {
        fill: {
            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            get() {
                return this.target_get.fill;
            },

            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            set(fill) {
                this.target_set.fill = fill;
            }
        },

        fillOpacity: {
            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            get() {
                return Number(this.target_get.fillOpacity);
            },

            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            set(fillOpacity) {
                this.target_set.fillOpacity = fillOpacity.toString();
            }
        },

        stroke: {
            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            get() {
                return this.target_get.stroke;
            },

            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            set(stroke) {
                this.target_set.stroke = stroke;
            }
        },

        strokeOpacity: {
            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            get() {
                return Number(this.target_get.strokeOpacity);
            },

            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            set(strokeOpacity) {
                this.target_set.strokeOpacity = strokeOpacity;
            }
        }
    }
);