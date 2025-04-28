// #include </lib/PanoGL.js>

myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// myPano ///
    /** @this {myLib.myPano} */
    function myPano(src) { // Constructor
        myLib.PanoGL.call(this); // Call parent constructor
        myLib.Animation.call(this); // Call mixin constructor
        myLib.Touch.call(this); // Call mixin constructor

        // Initialization

        this.defineProperty('view', new myLib.myPano.View(0, 0, 1.3));
        this.setPerspective(1 / Math.tan(this.view.FOV / 2)); // Calling method from the parent class

        this.defineProperty('vX', 0);
        this.defineProperty('vY', 0);

        this.setSrc(src, 2048); // Calling method from the parent class
    },

    // Extends
    myLib.PanoGL, // Extends parent class 'PanoGL'

    // Mixin
    myLib.Animation, // Mixin 'Animation' class
    {
        /** @this {myLib.myPano.prototype} */
        onAnimationStart(name) {
            switch (name) {
                case 'inertial':
                    if ((this.vX === 0) && (this.vY === 0)) {
                        return true;
                    } else {
                        return false;
                    }
                case 'view':
                    this.view.ph_.onAnimationStart();
                    this.view.th_.onAnimationStart();
                    this.view.FOV_.onAnimationStart();

                    return;
            }
        },

        /** @this {myLib.myPano.prototype} */
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

                    let dX = dt * (this.vX + vX) / 2,
                        dY = dt * (this.vY + vY) / 2;

                    this.vX = vX;
                    this.vY = vY;

                    let perspective;
                    if (this.offsetWidth < this.offsetHeight) {
                        perspective = this.offsetWidth / 2 / Math.tan(this.view.FOV / 2);
                    } else {
                        perspective = this.offsetHeight / 2 / Math.tan(this.view.FOV / 2);
                    }

                    this.view.ph -= dX / perspective;
                    if (this.view.ph < -Math.PI) this.view.ph = this.view.ph + 2 * Math.PI;
                    else if (this.view.ph > Math.PI) this.view.ph = this.view.ph - 2 * Math.PI;

                    this.view.th += dY / perspective;
                    if (this.view.th < -Math.PI / 2) this.view.th = -Math.PI / 2 + 0.001;
                    else if (this.view.th > Math.PI / 2) this.view.th = Math.PI / 2 - 0.001;

                    this.update();

                    return (this.vX === 0) && (this.vY === 0);
                case 'view':
                    this.view.ph_.onAnimationFrame(f);
                    this.view.th_.onAnimationFrame(f);
                    this.view.FOV_.onAnimationFrame(f);

                    this.update();

                    return;
            }
        },

        /** @this {myLib.myPano.prototype} */
        onAnimationEnd(name) {
            switch (name) {
                case 'inertial':
                    return;
                case 'view':
                    this.view.ph_.onAnimationEnd();
                    this.view.th_.onAnimationEnd();
                    this.view.FOV_.onAnimationEnd();

                    if (this.view.ph < -Math.PI) this.view.ph += 2 * Math.PI;
                    else if (this.view.ph > Math.PI) this.view.ph -= 2 * Math.PI;

                    return;
            }
        }
    },

    // Mixin
    myLib.Touch, // Mixin 'Touch' class
    {
        /** @this {myLib.myPano.prototype} */
        onTap() {
            if (this.view.FOV !== 1.3) {
                this.view.FOV_.animate(1.3);
                this.animationStart('view', 300, myLib.Animation.soft);
            }

            return true;
        },

        /** @this {myLib.myPano.prototype} */
        onTouchStart() {
            this.animationBreak();
            return true;
        },

        /** @this {myLib.myPano.prototype} */
        onTouchMove(dX, dY, kR) {
            this.view.FOV /= kR;
            if (this.view.FOV < Math.PI / 6) this.view.FOV = Math.PI / 6;
            else if (this.view.FOV > 2 * Math.PI / 3) this.view.FOV = 2 * Math.PI / 3;

            let perspective;
            if (this.offsetWidth < this.offsetHeight) {
                perspective = this.offsetWidth / 2 / Math.tan(this.view.FOV / 2);
            } else {
                perspective = this.offsetHeight / 2 / Math.tan(this.view.FOV / 2);
            }

            this.view.ph = this.view.ph - dX / perspective;
            if (this.view.ph < -Math.PI) this.view.ph = this.view.ph + 2 * Math.PI;
            else if (this.view.ph > Math.PI) this.view.ph = this.view.ph - 2 * Math.PI;

            this.view.th = this.view.th + dY / perspective;
            if (this.view.th < -Math.PI / 2) this.view.th = -Math.PI / 2 + 0.001;
            else if (this.view.th > Math.PI / 2) this.view.th = Math.PI / 2 - 0.001;

            this.update();

            return true;
        },

        /** @this {myLib.Scene.prototype} */
        onTouchEnd() {
            this.vX = this.touch.vX;
            this.vY = this.touch.vY;

            this.animationStart('inertial');
            return true;
        }
    },

    // Methods
    {
        /** @this {myLib.myPano.prototype} */
        update() {
            this.setView(myLib.Matrix3D.MxM(
                myLib.Matrix3D.rotateY(this.view.ph),
                myLib.Matrix3D.rotateX(-this.view.th)
            ));

            this.setPerspective(1 / Math.tan(this.view.FOV / 2));

            myLib.PanoGL.proto('update').call(this); // Calling parent prototype method because we've overloaded it
            return this;
        }
    }
);

myLib.myPano.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// View ///
    /** @this {myLib.myPano.View} */
    function View(ph, th, FOV) {
        myLib.call(this);

        // Initialization

        this.defineProperty('ph_', new myLib.Animation.Property(ph));
        this.defineProperty('th_', new myLib.Animation.Property(th));
        this.defineProperty('FOV_', new myLib.Animation.Property(FOV));
    },

    // Extends
    myLib,

    // Accessors
    {
        ph: {
            /** @this {myLib.myPano.View.prototype} */
            get() {
                return this.ph_.value;
            },

            /** @this {myLib.myPano.View.prototype} */
            set(ph) {
                this.ph_.set(ph);
            }
        },

        th: {
            /** @this {myLib.myPano.View.prototype} */
            get() {
                return this.th_.value;
            },

            /** @this {myLib.myPano.View.prototype} */
            set(th) {
                this.th_.set(th);
            }
        },

        FOV: {
            /** @this {myLib.myPano.View.prototype} */
            get() {
                return this.FOV_.value;
            },

            /** @this {myLib.myPano.View.prototype} */
            set(FOV) {
                this.FOV_.set(FOV);
            }
        }
    }
);