// #include <./myLib.js>

'use strict';

{
    /** @type {number} */
    let animation_id = 0;

    /**
     * @type {{
     *     target: myLib.Animation
     *     curve: (f: number) => number
     *     duration: number
     *     name: string
     *     time: number
     *     timestamp: number
     * }[]}
     */
    let animation_list = [];

    myLib.defineClass( /////////////////////////////////////////////////////////////////////////////////////////////////////// Animation ///
        /** @this {myLib.Animation} */
        function Animation() { },

        // Extends
        myLib,

        // Events
        {
            onAnimationStart(name) { },
            onAnimationFrame(dt, f, name) { },
            onAnimationEnd(name) { },

            /** @this {myLib.Animation.prototype} */
            onAnimationBreak(name) { this.onAnimationEnd(name) }
        },

        // Methods
        {
            /** @this {myLib.Animation.prototype} */
            animationBreak(...name) {
                if (name.length > 0) {
                    for (let i = 0; i < animation_list.length; i++) {
                        if ((animation_list[i].target === this) && (name.includes(animation_list[i].name))) {
                            this.onAnimationBreak(animation_list[i].name);
                            animation_list.splice(i, 1);

                            return this;
                        }
                    }
                } else {
                    for (let i = 0; i < animation_list.length; i++) {
                        if (animation_list[i].target === this) {
                            this.onAnimationBreak(animation_list[i].name);
                            animation_list.splice(i, 1);
                        }
                    }
                }

                return this;
            },

            /** @this {myLib.Animation.prototype} */
            animationStart(name, duration = Infinity, curve = myLib.Animation.straight) {
                if (this.onAnimationStart(name)) return this;

                for (const animation of animation_list) {
                    if ((animation.target === this) && (animation.name === name)) {
                        animation.duration = duration;
                        animation.curve = curve;
                        animation.time = 0;
                        animation.timestamp = 0;

                        return this;
                    }
                }

                animation_list.push({
                    target: this,
                    name: name,
                    duration: duration,
                    curve: curve,
                    time: 0,
                    timestamp: 0
                });

                if (animation_id === 0)
                    animation_id = requestAnimationFrame(onAnimationFrame);

                return this;
            }
        }
    ).static({
        soft(f) {
            return (3 - 2 * f) * f * f;
        },

        softIn(f) {
            return f * f;
        },

        softOut(f) {
            return (2 - f) * f;
        },

        straight(f) {
            return f;
        }
    });

    myLib.Animation.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Array ///
        /** @this {myLib.Animation.Array.prototype} */
        function Array(value) {
            myLib.call(this);

            // Initialization

            this.defineProperty('animated', false);
            this.defineProperty('onAnimationFrame', null);

            this.defineProperty('value', value);
            this.defineProperty('value_0', value.slice());
            this.defineProperty('value_1', value.slice());
        },

        // Extends
        myLib,

        // Handlers
        {
            /** @this {myLib.Animation.Array.prototype} */
            onAnimationStart() {
                if (this.animated) {
                    this.onAnimationFrame = this.onAnimationFrame_1;
                } else {
                    this.onAnimationFrame = this.onAnimationFrame_0;
                }
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationFrame_0() {
                return this.value;
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationFrame_1(f) {
                for (let i = 0; i < this.value.length; i++)
                    this.value[i] = this.value_0[i] + f * (this.value_1[i] - this.value_0[i]);

                return this.value;
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationEnd() {
                this.animated = false;
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationBreak() {
                this.animated = false;
            }
        },

        // Methods
        {
            /** @this {myLib.Animation.Array.prototype} */
            animate(value) {
                this.animated = true;

                for (let i = 0; i < value.length; i++) {
                    this.value_0[i] = this.value[i];
                    this.value_1[i] = value[i];
                }

                return this;
            },

            /** @this {myLib.Animation.Array.prototype} */
            set(value) {
                if (this.animated) {
                    for (let i = 0; i < value.length; i++)
                        this.value_1[i] = value[i];
                } else {
                    for (let i = 0; i < value.length; i++)
                        this.value[i] = value[i];
                }

                return this;
            }
        }
    );

    myLib.Animation.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////// Property ///
        /** @this {myLib.Animation.Property} */
        function Property(value) {
            myLib.call(this);

            // Initialization

            this.defineProperty('animated', false);
            this.defineProperty('onAnimationFrame', null);

            this.defineProperty('value', value);
            this.defineProperty('value_0', value);
            this.defineProperty('value_1', value);
        },

        // Extends
        myLib,

        // Handlers
        {
            /** @this {myLib.Animation.Property.prototype} */
            onAnimationStart() {
                if (this.animated) {
                    this.onAnimationFrame = this.onAnimationFrame_1;
                } else {
                    this.onAnimationFrame = this.onAnimationFrame_0;
                }
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationFrame_0() {
                return this.value;
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationFrame_1(f) {
                return this.value = this.value_0 + f * (this.value_1 - this.value_0);
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationEnd() {
                this.animated = false;
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationBreak() {
                this.animated = false;
            }
        },

        // Methods
        {
            /** @this {myLib.Animation.Property.prototype} */
            animate(value) {
                this.animated = true;

                this.value_0 = this.value;
                this.value_1 = value;

                return this;
            },

            /** @this {myLib.Animation.Property.prototype} */
            set(value) {
                if (this.animated) {
                    this.value_1 = value;
                } else {
                    this.value = value;
                }

                return this;
            }
        }
    );

    function onAnimationFrame(timestamp) { /////////////////////////////////////////////////////////////////////////////////////////////////
        for (let i = 0; i < animation_list.length; i++) {
            if (animation_list[i].timestamp === 0) {
                animation_list[i].timestamp = timestamp;
            } else {
                let dt = timestamp - animation_list[i].timestamp;
                animation_list[i].timestamp = timestamp;

                animation_list[i].time += dt;
                if (animation_list[i].time < animation_list[i].duration) {
                    if (animation_list[i].target.onAnimationFrame(dt,
                        animation_list[i].curve(animation_list[i].time / animation_list[i].duration),
                        animation_list[i].name)) {

                        animation_list[i].target.onAnimationEnd(animation_list[i].name);
                        animation_list.splice(i, 1);
                    }
                } else {
                    animation_list[i].target.onAnimationFrame(dt, animation_list[i].curve(1), animation_list[i].name);
                    animation_list[i].target.onAnimationEnd(animation_list[i].name);
                    animation_list.splice(i, 1);
                }
            }
        }

        if (animation_list.length > 0) {
            animation_id = requestAnimationFrame(onAnimationFrame);
        } else {
            animation_id = 0;
        }
    }
}