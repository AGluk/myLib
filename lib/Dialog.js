// #include <./AJAX.js>
// #include <./Layer.js>
// #include <./List.js>
// #include <./Map.js>
// #include <./Scroll.js>

'use strict';

myLib.static({
    dialogs: new myLib.Map()
});

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// Dialog ///
    /** @this {myLib.Dialog} */
    function Dialog(...args) {
        this.extends(myLib.Layer, args);

        // Children

        this.defineChild('load', new myLib.Dialog.Load());
        this.defineChild('frame', new myLib.Dialog.Frame());

        // Properties

        this.defineProperty('content_AJAX', undefined);
        this.defineProperty('script_AJAX', undefined);
        this.defineProperty('style_AJAX', undefined);

        this.defineProperty('head', new myLib.Dialog.Head);
        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());

        this.defineProperty('modal_', false);

        // Initialization

        this.classList_origin.forEachInherited(
            this_className_origin => this.frame.body.content.classList_origin.add(`${this_className_origin}-content`)
        );

        this.classList_custom.forEach(
            this_className_custom => this.frame.body.content.classList_origin.add(`${this_className_custom}-content`)
        );

        this.frame.body.content.className = this.frame.body.content.className;
    },

    // Static
    {
        className: 'my-dialog'
    },

    // Extends
    myLib.Layer,
    {
        /** @this {myLib.Dialog.prototype} */
        onKeyDown(code, key, modifiers) {
            switch (code) {
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'ArrowUp':
                case 'End':
                case 'Home':
                case 'PageDown':
                case 'PageUp':
                    this.frame.body.onKeyDown(code, key, modifiers);
                    return true;
                case 'Escape':
                    if (this.modal_) {
                        this.focus();
                    } else {
                        this.remove(true);
                    }

                    return true;
            }
        },

        /** @this {myLib.Dialog.prototype} */
        onTap(target) {
            if (target === this.target) {
                if (this.modal_) {
                    this.focus();
                } else {
                    this.remove(true);
                }
            }

            return true;
        },

        /** @this {myLib.Dialog.prototype} */
        append(...args) {
            this.head.append();
            myLib.Layer.proto('append').apply(this, args);
            return this;
        },

        /** @this {myLib.Dialog.prototype} */
        remove(...args) {
            this.head.remove();
            myLib.Layer.proto('remove').apply(this, args);
            return this;
        },

        /** @this {myLib.Dialog.prototype} */
        scrollBy(dX, dY) {
            this.frame.body.scrollBy(dX, dY);
            return this;
        },

        /** @this {myLib.Dialog.prototype} */
        scrollTo(left, top, duration, callback) {
            this.frame.body.scrollTo(left, top, 1, duration, callback);
            return this;
        }
    },

    // Events
    {
        onLoaded() { }
    },

    // Methods
    {
        /** @this {myLib.Dialog.prototype} */
        clear() {
            if (this.content_AJAX !== undefined)
                this.content_AJAX.abort();

            if (this.script_AJAX !== undefined)
                this.script_AJAX.abort();

            if (this.style_AJAX !== undefined)
                this.style_AJAX.abort();

            this.frame.remove().hide();
            this.load.show();

            this.frame.head.innerHTML = '';
            this.frame.head.remove();

            this.frame.body.innerHTML = '';
            this.frame.body.remove();

            this.head.script.innerHTML = '';
            this.head.style.innerHTML = '';

            this.elements = this.frame.body.elements = new myLib.Map();
            this.forms = this.frame.body.forms = new myLib.Map();
            this.frame.body.tracked = new myLib.List();

            this.modal(false);

            return this;
        },

        /** @this {myLib.Dialog.prototype} */
        modal(modal) {
            if (modal) {
                this.frame.close.style.display = 'none';
            } else {
                this.frame.close.style.removeProperty('display');
            }

            this.modal_ = modal;
            return this;
        },

        /** @this {myLib.Dialog.prototype} */
        setContent(body, head) {
            if (this.content_AJAX !== undefined)
                this.content_AJAX.abort();

            if (this.script_AJAX !== undefined)
                this.script_AJAX.abort();

            if (this.style_AJAX !== undefined)
                this.style_AJAX.abort();

            this.frame.remove().hide();

            this.head.style.innerHTML = '';
            this.head.script.innerHTML = '';

            if (head !== undefined) {
                this.frame.head.innerHTML = head;
                this.frame.head.append();
            } else {
                this.frame.head.innerHTML = '';
                this.frame.head.remove();
            }

            if (body !== undefined) {
                this.frame.body.innerHTML = body;
                this.frame.body.append();
            } else {
                this.frame.body.innerHTML = '';
                this.frame.body.remove();
            }

            this.elements = this.frame.body.elements;
            this.forms = this.frame.body.forms;

            this.frame.append();
            this.frame.resize();
            this.frame.show();

            this.load.hide();

            return this;
        },

        /** @this {myLib.Dialog.prototype} */
        setSrc(src) {
            src = src.match(/^(https?:\/\/.*?\/)?(.*)/i).map(match => match || '');

            if (this.content_AJAX !== undefined)
                this.content_AJAX.abort();

            if (this.script_AJAX !== undefined)
                this.script_AJAX.abort();

            if (this.style_AJAX !== undefined)
                this.style_AJAX.abort();

            this.frame.remove().hide();
            this.load.show();

            let count = 3, content, script, style,
                onLoaded = () => {
                    this.head.style.innerHTML = style;
                    this.head.script.innerHTML = script;

                    let head = content.match(/<head>(.*)<\/head>/i);
                    if (head !== null) {
                        this.frame.head.innerHTML = head[1];
                        this.frame.head.append();
                    } else {
                        this.frame.head.innerHTML = '';
                        this.frame.head.remove();
                    }

                    let body = content.match(/<body>(.*)<\/body>/i);
                    if (body !== null) {
                        this.frame.body.innerHTML = body[1];
                        this.frame.body.append();
                    } else {
                        this.frame.body.innerHTML = '';
                        this.frame.body.remove();
                    }

                    this.elements = this.frame.body.elements;
                    this.forms = this.frame.body.forms;

                    this.frame.append();
                    this.frame.resize();

                    this.onLoaded();

                    this.frame.resize();
                    this.frame.show();

                    this.load.hide();
                };

            this.content_AJAX = myLib.AJAX.get(`${src[1]}getPage.php?src=${src[2]}`, AJAX => {
                this.content_AJAX = undefined;
                content = AJAX.responseText;
                if (--count === 0) onLoaded();
            });

            this.style_AJAX = myLib.AJAX.get(`${src[1]}getStyle.php?src=${src[2]}`, AJAX => {
                this.style_AJAX = undefined;
                style = AJAX.responseText;
                if (--count === 0) onLoaded();
            });

            this.script_AJAX = myLib.AJAX.get(`${src[1]}getScript.php?src=${src[2]}`, AJAX => {
                this.script_AJAX = undefined;
                script = AJAX.responseText;
                if (--count === 0) onLoaded();
            });

            return this;
        }
    }
);

myLib.Dialog.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////// Frame ///
    /** @this {myLib.Dialog.Frame} */
    function Frame() {
        this.extends(myLib.Element.HTML.Div);

        // Children

        this.defineChild('head', new myLib.Dialog.Frame.Head());
        this.defineChild('body', new myLib.Dialog.Frame.Body());
        this.defineChild('close', new myLib.Dialog.Frame.Close());

        // Initialization

        this.style.top = 0;
        this.style.left = 0;

        this.remove().hide();
    },

    // Static
    {
        className: 'frame'
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Dialog.Frame.prototype} */
        onResize(capture) {
            if (capture) {
                this.body.style.removeProperty('max-height');
                this.body.style.maxHeight = this.clientHeight - this.head.offsetHeight;

                return true;
            } else {
                this.style.top = (this.parent.clientHeight - this.offsetHeight) / 2;
                this.style.left = (this.parent.clientWidth - this.offsetWidth) / 2;
            }
        }
    }
);

myLib.Dialog.Frame.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Head ///
    /** @this {myLib.Dialog.Frame.Head} */
    function Head() {
        this.extends(myLib.Element.HTML.Div)
            .mixin(myLib.Touch);
    },

    // Static
    {
        className: 'head'
    },

    // Extends
    myLib.Element.HTML.Div,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Dialog.Frame.Head.prototype} */
        onTap() {
            this.parent.body.scrollTo(0, 0, this.parent.body.zoom, 600);
            return true;
        }
    }
);

myLib.Dialog.Frame.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Body ///
    /** @this {myLib.Dialog.Frame.Body} */
    function Body() {
        this.extends(myLib.Scroll);

        // Initialization

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());
        this.defineProperty('tracked', new myLib.List());
    },

    // Static
    {
        className: 'body'
    },

    // Extends
    myLib.Scroll,
    {
        innerHTML: {
            /** @this {myLib.Dialog.Frame.Body.prototype} */
            get() {
                return this.content.target.innerHTML;
            },

            /** @this {myLib.Dialog.Frame.Body.prototype} */
            set(innerHTML) {
                this.content.target.innerHTML = innerHTML;

                this.elements = new myLib.Map();
                this.forms = new myLib.Map();
                this.tracked = new myLib.List();

                this.iterateDOM(child => {
                    switch (child.nodeName) {
                        case 'FORM':
                            if (child.hasAttribute('name'))
                                this.forms[child.getAttribute('name')] = child;

                            return false;
                        default:
                            if (child.hasAttribute('id')) {
                                this.elements[child.getAttribute('id')] = child;
                            } else if (child.hasAttribute('data-id')) {
                                this.elements[child.getAttribute('data-id')] = child;
                            }

                            if (child.hasAttribute('class'))
                                this.tracked.add(new myLib.Dialog.Frame.Body.Tracked(child, this.parent.parent));

                            return true;
                    }
                });
            }
        },

        /** @this {myLib.Dialog.Frame.Body.prototype} */
        addExtendedClassNames(extension) {
            myLib.Scroll.proto('addExtendedClassNames').call(this, extension);

            for (const tracked of this.tracked)
                tracked.update();

            return this;
        },

        /** @this {myLib.Dialog.Frame.Body.prototype} */
        remExtendedClassNames(extension) {
            myLib.Scroll.proto('remExtendedClassNames').call(this, extension);

            for (const tracked of this.tracked)
                tracked.update();

            return this;
        }
    }
);

myLib.Dialog.Frame.Body.defineClass( /////////////////////////////////////////////////////////////////////////////////////////// Tracked ///
    /** @this {myLib.Dialog.Frame.Body.Tracked} */
    function Tracked(target, parent) {
        this.extends(myLib);

        // Properties

        this.defineProperty('target', target);
        this.defineProperty('classList_origin', target.getAttribute('class').trim().split(/\s+/));
        this.defineProperty('classList_extensions', parent.classList_extensions);

        // Initialization

        let this_classList_origin = [];
        this.classList_origin.forEach(this_className_origin => {
            if (this_className_origin.startsWith('my-')) {
                this_classList_origin.push(this_className_origin);
            } else {
                parent.classList_origin.forEachInherited(parent_className_origin => {
                    this_classList_origin.push(`${parent_className_origin}-content-${this_className_origin}`);
                });

                parent.classList_custom.forEach(parent_className_custom => {
                    this_classList_origin.push(`${parent_className_custom}-content-${this_className_origin}`);
                });
            }
        });

        this.classList_origin = this_classList_origin;
        this.update();
    },

    // Extends
    myLib,

    // Methods
    {
        /** @this {myLib.Dialog.Frame.Body.Tracked.prototype} */
        update() {
            this.target.className = [
                ...this.classList_origin,
                ...this.classList_extensions.map(extension =>
                    this.classList_origin.map(className => `${className}-${extension}`).join(' '))
            ].join(' ');

            return this;
        }
    }
);

myLib.Dialog.Frame.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Close ///
    /** @this {myLib.Dialog.Frame.Close} */
    function Close() {
        this.extends(myLib.Element.HTML.Div)
            .mixin(myLib.Touch);
    },

    // Static
    {
        className: 'close'
    },

    // Extends
    myLib.Element.HTML.Div,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Dialog.Frame.Close.prototype} */
        onTap() {
            this.parent.parent.remove(true);
            return true;
        }
    }
);

myLib.Dialog.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Head ///
    /** @this {myLib.Dialog.Head} */
    function Head() {
        this.extends(myLib);

        // Initialization

        this.defineProperty('script', new myLib.Element.HTML.Script());
        this.defineProperty('style', new myLib.Element.HTML.Style());
    },

    // Extends
    myLib,

    // Methods
    {
        /** @this {myLib.Dialog.Head.prototype} */
        append() {
            this.script.append();
            this.style.append();

            return this;
        },

        /** @this {myLib.Dialog.Head.prototype} */
        remove() {
            this.script.remove();
            this.style.remove();

            return this;
        }
    }
);

myLib.Dialog.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Load ///
    /** @this {myLib.Dialog.Load} */
    function Load() {
        this.extends(myLib.Element.HTML.Div);
    },

    // Static
    {
        className: 'load'
    },

    // Extends
    myLib.Element.HTML.Div
);