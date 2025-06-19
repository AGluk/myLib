// #include <./Element.js>
// #include <./Touch.js>

'use strict';

myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// LayersBox ///
    /** @this {myLib.LayersBox} */
    function LayersBox(...args) {
        this.extends(myLib.Element.HTML.Div, args);

        // Initialization

        this.defineProperty('fixed', this.style.position === 'fixed');

        new ResizeObserver(() => {
            this.resize();
        }).observe(this.target);

        this.target.addEventListener('wheel', (event) => {
            if (this.fixed || event.ctrlKey) {
                event.preventDefault();
            } else {
                event.stopPropagation();
            }
        }, true);
    },

    // Static
    {
        className: 'my-layers-box',
        $default: null
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.LayersBox.prototype} */
        appendChild(child) {
            if (child.parent !== null)
                child.parent.removeChild(child);

            child.style.zIndex = this.children.length;

            this.target.appendChild(child.target);
            this.children.push(child);
            child.parent = this;

            child.layersBox = this;

            child.resize();
            child.onAppend();
            child.show();

            this.fixed && child.focus();

            return child;
        },

        /** @this {myLib.LayersBox.prototype} */
        defineChild(name, child) {
            this.defineProperty(name, child, false);

            child.style.zIndex = this.children.length;

            this.target.appendChild(child.target);
            this.children.push(child);
            child.parent = this;

            const iterate_classList = (/** @type {myLib.Element} */target) => {
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
                    iterate_classList(child);
            }; iterate_classList(child);

            child.layersBox = this;

            child.resize();
            child.onAppend();
            child.show();

            this.fixed && child.focus();

            return child;
        },

        /** @this {myLib.LayersBox.prototype} */
        removeChild(child, ...args) {
            let index = this.children.indexOf(child);
            if (index >= 0) {
                child.onRemove(...args);

                this.target.removeChild(child.target);
                this.children.splice(index, 1);
                child.parent = null;

                child.layersBox = null;
                child.style.removeProperty('zIndex');

                child.hide();

                if (index === this.children.length) {
                    this.fixed && (index > 0) && this.children[index - 1].focus();
                } else {
                    while (index < this.children.length) {
                        this.children[index].style.zIndex = index;
                        index++;
                    }
                }
            }

            return index;
        },

        /** @this {myLib.LayersBox.prototype} */
        removeChildren(...args) {
            for (const child of this.children) {
                child.onRemove(...args);

                this.target.removeChild(child.target);
                child.parent = null;

                child.layersBox = null;
                child.style.removeProperty('zIndex');

                child.hide();
            }

            this.children = [];
            return this;
        },

        /** @this {myLib.LayersBox.prototype} */
        insertBefore(child, ref_child) {
            let index = this.children.indexOf(ref_child);
            if (index >= 0) {
                if (child.parent !== null)
                    child.parent.removeChild(child);

                this.target.insertBefore(child.target, ref_child.target);
                this.children.splice(index, 0, child);
                child.parent = this;

                child.layersBox = this;

                child.resize();
                child.onAppend();
                child.show();

                while (index < this.children.length) {
                    this.children[index].style.zIndex = index;
                    index++;
                }
            }

            return child;
        },

        /** @this {myLib.LayersBox.prototype} */
        replaceChild(child, ref_child) {
            let index = this.children.indexOf(ref_child);
            if (index >= 0) {
                if (child.parent !== null)
                    child.parent.removeChild(child);

                child.style.zIndex = index;

                this.target.replaceChild(child.target, ref_child.target);
                this.children.splice(index, 1, child);

                child.parent = this;
                ref_child.parent = null;

                child.layersBox = this;

                child.resize();
                child.onAppend();
                child.show();

                this.fixed && (index === (this.children.length - 1)) && this.children[index].focus();
            }

            return child;
        }
    },

    // Methods
    {
        /** @this {myLib.LayersBox.prototype} */
        appendToBody() {
            myLib.LayersBox.default = this;
            document.body.appendChild(this.target);
            this.fixed = true;

            return this;
        }
    }
);

myLib.LayersBox.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.LayersBox.CSSStyle} */
    function CSSStyle(target) {
        myLib.Element.HTML.CSSStyle.call(this, target);
    },

    // Extends
    myLib.Element.HTML.CSSStyle,

    // Accessors
    {
       position: {
            /** @this {myLib.LayersBox.CSSStyle.prototype} */
            get() {
                return this.target_get.position;
            },

            /** @this {myLib.LayersBox.CSSStyle.prototype} */
            set(position) {
                this.target_set.position = position;
                this.target.fixed = this.target_get.position === 'fixed';
            }
        },
    },

    // Methods
    {
        /** @this {myLib.LayersBox.CSSStyle.prototype} */
        removeProperty(property) {
            this.target_set.removeProperty(property);
            this.target.fixed = this.target_get.position === 'fixed';
            return this;
        }
    }
);

myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////////// Layer ///
    /** @this {myLib.Layer} */
    function Layer(...args) {
        this.extends(myLib.Element.HTML.Div, args)
            .mixin(myLib.Touch);

        // Properties

        this.defineProperty('layersBox', null);

        // Initialization

        this.tabIndex = 0;
        this.hide();
    },

    // Static
    {
        className: 'my-layer'
    },

    // Extends
    myLib.Element.HTML.Div,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Layer.prototype} */
        onTap() {
            this.focus();
            return true;
        }
    },

    // Methods
    {
         /** @this {myLib.Layer.prototype} */
         append(layersBox, focus = false) {
            if (layersBox !== undefined) {
                layersBox.appendChild(this);
                (layersBox.fixed || focus) && this.focus();
            } else {
                myLib.LayersBox.default.appendChild(this);
                this.focus();
            }

            return this;
        },

        /** @this {myLib.Layer.prototype} */
        remove(...args) {
            if (this.layersBox !== null)
                this.layersBox.removeChild(this, ...args);

            return this;
        }
    }
);