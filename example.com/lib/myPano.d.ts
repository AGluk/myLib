declare namespace myLib {
    class myPano extends myLib.Layer { ////////////////////////////////////////////////////////////////////////////////////// myPano ///
        constructor(src: string);

        // Children
        pano: PanoGL;

        // Properties
        view: myPano.View;

        vX: number;
        vY: number;

        // Methods
        update(): this;
    } interface myPano extends Animation, Touch {
        constructor: typeof myPano;
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
            constructor: typeof View;
        }
    }
}