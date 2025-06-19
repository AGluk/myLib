// #include </lib/Layer.js>
// #include </lib/PanoGL.js>

// All custom classes must starts with 'my...'
myLib.defineClass( ////////////////////////////////////////////////////////////////////////////////////////////////////////////// myPano ///
    /** @this {myLib.myPano} */
    function myPano(src) { // Constructor
        this.extends(myLib.Layer) // Call parent constructor
            .mixin(myLib.Animation); // Call mixin constructor

        // Children

        this.defineChild('pano', new myLib.PanoGL()); // Define 'pano' child

        // Properties

        this.defineProperty('view', new myLib.myPano.View(0, 0, 1.3)); // Difine 'view' property

        this.defineProperty('vX', 0); // Difine 'vX' property
        this.defineProperty('vY', 0); // Difine 'vY' property

        // Initialization

        this.pano.setPerspective(1 / Math.tan(this.view.FOV / 2)); // Calling method from 'PanoGL' class
        this.pano.setSrc(src, 2048); // Calling method 'PanoGL' class
    },

    // Static
    {
        className: 'my-pano' // Origin className
    },

    // Extends
    myLib.Layer, // Extends parent class 'Layer'
    {
        /** @this {myLib.myPano.prototype} */
        onKeyDown(code) {
            switch (code) {
                case 'Escape':
                    this.remove(); // Remove our layer from 'LayersBox'
                    return true;   // Stop propagation and prevent default behaviour
                                   // Return 'false' for stopping propagation but not preventing default behaviour
                                   // If nothing returned - the next 'onKeyDown' handler will be called in bubble order
            }
        },

        /** @this {myLib.myPano.prototype} */
        onTap(target) {
            if (target === this.target) {
                this.remove(); // Remove our layer from 'LayersBox'
            } else if (this.view.FOV !== 1.3) {
                this.animate(
                    [this.view.FOV_, 1.3] // Prepare animation for 'FOV'
                ) && this.animationStart('view', 300, myLib.Animation.soft); // Start animation for 'view'
            }

            return true; // Stop propagation
        },

        /** @this {myLib.myPano.prototype} */
        onTouchStart() {
            this.animationBreak(); // Break all animation
            return true; // Stop propagation
        },

        /** @this {myLib.myPano.prototype} */
        onTouchMove(dX, dY, kR) {
            this.view.FOV /= kR;
            if (this.view.FOV < Math.PI / 6) this.view.FOV = Math.PI / 6;
            else if (this.view.FOV > 2 * Math.PI / 3) this.view.FOV = 2 * Math.PI / 3;

            let perspective;
            if (this.pano.offsetWidth < this.pano.offsetHeight) {
                perspective = this.pano.offsetWidth / 2 / Math.tan(this.view.FOV / 2);
            } else {
                perspective = this.pano.offsetHeight / 2 / Math.tan(this.view.FOV / 2);
            }

            this.view.ph = this.view.ph - dX / perspective;
            if (this.view.ph < -Math.PI) this.view.ph = this.view.ph + 2 * Math.PI;
            else if (this.view.ph > Math.PI) this.view.ph = this.view.ph - 2 * Math.PI;

            this.view.th = this.view.th + dY / perspective;
            if (this.view.th < -Math.PI / 2) this.view.th = -Math.PI / 2 + 0.001;
            else if (this.view.th > Math.PI / 2) this.view.th = Math.PI / 2 - 0.001;

            this.update();

            return true; // Stop propagation
        },

        /** @this {myLib.Scene.prototype} */
        onTouchEnd() {
            this.vX = this.touch.vX;
            this.vY = this.touch.vY;

            this.animationStart('inertial');
            return true;
        }
    },

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

    // Methods
    {
        /** @this {myLib.myPano.prototype} */
        update() {
            this.pano.setView(myLib.Matrix3D.MxM(
                myLib.Matrix3D.rotateY(this.view.ph),
                myLib.Matrix3D.rotateX(-this.view.th)
            ));

            this.pano.setPerspective(1 / Math.tan(this.view.FOV / 2));
            this.pano.update();

            return this;
        }
    }
);

myLib.myPano.defineClass( ///////////////////////////////////////////////////////////////////////////////////////////////////////// View ///
    /** @this {myLib.myPano.View} */
    function View(ph, th, FOV) {
        this.extends(myLib); // Call parent constructor

        // Initialization

        this.defineProperty('ph_', new myLib.Animation.Property(ph)); // Define 'ph_' property, which can be animated
        this.defineProperty('th_', new myLib.Animation.Property(th)); // Define 'th_' property, which can be animated
        this.defineProperty('FOV_', new myLib.Animation.Property(FOV)); // Define 'FOV_' property, which can be animated
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