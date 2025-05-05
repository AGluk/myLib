// #include <./Layer.js>

'use strict';

myLib.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////////// Loading ///
    /** @this {myLib.Loading} */
    function Loading() {
        myLib.Layer.call(this);

        // Children

        this.defineChild('bar', new myLib.Loading.Bar());
        this.defineChild('icon', new myLib.Loading.Icon());
    },

    // Extends
    myLib.Layer,
    {
        className: {
            /** @this {myLib.Loading.prototype} */
            get() {
                return this.target.className.match(/(^| )(loading\s+(.+))?$/)[3] || '';
            },

            /** @this {myLib.Loading.prototype} */
            set(className) {
                myLib.Layer.proto('className').set(this, `loading ${className.trimStart()}`);
            }
        },

        /** @this {myLib.Loading.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Escape':
                    if (this.onAbort())
                        this.remove();

                    return true;
            }
        },

        /** @this {myLib.Loading.prototype} */
        onTap() {
            if (this.onAbort())
                this.remove();

            return true;
        }
    },

    // Events
    {
        onAbort() { }
    },

    // Methods
    {
        /** @this {myLib.Loading.prototype} */
        set(progress) {
            if (progress < 0.5) {
                progress *= 2 * Math.PI;
                this.bar.lever.set(
                    `M24,24l${(21 * Math.sin(progress)).toFixed(3)},${(-21 * Math.cos(progress)).toFixed(3)}A21,21,0,0,0,24,3z`
                );
            } else if (progress < 1) {
                progress *= 2 * Math.PI;
                this.bar.lever.set(
                    `M24,24l${(21 * Math.sin(progress)).toFixed(3)},${(-21 * Math.cos(progress)).toFixed(3)}A21,21,0,1,0,24,3z`
                );
            } else {
                this.bar.lever.set(`M24,24L24,3A21,21,0,0,0,24,45A21,21,0,0,0,24,3z`);
            }

            return this;
        }
    }
);

myLib.Loading.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// Bar ///
    /** @this {myLib.Loading.Bar} */
    function Bar() {
        myLib.Element.SVG.SVG.call(this, 'bar');

        // Children

        this.defineChild('gizmo', new myLib.Loading.Bar.Gizmo()).set(24, 24, 23);
        this.defineChild('lever', new myLib.Loading.Bar.Lever());
    },

    // Extends
    myLib.Element.SVG.SVG
);

myLib.Loading.Bar.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Gizmo ///
    /** @this {myLib.Loading.Bar.Gizmo} */
    function Gizmo() {
        myLib.Element.SVG.Circle.call(this, 'gizmo');
    },

    // Extends
    myLib.Element.SVG.Circle
);

myLib.Loading.Bar.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////// Lever ///
    /** @this {myLib.Loading.Bar.Lever} */
    function Lever() {
        myLib.Element.SVG.Path.call(this, 'lever');
    },

    // Extends
    myLib.Element.SVG.Path
);

myLib.Loading.defineClass( //////////////////////////////////////////////////////////////////////////////////////////////////////// Icon ///
    /** @this {myLib.Loading.Icon} */
    function Icon() {
        myLib.Element.HTML.Image.call(this, 'icon');
        this.src = './images/load.svg';
    },

    // Extends
    myLib.Element.HTML.Image
);