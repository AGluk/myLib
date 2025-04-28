// #include <./AJAX.js>
// #include <./Layer.js>
// #include <./Scroll.js>

'use strict';

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// Dialog ///
    /** @this {myLib.Dialog} */
    function Dialog(...args) {
        if (/[A-Z]+/.test(args[0])) {
            myLib.Layer.call(this, args[1], args[0]);
        } else {
            myLib.Layer.call(this, args[0]);
        }

        // Children

        this.defineChild('load', new myLib.Dialog.Load());
        this.defineChild('frame', new myLib.Dialog.Frame());

        // Initialization

        this.defineProperty('head', new myLib.Dialog.Head);
        this.defineProperty('data', new myLib.Map());
        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());

        this.defineProperty('content_AJAX', undefined);
        this.defineProperty('script_AJAX', undefined);
        this.defineProperty('style_AJAX', undefined);

        this.defineProperty('modal_', false);
    },

    // Extends
    myLib.Layer,
    {
        className: {
            /** @this {myLib.Dialog.prototype} */
            get() {
                return this.target.className.match(/(^| )dialog( (.+))?$/)[3] || '';
            },

            /** @this {myLib.Dialog.prototype} */
            set(className) {
                myLib.Layer.proto('className').set(this, `dialog ${className.trimStart()}`);
            }
        },

        /** @this {myLib.Dialog.prototype} */
        append(modal = false, ...args) {
            this.modal = modal;
            this.head.append();
            return myLib.Layer.proto('append').apply(this, args);
        },

        /** @this {myLib.Dialog.prototype} */
        remove(...args) {
            this.head.remove();
            return myLib.Layer.proto('remove').apply(this, args);
        },

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
                    if (!this.modal) {
                        this.remove();
                    } else {
                        this.focus();
                    }

                    return true;
            }
        },

        /** @this {myLib.Dialog.prototype} */
        onTap(target) {
            if (!this.modal && (target === this.target)) {
                this.remove();
            } else {
                this.focus();
            }

            return true;
        }
    },

    // Accessors
    {
        modal: {
            /** @this {myLib.Dialog.prototype} */
            get() {
                return this.modal_;
            },

            /** @this {myLib.Dialog.prototype} */
            set(modal) {
                if (modal) {
                    this.frame.close.style.display = 'none';
                } else {
                    this.frame.close.style.removeProperty('display');
                }

                this.modal_ = modal;
            }
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

            this.head.script.innerHTML = '';
            this.head.style.innerHTML = '';

            this.frame.head.innerHTML = '';
            this.frame.head.remove();

            this.frame.body.innerHTML = '';
            this.frame.body.remove();

            this.elements = this.frame.body.elements = new myLib.Map();
            this.forms = this.frame.body.forms = new myLib.Map();

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

                    this.onLoaded();
                    if (myLib.Dialog.onLoaded !== undefined) {
                        myLib.Dialog.onLoaded.call(this);
                        myLib.Dialog.onLoaded = undefined;
                    }

                    this.frame.resize();
                    this.frame.show();
                    this.load.hide();
                };

            this.content_AJAX = myLib.AJAX.get(`getPage.php?src=${src}&class=${this.className}`, AJAX => {
                this.content_AJAX = undefined;
                content = AJAX.responseText;
                if (--count === 0) onLoaded();
            });

            this.style_AJAX = myLib.AJAX.get(`getStyle.php?src=${src}`, AJAX => {
                this.style_AJAX = undefined;
                style = AJAX.responseText;
                if (--count === 0) onLoaded();
            });

            this.script_AJAX = myLib.AJAX.get(`getScript.php?src=${src}`, AJAX => {
                this.script_AJAX = undefined;
                script = AJAX.responseText;
                if (--count === 0) onLoaded();
            });

            return this;
        }
    }
).static({
    onLoaded: undefined
}, true);

myLib.Dialog.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////// Frame ///
    /** @this {myLib.Dialog.Frame} */
    function Frame() {
        myLib.Element.HTML.Div.call(this, 'frame');

        // Children

        this.defineChild('head', new myLib.Dialog.Frame.Head());
        this.defineChild('body', new myLib.Dialog.Frame.Body());
        this.defineChild('close', new myLib.Dialog.Frame.Close());

        // Initialization

        this.style.top = 0;
        this.style.left = 0;

        this.remove().hide();
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
        myLib.Element.HTML.Div.call(this, 'head');
        myLib.Touch.call(this);
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
        myLib.Scroll.call(this, 'body');

        // Initialization

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());
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

                            return true;
                    }
                });
            }
        }
    }
);

myLib.Dialog.Frame.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Close ///
    /** @this {myLib.Dialog.Frame.Close} */
    function Close() {
        myLib.Element.HTML.Div.call(this, 'close');
        myLib.Touch.call(this);
    },

    // Extends
    myLib.Element.HTML.Div,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Dialog.Frame.Close.prototype} */
        onTap() {
            this.parent.parent.remove();
            return true;
        }
    }
);

myLib.Dialog.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Head ///
    /** @this {myLib.Dialog.Head} */
    function Head() {
        myLib.call(this);

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
        myLib.Element.HTML.Image.call(this, 'load');
        this.src = './images/load.svg';
    },

    // Extends
    myLib.Element.HTML.Image
);