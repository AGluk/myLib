declare namespace myLib {
    class myPano extends myLib.PanoGL { ///////////////////////////////////////////////////////////////////////////////////// myPano ///
        constructor(src: string);

        // Properties
        view: myPano.View;

        vX: number;
        vY: number;

        // Methods
        update(): this;
    } interface myPano extends Animation, Touch {
        constructor: myPano;

        // Listeners
        onAnimationStart(name?: string): boolean | void;
        onAnimationFrame(dt?: number, f?: number, name?: string): boolean | void;
        onAnimationEnd(name?: string): void;
        onAnimationBreak(name?: string): void;

        // Listeners
        onTouchMove(dX?: number, dY?: number, kR?: number): boolean | void;
    }

    namespace myPano {
        class View extends myLib { //////////////////////////////////////////////////////////////////////////////////////// View ///
            constructor(ph: number, th: number, FOV: number);

            // Accessors
            get ph(): number;
            set ph(value: number);
            ph_: Animation.Property;

            get th(): number;
            set th(value: number);
            th_: Animation.Property;

            get FOV(): number;
            set FOV(value: number);
            FOV_: Animation.Property;
        } interface View {
            constructor: View;
        }
    }
}