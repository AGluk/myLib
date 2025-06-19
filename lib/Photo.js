// #include <./AJAX.js>
// #include <./Layer.js>
// #include <./Scroll.js>

'use strict';

myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////////// Photo ///
    /** @this {myLib.Photo} */
    function Photo(...args) {
        this.extends(myLib.Layer, args);

        // Children

        this.defineChild('body', new myLib.Photo.Body());
        this.defineChild('load', new myLib.Photo.Load());
        this.defineChild('close', new myLib.Photo.Close());

        // Initialization

        this.defineProperty('AJAX', undefined);
        this.defineProperty('images', []);
    },

    // Static
    {
        className: 'my-photo'
    },

    // Extends
    myLib.Layer,
    {
        /** @this {myLib.Photo.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Escape':
                    this.remove(true);
                    return true;
            }
        },

        /** @this {myLib.Photo.prototype} */
        onTap() {
            this.remove(true);
            return true;
        }
    },

    // Methods
    {
        /** @this {myLib.Photo.prototype} */
        clear() {
            if (this.AJAX !== undefined)
                this.AJAX.abort();

            this.body.remove().hide().clear();
            this.images = [];
            this.load.show();

            return this;
        },

        /** @this {myLib.Photo.prototype} */
        setImages(images) {
            if (this.AJAX !== undefined)
                this.AJAX.abort();

            this.body.remove().hide().clear();
            this.images = images;
            this.body.append().resize().show();
            this.load.hide();

            return this;
        },

        /** @this {myLib.Photo.prototype} */
        setSrc(src) {
            src = src.match(/^(https?:\/\/.*?\/)?(.*)/i).map(match => match || '');

            if (this.AJAX !== undefined)
                this.AJAX.abort();

            this.body.remove().hide().clear();
            this.load.show();

            this.AJAX = myLib.AJAX.get(`${src[1]}getImagesList.php?src=${src[2]}`, AJAX => {
                this.AJAX = undefined;

                this.images = JSON.parse(AJAX.responseText).map(image => {
                    image.path = src[1] + image.path;
                    image.thumbnail = src[1] + image.thumbnail;

                    return image;
                });

                this.body.append().resize().show();
                this.load.hide();
            });

            return this;
        }
    }
);

myLib.Photo.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////// Body ///
    /** @this {myLib.Photo.Body} */
    function Body() {
        this.extends(myLib.Scroll);

        // Children

        this.defineProperty('frame', [
            new myLib.Photo.Body.Frame(),
            new myLib.Photo.Body.Frame(),
            new myLib.Photo.Body.Frame()
        ]);

        this.appendChild(this.frame[0]);
        this.appendChild(this.frame[1]);
        this.appendChild(this.frame[2]);

        // Properties

        this.defineProperty('index', 0);
        this.defineProperty('timeout', 0);

        // Initialization

        this.hide();
    },

    // Static
    {
        className: 'body'
    },

    // Extends
    myLib.Scroll,
    {
        /** @this {myLib.Photo.Body.prototype} */
        onResize(capture) {
            myLib.Scroll.proto('onResize').call(this, capture);

            if (capture) {
                this.content.style.width = this.style.width * this.parent.images.length;
                this.content.style.height = this.style.height;

                this.scrollTo(Math.round(this.scrollLeft / this.style.width) * this.style.width, 0, 1);
                return true;
            }
        },

        /** @this {myLib.Photo.Body.prototype} */
        onScroll(scrollLeft) {
            this.index = Math.round(scrollLeft / this.style.width) || 0;

            this.frame[this.index % 3].setIndex(this.index);
            this.frame[(this.index + 1) % 3].setIndex(this.index + 1);
            this.frame[(this.index + 2) % 3].setIndex(this.index - 1);
        },

        /** @this {myLib.Photo.Body.prototype} */
        onTap(target) {
            if (target.my_class?.className_origin === 'gizmo') {
                if (this.touch.layerX < this.clientWidth / 2) {
                    this.scrollTo(Math.round(this.scrollLeft / this.style.width - 1) * this.style.width, 0, 1, 300);
                } else {
                    this.scrollTo(Math.round(this.scrollLeft / this.style.width + 1) * this.style.width, 0, 1, 300);
                }

                return true;
            }
        },

        /** @this {myLib.Photo.Body.prototype} */
        onTouchMove(dX, dY, kR) {
            switch (this.touch.move) {
                case 'hscroll':
                case 'vscroll':
                case 'scroll':
                    return myLib.Scroll.proto('onTouchMove').call(this, dX, dY, kR);
                default:
                    if (this.timeout > 0)
                        clearTimeout(this.timeout);

                    setTimeout(() => {
                        if (this.touch.vX < 0) {
                            this.scrollTo(Math.floor(this.scrollLeft / this.style.width + 1) * this.style.width, 0, 1, 300);
                        } else if (this.touch.vX > 0) {
                            this.scrollTo(Math.ceil(this.scrollLeft / this.style.width - 1) * this.style.width, 0, 1, 300);
                        } else {
                            this.scrollTo(Math.round(this.scrollLeft / this.style.width) * this.style.width, 0, 1, 300);
                        }
                    }, 100);

                    return myLib.Scroll.proto('onTouchMove').call(this, dX, dY, kR);
            }
        },

        /** @this {myLib.Photo.Body.prototype} */
        onTouchEnd() {
            switch (this.touch.move) {
                case 'hscroll':
                    this.touch.move = undefined;
                    this.hscroll.hide();

                    this.scrollTo(Math.round(this.scrollLeft / this.style.width) * this.style.width, 0, 1, 300);
                    return true;
                case 'vscroll':
                    this.touch.move = undefined;
                    this.vscroll.hide();
                    return true;
                case 'scroll':
                    this.touch.move = undefined;
                    this.hscroll.hide();
                    this.vscroll.hide();

                    if (this.touch.vX < 0) {
                        this.scrollTo(Math.floor(this.scrollLeft / this.style.width + 1) * this.style.width, 0, 1, 300);
                    } else if (this.touch.vX > 0) {
                        this.scrollTo(Math.ceil(this.scrollLeft / this.style.width - 1) * this.style.width, 0, 1, 300);
                    } else {
                        this.scrollTo(Math.round(this.scrollLeft / this.style.width) * this.style.width, 0, 1, 300);
                    }

                    return true;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Photo.Body.prototype} */
        clear() {
            this.scrollTo(0, 0);

            this.frame[0].clear();
            this.frame[1].clear();
            this.frame[2].clear();

            this.index = 0;
            return this;
        }
    }
);

myLib.Photo.Body.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Frame ///
    /** @this {myLib.Photo.Body.Frame} */
    function Frame() {
        this.extends(myLib.Scroll);

        // Children
        this.defineChild('gizmo', new myLib.Photo.Body.Frame.Gizmo());

        // Properties
        this.defineProperty('index', undefined);
    },

    // Static
    {
        className: 'my-photo-body-content-frame'
    },

    // Extends
    myLib.Scroll,
    {
        /** @this {myLib.Photo.Body.Frame.prototype} */
        onResize(capture) {
            myLib.Scroll.proto('onResize').call(this, capture);

            if (capture) {
                if (this.index !== undefined) {
                    this.style.left = this.index * this.parent.parent.style.width;

                    if (this.image.width / this.image.height < this.parent.parent.style.width / this.parent.parent.style.height) {
                        let height;
                        if (document.body.clientHeight < 500) {
                            height = this.parent.parent.style.height;
                            this.remExtendedClassNames('large');
                            this.addExtendedClassNames('small');
                        } else {
                            height = 0.8 * this.parent.parent.style.height;
                            this.remExtendedClassNames('small');
                            this.addExtendedClassNames('large');
                        }

                        if (height > this.image.height)
                            height = this.image.height;

                        this.style.height = height;
                        this.style.width = height * this.image.width / this.image.height;
                    } else {
                        let width;
                        if (document.body.clientWidth < 500) {
                            width = this.parent.parent.style.width;
                            this.remExtendedClassNames('large');
                            this.addExtendedClassNames('small');
                        } else {
                            width = 0.8 * this.parent.parent.style.width;
                            this.remExtendedClassNames('small');
                            this.addExtendedClassNames('large');
                        }

                        if (width > this.image.width)
                            width = this.image.width;

                        this.style.width = width;
                        this.style.height = width * this.image.height / this.image.width;
                    }

                    this.style.padding = [
                        (this.parent.parent.style.height - this.style.height) / 2,
                        (this.parent.parent.style.width - this.style.width) / 2
                    ];

                    if (this.zoom < 1) this.zoom = 1;
                    else if (this.zoom > 3) this.zoom = 3;
                }

                return true;
            }
        },

        /** @this {myLib.Photo.Body.Frame.prototype} */
        onTap(target) {
            if ((target === this.gizmo.target) &&
                ((this.style.width + 0.5 < this.content.offsetWidth) || (this.style.height + 0.5 < this.content.offsetHeight))) {
                this.scrollTo(0, 0, 1, 300);
                return true;
            }
        }
    },

    // Methods
    {
        /** @this {myLib.Photo.Body.Frame.prototype} */
        clear() {
            this.index = undefined;
            this.gizmo.clear();
            this.zoom = 1;

            this.style.top = 0;
            this.style.left = 0;
            this.style.width = 0;
            this.style.height = 0;
            this.style.padding = [0];

            return this;
        },

        /** @this {myLib.Photo.Body.Frame.prototype} */
        setIndex(index) {
            if (index !== this.index) {
                let image = this.parent.parent.parent.images[index];
                if (image !== undefined) {
                    this.index = index;
                    this.image = image;

                    this.gizmo.setImage(this.image);
                    this.resize();
                }
            }

            return this;
        }
    }
);

myLib.Photo.Body.Frame.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////// Gizmo ///
    /** @this {myLib.Photo.Body.Frame.Gizmo} */
    function Gizmo() {
        this.extends(myLib.Element.HTML.Div)
            .mixin(myLib.Animation);

        // Children

        this.defineChild('image', new myLib.Photo.Body.Frame.Gizmo.Image());
    },

    // Static
    {
        className: 'gizmo'
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Photo.Body.Frame.Gizmo.prototype} */
        onResize() {
            this.style.height = this.parent.parent.zoom * this.parent.parent.style.height;
            this.style.width = this.parent.parent.zoom * this.parent.parent.style.width;

            return this;
        }
    },

    // Methods
    {
        /** @this {myLib.Photo.Body.Frame.Gizmo.prototype} */
        clear() {
            this.image.clear();
            this.style.removeProperty('backgroundImage');
            return this;
        },

        /** @this {myLib.Photo.Body.Frame.Gizmo.prototype} */
        setImage(image) {
            this.image.src = `${image.path}?${image.date}`;
            this.style.backgroundImage = `url("${image.thumbnail}?${image.date}")`;
            return this;
        }
    }
);

myLib.Photo.Body.Frame.Gizmo.defineClass( //////////////////////////////////////////////////////////////////////////////////////// Image ///
    /** @this {myLib.Photo.Body.Frame.Gizmo.Image} */
    function Image() {
        this.extends(myLib.Element.HTML.Image);
    },

    // Static
    {
        className: 'image'
    },

    // Extends
    myLib.Element.HTML.Image
);

myLib.Photo.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Close ///
    /** @this {myLib.Photo.Close} */
    function Close() {
        this.extends(myLib.Element.HTML.Image)
            .mixin(myLib.Touch);

        // Initialization

        this.src = './images/cross.svg';
    },

    // Static
    {
        className: 'close'
    },

    // Extends
    myLib.Element.HTML.Image,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Photo.Close.prototype} */
        onTap() {
            this.parent.remove(true);
        }
    }
);

myLib.Photo.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////// Load ///
    /** @this {myLib.Photo.Load} */
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