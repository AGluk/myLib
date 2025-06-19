// #include <./AJAX.js>
// #include <./Layer.js>
// #include <./List.js>
// #include <./Map.js>
// #include <./Scroll.js>

'use strict';

myLib.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////////////// Page ///
    /** @this {myLib.Page} */
    function Page(...args) {
        this.extends(myLib.Layer, args);

        // Children

        this.defineChild('background', new myLib.Page.Background());
        this.defineChild('load', new myLib.Page.Load());
        this.defineChild('body', new myLib.Page.Body());
        this.defineChild('menu', new myLib.Page.Menu());

        // Properties

        this.defineProperty('head', new myLib.Page.Head);

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());

        this.defineProperty('section', undefined);
        this.defineProperty('sections', new myLib.Map());

        this.defineProperty('content_AJAX', undefined);
        this.defineProperty('script_AJAX', undefined);
        this.defineProperty('style_AJAX', undefined);

        // Initialization

        if (window.innerWidth < 700) {
            this.addExtendedClassNames('linear');
            this.defineProperty('type', 'linear');
        } else {
            this.addExtendedClassNames('tabbed');
            this.defineProperty('type', 'tabbed');
        }
    },

    // Static
    {
        className: 'my-page',
        $onLoaded: undefined
    },

    // Extends
    myLib.Layer,
    {
        /** @this {myLib.Page.prototype} */
        onOrientationChange() {
            location.reload();
        },

        /** @this {myLib.Page.prototype} */
        onResize() {
            this.body.style.paddingTop = this.menu.offsetHeight;
            if (this.type === 'linear')
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

        /** @this {myLib.Page.prototype} */
        append(...args) {
            this.head.append();
            myLib.Layer.proto('append').apply(this, args);
            return this;
        },

        /** @this {myLib.Page.prototype} */
        remove(...args) {
            this.head.remove();
            myLib.Layer.proto('remove').apply(this, args);
            return this;
        },

        /** @this {myLib.Page.prototype} */
        scrollBy(dX, dY) {
            this.body.scrollBy(dX, dY);
            return this;
        },

        /** @this {myLib.Page.prototype} */
        scrollTo(left, top, duration, callback) {
            this.body.scrollTo(left, top, 1, duration, callback);
            return this;
        }
    },

    // Methods
    {
        /** @this {myLib.Page.prototype} */
        setSection(id, duration) {
            this.section = this.sections[id];
            if (this.section !== undefined) {
                if (this.type === 'linear') {
                    for (const section of this.sections) {
                        if (section === this.section) {
                            this.scrollTo(section.body.offsetLeft, section.body.offsetTop, duration);
                            return this;
                        }
                    }

                    return this;
                } else if (this.type === 'tabbed') {
                    for (const section of this.sections) {
                        if (section === this.section) {
                            section.menu.addExtendedClassNames('current');
                            section.body.style.removeProperty('display');
                            section.body.style.opacity = 0;
                        } else {
                            section.menu.remExtendedClassNames('current');
                            section.body.style.display = 'none';
                            section.body.style.opacity = 0;
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
            src = src.match(/^(https?:\/\/.*?\/)?(.*)/i).map(match => match || '');

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
                        let item = new myLib.Page.Menu.Sections.Item();
                        item.innerHTML = this.body.sections[id].getAttribute('data-title');
                        item.setAttribute('data-href', id);
                        this.menu.sections.appendChild(item);

                        this.sections[id] = {
                            body: this.body.sections[id],
                            menu: item
                        };
                    }

                    this.section = this.sections[section] || this.sections[0];

                    if (this.type === 'linear') {
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
                    } else if (this.type = 'tabbed') {
                        for (const section of this.sections) {
                            if (section === this.section) {
                                section.menu.addExtendedClassNames('current');
                                section.body.style.removeProperty('display');
                                section.body.style.removeProperty('opacity');
                                this.section = section;
                            } else {
                                section.menu.remExtendedClassNames('current');;
                                section.body.style.display = 'none';
                                section.body.style.opacity = 0;
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

            this.content_AJAX = myLib.AJAX.get(`${src[1]}getPage.php?src=${src[2]}`, AJAX => {
                this.content_AJAX = undefined;
                body = AJAX.responseText;
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

myLib.Page.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////// Background ///
    /** @this {myLib.Page.Background} */
    function Background() {
        this.extends(myLib.Element.HTML.Div);
    },

    // Static
    {
        className: 'background'
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Body ///
    /** @this {myLib.Page.Body} */
    function Body() {
        this.extends(myLib.Scroll);

        // Initialization

        this.defineProperty('elements', new myLib.Map());
        this.defineProperty('forms', new myLib.Map());
        this.defineProperty('sections', new myLib.Map());
        this.defineProperty('tracked', new myLib.List());

        this.remove().hide();
    },

    // Static
    {
        className: 'body'
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
                this.tracked = new myLib.List();

                for (const section of this.content.target.children) {
                    this.sections[section.getAttribute('id')] = new myLib.Page.Body.Section(section).init(this.content);
                    this.sections[section.getAttribute('id')].iterateDOM(child => {
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
                                    this.tracked.add(new myLib.Page.Body.Tracked(child, this.sections[section.getAttribute('id')]));

                                return true;
                        }
                    });
                }
            }
        },

        /** @this {myLib.Page.Body.prototype} */
        addExtendedClassNames(extension) {
            myLib.Scroll.proto('addExtendedClassNames').call(this, extension);

            for (const tracked of this.tracked)
                tracked.update();

            return this;
        },

        /** @this {myLib.Page.Body.prototype} */
        remExtendedClassNames(extension) {
            myLib.Scroll.proto('remExtendedClassNames').call(this, extension);

            for (const tracked of this.tracked)
                tracked.update();

            return this;
        }
    }
);

myLib.Page.Body.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Section ///
    /** @this {myLib.Page.Body.Section} */
    function Section(target) {
        this.extends(myLib.Element.HTML.Div, [target]);
    },

    // Extends
    myLib.Element.HTML.Div,

    // Methods
    {
        /** @this {myLib.Page.Body.Section.prototype} */
        init(parent) {
            this.parent = parent;
            parent.children.push(this);

            let page_classList = parent.parent.parent.classList_custom;
            if (page_classList.length === 0)
                page_classList = parent.parent.parent.classList_origin.inherited;

            page_classList.forEach(page_className => {
                this.classList_origin.push(`${page_className}-section`);
            });

            this.classList_extensions.from(parent.parent.parent.classList_extensions);
            this.className = this.className;

            return this;
        }
    }
);

myLib.Page.Body.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Tracked ///
    /** @this {myLib.Page.Body.Tracked} */
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
                    this_classList_origin.push(`${parent_className_origin}-${this_className_origin}`);
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
        /** @this {myLib.Page.Body.Tracked.prototype} */
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

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Head ///
    /** @this {myLib.Page.Head} */
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
        this.extends(myLib.Element.HTML.Div);
    },

    // Static
    {
        className: 'load'
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Page.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Menu ///
    /** @this {myLib.Page.Menu} */
    function Menu() {
        this.extends(myLib.Element.HTML.Div)
            .mixin(myLib.Touch);

        // Children

        this.defineChild('sections', new myLib.Page.Menu.Sections());

        // Initialization

        this.remove().hide();
    },

    // Static
    {
        className: 'menu'
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
        this.extends(myLib.Scroll);
    },

    // Static
    {
        className: 'sections'
    },

    // Extends
    myLib.Scroll
);

myLib.Page.Menu.Sections.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////// Item ///
    /** @this {myLib.Page.Menu.Sections.Item} */
    function Item() {
        this.extends(myLib.Element.HTML.Div);
    },

    // Static
    {
        className: 'my-page-menu-sections-content-item'
    },

    // Extends
    myLib.Element.HTML.Div
);