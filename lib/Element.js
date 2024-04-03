// #include <./myLib.js>

'use strict';

myLib.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////////// Element ///
    /** @this {myLib.Element} */
    function Element(target, className = target.className, id = target.id) {
        myLib.call(this);

        // Initialization

        this.defineProperty('target', target);

        this.className = className;
        this.id = id;

        this.defineProperty('children', []);
        this.defineProperty('parent', null);
    },

    // Extends
    myLib,

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
                return this.target.className;
            },

            /** @this {myLib.Element.prototype} */
            set(className) {
                this.target.className = className.replace(/[^a-z0-9-_ ]/ig, '').trim();
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
                return this.target.id;
            },

            /** @this {myLib.Element.prototype} */
            set(id) {
                this.target.id = id.replace(/[^a-z0-9-_]/ig, '').trim();
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
        appendChild(child) {
            if (child.parent !== null)
                child.parent.removeChild(child);

            this.target.appendChild(child.target);

            this.children.push(child);
            child.parent = this;

            return child;
        },

        /** @this {myLib.Element.prototype} */
        defineChild(name, child) {
            this.defineProperty(name, child);

            if (child.parent !== null) {
                child.parent.removeChild(child);
            } else if (child.target.parentNode !== this.target) {
                this.target.appendChild(child.target);
            }

            this.children.push(child);
            child.parent = this;

            return child;
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
        insertBefore(child, ref_child) {
            let index = this.children.indexOf(ref_child);
            if (index >= 0) {
                if (child.parent !== null)
                    child.parent.removeChild(child);

                this.target.insertBefore(child.target, ref_child.target);
                this.children.splice(index, 0, child);
                child.parent = this;

                return true;
            } else {
                return false;
            }
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
        removeAttribute(name) {
            this.target.removeAttribute(name);
            return this;
        },

        /** @this {myLib.Element.prototype} */
        removeAttributes() {
            for (const attr of this.target.attributes)
                this.target.removeAttributeNode(attr);

            return this;
        },

        /** @this {myLib.Element.prototype} */
        removeChild(child) {
            let index = this.children.indexOf(child);
            if (index >= 0) {
                this.target.removeChild(child.target);
                this.children.splice(index, 1);
                child.parent = null;
            }

            return this;
        },

        /** @this {myLib.Element.prototype} */
        removeChildren() {
            for (const child of this.children) {
                this.target.removeChild(child.target);
                child.parent = null;
            }

            this.children = [];
            return this;
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
            }

            return child;
        },

        /** @this {myLib.Element.prototype} */
        setAttribute(name, value) {
            this.target.setAttribute(name, value);
            return this;
        },

        /** @this {myLib.Element.prototype} */
        setAttributeNS(namespace, localname, value) {
            this.target.setAttributeNS(namespace, localname, value);
            return this;
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
                this.defineProperty('style', new prototype.constructor.CSSStyle(this.target));
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
        addEventListener(event, listener, options) {
            this.target.addEventListener(event, listener, options);
            return this;
        },

        /** @this {myLib.Element.HTML.prototype} */
        append() {
            this.target.style.removeProperty('display');
            return this;
        },

        /** @this {myLib.Element.HTML.prototype} */
        focus() {
            this.target.focus();
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
            myLib.Element.HTML.call(this, document.createElement('canvas'), args[0], args[1]);
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
            myLib.Element.HTML.call(this, document.createElement('div'), args[0], args[1]);
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
            myLib.Element.HTML.call(this, document.createElement('form'), args[0], args[1]);
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

myLib.Element.HTML.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Script ///
    /** @this {myLib.Element.HTML.Script} */
    function Script(innerHTML = '') {
        myLib.Element.HTML.call(this, document.createElement('script'));
        this.target.innerHTML = innerHTML;
    },

    // Extends
    myLib.Element.HTML,

    // Methods
    {
        /** @this {myLib.Element.HTML.Script.prototype} */
        append() {
            document.head.appendChild(this.target);
            return this;
        },

        /** @this {myLib.Element.HTML.Script.prototype} */
        remove() {
            document.head.removeChild(this.target);
            return this;
        }
    }
);

myLib.Element.HTML.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Style ///
    /** @this {myLib.Element.HTML.Style} */
    function Style(innerHTML = '') {
        myLib.Element.HTML.call(this, document.createElement('style'));
        this.target.innerHTML = innerHTML;
    },

    // Extends
    myLib.Element.HTML,

    // Methods
    {
        /** @this {myLib.Element.HTML.Style.prototype} */
        append() {
            document.head.appendChild(this.target);
            return this;
        },

        /** @this {myLib.Element.HTML.Style.prototype} */
        remove() {
            document.head.removeChild(this.target);
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
            myLib.Element.HTML.call(this, document.createElement('img'), args[0], args[1]);
        }

        // Initialization

        this.target.addEventListener('load', () => {
            this.onLoaded();
        }, { capture: false, passive: true });
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

        src: {
            /** @this {myLib.Element.HTML.Image.prototype} */
            get() {
                return this.target.src;
            },

            /** @this {myLib.Element.HTML.Image.prototype} */
            set(src) {
                this.target.src = src;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.HTML.Image.prototype} */
        clear() {
            this.target.removeAttribute('src');
            delete this.onLoaded;
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
            myLib.Element.HTML.call(this, document.createElement('input'), args[0], args[1]);
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
            myLib.Element.HTML.call(this, document.createElement('input'), args[0], args[1]);
        }
    },

    // Extends
    myLib.Element.HTML,

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

myLib.Element.HTML.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Body ///
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

myLib.Element.HTML.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Cell ///
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

myLib.Element.HTML.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Col ///
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

myLib.Element.HTML.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Row ///
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

        this.defineProperty('target_get', getComputedStyle(target));
        this.defineProperty('target_set', target.style);
    },

    // Extends
    myLib,

    // Accessors
    {
        top: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.top) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(top) {
                this.target_set.top = top.toString() + 'px';
            }
        },

        left: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.left) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(left) {
                this.target_set.left = left.toString() + 'px';
            }
        },

        right: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.right) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(right) {
                this.target_set.right = right.toString() + 'px';
            }
        },

        bottom: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.bottom) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(bottom) {
                this.target_set.bottom = bottom.toString() + 'px';
            }
        },

        width: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.width) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(width) {
                this.target_set.width = width.toString() + 'px';
            }
        },

        maxWidth: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.maxWidth) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(maxWidth) {
                this.target_set.maxWidth = maxWidth.toString() + 'px';
            }
        },

        height: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.height) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(height) {
                this.target_set.height = height.toString() + 'px';
            }
        },

        maxHeight: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.maxHeight) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(maxHeight) {
                this.target_set.maxHeight = maxHeight.toString() + 'px';
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
                    parseFloat(this.target_get.marginTop) || 0,
                    parseFloat(this.target_get.marginRight) || 0,
                    parseFloat(this.target_get.marginBottom) || 0,
                    parseFloat(this.target_get.marginLeft) || 0
                ];
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(margin) {
                this.target_set.margin = margin.map(x => x.toString() + 'px').join(' ');
            }
        },

        marginTop: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginTop) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginTop) {
                this.target_set.marginTop = marginTop.toString() + 'px';
            }
        },

        marginLeft: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginLeft) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginLeft) {
                this.target_set.marginLeft = marginLeft.toString() + 'px';
            }
        },

        marginRight: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginRight) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginRight) {
                this.target_set.marginRight = marginRight.toString() + 'px';
            }
        },

        marginBottom: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.marginBottom) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(marginBottom) {
                this.target_set.marginBottom = marginBottom.toString() + 'px';
            }
        },

        opacity: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.opacity) || 0;
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
                    parseFloat(this.target_get.paddingTop) || 0,
                    parseFloat(this.target_get.paddingRight) || 0,
                    parseFloat(this.target_get.paddingBottom) || 0,
                    parseFloat(this.target_get.paddingLeft) || 0
                ];
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(padding) {
                this.target_set.padding = padding.map(x => x.toString() + 'px').join(' ');
            }
        },

        paddingTop: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingTop) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingTop) {
                this.target_set.paddingTop = paddingTop.toString() + 'px';
            }
        },

        paddingLeft: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingLeft) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingLeft) {
                this.target_set.paddingLeft = paddingLeft.toString() + 'px';
            }
        },

        paddingRight: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingRight) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingRight) {
                this.target_set.paddingRight = paddingRight.toString() + 'px';
            }
        },

        paddingBottom: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.paddingBottom) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(paddingBottom) {
                this.target_set.paddingBottom = paddingBottom.toString() + 'px';
            }
        },

        perspective: {
            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.perspective) || 0;
            },

            /** @this {myLib.Element.HTML.CSSStyle.prototype} */
            set(perspective) {
                this.target_set.perspective = perspective.toString() + 'px';
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
                this.defineProperty('style', new prototype.constructor.CSSStyle(this.target));
                break;
            }
        } while (prototype = Object.getPrototypeOf(prototype))

        this.defineProperty('transform', []);
    },

    // Extends
    myLib.Element,
    {
        className: {
            /** @this {myLib.Element.SVG.prototype} */
            get() {
                if (this.target.hasAttribute('class')) {
                    return this.target.getAttribute('class');
                } else {
                    return '';
                }
            },

            /** @this {myLib.Element.SVG.prototype} */
            set(className) {
                if (className !== '') {
                    this.target.setAttribute('class', className);
                } else {
                    this.target.removeAttribute('class');
                }
            }
        },

        id: {
            /** @this {myLib.Element.SVG.prototype} */
            get() {
                if (this.target.hasAttribute('id')) {
                    return this.target.getAttribute('id');
                } else {
                    return '';
                }
            },

            /** @this {myLib.Element.SVG.prototype} */
            set(id) {
                if (id !== '') {
                    this.target.setAttribute('id', id);
                } else {
                    this.target.removeAttribute('id');
                }
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Element.SVG.prototype} */
        append() {
            this.target.style.removeProperty('display');
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        focus() {
            this.target.focus();
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
            this.target.setAttribute('transform', `matrix(${M.join(" ")})`);
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
            this.target.setAttribute('transform', this.transform.join(" "));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        scale(x, y) {
            this.transform.push(`scale(${x.toString()} ${y.toString()})`);
            this.target.setAttribute('transform', this.transform.join(" "));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        skewX(a) {
            this.transform.push(`skewX(${a.toString()})`);
            this.target.setAttribute('transform', this.transform.join(" "));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        skewY(a) {
            this.transform.push(`skewY(${a.toString()})`);
            this.target.setAttribute('transform', this.transform.join(" "));
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
            this.target.setAttribute('transform', this.transform.join(" "));
            return this;
        },

        /** @this {myLib.Element.SVG.prototype} */
        update() {
            this.target.setAttribute('transform', this.transform.join(" "));
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
                return parseFloat(this.target.getAttribute('cx')) || 0;
            },

            /** @this {myLib.Element.SVG.Circle.prototype} */
            set(cx) {
                this.target.setAttribute('cx', cx.toString());
            }
        },

        cy: {
            /** @this {myLib.Element.SVG.Circle.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('cy')) || 0;
            },

            /** @this {myLib.Element.SVG.Circle.prototype} */
            set(cy) {
                this.target.setAttribute('cy', cy.toString());
            }
        },

        r: {
            /** @this {myLib.Element.SVG.Circle.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('r')) || 0;
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
                return parseFloat(this.target.getAttribute('cx')) || 0;
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(cx) {
                this.target.setAttribute('cx', cx.toString());
            }
        },

        cy: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('cy')) || 0;
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
                    let rx = parseFloat(this.target.getAttribute('rx')) || 0,
                        ry = parseFloat(this.target.getAttribute('ry')) || 0;

                    return (rx + ry) / 2;
                } else {
                    return parseFloat(this.target.getAttribute('r')) || 0;
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
                return parseFloat(this.target.getAttribute('rx')) || 0;
            },

            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            set(rx) {
                this.target.setAttribute('rx', rx.toString());
            }
        },

        ry: {
            /** @this {myLib.Element.SVG.Ellipse.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('ry')) || 0;
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
                return parseFloat(this.target.getAttribute('x')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(x) {
                this.target.setAttribute('x', x.toString());
            }
        },

        y: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('y')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(y) {
                this.target.setAttribute('y', y.toString());
            }
        },

        width: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('width')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(width) {
                this.target.setAttribute('width', width.toString());
            }
        },

        height: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('height')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(height) {
                this.target.setAttribute('height', height.toString());
            }
        },

        rx: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('rx')) || 0;
            },

            /** @this {myLib.Element.SVG.Rect.prototype} */
            set(rx) {
                this.target.setAttribute('rx', rx.toString());
            }
        },

        ry: {
            /** @this {myLib.Element.SVG.Rect.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('ry')) || 0;
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
                return parseFloat(this.target.getAttribute('x')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(x) {
                this.target.setAttribute('x', x.toString());
            }
        },

        y: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('y')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(y) {
                this.target.setAttribute('y', y.toString());
            }
        },

        width: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('width')) || 0;
            },

            /** @this {myLib.Element.SVG.SVG.prototype} */
            set(width) {
                this.target.setAttribute('width', width.toString());
            }
        },

        height: {
            /** @this {myLib.Element.SVG.SVG.prototype} */
            get() {
                return parseFloat(this.target.getAttribute('height')) || 0;
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
                    return this.target.getAttribute('viewBox').split(' ').map(value => parseFloat(value) || 0);
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
                return parseFloat(this.target_get.fillOpacity) || 0;
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
                return parseFloat(this.target_get.strokeOpacity) || 0;
            },

            /** @this {myLib.Element.SVG.CSSStyle.prototype} */
            set(strokeOpacity) {
                this.target_set.strokeOpacity = strokeOpacity;
            }
        }
    }
);