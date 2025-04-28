// #include <./AJAX.js>
// #include <./Layer.js>
// #include <./Scroll.js>

'use strict';

myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////////// Photo ///
    /** @this {myLib.Photo} */
    function Photo(...args) {
        if (/[A-Z]+/.test(args[0])) {
            myLib.Layer.call(this, args[1], args[0]);
        } else {
            myLib.Layer.call(this, args[0]);
        }

        // Children

        this.defineChild('body', new myLib.Photo.Body());
        this.defineChild('load', new myLib.Photo.Load());
        this.defineChild('close', new myLib.Photo.Close());

        // Initialization

        this.defineProperty('AJAX', undefined);
        this.defineProperty('images', []);
    },

    // Extends
    myLib.Layer,
    {
        className: {
            /** @this {myLib.Photo.prototype} */
            get() {
                return this.target.className.match(/(^| )photo( (.+))?$/)[3] || '';
            },

            /** @this {myLib.Photo.prototype} */
            set(className) {
                myLib.Layer.proto('className').set(this, `photo ${className.trimStart()}`);
            }
        },

        /** @this {myLib.Photo.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Escape':
                    this.remove();
                    return true;
            }
        },

        /** @this {myLib.Photo.prototype} */
        onTap() {
            this.remove();
            return true;
        }
    },

    // Methods
    {
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
            if (this.AJAX !== undefined)
                this.AJAX.abort();

            this.body.remove().hide().clear();
            this.load.show();

            this.AJAX = myLib.AJAX.get(`getImagesList.php?src=${src}`, AJAX => {
                this.AJAX = undefined;

                this.images = JSON.parse(AJAX.responseText);

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
        myLib.Scroll.call(this, 'body');

        // Children

        this.frame = [
            new myLib.Photo.Body.Frame(),
            new myLib.Photo.Body.Frame(),
            new myLib.Photo.Body.Frame()
        ];

        this.appendChild(this.frame[0]);
        this.appendChild(this.frame[1]);
        this.appendChild(this.frame[2]);

        // Initialization

        this.index = 0;
        this.hide();
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

                this.scrollTo(0, 0);
                return true;
            }
        },

        /** @this {myLib.Photo.Body.prototype} */
        onScroll(scrollLeft) {
            this.index = Math.round(scrollLeft / this.style.width);

            this.frame[this.index % 3].setIndex(this.index);
            this.frame[(this.index + 1) % 3].setIndex(this.index + 1);
            this.frame[(this.index + 2) % 3].setIndex(this.index - 1);

            return this;
        },

        /** @this {myLib.Photo.Body.prototype} */
        onTap(target) {
            if (target.className === 'gizmo') {
                if (this.touch.layerX < this.clientWidth / 2) {
                    this.scrollTo(Math.round(this.scrollLeft / this.style.width - 1) * this.style.width, 0, 1, 300);
                } else {
                    this.scrollTo(Math.round(this.scrollLeft / this.style.width + 1) * this.style.width, 0, 1, 300);
                }

                return true;
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
            this.frame[0].clear();
            this.frame[1].clear();
            this.frame[2].clear();

            this.scrollTo(0, 0);

            this.index = 0;
            return this;
        }
    }
);

myLib.Photo.Body.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////// Frame ///
    /** @this {myLib.Photo.Body.Frame} */
    function Frame() {
        myLib.Scroll.call(this, 'frame');

        // Children

        this.defineChild('gizmo', new myLib.Photo.Body.Frame.Gizmo());

        // Initialization

        this.defineProperty('index', undefined);
    },

    // Extends
    myLib.Scroll,
    {
        /** @this {myLib.Photo.Body.Frame.prototype} */
        onResize(capture) {
            myLib.Scroll.proto('onResize').call(this, capture);

            if (capture) {
                if (this.index !== undefined) {
                    this.style.left = this.index * this.parent.style.width;

                    if (this.image.width / this.image.height < this.parent.style.width / this.parent.style.height) {
                        let height;
                        if (document.body.clientHeight < 500) {
                            height = this.parent.style.height;
                            this.className = 'frame small';
                        } else {
                            height = 0.8 * this.parent.style.height;
                            this.className = 'frame large';
                        }

                        if (height > this.image.height) height = this.image.height;

                        this.style.height = height;
                        this.style.width = height * this.image.width / this.image.height;
                    } else {
                        let width;
                        if (document.body.clientWidth < 500) {
                            width = this.parent.style.width;
                            this.className = 'frame small';
                        } else {
                            width = 0.8 * this.parent.style.width;
                            this.className = 'frame large';
                        }

                        if (width > this.image.width) width = this.image.width;

                        this.style.width = width;
                        this.style.height = width * this.image.height / this.image.width;
                    }

                    this.style.padding = [
                        (this.parent.style.height - this.style.height) / 2,
                        (this.parent.style.width - this.style.width) / 2
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

            this.style.left = 0;
            this.style.width = 0;
            this.style.height = 0;
            this.style.padding = [0];

            return this;
        },

        /** @this {myLib.Photo.Body.Frame.prototype} */
        setIndex(index) {
            if (index !== this.index) {
                let image = this.parent.parent.images[index];
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
        myLib.Element.HTML.Div.call(this, 'gizmo');
        myLib.Animation.call(this);

        // Children

        this.defineChild('image', new myLib.Photo.Body.Frame.Gizmo.Image());
    },

    // Extends
    myLib.Element.HTML.Div,
    {
        /** @this {myLib.Photo.Body.Frame.Gizmo.prototype} */
        onResize() {
            this.style.height = this.parent.zoom * this.parent.style.height;
            this.style.width = this.parent.zoom * this.parent.style.width;

            return this;
        }
    },

    // Methods
    {
        /** @this {myLib.Photo.Body.Frame.Gizmo.prototype} */
        clear() {
            this.image.src = '';
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
        myLib.Element.HTML.Image.call(this, 'image');
    },

    // Extends
    myLib.Element.HTML.Image
);

myLib.Photo.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Close ///
    /** @this {myLib.Photo.Close} */
    function Close() {
        myLib.Element.HTML.Image.call(this, 'close');
        myLib.Touch.call(this);

        // Initialization

        this.src = './images/cross.svg';
    },

    // Extends
    myLib.Element.HTML.Image,

    // Mixin
    myLib.Touch,
    {
        /** @this {myLib.Photo.Close.prototype} */
        onTap() {
            this.parent.remove();
        }
    }
);

myLib.Photo.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////// Load ///
    /** @this {myLib.Photo.Load} */
    function Load() {
        myLib.Element.HTML.Image.call(this, 'load');
        this.src = './images/load.svg';
    },

    // Extends
    myLib.Element.HTML.Image
);