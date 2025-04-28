// #include <./Element.js>
// #include <./Touch.js>

'use strict';

{
    /** @type {myLib.Layer | null} */
    let layer_top = null;

    myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////////// Layer ///
        /** @this {myLib.Layer} */
        function Layer(...args) {
            myLib.Element.HTML.Div.apply(this, args);
            myLib.Touch.call(this);

            this.target.tabIndex = 0;

            // Initialization

            this.defineProperty('layer', document.createElement('div'));
            this.layer.className = 'layer';
            this.layer.appendChild(this.target);

            this.below = null;
            this.hide();
        },

        // Extends
        myLib.Element.HTML.Div,
        {
            /** @this {myLib.Layer.prototype} */
            append(...args) {
                if (layer_top !== null) {
                    if (layer_top === this) {
                        return this;
                    } else {
                        let layer = layer_top, below = layer.below;
                        while (below !== null) {
                            if (below === this) {
                                layer.below = below.below;

                                if (this.below !== null) {
                                    this.layer.parentNode.replaceChild(this.below.layer, this.layer);
                                } else {
                                    this.layer.parentNode.removeChild(this.layer);
                                }

                                this.hide();
                                break;
                            }

                            layer = below;
                            below = layer.below;
                        }
                    }

                    this.layer.className = 'layer';
                    document.body.insertBefore(this.layer, layer_top.layer);
                    this.layer.insertBefore(layer_top.layer, this.target);

                    this.below = layer_top;
                    this.below.layer.className = 'layer below';
                } else {
                    this.layer.className = 'layer';
                    document.body.appendChild(this.layer);
                }

                layer_top = this;

                this.resize();
                this.onAppend(...args);
                this.focus();
                this.show();

                return this;
            },

            /** @this {myLib.Layer.prototype} */
            remove(...args) {
                if (layer_top !== null) {
                    if (layer_top === this) {
                        this.onRemove(...args);

                        if (this.below !== null) {
                            this.layer.parentNode.replaceChild(this.below.layer, this.layer);
                        } else {
                            this.layer.parentNode.removeChild(this.layer);
                        }

                        this.hide();

                        layer_top = layer_top.below;
                        if (layer_top !== null) {
                            layer_top.layer.className = 'layer';
                            layer_top.focus();
                        }

                        return this;
                    } else {
                        let layer = layer_top, below = layer.below;
                        while (below !== null) {
                            if (below === this) {
                                this.onRemove(...args);

                                if (this.below !== null) {
                                    this.layer.parentNode.replaceChild(this.below.layer, this.layer);
                                } else {
                                    this.layer.parentNode.removeChild(this.layer);
                                }

                                this.hide();

                                layer.below = below.below;

                                return this;
                            }

                            layer = below;
                            below = layer.below;
                        }
                    }
                }

                return this;
            }
        },

        // Mixin
        myLib.Touch,
        {
            /** @this {myLib.Layer.prototype} */
            onKeyDown(code) {
                switch (code) {
                    case 'Escape':
                        this.focus();
                        return true;
                }
            },

            /** @this {myLib.Layer.prototype} */
            onTap() {
                this.focus();
                return true;
            }
        },

        // Events
        {
            onAppend() { },
            onBack() { },
            onDocumentHide() { },
            onDocumentShow() { },
            onOrientation(alpha, beta, gamma) { },
            onOrientationChange(orientation) { },
            onRemove() { },
            onTop() { }
        }
    ).static({
        LANDSCAPE: 0,
        PORTRAIT: 1
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    document.addEventListener('DOMContentLoaded', function () {
        document.body.style.width = window.innerWidth + 'px';
        document.body.style.height = window.innerHeight + 'px';
    }, { capture: false, passive: true });

    document.addEventListener('visibilitychange', function () {
        switch (document.visibilityState) {
            case "visible":
                layer_top.onDocumentShow();
                return;
            case "hidden":
                layer_top.onDocumentHide();
                return;
        }
    });

    window.addEventListener('deviceorientation', function (event) {
        let layer = layer_top;
        while (layer !== null) {
            layer.onOrientation(event.alpha, event.beta, event.gamma);
            layer = layer.below;
        }
    }, { capture: false, passive: true });

    window.addEventListener('orientationchange', function () {
        window.scrollTo(0, 0);

        let layer = layer_top;
        if (window.innerWidth < window.innerHeight) {
            while (layer !== null) {
                layer.onOrientationChange(myLib.Layer.PORTRAIT);
                layer = layer.below;
            }
        } else {
            while (layer !== null) {
                layer.onOrientationChange(myLib.Layer.LANDSCAPE);
                layer = layer.below;
            }
        }
    }, { capture: false, passive: true });

    window.addEventListener('resize', function () {
        window.scrollTo(0, 0);

        document.body.style.width = window.innerWidth + 'px';
        document.body.style.height = window.innerHeight + 'px';

        let layer = layer_top;
        while (layer !== null) {
            layer.resize();
            layer = layer.below;
        }
    }, { capture: false, passive: true });

    window.addEventListener('scroll', function () {
        if (document.activeElement === null)
            window.scrollTo(0, 0);
    }, { capture: false, passive: true });
}