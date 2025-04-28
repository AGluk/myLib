// #include <./AJAX.js>
// #include <./Layer.js>
// #include <./Map.js>
// #include <./Scroll.js>

'use strict';

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Page ///
    /** @this {myLib.Page} */
    function Page(...args) {
        if (/[A-Z]+/.test(args[0])) {
            myLib.Layer.call(this, args[1], args[0]);
        } else {
            myLib.Layer.call(this, args[0]);
        }

        // Children

        this.defineChild('background', new myLib.Page.Background());
        this.defineChild('load', new myLib.Page.Load());
        this.defineChild('body', new myLib.Page.Body());
        this.defineChild('menu', new myLib.Page.Menu());

        // Initialization

        this.defineProperty('head', new myLib.Page.Head);

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());

        this.defineProperty('section', undefined);
        this.defineProperty('sections', new myLib.Map());

        this.defineProperty('content_AJAX', undefined);
        this.defineProperty('script_AJAX', undefined);
        this.defineProperty('style_AJAX', undefined);
    },

    // Extends
    myLib.Layer,
    {
        className: {
            /** @this {myLib.Page.prototype} */
            get() {
                return this.target.className.match(/(^| )page( (.+))?$/)[3] || '';
            },

            /** @this {myLib.Page.prototype} */
            set(className) {
                if (this.target.className === '') {
                    if (document.body.clientWidth < 700) {
                        myLib.Layer.proto('className').set(this, `page linear ${className.trimStart()}`);
                    } else {
                        myLib.Layer.proto('className').set(this, `page tabbed ${className.trimStart()}`);
                    }
                } else {
                    this.target.className = this.target.className.replace(/((^| )page (linear|tabbed)).*$/,
                        `$1 ${className.trim()}`.trimEnd());
                }
            }
        },

        /** @this {myLib.Page.prototype} */
        append(...args) {
            this.head.append();
            return myLib.Layer.proto('append').apply(this, args);
        },

        /** @this {myLib.Page.prototype} */
        remove(...args) {
            this.head.remove();
            return myLib.Layer.proto('remove').apply(this, args);
        },

        /** @this {myLib.Page.prototype} */
        onOrientationChange() {
            location.reload();
        },

        /** @this {myLib.Page.prototype} */
        onResize() {
            this.body.style.paddingTop = this.menu.offsetHeight;
            if (this.className === 'linear')
                this.body.vscroll.style.top = this.menu.offsetHeight;
        },

        /** @this {myLib.Page.prototype} */
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
                    this.body.onKeyDown(code, key, modifiers);
                    return true;
            }
        },
    },

    // Methods
    {
        /** @this {myLib.Page.prototype} */
        scrollBy(dX, dY) {
            this.body.scrollBy(dX, dY);
            return this;
        },

        /** @this {myLib.Page.prototype} */
        scrollTo(left, top, duration, callback) {
            this.body.scrollTo(left, top, 1, duration, callback);
            return this;
        },

        /** @this {myLib.Page.prototype} */
        setSection(id, duration) {
            this.section = this.sections[id];
            if (this.section !== undefined) {
                if (this.classList.contains('linear')) {
                    for (const section of this.sections) {
                        if (section === this.section) {
                            this.scrollTo(section.body.offsetLeft, section.body.offsetTop, duration);
                            return this;
                        }
                    }

                    return this;
                } else if (this.classList.contains('tabbed')) {
                    for (const section of this.sections) {
                        if (section === this.section) {
                            section.menu.className = 'item current';
                            section.body.style.removeProperty('display');
                            section.body.style.opacity = '0';
                        } else {
                            section.menu.className = 'item';
                            section.body.style.display = 'none';
                            section.body.style.opacity = '0';
                        }
                    }

                    this.resize();
                    this.scrollTo(0, 0);

                    this.section.body.style.removeProperty('opacity');
                    return this;
                }
            }
        },

        /** @this {myLib.Page.prototype} */
        setSrc(src, section) {
            if (this.content_AJAX !== undefined)
                this.content_AJAX.abort();

            if (this.script_AJAX !== undefined)
                this.script_AJAX.abort();

            if (this.style_AJAX !== undefined)
                this.style_AJAX.abort();

            this.menu.remove().hide();
            this.body.remove().hide();
            this.load.show();

            let count = 3, body, script, style,
                onLoaded = () => {
                    this.head.style.innerHTML = style;
                    this.head.script.innerHTML = script;

                    this.body.innerHTML = body;
                    this.elements = this.body.elements;
                    this.forms = this.body.forms;

                    this.sections = new myLib.Map();
                    this.menu.sections.removeChildren();
                    for (let id in this.body.sections) {
                        let item = new myLib.Element.HTML.Div('item');
                        item.innerHTML = this.body.sections[id].getAttribute('data-title');
                        item.setAttribute('data-href', id);
                        this.menu.sections.appendChild(item);

                        this.sections[id] = {
                            body: /** @type {HTMLDivElement} */(this.body.sections[id]),
                            menu: item.target
                        };
                    }

                    this.section = this.sections[section] || this.sections[0];
                    if (this.classList.contains('linear')) {
                        this.menu.append();
                        this.body.append();

                        if (myLib.Page.onLoaded !== undefined) {
                            myLib.Page.onLoaded.call(this);
                            myLib.Page.onLoaded = undefined;
                        }

                        this.resize();
                        this.scrollTo(this.section.body.offsetLeft, this.section.body.offsetTop);

                        this.menu.show();
                        this.body.show();
                        this.load.hide();

                        return;
                    } else if (this.classList.contains('tabbed')) {
                        for (const section of this.sections) {
                            if (section === this.section) {
                                section.menu.className = 'item current';
                                section.body.style.removeProperty('display');
                                section.body.style.removeProperty('opacity');
                                this.section = section;
                            } else {
                                section.menu.className = 'item';
                                section.body.style.display = 'none';
                                section.body.style.opacity = '0';
                            }
                        }

                        this.menu.append();
                        this.body.append();

                        if (myLib.Page.onLoaded !== undefined) {
                            myLib.Page.onLoaded.call(this);
                            myLib.Page.onLoaded = undefined;
                        }

                        this.resize();
                        this.scrollTo(0, 0);

                        this.menu.show();
                        this.body.show();
                        this.load.hide();

                        return;
                    }
                };

            this.content_AJAX = myLib.AJAX.get(`getPage.php?src=${src}&class=${this.className}`, AJAX => {
                this.content_AJAX = undefined;
                body = AJAX.responseText;
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
    LINEAR: 'linear',
    TABBED: 'tabbed'
}).static({
    onLoaded: undefined
}, true);

myLib.Page.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////// Background ///
    /** @this {myLib.Page.Background} */
    function Background() {
        myLib.Element.HTML.Div.call(this, 'background');
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Body ///
    /** @this {myLib.Page.Body} */
    function Body() {
        myLib.Scroll.call(this, 'body');

        // Initialization

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());
        this.defineProperty('sections', new myLib.Map());

        this.remove().hide();
    },

    // Extends
    myLib.Scroll,
    {
        innerHTML: {
            /** @this {myLib.Page.Body.prototype} */
            get() {
                return this.content.target.innerHTML;
            },

            /** @this {myLib.Page.Body.prototype} */
            set(innerHTML) {
                this.content.target.innerHTML = innerHTML;

                this.elements = new myLib.Map();
                this.forms = new myLib.Map();
                this.sections = new myLib.Map();

                this.iterateDOM(child => {
                    switch (child.nodeName) {
                        case 'FORM':
                            if (child.hasAttribute('name'))
                                this.forms[child.getAttribute('name')] = child;

                            return false;
                        default:
                            if (child.hasAttribute('id')) {
                                if (child.className === 'section') {
                                    this.sections[child.getAttribute('id')] = child;
                                } else {
                                    this.elements[child.getAttribute('id')] = child;
                                }
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

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Head ///
    /** @this {myLib.Page.Head} */
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
        /** @this {myLib.Page.Head.prototype} */
        append() {
            this.script.append();
            this.style.append();

            return this;
        },

        /** @this {myLib.Page.Head.prototype} */
        remove() {
            this.script.remove();
            this.style.remove();

            return this;
        }
    }
);

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Load ///
    /** @this {myLib.Page.Load} */
    function Load() {
        myLib.Element.HTML.Image.call(this, 'load');
        this.src = './images/load.svg';
    },

    // Extends
    myLib.Element.HTML.Image
);

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Menu ///
    /** @this {myLib.Page.Menu} */
    function Menu() {
        myLib.Element.HTML.Div.call(this, 'menu');
        myLib.Touch.call(this);

        // Children

        this.defineChild('sections', new myLib.Page.Menu.Sections());

        // Initialization

        this.remove().hide();
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Page.Menu.prototype} */
        onResize() {
            if (this.offsetWidth < this.parent.clientWidth) {
                this.style.left = (this.parent.clientWidth - this.offsetWidth) / 2;
            } else {
                this.style.left = 0;
            }
        }
    },

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Page.Menu.prototype} */
        onTap(target) {
            if (target.hasAttribute('data-href'))
                this.parent.setSection(target.getAttribute('data-href'), 800);

            return true;
        }
    }
);

myLib.Page.Menu.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// Sections ///
    /** @this {myLib.Page.Menu.Sections} */
    function Sections() {
        myLib.Scroll.call(this, 'sections');
    },

    // Extends
    myLib.Scroll
);