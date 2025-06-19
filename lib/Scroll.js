// #include <./Element.js>
// #include <./Animation.js>
// #include <./Touch.js>

'use strict';

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// Scroll ///
    /** @this {myLib.Scroll} */
    function Scroll(...args) {
        this.extends(myLib.Element.HTML.Div, args)
            .mixin(myLib.Animation)
            .mixin(myLib.Touch);

        // Children

        myLib.Element.HTML.Div.proto('defineChild').call(this, 'content', new myLib.Scroll.Content());
        myLib.Element.HTML.Div.proto('defineChild').call(this, 'hscroll', new myLib.Scroll.Horizontal());
        myLib.Element.HTML.Div.proto('defineChild').call(this, 'vscroll', new myLib.Scroll.Vertical());

        // Initialization

        this.defineProperty('scrollTop_', new myLib.Animation.Property(0));
        this.defineProperty('scrollLeft_', new myLib.Animation.Property(0));
        this.defineProperty('zoom_', new myLib.Animation.Property(1));

        this.defineProperty('content_offsetWidth', 0);
        this.defineProperty('content_offsetHeight', 0);
        this.defineProperty('inertial', true);

        this.defineProperty('vX', 0);
        this.defineProperty('vY', 0);
    },

    // Static
    {
        className: 'my-scroll'
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        innerHTML: {
            /** @this {myLib.Scroll.prototype} */
            get() {
                return this.content.target.innerHTML;
            },

            /** @this {myLib.Scroll.prototype} */
            set(innerHTML) {
                this.content.target.innerHTML = innerHTML;
            }
        },

        /** @this {myLib.Scroll.prototype} */
        appendChild(child) {
            return this.content.appendChild(child);
        },

        /** @this {myLib.Scroll.prototype} */
        defineChild(name, child) {
            this.defineProperty(name, child, false);
            return this.content.defineChild(name, child);
        },

        /** @this {myLib.Scroll.prototype} */
        removeChild(child, ...args) {
            return this.content.removeChild(child, ...args);
        },

        /** @this {myLib.Scroll.prototype} */
        removeChildren(...args) {
            this.content.removeChildren(...args);
            return this;
        },

        /** @this {myLib.Scroll.prototype} */
        insertBefore(child, ref_child) {
            return this.content.insertBefore(child, ref_child);
        },

        /** @this {myLib.Scroll.prototype} */
        replaceChild(child, ref_child) {
            this.content.replaceChild(child, ref_child);
            return child;
        },

        /** @this {myLib.Scroll.prototype} */
        iterateDOM(callback, element) {
            this.content.iterateDOM(callback, element);
        },

        /** @this {myLib.Scroll.prototype} */
        onResize(capture) {
            if (capture) {
                this.style.update();

                this.content_offsetWidth = this.content.offsetWidth;
                this.content_offsetHeight = this.content.offsetHeight;

                return true;
            } else {
                if ((this.content_offsetWidth !== 0) && (this.content_offsetHeight !== 0)) {
                    this.scrollLeft += (this.content.offsetWidth - this.content_offsetWidth)
                        * (this.scrollLeft + this.touch.layerX - this.style.paddingLeft) / this.content_offsetWidth;

                    this.scrollTop += (this.content.offsetHeight - this.content_offsetHeight)
                        * (this.scrollTop + this.touch.layerY - this.style.paddingTop) / this.content_offsetHeight;
                }

                if (this.style.width < this.content.offsetWidth) {
                    this.content.style.left = 0;

                    if (this.scrollLeft < 0) {
                        this.scrollLeft = 0;
                    } else if (this.scrollLeft > this.content.offsetWidth - this.style.width) {
                        this.scrollLeft = this.content.offsetWidth - this.style.width;
                    }

                    this.hscroll.set(
                        this.scrollLeft / this.content.offsetWidth,
                        (this.scrollLeft + this.style.width) / this.content.offsetWidth
                    ).append();
                } else {
                    let left = (this.style.width - this.content.offsetWidth - this.style.paddingLeft) / 2;
                    if (left < 0) left = 0;

                    this.content.style.left = left;
                    this.scrollLeft = 0;

                    this.hscroll.set(0, 1).remove();
                }

                if (this.style.height < this.content.offsetHeight) {
                    this.content.style.top = 0;

                    if (this.scrollTop < 0) {
                        this.scrollTop = 0;
                    } else if (this.scrollTop > this.content.offsetHeight - this.style.height) {
                        this.scrollTop = this.content.offsetHeight - this.style.height;
                    }

                    this.vscroll.set(
                        this.scrollTop / this.content.offsetHeight,
                        (this.scrollTop + this.style.height) / this.content.offsetHeight
                    ).append();
                } else {
                    let top = (this.style.height - this.content.offsetHeight - this.style.paddingTop) / 2;
                    if (top < 0) top = 0;

                    this.content.style.top = top;
                    this.scrollTop = 0;

                    this.vscroll.set(0, 1).remove();
                }

                this.content.translate(-this.scrollLeft, -this.scrollTop);
                this.onScroll(this.scrollLeft, this.scrollTop, this.zoom);
            }
        }
    },

    // Mixin
    myLib.Animation,
    {
        /** @this {myLib.Scroll.prototype} */
        onAnimationStart(name) {
            switch (name) {
                case 'inertial':
                    if ((this.vX === 0) && (this.vY === 0)) {
                        this.hscroll.hide(300);
                        this.vscroll.hide(300);

                        return true;
                    }
                case 'scroll':
                    this.zoom_.onAnimationStart();
                    this.scrollLeft_.onAnimationStart();
                    this.scrollTop_.onAnimationStart();

                    this.hscroll.show();
                    this.vscroll.show();

                    return;
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onAnimationFrame(dt, f, name) {
            switch (name) {
                case 'inertial':
                    let v = Math.sqrt(this.vX * this.vX + this.vY * this.vY),
                        vX = this.vX / v,
                        vY = this.vY / v;

                    v -= dt * (v + 0.1) / 1000;
                    if (v < 0) v = 0;

                    vX *= v;
                    vY *= v;

                    let scrollTop = this.scrollTop,
                        scrollLeft = this.scrollLeft;

                    this.scrollBy(dt * (this.vX + vX) / 2, dt * (this.vY + vY) / 2);

                    this.vX = vX;
                    this.vY = vY;

                    return ((this.vX === 0) && (this.vY === 0)) || ((this.scrollTop === scrollTop) && (this.scrollLeft === scrollLeft));
                case 'scroll':
                    if (this.zoom_.value !== this.zoom_.value_1) {
                        this.zoom_.onAnimationFrame(f);
                        this.resize();
                    }

                    this.scrollLeft_.onAnimationFrame(f);
                    this.hscroll.set(
                        this.scrollLeft / this.content.offsetWidth,
                        (this.scrollLeft + this.style.width) / this.content.offsetWidth
                    );

                    this.scrollTop_.onAnimationFrame(f);
                    this.vscroll.set(
                        this.scrollTop / this.content.offsetHeight,
                        (this.scrollTop + this.style.height) / this.content.offsetHeight
                    );

                    this.content.translate(-this.scrollLeft, -this.scrollTop);
                    this.onScroll(this.scrollLeft, this.scrollTop, this.zoom);

                    return;
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onAnimationEnd(name) {
            this.hscroll.hide(300);
            this.vscroll.hide(300);

            switch (name) {
                case 'scroll':
                    this.zoom_.onAnimationEnd();
                    this.scrollLeft_.onAnimationEnd();
                    this.scrollTop_.onAnimationEnd();

                    return;
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onAnimationBreak(name) {
            switch (name) {
                case 'scroll':
                    this.zoom_.onAnimationBreak();
                    this.scrollLeft_.onAnimationBreak();
                    this.scrollTop_.onAnimationBreak();

                    return;
            }
        }
    },

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Scroll.prototype} */
        onFocus(target) {
            let parentRect = this.content.getBoundingClientRect(),
                targetRect = target.getBoundingClientRect(),
                scrollTop_max = targetRect.top - parentRect.top - 20,
                scrollTop_min = targetRect.bottom - parentRect.top - this.clientHeight + 20,
                scrollLeft_max = targetRect.left - parentRect.left - 20,
                scrollLeft_min = targetRect.right - parentRect.left - this.clientWidth + 20;

            if (this.scrollTop < scrollTop_min) {
                if (this.scrollLeft < scrollLeft_min) {
                    this.scrollTo(scrollLeft_min, scrollTop_min, 1, 200);
                } else if (this.scrollLeft > scrollLeft_max) {
                    this.scrollTo(scrollLeft_max, scrollTop_min, 1, 200);
                } else {
                    this.scrollTo(this.scrollLeft, scrollTop_min, 1, 200);
                }
            } else if (this.scrollTop > scrollTop_max) {
                if (this.scrollLeft < scrollLeft_min) {
                    this.scrollTo(scrollLeft_min, scrollTop_max, 1, 200);
                } else if (this.scrollLeft > scrollLeft_max) {
                    this.scrollTo(scrollLeft_max, scrollTop_max, 1, 200);
                } else {
                    this.scrollTo(this.scrollLeft, scrollTop_max, 1, 200);
                }
            } else {
                if (this.scrollLeft < scrollLeft_min) {
                    this.scrollTo(scrollLeft_min, this.scrollTop, 1, 200);
                } else if (this.scrollLeft > scrollLeft_max) {
                    this.scrollTo(scrollLeft_max, this.scrollTop, 1, 200);
                }
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onKeyDown(code, key, modifiers) {
            switch (code) {
                case 'ArrowDown':
                    if (modifiers.meta) {
                        this.scrollTo(this.scrollLeft, Infinity, this.zoom, 500);
                    } else {
                        this.scrollTo(this.scrollLeft, this.scrollTop + this.style.height / 5, this.zoom, 500);
                    }

                    return true;
                case 'ArrowLeft':
                    if (modifiers.meta) {
                        this.scrollTo(0, this.scrollTop, this.zoom, 500);
                    } else {
                        this.scrollTo(this.scrollLeft - this.style.width / 5, this.scrollTop, this.zoom, 500);
                    }

                    return true;
                case 'ArrowRight':
                    if (modifiers.meta) {
                        this.scrollTo(Infinity, this.scrollTop, this.zoom, 500);
                    } else {
                        this.scrollTo(this.scrollLeft + this.style.width / 5, this.scrollTop, this.zoom, 500);
                    }

                    return true;
                case 'ArrowUp':
                    if (modifiers.meta) {
                        this.scrollTo(this.scrollLeft, 0, this.zoom, 500);
                    } else {
                        this.scrollTo(this.scrollLeft, this.scrollTop - this.style.height / 5, this.zoom, 500);
                    }

                    return true;
                case 'End':
                    this.scrollTo(this.scrollLeft, Infinity, this.zoom, 500);
                    return true;
                case 'Home':
                    this.scrollTo(0, 0, this.zoom, 500);
                    return true;
                case 'PageDown':
                    this.scrollTo(this.scrollLeft, this.scrollTop + 0.9 * this.style.height, this.zoom, 500);
                    return true;
                case 'PageUp':
                    this.scrollTo(this.scrollLeft, this.scrollTop - 0.9 * this.style.height, this.zoom, 500);
                    return true;
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onTouchStart(target) {
            this.animationBreak();

            switch (target) {
                case this.hscroll.target:
                    this.hscroll.show();
                    this.touch.move = 'hscroll';
                    return true;
                case this.vscroll.target:
                    this.vscroll.show();
                    this.touch.move = 'vscroll';
                    return true;
                default:
                    this.touch.move = 'scroll';
                    return (this.style.width < this.content.offsetWidth) || (this.style.height < this.content.offsetHeight);
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onTouchMove(dX, dY, kR) {
            switch (this.touch.move) {
                case 'hscroll':
                    this.scrollBy(dX * (this.style.width - this.content.offsetWidth) /
                        (this.hscroll.bar.clientWidth - this.hscroll.bar.lever.offsetWidth), 0);

                    return true;
                case 'vscroll':
                    this.scrollBy(0, dY * (this.style.height - this.content.offsetHeight) /
                        (this.vscroll.bar.clientHeight - this.vscroll.bar.lever.offsetHeight));

                    return true;
                case 'scroll':
                    if ((dX !== 0) || (dY !== 0)) {
                        this.hscroll.show();
                        this.vscroll.show();

                        if (kR !== 1) {
                            this.zoom *= kR;
                            this.resize();
                        }

                        this.scrollBy(dX, dY);
                    } else if (kR !== 1) {
                        this.zoom *= kR;
                        this.resize();
                    }

                    return (this.style.width < this.content.offsetWidth) || (this.style.height < this.content.offsetHeight);
                default:
                    this.animationBreak();

                    if ((dX !== 0) || (dY !== 0) || (kR !== 1)) {
                        this.hscroll.show(500);
                        this.vscroll.show(500);

                        if (kR !== 1) {
                            this.zoom *= kR;
                            this.resize();
                        }

                        this.scrollBy(dX, dY);
                    }

                    return (this.style.width < this.content.offsetWidth) || (this.style.height < this.content.offsetHeight);
            }
        },

        /** @this {myLib.Scroll.prototype} */
        onTouchEnd() {
            switch (this.touch.move) {
                case 'hscroll':
                    this.touch.move = undefined;
                    this.hscroll.hide();
                    return true;
                case 'vscroll':
                    this.touch.move = undefined;
                    this.vscroll.hide();
                    return true;
                case 'scroll':
                    this.touch.move = undefined;

                    if (this.inertial) {
                        this.vX = this.touch.vX;
                        this.vY = this.touch.vY;

                        this.animationStart('inertial');
                    } else {
                        this.hscroll.hide(300);
                        this.vscroll.hide(300);
                    }

                    return (this.style.width < this.content.offsetWidth) || (this.style.height < this.content.offsetHeight);
            }
        }
    },

    // Events
    {
        onScroll(scrollLeft, scrollTop, zoom) { }
    },

    // Accessors
    {
        scrollTop: {
            /** @this {myLib.Scroll.prototype} */
            get() {
                return this.scrollTop_.value;
            },

            /** @this {myLib.Scroll.prototype} */
            set(scrollTop) {
                this.scrollTop_.value = scrollTop;
            }
        },

        scrollLeft: {
            /** @this {myLib.Scroll.prototype} */
            get() {
                return this.scrollLeft_.value;
            },

            /** @this {myLib.Scroll.prototype} */
            set(scrollLeft) {
                this.scrollLeft_.value = scrollLeft;
            }
        },

        zoom: {
            /** @this {myLib.Scroll.prototype} */
            get() {
                return this.zoom_.value;
            },

            /** @this {myLib.Scroll.prototype} */
            set(zoom) {
                this.zoom_.value = zoom;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Scroll.prototype} */
        scrollBy(dX, dY) {
            if (this.style.width < this.content.offsetWidth) {
                let left = this.scrollLeft - dX;
                if (left < 0) left = 0;
                else if (left > this.content.offsetWidth - this.style.width) left = this.content.offsetWidth - this.style.width;

                this.scrollLeft = left;
                this.hscroll.set(
                    this.scrollLeft / this.content.offsetWidth,
                    (this.scrollLeft + this.style.width) / this.content.offsetWidth
                );
            } else {
                this.scrollLeft = 0;
                this.hscroll.set(0, 1);
            }

            if (this.style.height < this.content.offsetHeight) {
                let top = this.scrollTop - dY;
                if (top < 0) top = 0;
                else if (top > this.content.offsetHeight - this.style.height) top = this.content.offsetHeight - this.style.height;

                this.scrollTop = top;
                this.vscroll.set(
                    this.scrollTop / this.content.offsetHeight,
                    (this.scrollTop + this.style.height) / this.content.offsetHeight
                );
            } else {
                this.scrollTop = 0;
                this.vscroll.set(0, 1);
            }

            this.content.translate(-this.scrollLeft, -this.scrollTop);
            this.onScroll(this.scrollLeft, this.scrollTop, this.zoom);

            return this;
        },

        /** @this {myLib.Scroll.prototype} */
        scrollTo(left, top, zoom = 1, duration, callback) {
            this.animationBreak('inertial');

            if (this.style.width < this.content.offsetWidth) {
                if (left < 0) left = 0;
                else if (left > this.content.offsetWidth - this.style.width) left = this.content.offsetWidth - this.style.width;
            } else {
                left = 0;
            }

            if (this.style.height < this.content.offsetHeight) {
                if (top < 0) top = 0;
                else if (top > this.content.offsetHeight - this.style.height) top = this.content.offsetHeight - this.style.height;
            } else {
                top = 0;
            }

            if ((left !== this.scrollLeft) || (top !== this.scrollTop) || (zoom !== this.zoom)) {
                if (duration !== undefined) {
                    if (callback !== undefined) {
                        this.onAnimationEnd = function (name) {
                            this.proto('onAnimationEnd').call(name);
                            delete this.onAnimationEnd;
                            callback();
                        };
                    }

                    this.animate(
                        [this.zoom_, zoom],
                        [this.scrollLeft_, left],
                        [this.scrollTop_, top]
                    ) && this.animationStart('scroll', duration, myLib.Animation.softOut);
                } else {
                    if (this.zoom !== zoom) {
                        this.zoom = zoom;
                        this.resize();
                    }

                    this.scrollLeft = left;
                    this.hscroll.set(
                        this.scrollLeft / this.content.offsetWidth,
                        (this.scrollLeft + this.style.width) / this.content.offsetWidth
                    );

                    this.scrollTop = top;
                    this.vscroll.set(
                        this.scrollTop / this.content.offsetHeight,
                        (this.scrollTop + this.style.height) / this.content.offsetHeight
                    );

                    this.content.translate(-this.scrollLeft, -this.scrollTop);
                    this.onScroll(this.scrollLeft, this.scrollTop, this.zoom);
                }
            } else {
                this.onScroll(this.scrollLeft, this.scrollTop, this.zoom);
                if (callback !== undefined)
                    callback();
            }

            return this;
        }
    }
);

myLib.Scroll.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.Scroll.CSSStyle} */
    function CSSStyle(target) {
        this.extends(myLib.Element.HTML.CSSStyle, [target]);

        // Initialization

        this.defineProperty('width_', 0);
        this.defineProperty('height_', 0);

        this.defineProperty('paddingTop_', 0);
        this.defineProperty('paddingLeft_', 0);
        this.defineProperty('paddingRight_', 0);
        this.defineProperty('paddingBottom_', 0);
    },

    // Extends
    myLib.Element.HTML.CSSStyle,
    {
        width: {
            /** @this {myLib.Scroll.CSSStyle.prototype} */
            get() {
                return this.width_;
            },

            /** @this {myLib.Scroll.CSSStyle.prototype} */
            set(width) {
                this.target_set.width = width.toString() + 'px';
                this.width_ = parseFloat(this.target_get.getPropertyValue('width')) || 0;
            }
        },

        height: {
            /** @this {myLib.Scroll.CSSStyle.prototype} */
            get() {
                return this.height_;
            },

            /** @this {myLib.Scroll.CSSStyle.prototype} */
            set(height) {
                this.target_set.height = height.toString() + 'px';
                this.height_ = parseFloat(this.target_get.getPropertyValue('height')) || 0;
            }
        },

        paddingTop: {
            /** @this {myLib.Scroll.CSSStyle.prototype} */
            get() {
                return this.paddingTop_;
            },

            /** @this {myLib.Scroll.CSSStyle.prototype} */
            set(paddingTop) {
                this.target_set.paddingTop = paddingTop.toString() + 'px';
                this.paddingTop_ = parseFloat(this.target_get.getPropertyValue('padding-top')) || 0;
            }
        },

        paddingLeft: {
            /** @this {myLib.Scroll.CSSStyle.prototype} */
            get() {
                return this.paddingLeft_;
            },

            /** @this {myLib.Scroll.CSSStyle.prototype} */
            set(paddingLeft) {
                this.target_set.paddingLeft = paddingLeft.toString() + 'px';
                this.paddingLeft_ = parseFloat(this.target_get.getPropertyValue('padding-left')) || 0;
            }
        },

        paddingRight: {
            /** @this {myLib.Scroll.CSSStyle.prototype} */
            get() {
                return this.paddingRight_;
            },

            /** @this {myLib.Scroll.CSSStyle.prototype} */
            set(paddingRight) {
                this.target_set.paddingRight = paddingRight.toString() + 'px';
                this.paddingRight_ = parseFloat(this.target_get.getPropertyValue('padding-right')) || 0;
            }
        },

        paddingBottom: {
            /** @this {myLib.Scroll.CSSStyle.prototype} */
            get() {
                return this.paddingBottom_;
            },

            /** @this {myLib.Scroll.CSSStyle.prototype} */
            set(paddingBottom) {
                this.target_set.paddingBottom = paddingBottom.toString() + 'px';
                this.paddingBottom_ = parseFloat(this.target_get.getPropertyValue('padding-bottom')) || 0;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Scroll.CSSStyle.prototype} */
        update() {
            this.width_ = parseFloat(this.target_get.getPropertyValue('width')) || 0;
            this.height_ = parseFloat(this.target_get.getPropertyValue('height')) || 0;

            this.paddingTop_ = parseFloat(this.target_get.getPropertyValue('padding-top')) || 0;
            this.paddingLeft_ = parseFloat(this.target_get.getPropertyValue('padding-left')) || 0;
            this.paddingRight_ = parseFloat(this.target_get.getPropertyValue('padding-right')) || 0;
            this.paddingBottom_ = parseFloat(this.target_get.getPropertyValue('padding-bottom')) || 0;

            return this;
        }
    }
);

myLib.Scroll.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////// Content ///
    /** @this {myLib.Scroll.Content} */
    function Content() {
        this.extends(myLib.Element.HTML.Div);

        // Initialization

        this.style.transform = 'translate3d(0,0,0)';
        this.style.transformOrigin = 'top left';

        this.defineProperty('offsetWidth_', 0);
        this.defineProperty('offsetHeight_', 0);
    },

    // Static
    {
        className: 'content'
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Scroll.Content.prototype} */
        onResize(capture) {
            if (capture) {
                return true;
            } else {
                this.style.update();

                this.offsetWidth_ = this.style.paddingLeft_ + this.style.width_ + this.style.paddingRight_;
                this.offsetHeight_ = this.style.paddingTop_ + this.style.height_ + this.style.paddingBottom_;
            }
        }
    },

    // Accessors
    {
        offsetWidth: {
            /** @this {myLib.Scroll.Content.prototype} */
            get() {
                return this.offsetWidth_;
            }
        },

        offsetHeight: {
            /** @this {myLib.Scroll.Content.prototype} */
            get() {
                return this.offsetHeight_;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Scroll.Content.prototype} */
        translate(x, y) {
            this.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0)`;
            return this;
        }
    }
);

myLib.Scroll.Content.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.Scroll.Content.CSSStyle} */
    function CSSStyle(target) {
        this.extends(myLib.Element.HTML.CSSStyle, [target]);

        // Initialization

        this.defineProperty('width_', 0);
        this.defineProperty('height_', 0);

        this.defineProperty('paddingTop_', 0);
        this.defineProperty('paddingLeft_', 0);
        this.defineProperty('paddingRight_', 0);
        this.defineProperty('paddingBottom_', 0);
    },

    // Extends
    myLib.Element.HTML.CSSStyle,

    // Accessors
    {
        width: {
            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            get() {
                return this.width_;
            },

            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            set(width) {
                this.target_set.width = width.toString() + 'px';
                this.width_ = parseFloat(this.target_get.getPropertyValue('width')) || 0;
            }
        },

        height: {
            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            get() {
                return this.height_;
            },

            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            set(height) {
                this.target_set.height = height.toString() + 'px';
                this.height_ = parseFloat(this.target_get.getPropertyValue('height')) || 0;
            }
        },

        paddingTop: {
            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            get() {
                return this.paddingTop_;
            },

            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            set(paddingTop) {
                this.target_set.paddingTop = paddingTop.toString() + 'px';
                this.paddingTop_ = parseFloat(this.target_get.getPropertyValue('padding-top')) || 0;
            }
        },

        paddingLeft: {
            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            get() {
                return this.paddingLeft_;
            },

            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            set(paddingLeft) {
                this.target_set.paddingLeft = paddingLeft.toString() + 'px';
                this.paddingLeft_ = parseFloat(this.target_get.getPropertyValue('padding-left')) || 0;
            }
        },

        paddingRight: {
            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            get() {
                return this.paddingRight_;
            },

            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            set(paddingRight) {
                this.target_set.paddingRight = paddingRight.toString() + 'px';
                this.paddingRight_ = parseFloat(this.target_get.getPropertyValue('padding-right')) || 0;
            }
        },

        paddingBottom: {
            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            get() {
                return this.paddingBottom_;
            },

            /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
            set(paddingBottom) {
                this.target_set.paddingBottom = paddingBottom.toString() + 'px';
                this.paddingBottom_ = parseFloat(this.target_get.getPropertyValue('padding-bottom')) || 0;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Scroll.Content.CSSStyle.prototype} */
        update() {
            this.width_ = parseFloat(this.target_get.getPropertyValue('width')) || 0;
            this.height_ = parseFloat(this.target_get.getPropertyValue('height')) || 0;

            this.paddingTop_ = parseFloat(this.target_get.getPropertyValue('padding-top')) || 0;
            this.paddingLeft_ = parseFloat(this.target_get.getPropertyValue('padding-left')) || 0;
            this.paddingRight_ = parseFloat(this.target_get.getPropertyValue('padding-right')) || 0;
            this.paddingBottom_ = parseFloat(this.target_get.getPropertyValue('padding-bottom')) || 0;

            return this;
        }
    }
);

myLib.Scroll.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Horizontal ///
    /** @this {myLib.Scroll.Horizontal} */
    function Horizontal() {
        this.extends(myLib.Element.HTML.Div);

        // Children

        this.defineChild('bar', new myLib.Scroll.Horizontal.Bar());

        // Initialization

        this.defineProperty('timeout', 0);
        this.remove().hide();
    },

    // Static
    {
        className: 'hscroll'
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Scroll.Horizontal.prototype} */
        hide(timeout) {
            if (this.timeout !== 0)
                clearTimeout(this.timeout);

            if (timeout !== undefined) {
                this.timeout = setTimeout(() => {
                    this.timeout = 0;
                    this.target.style.opacity = '0';
                }, timeout);
            } else {
                this.timeout = 0;
                this.target.style.opacity = '0';
            }

            return this;
        },

        /** @this {myLib.Scroll.Horizontal.prototype} */
        show(timeout) {
            if (this.timeout !== 0)
                clearTimeout(this.timeout);

            if (timeout !== undefined) {
                this.target.style.opacity = '1';
                this.timeout = setTimeout(() => {
                    this.timeout = 0;
                    this.target.style.opacity = '0';
                }, timeout);
            } else {
                this.timeout = 0;
                this.target.style.opacity = '1';
            }

            return this;
        }
    },

    // Methods
    {
        /** @this {myLib.Scroll.Horizontal.prototype} */
        set(left, right) {
            this.bar.lever.style.left = 100 * left;
            this.bar.lever.style.right = 100 * (1 - right);
            return this;
        }
    }
);

myLib.Scroll.Horizontal.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////// Bar ///
    /** @this {myLib.Scroll.Horizontal.Bar} */
    function Bar() {
        this.extends(myLib.Element.HTML.Div);

        // Children

        this.defineChild('lever', new myLib.Scroll.Horizontal.Bar.Lever());
    },

    // Static
    {
        className: 'bar'
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Scroll.Horizontal.Bar.defineClass( ///////////////////////////////////////////////////////////////////////////////////////// Lever ///
    /** @this {myLib.Scroll.Horizontal.Bar.Lever} */
    function Lever() {
        this.extends(myLib.Element.HTML.Div);
    },

    // Static
    {
        className: 'lever'
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Scroll.Horizontal.Bar.Lever.defineClass( //////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle} */
    function CSSStyle(target) {
        this.extends(myLib.Element.HTML.CSSStyle, [target]);
    },

    // Extends
    myLib.Element.HTML.CSSStyle,
    {
        left: {
            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.getPropertyValue('left')) || 0;
            },

            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            set(left) {
                this.target_set.left = left.toString() + '%';
            }
        },

        right: {
            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.getPropertyValue('right')) || 0;
            },

            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            set(right) {
                this.target_set.right = right.toString() + '%';
            }
        }
    }
);

myLib.Scroll.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////// Vertical ///
    /** @this {myLib.Scroll.Vertical} */
    function Vertical() {
        this.extends(myLib.Element.HTML.Div);

        // Children

        this.defineChild('bar', new myLib.Scroll.Vertical.Bar());

        // Initialization

        this.defineProperty('timeout', 0);
        this.remove().hide();
    },

    // Static
    {
        className: 'vscroll'
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Scroll.Vertical.prototype} */
        hide(timeout) {
            if (this.timeout !== 0)
                clearTimeout(this.timeout);

            if (timeout !== undefined) {
                this.timeout = setTimeout(() => {
                    this.timeout = 0;
                    this.target.style.opacity = '0';
                }, timeout);
            } else {
                this.timeout = 0;
                this.target.style.opacity = '0';
            }

            return this;
        },

        /** @this {myLib.Scroll.Vertical.prototype} */
        show(timeout) {
            if (this.timeout !== 0)
                clearTimeout(this.timeout);

            if (timeout !== undefined) {
                this.target.style.opacity = '1';
                this.timeout = setTimeout(() => {
                    this.timeout = 0;
                    this.target.style.opacity = '0';
                }, timeout);
            } else {
                this.timeout = 0;
                this.target.style.opacity = '1';
            }

            return this;
        }
    },

    // Methods
    {
        /** @this {myLib.Scroll.Vertical.prototype} */
        set(top, bottom) {
            this.bar.lever.style.top = 100 * top;
            this.bar.lever.style.bottom = 100 * (1 - bottom);
            return this;
        }
    }
);

myLib.Scroll.Vertical.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Bar ///
    /** @this {myLib.Scroll.Vertical.Bar} */
    function Bar() {
        this.extends(myLib.Element.HTML.Div);

        // Children

        this.defineChild('lever', new myLib.Scroll.Vertical.Bar.Lever());
    },

    // Static
    {
        className: 'bar'
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Scroll.Vertical.Bar.defineClass( /////////////////////////////////////////////////////////////////////////////////////////// Lever ///
    /** @this {myLib.Scroll.Vertical.Bar.Lever} */
    function Lever() {
        this.extends(myLib.Element.HTML.Div);
    },

    // Static
    {
        className: 'lever'
    },

    // Extends
    myLib.Element.HTML.Div
);

myLib.Scroll.Vertical.Bar.Lever.defineClass( ////////////////////////////////////////////////////////////////////////////////// CSSStyle ///
    /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle} */
    function CSSStyle(target) {
        this.extends(myLib.Element.HTML.CSSStyle, [target]);
    },

    // Extends
    myLib.Element.HTML.CSSStyle,
    {
        top: {
            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.getPropertyValue('top')) || 0;
            },

            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            set(left) {
                this.target_set.top = left.toString() + '%';
            }
        },

        bottom: {
            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            get() {
                return parseFloat(this.target_get.getPropertyValue('bottom')) || 0;
            },

            /** @this {myLib.Scroll.Horizontal.Bar.Lever.CSSStyle.prototype} */
            set(right) {
                this.target_set.bottom = right.toString() + '%';
            }
        }
    }
);