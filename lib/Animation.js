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

        // Static
        {
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
        },

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
            animate(...properties) {
                for (const property of properties) {
                    if (!property[0].animated) {
                        for (const property of properties)
                            property[0].value_1 = property[1];

                        return true;
                    } else if (typeof property[0].value_1 === 'number') {
                        if (property[0].value_1 !== property[1]) {
                            for (const property of properties)
                                property[0].value_1 = property[1];

                            return true;
                        }
                    } else {
                        for (let i = 0; i < property[1].length; i++) {
                            if (property[0].value_1[i] !== property[1][i]) {
                                for (const property of properties)
                                    property[0].value_1 = property[1];

                                return true;
                            }
                        }
                    }
                }

                return false;
            },

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
            animationStart(...args) {
                let name, duration, curve;
                switch (typeof args[0]) {
                    case 'string':
                        name = args[0];
                        duration = args[1] || Infinity;
                        curve = args[2] || myLib.Animation.straight;

                        break;
                    case 'number':
                        duration = args[0] || Infinity;
                        curve = args[1] || myLib.Animation.straight;

                        break;
                    default:
                        duration = Infinity;
                        curve = myLib.Animation.straight;
                }

                if (this.onAnimationStart(name))
                    return this;

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
    );

    myLib.Animation.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////// Array ///
        /** @this {myLib.Animation.Array.prototype} */
        function Array(value) {
            this.extends(myLib);

            // Initialization

            this.defineProperty('value', value);
            this.defineProperty('value_0', value.slice());
            this.defineProperty('value_1', value);
        },

        // Extends
        myLib,

        // Methods
        {
            /** @this {myLib.Animation.Array.prototype} */
            animate(value) {
                this.value_1 = value;
                return this;
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationStart() {
                for (let i = 0; i < this.value.length; i++)
                    this.value_0[i] = this.value[i];
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationFrame(f) {
                for (let i = 0; i < this.value.length; i++)
                    this.value[i] = this.value_0[i] + f * (this.value_1[i] - this.value_0[i]);

                return this.value;
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationEnd() {
                this.value_1 = this.value;
            },

            /** @this {myLib.Animation.Array.prototype} */
            onAnimationBreak() {
                this.value_1 = this.value;
            },

            /** @this {myLib.Animation.Array.prototype} */
            set(value) {
                if (this.value === this.value_1) {
                    this.value_1 = this.value = value;
                } else {
                    this.value_1 = value;
                }

                return this;
            }
        }
    );

    myLib.Animation.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////// Property ///
        /** @this {myLib.Animation.Property} */
        function Property(value) {
            this.extends(myLib);

            // Initialization

            this.defineProperty('value', value);
            this.defineProperty('value_0', value);
            this.defineProperty('value_1', value);
        },

        // Extends
        myLib,

        // Methods
        {
            /** @this {myLib.Animation.Property.prototype} */
            animate(value) {
                this.value_1 = value;
                return this;
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationStart() {
                this.value_0 = this.value;
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationFrame(f) {
                return this.value = this.value_0 + f * (this.value_1 - this.value_0);
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationEnd() {
                this.value_1 = this.value;
            },

            /** @this {myLib.Animation.Property.prototype} */
            onAnimationBreak() {
                this.value_1 = this.value;
            },

            /** @this {myLib.Animation.Property.prototype} */
            set(value) {
                if (this.value === this.value_1) {
                    this.value_1 = this.value = value;
                } else {
                    this.value_1 = value;
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